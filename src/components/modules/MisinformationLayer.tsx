import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Cpu, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  ShieldX,
  Share2
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { CitizenReport } from '../../types';

export const MisinformationLayer: React.FC = () => {
  const { 
    reports, 
    submitReport, 
    updateReportModeration, 
    sensors,
    connectivityMode 
  } = useSDMS();

  const [filter, setFilter] = useState<'all' | 'flagged' | 'verified' | 'pending'>('all');
  const [customText, setCustomText] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customLocation, setCustomLocation] = useState('Central District');

  const filteredReports = reports.filter(r => {
    if (filter === 'flagged') return r.verificationStatus === 'contradicted_by_iot' || r.verificationStatus === 'quarantined';
    if (filter === 'verified') return r.verificationStatus === 'verified_authentic';
    if (filter === 'pending') return r.moderatorStatus === 'pending';
    return true;
  });

  const handleQuickPreset = (type: 'fake_bridge' | 'real_flood' | 'fake_gas') => {
    if (type === 'fake_bridge') {
      submitReport(
        'BREAKING: Central Bay Bridge has suffered catastrophic structural collapse! Multiple cars in water, stay away!',
        '@viral_news_hunter',
        'Twitter/X',
        'Central Bay Bridge'
      );
    } else if (type === 'real_flood') {
      submitReport(
        'Water entering ground floor apartments on 7th & Canal Street. Drainage backed up, need sandbags urgently.',
        'Sarah Jenkins (Resident)',
        'Telegram SDMS Bot',
        'Canal Basin'
      );
    } else if (type === 'fake_gas') {
      submitReport(
        'Massive toxic ammonia cloud floating towards downtown from the harbor! Hundreds collapsing in street!!',
        'Anon Broadcast',
        'Citizen SMS',
        'Port Industrial'
      );
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    submitReport(customText, customAuthor || 'Field Observer', 'Telegram SDMS Bot', customLocation);
    setCustomText('');
  };

  return (
    <div className="space-y-4">
      
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Layer 4: Misinformation & Rumor Verification Engine
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              NLP + Sensor Cross-Validation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated verification pipeline that scores report credibility and cross-references claims against live IoT ground truth.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-2.5 py-1 rounded transition-colors ${filter === 'flagged' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Contradicted
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-2.5 py-1 rounded transition-colors ${filter === 'verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Corroborated
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Submission Form & Reports Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive Report Submission Tester */}
        <div className="lg:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Test NLP Verification Engine
            </h3>
            <p className="text-xs text-slate-400">
              Simulate citizen disaster claims or social media posts to test automated IoT cross-checking.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Test Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleQuickPreset('fake_bridge')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-rose-300 transition-colors flex items-center justify-between"
              >
                <span>False "Bridge Collapse" Rumor</span>
                <span className="text-[10px] text-slate-500 font-mono">Tests SEISM-02</span>
              </button>
              <button
                onClick={() => handleQuickPreset('fake_gas')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-amber-300 transition-colors flex items-center justify-between"
              >
                <span>False "Toxic Gas Plume" Rumor</span>
                <span className="text-[10px] text-slate-500 font-mono">Tests GAS-01</span>
              </button>
              <button
                onClick={() => handleQuickPreset('real_flood')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-emerald-300 transition-colors flex items-center justify-between"
              >
                <span>Authentic Canal Flooding Report</span>
                <span className="text-[10px] text-slate-500 font-mono">Tests HYDRO-02</span>
              </button>
            </div>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Author / Source:</label>
              <input
                type="text"
                value={customAuthor}
                onChange={e => setCustomAuthor(e.target.value)}
                placeholder="e.g. @citizen_alert or Maria C."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Report Text / Social Post:</label>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Type claim to verify against IoT ground truth..."
                rows={3}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze & Cross-Check Report</span>
            </button>
          </form>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-0.5">Sensor Ground Truth Registry:</span>
            <span>Compares reports against {sensors.length} real-time IoT nodes (seismic accelerometers, water gauges, sniffer ppm).</span>
          </div>
        </div>

        {/* Right Column: Reports Feed & Human Moderator Review Queue */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Moderation & Verification Stream ({filteredReports.length}):
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Mode: {connectivityMode === 'online' ? 'Cloud NLP Service' : 'Local Heuristic Engine (Edge)'}
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredReports.map(report => {
              const isContradicted = report.verificationStatus === 'contradicted_by_iot';
              const isAuthentic = report.verificationStatus === 'verified_authentic';

              return (
                <div
                  key={report.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isContradicted
                      ? 'bg-rose-950/20 border-rose-700/60'
                      : isAuthentic
                      ? 'bg-emerald-950/20 border-emerald-700/60'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  {/* Top Bar: Author, Source, Credibility Meter */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{report.author}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {report.source}
                        </span>
                        <span className="text-[10px] text-slate-500">{report.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Location: <span className="text-slate-300 font-medium">{report.claimedLocation}</span> • Claimed: <span className="font-semibold text-sky-400">{report.claimedHazard}</span>
                      </div>
                    </div>

                    {/* Credibility Score Badge */}
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 ${
                        isContradicted
                          ? 'bg-rose-900 text-rose-200 border border-rose-700'
                          : isAuthentic
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                          : 'bg-amber-900 text-amber-200 border border-amber-700'
                      }`}>
                        {isContradicted ? <XCircle className="w-3.5 h-3.5" /> : isAuthentic ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>Credibility: {report.credibilityScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-0.5">
                        {report.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Raw Text Quote */}
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 mb-2.5 font-sans leading-relaxed">
                    "{report.rawText}"
                  </div>

                  {/* Ground Truth Cross-Check Callout */}
                  {report.contradictionReason && (
                    <div className={`p-2.5 rounded-lg text-xs mb-3 border ${
                      isContradicted
                        ? 'bg-rose-950/50 border-rose-700/80 text-rose-200'
                        : 'bg-emerald-950/50 border-emerald-700/80 text-emerald-200'
                    }`}>
                      <div className="font-bold mb-0.5 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>IoT Ground Truth Cross-Check:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-95">
                        {report.contradictionReason}
                      </p>
                    </div>
                  )}

                  {/* Moderator Review & Action Queue */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Status:</span>
                      <span className={`font-semibold capitalize px-1.5 py-0.5 rounded text-[10px] ${
                        report.moderatorStatus === 'approved' ? 'bg-emerald-900 text-emerald-300' :
                        report.moderatorStatus === 'rejected' ? 'bg-rose-900 text-rose-300' :
                        'bg-amber-900 text-amber-300'
                      }`}>
                        {report.moderatorStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateReportModeration(report.id, 'approved')}
                        className="px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 text-[11px] font-medium transition-colors"
                        title="Approve and dispatch field crew"
                      >
                        Approve Official
                      </button>

                      <button
                        onClick={() => updateReportModeration(report.id, 'rejected')}
                        className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700 text-[11px] font-medium transition-colors"
                        title="Debunk rumor and push official clarification"
                      >
                        Debunk Rumor
                      </button>

                      <button
                        onClick={() => updateReportModeration(report.id, 'escalated')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
