import { SensorNode, HazardZone, PredictionForecast, DamageAssessment, ConnectivityMode } from '../types';

export function generateForecasts(
  sensors: SensorNode[],
  _zones: HazardZone[],
  connectivityMode: ConnectivityMode
): PredictionForecast[] {
  const modelType = connectivityMode === 'online' 
    ? 'Cloud Transformer v4.2' 
    : 'On-Device Quantized MobileNet';

  // 1. Flood Forecast based on Hydrological and Atmospheric sensors
  const hydro1 = sensors.find(s => s.id === 'HYDRO-01') || sensors[0];
  const atmo1 = sensors.find(s => s.id === 'ATMO-01');
  const hydroValue = hydro1.currentValue;
  const isFloodElevated = hydroValue > 2.2 || (atmo1 && atmo1.currentValue > 30);

  const floodSeverity = hydroValue > 4.0 ? 'Catastrophic' : hydroValue > 2.8 ? 'High' : isFloodElevated ? 'Moderate' : 'Moderate';
  const floodConfidence = connectivityMode === 'online' ? 94 : 88;

  const floodForecast: PredictionForecast = {
    hazardType: 'Flash Flood Crest',
    timeHorizon: '1 Hour',
    predictedSeverity: floodSeverity,
    confidenceScore: floodConfidence,
    modelUsed: modelType,
    xaiExplanation: {
      primaryReason: `Flagged ${floodSeverity.toUpperCase()} RISK: River gauge ${hydro1.id} currently reads ${hydroValue.toFixed(1)}m with rapid catchment inflow (+${((hydroValue - 1.8) * 20).toFixed(0)}% in 30m) coupled with precipitation rate (${atmo1?.currentValue || 20} mm/h) on saturated alluvium.`,
      contributingFactors: [
        { factor: 'Hydrological Stage Elevation', weight: 45, observation: `${hydroValue.toFixed(1)}m (Critical threshold: ${hydro1.criticalThreshold}m)` },
        { factor: 'Atmospheric Rainfall Rate', weight: 25, observation: `${atmo1?.currentValue || 20} mm/h sustained downpour` },
        { factor: 'Topographic Runoff Coefficient', weight: 20, observation: 'Canal Basin elevation is 6.2m ASL (steep runoff capture)' },
        { factor: 'Historical 100-Year Return Pattern', weight: 10, observation: 'Exceeds Q50 storm recurrence threshold' }
      ],
      recommendedCountermeasure: 'Deploy inflatable perimeter flood dams along 7th & Canal; sound sirens for Sector 4 low-lying basements.'
    }
  };

  // 2. Seismic Aftershock Probability
  const seism1 = sensors.find(s => s.id === 'SEISM-01');
  const seismValue = seism1?.currentValue || 0.04;
  const seismicSeverity = seismValue > 0.3 ? 'High' : seismValue > 0.15 ? 'Moderate' : 'Moderate';

  const seismicForecast: PredictionForecast = {
    hazardType: 'Seismic Aftershock',
    timeHorizon: '3 Hours',
    predictedSeverity: seismicSeverity,
    confidenceScore: connectivityMode === 'online' ? 91 : 85,
    modelUsed: modelType,
    xaiExplanation: {
      primaryReason: `Flagged ${seismicSeverity.toUpperCase()} RISK: West Ridge accelerometer records Peak Ground Acceleration (PGA) at ${seismValue.toFixed(2)}g with clustered micro-tremors along the fault shear zone.`,
      contributingFactors: [
        { factor: 'PGA Accelerometer Anomaly', weight: 50, observation: `${seismValue.toFixed(2)}g against baseline 0.02g` },
        { factor: 'Fault Slip Gradient', weight: 30, observation: 'Lateral strain accumulation on Eastward strike-slip' },
        { factor: 'Unconsolidated Soil Liquefaction', weight: 20, observation: 'Sediment saturation increases shaking amplification by 1.8x' }
      ],
      recommendedCountermeasure: 'Enforce structural inspection hold on elevated bridges and gas pipeline shutoff valves.'
    }
  };

  // 3. Chemical Dispersion Forecast
  const gas1 = sensors.find(s => s.id === 'GAS-01');
  const gasValue = gas1?.currentValue || 18;
  const gasSeverity = gasValue > 50 ? 'Catastrophic' : gasValue > 30 ? 'High' : 'Moderate';

  const chemicalForecast: PredictionForecast = {
    hazardType: 'Chemical Vapor Dispersion',
    timeHorizon: '6 Hours',
    predictedSeverity: gasSeverity,
    confidenceScore: connectivityMode === 'online' ? 96 : 89,
    modelUsed: modelType,
    xaiExplanation: {
      primaryReason: `Atmospheric dispersion model computes Gaussian plume trajectory from Sector 7 chemical storage (${gasValue} ppm detected). Plume vector points towards southwest maritime outlet.`,
      contributingFactors: [
        { factor: 'VOC / Sniffer Concentration', weight: 40, observation: `${gasValue} ppm (Warning: ${gas1?.warningThreshold || 50} ppm)` },
        { factor: 'Wind Vector & Boundary Layer', weight: 35, observation: 'NE wind at 18 km/h, stable atmosphere' },
        { factor: 'Buffer Proximity to Residences', weight: 25, observation: '0.8 km margin to nearest residential perimeter' }
      ],
      recommendedCountermeasure: 'Maintain perimeter monitoring; advise shelter-in-place with sealed ventilation for Sector 7.'
    }
  };

  return [floodForecast, seismicForecast, chemicalForecast];
}

export function classifyUploadedImage(
  fileName: string,
  imagePreviewUrl: string,
  connectivityMode: ConnectivityMode
): DamageAssessment {
  const isEdge = connectivityMode !== 'online';
  const processingMode = isEdge ? 'Edge CV Model' : 'Cloud Vision AI';

  // Heuristic mock classifier based on name or random seed
  const lower = fileName.toLowerCase();
  let damageLevel: DamageAssessment['damageLevel'] = 'Moderate';
  let integrity = 65;
  let features = ['Surface debris identified', 'Standing pooling water visible', 'Minor perimeter masonry cracks'];

  if (lower.includes('collapse') || lower.includes('flood') || lower.includes('damage') || lower.includes('destroy')) {
    damageLevel = 'Severe';
    integrity = 34;
    features = [
      'Structural load-bearing wall failure',
      'Roof girder detachment and collapsed slab',
      'Extensive water inundation in surrounding thoroughfare'
    ];
  } else if (lower.includes('intact') || lower.includes('bridge') || lower.includes('safe') || lower.includes('clear')) {
    damageLevel = 'Minor';
    integrity = 92;
    features = [
      'Structural geometry retains vertical alignment',
      'No foundational scour detected',
      'Superstructure envelope intact'
    ];
  }

  const confidence = isEdge ? 0.86 : 0.95;

  return {
    id: `USER-IMG-${Date.now().toString().slice(-4)}`,
    title: `Analyzed Recon: ${fileName}`,
    imageUrl: imagePreviewUrl,
    captureTime: 'Just now (User Uploaded)',
    damageLevel,
    confidence,
    detectedFeatures: features,
    structuralIntegrityEstimate: integrity,
    xaiReasoning: `XAI Reasoning (${processingMode}): Feature extraction identified ${damageLevel.toUpperCase()} damage signature. Edge boundary gradient variance detected ${features[0].toLowerCase()} with ${(confidence * 100).toFixed(0)}% model certainty. Structural integrity estimated at ${integrity}%.`,
    processingMode
  };
}
