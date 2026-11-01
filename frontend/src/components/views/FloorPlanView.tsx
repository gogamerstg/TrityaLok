import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Map, Download, Edit3, Move, Layers } from 'lucide-react';

export const FloorPlanView: React.FC = () => {
  const { building } = useAppStore();
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Map className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">2D Floor Plan Studio</h1>
          </div>
          <p className="text-xs text-slate-400">Automated 2D architectural blueprint generation and editing.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Export Blueprint (DXF/PDF)</span>
          </button>
        </div>
      </div>
      <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl min-h-[500px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="text-center space-y-3 relative z-10">
          <Map className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-white">{building.name} - Architectural Floor Plan</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Interactive vector canvas generated from point cloud slicing and wall detection algorithms.
          </p>
        </div>
      </div>
    </div>
  );
};
