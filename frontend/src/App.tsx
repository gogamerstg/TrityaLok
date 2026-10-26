import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { ScanSpaceView } from './components/views/ScanSpaceView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { ExploreView } from './components/views/ExploreView';
import { NavigationPlannerView } from './components/views/NavigationPlannerView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SpatialIntelligenceView } from './components/views/SpatialIntelligenceView';
import { PoiDetailModal } from './components/common/PoiDetailModal';
import { ArNavigationModal } from './components/views/ArNavigationModal';
import { LiveDemoModal } from './components/views/LiveDemoModal';
import { TechSpecsDrawer } from './components/common/TechSpecsDrawer';

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
      case 'explore':
        return <ExploreView />;
      case 'navigation':
        return <NavigationPlannerView />;
      case 'ai':
        return <AiAssistantView />;
      case 'analytics':
        return <SpatialIntelligenceView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-slate-100 font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveSection()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <PoiDetailModal />
      <ArNavigationModal />
      <LiveDemoModal />
      <TechSpecsDrawer />
    </div>
  );
};

export default App;
