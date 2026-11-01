import React from 'react';
import { Settings, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const handleCalibration = (type: string) => {
    alert(`Starting ${type} calibration. Please follow on-screen prompts to move your device...`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/30">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Settings & Calibration</h1>
          </div>
          <p className="text-xs text-slate-400">Configure sensors, calibrate spatial origin, and device settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-200">Sensor Calibration</h2>
          <div className="space-y-3">
             <button
               onClick={() => handleCalibration('IMU')}
               className="w-full flex items-center justify-between p-4 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#1F293D] text-left cursor-pointer"
             >
               <div>
                 <div className="text-xs font-bold text-white">Device IMU Calibration</div>
                 <div className="text-[11px] text-slate-400 mt-0.5">Calibrate accelerometer, gyroscope, and compass.</div>
               </div>
               <RefreshCw className="w-4 h-4 text-slate-400" />
             </button>
             <button
               onClick={() => handleCalibration('Spatial Origin')}
               className="w-full flex items-center justify-between p-4 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#1F293D] text-left cursor-pointer"
             >
               <div>
                 <div className="text-xs font-bold text-white">Spatial Origin Alignment</div>
                 <div className="text-[11px] text-slate-400 mt-0.5">Establish 3D origin and floor-level coordinates.</div>
               </div>
               <Smartphone className="w-4 h-4 text-slate-400" />
             </button>
          </div>
        </div>
        <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-200">System Preferences</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#111827] border border-[#1F293D]">
            <div className="text-xs text-white">Auto-Sensor Fusion</div>
            <div className="w-10 h-5 rounded-full bg-emerald-500 relative cursor-pointer" onClick={() => alert('Sensor fusion toggled.')}>
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#111827] border border-[#1F293D]">
            <div className="text-xs text-white">Enable AI Spatial Assistant</div>
            <div className="w-10 h-5 rounded-full bg-emerald-500 relative cursor-pointer" onClick={() => alert('AI Assistant toggled.')}>
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
