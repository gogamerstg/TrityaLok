import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { ScanSpaceView } from './components/views/ScanSpaceView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
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
