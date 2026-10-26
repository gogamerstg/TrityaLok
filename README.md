# NEXUS SPACE 🌐🧊
### *Scan. Understand. Explore. Navigate.*

> **Flagship Entry for Namma Space Challenge • Techfest, IIT Bombay**  
> An autonomous web platform transforming regular smartphone video captures into photorealistic, interactive 3D digital twins with obstacle-aware graph navigation, POI discovery, and an AI spatial assistant.

---

## 🏆 Project Highlights & Hackathon Features

| Feature | Description | Tech Stack |
|---|---|---|
| **📱 Smartphone 3D Scan** | 9-stage modular photogrammetry pipeline guidance & telemetry for room, lab, and corridor captures. | COLMAP SfM, Open3D, 3D Gaussian Splatting, Draco glTF |
| **🧊 Multi-Floor 3D Twin** | Interactive WebGL digital twin with Orbit, Pan, Zoom, 2D Top-Down floorplan, and First-Person (WASD + mouse look) roaming. | React 19, Three.js, React Three Fiber, Drei, Tailwind CSS |
| **📍 Intelligent POI Search** | 13 indexed waypoints (Labs, Seminar Hall, Cafe, Restrooms, Elevator, Exits) with live auto-suggestions and filters. | Zustand, TypeScript, Spatial Indexing |
| **🧭 Obstacle-Aware $A^*$ Route** | Metric graph pathfinder with step-free wheelchair routing, multi-floor transit via elevator/stairs, and dynamic blockage rerouting. | Python FastAPI / TypeScript $A^*$ Algorithm, Catmull-Rom Splines |
| **🤖 "NEXUS" AI Assistant** | Conversational building bot grounded in real spatial coordinates, with voice input and text-to-speech synthesis. | Natural Language Processing, Web Speech API |
| **👓 Simulated AR HUD** | WebXR-ready 6-DoF simulated mobile AR HUD featuring live compass heading, dynamic 3D directional arrows, and step countdowns. | HTML5 Canvas, DeviceOrientation, Mathematical Vector Projection |
| **🔥 1-Click Judge Scenarios** | Instant demo mode to demonstrate Round 1, Round 2, and Round 3 requirements in front of judges in seconds. | Automated Scenario Runner + Celebration Confetti |

---

## 🏢 Sample Venue Model: IIT Bombay Innovation Complex

The built-in benchmark environment models a multi-tier academic and research complex:
- **Ground Floor (Level 1):** Main Reception, Robotics & Autonomous Systems Lab (Room 104), Aryabhata Seminar Auditorium, Techfest Student Cafe, Accessible Restrooms, Central Elevator, Grand Staircase, and North Emergency Fire Exit.
- **Second Floor (Level 2):** Computer Lab 204 (AI & 3D Vision), Faculty Research Cabins, Smart Classroom 201, Level 2 Restrooms, Open Atrium Mezzanine with Glass Balustrades.
- **Dynamic Obstacles:** Simulated maintenance hazard in Level 1 East Corridor and construction scaffolding on Level 2 Mezzanine.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)

### 2. Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The frontend has a built-in client-side $A^*$ engine, sample 3D building dataset, and spatial AI rule engine. It runs 100% reliably even offline!

### 3. Run Backend (Optional / Full-Stack Mode)
```powershell
cd backend
python -m pip install -r requirements.txt
python main.py
```
FastAPI server runs on [http://localhost:8000](http://localhost:8000). Interactive Swagger API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🎯 1-Click Live Demonstration Scenarios for Judges

Click the **"Live Demo Mode"** button in the sidebar or header to run automated competition scenarios:

1. **Scenario 1 — "Find Computer Lab":**
   - Automatically searches for Computer Lab 204 on Level 2.
   - Highlights the 3D holographic beacon.
   - Computes the shortest obstacle-free route from the Main Entrance.
   - Animates a glowing navigation spline and turn-by-turn guidance.
   - Dispatches the autonomous navigation drone along the 3D path.

2. **Scenario 2 — "Dynamic Obstacle Reroute":**
   - Activates a maintenance barrier in the East Corridor.
   - The $A^*$ pathfinding engine detects the blockage in real time.
   - Recalculates an alternative route through the Grand Atrium bypass.
   - Explains the obstacle avoidance strategy in the turn-by-turn instructions.

3. **Scenario 3 — "Accessible Multi-Floor Route":**
   - Enforces wheelchair step-free navigation constraints.
   - Avoids the architectural staircase and routes occupants through the Central Glass Elevator to Level 2.

---

## 📊 System Architecture & Tech Stack

```
Frontend:
  ├── React 19 + TypeScript + Vite
  ├── Three.js + @react-three/fiber + @react-three/drei
  ├── Tailwind CSS (@tailwindcss/postcss)
  ├── Zustand (Reactive Global State)
  ├── Framer Motion + Lucide Icons + Canvas-Confetti

Backend:
  ├── Python FastAPI + Uvicorn
  ├── Pydantic v2 (Strict Schema Validation)
  ├── A* Graph Pathfinding Engine (Adjacency Lists & Priority Queues)
  ├── Modular 3D Reconstruction Manager (COLMAP / Open3D / Gaussian Splatting)
  ├── Grounded Spatial AI Assistant & WebSockets

Data & 3D Geometry:
  ├── Standardized Y-Up Coordinate System
  ├── 13 Searchable POIs & 35 Walkable Graph Nodes
  ├── Screened Poisson Surface Meshes & PBR Materials
```

---

## 📑 Competition Documentation

- [TECHFEST_ABSTRACT.md](./docs/TECHFEST_ABSTRACT.md): Complete abstract prepared for Round 1 submission.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md): Comprehensive system architecture diagram and pipeline specifications.
- [API_REFERENCE.md](./docs/API_REFERENCE.md): REST and WebSocket API documentation.

---

## 👥 Credits

Developed for **Namma Space by Techfest, IIT Bombay** by **Team NEXUS**.
*Designed to excel in Round 1 (Reconstruction & Roaming), Round 2 (POI & Obstacle Avoidance), and Round 3 (On-Site Live Capture).*
