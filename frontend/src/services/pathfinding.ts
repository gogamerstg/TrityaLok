import { Building, Coordinate3D, NavigationNode, NavigationEdge, RouteResponse, TurnInstruction } from '../types';

interface PriorityQueueItem {
  nodeId: string;
  priority: number;
}

class SimplePriorityQueue {
  private items: PriorityQueueItem[] = [];

  push(nodeId: string, priority: number) {
    this.items.push({ nodeId, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  pop(): string | undefined {
    return this.items.shift()?.nodeId;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

function euclideanDistance(a: Coordinate3D, b: Coordinate3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function calculateAStarRoute(
  building: Building,
  startNodeId: string,
  targetNodeId: string,
  options: {
    accessibleOnly?: boolean;
    avoidStairs?: boolean;
    activeObstacleIds?: string[];
  } = {}
): RouteResponse {
  const { accessibleOnly = false, avoidStairs = false } = options;
  const nodeMap = new Map<string, NavigationNode>(building.nodes.map(n => [n.id, n]));

  if (!nodeMap.has(startNodeId)) {
    return {
      success: false,
      message: `Start node '${startNodeId}' not found.`,
      path_node_ids: [],
      path_coordinates: [],
      total_distance_meters: 0,
      estimated_time_seconds: 0,
      floors_traversed: [],
      requires_transit: false,
      is_accessible: true,
      turn_by_turn: [],
      alternative_available: false,
      rerouted_around_obstacle: false,
    };
  }

  if (!nodeMap.has(targetNodeId)) {
    return {
      success: false,
      message: `Destination node '${targetNodeId}' not found.`,
      path_node_ids: [],
      path_coordinates: [],
      total_distance_meters: 0,
      estimated_time_seconds: 0,
      floors_traversed: [],
      requires_transit: false,
      is_accessible: true,
      turn_by_turn: [],
      alternative_available: false,
      rerouted_around_obstacle: false,
    };
  }

  // Build Adjacency list
  interface NeighborEdge {
    targetId: string;
    edge: NavigationEdge;
  }
  const adjacency = new Map<string, NeighborEdge[]>();
  for (const node of building.nodes) {
    adjacency.set(node.id, []);
  }

  // Active obstacle edges
  const blockedEdgeIds = new Set<string>();
  for (const obs of building.obstacles) {
    if (obs.active && obs.edge_id) {
      blockedEdgeIds.add(obs.edge_id);
    }
  }

  for (const edge of building.edges) {
    if (edge.is_blocked || blockedEdgeIds.has(edge.id)) {
      continue;
    }
    if (accessibleOnly && !edge.is_accessible) {
      continue;
    }
    if (avoidStairs && edge.source_node_id.includes('stairs') && edge.target_node_id.includes('stairs')) {
      continue;
    }

    // Add source -> target
    adjacency.get(edge.source_node_id)?.push({
      targetId: edge.target_node_id,
      edge,
    });

    // Add target -> source if bidirectional
    if (edge.direction === 'both') {
      adjacency.get(edge.target_node_id)?.push({
        targetId: edge.source_node_id,
        edge,
      });
    }
  }

  const startNode = nodeMap.get(startNodeId)!;
  const targetNode = nodeMap.get(targetNodeId)!;

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { nodeId: string; edge: NavigationEdge }>();

  for (const node of building.nodes) {
    gScore.set(node.id, Infinity);
    fScore.set(node.id, Infinity);
  }

  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, euclideanDistance(startNode.coordinates, targetNode.coordinates));

  const openSet = new SimplePriorityQueue();
  openSet.push(startNodeId, fScore.get(startNodeId)!);

  const closedSet = new Set<string>();

  while (!openSet.isEmpty()) {
    const currentId = openSet.pop()!;
    if (currentId === targetNodeId) {
      // Reconstruct Path
      const pathIds: string[] = [currentId];
      let curr = currentId;
      let usedElevator = false;
      let usedStairs = false;
      let obstacleAvoided = false;

      while (cameFrom.has(curr)) {
        const prev = cameFrom.get(curr)!;
        pathIds.unshift(prev.nodeId);
        if (prev.edge.id.includes('transit_elevator')) usedElevator = true;
        if (prev.edge.id.includes('transit_stairs')) usedStairs = true;
        curr = prev.nodeId;
      }

      // Check if any active obstacle caused rerouting
      for (const obs of building.obstacles) {
        if (obs.active && obs.edge_id) {
          obstacleAvoided = true;
        }
      }

      const pathCoords: Coordinate3D[] = pathIds.map(id => nodeMap.get(id)!.coordinates);
      const totalDistance = Math.round(gScore.get(targetNodeId)! * 10) / 10;
      const estimatedSeconds = Math.round((totalDistance / 1.2) * 10) / 10; // average 1.2 m/s indoor walking

      const floorsTraversed = Array.from(new Set(pathIds.map(id => nodeMap.get(id)!.floor_id)));
      const requiresTransit = floorsTraversed.length > 1;

      // Generate turn by turn
      const turnByTurn: TurnInstruction[] = [];
      for (let i = 0; i < pathIds.length; i++) {
        const node = nodeMap.get(pathIds[i])!;
        let instruction = `Proceed to ${node.name}`;
        let turnType: TurnInstruction['turn_type'] = 'straight';
        let stepDist = 0;

        if (i === 0) {
          instruction = `Start at ${node.name}`;
          turnType = 'straight';
        } else if (i === pathIds.length - 1) {
          stepDist = euclideanDistance(pathCoords[i - 1], pathCoords[i]);
          instruction = `Arrive at destination: ${node.name}`;
          turnType = 'destination';
        } else {
          const prev = pathCoords[i - 1];
          const currC = pathCoords[i];
          const next = pathCoords[i + 1];
          stepDist = euclideanDistance(prev, currC);

          // Check if transit
          if (currC.y !== next.y) {
            if (node.is_transit && node.transit_type === 'elevator') {
              instruction = next.y > currC.y ? 'Take Central Elevator up to Level 2' : 'Take Elevator down to Level 1';
              turnType = next.y > currC.y ? 'elevator_up' : 'elevator_down';
            } else {
              instruction = next.y > currC.y ? 'Walk up the Architectural Staircase to Level 2' : 'Walk down the stairs to Ground Floor';
              turnType = next.y > currC.y ? 'stairs_up' : 'stairs_down';
            }
          } else {
            // Calculate 2D angle in XZ plane
            const v1x = currC.x - prev.x;
            const v1z = currC.z - prev.z;
            const v2x = next.x - currC.x;
            const v2z = next.z - currC.z;
            const cross = v1x * v2z - v1z * v2x;

            if (cross > 5) {
              instruction = `Turn right at ${node.name}`;
              turnType = 'right';
            } else if (cross < -5) {
              instruction = `Turn left at ${node.name}`;
              turnType = 'left';
            } else {
              instruction = `Continue straight past ${node.name}`;
              turnType = 'straight';
            }
          }
        }

        turnByTurn.push({
          step_number: i + 1,
          instruction,
          distance_meters: Math.round(stepDist * 10) / 10,
          turn_type: turnType,
          node_id: node.id,
          coordinates: node.coordinates,
          floor_id: node.floor_id,
        });
      }

      return {
        success: true,
        message: obstacleAvoided
          ? `Route calculated successfully! Rerouted around active obstacle.`
          : `Fastest obstacle-free route calculated.`,
        path_node_ids: pathIds,
        path_coordinates: pathCoords,
        total_distance_meters: totalDistance,
        estimated_time_seconds: estimatedSeconds,
        floors_traversed: floorsTraversed,
        requires_transit: requiresTransit,
        transit_type_used: usedElevator ? 'elevator' : usedStairs ? 'stairs' : undefined,
        is_accessible: !usedStairs,
        turn_by_turn: turnByTurn,
        alternative_available: true,
        rerouted_around_obstacle: obstacleAvoided,
        obstacle_avoided_id: obstacleAvoided ? building.obstacles.find(o => o.active)?.id : undefined,
      };
    }

    closedSet.add(currentId);

    const neighbors = adjacency.get(currentId) || [];
    for (const { targetId: neighborId, edge } of neighbors) {
      if (closedSet.has(neighborId)) continue;

      const neighborNode = nodeMap.get(neighborId)!;
      const stepCost = edge.distance * (edge.traversal_cost_multiplier || 1.0);
      const tentativeGScore = gScore.get(currentId)! + stepCost;

      if (tentativeGScore < gScore.get(neighborId)!) {
        cameFrom.set(neighborId, { nodeId: currentId, edge });
        gScore.set(neighborId, tentativeGScore);
        const h = euclideanDistance(neighborNode.coordinates, targetNode.coordinates);
        const f = tentativeGScore + h;
        fScore.set(neighborId, f);
        openSet.push(neighborId, f);
      }
    }
  }

  return {
    success: false,
    message: "No walkable route found between the selected locations with current constraints and active obstacles.",
    path_node_ids: [],
    path_coordinates: [],
    total_distance_meters: 0,
    estimated_time_seconds: 0,
    floors_traversed: [],
    requires_transit: false,
    is_accessible: false,
    turn_by_turn: [],
    alternative_available: false,
    rerouted_around_obstacle: false,
  };
}
