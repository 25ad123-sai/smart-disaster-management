import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Globe, 
  Bell, 
  Home, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  HeartPulse,
  Droplets,
  ShieldCheck,
  Zap,
  Activity,
  X,
  Flame
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';

interface QuickReply {
  id: string;
  category: 'all' | 'urgent' | 'shelter' | 'supplies';
  icon: React.ReactNode;
  label: Record<string, string>;
  query: Record<string, string>;
  isSpecialAction?: 'injury' | 'sos';
  buttonStyle: string;
}

export const CitizenChatLayer: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    broadcastAlert, 
    currentLanguage, 
    setCurrentLanguage,
    facilities,
    setFocusedMapCoords,
    connectivityMode,
    currentUserRole
  } = useSDMS();

  const [inputMessage, setInputMessage] = useState('');
  const [alertHeadline, setAlertHeadline] = useState('');
  const [alertBody, setAlertBody] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showInjuryModal, setShowInjuryModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'urgent' | 'shelter' | 'supplies'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'fr', label: 'Français' },
    { code: 'tl', label: 'Tagalog' }
  ];

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertHeadline.trim() || !alertBody.trim()) return;
    broadcastAlert(alertHeadline, alertBody);
    setAlertHeadline('');
    setAlertBody('');
    setShowBroadcastModal(false);
  };

  const handleSosBeacon = () => {
    setSosSent(true);
    sendChatMessage('🚨 EMERGENCY SOS BEACON TRIGGERED: Citizen reported trapped at current GPS position (37.7580, -122.4200). Requesting urgent rescue assessment.');
    setTimeout(() => setSosSent(false), 7000);
  };

  const handleSpecificInjuryReport = (injuryType: string, severity: string) => {
    setSosSent(true);
    sendChatMessage(`🚨 INJURY REPORT (${severity.toUpperCase()}): Citizen reports ${injuryType}. Stationed at current GPS coords. Requesting immediate first responder triage & medical dispatch.`);
    setShowInjuryModal(false);
    setTimeout(() => setSosSent(false), 7000);
  };

  const operationalShelters = facilities.filter(f => f.type === 'shelter');

  // Multi-lingual Quick Reply suggestions tailored for high-stress disaster scenarios
  const quickReplies: QuickReply[] = [
    {
      id: 'shelter',
      category: 'shelter',
      icon: <Home className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      label: {
        en: 'Find nearest shelter',
        es: 'Buscar refugio más cercano',
        hi: 'निकटतम आश्रय खोजें',
        fr: "Trouver l'abri le plus proche",
        tl: 'Hanapin ang pinakamalapit na shelter'
      },
      query: {
        en: 'Where is the nearest safe shelter with capacity and backup power?',
        es: '¿Dónde está el refugio seguro más cercano con capacidad y energía de respaldo?',
        hi: 'निकटतम सुरक्षित आश्रय कहाँ है जिसमें बिस्तर और बिजली उपलब्ध हो?',
        fr: "Où se trouve l'abri le plus proche avec des places disponibles ?",
        tl: 'Saan ang pinakamalapit na evacuation shelter na may natitirang espasyo?'
      },
      buttonStyle: 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-700/80 text-emerald-200'
    },
    {
      id: 'injury',
      category: 'urgent',
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      label: {
        en: 'Report injury',
        es: 'Reportar lesión / Primeros auxilios',
        hi: 'चोट / चिकित्सा सहायता रिपोर्ट',
        fr: 'Signaler blessure / Premiers soins',
        tl: 'Mag-ulat ng pinsala / First aid'
      },
      query: {
        en: 'Report injury: Need immediate emergency medical triage and first aid guidance',
        es: 'Reporte de lesión urgente: Necesito triaje médico y guía de primeros auxilios',
        hi: 'चोट रिपोर्ट: आपातकालीन चिकित्सा सहायता और प्राथमिक उपचार निर्देश चाहिए',
        fr: 'Rapport de blessure: Besoin urgent de triage médical et premiers secours',
        tl: 'Report ng pinsala: Kailangan ng agarang medical triage at first aid'
      },
      isSpecialAction: 'injury',
      buttonStyle: 'bg-rose-950/80 hover:bg-rose-900 border-rose-600 text-rose-100 ring-1 ring-rose-500/50'
    },
    {
      id: 'route',
      category: 'shelter',
      icon: <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
      label: {
        en: 'Safe evacuation route',
        es: 'Ruta segura de evacuación',
        hi: 'सुरक्षित निकासी मार्ग',
        fr: "Itinéraire d'évacuation sûr",
        tl: 'Ligtas na ruta ng paglikas'
      },
      query: {
        en: 'What is the safest evacuation route right now avoiding flooded areas?',
        es: '¿Cuál es la ruta de evacuación más segura evitando inundaciones?',
        hi: 'बाढ़ वाले क्षेत्रों से बचते हुए वर्तमान में सबसे सुरक्षित निकासी मार्ग क्या है?',
        fr: "Quel est l'itinéraire d'évacuation le plus sûr évitant les zones inondées ?",
        tl: 'Ano ang pinakaligtas na ruta ng paglikas na umiiwas sa baha?'
      },
      buttonStyle: 'bg-sky-950/70 hover:bg-sky-900 border-sky-700/80 text-sky-200'
    },
    {
      id: 'bridge',
      category: 'urgent',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
      label: {
        en: 'Check bridge & road status',
        es: 'Estado del puente y vías',
        hi: 'पुल व सड़क स्थिति जांचें',
        fr: 'État du pont et des routes',
        tl: 'Kalagayan ng tulay at kalsada'
      },
      query: {
        en: 'Is Central Bay Bridge collapsed or open for evacuation?',
        es: '¿El puente Central Bay colapsó o sigue abierto para evacuación?',
        hi: 'क्या सेंट्रल बे ओवरपास खुला है या क्षतिग्रस्त है?',
        fr: 'Le pont Central Bay est-il praticable ou fermé pour évacuation ?',
        tl: 'Bukas ba o gumuho ang Central Bay Bridge para sa paglikas?'
      },
      buttonStyle: 'bg-indigo-950/70 hover:bg-indigo-900 border-indigo-700/80 text-indigo-200'
    },
    {
      id: 'water',
      category: 'supplies',
      icon: <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
      label: {
        en: 'Clean drinking water',
        es: 'Agua potable y provisiones',
        hi: 'पीने का स्वच्छ जल व भोजन',
        fr: 'Eau potable et vivres',
        tl: 'Malinis na inuming tubig'
      },
      query: {
        en: 'Where can I find clean drinking water and emergency food rations?',
        es: '¿Dónde puedo encontrar agua potable y raciones de alimentos?',
        hi: 'पीने का साफ पानी और आपातकालीन भोजन कहाँ मिलेगा?',
        fr: "Où trouver de l'eau potable propre et des rations alimentaires ?",
        tl: 'Saan makakahanap ng malinis na tubig at pagkain?'
      },
      buttonStyle: 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-700/80 text-cyan-200'
    },
    {
      id: 'sos',
      category: 'urgent',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />,
      label: {
        en: '🚨 Trigger SOS Beacon',
        es: '🚨 Baliza de Emergencia SOS',
        hi: '🚨 आपातकालीन एसओएस बीकन',
        fr: '🚨 Balise SOS d’Urgence',
        tl: '🚨 SOS Emergency Beacon'
      },
      query: {
        en: 'EMERGENCY SOS',
        es: 'EMERGENCIA SOS',
        hi: 'आपातकालीन एसओएस',
        fr: 'URGENCE SOS',
        tl: 'EMERGENCY SOS'
      },
      isSpecialAction: 'sos',
      buttonStyle: 'bg-amber-950/80 hover:bg-amber-900 border-amber-600 text-amber-200 font-bold'
    }
  ];

  const filteredQuickReplies = activeCategory === 'all' 
    ? quickReplies 
    : quickReplies.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-4">
      
      {/* Layer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Layer 6: Citizen Assistance Chatbot & Emergency Broadcast
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Offline-Capable Edge Assistant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time evacuation guidance, verified shelter directory, multi-lingual translation, and public emergency alerting.
          </p>
        </div>

        {/* Language Switcher & Push Alert Button */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as any)}
              className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Commander Push Alert Simulation */}
          <button
            id="btn-broadcast-alert"
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Simulate Push Alert</span>
          </button>
        </div>
      </div>

      {/* SOS Beacon Active Alert Banner */}
      {sosSent && (
        <div className="bg-rose-950 border-2 border-rose-500 text-rose-100 p-3 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span>🚨 DISTRESS BEACON ACTIVE: GPS position (37.7580, -122.4200) queued in LoRa mesh packet cache.</span>
              <span className="block font-normal text-[11px] text-rose-300">Field Emergency Medical Services & nearest shelter coordinators have been alerted.</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-600 text-[10px] font-mono text-rose-200 uppercase">
            Transmitting
          </span>
        </div>
      )}

      {/* Main Grid: Conversational Chat UI & Emergency Shelter Finder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Conversational Assistant */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col h-[560px] overflow-hidden">
          
          {/* Chat Window Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isAlert = msg.sender === 'system_alert';

              if (isAlert) {
                return (
                  <div key={msg.id} className="bg-rose-950/80 border-2 border-rose-600 p-3.5 rounded-xl text-rose-100 shadow-lg animate-pulse">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase text-rose-300 mb-1">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Civil Defense Emergency Broadcast</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] text-rose-300/80 mt-1 block text-right">{msg.timestamp}</span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>SDMS Safety Assistant {msg.isEdgeGenerated ? '(Edge Engine)' : ''}</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Action chips if any */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (act.actionType === 'find_shelter' || act.actionType === 'focus_shelter') {
                                setFocusedMapCoords([37.7520, -122.4420]);
                              } else if (act.actionType === 'focus_shelter_2') {
                                setFocusedMapCoords([37.7480, -122.4050]);
                              } else if (act.actionType === 'focus_hospital') {
                                setFocusedMapCoords([37.7640, -122.4350]);
                              } else if (act.actionType === 'focus_bridge') {
                                setFocusedMapCoords([37.7780, -122.4080]);
                              } else if (act.actionType === 'report_sos') {
                                handleSosBeacon();
                              } else {
                                handleQuickPrompt(act.label);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-semibold border border-slate-700 transition-colors"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions Panel (Optimized for High-Stress Emergency Scenarios) */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-2.5 space-y-2">
            
            {/* Header with Stress Mode note & Quick category filters */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>High-Stress Quick Replies (1-Tap):</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    activeCategory === 'all' 
                      ? 'bg-slate-700 text-white font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({quickReplies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('urgent')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    activeCategory === 'urgent' 
                      ? 'bg-rose-900/70 text-rose-200 font-bold border border-rose-700' 
                      : 'text-rose-400 hover:text-rose-300'
                  }`}
                >
                  🚨 Urgent / Medical
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('shelter')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    activeCategory === 'shelter' 
                      ? 'bg-emerald-900/70 text-emerald-200 font-bold border border-emerald-700' 
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  🏠 Shelter & Routes
                </button>
              </div>
            </div>

            {/* Quick Reply Suggestion Buttons Grid */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {filteredQuickReplies.map((reply) => {
                const labelText = reply.label[currentLanguage] || reply.label['en'];
                const queryText = reply.query[currentLanguage] || reply.query['en'];

                return (
                  <div key={reply.id} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (reply.isSpecialAction === 'sos') {
                          handleSosBeacon();
                        } else {
                          handleQuickPrompt(queryText);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm active:scale-95 ${reply.buttonStyle}`}
                    >
                      {reply.icon}
                      <span>{labelText}</span>
                    </button>

                    {/* Extra Triage Selector trigger specifically for injury button */}
                    {reply.id === 'injury' && (
                      <button
                        type="button"
                        onClick={() => setShowInjuryModal(true)}
                        className="ml-1 px-2 py-1.5 rounded-lg bg-rose-900/90 hover:bg-rose-800 text-rose-200 text-[10px] font-bold border border-rose-700 transition-colors"
                        title="Select specific injury type for EMS dispatch"
                      >
                        + Triage Options
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask in ${languages.find(l => l.code === currentLanguage)?.label} (or use Quick Replies above)...`}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right Column: Shelter Directory & Emergency Communications */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Shelter Directory Card */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Emergency Shelters</h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                Verified Safe
              </span>
            </div>

            <div className="space-y-2.5">
              {operationalShelters.map((shelter) => {
                const current = shelter.capacity?.current || 0;
                const max = shelter.capacity?.max || 100;
                const pct = Math.round((current / max) * 100);

                return (
                  <div
                    key={shelter.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-xs font-bold text-white">{shelter.name}</h4>
                        <div className="text-[10px] text-slate-400">{shelter.emergencySupplies}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
                        OPEN
                      </span>
                    </div>

                    {/* Capacity Meter */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Capacity Intake:</span>
                        <span className="font-mono text-slate-200">{current} / {max} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full ${pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>Radio: <b className="text-sky-400">{shelter.contactFreq}</b></span>
                      <button
                        onClick={() => setFocusedMapCoords([shelter.lat, shelter.lng])}
                        className="text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        View on Map →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Backup Frequencies */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Offline Radio Frequencies (Zero-Net):</span>
            </div>
            <p className="text-[11px] text-slate-400">
              If cellular internet is severed, emergency bulletins are broadcast continuously on these tactical frequencies:
            </p>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
              <div>VHF Marine/Rescue: <span className="text-amber-400">156.800 MHz (Ch 16)</span></div>
              <div>Municipal UHF Tac: <span className="text-amber-400">462.575 MHz</span></div>
              <div>AM Civil Defense: <span className="text-amber-400">740 kHz AM</span></div>
            </div>
          </div>

        </div>

      </div>

      {/* Rapid Injury Triage Modal (For High-Stress Scenarios) */}
      {showInjuryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white">Emergency Injury Triage Report</h3>
              </div>
              <button
                onClick={() => setShowInjuryModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select the primary injury to dispatch an immediate high-priority triage packet over the local mesh network:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSpecificInjuryReport('Severe Bleeding / Open Arterial Wound', 'Critical Trauma')}
                className="w-full p-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/90 border border-rose-700 text-left text-xs text-rose-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-rose-200">🩸 Severe Bleeding / Laceration</div>
                  <div className="text-[11px] text-rose-300/80">Continuous blood loss requiring tourniquet or direct pressure</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-900 text-[10px] font-mono font-bold text-rose-200">PRIORITY 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpecificInjuryReport('Suspected Fracture / Inability to Walk', 'Urgent Non-Life Threatening')}
                className="w-full p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">🦴 Suspected Broken Bone / Fracture</div>
                  <div className="text-[11px] text-slate-400">Unable to bear weight or evacuate without stretcher</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-[10px] font-mono font-bold text-amber-300">PRIORITY 2</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpecificInjuryReport('Smoke Inhalation / Severe Respiratory Distress', 'Critical Respiratory')}
                className="w-full p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">🫁 Smoke Inhalation / Difficulty Breathing</div>
                  <div className="text-[11px] text-slate-400">Coughing, wheezing, or chemical vapor exposure</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-[10px] font-mono font-bold text-rose-300">PRIORITY 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpecificInjuryReport('Head Trauma / Unconscious Victim', 'Critical Neurological')}
                className="w-full p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">⚠️ Head Trauma / Loss of Consciousness</div>
                  <div className="text-[11px] text-slate-400">Concussion, disorientation, or unresponsive patient</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-[10px] font-mono font-bold text-rose-300">PRIORITY 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpecificInjuryReport('Hypothermia / Flood Immersion', 'Moderate Thermal')}
                className="w-full p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-white">🌊 Hypothermia / Submerged in Floodwater</div>
                  <div className="text-[11px] text-slate-400">Severe shivering, pale lips, wet clothing in cold winds</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-950 text-[10px] font-mono font-bold text-sky-300">PRIORITY 2</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowInjuryModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Push Alert Composer Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white">Broadcast Public Emergency Alert</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Alert Headline:</label>
                <input
                  type="text"
                  value={alertHeadline}
                  onChange={(e) => setAlertHeadline(e.target.value)}
                  placeholder="e.g. FLASH FLOOD EVACUATION ORDER"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Detailed Instructions:</label>
                <textarea
                  value={alertBody}
                  onChange={(e) => setAlertBody(e.target.value)}
                  placeholder="e.g. Canal Basin residents must evacuate immediately to Highland Civic Arena. Avoid 7th St."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow"
                >
                  Broadcast to All Citizens
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

