import React, { useState } from 'react';
import { 
  Network, 
  Users, 
  Database, 
  RefreshCw, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Radio, 
  FileText,
  Activity,
  Compass,
  Navigation,
  MessageSquare
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { AgencyLog } from '../../types';

export const CoordinationLayer: React.FC = () => {
  const { 
    currentUserRole, 
    setCurrentUserRole, 
    connectivityMode, 
    edgeSyncQueue, 
    reconcileSyncQueue, 
    agencyLogs, 
    addAgencyLog,
    sensors,
    mcdmRankings,
    droneMission,
    facilities
  } = useSDMS();

  const [newLogAgency, setNewLogAgency] = useState<AgencyLog['agency']>('Metro Fire & Rescue');
  const [newLogPriority, setNewLogPriority] = useState<AgencyLog['priority']>('info');
  const [newLogMessage, setNewLogMessage] = useState('');

  const handlePostLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMessage.trim()) return;
    addAgencyLog(newLogAgency, newLogMessage, newLogPriority);
    setNewLogMessage('');
  };

  return (
    <div className="space-y-4">
      
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              Layer 7: Cloud-Edge Coordination & Multi-Agency Interoperability
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              Distributed Vector Clock Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-agency event logging, role-specific operational perspectives, and disconnected edge queue reconciliation.
          </p>
        </div>

        {/* Sync Queue Summary */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300">Pending Edge Sync: <b>{edgeSyncQueue.length}</b></span>
          </div>

          <button
            onClick={connectivityMode === 'online' ? reconcileSyncQueue : undefined}
            disabled={connectivityMode !== 'online' || edgeSyncQueue.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
              connectivityMode === 'online' && edgeSyncQueue.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconcile Queue</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Operational Perspective Card */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Active Operational Viewpoint:</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-950 border border-sky-700 text-sky-300 uppercase font-mono">
              {currentUserRole.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Quick Role Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {(['coordinator', 'sensor_operator', 'gis_analyst', 'drone_operator', 'citizen'] as const).map(role => (
              <button
                key={role}
                onClick={() => setCurrentUserRole(role)}
                className={`px-2.5 py-1 rounded transition-colors capitalize ${
                  currentUserRole === role
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {role.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Role-Specific Content Projection */}
        {currentUserRole === 'coordinator' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Top Hazard Priority</span>
              <span className="text-sm font-bold text-rose-400">{mcdmRankings[0]?.zoneName || 'Canal Basin'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Rank 1 (AHP Score {mcdmRankings[0]?.compositeRiskScore}/100)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Shelter Intake Remaining</span>
              <span className="text-sm font-bold text-emerald-400">1,555 Beds Free</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Across 2 active shelters</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Critical Bridge Integrity</span>
              <span className="text-sm font-bold text-sky-400">0.03g (Normal)</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">SEISM-02 / Evacuation Route Open</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Network Synchronization</span>
              <span className="text-sm font-bold text-amber-400 uppercase">{connectivityMode.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{edgeSyncQueue.length} packets pending uplink</span>
            </div>
          </div>
        )}

        {currentUserRole === 'sensor_operator' && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Activity className="w-4 h-4" />
              <span>Sensor Mesh Gateway Health:</span>
            </div>
            <p>
              6 of 6 IoT nodes active. Multi-hop LoRa mesh latency is currently 140ms with 3 mesh hops max. Last Known Good (LKG) auto-buffer is enabled across all remote micro-controllers.
            </p>
          </div>
        )}

        {currentUserRole === 'gis_analyst' && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-sky-400">
              <Compass className="w-4 h-4" />
              <span>Geospatial Multi-Criteria Decision Engine:</span>
            </div>
            <p>
              Vector overlays active: Floodplain Digital Elevation Model (DEM), seismic fault trace, and 3 critical facilities. Current primary bottleneck is Canal Basin runoff convergence at 6.2m ASL.
            </p>
          </div>
        )}

        {currentUserRole === 'drone_operator' && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-400">
              <Navigation className="w-4 h-4" />
              <span>Tactical UAV Patrol Feed:</span>
            </div>
            <p>
              SkyGuard VTOL-01 is at 65m altitude. On-device MobileNet edge inference is processing 55 FPS with 18ms latency. 3 localized detections georeferenced and transmitted to mission map.
            </p>
          </div>
        )}

        {currentUserRole === 'citizen' && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <MessageSquare className="w-4 h-4" />
              <span>Citizen Safety Portal:</span>
            </div>
            <p>
              Highland Civic Arena is open and accepting evacuees. Central Bay Bridge is verified SAFE. Avoid Canal Basin road network. Use emergency frequency VHF Ch 16 if mobile data fails.
            </p>
          </div>
        )}
      </div>

      {/* Inter-Agency Event Log & Collaboration Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Collaboration Stream */}
        <div className="lg:col-span-7 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Inter-Agency Coordination Log ({agencyLogs.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Vector Timestamp Verified
            </span>
          </div>

          {/* Logs List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {agencyLogs.map((log) => {
              const isCrit = log.priority === 'critical';
              const isWarn = log.priority === 'warning';
              const isEdgeOnly = log.syncStatus === 'stored_in_edge_cache';

              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isCrit
                      ? 'bg-rose-950/30 border-rose-700/60'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-700/50'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                      <span className="font-bold text-white text-xs">{log.agency}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        isCrit ? 'bg-rose-600 text-white' : isWarn ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.priority}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isEdgeOnly ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                      }`}>
                        {isEdgeOnly ? 'Edge Cache' : 'Synced'}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{log.message}</p>
                </div>
              );
            })}
          </div>

          {/* Post Log Form */}
          <form onSubmit={handlePostLog} className="pt-2 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <select
                value={newLogAgency}
                onChange={(e) => setNewLogAgency(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
              >
                <option value="Red Cross Incident Team">Red Cross Incident Team</option>
                <option value="Metro Fire & Rescue">Metro Fire & Rescue</option>
                <option value="Municipal GIS">Municipal GIS</option>
                <option value="National Weather Service">National Weather Service</option>
              </select>

              <select
                value={newLogPriority}
                onChange={(e) => setNewLogPriority(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLogMessage}
                onChange={(e) => setNewLogMessage(e.target.value)}
                placeholder="Post cross-agency dispatch log (persisted offline)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow"
              >
                Dispatch
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Degraded Mode Sync Queue Packet Inspector */}
        <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Edge Sync Queue Inspector</h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                CRDT / Append-Only Buffer
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              When terrestrial link drops, packets generated across IoT, Drone recon, and Citizen reports are queued locally with monotonic clocks.
            </p>

            {/* Queue List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {edgeSyncQueue.length === 0 ? (
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 text-center text-xs text-slate-500 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto opacity-80" />
                  <p className="font-semibold text-slate-400">Sync Buffer Empty</p>
                  <p className="text-[11px]">All edge actions are synchronized with the central cloud.</p>
                </div>
              ) : (
                edgeSyncQueue.map((pkt) => (
                  <div
                    key={pkt.id}
                    className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold text-[11px]">{pkt.sourceModule}</span>
                      <span className="text-[10px] font-mono text-slate-500">{pkt.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] truncate">{pkt.payloadSummary}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Status: <b className="text-amber-300">{pkt.status}</b></span>
                      <span>Payload: {pkt.sizeBytes} bytes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reconcile Action Callout */}
          <div className="pt-3 border-t border-slate-800">
            {connectivityMode === 'online' ? (
              <button
                onClick={reconcileSyncQueue}
                disabled={edgeSyncQueue.length === 0}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow"
              >
                Reconcile {edgeSyncQueue.length} Packets with Cloud Database
              </button>
            ) : (
              <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50">
                ⚠️ Backhaul is currently in {connectivityMode.toUpperCase()} mode. Packets will automatically reconcile when Cloud is restored.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
