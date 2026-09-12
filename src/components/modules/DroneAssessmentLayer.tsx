import React from 'react';
import { 
  Navigation, 
  Battery, 
  Wifi, 
  Radio, 
  Cpu, 
  Eye, 
  Target, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Zap,
  Maximize2
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';

export const DroneAssessmentLayer: React.FC = () => {
  const { 
    droneMission, 
    setDroneInferenceMode, 
    connectivityMode,
    setFocusedMapCoords 
  } = useSDMS();

  const isEdge = droneMission.activeInferenceMode === 'edge_lightweight';

  return (
    <div className="space-y-4">
      
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-sky-400" />
              Layer 5: Autonomous Drone Aerial Recon & Edge CV
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
              VTOL Tactical UAV Alpha-1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous aerial search & rescue with on-board edge computer vision detection for survivors and infrastructure breach.
          </p>
        </div>

        {/* Model Inference Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold px-2">Inference Engine:</span>
          <button
            id="btn-drone-edge"
            onClick={() => setDroneInferenceMode('edge_lightweight')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              isEdge
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lightweight Edge (Offline)
          </button>
          <button
            id="btn-drone-cloud"
            onClick={() => setDroneInferenceMode('cloud_heavyweight')}
            disabled={connectivityMode === 'offline_islanded'}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              !isEdge
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            } ${connectivityMode === 'offline_islanded' ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={connectivityMode === 'offline_islanded' ? 'Cloud model disabled while in Offline Islanded mode' : ''}
          >
            Full Cloud AI
          </button>
        </div>
      </div>

      {/* Main Grid: HUD Video Feed & Edge-vs-Cloud Tradeoff Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Simulated Drone Optical Video Stream with HUD & Bounding Boxes */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col justify-between h-[450px]">
          
          {/* Background Aerial Drone Simulation Graphic */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90">
            {/* Grid Lines simulating terrain camera */}
            <div className="w-full h-full opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          {/* Top HUD Telemetry Overlay */}
          <div className="relative z-10 p-3 flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-emerald-500/20 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>REC • LIVE FEED</span>
              </span>
              <span>CALLSIGN: {droneMission.droneCallsign}</span>
            </div>

            <div className="flex items-center gap-3">
              <span>ALT: {droneMission.altitudeMeters}m</span>
              <span>SPD: {droneMission.speedKmh} km/h</span>
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5" />
                {droneMission.battery.toFixed(0)}%
              </span>
              <span className="flex items-center gap-1">
                {connectivityMode === 'offline_islanded' ? <Radio className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                {droneMission.linkQuality}%
              </span>
            </div>
          </div>

          {/* Center Optical Crosshair & Bounding Box Detections */}
          <div className="relative z-10 flex-1 p-4 flex items-center justify-center">
            {/* Crosshair Center */}
            <div className="absolute w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>

            {/* Simulated Bounding Boxes Overlay */}
            {droneMission.detectedDetections.map((det) => {
              const isSurvivor = det.type === 'survivor';
              const isBreach = det.type === 'flood_breach';
              const borderColor = isSurvivor ? 'border-emerald-400 text-emerald-300' : isBreach ? 'border-sky-400 text-sky-300' : 'border-amber-400 text-amber-300';
              const bgColor = isSurvivor ? 'bg-emerald-950/70' : isBreach ? 'bg-sky-950/70' : 'bg-amber-950/70';

              return (
                <div
                  key={det.id}
                  style={{
                    left: `${det.bbox[0]}%`,
                    top: `${det.bbox[1]}%`,
                    width: `${det.bbox[2]}%`,
                    height: `${det.bbox[3]}%`
                  }}
                  className={`absolute border-2 ${borderColor} rounded-sm p-1 font-mono transition-all`}
                >
                  <div className={`text-[10px] font-bold px-1 py-0.5 rounded ${bgColor} border ${borderColor} inline-block shadow`}>
                    {isSurvivor ? 'SURVIVOR FOUND' : isBreach ? 'LEVEE BREACH' : 'ROAD BLOCKED'} ({(det.confidence * (isEdge ? 0.96 : 1.0) * 100).toFixed(0)}%)
                  </div>
                  <div className="text-[9px] text-slate-300 mt-1">
                    {det.lat.toFixed(4)}, {det.lng.toFixed(4)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom HUD Coordinates & Model Badge */}
          <div className="relative z-10 p-3 flex items-center justify-between text-xs font-mono text-slate-300 border-t border-slate-800 bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-sky-400" />
              <span>GIMBAL: 37.7650°N, 122.4250°W (Pitch -45°)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isEdge ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-purple-950 text-purple-300 border border-purple-700'
              }`}>
                {isEdge ? 'EDGE CV: YOLO-Nano (18ms)' : 'CLOUD CV: Transformer (420ms)'}
              </span>
              <button
                onClick={() => setFocusedMapCoords(droneMission.currentCoordinates)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Track UAV on Map"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Edge-Inference Accuracy vs Latency Trade-off Simulator */}
        <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Edge vs Cloud Inference Trade-off</h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Ablation Metric
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Demonstrates how the SDMS drone architecture preserves mission capability when video uplink bandwidth collapses during disaster storms.
            </p>

            {/* Benchmark Comparative Table */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
              <div className="grid grid-cols-3 text-xs pb-1 border-b border-slate-800 font-semibold text-slate-400">
                <span>Metric</span>
                <span className="text-emerald-400 text-center">Edge MobileNet</span>
                <span className="text-purple-400 text-right">Cloud Transformer</span>
              </div>

              {/* Row 1: Latency */}
              <div className="grid grid-cols-3 text-xs items-center">
                <span className="text-slate-300">Inference Latency:</span>
                <span className="text-center font-mono font-bold text-emerald-400">18 ms</span>
                <span className="text-right font-mono text-slate-400">420 ms (+ uplink)</span>
              </div>

              {/* Row 2: Bandwidth */}
              <div className="grid grid-cols-3 text-xs items-center">
                <span className="text-slate-300">Uplink Required:</span>
                <span className="text-center font-mono font-bold text-emerald-400">0 kbps (local)</span>
                <span className="text-right font-mono text-slate-400">15.0 Mbps video</span>
              </div>

              {/* Row 3: Accuracy mAP */}
              <div className="grid grid-cols-3 text-xs items-center">
                <span className="text-slate-300">Accuracy (mAP):</span>
                <span className="text-center font-mono text-slate-300">81.4%</span>
                <span className="text-right font-mono font-bold text-purple-400">96.2%</span>
              </div>

              {/* Row 4: Offline Resilience */}
              <div className="grid grid-cols-3 text-xs items-center">
                <span className="text-slate-300">Offline Resilience:</span>
                <span className="text-center font-mono font-bold text-emerald-400">100% Functional</span>
                <span className="text-right font-mono text-rose-400">0% (Fails Offline)</span>
              </div>

              {/* Row 5: Memory footprint */}
              <div className="grid grid-cols-3 text-xs items-center">
                <span className="text-slate-300">Model Footprint:</span>
                <span className="text-center font-mono text-emerald-400">1.8 MB (FP16)</span>
                <span className="text-right font-mono text-slate-400">240 MB</span>
              </div>
            </div>

            {/* Architectural Takeaway Note */}
            <div className="mt-3 bg-emerald-950/30 p-3 rounded-lg border border-emerald-700/50 text-xs text-emerald-200 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Graceful Degradation Logic:</span>
              </div>
              <p className="leading-relaxed opacity-95">
                When network degrades, drone autonomously shifts to local quantized inference. Survivor detections are compressed into compact 16-byte GPS coordinate packets sent over low-power LoRa mesh instead of streaming high-bandwidth 4K video.
              </p>
            </div>
          </div>

          {/* Detections List summary */}
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Detections Logged: <b>{droneMission.detectedDetections.length} tactical targets</b></span>
            <span className="font-mono text-sky-400">Target Georeferenced: OK</span>
          </div>
        </div>

      </div>

    </div>
  );
};
