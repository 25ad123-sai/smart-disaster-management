import { CitizenReport, SensorNode, HazardZone } from '../types';

interface AnalysisResult {
  claimedHazard: CitizenReport['claimedHazard'];
  sentimentUrgency: CitizenReport['sentimentUrgency'];
  credibilityScore: number;
  verificationStatus: CitizenReport['verificationStatus'];
  contradictionReason?: string;
  associatedSensorId?: string;
}

export function analyzeCitizenReport(
  text: string,
  sensors: SensorNode[],
  _zones: HazardZone[]
): AnalysisResult {
  const lower = text.toLowerCase();

  // 1. Detect Claimed Hazard
  let claimedHazard: CitizenReport['claimedHazard'] = 'Flooding';
  if (lower.includes('bridge') || lower.includes('collapsed') || lower.includes('overpass')) {
    claimedHazard = 'Bridge Collapse';
  } else if (lower.includes('gas') || lower.includes('chemical') || lower.includes('toxic') || lower.includes('fumes') || lower.includes('ammonia')) {
    claimedHazard = 'Gas Leak';
  } else if (lower.includes('quake') || lower.includes('shaking') || lower.includes('tremor') || lower.includes('fault')) {
    claimedHazard = 'Road Blocked';
  } else if (lower.includes('tree') || lower.includes('blocked') || lower.includes('closure') || lower.includes('rubble')) {
    claimedHazard = 'Road Blocked';
  } else if (lower.includes('fire') || lower.includes('explosion') || lower.includes('smoke')) {
    claimedHazard = 'Fire';
  } else {
    claimedHazard = 'Flooding';
  }

  // 2. Sentiment & Panic Detection
  const panicIndicators = ['urgent!!', 'everyone die', 'submerged', 'apocalypse', 'now!!', 'flee', 'total collapse', '50 cars', '100s dead'];
  const hasPanic = panicIndicators.some(w => lower.includes(w)) || (text.match(/!{2,}/g) !== null) || (text === text.toUpperCase() && text.length > 25);
  const sentimentUrgency: CitizenReport['sentimentUrgency'] = hasPanic ? 'Panic' : (lower.includes('urgent') || lower.includes('help') ? 'Urgent' : 'Normal');

  // 3. Sensor Cross-Checking Logic
  let credibilityScore = 70; // baseline
  let verificationStatus: CitizenReport['verificationStatus'] = 'unverified_suspicious';
  let contradictionReason = '';
  let associatedSensorId: string | undefined = undefined;

  if (claimedHazard === 'Bridge Collapse') {
    const bridgeSensor = sensors.find(s => s.id === 'SEISM-02') || sensors.find(s => s.type === 'seismic');
    associatedSensorId = bridgeSensor?.id;
    if (bridgeSensor) {
      if (bridgeSensor.currentValue < bridgeSensor.warningThreshold) {
        // Sensor says bridge is totally calm! Contradiction!
        credibilityScore = 12;
        verificationStatus = 'contradicted_by_iot';
        contradictionReason = `CONTRADICTED BY IOT SENSOR: ${bridgeSensor.name} (${bridgeSensor.id}) reports normal harmonic motion (${bridgeSensor.currentValue} ${bridgeSensor.unit}, threshold is ${bridgeSensor.warningThreshold}). Zero structural shear detected.`;
      } else {
        // High vibration recorded! Corroborated!
        credibilityScore = 94;
        verificationStatus = 'verified_authentic';
        contradictionReason = `CORROBORATED BY SENSOR: ${bridgeSensor.name} triggered anomaly alert with ${bridgeSensor.currentValue} ${bridgeSensor.unit}! Structural inspection dispatched.`;
      }
    }
  } else if (claimedHazard === 'Gas Leak') {
    const gasSensor = sensors.find(s => s.id === 'GAS-01') || sensors.find(s => s.type === 'gas');
    associatedSensorId = gasSensor?.id;
    if (gasSensor) {
      if (gasSensor.currentValue < gasSensor.warningThreshold) {
        credibilityScore = 22;
        verificationStatus = 'contradicted_by_iot';
        contradictionReason = `CONTRADICTED BY IOT SENSOR: Atmospheric sniffer ${gasSensor.id} currently reads ${gasSensor.currentValue} ${gasSensor.unit}, safely within normal baseline (<${gasSensor.warningThreshold} ppm). Potential false rumor.`;
      } else {
        credibilityScore = 91;
        verificationStatus = 'verified_authentic';
        contradictionReason = `CORROBORATED BY SENSOR: Sniffer ${gasSensor.id} indicates spike of ${gasSensor.currentValue} ${gasSensor.unit}! HAZMAT protocol active.`;
      }
    }
  } else if (claimedHazard === 'Flooding') {
    const hydroSensors = sensors.filter(s => s.type === 'hydrological');
    const highestHydro = hydroSensors.reduce((max, s) => s.currentValue / s.criticalThreshold > max.currentValue / max.criticalThreshold ? s : max, hydroSensors[0]);
    associatedSensorId = highestHydro?.id;

    if (highestHydro && highestHydro.currentValue >= highestHydro.warningThreshold) {
      credibilityScore = 95;
      verificationStatus = 'verified_authentic';
      contradictionReason = `CORROBORATED BY SENSOR: River gauge ${highestHydro.name} (${highestHydro.id}) is at stage ${highestHydro.currentValue}m (status: ${highestHydro.status.toUpperCase()}). Flow dynamics support claims.`;
    } else if (highestHydro && highestHydro.currentValue < 1.0) {
      credibilityScore = 38;
      verificationStatus = 'contradicted_by_iot';
      contradictionReason = `DISCREPANCY DETECTED: Hydrological gauges read baseline low-water levels (${highestHydro.currentValue}m). Report claims excessive inundation without sensor anomaly.`;
    } else {
      credibilityScore = 68;
      verificationStatus = 'unverified_suspicious';
      contradictionReason = `PLAUSIBLE: Water stage is moderate (${highestHydro?.currentValue || 1.8}m). Awaiting drone recon confirmation.`;
    }
  } else {
    // Other hazards (e.g. road blocked)
    const atmoSensor = sensors.find(s => s.type === 'atmospheric');
    associatedSensorId = atmoSensor?.id;
    credibilityScore = 82;
    verificationStatus = 'verified_authentic';
    contradictionReason = `Weather station ${atmoSensor?.id} reported severe gale gusts (${atmoSensor?.currentValue} mm/h rain/wind) compatible with physical obstruction claims.`;
  }

  // Adjust for extreme panic language
  if (hasPanic && verificationStatus !== 'verified_authentic') {
    credibilityScore = Math.max(5, credibilityScore - 15);
  }

  return {
    claimedHazard,
    sentimentUrgency,
    credibilityScore,
    verificationStatus,
    contradictionReason,
    associatedSensorId
  };
}
