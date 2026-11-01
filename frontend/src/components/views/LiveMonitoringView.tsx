import React from 'react';
import { Activity, Users, ShieldAlert, Zap } from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Live Spatial Monitoring</h1>
          </div>
          <p className="text-xs text-slate-400">Real-time occupancy estimation, crowd density, and safety monitoring.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Occupancy', value: '42', icon: Users, color: 'text-cyan-400' },
          { label: 'Crowd Density', value: 'Low', icon: Activity, color: 'text-emerald-400' },
          { label: 'Safety Incidents', value: '0', icon: ShieldAlert, color: 'text-red-400' },
          { label: 'Active Alerts', value: '0', icon: Zap, color: 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#0B0F19]/85 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl min-h-[300px] flex items-center justify-center">
        <p className="text-xs text-slate-500 italic">Spatial activity heatmap data feed visualization would render here.</p>
      </div>
    </div>
  );
};
