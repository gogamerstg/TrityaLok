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
  Layers,
  Cpu,
  Flame
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

  const navItems: Array<{ id: MainSection; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Space', icon: ScanLine, badge: 'SfM' },
    { id: 'twin', label: 'Digital Twin', icon: Box, badge: '3D' },
    { id: 'explore', label: 'Explore & POIs', icon: Compass },
    { id: 'navigation', label: 'Smart Navigation', icon: Navigation, badge: 'A*' },
    { id: 'ai', label: 'AI Assistant', icon: Bot, badge: 'NEXUS' },
    { id: 'analytics', label: 'Spatial Intel', icon: BarChart3 },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-surface-card border-r border-surface-border transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-cyan-glow">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Box className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">NEXUS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
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
          <div className="mx-auto w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-cyan-glow">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Box className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-500/30 text-cyan-200'
                          : 'bg-surface-elevated text-slate-400'
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
        <div className="pt-4 border-t border-surface-border mt-4">
          <button
            onClick={() => setIsLiveDemoModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 shadow-amber-glow transition-all"
            title="Launch 1-Click Competition Scenarios"
          >
            <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span>Live Demo Mode</span>
                  <span className="text-[10px] font-mono px-1 py-0.5 bg-amber-500/30 text-amber-200 rounded">
                    HOT
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-normal">Judge Scenarios</p>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Footer Info & Tech Specs */}
      <div className="p-3 border-t border-surface-border">
        {!sidebarCollapsed && (
          <div className="mb-3 p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Techfest Namma Space</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              IIT Bombay 3D Digital Twin & Autonomous Pathfinding
            </p>
          </div>
        )}

        <button
          onClick={() => setIsTechSpecsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          {!sidebarCollapsed && <span>System Architecture</span>}
        </button>
      </div>
    </aside>
  );
};
