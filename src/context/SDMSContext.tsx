import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ConnectivityMode, 
  UserRole, 
  SensorNode, 
  HazardZone, 
  CriticalFacility, 
  MCDMZoneRanking, 
  AHPWeights,
  PredictionForecast,
  DamageAssessment,
  CitizenReport,
  DroneMission,
  ChatMessage,
  AgencyLog,
  DegradedSyncPacket
} from '../types';
import { 
  INITIAL_SENSORS, 
  HAZARD_ZONES, 
  CRITICAL_FACILITIES, 
  INITIAL_REPORTS, 
  INITIAL_DRONE_MISSION, 
  SAMPLE_DAMAGE_ASSESSMENTS,
  INITIAL_AGENCY_LOGS
} from '../data/mockData';
import { calculateMCDMRankings, DEFAULT_AHP_WEIGHTS } from '../services/mcdmEngine';
import { analyzeCitizenReport } from '../services/misinformationEngine';
import { generateForecasts } from '../services/edgePredictionEngine';

interface SDMSContextType {
  // Connectivity
  connectivityMode: ConnectivityMode;
  setConnectivityMode: (mode: ConnectivityMode) => void;
  bandwidthKbps: number;
  edgeSyncQueue: DegradedSyncPacket[];
  reconcileSyncQueue: () => void;
  
  // Roles
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;

  // IoT Sensors
  sensors: SensorNode[];
  triggerDisasterEvent: () => void;
  resetToNormal: () => void;
  manuallyAdjustSensor: (id: string, delta: number) => void;

  // GIS & MCDM
  zones: HazardZone[];
  facilities: CriticalFacility[];
  ahpWeights: AHPWeights;
  setAhpWeights: React.Dispatch<React.SetStateAction<AHPWeights>>;
  mcdmRankings: MCDMZoneRanking[];
  focusedMapCoords: [number, number] | null;
  setFocusedMapCoords: (coords: [number, number] | null) => void;

  // AI/ML Prediction
  forecasts: PredictionForecast[];
  damageAssessments: DamageAssessment[];
  addDamageAssessment: (assessment: DamageAssessment) => void;

  // Misinformation
  reports: CitizenReport[];
  submitReport: (text: string, author?: string, source?: CitizenReport['source'], location?: string) => void;
  updateReportModeration: (id: string, status: CitizenReport['moderatorStatus']) => void;

  // Drone
  droneMission: DroneMission;
  setDroneInferenceMode: (mode: 'edge_lightweight' | 'cloud_heavyweight') => void;

  // Chatbot
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  broadcastAlert: (title: string, message: string) => void;
  currentLanguage: 'en' | 'es' | 'hi' | 'fr' | 'tl';
  setCurrentLanguage: (lang: 'en' | 'es' | 'hi' | 'fr' | 'tl') => void;

  // Coordination
  agencyLogs: AgencyLog[];
  addAgencyLog: (agency: AgencyLog['agency'], message: string, priority: AgencyLog['priority']) => void;

  // Guided Demo Scenario
  activeDemoStep: number;
  runDemoStep: (step: number) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  isArchModalOpen: boolean;
  setIsArchModalOpen: (open: boolean) => void;
}

const SDMSContext = createContext<SDMSContextType | undefined>(undefined);

export const SDMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Connectivity & Edge Sync
  const [connectivityMode, setConnectivityModeState] = useState<ConnectivityMode>('online');
  const [edgeSyncQueue, setEdgeSyncQueue] = useState<DegradedSyncPacket[]>([]);
  
  // User Role
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('coordinator');

  // IoT Sensor Layer
  const [sensors, setSensors] = useState<SensorNode[]>(INITIAL_SENSORS);

  // GIS & MCDM
  const [zones] = useState<HazardZone[]>(HAZARD_ZONES);
  const [facilities] = useState<CriticalFacility[]>(CRITICAL_FACILITIES);
  const [ahpWeights, setAhpWeights] = useState<AHPWeights>(DEFAULT_AHP_WEIGHTS);
  const [focusedMapCoords, setFocusedMapCoords] = useState<[number, number] | null>(null);

  // AI & Damage
  const [damageAssessments, setDamageAssessments] = useState<DamageAssessment[]>(SAMPLE_DAMAGE_ASSESSMENTS);

  // Misinformation & Citizen Reports
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);

  // Drone
  const [droneMission, setDroneMission] = useState<DroneMission>(INITIAL_DRONE_MISSION);

  // Chatbot
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es' | 'hi' | 'fr' | 'tl'>('en');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-INIT-1',
      sender: 'assistant',
      text: 'Welcome to the SDMS Citizen Safety Assistant. I can assist you with real-time evacuation corridors, open emergency shelters, flood depth warnings, and verified official guidance even during network disruptions.',
      timestamp: 'Just now',
      language: 'en',
      isEdgeGenerated: true,
      actions: [
        { label: 'Find Nearest Shelter', actionType: 'find_shelter' },
        { label: 'Check Flood Routes', actionType: 'flood_route' },
        { label: 'Report Emergency', actionType: 'report_sos' }
      ]
    }
  ]);

  // Agency Coordination Logs
  const [agencyLogs, setAgencyLogs] = useState<AgencyLog[]>(INITIAL_AGENCY_LOGS);

  // Modals & Demo
  const [activeDemoStep, setActiveDemoStep] = useState<number>(1);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Compute Bandwidth based on Connectivity Mode
  const bandwidthKbps = connectivityMode === 'online' 
    ? 100000 
    : connectivityMode === 'degraded_mesh' 
      ? 2.4 
      : 0;

  // Custom setConnectivityMode with auto-logging
  const setConnectivityMode = useCallback((mode: ConnectivityMode) => {
    setConnectivityModeState(mode);
    const timeStr = new Date().toLocaleTimeString();
    
    if (mode === 'offline_islanded') {
      // Mark sensors as reporting Last-Known-Good data
      setSensors(prev => prev.map(s => ({
        ...s,
        isLastKnownGood: true,
        lastReportedTime: 'LKG (T-0m cached)'
      })));
      setDroneMission(prev => ({
        ...prev,
        activeInferenceMode: 'edge_lightweight',
        linkQuality: 0
      }));
      // Append Agency Log
      setAgencyLogs(prev => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: timeStr,
          agency: 'SDMS Automated Edge',
          priority: 'critical',
          message: 'CRITICAL: Terrestrial backhaul severed. Fallback to Local Islanded Mode. Edge inference and LKG cache active.',
          syncStatus: 'stored_in_edge_cache'
        },
        ...prev
      ]);
    } else if (mode === 'degraded_mesh') {
      setSensors(prev => prev.map(s => ({
        ...s,
        isLastKnownGood: false,
        meshHops: Math.min(s.meshHops + 1, 5)
      })));
      setDroneMission(prev => ({
        ...prev,
        activeInferenceMode: 'edge_lightweight',
        linkQuality: 28
      }));
      setAgencyLogs(prev => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: timeStr,
          agency: 'SDMS Automated Edge',
          priority: 'warning',
          message: 'WARNING: Network degraded to 2.4 kbps LoRa mesh. Delta sync activated; heavy cloud payloads suppressed.',
          syncStatus: 'stored_in_edge_cache'
        },
        ...prev
      ]);
    } else {
      // Reconnected to Online
      setSensors(prev => prev.map(s => ({
        ...s,
        isLastKnownGood: false,
        lastReportedTime: 'Just now'
      })));
      setDroneMission(prev => ({
        ...prev,
        linkQuality: 94
      }));
      setAgencyLogs(prev => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: timeStr,
          agency: 'SDMS Automated Edge',
          priority: 'info',
          message: 'Cloud link fully restored (100 Mbps). Auto-reconciling pending edge packets with central command.',
          syncStatus: 'synced_to_cloud'
        },
        ...prev
      ]);
    }
  }, []);

  // Reconcile Edge Queue when online
  const reconcileSyncQueue = useCallback(() => {
    if (edgeSyncQueue.length === 0) return;
    const packetCount = edgeSyncQueue.length;
    setEdgeSyncQueue([]);
    setAgencyLogs(prev => [
      {
        id: `LOG-RECON-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agency: 'SDMS Automated Edge',
        priority: 'info',
        message: `Edge Sync Reconciled: Successfully synced ${packetCount} cached packets (GIS telemetry, citizen reports, and sensor logs) to central cloud database.`,
        syncStatus: 'synced_to_cloud'
      },
      ...prev
    ]);
  }, [edgeSyncQueue]);

  // Push packets to Edge Queue if offline/degraded
  const queueSyncPacket = useCallback((source: DegradedSyncPacket['sourceModule'], summary: string, sizeBytes: number) => {
    if (connectivityMode === 'online') return;
    const newPacket: DegradedSyncPacket = {
      id: `PKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      sourceModule: source,
      payloadSummary: summary,
      sizeBytes,
      status: connectivityMode === 'degraded_mesh' ? 'transmitting_mesh' : 'queued_local'
    };
    setEdgeSyncQueue(prev => [newPacket, ...prev.slice(0, 49)]);
  }, [connectivityMode]);

  // Periodic sensor drift / live telemetry simulation (runs every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors(prev => prev.map(s => {
        // If offline, sensors maintain last-known-good value but timestamp reflects staleness
        if (connectivityMode === 'offline_islanded') {
          return {
            ...s,
            isLastKnownGood: true,
            lastReportedTime: 'LKG (Cached Offline)'
          };
        }

        // Slight natural fluctuation
        let noise = (Math.random() - 0.48) * 0.04;
        if (s.type === 'atmospheric') noise = (Math.random() - 0.48) * 0.6;
        if (s.type === 'gas') noise = (Math.random() - 0.48) * 1.2;

        let nextVal = Math.max(0, parseFloat((s.currentValue + noise).toFixed(2)));
        
        let status: SensorNode['status'] = 'normal';
        if (nextVal >= s.criticalThreshold) status = 'critical';
        else if (nextVal >= s.warningThreshold) status = 'warning';

        const updatedHistory = [...s.history.slice(1), { time: 'Now', value: nextVal }];
        return {
          ...s,
          currentValue: nextVal,
          status,
          isLastKnownGood: false,
          lastReportedTime: connectivityMode === 'degraded_mesh' ? 'Mesh sync (12s ago)' : 'Just now',
          history: updatedHistory
        };
      }));

      // Advance drone along flight path slightly
      setDroneMission(prev => {
        const nextCoord: [number, number] = [
          prev.currentCoordinates[0] + (Math.random() - 0.5) * 0.0004,
          prev.currentCoordinates[1] + (Math.random() - 0.5) * 0.0004
        ];
        return {
          ...prev,
          currentCoordinates: nextCoord,
          battery: Math.max(15, prev.battery - 0.02)
        };
      });

    }, 4000);

    return () => clearInterval(timer);
  }, [connectivityMode]);

  // Disaster Event Trigger
  const triggerDisasterEvent = useCallback(() => {
    setSensors(prev => prev.map(s => {
      if (s.id === 'HYDRO-01') {
        return {
          ...s,
          currentValue: 4.8,
          status: 'critical',
          history: [...s.history.slice(1), { time: 'Event', value: 4.8 }]
        };
      }
      if (s.id === 'HYDRO-02') {
        return {
          ...s,
          currentValue: 3.4,
          status: 'warning',
          history: [...s.history.slice(1), { time: 'Event', value: 3.4 }]
        };
      }
      if (s.id === 'SEISM-01') {
        return {
          ...s,
          currentValue: 0.48,
          status: 'warning',
          history: [...s.history.slice(1), { time: 'Event', value: 0.48 }]
        };
      }
      if (s.id === 'ATMO-01') {
        return {
          ...s,
          currentValue: 64.0,
          status: 'critical',
          history: [...s.history.slice(1), { time: 'Event', value: 64.0 }]
        };
      }
      return s;
    }));

    // Add agency log
    setAgencyLogs(prev => [
      {
        id: `LOG-DISASTER-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agency: 'SDMS Automated Edge',
        priority: 'critical',
        message: 'EMERGENCY TRIGGER: Multiple sensor thresholds breached! Severe hydrological storm event active in Canal Basin.',
        syncStatus: connectivityMode === 'online' ? 'synced_to_cloud' : 'stored_in_edge_cache'
      },
      ...prev
    ]);

    queueSyncPacket('IoT Sensors', 'Critical Flash Flood & Rainfall threshold alerts (HYDRO-01 4.8m, ATMO-01 64mm/h)', 420);
  }, [connectivityMode, queueSyncPacket]);

  // Reset to Baseline Normal
  const resetToNormal = useCallback(() => {
    setSensors(INITIAL_SENSORS);
    setAgencyLogs(prev => [
      {
        id: `LOG-RESET-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agency: 'SDMS Automated Edge',
        priority: 'info',
        message: 'System baseline recalibrated. All sensor telemetry normalized to standard operating ranges.',
        syncStatus: connectivityMode === 'online' ? 'synced_to_cloud' : 'stored_in_edge_cache'
      },
      ...prev
    ]);
  }, [connectivityMode]);

  // Manual sensor tweaking
  const manuallyAdjustSensor = useCallback((id: string, delta: number) => {
    setSensors(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextVal = Math.max(0, parseFloat((s.currentValue + delta).toFixed(2)));
      let status: SensorNode['status'] = 'normal';
      if (nextVal >= s.criticalThreshold) status = 'critical';
      else if (nextVal >= s.warningThreshold) status = 'warning';
      return {
        ...s,
        currentValue: nextVal,
        status,
        history: [...s.history.slice(1), { time: 'Adj', value: nextVal }]
      };
    }));
  }, []);

  // Compute dynamic MCDM rankings from current sensors + AHP weights
  const mcdmRankings = calculateMCDMRankings(zones, sensors, facilities, ahpWeights);

  // Compute dynamic AI hazard forecasts
  const forecasts = generateForecasts(sensors, zones, connectivityMode);

  // Submit citizen report with automated NLP & Sensor contradiction analysis
  const submitReport = useCallback((
    text: string, 
    author = 'Citizen Reporter', 
    source: CitizenReport['source'] = 'Telegram SDMS Bot', 
    location = 'Metro Area'
  ) => {
    const analysis = analyzeCitizenReport(text, sensors, zones);
    const newReport: CitizenReport = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      author,
      source,
      timestamp: 'Just now',
      rawText: text,
      claimedLocation: location,
      claimedHazard: analysis.claimedHazard,
      sentimentUrgency: analysis.sentimentUrgency,
      credibilityScore: analysis.credibilityScore,
      verificationStatus: analysis.verificationStatus,
      contradictionReason: analysis.contradictionReason,
      associatedSensorId: analysis.associatedSensorId,
      moderatorStatus: analysis.credibilityScore >= 75 ? 'approved' : analysis.verificationStatus === 'contradicted_by_iot' ? 'rejected' : 'pending'
    };

    setReports(prev => [newReport, ...prev]);

    // Queue sync packet if degraded/offline
    queueSyncPacket('Citizen Reports', `Report ${newReport.id} [${newReport.claimedHazard}] credibility: ${newReport.credibilityScore}%`, 180);

    // If urgent and contradicted, log to agency
    if (newReport.verificationStatus === 'contradicted_by_iot') {
      setAgencyLogs(prev => [
        {
          id: `LOG-MISINFO-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          agency: 'SDMS Automated Edge',
          priority: 'warning',
          message: `Misinformation Filter: Flagged rumor "${newReport.claimedHazard}" with ${newReport.credibilityScore}% credibility score. Cross-checked with sensor ${newReport.associatedSensorId}.`,
          syncStatus: connectivityMode === 'online' ? 'synced_to_cloud' : 'stored_in_edge_cache'
        },
        ...prev
      ]);
    }
  }, [sensors, zones, connectivityMode, queueSyncPacket]);

  // Update report moderation status
  const updateReportModeration = useCallback((id: string, status: CitizenReport['moderatorStatus']) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, moderatorStatus: status } : r));
  }, []);

  // Damage assessments
  const addDamageAssessment = useCallback((assessment: DamageAssessment) => {
    setDamageAssessments(prev => [assessment, ...prev]);
    queueSyncPacket('Drone Recon', `Damage assessment ${assessment.id}: ${assessment.damageLevel} (${assessment.structuralIntegrityEstimate}% integrity)`, 380);
  }, [queueSyncPacket]);

  // Drone inference mode switcher
  const setDroneInferenceMode = useCallback((mode: 'edge_lightweight' | 'cloud_heavyweight') => {
    setDroneMission(prev => ({
      ...prev,
      activeInferenceMode: mode
    }));
  }, []);

  // Send Chatbot message with local offline fallback logic
  const sendChatMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      language: currentLanguage
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Generate local offline-capable assistant reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let actions: ChatMessage['actions'] = [];

      if (lower.includes('injury') || lower.includes('injur') || lower.includes('medical') || lower.includes('hurt') || lower.includes('bleed') || lower.includes('wound') || lower.includes('triage') || lower.includes('ambulance') || lower.includes('doctor')) {
        reply = currentLanguage === 'es'
          ? '🚨 TRIAJE DE EMERGENCIA / REPORTE DE LESIÓN:\n1. Aplique presión firme y continua sobre heridas abiertas usando tela limpia o apósito.\n2. NO mueva a la persona si sospecha traumatismo craneal o espinal, salvo riesgo inminente.\n3. Si hay shock: mantenga a la persona abrigada y con pies ligeramente elevados.\n4. Hospital más cercano: Memorial General Hospital (1.8 km NE, Trauma Nivel 1 operativo con energía de respaldo).\n5. Se ha transmitido un paquete de despacho médico prioritario a la red de respuesta.'
          : currentLanguage === 'hi'
          ? '🚨 आपातकालीन चिकित्सा / चोट रिपोर्ट:\n1. रक्तस्राव वाले घावों पर साफ कपड़े से सीधा दबाव डालें।\n2. रीढ़ की हड्डी में चोट होने का संदेह होने पर रोगी को न हिलाएं।\n3. निकटतम अस्पताल: मेमोरियल जनरल अस्पताल (1.8 किमी उत्तर-पूर्व, ट्रॉमा यूनिट व जनरेटर सक्रिय)।\n4. आपातकालीन मेडिकल बीकन स्थानीय मेश नेटवर्क पर प्रसारित किया गया है।'
          : currentLanguage === 'fr'
          ? '🚨 URGENCE MÉDICALE / RAPPORT DE BLESSURE:\n1. Appliquez une compression directe avec un linge propre sur les plaies hémorragiques.\n2. Ne déplacez pas la victime en cas de suspicion de traumatisme crânien/rachidien.\n3. Hôpital le plus proche: Memorial General Hospital (1,8 km, Urgences Niveau 1 actives).\n4. Balise médicale d’urgence transmise au réseau de secours local.'
          : currentLanguage === 'tl'
          ? '🚨 MEDIKAL NA KAGIPITAN / REPORT NG PINSALA:\n1. Idiin nang direkta ang malinis na tela sa sugat na dumudugo.\n2. Huwag galawin ang pasyente kung may suspetsa ng pinsala sa likod o leeg.\n3. Pinakamalapit na ospital: Memorial General Hospital (1.8 km NE, bukas ang Level 1 Trauma).\n4. Naipadala na ang priority medical dispatch beacon sa responder network.'
          : '🚨 EMERGENCY MEDICAL TRIAGE & INJURY ADVISORY:\n1. Apply firm, direct pressure to bleeding wounds using clean cloth or dressing. Maintain pressure for at least 5 minutes.\n2. Do NOT move individuals with suspected neck or spinal injury unless immediate fire/flood threatens life.\n3. Nearest Operational Hospital: Memorial General Hospital (1.8 km NE, Level 1 Trauma Unit active, continuous generator power).\n4. Priority medical packet dispatched to Field Incident Commander via LoRa mesh beacon.';
        actions = [
          { label: 'Dispatch Medical SOS Beacon', actionType: 'report_sos' },
          { label: 'Locate Memorial General Hospital', actionType: 'focus_hospital' },
          { label: 'Triage Radio Net (VHF 16)', actionType: 'radio_call' }
        ];
        queueSyncPacket('Citizen Chat', 'URGENT: Citizen injury/medical distress query received at edge node', 220);
      } else if (lower.includes('shelter') || lower.includes('refuge') || lower.includes('safe place') || lower.includes('where to go')) {
        reply = currentLanguage === 'es'
          ? 'El refugio principal seguro y operativo es Highland Civic Arena (1.2 km al oeste, 1,020 lugares disponibles, energía de respaldo y agua potable activa). Refugio secundario: Gimnasio East District High School (2.1 km al sur, 535 lugares disponibles). Evite la Avenida Canal por anegamiento.'
          : currentLanguage === 'hi'
          ? 'निकटतम सुरक्षित आश्रय हाइलैंड सिविक एरीना है (1.2 किमी पश्चिम, 1,020 बिस्तर उपलब्ध हैं, स्वच्छ जल व जनरेटर सक्रिय)। दूसरा आश्रय: ईस्ट डिस्ट्रिक्ट स्कूल (2.1 किमी दक्षिण)। नहर मार्ग पर जलभराव से बचें।'
          : currentLanguage === 'fr'
          ? 'L’abri principal ouvert est Highland Civic Arena (1,2 km à l’ouest, 1 020 places libres avec groupe électrogène et eau filtrée). Abri secondaire: East District High School (2,1 km au sud). Évitez le canal 7th St.'
          : currentLanguage === 'tl'
          ? 'Ang pangunahing ligtas na evacuation shelter ay Highland Civic Arena (1.2 km pakanluran, 1,020 espasyo, may kuryente at inuming tubig). Pangalawang shelter: East District High School Gym (2.1 km patimog). Iwasan ang Canal Avenue dahil sa baha.'
          : 'The primary operational shelter is Highland Civic Arena (1.2 km west, 1,020 beds remaining, auxiliary generator & potable water active). Secondary shelter: East District High School Gymnasium (2.1 km south, 535 beds available). Avoid Canal Avenue due to rising flood waters.';
        actions = [
          { label: 'View Highland Civic Arena on Map', actionType: 'focus_shelter' },
          { label: 'View East High School on Map', actionType: 'focus_shelter_2' },
          { label: 'Call Shelter Dispatch (VHF 16)', actionType: 'radio_call' }
        ];
      } else if (lower.includes('route') || lower.includes('evacuat') || lower.includes('escape') || lower.includes('path') || lower.includes('how to leave')) {
        reply = currentLanguage === 'es'
          ? 'RUTA SEGURA DE EVACUACIÓN: 1) Tome Skyline Ridge Boulevard en dirección Oeste hacia Highland Civic Arena. 2) Cruce por el Puente Central Bay (verificado y abierto). 3) EVITE Canal Basin y calle 7ma (inundación crítica > 0.8m).'
          : 'SAFE EVACUATION ROUTE RECOMMENDATION:\n1. Proceed via Skyline Ridge Boulevard heading West towards Highland Civic Arena.\n2. Cross via Central Bay Overpass (structural sensors confirm stable and OPEN).\n3. DANGER: Strictly avoid Canal Basin corridor and 7th Street (flood depth exceeding 0.8m with strong currents).';
        actions = [
          { label: 'Inspect Safe Overpass on Map', actionType: 'focus_bridge' },
          { label: 'Guide to Highland Shelter', actionType: 'focus_shelter' }
        ];
      } else if (lower.includes('drink') || lower.includes('potable') || lower.includes('supplies') || lower.includes('food') || lower.includes('ration')) {
        reply = 'DRINKING WATER & EMERGENCY SUPPLIES:\n1. Municipal tap water in Canal Basin & Downtown is under a BOIL WATER advisory due to storm main contamination.\n2. Potable bulk water tankers and 4,000 MRE meal rations are stationed at Highland Civic Arena.\n3. If without clean water: boil vigorously for 1 full minute or use approved emergency chlorine disinfection tablets.';
        actions = [
          { label: 'Navigate to Water Distribution', actionType: 'focus_shelter' },
          { label: 'Emergency Water Guidance', actionType: 'radio_call' }
        ];
      } else if (lower.includes('bridge') || lower.includes('collapse') || lower.includes('overpass')) {
        reply = currentLanguage === 'es'
          ? 'VERIFICADO: El Puente Central Bay NO ha colapsado. Los sensores de vibración estructural confirman integridad total (0.03g). Los rumores de colapso han sido desmentidos.'
          : 'VERIFIED OFFICIAL UPDATE: Central Bay Overpass is structurally sound and OPEN for emergency evacuation. IoT accelerometer SEISM-02 confirms normal harmonic readings (0.03g). Viral claims of collapse are FALSE rumors.';
        actions = [
          { label: 'Inspect Bridge Accelerometer', actionType: 'view_seism02' },
          { label: 'View Drone Inspection', actionType: 'view_drone' }
        ];
      } else if (lower.includes('water') || lower.includes('flood') || lower.includes('river')) {
        reply = `Hydrological status: River Gauge HYDRO-01 is at ${sensors[0].currentValue}m (${sensors[0].status.toUpperCase()}). Stay away from 7th & Canal Basin. If water enters your dwelling, move to highest floor immediately.`;
        actions = [
          { label: 'Check Hydrological Sensors', actionType: 'view_hydro' }
        ];
      } else {
        reply = `SDMS Edge Assistant: Automated guidance active. Current network mode is ${connectivityMode.toUpperCase()}. All 7 emergency modules are functioning via local edge inference. For life-threatening emergencies, radio frequency VHF Ch 16 is active.`;
        actions = [
          { label: 'Find Nearest Shelter', actionType: 'find_shelter' },
          { label: 'Trigger Emergency SOS Beacon', actionType: 'report_sos' }
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `ASST-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        language: currentLanguage,
        isEdgeGenerated: connectivityMode !== 'online',
        actions
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    }, 600);
  }, [currentLanguage, connectivityMode, sensors]);

  // Broadcast Alert to Citizen Chat
  const broadcastAlert = useCallback((title: string, message: string) => {
    const alertMsg: ChatMessage = {
      id: `ALERT-${Date.now()}`,
      sender: 'system_alert',
      text: `🚨 [OFFICIAL EMERGENCY ALERT - ${title.toUpperCase()}]: ${message}`,
      timestamp: 'Just now',
      language: currentLanguage
    };
    setChatMessages(prev => [...prev, alertMsg]);
    queueSyncPacket('Agency Dispatch', `Emergency Broadcast: ${title}`, 210);
  }, [currentLanguage, queueSyncPacket]);

  // Add Agency Log
  const addAgencyLog = useCallback((agency: AgencyLog['agency'], message: string, priority: AgencyLog['priority']) => {
    setAgencyLogs(prev => [
      {
        id: `LOG-MANUAL-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agency,
        priority,
        message,
        syncStatus: connectivityMode === 'online' ? 'synced_to_cloud' : 'stored_in_edge_cache'
      },
      ...prev
    ]);
    queueSyncPacket('Agency Dispatch', `[${agency}] ${message}`, 150);
  }, [connectivityMode, queueSyncPacket]);

  // Interactive 5-Step Demo Script Runner
  const runDemoStep = useCallback((step: number) => {
    setActiveDemoStep(step);
    if (step === 1) {
      // Step 1: Normal Operation
      setConnectivityMode('online');
      resetToNormal();
      setDroneInferenceMode('cloud_heavyweight');
    } else if (step === 2) {
      // Step 2: Simulated Disaster Event
      triggerDisasterEvent();
      broadcastAlert('Flash Flood Evacuation Order', 'Canal Basin residents ordered to evacuate towards Highland Civic Arena immediately due to rapid stage rise.');
    } else if (step === 3) {
      // Step 3: Connectivity Loss
      setConnectivityMode('degraded_mesh');
    } else if (step === 4) {
      // Step 4: Degraded Mode Fallback (Offline Islanded)
      setConnectivityMode('offline_islanded');
      setDroneInferenceMode('edge_lightweight');
    } else if (step === 5) {
      // Step 5: Recovery & Reconciliation
      setConnectivityMode('online');
      reconcileSyncQueue();
      setDroneInferenceMode('cloud_heavyweight');
    }
  }, [setConnectivityMode, resetToNormal, setDroneInferenceMode, triggerDisasterEvent, broadcastAlert, reconcileSyncQueue]);

  return (
    <SDMSContext.Provider value={{
      connectivityMode,
      setConnectivityMode,
      bandwidthKbps,
      edgeSyncQueue,
      reconcileSyncQueue,
      currentUserRole,
      setCurrentUserRole,
      sensors,
      triggerDisasterEvent,
      resetToNormal,
      manuallyAdjustSensor,
      zones,
      facilities,
      ahpWeights,
      setAhpWeights,
      mcdmRankings,
      focusedMapCoords,
      setFocusedMapCoords,
      forecasts,
      damageAssessments,
      addDamageAssessment,
      reports,
      submitReport,
      updateReportModeration,
      droneMission,
      setDroneInferenceMode,
      chatMessages,
      sendChatMessage,
      broadcastAlert,
      currentLanguage,
      setCurrentLanguage,
      agencyLogs,
      addAgencyLog,
      activeDemoStep,
      runDemoStep,
      isDemoModalOpen,
      setIsDemoModalOpen,
      isArchModalOpen,
      setIsArchModalOpen
    }}>
      {children}
    </SDMSContext.Provider>
  );
};

export const useSDMS = () => {
  const context = useContext(SDMSContext);
  if (!context) {
    throw new Error('useSDMS must be used within an SDMSProvider');
  }
  return context;
};
