# TrityaLok: IIT Bombay Techfest 3D Digital Twin

TrityaLok is an advanced AI-powered indoor spatial intelligence platform developed for Techfest IIT Bombay. It bridges the gap between physical infrastructure and digital navigation using real-time spatial telemetry and AI-driven pathfinding.

## Core Features
- **3D Digital Twin:** Interactive, photorealistic indoor walkthroughs.
- **TrityaLok Nexus AI:** Specialized spatial assistant for navigation and sensor telemetry.
- **Sensor Fusion:** Integration of Wi-Fi/BLE data for indoor positioning.
- **A* Pathfinding:** Obstacle-aware navigation mesh.
- **Custom Uploads:** Seamlessly load and visualize your own 3D scans (`.glb`/`.gltf`).

## Tech Stack
- **Frontend:** React, Tailwind CSS, Three.js, React-Three-Fiber.
- **AI:** Google Gemini 1.5 Flash / Groq Llama 3.3.
- **Backend:** FastAPI (Python).

## Setup
1. Backend: `cd backend && uvicorn main:app --reload`
2. Frontend: `cd frontend && npm install && npm run dev`

---
