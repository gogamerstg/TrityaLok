"""
A* Pathfinding Service with Dynamic Obstacle Avoidance and Multi-Floor Routing
For NEXUS SPACE (Techfest IIT Bombay - Namma Space)
"""

import math
import heapq
from typing import Dict, List, Optional, Tuple, Set
from models.schemas import (
    Building,
    Coordinate3D,
    NavigationNode,
    NavigationEdge,
    Obstacle,
    RouteResponse,
    TurnInstruction,
)


def euclidean_distance(a: Coordinate3D, b: Coordinate3D) -> float:
    return math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)


class AStarRouter:
    def __init__(self, building: Building):
        self.building = building
        self.node_map: Dict[str, NavigationNode] = {n.id: n for n in building.nodes}

    def compute_route(
        self,
        start_node_id: str,
        destination_node_id: str,
        accessible_only: bool = False,
        avoid_stairs: bool = False,
    ) -> RouteResponse:
        if start_node_id not in self.node_map:
            return RouteResponse(
                success=False,
                message=f"Start node '{start_node_id}' not found in building graph.",
            )

        if destination_node_id not in self.node_map:
            return RouteResponse(
                success=False,
                message=f"Destination node '{destination_node_id}' not found in building graph.",
            )

        # Active obstacle blocked edges
        blocked_edge_ids: Set[str] = {
            obs.edge_id for obs in self.building.obstacles if obs.active and obs.edge_id
        }

        # Build adjacency graph
        adjacency: Dict[str, List[Tuple[str, NavigationEdge]]] = {
            n.id: [] for n in self.building.nodes
        }

        for edge in self.building.edges:
            if edge.is_blocked or edge.id in blocked_edge_ids:
                continue
            if accessible_only and not edge.is_accessible:
                continue
            if avoid_stairs and "stairs" in edge.id:
                continue

            adjacency[edge.source_node_id].append((edge.target_node_id, edge))
            if edge.direction == "both":
                adjacency[edge.target_node_id].append((edge.source_node_id, edge))

        # A* priority queue
        start_node = self.node_map[start_node_id]
        target_node = self.node_map[destination_node_id]

        g_score: Dict[str, float] = {n.id: float("inf") for n in self.building.nodes}
        f_score: Dict[str, float] = {n.id: float("inf") for n in self.building.nodes}
        came_from: Dict[str, Tuple[str, NavigationEdge]] = {}

        g_score[start_node_id] = 0.0
        f_score[start_node_id] = euclidean_distance(start_node.coordinates, target_node.coordinates)

        open_set: List[Tuple[float, str]] = []
        heapq.heappush(open_set, (f_score[start_node_id], start_node_id))
        closed_set: Set[str] = set()

        while open_set:
            _, current_id = heapq.heappop(open_set)

            if current_id == destination_node_id:
                # Reconstruct path
                path_node_ids = [current_id]
                curr = current_id
                used_elevator = False
                used_stairs = False
                rerouted_obstacle = len(blocked_edge_ids) > 0

                while curr in came_from:
                    prev_id, edge = came_from[curr]
                    path_node_ids.insert(0, prev_id)
                    if "elevator" in edge.id:
                        used_elevator = True
                    if "stairs" in edge.id:
                        used_stairs = True
                    curr = prev_id

                path_coords = [self.node_map[nid].coordinates for nid in path_node_ids]
                total_distance = round(g_score[destination_node_id], 1)
                est_seconds = round(total_distance / 1.2, 1)

                floors_traversed = list(
                    dict.fromkeys([self.node_map[nid].floor_id for nid in path_node_ids])
                )
                requires_transit = len(floors_traversed) > 1

                # Generate turn by turn instructions
                turn_by_turn: List[TurnInstruction] = []
                for i in range(len(path_node_ids)):
                    node = self.node_map[path_node_ids[i]]
                    instr = f"Proceed to {node.name}"
                    ttype = "straight"
                    step_dist = 0.0

                    if i == 0:
                        instr = f"Start at {node.name}"
                    elif i == len(path_node_ids) - 1:
                        step_dist = round(euclidean_distance(path_coords[i - 1], path_coords[i]), 1)
                        instr = f"Arrive at destination: {node.name}"
                        ttype = "destination"
                    else:
                        prev_c = path_coords[i - 1]
                        curr_c = path_coords[i]
                        next_c = path_coords[i + 1]
                        step_dist = round(euclidean_distance(prev_c, curr_c), 1)

                        if curr_c.y != next_c.y:
                            if node.is_transit and node.transit_type == "elevator":
                                instr = (
                                    "Take Central Elevator up to Level 2"
                                    if next_c.y > curr_c.y
                                    else "Take Elevator down to Level 1"
                                )
                                ttype = "elevator_up" if next_c.y > curr_c.y else "elevator_down"
                            else:
                                instr = (
                                    "Walk up Architectural Staircase to Level 2"
                                    if next_c.y > curr_c.y
                                    else "Walk down stairs to Ground Floor"
                                )
                                ttype = "stairs_up" if next_c.y > curr_c.y else "stairs_down"
                        else:
                            # 2D cross product in XZ plane
                            v1x, v1z = curr_c.x - prev_c.x, curr_c.z - prev_c.z
                            v2x, v2z = next_c.x - curr_c.x, next_c.z - curr_c.z
                            cross = v1x * v2z - v1z * v2x

                            if cross > 4:
                                instr = f"Turn right at {node.name}"
                                ttype = "right"
                            elif cross < -4:
                                instr = f"Turn left at {node.name}"
                                ttype = "left"
                            else:
                                instr = f"Continue straight past {node.name}"
                                ttype = "straight"

                    turn_by_turn.append(
                        TurnInstruction(
                            step_number=i + 1,
                            instruction=instr,
                            distance_meters=step_dist,
                            turn_type=ttype,
                            node_id=node.id,
                            coordinates=node.coordinates,
                            floor_id=node.floor_id,
                        )
                    )

                return RouteResponse(
                    success=True,
                    message="Route calculated successfully."
                    if not rerouted_obstacle
                    else "Route rerouted successfully around active corridor obstacles.",
                    path_node_ids=path_node_ids,
                    path_coordinates=path_coords,
                    total_distance_meters=total_distance,
                    estimated_time_seconds=est_seconds,
                    floors_traversed=floors_traversed,
                    requires_transit=requires_transit,
                    transit_type_used="elevator"
                    if used_elevator
                    else ("stairs" if used_stairs else None),
                    is_accessible=not used_stairs,
                    turn_by_turn=turn_by_turn,
                    alternative_available=True,
                    rerouted_around_obstacle=rerouted_obstacle,
                )

            closed_set.add(current_id)

            for neighbor_id, edge in adjacency.get(current_id, []):
                if neighbor_id in closed_set:
                    continue

                neighbor_node = self.node_map[neighbor_id]
                step_cost = edge.distance * edge.traversal_cost_multiplier
                tentative_g = g_score[current_id] + step_cost

                if tentative_g < g_score[neighbor_id]:
                    came_from[neighbor_id] = (current_id, edge)
                    g_score[neighbor_id] = tentative_g
                    h = euclidean_distance(neighbor_node.coordinates, target_node.coordinates)
                    f_score[neighbor_id] = tentative_g + h
                    heapq.heappush(open_set, (f_score[neighbor_id], neighbor_id))

        return RouteResponse(
            success=False,
            message="No walkable path found between the selected nodes with current constraints.",
        )
