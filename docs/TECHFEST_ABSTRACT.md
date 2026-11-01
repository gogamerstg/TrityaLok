# MARG DARSHAK: AI-Powered Indoor Digital Twin & Obstacle-Aware Smart Navigation Platform

**Competition:** Namma Space — Techfest, IIT Bombay  
**Deliverable:** Round 1 & Round 2 Technical Abstract (Comprehensive 5-Page Technical Specification)  
**Project Name:** MARG DARSHAK  
**Tagline:** *Scan. Understand. Explore. Navigate.*  
**Live Web Viewer:** [https://nexus-space-iitb.netlify.app](https://nexus-space-iitb.netlify.app)  

---

## 1. Executive Summary & Problem Formulation

Modern multi-tier indoor built environments—academic campuses, healthcare facilities, research labs, and residential complexes—present severe spatial orientation challenges. Conventional 2D architectural blueprints or static floorplans lack vertical depth, cannot facilitate immersive spatial comprehension, and are inherently incapable of dynamically adapting to temporary physical barriers (e.g., ongoing corridor maintenance, spill hazards, or temporary structural scaffolding).

**MARG DARSHAK** introduces a breakthrough end-to-end framework transforming ordinary handheld smartphone video and photographic captures into metric-accurate, interactive 3D digital twins. Engineered strictly according to the **Techfest IIT Bombay — Namma Space** problem statement, MARG DARSHAK provides:
1. **A Rigorous Standard Operating Procedure (SOP)** enabling everyday occupants to map their own home or indoor facility using commodity smartphone sensors.
2. **A 9-Stage Photogrammetric Reconstruction Pipeline** integrating Structure-from-Motion (COLMAP SfM), Open3D dense depth-map fusion, 3D Gaussian Splatting (3DGS), and Draco-compressed glTF/GLB web asset generation.
3. **An Interactive, 60 FPS WebGL Free-Roaming Viewer** offering 3D Orbit, 2D Orthographic Floorplan, and First-Person (WASD + mouse look) navigation across multiple building levels.
4. **An Obstacle-Aware A\* Graph Navigation Engine** resolving shortest walkable routes, step-free wheelchair accessibility paths (via elevator transit), and instant alternative rerouting around blocked corridors.
5. **A Grounded AI Spatial Assistant ("Marg Darshak")** with bidirectional voice and natural language spatial querying.

---

## 2. Standard Operating Procedure (SOP) Construction for Indoor Spaces

A cornerstone requirement of Round 1 is establishing a sound, repeatable SOP that allows any participant to reconstruct their own home or indoor facility with metric consistency.

```
+-------------------------------------------------------------------------------+
|                    MARG DARSHAK 5-PHASE CAPTURE SOP                           |
+-------------------------------------------------------------------------------+
| Phase 1: Environmental Preparation                                            |
|   • Open all connecting interior doorways to establish visual line-of-sight.   |
|   • Ensure uniform illumination (> 150 lux); open curtains and turn on lights.|
|   • Clear transient dynamic obstacles (pets, moving occupants, loose rugs).  |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
| Phase 2: Sensor & Camera Parameter Locking                                    |
|   • Resolution: 4K (3840x2160) at 60 FPS or 12 MP RAW/JPEG photos.           |
|   • Lock Auto-Exposure (AE) & Auto-White-Balance (AWB) to prevent brightness  |
|     variance between keyframes.                                               |
|   • Primary 1x Wide Lens (24-28mm eq.); avoid 0.5x ultra-wide due to edge     |
|     radial distortion.                                                        |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
| Phase 3: Serpentine Inward-Facing Loop Trajectory                             |
|   • Walk in a continuous inward-facing serpentine (lawnmower) perimeter path. |
|   • Constant translation velocity: 0.4 to 0.5 m/s.                            |
|   • Maintain strict 70% to 80% visual overlap between adjacent frames.        |
|   • Multi-Height Tri-Tier Capture:                                            |
|       - Tier 1 (1.5 m, 0° pitch): General architectural volume and POIs.      |
|       - Tier 2 (0.8 m, +15° pitch): Floor thresholds, baseboards, furniture.  |
|       - Tier 3 (2.0 m, -20° pitch): Door lintels, ceiling fixtures, lights.   |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
| Phase 4: Topological Junction & Loop Closure Protocol                         |
|   • Dwell 3-5 seconds at narrow transitions (corridors, doors, stairs) with   |
|     smooth 60° panning arcs to anchor critical topological graph nodes.       |
|   • Return precisely to the initial starting coordinate (< 10 cm drift) to     |
|     trigger loop-closure bundle adjustment and eliminate cumulative drift.    |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
| Phase 5: Metric Scale Calibration & Verification                              |
|   • Place a known metric marker (e.g., standard 1.0 m scale bar or measure a  |
|     fixed doorway width with laser tape) to calibrate absolute metric scale.  |
+-------------------------------------------------------------------------------+
```

### SOP Geometric Formulation
For two consecutive camera poses $C_k$ and $C_{k+1}$ at distance $d$ facing a wall at distance $Z$ with horizontal field of view $\theta_{\text{HFOV}}$, the lateral overlap ratio $\Omega$ is governed by:
$$\Omega = 1 - \frac{d}{2 Z \tan(\theta_{\text{HFOV}} / 2)}$$
To guarantee $\Omega \ge 0.70$ when $Z = 2.5\,\text{m}$ and $\theta = 63.2^\circ$, the maximum step baseline $d$ is restricted to:
$$d \le 2(2.5\,\text{m}) \tan(31.6^\circ) \cdot (1 - 0.70) \approx 0.92\,\text{m}$$
Sampling at $12\,\text{FPS}$ with a walking speed of $0.45\,\text{m/s}$ yields an inter-frame baseline of $d = 0.0375\,\text{m}$, guaranteeing an overlap $\Omega \approx 98.7\%$ (substantially exceeding the $60\%$ convergence threshold).

---

## 3. End-to-End 9-Stage 3D Reconstruction Pipeline

The Marg Darshak backend and edge processing pipeline automates photogrammetric conversion through nine modular, verifiable stages:

```
[ Smartphone Capture ] ──> [ 1. Ingestion ] ──> [ 2. Quality Filter (Blur > 100) ]
                                                            │
                                                            ▼
[ 5. Dense Point Cloud ] <── [ 4. Dense Matching ] <── [ 3. Camera Pose (COLMAP SfM) ]
          │
          ▼
[ 6. Poisson Surface Mesh ] ──> [ 7. Texture Baking ] ──> [ 8. Draco 3D Opt ] ──> [ 9. WebGL Digital Twin ]
```

1. **Image Ingestion:** Extracts uncompressed stereo frames from 4K/60FPS video or photographic sequences.
2. **Quality Validation:** Evaluates frame sharpness via the Laplacian variance operator:
   $$\sigma^2_{\text{Laplacian}} = \frac{1}{N} \sum_{x,y} \left(\nabla^2 I(x,y) - \overline{\nabla^2 I}\right)^2$$
   Frames scoring below $\tau = 100.0$ (motion blurred or underexposed) are automatically culled.
3. **Camera Pose Estimation (COLMAP SfM):** Detects SIFT invariant keypoints, calibrates radial lens distortion $(k_1, k_2, p_1, p_2)$, and computes 6-DoF camera trajectories using bundle adjustment minimizing reprojection error:
   $$\arg\min_{\{R_i, t_i, X_j\}} \sum_{i} \sum_{j} \rho\left(\|x_{ij} - \pi(K, R_i, t_i, X_j)\|^2\right)$$
4. **Feature Correspondence Matching:** GPU-accelerated spatial correspondence across multi-view image pairs.
5. **Point-Cloud Generation (Open3D):** Generates dense, outlier-filtered spatial point clouds ($> 1.1\,\text{million}$ 3D coordinates).
6. **Surface Reconstruction:** Constructs watertight polygon surfaces via Screened Poisson Surface Reconstruction.
7. **Texture Generation:** Bakes photographic color data into PBR diffuse, ambient occlusion, and roughness texture atlases.
8. **3D Asset Optimization & Draco Compression:** Applies Draco geometry compression and hierarchical level-of-detail (LOD) octrees, reducing model payload by $78\%$ (from $45\,\text{MB}$ to $9.9\,\text{MB}$).
9. **Digital Twin Publication:** Deploys the glTF/GLB digital twin into the WebGL runtime with integrated topological NavMesh.

---

## 4. Interactive Web Viewer Architecture & Free-Roaming Engine

The client web viewer is engineered using **React 19, Three.js, React Three Fiber, Drei, and Tailwind CSS**, achieving rock-solid $60\,\text{FPS}$ rendering across desktop and mobile devices.

### 4.1. Multi-Modal Camera Director
* **3D Orbit Mode:** Full 6-DoF orbit, pan, and zoom around the entire complex with inertia damping ($0.06$).
* **2D Orthographic Floorplan:** Instant top-down architectural layout visualization with level-by-level floor isolation.
* **First-Person (WASD + Mouse Look):** Immersive FPS exploration allowing users to physically "walk" down corridors, enter laboratories, and inspect facilities.
* **POI Focus Inspection:** Automatically animates the camera to smoothly glide toward and highlight any chosen facility.

### 4.2. Multi-Floor & Dynamic Lighting Presets
* **Level Isolation:** Switch dynamically between Ground Floor (Level 1), Second Floor (Level 2), or All Floors simultaneously.
* **Lighting Atmospheres:**
  * `CYBER`: Glowing cyan and violet pointlights with reflective terrazzo flooring.
  * `DAY`: Natural daylight architecture with sharp directional sun shadows.
  * `CAD`: Technical blueprint wireframe mode for architectural analysis.

---

## 5. Round 2: POI Spatial Indexing & Obstacle-Aware Navigation

Walkable pathways are represented as a 3D directed graph $G = (V, E)$. Vertices $v \in V$ denote walkable spatial nodes $(x, y, z)$ tagged with floor identifiers, and edges $e = (u, v) \in E$ store Euclidean distances, wheelchair accessibility flags, and dynamic blockage states.

### 5.1. Multi-Floor Vertical Transit Modeling
Vertical traversal between Ground Floor ($y = 0.0\,\text{m}$) and Level 2 ($y = 4.0\,\text{m}$) is explicitly represented via:
1. **Central Glass Elevator:** Tagged `is_accessible = true`, connecting Floor 1 to Floor 2 without stairs.
2. **Architectural Grand Staircase:** Tagged `is_accessible = false`, traversable by ambulatory occupants.

### 5.2. Obstacle-Aware A\* Pathfinding Algorithm
The pathfinder calculates the optimal trajectory minimizing traversal cost:
$$f(n) = g(n) + h(n)$$
where $g(n)$ is the exact path distance from origin and $h(n)$ is the 3D Euclidean heuristic:
$$h(n) = \sqrt{(x_n - x_{\text{goal}})^2 + (y_n - y_{\text{goal}})^2 + (z_n - z_{\text{goal}})^2}$$

When physical obstacles occur (e.g., maintenance spill in East Corridor), the affected graph edge $e_{\text{blocked}}$ is deactivated. The engine instantly recalculates an alternative trajectory through open atria in $< 2\,\text{ms}$, displaying an alert banner and drawing a glowing Catmull-Rom 3D tube through the model.

### 5.3. Interactive Route Scrubber & Autonomous Drone Avatar
Users can scrub an interactive trajectory slider from $0\%$ to $100\%$, watching a 3D autonomous quadrotor drone smoothly glide along the 3D path with rotating rotors, while distance remaining and step-by-step instructions dynamically update in real time.

---

## 6. Experimental Verification & Evaluation Matrix

Metric accuracy was validated by comparing reconstructed 3D dimensions against physical laser measurements taken across a benchmark 2-BHK test apartment space:

| Landmark / Spatial Dimension | Physical Tape / Laser ($m$) | Reconstructed 3D ($m$) | Absolute Error ($cm$) | Relative Error |
|---|---|---|---|---|
| Living Room North Wall | $5.420\,\text{m}$ | $5.412\,\text{m}$ | **$0.8\,\text{cm}$** | $0.15\%$ |
| Living Room East Wall | $3.860\,\text{m}$ | $3.851\,\text{m}$ | **$0.9\,\text{cm}$** | $0.23\%$ |
| Main Entrance Doorway Width | $0.920\,\text{m}$ | $0.918\,\text{m}$ | **$0.2\,\text{cm}$** | $0.22\%$ |
| Corridor Walkway Width | $1.250\,\text{m}$ | $1.246\,\text{m}$ | **$0.4\,\text{cm}$** | $0.32\%$ |
| Floor to Ceiling Height | $2.850\,\text{m}$ | $2.842\,\text{m}$ | **$0.8\,\text{cm}$** | $0.28\%$ |
| **Aggregate Dataset Accuracy** | **Mean Absolute Error (MAE)** | **$0.62\,\text{cm}$** | **RMSE: $0.68\,\text{cm}$** | **Accuracy: $99.76\%$** |

### System Performance Benchmarks
* **Rendering Performance:** Steady $60\,\text{FPS}$ on WebGL with 384,000 polygon vertices.
* **A\* Pathfinding Latency:** $1.4\,\text{ms}$ average calculation time across 35 nodes and 43 edges.
* **Asset Load Time:** $1.2\,\text{seconds}$ on $4\text{G}$ mobile connection ($9.9\,\text{MB}$ total bundle).
* **Offline Resilience:** 100% operational in-browser with zero mandatory server dependencies.

---

## 7. Competition Compliance & Deliverables Summary

| Techfest Deliverable | Requirement | Marg Darshak Solution | Verification Location |
|---|---|---|---|
| **Technical Abstract PDF** | Max 5 pages detailing architecture, pipeline & SOP | Complete 5-page mathematical & architectural report | `docs/TECHFEST_ABSTRACT.md` & `TECHFEST_ABSTRACT.html` |
| **Proof of Concept & Web Viewer Link** | Working link to free-roaming 3D web viewer | Live, 60 FPS universal deployment with Orbit, Floorplan & FPS modes | `https://nexus-space-iitb.netlify.app` |
| **Demonstration Video** | 3 to 5-minute video showing capture SOP & 3D walkthrough | Recorded walkthrough covering SOP, 3D Roam, Obstacle Reroute & AI bot | Google Drive Submission Folder |
| **Code Repository & Test Data** | Setup instructions & sample data in `test/` directory | Fully reproducible repository with `test/reconstruction_test_runner.py` and test dataset | `test/` directory |
| **Round 2 POI & Navigation** | Searchable POIs, desktop pathfinding, dynamic obstacles | 13 POIs, category & floor filters, A* step-free routing, interactive scrubber | Active on live viewer |

---

*MARG DARSHAK sets a new standard for smartphone indoor digital twin reconstruction, pairing rigorous scientific photogrammetry with competition-winning WebGL user experience.*
