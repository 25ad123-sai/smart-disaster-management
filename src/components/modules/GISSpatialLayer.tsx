import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  ShieldAlert, 
  Sliders, 
  Compass, 
  Hospital, 
  Home, 
  Eye, 
  EyeOff, 
  TrendingUp,
  Info,
  Navigation
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '../../data/mockData';

export const GISSpatialLayer: React.FC = () => {
  const { 
    sensors, 
    zones, 
    facilities, 
    mcdmRankings, 
    ahpWeights, 
    setAhpWeights,
    focusedMapCoords,
    setFocusedMapCoords,
    droneMission
  } = useSDMS();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Toggles
  const [showSensors, setShowSensors] = useState(true);
  const [showHazardZones, setShowHazardZones] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showDrone, setShowDrone] = useState(true);
  const [isMCDMPanelOpen, setIsMCDMPanelOpen] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark Mode CartoDB Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
    };
  }, []);

  // Center on focused coordinates when requested
  useEffect(() => {
    if (mapInstanceRef.current && focusedMapCoords) {
      mapInstanceRef.current.flyTo(focusedMapCoords, 15, { duration: 1.2 });
    }
  }, [focusedMapCoords]);

  // Update Map Layers whenever data or visibility toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Hazard Zones Polygons
    if (showHazardZones) {
      zones.forEach(zone => {
        const isFlood = zone.type === 'flood';
        const isSeismic = zone.type === 'seismic';
        const fillColor = isFlood ? '#0284c7' : isSeismic ? '#d97706' : '#9333ea';

        const polygon = L.polygon(zone.coordinates, {
          color: fillColor,
          weight: 2,
          opacity: 0.8,
          fillColor: fillColor,
          fillOpacity: 0.25,
          dashArray: isSeismic ? '4, 4' : undefined
        });

        polygon.bindPopup(`
          <div class="p-2 text-slate-900 font-sans">
            <h4 class="font-bold text-sm text-slate-900">${zone.name}</h4>
            <div class="text-xs text-slate-700 mt-1">${zone.description}</div>
            <div class="mt-2 text-xs font-semibold text-rose-700">
              Severity: ${zone.severity.toUpperCase()} • Pop: ${zone.affectedPopulation.toLocaleString()}
            </div>
          </div>
        `);

        layerGroup.addLayer(polygon);
      });
    }

    // 2. Critical Facilities Markers
    if (showFacilities) {
      facilities.forEach(fac => {
        const isHospital = fac.type === 'hospital';
        const isShelter = fac.type === 'shelter';
        const isBridge = fac.type === 'bridge';

        const iconHtml = `
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-slate-900 ${
            isHospital ? 'bg-rose-600' : isShelter ? 'bg-emerald-600' : isBridge ? 'bg-amber-600' : 'bg-blue-600'
          }">
            <span class="text-xs font-bold">${isHospital ? 'H' : isShelter ? 'S' : isBridge ? 'B' : 'P'}</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-facility-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([fac.lat, fac.lng], { icon: customIcon });
        marker.bindPopup(`
          <div class="p-2 text-slate-900 font-sans">
            <h4 class="font-bold text-sm text-slate-900">${fac.name}</h4>
            <div class="text-xs text-slate-600 font-medium">Type: ${fac.type.toUpperCase()} • Status: ${fac.status.toUpperCase()}</div>
            ${fac.capacity ? `<div class="text-xs text-slate-700 mt-1">Capacity: <b>${fac.capacity.current} / ${fac.capacity.max}</b></div>` : ''}
            <div class="text-[11px] text-slate-500 mt-1">${fac.emergencySupplies}</div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 3. IoT Sensor Nodes Markers
    if (showSensors) {
      sensors.forEach(s => {
        const isCrit = s.status === 'critical';
        const isWarn = s.status === 'warning';
        const pinColor = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981';

        const iconHtml = `
          <div class="relative flex items-center justify-center">
            ${isCrit ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-75"></span>` : ''}
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-slate-950 font-bold text-[10px] border-2 border-white shadow-lg" style="background-color: ${pinColor}">
              ${s.id.slice(0, 2)}
            </div>
          </div>
        `;

        const sensorIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-sensor-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([s.lat, s.lng], { icon: sensorIcon });
        marker.bindPopup(`
          <div class="p-2 text-slate-900 font-sans">
            <div class="text-xs font-mono font-bold text-sky-700">${s.id} (${s.type.toUpperCase()})</div>
            <h4 class="font-bold text-sm">${s.name}</h4>
            <div class="text-xs font-semibold mt-1">Value: <span style="color:${pinColor}">${s.currentValue} ${s.unit}</span></div>
            <div class="text-[11px] text-slate-600">Threshold: Warn ≥${s.warningThreshold} | Crit ≥${s.criticalThreshold}</div>
            <div class="text-[11px] text-slate-500 mt-1">LoRa Mesh: ${s.meshHops} hop(s) • Battery: ${s.batteryLevel}%</div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 4. Drone Recon Mission Path & Live Position
    if (showDrone && droneMission) {
      // Flight path polyline
      const flightPolyline = L.polyline(droneMission.flightPath, {
        color: '#38bdf8',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.7
      });
      layerGroup.addLayer(flightPolyline);

      // Current Drone Marker
      const droneIcon = L.divIcon({
        html: `
          <div class="w-7 h-7 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-md">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
            </svg>
          </div>
        `,
        className: 'custom-drone-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const droneMarker = L.marker(droneMission.currentCoordinates, { icon: droneIcon });
      droneMarker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans">
          <h4 class="font-bold text-sm">${droneMission.droneCallsign}</h4>
          <div class="text-xs text-slate-700">Alt: ${droneMission.altitudeMeters}m • Speed: ${droneMission.speedKmh} km/h</div>
          <div class="text-xs font-semibold text-sky-700">Mode: ${droneMission.activeInferenceMode.toUpperCase()}</div>
        </div>
      `);
      layerGroup.addLayer(droneMarker);
    }

  }, [sensors, zones, facilities, droneMission, showSensors, showHazardZones, showFacilities, showDrone]);

  return (
    <div className="space-y-4">

      {/* Header & Layer Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              Layer 2: GIS Spatial Decision Layer & MCDM
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Fused Sensor + Spatial Topography
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial hazard zoning coupled with multi-criteria AHP/TOPSIS risk scoring.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setShowHazardZones(!showHazardZones)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              showHazardZones ? 'bg-sky-600/30 text-sky-300 border border-sky-600/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hazard Zones</span>
          </button>

          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              showSensors ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Sensors ({sensors.length})</span>
          </button>

          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              showFacilities ? 'bg-rose-600/30 text-rose-300 border border-rose-600/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Critical Infra</span>
          </button>

          <button
            onClick={() => setShowDrone(!showDrone)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              showDrone ? 'bg-purple-600/30 text-purple-300 border border-purple-600/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Drone Track</span>
          </button>

          <button
            onClick={() => setIsMCDMPanelOpen(!isMCDMPanelOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-600/50 ml-1 font-semibold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>MCDM Rankings</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Decision Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Leaflet Map Stage */}
        <div className={`${isMCDMPanelOpen ? 'lg:col-span-8' : 'lg:col-span-12'} h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-inner relative`}>
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1 shadow-lg pointer-events-auto">
            <div className="font-semibold text-white mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-sky-400" />
              <span>Spatial Legend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-500/50 border border-sky-400"></span>
              <span>Flood Inundation Basin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/50 border border-amber-400 border-dashed"></span>
              <span>Seismic Rupture Buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500/50 border border-purple-400"></span>
              <span>Chemical Vapor Corridor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white"></span>
              <span>Sensor (Critical)</span>
            </div>
          </div>
        </div>

        {/* MCDM Decision-Making Ranking & Weights Panel */}
        {isMCDMPanelOpen && (
          <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">MCDM Risk Prioritization</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                  AHP / TOPSIS
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Dynamically ranks sectors by fusing real-time IoT anomalies with demographics, infrastructure density, and terrain slope.
              </p>

              {/* AHP Weight Tuning Sliders */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-2.5 mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Criteria Weight Tuning:</span>
                  <span className="text-slate-500 font-mono">Sum = 100%</span>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>IoT Sensor Anomaly</span>
                    <span className="font-mono text-sky-400">{(ahpWeights.sensorAnomaly * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={ahpWeights.sensorAnomaly}
                    onChange={(e) => setAhpWeights(prev => ({ ...prev, sensorAnomaly: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Population Density</span>
                    <span className="font-mono text-amber-400">{(ahpWeights.populationDensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={ahpWeights.populationDensity}
                    onChange={(e) => setAhpWeights(prev => ({ ...prev, populationDensity: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Infrastructure Vulnerability</span>
                    <span className="font-mono text-rose-400">{(ahpWeights.infrastructureRisk * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={ahpWeights.infrastructureRisk}
                    onChange={(e) => setAhpWeights(prev => ({ ...prev, infrastructureRisk: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>

              {/* Location Risk Ranking List */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ranked Priority Zones:
                </div>
                {mcdmRankings.map((rank) => {
                  const isHigh = rank.compositeRiskScore >= 70;
                  const isMed = rank.compositeRiskScore >= 50;

                  return (
                    <div
                      key={rank.zoneId}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        rank.rank === 1
                          ? 'bg-rose-950/40 border-rose-600/70'
                          : isMed
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            rank.rank === 1 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}>
                            #{rank.rank}
                          </span>
                          <span className="font-semibold text-white truncate max-w-[150px]">{rank.zoneName}</span>
                        </div>
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          isHigh ? 'bg-rose-900 text-rose-200' : isMed ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-300'
                        }`}>
                          Risk {rank.compositeRiskScore}/100
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 bg-slate-900/80 p-1.5 rounded mb-1.5">
                        <div>IoT: <span className="font-mono text-slate-200">{rank.sensorAnomalyScore}</span></div>
                        <div>Pop: <span className="font-mono text-slate-200">{rank.populationDensityScore}</span></div>
                        <div>Infra: <span className="font-mono text-slate-200">{rank.infrastructureRiskScore}</span></div>
                      </div>

                      <div className="text-[10px] text-slate-300 italic mb-2">
                        {rank.recommendedAction}
                      </div>

                      <button
                        onClick={() => {
                          const targetZone = zones.find(z => z.id === rank.zoneId);
                          if (targetZone) {
                            setFocusedMapCoords(targetZone.coordinates[0]);
                          }
                        }}
                        className="w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-sky-400 rounded text-[11px] font-medium transition-colors"
                      >
                        Focus Zone on Map
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1 border-t border-slate-800 pt-2">
              <Info className="w-3 h-3 shrink-0" />
              <span>Computes edge-locally in browser without server roundtrip.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
