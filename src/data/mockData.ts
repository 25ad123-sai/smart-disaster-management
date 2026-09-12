import { 
  SensorNode, 
  HazardZone, 
  CriticalFacility, 
  CitizenReport, 
  DroneMission, 
  DamageAssessment,
  AgencyLog
} from '../types';

// Centered on a realistic vulnerable urban valley basin [37.7600, -122.4200]
export const MAP_CENTER: [number, number] = [37.7600, -122.4200];
export const MAP_DEFAULT_ZOOM = 13;

export const INITIAL_SENSORS: SensorNode[] = [
  {
    id: 'HYDRO-01',
    name: 'Upper Valley River Gauge',
    type: 'hydrological',
    locationName: 'North Fork Basin (Mile 4.2)',
    lat: 37.7850,
    lng: -122.4400,
    currentValue: 2.3,
    unit: 'm (stage)',
    normalRange: [0.5, 2.5],
    warningThreshold: 3.2,
    criticalThreshold: 4.5,
    status: 'normal',
    meshHops: 2,
    batteryLevel: 91,
    lastReportedTime: 'Just now',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 1.8 },
      { time: 'T-15m', value: 1.9 },
      { time: 'T-10m', value: 2.1 },
      { time: 'T-5m', value: 2.2 },
      { time: 'Now', value: 2.3 }
    ]
  },
  {
    id: 'HYDRO-02',
    name: 'Downtown Estuary Weir',
    type: 'hydrological',
    locationName: 'Civic Center Drainage Canal',
    lat: 37.7550,
    lng: -122.4180,
    currentValue: 1.6,
    unit: 'm (stage)',
    normalRange: [0.4, 2.0],
    warningThreshold: 2.6,
    criticalThreshold: 3.8,
    status: 'normal',
    meshHops: 1,
    batteryLevel: 84,
    lastReportedTime: '10s ago',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 1.2 },
      { time: 'T-15m', value: 1.3 },
      { time: 'T-10m', value: 1.4 },
      { time: 'T-5m', value: 1.5 },
      { time: 'Now', value: 1.6 }
    ]
  },
  {
    id: 'SEISM-01',
    name: 'West Ridge Accelerometer',
    type: 'seismic',
    locationName: 'Fault Line Observatory Node 3',
    lat: 37.7380,
    lng: -122.4550,
    currentValue: 0.04,
    unit: 'g (PGA)',
    normalRange: [0.01, 0.08],
    warningThreshold: 0.25,
    criticalThreshold: 0.55,
    status: 'normal',
    meshHops: 3,
    batteryLevel: 78,
    lastReportedTime: '3s ago',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 0.02 },
      { time: 'T-15m', value: 0.03 },
      { time: 'T-10m', value: 0.03 },
      { time: 'T-5m', value: 0.04 },
      { time: 'Now', value: 0.04 }
    ]
  },
  {
    id: 'SEISM-02',
    name: 'Metro Suspension Bridge Monitor',
    type: 'seismic',
    locationName: 'Central Bay Bridge Pier 4',
    lat: 37.7900,
    lng: -122.3950,
    currentValue: 0.03,
    unit: 'g (vibration)',
    normalRange: [0.01, 0.06],
    warningThreshold: 0.20,
    criticalThreshold: 0.45,
    status: 'normal',
    meshHops: 1,
    batteryLevel: 96,
    lastReportedTime: '1s ago',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 0.03 },
      { time: 'T-15m', value: 0.03 },
      { time: 'T-10m', value: 0.04 },
      { time: 'T-5m', value: 0.03 },
      { time: 'Now', value: 0.03 }
    ]
  },
  {
    id: 'ATMO-01',
    name: 'Highland Met Station',
    type: 'atmospheric',
    locationName: 'Summit Radar Post',
    lat: 37.7450,
    lng: -122.4450,
    currentValue: 24.5,
    unit: 'mm/h (rain)',
    normalRange: [0, 10],
    warningThreshold: 35,
    criticalThreshold: 60,
    status: 'normal',
    meshHops: 2,
    batteryLevel: 68,
    lastReportedTime: '5s ago',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 5.0 },
      { time: 'T-15m', value: 12.0 },
      { time: 'T-10m', value: 18.0 },
      { time: 'T-5m', value: 21.0 },
      { time: 'Now', value: 24.5 }
    ]
  },
  {
    id: 'GAS-01',
    name: 'Industrial District Sniffer',
    type: 'gas',
    locationName: 'Chemical Depot Sector 7',
    lat: 37.7680,
    lng: -122.3900,
    currentValue: 18,
    unit: 'ppm (CO/VOC)',
    normalRange: [0, 25],
    warningThreshold: 50,
    criticalThreshold: 100,
    status: 'normal',
    meshHops: 1,
    batteryLevel: 89,
    lastReportedTime: '2s ago',
    isLastKnownGood: false,
    history: [
      { time: 'T-20m', value: 14 },
      { time: 'T-15m', value: 15 },
      { time: 'T-10m', value: 17 },
      { time: 'T-5m', value: 18 },
      { time: 'Now', value: 18 }
    ]
  }
];

export const HAZARD_ZONES: HazardZone[] = [
  {
    id: 'ZONE-FLOOD-A',
    name: 'Canal Basin Inundation Corridor',
    type: 'flood',
    severity: 'moderate',
    coordinates: [
      [37.7700, -122.4350],
      [37.7750, -122.4150],
      [37.7550, -122.4080],
      [37.7480, -122.4280]
    ],
    description: 'High-vulnerability hydrological zone covering historical floodplain and dense urban residential sectors.',
    affectedPopulation: 42500,
    criticalFacilitiesCount: 4
  },
  {
    id: 'ZONE-SEISMIC-B',
    name: 'West Valley Subduction Rupture Zone',
    type: 'seismic',
    severity: 'high',
    coordinates: [
      [37.7500, -122.4650],
      [37.7300, -122.4450],
      [37.7200, -122.4550],
      [37.7400, -122.4750]
    ],
    description: 'Unconsolidated sediment layer prone to liquefaction and lateral spreading during >5.5 Mw events.',
    affectedPopulation: 28900,
    criticalFacilitiesCount: 2
  },
  {
    id: 'ZONE-GAS-C',
    name: 'Port Chemical Vapor Dispersion Zone',
    type: 'gas_plume',
    severity: 'low',
    coordinates: [
      [37.7750, -122.3950],
      [37.7650, -122.3800],
      [37.7550, -122.3850],
      [37.7650, -122.4000]
    ],
    description: 'Downwind dispersion corridor from port chemical tanks and logistics warehouse.',
    affectedPopulation: 14200,
    criticalFacilitiesCount: 3
  }
];

export const CRITICAL_FACILITIES: CriticalFacility[] = [
  {
    id: 'FAC-HOSP-01',
    name: 'Memorial General Hospital',
    type: 'hospital',
    lat: 37.7640,
    lng: -122.4350,
    status: 'operational',
    capacity: { current: 310, max: 450 },
    emergencySupplies: 'Full ICU generator backup, 72h potable water, Level 1 Trauma',
    contactFreq: 'VHF Ch 16 (156.800 MHz)'
  },
  {
    id: 'FAC-SHELTER-01',
    name: 'Highland Civic Arena (Primary Shelter)',
    type: 'shelter',
    lat: 37.7520,
    lng: -122.4420,
    status: 'operational',
    capacity: { current: 180, max: 1200 },
    emergencySupplies: 'Cots, MRE rations (4,000 units), mobile clinic, satellite terminal',
    contactFreq: 'UHF Tac-2 (462.575 MHz)'
  },
  {
    id: 'FAC-SHELTER-02',
    name: 'East District High School Gymnasium',
    type: 'shelter',
    lat: 37.7480,
    lng: -122.4050,
    status: 'operational',
    capacity: { current: 65, max: 600 },
    emergencySupplies: 'First aid kits, water purification units, hygiene kits',
    contactFreq: 'UHF Tac-3'
  },
  {
    id: 'FAC-BRIDGE-01',
    name: 'Central Bay Overpass (Main Evacuation Corridor)',
    type: 'bridge',
    lat: 37.7780,
    lng: -122.4080,
    status: 'operational',
    emergencySupplies: 'Equipped with seismic strain gauges & structural radar',
    contactFreq: 'DOT Emergency Dispatch'
  },
  {
    id: 'FAC-POWER-01',
    name: 'Grid Substation Delta-9',
    type: 'power_substation',
    lat: 37.7620,
    lng: -122.4000,
    status: 'operational',
    emergencySupplies: 'Isolated busbar safety cutoffs, edge SCADA nodes'
  }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'REP-001',
    author: '@urban_witness99',
    source: 'Twitter/X',
    timestamp: '8 mins ago',
    rawText: 'URGENT!! The Central Bay Bridge just collapsed completely into the river! 50 cars submerged do NOT use highway 101!! #DisasterNow #Emergency',
    claimedLocation: 'Central Bay Overpass',
    claimedHazard: 'Bridge Collapse',
    sentimentUrgency: 'Panic',
    credibilityScore: 14,
    verificationStatus: 'contradicted_by_iot',
    contradictionReason: 'CONTRADICTED BY SENSOR: Bridge Accelerometer SEISM-02 reports normal ambient vibration (0.03g), and DOT camera confirms zero structural deflection.',
    associatedSensorId: 'SEISM-02',
    moderatorStatus: 'rejected'
  },
  {
    id: 'REP-002',
    author: 'Maria Vasquez (Verified Resident)',
    source: 'Telegram SDMS Bot',
    timestamp: '14 mins ago',
    rawText: 'Water is rising rapidly along 7th & Canal Street! Water is up to my front steps (about 30cm) and storm drains are bubbling backwards.',
    claimedLocation: 'Canal Basin Inundation Corridor',
    claimedHazard: 'Flooding',
    sentimentUrgency: 'Urgent',
    credibilityScore: 92,
    verificationStatus: 'verified_authentic',
    contradictionReason: 'CORROBORATED BY SENSOR: River gauge HYDRO-02 shows sharp stage increase to 1.6m (+28% in 15m), matching storm drain backflow physics.',
    associatedSensorId: 'HYDRO-02',
    moderatorStatus: 'approved'
  },
  {
    id: 'REP-003',
    author: 'Anonymous Caller',
    source: 'Citizen SMS',
    timestamp: '22 mins ago',
    rawText: 'There is a huge cloud of toxic ammonia gas drifting over City Hall from the harbor warehouse! People coughing everywhere.',
    claimedLocation: 'Port Chemical Depot',
    claimedHazard: 'Gas Leak',
    sentimentUrgency: 'Panic',
    credibilityScore: 31,
    verificationStatus: 'contradicted_by_iot',
    contradictionReason: 'CONTRADICTED BY SENSOR: Sniffer node GAS-01 reads normal 18 ppm VOC (well below 50 ppm threshold) and wind vector is blowing southwest away from City Hall.',
    associatedSensorId: 'GAS-01',
    moderatorStatus: 'quarantined'
  },
  {
    id: 'REP-004',
    author: 'David Chen (Volunteer CERT)',
    source: 'Radio Dispatch',
    timestamp: '31 mins ago',
    rawText: 'Fallen tree blocking two northbound lanes on Ridge Parkway near Highland Shelter. Small SUVs can bypass via shoulder.',
    claimedLocation: 'Ridge Parkway Route',
    claimedHazard: 'Road Blocked',
    sentimentUrgency: 'Urgent',
    credibilityScore: 88,
    verificationStatus: 'verified_authentic',
    contradictionReason: 'Consistent with Atmo-01 45km/h wind gusts recorded at 22:10. Field crew dispatched for clearing.',
    associatedSensorId: 'ATMO-01',
    moderatorStatus: 'approved'
  }
];

export const INITIAL_DRONE_MISSION: DroneMission = {
  id: 'UAV-ALPHA-1',
  droneCallsign: 'SkyGuard VTOL-01',
  battery: 82,
  altitudeMeters: 65,
  speedKmh: 38,
  linkQuality: 88,
  status: 'patrolling',
  activeInferenceMode: 'edge_lightweight',
  currentCoordinates: [37.7650, -122.4250],
  flightPath: [
    [37.7550, -122.4180],
    [37.7620, -122.4220],
    [37.7650, -122.4250],
    [37.7720, -122.4300],
    [37.7800, -122.4350]
  ],
  detectedDetections: [
    {
      id: 'DET-01',
      type: 'survivor',
      confidence: 0.94,
      bbox: [35, 42, 14, 18],
      lat: 37.7654,
      lng: -122.4248
    },
    {
      id: 'DET-02',
      type: 'flood_breach',
      confidence: 0.89,
      bbox: [62, 28, 22, 26],
      lat: 37.7661,
      lng: -122.4239
    },
    {
      id: 'DET-03',
      type: 'blocked_route',
      confidence: 0.86,
      bbox: [18, 70, 25, 15],
      lat: 37.7645,
      lng: -122.4255
    }
  ]
};

export const SAMPLE_DAMAGE_ASSESSMENTS: DamageAssessment[] = [
  {
    id: 'IMG-DAM-001',
    title: 'Canal District Residential Sector 4',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    captureTime: '12 mins ago (UAV Alpha-1)',
    damageLevel: 'Severe',
    confidence: 0.92,
    detectedFeatures: [
      'Submerged road network (est. depth >0.6m)',
      'Ground floor envelope compromise in 14 residences',
      'Floating debris obstruction on primary access lane'
    ],
    structuralIntegrityEstimate: 42,
    xaiReasoning: 'XAI Attribution: Convolutional edge kernels detected widespread specular water reflection across 68% of street pixels paired with mudline silt deposits at door lintels. High flood vulnerability index confirmed by GIS digital elevation model (6.2m ASL).',
    processingMode: 'Edge CV Model'
  },
  {
    id: 'IMG-DAM-002',
    title: 'Central Bay Bridge Pier Foundation Inspection',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    captureTime: '24 mins ago (UAV Alpha-1)',
    damageLevel: 'Minor',
    confidence: 0.97,
    detectedFeatures: [
      'Concrete pier expansion joints intact',
      'No shear displacement visible along bearings',
      'Surface water spray only, structural cables undamaged'
    ],
    structuralIntegrityEstimate: 96,
    xaiReasoning: 'XAI Attribution: Structural edge line persistence analysis verified vertical alignment within 0.2mm tolerance. Corroborates accelerometer node SEISM-02 baseline vibration. Cross-checked with citizen rumor REP-001 to formally debunk false collapse claims.',
    processingMode: 'Edge CV Model'
  },
  {
    id: 'IMG-DAM-003',
    title: 'West Ridge Industrial Storage Perimeter',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    captureTime: '38 mins ago (Satellite Sentinel-2)',
    damageLevel: 'Moderate',
    confidence: 0.85,
    detectedFeatures: [
      'Roof cladding partially detached on Bay 3',
      'Secondary containment berm retaining minor storm runoff',
      'Hazardous material vessels secure'
    ],
    structuralIntegrityEstimate: 74,
    xaiReasoning: 'XAI Attribution: Multi-spectral difference index identified corrugated sheet displacement without tank puncture. Gas sniffer node GAS-01 readings support intact containment.',
    processingMode: 'Cloud Vision AI'
  }
];

export const INITIAL_AGENCY_LOGS: AgencyLog[] = [
  {
    id: 'LOG-01',
    timestamp: '22:24:10',
    agency: 'SDMS Automated Edge',
    priority: 'info',
    message: 'Edge nodes initialized. LoRa mesh topology healthy (3 hops max latency 140ms).',
    syncStatus: 'synced_to_cloud'
  },
  {
    id: 'LOG-02',
    timestamp: '22:25:30',
    agency: 'National Weather Service',
    priority: 'warning',
    message: 'Atmospheric convective cell intensifying over West Ridge; 45mm/h precipitation rate imminent.',
    syncStatus: 'synced_to_cloud'
  },
  {
    id: 'LOG-03',
    timestamp: '22:27:00',
    agency: 'Metro Fire & Rescue',
    priority: 'info',
    message: 'Highland Civic Arena shelter ready for intake. 1,000 capacity remaining with auxiliary power.',
    syncStatus: 'synced_to_cloud'
  },
  {
    id: 'LOG-04',
    timestamp: '22:28:15',
    agency: 'Red Cross Incident Team',
    priority: 'critical',
    message: 'Ambulance rerouted from Canal Road to 10th Ave due to stage warning on HYDRO-02.',
    syncStatus: 'synced_to_cloud'
  }
];
