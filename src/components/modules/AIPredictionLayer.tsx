import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Zap, 
  Sparkles,
  HelpCircle,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { classifyUploadedImage } from '../../services/edgePredictionEngine';
import { DamageAssessment } from '../../types';

export const AIPredictionLayer: React.FC = () => {
  const { 
    forecasts, 
    damageAssessments, 
    addDamageAssessment, 
    connectivityMode 
  } = useSDMS();

  const [selectedAssessment, setSelectedAssessment] = useState<DamageAssessment>(damageAssessments[0]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      const newAssessment = classifyUploadedImage(file.name, previewUrl, connectivityMode);
      addDamageAssessment(newAssessment);
      setSelectedAssessment(newAssessment);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              Layer 3: AI/ML Prediction Layer & Explainable AI (XAI)
            </h2>
            <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
              connectivityMode === 'online'
                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {connectivityMode === 'online' ? 'Cloud Transformer v4.2' : 'On-Device Edge ML (Offline)'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physics-informed multi-hazard forecasting with human-interpretable feature attribution & aerial vision classification.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Inference Mode: <b>{connectivityMode === 'online' ? 'Cloud GPU Cluster' : 'Edge Quantized CPU'}</b></span>
        </div>
      </div>

      {/* Part 1: Hazard Time-Series Forecasts & Explainable-AI (XAI) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span>Multi-Hazard Forecast Horizon & Plain-Language XAI</span>
          <span className="text-xs font-normal text-slate-400">(Dynamic sensor rate-of-change + topography)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {forecasts.map((f, idx) => {
            const isCrit = f.predictedSeverity === 'Catastrophic';
            const isHigh = f.predictedSeverity === 'High';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isCrit
                    ? 'bg-rose-950/30 border-rose-600/70 shadow-lg'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-600/60'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  {/* Forecast Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {f.timeHorizon} Horizon
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isCrit ? 'bg-rose-600 text-white' : isHigh ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {f.predictedSeverity}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{f.hazardType}</h4>

                  {/* Plain Language Reason (Core XAI Requirement) */}
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 mb-3 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>XAI Decision Rationale:</span>
                    </div>
                    <p className="leading-relaxed italic">
                      "{f.xaiExplanation.primaryReason}"
                    </p>
                  </div>

                  {/* Factor Attribution Bars */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Feature Attribution Weights:
                    </span>
                    {f.xaiExplanation.contributingFactors.map((factor, fIdx) => (
                      <div key={fIdx} className="space-y-0.5">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[170px]">{factor.factor}</span>
                          <span className="font-mono text-slate-200">{factor.weight}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${factor.weight}%` }}
                            className="bg-purple-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countermeasure Box */}
                <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-300">
                  <span className="text-amber-400 font-semibold block mb-0.5">Recommended Countermeasure:</span>
                  <p className="text-slate-400">{f.xaiExplanation.recommendedCountermeasure}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Model: {f.modelUsed} ({f.confidenceScore}% confidence)
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Image-based Damage Assessment Module */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              Computer Vision Damage Assessment & Structural Integrity
            </h3>
            <p className="text-xs text-slate-400">
              Upload aerial drone photos or satellite imagery to classify structural compromise and debris extent.
            </p>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer shadow transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Aerial Imagery</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Damage Inspection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Thumbnails of available recon feeds */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Reconnaissance Feeds ({damageAssessments.length}):
            </span>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {damageAssessments.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAssessment(item)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    selectedAssessment.id === item.id
                      ? 'bg-slate-800 border-sky-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 rounded object-cover border border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        item.damageLevel === 'Severe' || item.damageLevel === 'Catastrophic'
                          ? 'bg-rose-600 text-white'
                          : item.damageLevel === 'Moderate'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {item.damageLevel}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">{item.captureTime}</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate mt-0.5">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Recon Detail & XAI Visualizer */}
          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedAssessment.title}</h4>
                <p className="text-xs text-slate-400">{selectedAssessment.captureTime} • Processed via {selectedAssessment.processingMode}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Structural Integrity</span>
                  <span className="text-base font-bold font-mono text-sky-400">
                    {selectedAssessment.structuralIntegrityEstimate}%
                  </span>
                </div>
                <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedAssessment.structuralIntegrityEstimate}%` }}
                    className={`h-full ${
                      selectedAssessment.structuralIntegrityEstimate < 50
                        ? 'bg-rose-500'
                        : selectedAssessment.structuralIntegrityEstimate < 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Photo with Overlay */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 h-60">
              <img
                src={selectedAssessment.imageUrl}
                alt={selectedAssessment.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded text-xs font-mono font-bold text-rose-300 border border-rose-500/40">
                DAMAGE CLASSIFICATION: {selectedAssessment.damageLevel.toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                Confidence: {(selectedAssessment.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Detected Features Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Segmented Damage Indicators:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAssessment.detectedFeatures.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* XAI Reasoning Box */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-purple-300 text-[11px]">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Explainable AI (XAI) Attribution:</span>
              </div>
              <p className="leading-relaxed">
                {selectedAssessment.xaiReasoning}
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
