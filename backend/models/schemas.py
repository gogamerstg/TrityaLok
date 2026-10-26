"""
Pydantic Schemas for NEXUS SPACE
Digital Twin & Indoor Navigation System (Techfest IIT Bombay - Namma Space)
"""

from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum


class POICategory(str, Enum):
    LABORATORY = "Laboratory"
    CLASSROOM = "Classroom"
    RECEPTION = "Reception"
    FACULTY_ROOM = "Faculty Room"
    WASHROOM = "Washroom"
    ELEVATOR = "Elevator"
    STAIRCASE = "Staircase"
    ENTRANCE = "Entrance"
    EMERGENCY_EXIT = "Emergency Exit"
    CAFETERIA = "Cafeteria"
    STUDY_AREA = "Study Area"


class Coordinate3D(BaseModel):
    x: float = Field(..., description="X coordinate in meters (East-West)")
    y: float = Field(..., description="Y coordinate in meters (Elevation/Height)")
    z: float = Field(..., description="Z coordinate in meters (North-South)")


class POI(BaseModel):
    id: str
    name: str
    category: POICategory
    floor_id: int = Field(..., description="Floor number (e.g. 1, 2)")
    room_number: Optional[str] = None
    coordinates: Coordinate3D
    description: str
    accessibility: bool = Field(True, description="Wheelchair accessible")
    opening_hours: Optional[str] = "08:00 - 20:00"
    current_status: str = Field("Open", description="Open / Busy / Maintenance / Closed")
    related_facilities: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)


class NavigationNode(BaseModel):
    id: str
    name: str
    floor_id: int
    coordinates: Coordinate3D
    is_poi: bool = False
    poi_id: Optional[str] = None
    is_transit: bool = Field(False, description="Stairs or Elevator connecting floors")
    transit_type: Optional[str] = None  # 'elevator', 'stairs'
    walkable: bool = True


class NavigationEdge(BaseModel):
    id: str
    source_node_id: str
    target_node_id: str
    distance: float = Field(..., description="Euclidean distance in meters")
    direction: str = Field("both", description="forward, backward, both")
    floor_id: int
    is_accessible: bool = True
    is_blocked: bool = False
    block_reason: Optional[str] = None
    traversal_cost_multiplier: float = 1.0


class Obstacle(BaseModel):
    id: str
    name: str
    floor_id: int
    edge_id: Optional[str] = None
    coordinates: Coordinate3D
    dimensions: Coordinate3D  # width, height, depth
    type: str = "temporary"  # 'temporary', 'permanent', 'maintenance', 'hazard'
    severity: str = "blocked"  # 'blocked', 'slow'
    description: str
    active: bool = True


class Room(BaseModel):
    id: str
    name: str
    floor_id: int
    category: str
    bounds: List[Coordinate3D]
    poi_id: Optional[str] = None
    area_sqm: float
    color_code: Optional[str] = None


class Floor(BaseModel):
    id: int
    name: str
    elevation: float  # elevation in meters (e.g., 0 for F1, 4.0 for F2)
    rooms: List[Room] = Field(default_factory=list)
    boundary: List[Coordinate3D] = Field(default_factory=list)


class Building(BaseModel):
    id: str
    name: str
    code: str
    institution: str = "IIT Bombay"
    total_floors: int
    floors: List[Floor]
    pois: List[POI]
    nodes: List[NavigationNode]
    edges: List[NavigationEdge]
    obstacles: List[Obstacle]


class RouteRequest(BaseModel):
    start_node_id: str
    destination_poi_id: Optional[str] = None
    destination_node_id: Optional[str] = None
    accessible_only: bool = False
    avoid_stairs: bool = False
    preferred_transit: Optional[str] = None  # 'elevator', 'stairs', 'any'


class TurnInstruction(BaseModel):
    step_number: int
    instruction: str
    distance_meters: float
    turn_type: str  # 'straight', 'left', 'right', 'elevator_up', 'stairs_up', 'elevator_down', 'stairs_down', 'destination'
    node_id: str
    coordinates: Coordinate3D
    floor_id: int


class RouteResponse(BaseModel):
    success: bool
    message: str
    path_node_ids: List[str] = Field(default_factory=list)
    path_coordinates: List[Coordinate3D] = Field(default_factory=list)
    total_distance_meters: float = 0.0
    estimated_time_seconds: float = 0.0
    floors_traversed: List[int] = Field(default_factory=list)
    requires_transit: bool = False
    transit_type_used: Optional[str] = None
    is_accessible: bool = True
    turn_by_turn: List[TurnInstruction] = Field(default_factory=list)
    alternative_available: bool = False
    rerouted_around_obstacle: bool = False
    obstacle_avoided_id: Optional[str] = None


class ReconstructionJobStatus(str, Enum):
    QUEUED = "queued"
    INGESTING = "ingesting"
    VALIDATING = "validating"
    POSE_ESTIMATION = "pose_estimation"
    FEATURE_MATCHING = "feature_matching"
    POINT_CLOUD_GENERATION = "point_cloud_generation"
    SURFACE_RECONSTRUCTION = "surface_reconstruction"
    TEXTURE_GENERATION = "texture_generation"
    OPTIMIZATION_3D = "optimization_3d"
    COMPLETED = "completed"
    FAILED = "failed"


class ReconstructionJob(BaseModel):
    id: str
    name: str
    capture_type: str  # 'video', 'images', 'sample'
    file_count: int
    total_size_mb: float
    status: ReconstructionJobStatus
    progress_percentage: int
    current_stage: str
    elapsed_seconds: float
    estimated_remaining_seconds: float
    created_at: str
    logs: List[str] = Field(default_factory=list)
    output_model_url: Optional[str] = None
    point_cloud_count: Optional[int] = None
    mesh_vertex_count: Optional[int] = None
    gaussian_splat_count: Optional[int] = None


class AIQueryRequest(BaseModel):
    query: str
    current_node_id: Optional[str] = None
    current_floor_id: Optional[int] = 1


class AIQueryResponse(BaseModel):
    answer: str
    intent: str  # 'navigation', 'poi_search', 'facility_info', 'accessibility', 'general'
    matched_poi_ids: List[str] = Field(default_factory=list)
    suggested_route: Optional[RouteResponse] = None
    voice_spoken_text: str
