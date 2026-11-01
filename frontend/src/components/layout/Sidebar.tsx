import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Box,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Radio,
  X,
  Sparkles,
  Navigation,
  Bot,
  Map,
  Camera,
  Activity,
  BarChart3,
  FolderKanban,
  Settings
} from 'lucide-react';
import { useAppStore, MainSection } from '../../store/useAppStore';
import { TrityaLokLogo } from '../common/TrityaLokLogo';

export const Sidebar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    setSidebarCollapsed,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    setIsTechSpecsOpen,
  } = useAppStore();

  const navItems: Array<{ id: MainSection; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'LIVE', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'scan', label: 'Spatial Pipeline', icon: ScanLine, badge: '9-STAGE', badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'twin', label: '3D Digital Twin', icon: Box, badge: 'PBR/Roam', badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    { id: 'pathfinding', label: 'A* Pathfinding', icon: Navigation, badge: 'A*', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'radar', label: 'Sensor Radar HUD', icon: Radio, badge: 'Wi-Fi/BLE', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'ai-assistant', label: 'AI Spatial Assistant', icon: Bot, badge: 'Nexus AI', badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { id: 'floorplan', label: '2D Floor Plan', icon: Map, badge: 'Auto-Gen', badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'ar-nav', label: 'AR Indoor Nav', icon: Camera, badge: 'AR Live', badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity, badge: 'Safety', badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30' },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, badge: 'Metrics', badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { id: 'projects', label: 'Project Manager', icon: FolderKanban, badge: 'Files', badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { id: 'settings', label: 'Settings & Calibration', icon: Settings, badge: 'Calibrate', badgeColor: 'text-slate-300 bg-slate-500/10 border-slate-500/30' },
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP COLLAPSIBLE SIDEBAR (Hidden on mobile < md) */}
      {/* ============================================================== */}
      <aside
        className={`hidden md:flex relative z-30 flex-col bg-[#070A0F]/95 backdrop-blur-2xl border-r border-[#1F293D] transition-all duration-300 shadow-2xl ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-18 px-3 border-b border-[#1F293D]/80 bg-[#0B0F19]/60">
          {!sidebarCollapsed && (
            <TrityaLokLogo size={40} showText={true} />
          )}

          {sidebarCollapsed && (
            <div className="mx-auto">
              <TrityaLokLogo size={36} showText={false} />
            </div>
          )}

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#172033] transition-colors ml-1 cursor-pointer"
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
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
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

          {/* Quick Launch Walkthrough CTA */}
          <div className="pt-4 border-t border-[#1F293D]/80 mt-4">
            <button
              onClick={() => setActiveSection('twin')}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-violet-500/10 to-transparent text-cyan-300 border border-cyan-500/40 hover:border-cyan-300 shadow-cyan-glow transition-all group cursor-pointer"
              title="Launch 3D Free-Roaming Walkthrough"
            >
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span>3D Walkthrough</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-500/30 text-cyan-200 rounded-full font-extrabold border border-cyan-400/50">
                      60 FPS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">WASD + Touch D-Pad</p>
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
                <span className="text-xs font-bold text-slate-200">TrityaLok 3D</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Indoor Digital Twin & 3D Roaming
              </p>
            </div>
          )}

          <button
            onClick={() => setIsTechSpecsOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-[#172033] border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            {!sidebarCollapsed && <span>System Specs & Architecture</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE SLIDE-OUT DRAWER (< md screens) */}
      {/* ============================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#070A0F] border-r border-cyan-500/40 flex flex-col z-10 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between h-18 px-4 border-b border-[#1F293D] bg-[#0B0F19]/80">
              <TrityaLokLogo size={36} showText={true} />
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-xl bg-[#172033] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-cyan-glow'
                        : 'text-slate-300 hover:bg-[#111827] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* 3D Walkthrough Action */}
              <button
                onClick={() => {
                  setActiveSection('twin');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full mt-4 flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              >
                <Box className="w-5 h-5 text-cyan-400" />
                <div className="flex-1 text-left">
                  <span>3D Free-Roaming Walkthrough</span>
                  <p className="text-[10px] text-slate-400 font-normal">Touch D-Pad Enabled</p>
                </div>
              </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#1F293D] space-y-2">
              <button
                onClick={() => {
                  setIsTechSpecsOpen(true);
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-xl"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>System Specs & Architecture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
