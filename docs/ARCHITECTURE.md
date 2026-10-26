# NEXUS SPACE - System Architecture & Technical Specifications

**Techfest, IIT Bombay — Namma Space 2026**

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER (Browser)                            |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | React 19 + Vite    |  | Three.js / R3F       |  | Zustand Global State      |  |
|  | Tailwind CSS       |  | Drei 3D Controls     |  | - Active Building & Floor |  |
|  | Framer Motion      |  | NavPath Spline Mesh  |  | - A* Route & Turn-by-Turn |  |
|  | Lucide Icons       |  | First-Person Cam     |  | - Dynamic Obstacles State |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+------------------------------------------┬----------------------------------------+
                                           │ HTTP REST / WebSockets
                                           ▼
+-----------------------------------------------------------------------------------+
|                              BACKEND LAYER (FastAPI)                              |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | REST Routing Service   |  | Pathfinding Service    |  | AI Spatial Engine   |  |
|  | - /api/buildings       |  | - A* Graph Search      |  | - Grounded NLP      |  |
|  | - /api/pois            |  | - Dynamic Rerouting    |  | - Voice Synthesis   |  |
|  | - /api/navigation      |  | - Turn-by-turn angles  |  | - Intent Classifier |  |
|  +------------------------+  +------------------------+  +---------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Reconstruction Service (Bridge to COLMAP / Open3D / 3D Gaussian Splatting) |  |
|  | - Keyframe Extractor & Validator  - Pose Estimation  - Draco glTF Exporter   |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------┬----------------------------------------+
                                           │
                                           ▼
+-----------------------------------------------------------------------------------+
|                                 DATA & ASSETS LAYER                               |
|                                                                                   |
|  - iitb_building.json (IIT Bombay Multi-Floor Complex Blueprint & Nodes)          |
|  - 3D Geometry / Materials / Meshes                                               |
|  - Waypoints, Transit Edges, Accessibility Constraints, Active Hazards            |
+-----------------------------------------------------------------------------------+
```

---

## 2. Coordinate System Specification

To eliminate orientation ambiguities between computer vision Structure-from-Motion (SfM) coordinates and Three.js 3D world space:

- **Reference Standard:** Right-handed Cartesian Coordinate Frame, **Y-Up**.
- **X-Axis:** Lateral dimension (East $\leftrightarrow$ West), range $[-32.0\,\text{m}, +32.0\,\text{m}]$.
- **Y-Axis:** Elevation (Height above ground).
  - Ground Floor (Level 1): $Y = 0.0\,\text{m}$.
  - Second Floor (Level 2): $Y = 4.0\,\text{m}$.
- **Z-Axis:** Depth dimension (North $\leftrightarrow$ South), range $[-26.0\,\text{m}, +26.0\,\text{m}]$.
  - Main Entrance: $Z = +24.0\,\text{m}$.
  - North Emergency Exit: $Z = -22.0\,\text{m}$.

---

## 3. Pathfinding Algorithm Details (A*)

The pathfinding module uses a modified $A^*$ search algorithm with:
- **Heuristic Function:** 3D Euclidean distance $h(n) = \sqrt{(x_n - x_{\text{goal}})^2 + (y_n - y_{\text{goal}})^2 + (z_n - z_{\text{goal}})^2}$.
- **Edge Weighting:** $g(n) = g(p) + d(p, n) \times \mu_e$, where $\mu_e$ is the traversal multiplier (e.g., $1.0$ for standard hallways, $1.1$ for elevator wait time, $1.4$ for stairs).
- **Constraint Filtering:**
  - If `accessible_only = true`: edges with `is_accessible = false` are pruned from the adjacency list.
  - If `avoid_stairs = true`: edges tagged with `transit_type = stairs` are excluded.
  - If edge ID matches an active obstacle's `edge_id`: edge is marked blocked and skipped.

---

## 4. 3D Reconstruction Pipeline Modules

1. **Ingestion & Frame Sampling:** Extracts uniform keyframes from 60fps smartphone video while pruning blurred frames using Laplacian variance ($Var(\Delta I) > \tau$).
2. **Camera Calibration & SfM:** Executes COLMAP feature extraction (SIFT) and incremental bundle adjustment to solve 6-DoF camera poses and focal lengths.
3. **Dense Processing:** Open3D Multi-View Stereo (MVS) generates dense point clouds.
4. **Surface Meshing:** Screened Poisson surface reconstruction builds a watertight manifold polygon mesh.
5. **Optimization:** Vertex decimation, Draco compression, and LOD generation for instant sub-second browser streaming.
