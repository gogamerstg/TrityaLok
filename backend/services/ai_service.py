"""
AI Spatial Intelligence Assistant for NEXUS SPACE
Natural Language Querying Grounded in 3D Building Graph
(Techfest IIT Bombay - Namma Space)
"""

from typing import Optional, List
from models.schemas import Building, AIQueryResponse, RouteResponse
from services.pathfinding_service import AStarRouter


class AISpatialAssistant:
    def __init__(self, building: Building):
        self.building = building
        self.router = AStarRouter(building)

    def process_query(
        self,
        query: str,
        current_node_id: Optional[str] = "n_f1_entrance",
        current_floor_id: Optional[int] = 1,
    ) -> AIQueryResponse:
        q = query.lower()
        start_id = current_node_id or "n_f1_entrance"

        # 1. Computer Lab query
        if any(term in q for term in ["computer", "lab 204", "pc lab", "coding", "gpu", "vision"]):
            poi = next((p for p in self.building.pois if p.id == "poi_computer_lab"), None)
            route = self.router.compute_route(start_id, "n_f2_complab_door")
            return AIQueryResponse(
                answer="I found **Computer Lab 204 (AI & 3D Vision)** on Level 2 (Room 204). It houses high-performance GPU clusters and AR/VR spatial workstations. Your navigation route is ready!",
                intent="navigation",
                matched_poi_ids=[poi.id] if poi else [],
                suggested_route=route,
                voice_spoken_text="I found Computer Lab 204 on Level 2. Your navigation route is ready.",
            )

        # 2. Washroom query
        if any(term in q for term in ["washroom", "restroom", "toilet", "bathroom", "water"]):
            washrooms = [p for p in self.building.pois if p.category == "Washroom"]
            target = next((w for w in washrooms if w.floor_id == current_floor_id), washrooms[0])
            target_node = next((n for n in self.building.nodes if n.poi_id == target.id), self.building.nodes[0])
            route = self.router.compute_route(start_id, target_node.id)
            return AIQueryResponse(
                answer=f"Found {len(washrooms)} restrooms in the complex. The closest one is **{target.name}** on {'Ground Floor' if target.floor_id == 1 else 'Level 2'}. It is fully wheelchair accessible.",
                intent="navigation",
                matched_poi_ids=[target.id],
                suggested_route=route,
                voice_spoken_text=f"The closest restroom is {target.name} on {'ground floor' if target.floor_id == 1 else 'level 2'}.",
            )

        # 3. Reception query
        if any(term in q for term in ["reception", "entry", "entrance", "help desk", "front desk", "lobby"]):
            poi = next((p for p in self.building.pois if p.id == "poi_reception"), None)
            route = self.router.compute_route(start_id, "n_f1_reception")
            return AIQueryResponse(
                answer="**Main Reception & Visitor Hub** is situated on the Ground Floor directly across the entrance foyer. Techfest badge registration and orientation kiosks are active.",
                intent="navigation",
                matched_poi_ids=[poi.id] if poi else [],
                suggested_route=route,
                voice_spoken_text="Reception is located in the ground floor central foyer.",
            )

        # 4. Robotics Lab query
        if any(term in q for term in ["robotics", "drone", "hardware", "slam", "autonomous"]):
            poi = next((p for p in self.building.pois if p.id == "poi_robotics_lab"), None)
            route = self.router.compute_route(start_id, "n_f1_robotics_door")
            return AIQueryResponse(
                answer="**Robotics & Autonomous Systems Lab** (Room 104) is located on Ground Floor in the West Wing. It includes test arenas for quadrotors and mobile robotics.",
                intent="navigation",
                matched_poi_ids=[poi.id] if poi else [],
                suggested_route=route,
                voice_spoken_text="Robotics lab is in the west wing of the ground floor.",
            )

        # 5. Elevator / Accessibility query
        if any(term in q for term in ["elevator", "lift", "accessible", "wheelchair", "step-free", "ramp"]):
            poi = next((p for p in self.building.pois if p.id == "poi_elevator"), None)
            route = self.router.compute_route(start_id, "n_f1_elevator", accessible_only=True)
            return AIQueryResponse(
                answer="The **Central Elevator** provides barrier-free step-free transit between Ground Floor and Level 2 with audio floor announcements and Braille controls. Wheelchair accessibility is prioritized.",
                intent="accessibility",
                matched_poi_ids=[poi.id] if poi else [],
                suggested_route=route,
                voice_spoken_text="Accessible routes prioritize the central elevator for step-free mobility.",
            )

        # 6. Cafe query
        if any(term in q for term in ["cafe", "canteen", "coffee", "food", "snack"]):
            poi = next((p for p in self.building.pois if p.id == "poi_cafe"), None)
            route = self.router.compute_route(start_id, "n_f1_cafe_door")
            return AIQueryResponse(
                answer="**Techfest Student Cafe & Lounge** is on Ground Floor (East Wing). Open until 23:00 serving coffee, snacks, sandwiches, and collaborative seating.",
                intent="navigation",
                matched_poi_ids=[poi.id] if poi else [],
                suggested_route=route,
                voice_spoken_text="Techfest cafe is in the east wing on ground floor.",
            )

        # 7. Fallback search
        matched = [
            p for p in self.building.pois
            if q in p.name.lower() or q in p.description.lower() or any(q in t for t in p.tags)
        ]

        if matched:
            poi = matched[0]
            target_node = next((n for n in self.building.nodes if n.poi_id == poi.id), self.building.nodes[0])
            route = self.router.compute_route(start_id, target_node.id)
            return AIQueryResponse(
                answer=f"I located **{poi.name}** ({poi.category}, {'Ground Floor' if poi.floor_id == 1 else 'Level 2'}). Status: {poi.current_status}. Opening hours: {poi.opening_hours}.",
                intent="poi_search",
                matched_poi_ids=[m.id for m in matched],
                suggested_route=route,
                voice_spoken_text=f"Found {poi.name}. Route has been generated.",
            )

        return AIQueryResponse(
            answer=f"I couldn't locate an exact match for '{query}'. You can ask me to navigate to Computer Lab 204, Robotics Lab, Aryabhata Auditorium, Restrooms, or ask for an accessible route.",
            intent="general",
            matched_poi_ids=[],
            voice_spoken_text="I could not find a matching facility. Please ask for a lab or room.",
        )
