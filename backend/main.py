"""
NEXUS SPACE - FastAPI Backend Service
AI-Powered Indoor Digital Twin & Smart Navigation Platform
Techfest IIT Bombay - Namma Space 2026
"""

import json
import os
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.schemas import (
    Building,
    POI,
    RouteRequest,
    RouteResponse,
    ReconstructionJob,
    AIQueryRequest,
    AIQueryResponse,
    Obstacle,
)
from services.pathfinding_service import AStarRouter
from services.reconstruction_service import ReconstructionManager
from services.ai_service import AISpatialAssistant

app = FastAPI(
    title="NEXUS SPACE Backend API",
    description="3D Indoor Digital Twin & Obstacle-Aware Navigation Engine (Techfest IIT Bombay)",
    version="1.0.0",
)

# Enable CORS for frontend Vite dev server (port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load IIT Bombay sample building dataset
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "iitb_building.json")
with open(DATA_FILE, "r", encoding="utf-8") as f:
    raw_data = json.load(f)
    CURRENT_BUILDING = Building(**raw_data)

router = AStarRouter(CURRENT_BUILDING)
recon_manager = ReconstructionManager()
ai_assistant = AISpatialAssistant(CURRENT_BUILDING)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NEXUS SPACE Digital Twin Engine",
        "version": "1.0.0",
        "venue": CURRENT_BUILDING.name,
        "pois_loaded": len(CURRENT_BUILDING.pois),
        "nodes_loaded": len(CURRENT_BUILDING.nodes),
    }


@app.get("/api/buildings", response_model=List[Building])
def list_buildings():
    return [CURRENT_BUILDING]


@app.get("/api/buildings/{building_id}", response_model=Building)
def get_building(building_id: str):
    if building_id != CURRENT_BUILDING.id and building_id != "default":
        raise HTTPException(status_code=404, detail="Building not found")
    return CURRENT_BUILDING


@app.get("/api/buildings/{building_id}/pois", response_model=List[POI])
def list_pois(building_id: str, floor_id: Optional[int] = None, category: Optional[str] = None):
    pois = CURRENT_BUILDING.pois
    if floor_id is not None:
        pois = [p for p in pois if p.floor_id == floor_id]
    if category is not None:
        pois = [p for p in pois if p.category.value == category or p.category == category]
    return pois


@app.post("/api/navigation/route", response_model=RouteResponse)
def compute_route(req: RouteRequest):
    # Resolve target node id if destination POI provided
    target_node_id = req.destination_node_id
    if not target_node_id and req.destination_poi_id:
        matching_node = next(
            (n for n in CURRENT_BUILDING.nodes if n.poi_id == req.destination_poi_id), None
        )
        if matching_node:
            target_node_id = matching_node.id

    if not target_node_id:
        raise HTTPException(
            status_code=400, detail="Either destination_node_id or destination_poi_id is required."
        )

    res = router.compute_route(
        start_node_id=req.start_node_id,
        destination_node_id=target_node_id,
        accessible_only=req.accessible_only,
        avoid_stairs=req.avoid_stairs,
    )
    return res


class ToggleObstacleRequest(BaseModel):
    obstacle_id: str


@app.post("/api/navigation/toggle-obstacle")
def toggle_obstacle(req: ToggleObstacleRequest):
    obs = next((o for o in CURRENT_BUILDING.obstacles if o.id == req.obstacle_id), None)
    if not obs:
        raise HTTPException(status_code=404, detail=f"Obstacle '{req.obstacle_id}' not found.")
    obs.active = not obs.active
    return {
        "success": True,
        "obstacle_id": obs.id,
        "active": obs.active,
        "name": obs.name,
    }


class CreateJobRequest(BaseModel):
    name: str
    capture_type: str = "video"
    file_count: int = 120


@app.post("/api/reconstruction/jobs", response_model=ReconstructionJob)
def create_reconstruction_job(req: CreateJobRequest):
    job = recon_manager.create_job(req.name, req.capture_type, req.file_count)
    return job


@app.get("/api/reconstruction/jobs", response_model=List[ReconstructionJob])
def list_jobs():
    return recon_manager.list_jobs()


@app.get("/api/reconstruction/jobs/{job_id}", response_model=ReconstructionJob)
def get_job(job_id: str):
    job = recon_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Reconstruction job not found")
    return job


@app.post("/api/ai/query", response_model=AIQueryResponse)
def handle_ai_query(req: AIQueryRequest):
    return ai_assistant.process_query(
        req.query,
        current_node_id=req.current_node_id,
        current_floor_id=req.current_floor_id,
    )


@app.websocket("/api/reconstruction/ws/{job_id}")
async def websocket_reconstruction_progress(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        stages = [
            ("validating", "Image Quality Validation", 20, "Blur and exposure checked."),
            ("pose_estimation", "Camera Pose Estimation (COLMAP SfM)", 38, "Inertial alignment complete."),
            ("feature_matching", "Dense Feature Matching", 52, "Keypoint pairs correspondence solved."),
            ("point_cloud_generation", "Point Cloud Generation", 68, "Dense 3D point cloud extracted."),
            ("surface_reconstruction", "Surface Reconstruction (Poisson)", 80, "Watertight polygon mesh built."),
            ("texture_generation", "Texture Atlas Generation", 90, "PBR diffuse and roughness maps baked."),
            ("optimization_3d", "3D Optimization & Draco Compression", 96, "Asset compressed for web delivery."),
            ("completed", "Digital Twin Published", 100, "Digital twin active and published to NEXUS."),
        ]
        for status, stage, progress, log in stages:
            await asyncio.sleep(1.5)
            await websocket.send_json({
                "job_id": job_id,
                "status": status,
                "current_stage": stage,
                "progress_percentage": progress,
                "log": log,
            })
    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
