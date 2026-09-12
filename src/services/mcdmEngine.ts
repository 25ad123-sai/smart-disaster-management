import { HazardZone, SensorNode, CriticalFacility, MCDMZoneRanking, AHPWeights } from '../types';

export const DEFAULT_AHP_WEIGHTS: AHPWeights = {
  sensorAnomaly: 0.35,
  populationDensity: 0.25,
  infrastructureRisk: 0.25,
  topographicVulnerability: 0.15,
};

export function calculateMCDMRankings(
  zones: HazardZone[],
  sensors: SensorNode[],
  facilities: CriticalFacility[],
  weights: AHPWeights = DEFAULT_AHP_WEIGHTS
): MCDMZoneRanking[] {
  // Normalize weights so sum is 1.0
  const totalWeight =
    weights.sensorAnomaly +
    weights.populationDensity +
    weights.infrastructureRisk +
    weights.topographicVulnerability;
  const wSensor = (weights.sensorAnomaly || 0.01) / totalWeight;
  const wPop = (weights.populationDensity || 0.01) / totalWeight;
  const wInfra = (weights.infrastructureRisk || 0.01) / totalWeight;
  const wTopo = (weights.topographicVulnerability || 0.01) / totalWeight;

  const rawZoneScores = zones.map((zone) => {
    // 1. Calculate Sensor Anomaly Score
    // Find sensors closest to or inside zone
    let maxSensorSeverity = 0;
    sensors.forEach((s) => {
      // rough distance or matching by type
      let ratio = s.currentValue / s.criticalThreshold;
      if (s.status === 'critical') ratio = Math.max(ratio, 1.0);
      else if (s.status === 'warning') ratio = Math.max(ratio, 0.7);

      // Check proximity to zone center
      const [firstPt] = zone.coordinates;
      const dist = Math.hypot(s.lat - firstPt[0], s.lng - firstPt[1]);
      if (dist < 0.05) {
        maxSensorSeverity = Math.max(maxSensorSeverity, ratio);
      }
    });
    // Scale 0 - 100
    const sensorAnomalyScore = Math.min(100, Math.round(maxSensorSeverity * 85 + (zone.severity === 'extreme' ? 30 : zone.severity === 'high' ? 20 : 5)));

    // 2. Population Density Score (Normalized to 0 - 100 based on max 50k pop)
    const populationDensityScore = Math.min(100, Math.round((zone.affectedPopulation / 45000) * 100));

    // 3. Infrastructure Vulnerability Score
    const nearbyFacs = facilities.filter(f => {
      const [firstPt] = zone.coordinates;
      return Math.hypot(f.lat - firstPt[0], f.lng - firstPt[1]) < 0.04;
    });
    const compromisedCount = nearbyFacs.filter(f => f.status !== 'operational').length;
    const infrastructureRiskScore = Math.min(100, Math.round((nearbyFacs.length * 20) + (compromisedCount * 30)));

    // 4. Topographic / Geological Vulnerability
    let topographicVulnerability = 50;
    if (zone.type === 'flood') topographicVulnerability = 85; // Low-lying alluvial sink
    else if (zone.type === 'seismic') topographicVulnerability = 90; // Rift shear line
    else if (zone.type === 'gas_plume') topographicVulnerability = 65; // Atmospheric boundary dispersion

    // Composite TOPSIS / Multi-Attribute Utility Score
    const compositeRiskScore = Math.round(
      sensorAnomalyScore * wSensor +
      populationDensityScore * wPop +
      infrastructureRiskScore * wInfra +
      topographicVulnerability * wTopo
    );

    let recommendedAction = 'Routine Monitoring';
    if (compositeRiskScore >= 75) {
      recommendedAction = 'PRIORITY 1: Immediate Evacuation & Tactical Rescue Staging';
    } else if (compositeRiskScore >= 50) {
      recommendedAction = 'PRIORITY 2: Pre-deployment of Pumps, Barriers & Medical Triage';
    } else {
      recommendedAction = 'PRIORITY 3: Public Awareness & Sensor Calibration Sweep';
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      sensorAnomalyScore,
      populationDensityScore,
      infrastructureRiskScore,
      topographicVulnerability,
      compositeRiskScore,
      rank: 0,
      recommendedAction
    };
  });

  // Sort descending by compositeRiskScore
  rawZoneScores.sort((a, b) => b.compositeRiskScore - a.compositeRiskScore);

  // Assign ranks
  return rawZoneScores.map((z, idx) => ({
    ...z,
    rank: idx + 1
  }));
}
