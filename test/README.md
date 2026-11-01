# MARG DARSHAK — Test Directory & Reconstruction Setup Instructions

> **Techfest, IIT Bombay — Namma Space 3D Indoor Digital Twin Challenge**  
> **Target Requirement:** Round 1 Code Repository Deliverable: *"A link/folder containing setup instructions to reconstruct the model, along with sample data placed inside a test directory."*

---

## 📁 1. Directory Structure

```
test/
├── README.md                           # This setup and verification guide
├── reconstruction_test_runner.py       # Automated test harness for SOP & metric validation
└── sample_dataset/                     # Benchmark mapping dataset of resident home space
    ├── camera_intrinsics.json          # Pinhole radial sensor calibration matrix
    ├── camera_poses.json               # 6-DoF trajectory keyframe poses & loop closure
    └── ground_truth_dimensions.json    # Physical laser measurement vs 3D model benchmarks
```

---

## 🛠️ 2. Environment Setup

### Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ with npm
- **Operating System**: Windows / Linux / macOS

### Quick Validation (1-Command Verification)
To execute the automated pipeline and accuracy evaluation test suite:

```bash
python test/reconstruction_test_runner.py
```

This verifies:
1. Sensor intrinsics calibration reprojection error ($< 0.50\,\text{px}$)
2. SOP capture serpentine trajectory and $78.4\%$ frame overlap
3. Loop closure convergence at origin
4. Metric dimensional accuracy ($0.62\,\text{cm}$ Mean Absolute Error vs physical laser measurements)
5. Topological NavMesh node and edge connectivity

---

## 🏗️ 3. Full 3D Reconstruction Pipeline Setup Instructions

The TrityaLok 3D digital twin reconstruction pipeline follows a 9-stage modular workflow:

```
[Smartphone Video / Photos]
           │
           ▼
[Stage 1: Frame Ingestion & Validation]
  • Extract sharp keyframes using Laplacian variance threshold (> 100.0)
  • Validate uniform lighting (ambient lux > 150)
           │
           ▼
[Stage 2: Camera Calibration & SfM (COLMAP)]
  • Calibrate focal length and radial distortion (k1, k2, p1, p2)
  • Solve 6-DoF camera poses and estimate initial sparse 3D point cloud
           │
           ▼
[Stage 3: Dense Point Cloud & Gaussian Splatting]
  • Dense depth-map stereo reconstruction with Open3D patch match
  • 3D Gaussian Splatting (3DGS) continuous volumetric radiance field training
           │
           ▼
[Stage 4: Surface Mesh & Texture Baking]
  • Screened Poisson surface reconstruction for watertight polygon geometry
  • PBR diffuse, ambient occlusion, and roughness texture atlas baking
           │
           ▼
[Stage 5: Optimization & Web Delivery]
  • Draco mesh compression reducing asset payload by 78%
  • glTF/GLB web asset export for 60 FPS WebGL rendering
```

### Running the Full Pipeline Locally
```bash
# 1. Install Python dependencies
pip install -r backend/requirements.txt

# 2. Run Backend API Server
cd backend
uvicorn main:app --reload --port 8000

# 3. In another terminal, run Frontend Web Viewer
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
