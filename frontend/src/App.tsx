import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { ScanSpaceView } from './components/views/ScanSpaceView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { PathfindingView } from './components/views/PathfindingView';
import { RadarHUDView } from './components/views/RadarHUDView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { FloorPlanView } from './components/views/FloorPlanView';
import { ArNavView } from './components/views/ArNavView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ProjectsView } from './components/views/ProjectsView';
import { SettingsView } from './components/views/SettingsView';
import { TechSpecsDrawer } from './components/common/TechSpecsDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

export const App: React.FC = () => {
  const { activeSection } = useAppStore();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'scan':
        return <ScanSpaceView />;
      case 'twin':
        return <DigitalTwinView />;
      case 'pathfinding':
        return <PathfindingView />;
      case 'radar':
        return <RadarHUDView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'floorplan':
        return <FloorPlanView />;
      case 'ar-nav':
        return <ArNavView />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'projects':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-slate-100 font-sans">
      {/* Collapsible Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic View Body with Mobile Bottom Padding */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderActiveSection()}
        </main>

        {/* Mobile Touch Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>

      {/* Technical Architecture Drawer */}
      <TechSpecsDrawer />
    </div>
  );
};

export default App;
