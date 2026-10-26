import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Box,
  Compass,
  Navigation,
  Bot,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Cpu,
  Radio
} from 'lucide-react';
import { useAppStore, MainSection } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    setSidebarCollapsed,
    setIsLiveDemoModalOpen,
    setIsTechSpecsOpen,
  } = useAppStore();

  const navItems: Array<{ id: MainSection; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Space (SfM)', icon: ScanLine, badge: '9-STAGE', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'twin', label: 'Digital Twin 3D', icon: Box, badge: 'WebGL', badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    { id: 'explore', label: 'POI Directory', icon: Compass, badge: '13 POIs', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'navigation', label: 'A* Navigation', icon: Navigation, badge: 'Obstacle A*', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'ai', label: 'NEXUS Spatial AI', icon: Bot, badge: 'Voice', badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    { id: 'analytics', label: 'Spatial Analytics', icon: BarChart3, badge: 'Heatmap', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col bg-[#070A0F]/95 backdrop-blur-2xl border-r border-[#1F293D] transition-all duration-300 shadow-2xl ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-4 border-b border-[#1F293D]/80 bg-[#0B0F19]/60">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            {/* Holographic Cube Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-violet-600 p-[1.5px] shadow-cyan-glow">
              <div className="w-full h-full bg-[#070A0F] rounded-[10px] flex items-center justify-center">
                <Box className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">NEXUS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  IITB
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight">
                Indoor Digital Twin
              </p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1.5px] shadow-cyan-glow">
            <div className="w-full h-full bg-[#070A0F] rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#172033] transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#111827]/80 border border-transparent'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-cyan-glow" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'text-slate-400 bg-[#172033] border-[#1F293D]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Competition Action: Live Demo Mode */}
        <div className="pt-4 border-t border-[#1F293D]/80 mt-4">
          <button
            onClick={() => setIsLiveDemoModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-transparent text-amber-300 border border-amber-500/40 hover:border-amber-300 shadow-amber-glow transition-all group"
            title="Launch 1-Click Competition Scenarios"
          >
            <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span>Live Demo Mode</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/30 text-amber-200 rounded-full font-extrabold border border-amber-400/50">
                    JUDGE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-normal mt-0.5">1-Click Scenarios</p>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Footer Info & Tech Specs */}
      <div className="p-3 border-t border-[#1F293D]/80 bg-[#0B0F19]/40 space-y-2">
        {!sidebarCollapsed && (
          <div className="p-3 rounded-xl bg-[#111827]/80 border border-[#1F293D]">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">Techfest Namma Space</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              IIT Bombay 3D Twin & Pathfinding Engine
            </p>
          </div>
        )}

        <button
          onClick={() => setIsTechSpecsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-[#172033] border border-transparent hover:border-cyan-500/30 transition-all"
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          {!sidebarCollapsed && <span>System Specs & Roadmap</span>}
        </button>
      </div>
    </aside>
  );
};
