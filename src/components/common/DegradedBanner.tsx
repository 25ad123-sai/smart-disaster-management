import React, { useState } from 'react';
import { 
  Radio, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Cpu, 
  Database,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';

export const DegradedBanner: React.FC = () => {
  const { connectivityMode, bandwidthKbps, edgeSyncQueue, reconcileSyncQueue, setConnectivityMode } = useSDMS();
  const [isExpanded, setIsExpanded] = useState(false);

  if (connectivityMode === 'online') {
    return (
      <div className="bg-slate-900/90 border-b border-emerald-950/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">CLOUD LINK OPTIMAL:</span>
          <span>Central Server & Distributed Edge Synchronized (100.0 Mbps backhaul)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">All 7 Layers in Full Coordinated Sync</span>
          <button
            onClick={() => setConnectivityMode('degraded_mesh')}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
          >
            Simulate Degradation
          </button>
        </div>
      </div>
    );
  }

  const isDegraded = connectivityMode === 'degraded_mesh';

  return (
    <div className={`border-b transition-all ${
      isDegraded 
        ? 'bg-amber-950/80 border-amber-800/80 text-amber-200' 
        : 'bg-rose-950/90 border-rose-800/90 text-rose-100'
    } px-4 py-2.5 shadow-md`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isDegraded ? 'bg-amber-900/80 text-amber-300' : 'bg-rose-900/80 text-rose-300'}`}>
              {isDegraded ? <Radio className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide uppercase text-xs sm:text-sm">
                  {isDegraded ? 'DEGRADED TACTICAL MESH MODE' : 'SEVERED BACKHAUL: LOCAL ISLANDED EDGE MODE'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isDegraded ? 'bg-amber-900 text-amber-200 border border-amber-700' : 'bg-rose-900 text-rose-200 border border-rose-700'
                }`}>
                  Bandwidth: {bandwidthKbps} kbps
                </span>
              </div>
              <p className="text-xs opacity-90">
                {isDegraded 
                  ? 'LoRaWAN peer-to-peer mesh routing active. Low-overhead binary telemetry; heavy raster imagery suppressed.'
                  : 'Zero cloud connection. Operating strictly on Local Edge Compute, Last-Known-Good cache, and local ML models.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-black/30 hover:bg-black/40 text-xs font-semibold border border-white/10 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Diagnostics' : 'Inspect Edge Capability'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setConnectivityMode('online')}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
            >
              Restore Cloud Link
            </button>
          </div>
        </div>

        {/* Diagnostic capabilities drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* What works on local edge */}
            <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ACTIVE LOCAL EDGE CAPABILITIES (Zero Cloud Required)</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-start gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>IoT Sensors:</strong> Local threshold alerts & Last-Known-Good (LKG) cache with staleness timer.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>GIS & MCDM:</strong> Client-side AHP/TOPSIS risk calculation running instantly in browser runtime.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>AI & Damage Recon:</strong> Lightweight MobileNet/YOLO-Nano edge CV running directly on UAV/device (18ms latency).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Misinformation Filtering:</strong> Local heuristic NLP & real-time sensor ground-truth cross-checking.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Citizen Assistant:</strong> Offline multilingual rulebase & emergency shelter coordinates available 100% locally.</span>
                </li>
              </ul>
            </div>

            {/* What is queued for cloud sync */}
            <div className="bg-black/30 p-3 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2">
                <Clock className="w-4 h-4" />
                <span>QUEUED FOR TERRESTRIAL CLOUD RECONCILIATION ({edgeSyncQueue.length} Packets)</span>
              </div>
              <p className="text-slate-300 mb-2">
                Packets are buffered in durable local IndexedDB/Edge memory. Upon backhaul restoration, SDMS auto-reconciles vector clocks.
              </p>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[11px] text-slate-400">
                {edgeSyncQueue.length === 0 ? (
                  <div className="text-slate-500 italic">No pending packets. New reports or sensor alerts will be queued here.</div>
                ) : (
                  edgeSyncQueue.slice(0, 4).map(pkt => (
                    <div key={pkt.id} className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                      <span className="text-amber-300 font-semibold">{pkt.sourceModule}:</span>
                      <span className="truncate max-w-[180px] text-slate-300">{pkt.payloadSummary}</span>
                      <span className="text-[10px] text-slate-500">{pkt.sizeBytes} B</span>
                    </div>
                  ))
                )}
              </div>
              {edgeSyncQueue.length > 4 && (
                <div className="text-[10px] text-slate-500 mt-1 text-right">+ {edgeSyncQueue.length - 4} more queued packets</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
