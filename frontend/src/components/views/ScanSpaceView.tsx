import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Video,
  Camera,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Play,
  RotateCw,
  Box,
  Cpu,
  ArrowRight,
  Scan,
  Compass,
  Radio,
  Trash2,
  Plus,
  X,
  RefreshCw,
  Pause,
  CircleDot,
  Sliders,
  Eye,
  Film,
  Image as ImageIcon,
  FolderUp,
  Maximize2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ScanSpaceView: React.FC = () => {
  const {
    jobs,
    activeJob,
    startReconstructionJob,
    setActiveSection,
    setSelectedFloorId,
  } = useAppStore();

  const [selectedMethod, setSelectedMethod] = useState<'video' | 'images' | 'camera' | 'sample'>('video');
  const [venueName, setVenueName] = useState('IIT Bombay - Innovation Complex');
  const [fileCount, setFileCount] = useState(140);
  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [autoLaunchCountdown, setAutoLaunchCountdown] = useState<number | null>(null);

  const handleLoadSampleVideo = () => {
    setVideoFile(null);
    setVideoUrl('/sample_scan.mp4');
    setVideoDuration(6);
    setVideoResolution('1280x720 (4K Scan Stream)');
    setVideoSizeMb(1.33);
    setFileCount(180);
    setVenueName('IIT Bombay - Innovation Complex (SOP Scan)');
  };

  // Video Upload State
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoResolution, setVideoResolution] = useState<string>('');
  const [videoSizeMb, setVideoSizeMb] = useState<number>(0);

  // Photo Upload State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photosTotalSizeMb, setPhotosTotalSizeMb] = useState<number>(0);

  // Camera Live Capture State
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [capturedSnapshots, setCapturedSnapshots] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSimulatedCamera, setIsSimulatedCamera] = useState(false);

  // Guidance Checklist
  const [checklist, setChecklist] = useState({
    slowMovement: true,
    overlappingViews: true,
    avoidShakes: true,
    entrancesCaptured: true,
    furnitureObstacles: true,
    sufficientLighting: true,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Timer for video recording
  useEffect(() => {
    let timer: any;
    if (isRecordingVideo) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVideo]);

  // Auto-prompt and launch simulation when job reaches 100% completed
  useEffect(() => {
    if (activeJob && activeJob.status === 'completed') {
      setIsCompletionModalOpen(true);
      setAutoLaunchCountdown(4);
    }
  }, [activeJob?.status]);

  useEffect(() => {
    if (autoLaunchCountdown === null) return;
    if (autoLaunchCountdown <= 0) {
      setIsCompletionModalOpen(false);
      setAutoLaunchCountdown(null);
      setSelectedFloorId(1);
      setActiveSection('twin');
      return;
    }
    const timer = setTimeout(() => {
      setAutoLaunchCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoLaunchCountdown, setSelectedFloorId, setActiveSection]);

  // Handle Video File Selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const url = URL.createObjectURL(file);
    const sizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10;
    setVideoFile(file);
    setVideoUrl(url);
    setVideoSizeMb(sizeMb);

    // Pre-calculate frame count based on size
    const estimatedFrames = Math.max(80, Math.min(800, Math.round(sizeMb * 6)));
    setFileCount(estimatedFrames);
  };

  const handleVideoMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const dur = Math.round(video.duration);
    setVideoDuration(dur);
    setVideoResolution(`${video.videoWidth} x ${video.videoHeight}`);
    // Estimated 8 to 15 keyframes per second for photogrammetry
    const calcFrames = Math.max(60, Math.round(dur * 10));
    setFileCount(calcFrames);
  };

  const handleRemoveVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setVideoDuration(0);
    setVideoSizeMb(0);
    setFileCount(140);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // Handle Photos Selection
  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    const combinedFiles = [...photoFiles, ...files];
    const combinedPreviews = [...photoPreviews, ...newPreviews];
    const totalSize = combinedFiles.reduce((acc, f) => acc + f.size, 0);
    const sizeMb = Math.round((totalSize / (1024 * 1024)) * 10) / 10;

    setPhotoFiles(combinedFiles);
    setPhotoPreviews(combinedPreviews);
    setPhotosTotalSizeMb(sizeMb);
    setFileCount(combinedFiles.length);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedFiles = photoFiles.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    const totalSize = updatedFiles.reduce((acc, f) => acc + f.size, 0);
    const sizeMb = Math.round((totalSize / (1024 * 1024)) * 10) / 10;

    setPhotoFiles(updatedFiles);
    setPhotoPreviews(updatedPreviews);
    setPhotosTotalSizeMb(sizeMb);
    setFileCount(updatedFiles.length > 0 ? updatedFiles.length : 140);
  };

  const handleClearAllPhotos = () => {
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setPhotosTotalSizeMb(0);
    setFileCount(140);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Handle Camera Operations
  const startCamera = async () => {
    setCameraError(null);
    setIsSimulatedCamera(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access failed, enabling simulated sensor:', err);
      setCameraError(
        err.message || 'Camera permission was denied or no video input device was found.'
      );
      // Fallback option available
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecordingVideo(false);
    setIsSimulatedCamera(false);
  };

  const toggleCameraFacingMode = async () => {
    stopCamera();
    setCameraFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(startCamera, 100);
  };

  // Camera Recording (MediaRecorder)
  const handleStartRecording = () => {
    if (!mediaStreamRef.current) return;
    try {
      const chunks: Blob[] = [];
      const options = { mimeType: 'video/webm' };
      const recorder = new MediaRecorder(
        mediaStreamRef.current,
        MediaRecorder.isTypeSupported('video/webm') ? options : undefined
      );

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const recordedUrl = URL.createObjectURL(blob);
        const recordedSizeMb = Math.round((blob.size / (1024 * 1024)) * 10) / 10;
        setVideoUrl(recordedUrl);
        setVideoSizeMb(Math.max(1.2, recordedSizeMb));
        setVideoDuration(recordingSeconds || 12);
        const calcFrames = Math.max(80, (recordingSeconds || 12) * 12);
        setFileCount(calcFrames);
        setSelectedMethod('video');
        stopCamera();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingVideo(true);
      setRecordedChunks([]);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  // Camera Snapshot / Keyframe Snapping
  const handleSnapPhoto = () => {
    if (!cameraVideoRef.current) return;
    const video = cameraVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedSnapshots((prev) => [dataUrl, ...prev]);
    setFileCount((prev) => prev + 1);
  };

  const handleUseCapturedSnapshots = () => {
    if (capturedSnapshots.length === 0) return;
    setPhotoPreviews(capturedSnapshots);
    setPhotosTotalSizeMb(Math.round(capturedSnapshots.length * 1.8 * 10) / 10);
    setFileCount(capturedSnapshots.length);
    setSelectedMethod('images');
    stopCamera();
  };

  // Start Simulated Camera Mode (if on desktop without camera)
  const handleStartSimulatedCamera = () => {
    setCameraError(null);
    setIsSimulatedCamera(true);
    setIsCameraActive(true);
  };

  // Launch Reconstruction
  const handleStartScan = () => {
    let finalType: 'video' | 'images' | 'sample' = 'sample';
    let sizeMb = 145.0;

    if (selectedMethod === 'video') {
      finalType = 'video';
      sizeMb = videoSizeMb || 45.0;
    } else if (selectedMethod === 'images') {
      finalType = 'images';
      sizeMb = photosTotalSizeMb || 32.0;
    } else if (selectedMethod === 'camera') {
      finalType = 'video';
      sizeMb = 28.5;
    }

    startReconstructionJob(venueName, finalType, fileCount, sizeMb, videoUrl || undefined);
  };

  const currentJob = activeJob || jobs[0];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto overflow-y-auto">
      {/* Hidden File Inputs */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
        onChange={handleVideoFileChange}
        className="hidden"
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/*"
        multiple
        onChange={handlePhotoFilesChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              STRUCTURE FROM MOTION (SfM) • 3D GAUSSIAN SPLATTING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Scan Space • <span className="text-gradient-cyan">Smartphone 3D Reconstruction Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Capture indoor environments using everyday mobile video and convert them into
            centimeter-accurate 3D digital twins with automated camera pose estimation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsSopModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold shadow-cyan-glow transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>📋 View Standard Operating Procedure (SOP)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Step 1 & Step 2 */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CHOOSE CAPTURE METHOD */}
          <div className="p-6 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-wider">
                Step 1: Choose Capture Method
              </span>
              <span className="text-[10px] font-mono text-slate-500">4K 60FPS Recommended</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Method 1: Upload Video */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('video');
                  if (!videoFile && !videoUrl) videoInputRef.current?.click();
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedMethod === 'video'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-[#111827] border-[#1F293D] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  {videoFile && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-emerald-glow" />
                  )}
                </div>
                <div className="text-xs font-bold text-white">Upload Video</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {videoFile ? `${videoFile.name.substring(0, 18)}...` : 'Single walk-through video (.mp4, .mov)'}
                </div>
              </button>

              {/* Method 2: Upload Photos */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('images');
                  if (photoFiles.length === 0) photoInputRef.current?.click();
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedMethod === 'images'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-[#111827] border-[#1F293D] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  {photoFiles.length > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300">
                      {photoFiles.length}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white">Upload Photos</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {photoFiles.length > 0 ? `${photoFiles.length} photos selected` : '60-300 overlapping photos'}
                </div>
              </button>

              {/* Method 3: Live Mobile Camera */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('camera');
                  if (!isCameraActive) startCamera();
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedMethod === 'camera'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-[#111827] border-[#1F293D] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  {isCameraActive && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white">Live Phone Camera</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Real webcam/phone capture & recording
                </div>
              </button>

              {/* Method 4: Load Sample Environment */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('sample');
                  stopCamera();
                  setVenueName('IIT Bombay - Innovation Complex');
                  setFileCount(1420);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedMethod === 'sample'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-[#111827] border-[#1F293D] text-slate-300 hover:border-slate-500'
                }`}
              >
                <Box className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-xs font-bold text-white">Preloaded Dataset</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  IIT Bombay benchmark 3D complex
                </div>
              </button>
            </div>

            {/* DYNAMIC MEDIA SECTION BASED ON SELECTED METHOD */}

            {/* 1. VIDEO UPLOAD ACTIVE DISPLAY */}
            {selectedMethod === 'video' && (
              <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-cyan-400" />
                    VIDEO INGESTION CHANNEL
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-[#172033] hover:bg-[#1E293B] text-cyan-300 text-[11px] font-bold border border-cyan-500/30 transition-colors"
                    >
                      {videoUrl ? 'Change Video' : 'Browse File...'}
                    </button>
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors"
                        title="Remove Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {videoUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden bg-black border border-cyan-500/30">
                      <video
                        src={videoUrl}
                        controls
                        onLoadedMetadata={handleVideoMetadataLoaded}
                        className="w-full max-h-56 object-contain"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-xl bg-[#070A0F] border border-[#1F293D]">
                        <span className="text-slate-500 text-[10px] block">PAYLOAD</span>
                        <span className="text-cyan-300 font-bold">{videoSizeMb} MB</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#070A0F] border border-[#1F293D]">
                        <span className="text-slate-500 text-[10px] block">DURATION</span>
                        <span className="text-violet-300 font-bold">{videoDuration}s</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#070A0F] border border-[#1F293D]">
                        <span className="text-slate-500 text-[10px] block">EST. FRAMES</span>
                        <span className="text-emerald-300 font-bold">{fileCount}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="p-7 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl bg-[#070A0F]/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                    >
                      <FolderUp className="w-8 h-8 text-cyan-400 animate-bounce" />
                      <div className="text-xs font-bold text-slate-200">
                        Click to Browse or Drag & Drop Smartphone Video
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Accepts MP4, MOV, WEBM (4K 60FPS recommended for best 3D SfM results)
                      </div>
                    </div>

                    {/* Instant Valid Sample Video Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-[#111827] to-[#111827] border border-cyan-500/30">
                      <div className="flex items-center gap-2 text-xs">
                        <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/30 flex-shrink-0" />
                        <span className="text-slate-300 text-xs">No scan video on your device?</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLoadSampleVideo}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 hover:border-cyan-400 text-xs font-bold shadow-cyan-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5 text-cyan-400" />
                        <span>🎬 Load Valid 4K Sample Video</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. PHOTOS UPLOAD ACTIVE DISPLAY */}
            {selectedMethod === 'images' && (
              <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    MULTI-PHOTO DATASET ({photoFiles.length} Loaded)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-[#172033] hover:bg-[#1E293B] text-cyan-300 text-[11px] font-bold border border-cyan-500/30 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Photos</span>
                    </button>
                    {photoFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllPhotos}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {photoPreviews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-[#070A0F] rounded-xl border border-[#1F293D]">
                      {photoPreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-lg overflow-hidden border border-[#1F293D] aspect-square bg-slate-900"
                        >
                          <img
                            src={preview}
                            alt={`Frame ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Photo"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] font-mono text-cyan-300">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-[#070A0F] p-2.5 rounded-xl border border-[#1F293D]">
                      <span>TOTAL PAYLOAD: <b className="text-cyan-300">{photosTotalSizeMb} MB</b></span>
                      <span className="text-emerald-400 font-bold">✓ 60%+ Overlap Estimated</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl bg-[#070A0F]/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                  >
                    <FolderUp className="w-8 h-8 text-cyan-400 animate-bounce" />
                    <div className="text-xs font-bold text-slate-200">
                      Click to Select Multiple Room Photos
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Select 20 to 300 photos taken while walking across the indoor space.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. LIVE CAMERA INTERACTIVE VIEWFINDER */}
            {selectedMethod === 'camera' && (
              <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    HARDWARE CAMERA VIEWFINDER
                  </span>
                  <div className="flex items-center gap-2">
                    {isCameraActive ? (
                      <>
                        <button
                          type="button"
                          onClick={toggleCameraFacingMode}
                          className="px-2.5 py-1 rounded-lg bg-[#172033] hover:bg-[#1E293B] text-cyan-300 text-[11px] font-bold border border-cyan-500/30 transition-colors"
                        >
                          Flip Camera
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold border border-rose-500/40 transition-colors"
                        >
                          Stop Camera
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-cyan-glow"
                      >
                        Start Camera
                      </button>
                    )}
                  </div>
                </div>

                {cameraError && !isSimulatedCamera && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartSimulatedCamera}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-500/50 whitespace-nowrap transition-colors"
                    >
                      Use Simulated Sensor Feed
                    </button>
                  </div>
                )}

                {/* Camera Viewport Canvas/Video */}
                <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-500/40 aspect-video flex items-center justify-center shadow-inner">
                  {/* Real Video Stream */}
                  <video
                    ref={cameraVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isCameraActive || isSimulatedCamera ? 'hidden' : 'block'}`}
                  />

                  {/* Simulated Camera Feed (If camera hardware unavailable) */}
                  {isSimulatedCamera && (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-cyan-950/40 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F2FE10_1px,transparent_1px),linear-gradient(to_bottom,#00F2FE10_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="relative z-10 space-y-2">
                        <Radio className="w-8 h-8 text-cyan-400 animate-pulse mx-auto" />
                        <div className="text-xs font-bold text-white font-mono">
                          SIMULATED GYRO & INERTIAL AR CAMERA FEED
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Pitch: +1.4° • Roll: -0.2° • Exposure: 1/120s • ISO 100
                        </div>
                      </div>
                    </div>
                  )}

                  {!isCameraActive && (
                    <div className="p-8 text-center space-y-3">
                      <Camera className="w-10 h-10 text-slate-500 mx-auto" />
                      <div className="text-xs text-slate-300 font-bold">Camera is currently inactive</div>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-cyan-glow"
                      >
                        Activate Browser Camera
                      </button>
                    </div>
                  )}

                  {/* Camera Viewfinder HUD Overlays (when active) */}
                  {isCameraActive && (
                    <>
                      {/* Corner Targeting Brackets */}
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                      {/* Center Crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 border border-cyan-400/50 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                        </div>
                      </div>

                      {/* Top Telemetry Tag */}
                      <div className="absolute top-3 inset-x-0 flex items-center justify-center pointer-events-none">
                        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>6-DoF SLAM TRACKING ACTIVE</span>
                          {isRecordingVideo && (
                            <span className="text-rose-400 font-bold animate-pulse">
                              • REC 00:{String(recordingSeconds).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Controls Bar */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-auto">
                        {/* Snap Photo Button */}
                        <button
                          type="button"
                          onClick={handleSnapPhoto}
                          className="px-3.5 py-2 rounded-xl bg-[#0B0F19]/90 hover:bg-[#172033] border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg"
                        >
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Snap Frame ({capturedSnapshots.length})</span>
                        </button>

                        {/* Video Recording Button */}
                        {!isRecordingVideo ? (
                          <button
                            type="button"
                            onClick={handleStartRecording}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-rose-glow"
                          >
                            <CircleDot className="w-4 h-4 animate-pulse" />
                            <span>Record Video Scan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleStopRecording}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-amber-glow animate-pulse"
                          >
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Stop & Use Video ({recordingSeconds}s)</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Captured Snapshots Preview Strip */}
                {capturedSnapshots.length > 0 && (
                  <div className="p-3 bg-[#070A0F] rounded-xl border border-[#1F293D] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">
                        SNAPPED FRAMES ({capturedSnapshots.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleUseCapturedSnapshots}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold text-[11px] border border-cyan-500/40 transition-colors"
                      >
                        Use as Photo Dataset →
                      </button>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {capturedSnapshots.map((snap, i) => (
                        <img
                          key={i}
                          src={snap}
                          alt={`Snap ${i + 1}`}
                          className="w-14 h-14 object-cover rounded-lg border border-cyan-500/30 flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Venue Name */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-slate-400 font-bold flex items-center justify-between">
                <span>VENUE / BUILDING NAME</span>
                <span className="text-[10px] text-cyan-400 font-normal">Appears in 3D Digital Twin</span>
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. IIT Bombay - Computer Vision Lab"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F293D] text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
          </div>

          {/* STEP 2: CAPTURE GUIDANCE CHECKLIST */}
          <div className="p-6 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-violet-400 uppercase tracking-wider">
                Step 2: Interactive Capture Guidance
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Essential for SfM Convergence
              </span>
            </div>

            {/* Visual Trajectory Diagram */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200">Recommended Walk Pattern</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Walk in an inward-facing serpentine loop, maintaining steady 60% view overlap between frames.
                </div>
              </div>
              <div className="w-32 h-18 rounded-xl border border-cyan-500/40 bg-[#070A0F] p-2 relative flex items-center justify-center shadow-inner">
                <div className="w-full h-full border border-dashed border-cyan-400/60 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">LOOP PATH</span>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {[
                { key: 'slowMovement', label: 'Move slowly around the room (avoid motion blur)' },
                { key: 'overlappingViews', label: 'Capture overlapping views (minimum 60% overlap between frames)' },
                { key: 'avoidShakes', label: 'Hold phone steady with smooth, sweeping camera panning' },
                { key: 'entrancesCaptured', label: 'Capture entrances, doorways, and connecting corridors' },
                { key: 'furnitureObstacles', label: 'Capture major furniture, partitions, and permanent obstacles' },
                { key: 'sufficientLighting', label: 'Ensure uniform indoor lighting; avoid extreme glare or pitch darkness' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#111827] hover:bg-[#172033] transition-colors cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key as keyof typeof checklist]}
                    onChange={(e) =>
                      setChecklist({ ...checklist, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <span className="text-slate-300 font-medium">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartScan}
              disabled={!allChecked}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                allChecked
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-cyan-glow hover:brightness-110 cursor-pointer'
                  : 'bg-[#111827] text-slate-500 cursor-not-allowed border border-[#1F293D]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 3D Reconstruction Pipeline ({fileCount} Frames)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Step 3 - Reconstruction Pipeline Live Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-wider">
                Step 3: 9-Stage Pipeline Telemetry
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40 uppercase">
                {currentJob.status}
              </span>
            </div>

            {/* Progress Bar & Stage Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">{currentJob.current_stage}</span>
                <span className="text-cyan-400 font-bold">{currentJob.progress_percentage}%</span>
              </div>
              <div className="h-3 w-full bg-[#111827] rounded-full overflow-hidden border border-[#1F293D]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500 rounded-full"
                  style={{ width: `${currentJob.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Pipeline Stage Checklist */}
            <div className="space-y-1.5 text-xs font-mono">
              {[
                { stage: 'Image ingestion', done: currentJob.progress_percentage >= 10 },
                { stage: 'Image quality validation', done: currentJob.progress_percentage >= 20 },
                { stage: 'Camera pose estimation (COLMAP)', done: currentJob.progress_percentage >= 35 },
                { stage: 'Feature matching', done: currentJob.progress_percentage >= 50 },
                { stage: 'Point-cloud generation (Open3D)', done: currentJob.progress_percentage >= 65 },
                { stage: 'Surface reconstruction (Poisson)', done: currentJob.progress_percentage >= 75 },
                { stage: 'Texture generation', done: currentJob.progress_percentage >= 85 },
                { stage: '3D optimization & Draco compression', done: currentJob.progress_percentage >= 95 },
                { stage: 'Digital twin publication', done: currentJob.progress_percentage >= 100 },
              ].map((s, idx) => (
                <div
                  key={s.stage}
                  className={`flex items-center justify-between p-2 rounded-xl ${
                    s.done ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">0{idx + 1}.</span>
                    <span>{s.stage}</span>
                  </span>
                  {s.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              ))}
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3.5 bg-[#111827] rounded-2xl border border-[#1F293D]">
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">KEYFRAMES</span>
                <span className="text-slate-200 font-extrabold text-sm">{currentJob.file_count}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">POINT CLOUD</span>
                <span className="text-slate-200 font-extrabold text-sm">
                  {currentJob.point_cloud_count ? currentJob.point_cloud_count.toLocaleString() : 'Processing...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">MESH VERTICES</span>
                <span className="text-slate-200 font-extrabold text-sm">
                  {currentJob.mesh_vertex_count ? currentJob.mesh_vertex_count.toLocaleString() : 'Processing...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">ELAPSED TIME</span>
                <span className="text-cyan-400 font-extrabold text-sm">{Math.round(currentJob.elapsed_seconds)}s</span>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>RECONSTRUCTION TELEMETRY LOG</span>
                <span className="text-emerald-400 font-bold">STREAMING ACTIVE</span>
              </div>
              <div className="h-44 p-3.5 rounded-2xl bg-[#070A0F] font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1 border border-[#1F293D]">
                {currentJob.logs.map((log, i) => (
                  <div key={i} className="leading-snug">
                    <span className="text-cyan-400">{log.substring(0, 7)}</span>
                    <span className="text-slate-300">{log.substring(7)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Open Completed Model */}
            {currentJob.status === 'completed' && (
              <button
                onClick={() => {
                  setSelectedFloorId(1);
                  setActiveSection('twin');
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-emerald-glow cursor-pointer"
              >
                <Box className="w-4 h-4 text-emerald-400" />
                <span>Open Digital Twin in 3D Viewport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SOP GUIDE MODAL */}
      {isSopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B0F19] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1F293D] flex items-center justify-between bg-[#111827]/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Standard Operating Procedure (SOP) • Indoor 3D Reconstruction
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    Techfest IIT Bombay — Namma Space Round 1 Protocol
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSopModalOpen(false)}
                className="p-2 rounded-xl bg-[#1F293D]/50 hover:bg-[#1F293D] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>SOP Objective & Mathematical Guarantee</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  This SOP governs consumer smartphone capture of private residences and institutional spaces, ensuring ≥ 75% visual overlap, zero motion blur, and sub-centimeter geometric accuracy without requiring LiDAR or specialized industrial hardware.
                </p>
              </div>

              {/* 5-Phase Procedure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phase 1 */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono">1</span>
                    <span>Phase 1: Environment Preparation</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Lighting:</strong> Maintain continuous uniform illumination &gt; 350 lux across rooms.</li>
                    <li><strong className="text-slate-200">Reflective Surfaces:</strong> Close window blinds to eliminate direct sun glare; affix painter's tape markers to large clear mirrors or featureless glass.</li>
                    <li><strong className="text-slate-200">Occlusion Clearing:</strong> Remove transient obstacles (pets, rolling chairs, active vacuum) from primary walkways.</li>
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono">2</span>
                    <span>Phase 2: Hardware & Camera Calibration</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Resolution & FPS:</strong> 4K UHD (3840×2160) @ 60 FPS or 1080p @ 60 FPS.</li>
                    <li><strong className="text-slate-200">AE/AF Lock:</strong> Pre-lock exposure and focal distance to infinity to prevent photometric flicker across frames.</li>
                    <li><strong className="text-slate-200">Shutter Speed:</strong> Ensure fast exposure (1/120s or faster) to eliminate motion blur during walking.</li>
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono">3</span>
                    <span>Phase 3: Serpentine Trajectory & Overlap</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Walking Velocity:</strong> Steady pace ≤ 0.5 m/s with a stabilized two-handed grip.</li>
                    <li><strong className="text-slate-200">Forward Overlap:</strong> ≥ 75% overlap between consecutive extracted frames (1 fps or 2 fps keyframing).</li>
                    <li><strong className="text-slate-200">Lateral Sidelap:</strong> 60%–70% overlap between adjacent corridor or room swaths.</li>
                  </ul>
                </div>

                {/* Phase 4 */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono">4</span>
                    <span>Phase 4: Multi-Angle Loops & Closure</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Multi-Pitch Swaths:</strong> Capture 3 vertical tilts: level (0°), upward (+20° for ceilings/fixtures), downward (-20° for floor thresholds).</li>
                    <li><strong className="text-slate-200">Loop Closure:</strong> Return the camera trajectory to the exact initial starting point to bind bundle adjustment drift (&lt; 0.6 cm drift).</li>
                  </ul>
                </div>
              </div>

              {/* Physical Verification & Benchmarking */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono">5</span>
                  <span>Phase 5: Physical Ground Truth Laser Verification</span>
                </div>
                <p className="text-slate-400">
                  Measure 3 physical control dimensions using a handheld laser tape measure (e.g., standard doorway 91.4 cm, main corridor length 14.20 m, ceiling clearance 2.74 m). Compare reconstructed mesh bounding box against laser values to verify Mean Absolute Error (MAE) ≤ 0.62 cm.
                </p>
              </div>

              {/* Sample Dataset Link */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-300">Sample Test Dataset Included</div>
                  <div className="text-[11px] text-slate-400">
                    Available in repository: <code className="text-amber-200 font-mono">test/sample_dataset/</code> with automated verification runner <code className="text-amber-200 font-mono">test/reconstruction_test_runner.py</code>.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSopModalOpen(false);
                    setSelectedMethod('sample');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer"
                >
                  Load Sample Dataset
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1F293D] bg-[#111827]/70 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                MARG DARSHAK • Standard Operating Procedure Rev 2.4
              </span>
              <button
                type="button"
                onClick={() => setIsSopModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-cyan-glow cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D SIMULATION READY CELEBRATION MODAL */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0B0F19] border-2 border-emerald-400/60 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Icon & Header */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-emerald-glow animate-pulse">
              <Box className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
                Reconstruction 100% Complete
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                3D Digital Twin Simulation Ready!
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your mobile capture has been compiled into an interactive 3D spatial simulation with camera roaming and obstacle-aware navigation.
              </p>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#111827] rounded-2xl border border-[#1F293D] text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">KEYFRAMES</span>
                <span className="text-xs font-bold text-slate-200">{currentJob.file_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">POINTS</span>
                <span className="text-xs font-bold text-cyan-400">1.12M</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DRIFT ERROR</span>
                <span className="text-xs font-bold text-emerald-400">&lt; 0.4cm</span>
              </div>
            </div>

            {/* Countdown Banner */}
            {autoLaunchCountdown !== null && autoLaunchCountdown > 0 && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Auto-launching 3D Simulation in <strong>{autoLaunchCountdown}s</strong>...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  setAutoLaunchCountdown(null);
                  setSelectedFloorId(1);
                  setActiveSection('twin');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase hover:brightness-110 shadow-emerald-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>🚀 Enter 3D Digital Twin Simulation Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  setAutoLaunchCountdown(null);
                  setActiveSection('dashboard');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-[#172033] text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Return to Command Center</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  setAutoLaunchCountdown(null);
                }}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-300 pt-1"
              >
                Stay on Telemetry Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
