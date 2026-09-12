export type ConnectivityMode = 'online' | 'degraded_mesh' | 'offline_islanded';

export type UserRole = 
  | 'coordinator'      // Emergency Operations Center (EOC) Commander
  | 'sensor_operator'  // IoT & Environmental Monitoring Specialist
  | 'gis_analyst'      // Geospatial Decision Analyst
  | 'drone_operator'   // Tactical UAV Pilot & Recon Specialist
  | 'citizen';         // Affected Public / Evacuee

export type SensorType = 'hydrological' | 'seismic' | 'atmospheric' | 'gas';

export interface SensorNode {
  id: string;
  name: string;
  type: SensorType;
  locationName: string;
  lat: number;
  lng: number;
  currentValue: number;
  unit: string;
  normalRange: [number, number];
  warningThreshold: number;
  criticalThreshold: number;
  status: 'normal' | 'warning' | 'critical' | 'stale';
  meshHops: number; // Low-power protocol simulation (1 = direct gateway, 2-4 = multi-hop LoRa)
  batteryLevel: number; // percentage
  lastReportedTime: string;
  isLastKnownGood: boolean; // Flagged when connection is degraded/offline
  history: { time: string; value: number }[];
}

export interface HazardZone {
  id: string;
  name: string;
  type: 'flood' | 'seismic' | 'gas_plume' | 'landslide';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  coordinates: [number, number][]; // Polygon vertices [lat, lng]
  description: string;
  affectedPopulation: number;
  criticalFacilitiesCount: number;
}

export interface CriticalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'bridge' | 'power_substation' | 'water_facility';
  lat: number;
  lng: number;
  status: 'operational' | 'at_risk' | 'compromised' | 'evacuated';
  capacity?: { current: number; max: number };
  emergencySupplies: string;
  contactFreq?: string;
}

export interface MCDMZoneRanking {
  zoneId: string;
  zoneName: string;
  sensorAnomalyScore: number;     // 0 - 100
  populationDensityScore: number; // 0 - 100
  infrastructureRiskScore: number;// 0 - 100
  topographicVulnerability: number; // 0 - 100
  compositeRiskScore: number;      // 0 - 100 (AHP/TOPSIS derived)
  rank: number;
  recommendedAction: string;
}

export interface AHPWeights {
  sensorAnomaly: number;
  populationDensity: number;
  infrastructureRisk: number;
  topographicVulnerability: number;
}

export interface PredictionForecast {
  hazardType: 'Flash Flood Crest' | 'Seismic Aftershock' | 'Chemical Vapor Dispersion' | 'Structural Failure';
  timeHorizon: '1 Hour' | '3 Hours' | '6 Hours';
  predictedSeverity: 'Moderate' | 'High' | 'Catastrophic';
  confidenceScore: number; // percentage
  xaiExplanation: {
    primaryReason: string;
    contributingFactors: { factor: string; weight: number; observation: string }[];
    recommendedCountermeasure: string;
  };
  modelUsed: 'Local Edge Heuristic (Offline)' | 'On-Device Quantized MobileNet' | 'Cloud Transformer v4.2';
}

export interface DamageAssessment {
  id: string;
  title: string;
  imageUrl: string;
  captureTime: string;
  damageLevel: 'Minor' | 'Moderate' | 'Severe' | 'Catastrophic';
  confidence: number;
  detectedFeatures: string[];
  structuralIntegrityEstimate: number; // 0 - 100%
  xaiReasoning: string;
  processingMode: 'Edge CV Model' | 'Cloud Vision AI';
}

export interface CitizenReport {
  id: string;
  author: string;
  source: 'Twitter/X' | 'Citizen SMS' | 'Telegram SDMS Bot' | 'Radio Dispatch';
  timestamp: string;
  rawText: string;
  claimedLocation: string;
  claimedHazard: 'Flooding' | 'Bridge Collapse' | 'Gas Leak' | 'Fire' | 'Road Blocked';
  sentimentUrgency: 'Normal' | 'Urgent' | 'Panic';
  credibilityScore: number; // 0 - 100%
  verificationStatus: 'verified_authentic' | 'contradicted_by_iot' | 'unverified_suspicious' | 'quarantined';
  contradictionReason?: string;
  associatedSensorId?: string;
  moderatorStatus: 'pending' | 'approved' | 'rejected' | 'escalated' | 'quarantined';
}

export interface DroneMission {
  id: string;
  droneCallsign: string;
  battery: number;
  altitudeMeters: number;
  speedKmh: number;
  linkQuality: number; // percentage
  status: 'patrolling' | 'hovering_target' | 'returning_to_base';
  activeInferenceMode: 'edge_lightweight' | 'cloud_heavyweight';
  currentCoordinates: [number, number];
  flightPath: [number, number][];
  detectedDetections: {
    id: string;
    type: 'survivor' | 'flood_breach' | 'structural_collapse' | 'blocked_route';
    confidence: number;
    bbox: [number, number, number, number]; // x, y, width, height %
    lat: number;
    lng: number;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system_alert';
  text: string;
  timestamp: string;
  language: 'en' | 'es' | 'hi' | 'fr' | 'tl';
  actions?: { label: string; actionType: string; payload?: any }[];
  isEdgeGenerated?: boolean;
}

export interface AgencyLog {
  id: string;
  timestamp: string;
  agency: 'Red Cross Incident Team' | 'Metro Fire & Rescue' | 'Municipal GIS' | 'National Weather Service' | 'SDMS Automated Edge';
  priority: 'info' | 'warning' | 'critical';
  message: string;
  syncStatus: 'synced_to_cloud' | 'stored_in_edge_cache';
}

export interface DegradedSyncPacket {
  id: string;
  timestamp: string;
  sourceModule: 'IoT Sensors' | 'Drone Recon' | 'Citizen Reports' | 'Agency Dispatch';
  payloadSummary: string;
  sizeBytes: number;
  status: 'queued_local' | 'transmitting_mesh' | 'reconciled';
}
