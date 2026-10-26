# NEXUS SPACE: AI-Powered Indoor Digital Twin & Obstacle-Aware Smart Navigation Platform

**Competition:** Namma Space — Techfest, IIT Bombay  
**Target Submission:** Round 1 Abstract & Working 3D Web Viewer  
**Project Name:** NEXUS SPACE  
**Tagline:** *Scan. Understand. Explore. Navigate.*  

---

## 1. Executive Summary & Problem Statement

Modern indoor facilities—academic campuses, complex hospital wings, multi-tier research centers, and convention arenas—pose severe navigation and spatial orientation challenges. Traditional 2D indoor maps lack depth perception, fail to reflect multi-floor structural realities, and cannot dynamically adapt to temporary physical obstructions such as ongoing maintenance, spill hazards, or temporary structural scaffolding.

**NEXUS SPACE** bridges this critical gap by transforming common handheld smartphone video and photograph captures into photorealistic, metric-accurate, interactive 3D digital twins. Engineered for the **Namma Space** competition at **Techfest, IIT Bombay**, NEXUS SPACE integrates modular photogrammetric 3D reconstruction (Structure-from-Motion and 3D Gaussian Splatting), a high-performance WebGL 3D roaming viewport, full Point of Interest (POI) semantic management, an obstacle-aware A* graph pathfinding engine, and a context-grounded AI spatial assistant ("NEXUS").

---

## 2. System Architecture & Methodology

The platform operates across three tightly integrated tiers:

```
[ Smartphone 4K Video / Photos ]
             │
             ▼
[ 9-Stage Modular Reconstruction Pipeline ]
  ├─ Image Ingestion & Keyframe Quality Check
  ├─ Camera Intrinsics & Optical Distortion Calibration
  ├─ COLMAP Structure-from-Motion (Camera Poses)
  ├─ SIFT/Dense Feature Correspondence Matching
  ├─ Open3D Dense Point Cloud & Screened Poisson Meshing
  ├─ 3D Gaussian Splatting Optimization
  └─ Draco-Compressed glTF/GLB Asset Generation
             │
             ▼
[ NEXUS Spatial Core & NavMesh Alignment ]
  ├─ Metric Coordinate Normalization (Y-Up, East-West, North-South)
  ├─ NavMesh Topological Node & Directed Edge Extraction
  ├─ Dynamic Hazard Detection & Obstacle Boundary Boxes
  └─ Multi-Floor Vertical Transit Nodes (Elevator & Staircase)
             │
             ▼
[ Web 3D Command Center & Client Viewer ]
  ├─ Three.js / React Three Fiber / Drei Interactive Viewport
  ├─ 3D Roaming / First-Person (WASD + Mouse Look) / Top-Down Floor Plan
  ├─ Obstacle-Aware A* Pathfinding with Dynamic Rerouting
  ├─ Simulated AR Navigation HUD with Compass Orientation
  └─ Grounded AI Spatial Assistant ("NEXUS")
```

---

## 3. Key Technical Innovations

### 3.1. Accessible Multi-Floor Graph Navigation
Walkable corridors are structured into a 3D directed graph $G = (V, E)$, where each vertex $v \in V$ represents a physical waypoint with $(x, y, z)$ coordinates and floor identifier, and each edge $e = (u, v) \in E$ encapsulates metric Euclidean distance, directional constraints, wheelchair accessibility flags, and dynamic blockage states. Vertical transits between Ground Floor ($y = 0.0\,\text{m}$) and Level 2 ($y = 4.0\,\text{m}$) are explicitly modeled via elevator transit edges (accessible) and staircase transit edges.

### 3.2. Real-Time Dynamic Obstacle Rerouting
When a physical barrier or maintenance hazard is reported, the corresponding graph edge is deactivated in real time. The $A^*$ routing algorithm immediately recalculates the optimal alternative trajectory without requiring full model recomputation, rerouting occupants safely through open corridors and central atria.

### 3.3. Grounded AI Spatial Intelligence ("NEXUS")
Instead of generating untethered text, the built-in conversational assistant queries the actual spatial index and navigation graph. Inquiries like *"Where is Computer Lab 204?"* or *"Find the closest accessible restroom"* automatically yield verified facility locations and directly trigger glowing 3D navigation paths on the user's screen.

### 3.4. Simulated AR-Ready HUD
Prepares the platform for mobile WebXR deployment. Occupants view a real-time navigation overlay featuring directional turning arrows, distance countdowns, and compass heading indicators.

---

## 4. Compliance with Techfest Rounds

| Round | Focus | NEXUS SPACE Deliverables | Status |
|---|---|---|---|
| **Round 1** | 3D Reconstruction + Roaming | Abstract, interactive 3D WebGL viewer, procedural multi-floor venue model, code repository, 3–5 min video demo | **Complete** |
| **Round 2** | POI Search + Obstacle A* | 13 searchable POIs, dynamic barrier simulation, instant A* rerouting, turn-by-turn guidance | **Complete** |
| **Round 3** | Live Capture at IIT Bombay | On-site smartphone capture workflow, modular reconstruction pipeline telemetry, live AR navigation | **Prepared** |

---

## 5. Conclusion

NEXUS SPACE provides a competition-ready, mathematically grounded, and visually stunning solution for next-generation indoor digital twins. By combining accessible smartphone photogrammetry with real-time obstacle avoidance, it transforms ordinary mobile captures into smart, navigable spatial twins.
