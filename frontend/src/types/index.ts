export type POICategory =
  | 'Laboratory'
  | 'Classroom'
  | 'Reception'
  | 'Faculty Room'
  | 'Washroom'
  | 'Elevator'
  | 'Staircase'
  | 'Entrance'
  | 'Emergency Exit'
  | 'Cafeteria'
  | 'Study Area';

export interface Coordinate3D {
  x: number;
  y: number;
  z: number;
}

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  floor_id: number;
  room_number?: string;
  coordinates: Coordinate3D;
  description: string;
  accessibility: boolean;
  opening_hours?: string;
  current_status: 'Open' | 'Busy' | 'Maintenance' | 'Closed';
  related_facilities: string[];
  tags: string[];
}

export interface NavigationNode {
  id: string;
  name: string;
  floor_id: number;
  coordinates: Coordinate3D;
  is_poi: boolean;
  poi_id?: string;
  is_transit: boolean;
  transit_type?: 'elevator' | 'stairs';
  walkable: boolean;
}

export interface NavigationEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  distance: number;
  direction: 'both' | 'forward' | 'backward';
  floor_id: number;
  is_accessible: boolean;
  is_blocked: boolean;
  block_reason?: string;
  traversal_cost_multiplier?: number;
}

export interface Obstacle {
  id: string;
  name: string;
  floor_id: number;
  edge_id?: string;
  coordinates: Coordinate3D;
  dimensions: Coordinate3D;
  type: 'temporary' | 'permanent' | 'maintenance' | 'hazard';
  severity: 'blocked' | 'slow';
  description: string;
  active: boolean;
}

export interface Room {
  id: string;
  name: string;
  floor_id: number;
  category: string;
  bounds: Coordinate3D[];
  poi_id?: string;
  area_sqm: number;
  color_code?: string;
}

export interface Floor {
  id: number;
  name: string;
  elevation: number;
  rooms: Room[];
  boundary: Coordinate3D[];
}

export interface Building {
  id: string;
  name: string;
  code: string;
  institution: string;
  total_floors: number;
  floors: Floor[];
  pois: POI[];
  nodes: NavigationNode[];
  edges: NavigationEdge[];
  obstacles: Obstacle[];
}

export interface TurnInstruction {
  step_number: number;
  instruction: string;
  distance_meters: number;
  turn_type: 'straight' | 'left' | 'right' | 'elevator_up' | 'stairs_up' | 'elevator_down' | 'stairs_down' | 'destination';
  node_id: string;
  coordinates: Coordinate3D;
  floor_id: number;
}

export interface RouteResponse {
  success: boolean;
  message: string;
  path_node_ids: string[];
  path_coordinates: Coordinate3D[];
  total_distance_meters: number;
  estimated_time_seconds: number;
  floors_traversed: number[];
  requires_transit: boolean;
  transit_type_used?: 'elevator' | 'stairs';
  is_accessible: boolean;
  turn_by_turn: TurnInstruction[];
  alternative_available: boolean;
  rerouted_around_obstacle: boolean;
  obstacle_avoided_id?: string;
}

export type ReconstructionStage =
  | 'queued'
  | 'ingesting'
  | 'validating'
  | 'pose_estimation'
  | 'feature_matching'
  | 'point_cloud_generation'
  | 'surface_reconstruction'
  | 'texture_generation'
  | 'optimization_3d'
  | 'completed'
  | 'failed';

export interface ReconstructionJob {
  id: string;
  name: string;
  capture_type: 'video' | 'images' | 'sample';
  file_count: number;
  total_size_mb: number;
  status: ReconstructionStage;
  progress_percentage: number;
  current_stage: string;
  elapsed_seconds: number;
  estimated_remaining_seconds: number;
  created_at: string;
  logs: string[];
  output_model_url?: string;
  point_cloud_count?: number;
  mesh_vertex_count?: number;
  gaussian_splat_count?: number;
}

export type ViewMode = 'explore' | 'floorplan' | 'navigation' | 'inspection';

export interface ActiveNavigationState {
  isNavigating: boolean;
  currentStepIndex: number;
  isPlayingAnimation: boolean;
  animationProgress: number; // 0 to 1
  route: RouteResponse | null;
}
