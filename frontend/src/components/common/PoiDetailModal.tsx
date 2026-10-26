import React from 'react';
import {
  MapPin,
  Route,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  Tag,
  Accessibility
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PoiDetailModal: React.FC = () => {
  const {
    selectedPoi,
    setSelectedPoi,
    isPoiModalOpen,
    setIsPoiModalOpen,
    setStartNodeId,
    setDestinationPoiId,
    calculateCurrentRoute,
    setActiveSection,
  } = useAppStore();

  if (!isPoiModalOpen || !selectedPoi) return null;

  const handleStartRoute = () => {
    setStartNodeId('n_f1_entrance');
    setDestinationPoiId(selectedPoi.id);
    calculateCurrentRoute();
    setIsPoiModalOpen(false);
    setActiveSection('navigation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsPoiModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {selectedPoi.category}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Floor {selectedPoi.floor_id} • Room {selectedPoi.room_number || 'N/A'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {selectedPoi.name}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {selectedPoi.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-elevated border border-surface-border text-xs font-mono">
          <div>
            <span className="text-slate-500 block mb-0.5">OPENING HOURS</span>
            <span className="text-slate-200 font-semibold">{selectedPoi.opening_hours}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">OPERATIONAL STATUS</span>
            <span className="text-emerald-400 font-semibold">{selectedPoi.current_status}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">WHEELCHAIR ACCESS</span>
            <span className={selectedPoi.accessibility ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
              {selectedPoi.accessibility ? "Step-Free Accessible" : "Stairs Required"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">SPATIAL COORDINATES</span>
            <span className="text-cyan-400 font-semibold">
              X:{selectedPoi.coordinates.x} Y:{selectedPoi.coordinates.y} Z:{selectedPoi.coordinates.z}
            </span>
          </div>
        </div>

        {/* Facilities / Equipment */}
        {selectedPoi.related_facilities.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Facilities & Amenities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedPoi.related_facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-900 text-slate-300 border border-surface-border font-mono"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleStartRoute}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center justify-center gap-2"
          >
            <Route className="w-4 h-4 stroke-[2.5]" />
            <span>Navigate to this POI</span>
          </button>
          <button
            onClick={() => setIsPoiModalOpen(false)}
            className="py-3 px-4 rounded-xl text-sm font-semibold bg-surface-elevated hover:bg-slate-800 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
