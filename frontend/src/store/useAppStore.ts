import { create } from 'zustand';
import {
  Building,
  Floor,
  POI,
  Room,
  Obstacle,
  RouteResponse,
  ReconstructionJob,
  ViewMode
} from '../types';
import { SAMPLE_BUILDING_DATA, HOME_APARTMENT_DATA } from '../data/sampleBuildingData';

export type MainSection =
  | 'dashboard'
  | 'scan'
  | 'twin'
  | 'pathfinding'
  | 'radar'
  | 'ai-assistant'
  | 'floorplan'
  | 'ar-nav'
  | 'live-monitoring'
  | 'analytics'
  | 'projects'
  | 'settings';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nexus';
  text: string;
  timestamp: string;
  suggestedRoute?: RouteResponse;
  poiId?: string;
}

interface AppState {
  // Navigation & section
  activeSection: MainSection;
  setActiveSection: (section: MainSection) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Building & floor
  building: Building;
  setBuilding: (building: Building) => void;
  selectedFloorId: number | 'all';
  setSelectedFloorId: (floorId: number | 'all') => void;

  // View & 3D viewport settings
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  controlsMode: 'orbit' | 'firstPerson';
  setControlsMode: (mode: 'orbit' | 'firstPerson') => void;
  lightingMode: 'cyber' | 'daylight' | 'cad';
  setLightingMode: (mode: 'cyber' | 'daylight' | 'cad') => void;

  // Layer toggles
  showPoiLabels: boolean;
  setShowPoiLabels: (show: boolean) => void;
  showNavigationPath: boolean;
  setShowNavigationPath: (show: boolean) => void;
  showObstacles: boolean;
  setShowObstacles: (show: boolean) => void;
  showWalkableMesh: boolean;
  setShowWalkableMesh: (show: boolean) => void;
  showObstacleHeatmap: boolean;
  setShowObstacleHeatmap: (show: boolean) => void;
  showScannerCoverage: boolean;
  setShowScannerCoverage: (show: boolean) => void;

  // Selection
  selectedPoi: POI | null;
  setSelectedPoi: (poi: POI | null) => void;
  hoveredPoi: POI | null;
  setHoveredPoi: (poi: POI | null) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;

  // Navigation Planner & A* Route
  startNodeId: string;
  setStartNodeId: (nodeId: string) => void;
  destinationPoiId: string | null;
  setDestinationPoiId: (poiId: string | null) => void;
  destinationNodeId: string | null;
  setDestinationNodeId: (nodeId: string | null) => void;
  accessibleOnly: boolean;
  setAccessibleOnly: (val: boolean) => void;
  avoidStairs: boolean;
  setAvoidStairs: (val: boolean) => void;
  activeRoute: RouteResponse | null;
  setActiveRoute: (route: RouteResponse | null) => void;
  calculateCurrentRoute: () => void;

  // Animated Route Navigation
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  animationProgress: number; // 0 to 1
  setAnimationProgress: (p: number) => void;
  isPlayingAnimation: boolean;
  setIsPlayingAnimation: (val: boolean) => void;

  // Obstacle management
  toggleObstacle: (obstacleId: string) => void;

  // Reconstruction pipeline state
  jobs: ReconstructionJob[];
  activeJob: ReconstructionJob | null;
  startReconstructionJob: (
    name: string,
    type: 'video' | 'images' | 'sample',
    fileCount: number,
    customSizeMb?: number,
    previewUrl?: string
  ) => void;

  // AI Assistant Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  isAiThinking: boolean;
  setIsAiThinking: (val: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;

  // Global Modals & Drawers
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  isPoiModalOpen: boolean;
  setIsPoiModalOpen: (open: boolean) => void;
  isObstacleModalOpen: boolean;
  setIsObstacleModalOpen: (open: boolean) => void;
  isArModalOpen: boolean;
  setIsArModalOpen: (open: boolean) => void;
  isLiveDemoModalOpen: boolean;
  setIsLiveDemoModalOpen: (open: boolean) => void;
  isTechSpecsOpen: boolean;
  setIsTechSpecsOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | 'All';
  setSelectedCategory: (cat: string | 'All') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: 'dashboard',
  setActiveSection: (section) => set({ activeSection: section }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  building: HOME_APARTMENT_DATA,
  setBuilding: (newBuilding) => {
    const firstFloor = newBuilding.floors[0]?.id ?? 1;
    const firstNode = newBuilding.nodes[0]?.id ?? '';
    const firstPoi = newBuilding.pois[0]?.id ?? null;
    const secondNode = newBuilding.nodes.find(n => n.poi_id === firstPoi)?.id ?? (newBuilding.nodes[1]?.id ?? null);
    set({
      building: newBuilding,
      selectedFloorId: firstFloor,
      startNodeId: firstNode,
      destinationPoiId: firstPoi,
      destinationNodeId: secondNode,
      selectedPoi: null,
      selectedRoom: null,
      activeRoute: null,
      isNavigating: false,
    });
  },
  selectedFloorId: 1,
  setSelectedFloorId: (floorId) => set({ selectedFloorId: floorId }),

  viewMode: 'explore',
  setViewMode: (mode) => set({ viewMode: mode }),
  controlsMode: 'orbit',
  setControlsMode: (mode) => set({ controlsMode: mode }),
  lightingMode: 'cyber',
  setLightingMode: (mode) => set({ lightingMode: mode }),

  showPoiLabels: true,
  setShowPoiLabels: (show) => set({ showPoiLabels: show }),
  showNavigationPath: true,
  setShowNavigationPath: (show) => set({ showNavigationPath: show }),
  showObstacles: true,
  setShowObstacles: (show) => set({ showObstacles: show }),
  showWalkableMesh: false,
  setShowWalkableMesh: (show) => set({ showWalkableMesh: show }),
  showObstacleHeatmap: false,
  setShowObstacleHeatmap: (show) => set({ showObstacleHeatmap: show }),
  showScannerCoverage: false,
  setShowScannerCoverage: (show) => set({ showScannerCoverage: show }),

  selectedPoi: null,
  setSelectedPoi: (poi) => set({ selectedPoi: poi, isPoiModalOpen: !!poi }),
  hoveredPoi: null,
  setHoveredPoi: (poi) => set({ hoveredPoi: poi }),
  selectedRoom: null,
  setSelectedRoom: (room) => set({ selectedRoom: room }),

  startNodeId: 'n_f1_entrance',
  setStartNodeId: (nodeId) => set({ startNodeId: nodeId }),
  destinationPoiId: 'poi_computer_lab',
  setDestinationPoiId: (poiId) => {
    const { building } = get();
    const node = building.nodes.find(n => n.poi_id === poiId);
    set({
      destinationPoiId: poiId,
      destinationNodeId: node ? node.id : null,
    });
  },
  destinationNodeId: 'n_f2_complab_door',
  setDestinationNodeId: (nodeId) => set({ destinationNodeId: nodeId }),
  accessibleOnly: false,
  setAccessibleOnly: (val) => set({ accessibleOnly: val }),
  avoidStairs: false,
  setAvoidStairs: (val) => set({ avoidStairs: val }),
  activeRoute: null,
  setActiveRoute: (route) => set({ activeRoute: route }),

  calculateCurrentRoute: () => {
    // Preserved for Round 2 A* Path calculation
    set({
      activeRoute: null,
      currentStepIndex: 0,
      animationProgress: 0,
      isPlayingAnimation: false,
    });
  },

  isNavigating: false,
  setIsNavigating: (val) => set({ isNavigating: val }),
  currentStepIndex: 0,
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  animationProgress: 0,
  setAnimationProgress: (p) => set({ animationProgress: p }),
  isPlayingAnimation: false,
  setIsPlayingAnimation: (val) => set({ isPlayingAnimation: val }),

  toggleObstacle: (obstacleId) => {
    const { building } = get();
    const updatedObstacles = building.obstacles.map(obs => {
      if (obs.id === obstacleId) {
        return { ...obs, active: !obs.active };
      }
      return obs;
    });

    const updatedBuilding = {
      ...building,
      obstacles: updatedObstacles,
    };

    set({ building: updatedBuilding });

    // Recalculate route if one was active
    const { activeRoute } = get();
    if (activeRoute && activeRoute.success) {
      get().calculateCurrentRoute();
    }
  },

  jobs: [
    {
      id: "scan_iitb_01",
      name: "Techfest Arena & Academic Complex",
      capture_type: "video",
      file_count: 1420,
      total_size_mb: 4850.0,
      status: "completed",
      progress_percentage: 100,
      current_stage: "Digital Twin Published (GLB / Gaussian Splats Ready)",
      elapsed_seconds: 480.0,
      estimated_remaining_seconds: 0,
      created_at: "2026-10-26 18:30:00",
      logs: [
        "[00:00] Ingesting 4K 60fps indoor smartphone video (iPhone 15 Pro / Galaxy S24)",
        "[00:45] Keyframe extraction completed: 1,420 sharp stereo keyframes filtered",
        "[01:30] Camera intrinsics & optical distortion calibrated (COLMAP SfM)",
        "[02:40] SIFT sparse feature matching: 1.2M 3D sparse tie points generated",
        "[03:50] Dense depth-map stereo reconstruction with Open3D & patch match",
        "[05:10] 3D Gaussian Splatting optimization (30,000 iterations)",
        "[06:40] Watertight Poisson surface mesh extracted & texture baked",
        "[07:30] GLTF/GLB optimization: Draco compression, LOD hierarchical octree",
        "[08:00] Digital Twin published to TRITYALOK Spatial Engine with walkable nav-mesh"
      ],
      output_model_url: "/models/iitb_complex.glb",
      point_cloud_count: 1240000,
      mesh_vertex_count: 384000,
      gaussian_splat_count: 850000,
    }
  ],
  activeJob: null,

  startReconstructionJob: (name, type, fileCount, customSizeMb, previewUrl) => {
    const finalSizeMb = customSizeMb || fileCount * (type === 'video' ? 12.5 : 8.0);
    const newJob: ReconstructionJob = {
      id: `job_${Date.now()}`,
      name: name || `Scan_${new Date().toLocaleTimeString()}`,
      capture_type: type,
      file_count: fileCount,
      total_size_mb: Math.round(finalSizeMb * 10) / 10,
      status: 'ingesting',
      progress_percentage: 5,
      current_stage: 'Image Ingestion & Quality Validation',
      elapsed_seconds: 0,
      estimated_remaining_seconds: 120,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      logs: [
        `[00:00] Initialized capture processing pipeline for ${fileCount} frames (${type})`,
        `[00:02] Ingesting media payload (${Math.round(finalSizeMb * 10) / 10} MB)...`,
        `[00:03] Checking motion blur and exposure variance across dataset...`,
      ],
      output_model_url: previewUrl || "/models/iitb_complex.glb",
      point_cloud_count: 0,
      mesh_vertex_count: 0,
      gaussian_splat_count: 0,
    };

    set(state => ({
      jobs: [newJob, ...state.jobs],
      activeJob: newJob,
    }));

    // Start simulation steps
    const stages: Array<{
      status: ReconstructionJob['status'];
      stageName: string;
      progress: number;
      log: string;
    }> = [
      { status: 'validating', stageName: 'Image Quality Validation', progress: 15, log: 'Frame sharpness validated: 98.4% passing blur threshold.' },
      { status: 'pose_estimation', stageName: 'Camera Pose Estimation (COLMAP SfM)', progress: 28, log: 'Camera trajectory solved: 6-DoF poses aligned with indoor inertial gravity vector.' },
      { status: 'feature_matching', stageName: 'Dense Feature Matching', progress: 42, log: 'Deep feature correspondence matched across 89,400 pairs.' },
      { status: 'point_cloud_generation', stageName: 'Point-Cloud Generation (Open3D)', progress: 58, log: 'Dense point-cloud reconstructed: 1,120,000 3D spatial points.' },
      { status: 'surface_reconstruction', stageName: 'Surface Reconstruction', progress: 72, log: 'Screened Poisson surface mesh generated: 340,000 polygon faces.' },
      { status: 'texture_generation', stageName: 'Texture Atlas Generation', progress: 85, log: 'PBR texture maps generated with ambient occlusion and roughness.' },
      { status: 'optimization_3d', stageName: '3D Optimization & Draco Compression', progress: 94, log: 'Mesh decimation and Draco compression reduced asset payload by 78%.' },
      { status: 'completed', stageName: 'Digital Twin Published', progress: 100, log: 'Reconstruction completed successfully! 3D twin ready for interactive navigation in TRITYALOK.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= stages.length) {
        clearInterval(interval);
        return;
      }
      const step = stages[currentStep];
      set(state => {
        if (!state.activeJob) return state;
        const updated = {
          ...state.activeJob,
          status: step.status,
          current_stage: step.stageName,
          progress_percentage: step.progress,
          elapsed_seconds: (currentStep + 1) * 3,
          estimated_remaining_seconds: Math.max(0, (stages.length - currentStep - 1) * 3),
          logs: [...state.activeJob.logs, `[00:${String((currentStep + 1) * 3).padStart(2, '0')}] ${step.log}`],
          point_cloud_count: step.progress >= 58 ? 1120000 : 0,
          mesh_vertex_count: step.progress >= 72 ? 340000 : 0,
          gaussian_splat_count: step.progress >= 58 ? 780000 : 0,
        };
        const updatedBuilding = step.status === 'completed' && name ? {
          ...state.building,
          name: name.trim() || state.building.name
        } : state.building;
        return {
          activeJob: updated,
          building: updatedBuilding,
          jobs: state.jobs.map(j => (j.id === updated.id ? updated : j)),
        };
      });
      currentStep++;
    }, 1800);
  },

  chatMessages: [
    {
      id: 'msg_welcome',
      sender: 'nexus',
      text: 'Greetings! I am **TrityaLok Nexus AI**, your autonomous AI spatial intelligence assistant for the Techfest IIT Bombay Digital Twin. Ask me to find any lab, room, restroom, or calculate an obstacle-free indoor route.',
      timestamp: 'Just now',
    }
  ],
  addChatMessage: (msg) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set(state => ({
      chatMessages: [...state.chatMessages, newMsg],
    }));
  },
  isAiThinking: false,
  setIsAiThinking: (val) => set({ isAiThinking: val }),
  voiceEnabled: false,
  setVoiceEnabled: (val) => set({ voiceEnabled: val }),

  isMobileDrawerOpen: false,
  setIsMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  isPoiModalOpen: false,
  setIsPoiModalOpen: (open) => set({ isPoiModalOpen: open }),
  isObstacleModalOpen: false,
  setIsObstacleModalOpen: (open) => set({ isObstacleModalOpen: open }),
  isArModalOpen: false,
  setIsArModalOpen: (open) => set({ isArModalOpen: open }),
  isLiveDemoModalOpen: false,
  setIsLiveDemoModalOpen: (open) => set({ isLiveDemoModalOpen: open }),
  isTechSpecsOpen: false,
  setIsTechSpecsOpen: (open) => set({ isTechSpecsOpen: open }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: 'All',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));
