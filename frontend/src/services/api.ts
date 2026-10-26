import { Building, RouteResponse, ReconstructionJob, POI } from '../types';
import { SAMPLE_BUILDING_DATA } from '../data/sampleBuildingData';
import { calculateAStarRoute } from './pathfinding';

const BACKEND_URL = 'http://localhost:8000';

export async function fetchBuilding(): Promise<Building> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/buildings/iitb_nexus_complex`, {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful fallback to rich local sample dataset
  }
  return SAMPLE_BUILDING_DATA;
}

export async function requestRoute(
  building: Building,
  startNodeId: string,
  destinationPoiOrNodeId: string,
  accessibleOnly: boolean = false,
  avoidStairs: boolean = false
): Promise<RouteResponse> {
  // Try backend first
  try {
    const res = await fetch(`${BACKEND_URL}/api/navigation/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_node_id: startNodeId,
        destination_poi_id: destinationPoiOrNodeId.startsWith('poi_') ? destinationPoiOrNodeId : undefined,
        destination_node_id: !destinationPoiOrNodeId.startsWith('poi_') ? destinationPoiOrNodeId : undefined,
        accessible_only: accessibleOnly,
        avoid_stairs: avoidStairs,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to client-side pathfinding engine
  }

  // Resolve target node ID if POI provided
  let targetNodeId = destinationPoiOrNodeId;
  if (destinationPoiOrNodeId.startsWith('poi_')) {
    const matchingNode = building.nodes.find(n => n.poi_id === destinationPoiOrNodeId);
    if (matchingNode) {
      targetNodeId = matchingNode.id;
    }
  }

  return calculateAStarRoute(building, startNodeId, targetNodeId, {
    accessibleOnly,
    avoidStairs,
  });
}

export async function sendAiQuery(
  query: string,
  building: Building,
  currentNodeId: string = 'n_f1_entrance',
  currentFloorId: number = 1
): Promise<{
  answer: string;
  intent: string;
  matched_poi_ids: string[];
  suggested_route?: RouteResponse;
  voice_spoken_text: string;
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        current_node_id: currentNodeId,
        current_floor_id: currentFloorId,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Client-side rule-based NLP engine
  }

  const q = query.toLowerCase();

  // 1. Computer Lab query
  if (q.includes('computer') || q.includes('lab 204') || q.includes('coding') || q.includes('gpu')) {
    const poi = building.pois.find(p => p.id === 'poi_computer_lab')!;
    const route = calculateAStarRoute(building, currentNodeId, 'n_f2_complab_door');
    return {
      answer: `I found **Computer Lab 204 (AI & 3D Vision)** on Level 2 (Room 204). It is equipped with high-performance GPU clusters and AR/VR equipment. Your navigation route is ready!`,
      intent: 'navigation',
      matched_poi_ids: [poi.id],
      suggested_route: route,
      voice_spoken_text: 'I found Computer Lab 204 on Level 2. Your navigation route has been calculated.',
    };
  }

  // 2. Washroom query
  if (q.includes('washroom') || q.includes('restroom') || q.includes('toilet') || q.includes('water')) {
    const washrooms = building.pois.filter(p => p.category === 'Washroom');
    const target = currentFloorId === 2 
      ? washrooms.find(w => w.floor_id === 2) || washrooms[0] 
      : washrooms.find(w => w.floor_id === 1) || washrooms[0];
    const targetNode = building.nodes.find(n => n.poi_id === target.id)!;
    const route = calculateAStarRoute(building, currentNodeId, targetNode.id);
    return {
      answer: `Found ${washrooms.length} restrooms in the complex. The closest one is **${target.name}** on ${target.floor_id === 1 ? 'Ground Floor' : 'Level 2'}. It is fully accessible.`,
      intent: 'navigation',
      matched_poi_ids: [target.id],
      suggested_route: route,
      voice_spoken_text: `The closest restroom is ${target.name} on ${target.floor_id === 1 ? 'the ground floor' : 'level 2'}.`,
    };
  }

  // 3. Reception query
  if (q.includes('reception') || q.includes('entry') || q.includes('entrance') || q.includes('help desk') || q.includes('front desk')) {
    const poi = building.pois.find(p => p.id === 'poi_reception')!;
    const route = calculateAStarRoute(building, currentNodeId, 'n_f1_reception');
    return {
      answer: `**Main Reception & Visitor Hub** is on the Ground Floor directly across the entrance foyer. Techfest badge registration and orientation are available here.`,
      intent: 'navigation',
      matched_poi_ids: [poi.id],
      suggested_route: route,
      voice_spoken_text: 'Reception is located directly in the ground floor lobby.',
    };
  }

  // 4. Robotics Lab query
  if (q.includes('robotics') || q.includes('drone') || q.includes('hardware') || q.includes('slam')) {
    const poi = building.pois.find(p => p.id === 'poi_robotics_lab')!;
    const route = calculateAStarRoute(building, currentNodeId, 'n_f1_robotics_door');
    return {
      answer: `**Robotics & Autonomous Systems Lab** (Room 104) is on Ground Floor in the West Wing. It houses mobile robotics arenas and drone flight test cages.`,
      intent: 'navigation',
      matched_poi_ids: [poi.id],
      suggested_route: route,
      voice_spoken_text: 'Robotics lab is in the West Wing of the ground floor.',
    };
  }

  // 5. Accessible route / elevator query
  if (q.includes('accessible') || q.includes('wheelchair') || q.includes('elevator') || q.includes('lift') || q.includes('ramp')) {
    const poi = building.pois.find(p => p.id === 'poi_elevator')!;
    const route = calculateAStarRoute(building, currentNodeId, 'n_f1_elevator', { accessibleOnly: true });
    return {
      answer: `The **Central Elevator** provides barrier-free step-free transit between Ground Floor and Level 2 with audio indicators and Braille controls. Wheelchair-accessible routing is actively prioritized.`,
      intent: 'accessibility',
      matched_poi_ids: [poi.id],
      suggested_route: route,
      voice_spoken_text: 'Accessible routes prioritize the central elevator for step-free mobility.',
    };
  }

  // 6. Food / Cafe query
  if (q.includes('cafe') || q.includes('canteen') || q.includes('coffee') || q.includes('food') || q.includes('snack')) {
    const poi = building.pois.find(p => p.id === 'poi_cafe')!;
    const route = calculateAStarRoute(building, currentNodeId, 'n_f1_cafe_door');
    return {
      answer: `**Techfest Student Cafe & Lounge** is on Ground Floor (East Wing). Open until 23:00 serving coffee, sandwiches, and refreshments.`,
      intent: 'navigation',
      matched_poi_ids: [poi.id],
      suggested_route: route,
      voice_spoken_text: 'Techfest cafe is in the East Wing on the ground floor.',
    };
  }

  // 7. General search fallback
  const matched = building.pois.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  );

  if (matched.length > 0) {
    const poi = matched[0];
    const node = building.nodes.find(n => n.poi_id === poi.id) || building.nodes[0];
    const route = calculateAStarRoute(building, currentNodeId, node.id);
    return {
      answer: `I found **${poi.name}** (${poi.category}, ${poi.floor_id === 1 ? 'Ground Floor' : 'Level 2'}). Status: ${poi.current_status}. Opening hours: ${poi.opening_hours}.`,
      intent: 'poi_search',
      matched_poi_ids: matched.map(m => m.id),
      suggested_route: route,
      voice_spoken_text: `Found ${poi.name}. Route has been generated.`,
    };
  }

  return {
    answer: `I couldn't locate an exact match for "${query}". You can ask about Computer Lab 204, Robotics Lab, Aryabhata Auditorium, Restrooms, Cafe, Elevator, or ask for an accessible route.`,
    intent: 'general',
    matched_poi_ids: [],
    voice_spoken_text: `I couldn't find an exact match for that location. Please try searching for a lab, auditorium, or restroom.`,
  };
}
