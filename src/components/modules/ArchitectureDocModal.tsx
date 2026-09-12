import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Wifi, 
  WifiOff, 
  Radio, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Compass, 
  BrainCircuit, 
  ShieldAlert, 
  Navigation, 
  MessageSquare, 
  Network 
} from 'lucide-react';

interface ArchitectureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({ isOpen, onClose }) => {
  const [diagramMode, setDiagramMode] = useState<'normal' | 'degraded'>('normal');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                SDMS System Architecture & Connectivity Resilience
              </h2>
              <p className="text-xs text-slate-400">
                Solving the Disaster Management Fragmentation Gap via Graceful Degradation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Executive Summary & Research Gap Resolution */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>The Research Gap Solved by SDMS</span>
            </h3>
            <p>
              Contemporary disaster management research identifies a severe <strong>"Fragmentation Gap"</strong>: existing systems focus on isolated technology silos (IoT-only, GIS-only, AI-only, Drone-only, or Cloud-only). Furthermore, existing solutions critically assume continuous high-bandwidth internet connectivity—the exact utility that collapses first in natural catastrophes.
            </p>
            <p>
              <strong>SDMS bridges this gap</strong> by creating a <strong>unified 7-layer pipeline</strong> built around an <strong>offline-first, graceful degradation design principle</strong>. Every module remains operationally useful even when backhaul drops to 2.4 kbps LoRa mesh or completely islands onto local edge devices.
            </p>
          </div>

          {/* Diagram State Selector */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Interactive Architecture Diagram:</span>
              <span className="text-slate-400">Toggle data flow state below</span>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDiagramMode('normal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                  diagramMode === 'normal'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>(A) Normal Cloud Data Flow</span>
              </button>
              <button
                onClick={() => setDiagramMode('degraded')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                  diagramMode === 'degraded'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>(B) Degraded Mesh & Edge Fallback</span>
              </button>
            </div>
          </div>

          {/* Visual Architecture Diagram Map */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            
            {/* Top Cloud Tier */}
            <div className={`p-4 rounded-xl border transition-all ${
              diagramMode === 'normal' 
                ? 'bg-sky-950/30 border-sky-600/60' 
                : 'bg-slate-900/30 border-slate-800/60 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sky-400 text-xs">
                  <Database className="w-4 h-4" />
                  <span>CENTRAL CLOUD TIER (100 Mbps WAN Backhaul)</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  diagramMode === 'normal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {diagramMode === 'normal' ? 'Full Real-Time Sync Active' : 'Severed / Standby Queue Buffer'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 font-mono">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  • Central Multi-Agency Store
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  • Cloud Vision & Deep Transformer
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  • High-Res Satellite Raster Tiles
                </div>
              </div>
            </div>

            {/* In-Between Transport Layer */}
            <div className="flex items-center justify-center py-1">
              <div className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold flex items-center gap-2 ${
                diagramMode === 'normal'
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-amber-950 border-amber-600 text-amber-300 animate-pulse'
              }`}>
                {diagramMode === 'normal' ? (
                  <>
                    <span>Fiber Optic / 5G Broadband (100,000 kbps)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>LoRaWAN Peer-to-Peer Tactical Mesh / Islanded Local Cache (2.4 kbps / 0 kbps)</span>
                  </>
                )}
              </div>
            </div>

            {/* 7-Layer Integrated Edge Pipeline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Layer 1 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>1. IoT Sensor Layer</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Continuous high-rate telemetry streaming to cloud data warehouse.'
                    : 'Degrades to Last-Known-Good (LKG) cache with staleness timer & LoRa delta compression.'}
                </p>
              </div>

              {/* Layer 2 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>2. GIS Spatial Layer</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Cloud geospatial vector tiles fused with multi-sensor spatial queries.'
                    : 'Client-side runtime executes AHP/TOPSIS risk scoring directly on edge devices.'}
                </p>
              </div>

              {/* Layer 3 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. AI/ML & XAI Layer</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Heavy Transformer neural network hazard forecasting.'
                    : 'Degrades to Quantized MobileNet on device + local explainable-AI feature attribution.'}
                </p>
              </div>

              {/* Layer 4 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Misinformation Filter</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Deep NLP linguistic models cross-referencing nationwide incident feeds.'
                    : 'Local regex/keyword heuristic cross-checked against locally cached IoT ground truth.'}
                </p>
              </div>

              {/* Layer 5 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <Navigation className="w-3.5 h-3.5 text-sky-400" />
                  <span>5. Autonomous Drone Recon</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Streams 4K video to command center for centralized cloud CV segmentation.'
                    : 'On-board YOLO-Nano runs at 18ms latency; sends only 16-byte survivor coordinates.'}
                </p>
              </div>

              {/* Layer 6 */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6. Citizen Assistance</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diagramMode === 'normal'
                    ? 'Cloud LLM conversational safety guidance & real-time cellular push alerts.'
                    : 'Local rulebase guides citizens to safe shelters & provides backup radio channels.'}
                </p>
              </div>

            </div>

            {/* Bottom Layer 7 Coordination & Sync Engine */}
            <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-700/50">
              <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs mb-1">
                <Network className="w-4 h-4" />
                <span>7. Cloud-Edge Coordination & Reconciler</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {diagramMode === 'normal'
                  ? 'All agency dispatches (Red Cross, Fire, Police, Municipal GIS) are instantly synchronized to centralized database.'
                  : 'Disconnected incidents are stored in local Append-Only CRDT Queue. When connectivity is restored, vector clocks automatically reconcile without data loss.'}
              </p>
            </div>

          </div>

          {/* Tabular Specification Matrix */}
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Graceful Degradation Operational Matrix</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-800 text-[11px] text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-2 border-b border-slate-800">Module / Layer</th>
                    <th className="p-2 border-b border-slate-800 text-emerald-400">Full Cloud Mode (100 Mbps)</th>
                    <th className="p-2 border-b border-slate-800 text-amber-400">Degraded Tactical Mesh (2.4 kbps)</th>
                    <th className="p-2 border-b border-slate-800 text-rose-400">Islanded Edge (0 kbps)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2 font-bold text-slate-200">1. IoT Sensors</td>
                    <td className="p-2 text-slate-300">Continuous 1 Hz telemetry</td>
                    <td className="p-2 text-slate-300">Delta-compressed updates (&gt;5% change)</td>
                    <td className="p-2 text-slate-300">Last-Known-Good (LKG) cache</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">2. GIS Spatial</td>
                    <td className="p-2 text-slate-300">Cloud raster imagery + server MCDM</td>
                    <td className="p-2 text-slate-300">Vector bounding polygons</td>
                    <td className="p-2 text-slate-300">Client-side AHP/TOPSIS calculation</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">3. AI Prediction</td>
                    <td className="p-2 text-slate-300">Cloud Transformer v4.2</td>
                    <td className="p-2 text-slate-300">Quantized MobileNet (Edge)</td>
                    <td className="p-2 text-slate-300">Local physics rate-of-change + XAI</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">4. Misinformation</td>
                    <td className="p-2 text-slate-300">Deep NLP sentiment classification</td>
                    <td className="p-2 text-slate-300">Regex/keyword parser + local sensors</td>
                    <td className="p-2 text-slate-300">Edge ground-truth contradiction filter</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">5. Drone Recon</td>
                    <td className="p-2 text-slate-300">4K video live stream to cloud</td>
                    <td className="p-2 text-slate-300">On-board CV, 16-byte GPS packets</td>
                    <td className="p-2 text-slate-300">Autonomous edge patrol + SD card log</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">6. Citizen Chat</td>
                    <td className="p-2 text-slate-300">Cloud AI Assistant + push alerts</td>
                    <td className="p-2 text-slate-300">Offline guidance + SMS gateway</td>
                    <td className="p-2 text-slate-300">Local rulebase + VHF/UHF radio freq</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200">7. Coordination</td>
                    <td className="p-2 text-slate-300">Real-time WebSocket multi-agency</td>
                    <td className="p-2 text-slate-300">LoRa mesh log replication</td>
                    <td className="p-2 text-slate-300">Local vector queue (auto-reconciles)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            SDMS Architectural Specification • Literature Survey Blueprint
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition-colors"
          >
            Close Architecture Spec
          </button>
        </div>

      </div>
    </div>
  );
};
