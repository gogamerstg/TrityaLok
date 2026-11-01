import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Radio, Wifi, Bluetooth, Activity, Compass, Shield, Zap, RefreshCw } from 'lucide-react';

export const RadarHUDView: React.FC = () => {
  const { building } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'wifi' | 'ble' | 'imu'>('all');
  const [radarMode, setRadarMode] = useState<'2d' | '3d'>('2d');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Multi-Spectrum Radar & Sensor HUD</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-sensor telemetry (Wi-Fi RSSI 2.4/5GHz, BLE Beacons, IMU Gyro/Accel).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#111827] border border-[#1F293D] rounded-xl p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Sensors
            </button>
            <button
              onClick={() => setActiveTab('wifi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'wifi' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wi-Fi APs
            </button>
            <button
              onClick={() => setActiveTab('ble')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ble' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              BLE Beacons
            </button>
            <button
              onClick={() => setActiveTab('imu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'imu' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              IMU / VIO
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Visualizer Card */}
        <div className="lg:col-span-2 bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
          {/* Radar background circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div className="w-[360px] h-[360px] rounded-full border border-amber-500/30 absolute" />
            <div className="w-[260px] h-[260px] rounded-full border border-amber-500/30 absolute" />
            <div className="w-[160px] h-[160px] rounded-full border border-amber-500/30 absolute" />
            <div className="w-[60px] h-[60px] rounded-full border border-amber-500/30 absolute" />
            <div className="w-full h-[1px] bg-amber-500/20 absolute" />
            <div className="h-full w-[1px] bg-amber-500/20 absolute" />
          </div>

          {/* Sweeper beam animation */}
          <div className="absolute w-[180px] h-[180px] origin-bottom-right rounded-tl-full bg-gradient-to-tr from-amber-500/20 to-transparent animate-spin duration-3000 pointer-events-none" />

          {/* Center Position Marker */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-amber-glow animate-pulse">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 mt-2 bg-[#111827] px-2 py-0.5 rounded border border-amber-500/30">
              User Position (0, 0, 0)
            </span>
          </div>

          {/* Simulated beacons floating */}
          <div className="absolute top-16 left-24 flex items-center gap-1.5 bg-[#111827]/90 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-white">AP_IITB_5G (-54 dBm)</span>
          </div>

          <div className="absolute bottom-20 right-28 flex items-center gap-1.5 bg-[#111827]/90 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
            <Bluetooth className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono text-white">BLE_Beacon_04 (-68 dBm)</span>
          </div>

          <div className="absolute bottom-12 left-20 flex items-center gap-1.5 bg-[#111827]/90 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-white">IMU Drift: 0.12°/s</span>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Sensor Health & Metrics</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-cyan-400" />
                <span>Wi-Fi 2.4/5GHz</span>
              </div>
              <span className="text-emerald-400 font-bold">ACTIVE (99.8%)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bluetooth className="w-4 h-4 text-violet-400" />
                <span>Bluetooth BLE</span>
              </div>
              <span className="text-emerald-400 font-bold">12 Beacons</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>IMU Gyro / Accel</span>
              </div>
              <span className="text-emerald-400 font-bold">200 Hz Sync</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Sensor Fusion EKF</span>
              </div>
              <span className="text-emerald-400 font-bold">Stable (0.02m)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
            <div className="font-bold">Multi-Spectrum Fusion Active</div>
            <p className="text-[11px] text-amber-300/80">
              Extended Kalman Filter continuously corrects visual SLAM drift using RF RSSI fingerprinting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
