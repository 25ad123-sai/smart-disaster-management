import React, { useState } from 'react';
import { 
  Activity, 
  Compass, 
  BrainCircuit, 
  ShieldAlert, 
  Navigation, 
  MessageSquare, 
  Network, 
  LayoutDashboard,
  Radio,
  FileText,
  Play,
  Layers
} from 'lucide-react';
import { SDMSProvider, useSDMS } from './context/SDMSContext';
import { Header } from './components/common/Header';
import { DegradedBanner } from './components/common/DegradedBanner';
import { IoTSensorLayer } from './components/modules/IoTSensorLayer';
import { GISSpatialLayer } from './components/modules/GISSpatialLayer';
import { AIPredictionLayer } from './components/modules/AIPredictionLayer';
import { MisinformationLayer } from './components/modules/MisinformationLayer';
import { DroneAssessmentLayer } from './components/modules/DroneAssessmentLayer';
import { CitizenChatLayer } from './components/modules/CitizenChatLayer';
import { CoordinationLayer } from './components/modules/CoordinationLayer';
import { ArchitectureDocModal } from './components/modules/ArchitectureDocModal';
import { DemoScriptModal } from './components/modules/DemoScriptModal';

type ActiveTab = 
  | 'overview'
  | 'iot'
  | 'gis'
  | 'ai'
  | 'misinfo'
  | 'drone'
  | 'chat'
  | 'coordination';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { 
    isDemoModalOpen, 
    setIsDemoModalOpen, 
    isArchModalOpen, 
    setIsArchModalOpen,
    connectivityMode,
    sensors,
    mcdmRankings,
    reports,
    droneMission
  } = useSDMS();

  const criticalSensors = sensors.filter(s => s.status === 'critical').length;
  const flaggedReports = reports.filter(r => r.verificationStatus === 'contradicted_by_iot').length;

  const tabs = [
    { id: 'overview', label: 'Unified Command', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'iot', label: '1. IoT Sensors', icon: <Activity className="w-4 h-4" />, badge: criticalSensors > 0 ? `${criticalSensors}` : undefined, badgeColor: 'bg-rose-500' },
    { id: 'gis', label: '2. GIS & MCDM', icon: <Compass className="w-4 h-4" /> },
    { id: 'ai', label: '3. AI Prediction & XAI', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'misinfo', label: '4. Misinformation', icon: <ShieldAlert className="w-4 h-4" />, badge: flaggedReports > 0 ? `${flaggedReports}` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'drone', label: '5. Drone Recon', icon: <Navigation className="w-4 h-4" /> },
    { id: 'chat', label: '6. Citizen Assistance', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'coordination', label: '7. Coordination & Sync', icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Platform Header */}
      <Header />

      {/* Explicit Degraded / Offline Status Banner */}
      <DegradedBanner />

      {/* Layer Navigation Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[61px] z-30 px-4 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB 0: Unified Command Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Mission Critical KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Network Architecture</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    connectivityMode === 'online' ? 'bg-emerald-500' : connectivityMode === 'degraded_mesh' ? 'bg-amber-500' : 'bg-rose-500'
                  } animate-pulse`} />
                  <span className="text-sm font-bold uppercase text-white font-mono">
                    {connectivityMode.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Graceful Edge Fallback Active</span>
              </div>

              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Top Hazard Risk Sector</span>
                <span className="text-sm font-bold text-rose-400 truncate block">
                  {mcdmRankings[0]?.zoneName || 'Canal Basin'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  Rank 1 (AHP Score {mcdmRankings[0]?.compositeRiskScore}/100)
                </span>
              </div>

              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">IoT Node Integrity</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-sky-400 font-mono">
                    {sensors.length} Nodes Active
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {criticalSensors} Alert(s) • Last Known Good (LKG) Ready
                </span>
              </div>

              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Reconnaissance Drone</span>
                <span className="text-sm font-bold text-purple-400 font-mono">
                  {droneMission.droneCallsign}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {droneMission.detectedDetections.length} Targets • {droneMission.activeInferenceMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Top Row: Primary GIS Map with MCDM Support */}
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Integrated GIS Common Operating Picture (COP)</h3>
                </div>
                <button
                  onClick={() => setActiveTab('gis')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Full GIS Layer →
                </button>
              </div>
              <GISSpatialLayer />
            </div>

            {/* Bottom Two-Column: IoT Sensor Health & Misinformation Cross-Check */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* IoT Sensor Highlights */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" />
                    <h3 className="text-sm font-bold text-white">IoT Mesh Telemetry</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('iot')}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    All Sensors ({sensors.length}) →
                  </button>
                </div>
                <IoTSensorLayer />
              </div>

              {/* Misinformation & Rumor Verification */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-white">Misinformation & Rumor Filter</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('misinfo')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View Verification Queue →
                  </button>
                </div>
                <MisinformationLayer />
              </div>

            </div>

            {/* Third Row: Drone Recon + Citizen Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Aerial Recon & Edge Computer Vision</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('drone')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Drone Mission Details →
                  </button>
                </div>
                <DroneAssessmentLayer />
              </div>

              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Citizen Assistance & Evacuation</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Citizen Chat Interface →
                  </button>
                </div>
                <CitizenChatLayer />
              </div>
            </div>

          </div>
        )}

        {/* Dedicated Single-Module Tabs */}
        {activeTab === 'iot' && <IoTSensorLayer />}
        {activeTab === 'gis' && <GISSpatialLayer />}
        {activeTab === 'ai' && <AIPredictionLayer />}
        {activeTab === 'misinfo' && <MisinformationLayer />}
        {activeTab === 'drone' && <DroneAssessmentLayer />}
        {activeTab === 'chat' && <CitizenChatLayer />}
        {activeTab === 'coordination' && <CoordinationLayer />}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-4 px-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">SDMS</span>
            <span>• Smart Disaster Management System</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">Connectivity-Resilient Multi-Pillar Pipeline</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="text-sky-400 hover:underline font-medium"
            >
              System Architecture & README
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-indigo-400 hover:underline font-medium"
            >
              5-Step Demonstration Script
            </button>
          </div>
        </div>
      </footer>

      {/* Deliverable Modals */}
      <ArchitectureDocModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      <DemoScriptModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <SDMSProvider>
      <DashboardContent />
    </SDMSProvider>
  );
}
