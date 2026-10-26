# NEXUS SPACE - REST & WebSocket API Reference

**Base URL:** `http://localhost:8000`

---

## 1. System Health

### `GET /api/health`
Returns runtime health status, active venue name, and count of loaded POIs and navigation nodes.

**Response:**
```json
{
  "status": "healthy",
  "service": "NEXUS SPACE Digital Twin Engine",
  "version": "1.0.0",
  "venue": "NEXUS Innovation Complex - IIT Bombay",
  "pois_loaded": 13,
  "nodes_loaded": 35
}
```

---

## 2. Building & POI Management

### `GET /api/buildings`
Returns list of all registered 3D buildings.

### `GET /api/buildings/{building_id}`
Returns full building specification, floor boundaries, room shapes, POIs, nodes, edges, and obstacles.

### `GET /api/buildings/{building_id}/pois`
Returns all indexed POIs with optional query filters:
- `floor_id`: integer (`1` or `2`)
- `category`: string (e.g. `Laboratory`, `Washroom`, `Classroom`)

---

## 3. Indoor Pathfinding

### `POST /api/navigation/route`
Calculates the optimal obstacle-aware route using A*.

**Request:**
```json
{
  "start_node_id": "n_f1_entrance",
  "destination_poi_id": "poi_computer_lab",
  "accessible_only": false,
  "avoid_stairs": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Fastest obstacle-free route calculated.",
  "path_node_ids": ["n_f1_entrance", "n_f1_vestibule", "n_f1_reception", "n_f1_lobby_cross", "n_f1_elevator", "n_f2_elevator", "n_f2_lobby_cross", "n_f2_east_hub", "n_f2_east_corridor_mid", "n_f2_complab_door"],
  "total_distance_meters": 41.5,
  "estimated_time_seconds": 34.6,
  "floors_traversed": [1, 2],
  "requires_transit": true,
  "transit_type_used": "elevator",
  "is_accessible": true,
  "turn_by_turn": [
    {
      "step_number": 1,
      "instruction": "Start at Main Entrance Door",
      "distance_meters": 0.0,
      "turn_type": "straight",
      "node_id": "n_f1_entrance",
      "floor_id": 1
    }
  ]
}
```

### `POST /api/navigation/toggle-obstacle`
Toggles active state of a maintenance obstacle to test dynamic real-time rerouting.

**Request:**
```json
{
  "obstacle_id": "obs_f1_spill_east"
}
```

---

## 4. AI Spatial Assistant

### `POST /api/ai/query`
Natural language query parser grounded in the building knowledge graph.

**Request:**
```json
{
  "query": "Where is the computer lab?",
  "current_node_id": "n_f1_entrance",
  "current_floor_id": 1
}
```

**Response:**
```json
{
  "answer": "I found **Computer Lab 204 (AI & 3D Vision)** on Level 2 (Room 204)...",
  "intent": "navigation",
  "matched_poi_ids": ["poi_computer_lab"],
  "suggested_route": { ... },
  "voice_spoken_text": "I found Computer Lab 204 on Level 2. Your navigation route is ready."
}
```

---

## 5. 3D Reconstruction WebSocket

### `WebSocket /api/reconstruction/ws/{job_id}`
Streams live 9-stage reconstruction progress events (pose estimation, point-cloud counts, mesh polygon updates).
