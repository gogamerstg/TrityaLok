import React from 'react';
import { Camera, Navigation, ShieldAlert, Sparkles } from 'lucide-react';

export const ArNavView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Camera className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">AR Indoor Navigation</h1>
          </div>
          <p className="text-xs text-slate-400">Smartphone camera-based augmented reality directional overlay.</p>
        </div>
      </div>
      <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] rounded-2xl shadow-xl min-h-[500px] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#070A0F]">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-96 h-96 rounded-full border border-indigo-500/30 animate-ping duration-1000" />
        </div>
        <div className="text-center space-y-4 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center mx-auto shadow-indigo-glow">
            <Navigation className="w-10 h-10 text-indigo-300 animate-bounce" />
          </div>
          <h2 className="text-lg font-bold text-white">AR Camera Feed Ready</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Point your mobile device camera forward to project 3D directional arrows onto the physical environment.
          </p>
        </div>
      </div>
    </div>
  );
};
