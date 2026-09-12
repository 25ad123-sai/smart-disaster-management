import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  ShieldAlert, 
  RefreshCw, 
  Play, 
  FileText, 
  Database,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { ConnectivityMode, UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    connectivityMode,
    setConnectivityMode,
    currentUserRole,
    setCurrentUserRole,
    edgeSyncQueue,
    reconcileSyncQueue,
    triggerDisasterEvent,
    resetToNormal,
    setIsDemoModalOpen,
    setIsArchModalOpen,
    activeDemoStep
  } = useSDMS();

  const roles: { role: UserRole; label: string }[] = [
    { role: 'coordinator', label: 'EOC Commander' },
    { role: 'sensor_operator', label: 'IoT Specialist' },
    { role: 'gis_analyst', label: 'GIS Analyst' },
    { role: 'drone_operator', label: 'Drone Pilot' },
    { role: 'citizen', label: 'Citizen View' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Brand & System Identification */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center shadow-md shadow-rose-950/40">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                SDMS <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Platform v2.4</span>
              </h1>
              <span className="hidden sm:inline text-xs text-rose-400 font-semibold px-2 py-0.5 bg-rose-950/50 border border-rose-800/60 rounded-full animate-pulse">
                Active Resilience Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Smart Disaster Management System • Unified IoT, GIS, AI, Drone & Edge Pipeline
            </p>
          </div>
        </div>

        {/* Action Controls & Resilience Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Connectivity Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="btn-conn-online"
              onClick={() => setConnectivityMode('online')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                connectivityMode === 'online'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Cloud backhaul (100 Mbps, complete cloud inference)"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Full Cloud</span>
            </button>

            <button
              id="btn-conn-mesh"
              onClick={() => setConnectivityMode('degraded_mesh')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                connectivityMode === 'degraded_mesh'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Degraded Tactical Mesh (2.4 kbps LoRa, delta updates only)"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Degraded Mesh</span>
            </button>

            <button
              id="btn-conn-offline"
              onClick={() => setConnectivityMode('offline_islanded')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                connectivityMode === 'offline_islanded'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Zero connectivity (100% offline edge inference & LKG cache)"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Edge</span>
            </button>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1.5">Role:</span>
            <select
              id="select-user-role"
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-sky-400 focus:outline-none cursor-pointer"
            >
              {roles.map(r => (
                <option key={r.role} value={r.role} className="bg-slate-900 text-slate-200">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sync Queue Pill */}
          {edgeSyncQueue.length > 0 && (
            <button
              id="btn-sync-queue"
              onClick={connectivityMode === 'online' ? reconcileSyncQueue : undefined}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                connectivityMode === 'online'
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 hover:bg-emerald-900/80 cursor-pointer animate-pulse'
                  : 'bg-amber-950/40 border-amber-700/60 text-amber-300 cursor-not-allowed'
              }`}
              title={connectivityMode === 'online' ? 'Click to reconcile queued offline packets to cloud' : 'Syncing paused: Re-enable cloud to drain queue'}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Queue: {edgeSyncQueue.length} pkt</span>
              {connectivityMode === 'online' && <RefreshCw className="w-3 h-3 ml-0.5 animate-spin" />}
            </button>
          )}

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex items-center gap-1">
            <button
              id="btn-trigger-disaster"
              onClick={triggerDisasterEvent}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-700/60 text-xs font-medium transition-colors"
              title="Simulate sudden flash flood & seismic tremor"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Simulate Event</span>
            </button>

            <button
              id="btn-reset-baseline"
              onClick={resetToNormal}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              title="Reset all sensors to baseline normal state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demo & Architecture Modals */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
            <button
              id="btn-open-demo"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>5-Step Demo</span>
              {activeDemoStep > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-900 text-[10px] flex items-center justify-center font-bold">
                  {activeDemoStep}
                </span>
              )}
            </button>

            <button
              id="btn-open-arch"
              onClick={() => setIsArchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="View 7-Layer Architecture Diagram & Resilience Spec"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Architecture</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
