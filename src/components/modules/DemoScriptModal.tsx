import React from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  WifiOff, 
  Radio, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Wifi
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeDemoStep, 
    runDemoStep, 
    connectivityMode, 
    edgeSyncQueue, 
    sensors 
  } = useSDMS();

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Normal Operation Baseline',
      icon: <Wifi className="w-4 h-4 text-emerald-400" />,
      subtitle: 'All 7 layers synchronized with full 100 Mbps cloud WAN.',
      expectedObservations: [
        'IoT Sensors report baseline values (stage < 2.5m, PGA < 0.05g).',
        'GIS Map shows all layers in green/normal operational state.',
        'Drone streams with Cloud Vision model enabled.',
        'Citizen Chatbot and Agency logs sync without queuing.'
      ],
      actionLabel: 'Execute Step 1: Set Baseline',
      actionColor: 'bg-emerald-600 hover:bg-emerald-500'
    },
    {
      step: 2,
      title: 'Simulated Disaster Event',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      subtitle: 'Severe flash flood & rainfall anomaly triggered in Canal Basin.',
      expectedObservations: [
        'River gauge HYDRO-01 breaches Critical threshold at 4.8m; ATMO-01 records 64 mm/h.',
        'MCDM Ranking re-computes: Canal Basin jumps to Rank #1 (Risk Score 82/100).',
        'AI Forecast warns of catastrophic inundation within 1 hour with XAI reasoning.',
        'Emergency Evacuation Alert broadcast to all citizen interfaces.'
      ],
      actionLabel: 'Execute Step 2: Trigger Disaster',
      actionColor: 'bg-rose-600 hover:bg-rose-500'
    },
    {
      step: 3,
      title: 'Connectivity Loss (Degraded Mesh)',
      icon: <Radio className="w-4 h-4 text-amber-500" />,
      subtitle: 'Cellular backhaul severed; network drops to 2.4 kbps LoRa mesh.',
      expectedObservations: [
        'Degraded Mode banner activates across top of platform.',
        'Bandwidth drops to 2.4 kbps; heavy raster imagery & 4K video suppressed.',
        'Sensors switch to delta-only updates over multi-hop LoRa mesh.',
        'Pending sync packets begin buffering in durable local memory.'
      ],
      actionLabel: 'Execute Step 3: Sever Backhaul',
      actionColor: 'bg-amber-600 hover:bg-amber-500'
    },
    {
      step: 4,
      title: 'Degraded-Mode Edge Fallback',
      icon: <WifiOff className="w-4 h-4 text-rose-400" />,
      subtitle: 'Islanded local edge compute (0 kbps); zero cloud dependency.',
      expectedObservations: [
        'IoT Sensor nodes report "Last-Known-Good (LKG)" cached telemetry.',
        'Drone recon activates On-Device MobileNet (18ms latency) without cloud.',
        'Citizen Chat provides offline guidance, shelter directory & emergency radio channels.',
        'Misinformation engine cross-checks rumors using local cached ground truth.'
      ],
      actionLabel: 'Execute Step 4: Full Edge Island',
      actionColor: 'bg-rose-700 hover:bg-rose-600'
    },
    {
      step: 5,
      title: 'Recovery & Auto-Reconciliation',
      icon: <RefreshCw className="w-4 h-4 text-sky-400" />,
      subtitle: 'Cloud link restored; buffered vector packets drain & reconcile.',
      expectedObservations: [
        'Connectivity restored to Full Cloud (100 Mbps).',
        'Edge Sync Queue automatically reconciles all buffered packets to central database.',
        'Inter-agency logs audit and confirm complete multi-agency consistency.',
        'Drone recon re-enables full cloud transformer model.'
      ],
      actionLabel: 'Execute Step 5: Restore & Reconcile',
      actionColor: 'bg-sky-600 hover:bg-sky-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                SDMS 5-Step Guided Demonstration Script
              </h2>
              <p className="text-xs text-slate-400">
                Live verification of Normal Operation → Disaster Event → Connectivity Loss → Edge Fallback → Recovery
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

        {/* Stepper Progress Bar */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between overflow-x-auto text-xs">
          {steps.map(s => {
            const isDone = activeDemoStep > s.step;
            const isCurrent = activeDemoStep === s.step;

            return (
              <div
                key={s.step}
                onClick={() => runDemoStep(s.step)}
                className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : isDone
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white text-indigo-900' : isDone ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? '✓' : s.step}
                </span>
                <span className="truncate max-w-[120px] sm:max-w-none">{s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}</span>
              </div>
            );
          })}
        </div>

        {/* Steps Content List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {steps.map(s => {
            const isCurrent = activeDemoStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500/80 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-950/60 border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-400">Step {s.step} of 5</span>
                        <h3 className="text-sm font-bold text-white">{s.title}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 text-[10px] font-bold uppercase animate-pulse">
                            Active State
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{s.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => runDemoStep(s.step)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow transition-all shrink-0 ${s.actionColor}`}
                  >
                    {s.actionLabel}
                  </button>
                </div>

                {/* Expected Observations Checklist */}
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Observed System Behaviors & Outputs:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {s.expectedObservations.map((obs, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span>Mode: <b className="text-white uppercase">{connectivityMode.replace(/_/g, ' ')}</b></span>
            <span>Queued: <b className="text-amber-400">{edgeSyncQueue.length} pkts</b></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = (activeDemoStep % 5) + 1;
                runDemoStep(next);
              }}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Next Demo Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
