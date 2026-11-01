import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Box,
  Menu,
} from 'lucide-react';
import { useAppStore, MainSection } from '../../store/useAppStore';

export const MobileBottomNav: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    setIsMobileDrawerOpen,
  } = useAppStore();

  const mainTabs: Array<{ id: MainSection; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan (SfM)', icon: ScanLine },
    { id: 'twin', label: '3D Free-Roam', icon: Box },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070A0F]/95 backdrop-blur-2xl border-t border-[#1F293D] md:hidden px-3 py-1 flex items-center justify-around shadow-2xl safe-area-pb">
      {mainTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
              isActive
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-10 h-1 rounded-full bg-cyan-400 shadow-cyan-glow" />
            )}
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu Drawer Toggle */}
      <button
        onClick={() => setIsMobileDrawerOpen(true)}
        className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Menu className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
      </button>
    </nav>
  );
};
