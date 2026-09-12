import React from 'react';
import { 
  Activity, 
  Droplets, 
  Wind, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Battery, 
  Radio, 
  Plus, 
  Minus,
  Maximize2
} from 'lucide-react';
import { useSDMS } from '../../context/SDMSContext';
import { SensorNode } from '../../types';

export const IoTSensorLayer: React.FC = () => {
  const { 
    sensors, 
    connectivityMode, 
    manuallyAdjustSensor, 
    triggerDisasterEvent, 
    resetToNormal,
    setFocusedMapCoords
  } = useSDMS();

  const getSensorIcon = (type: SensorNode['type']) => {
    switch (type) {
      case 'hydrological': return <Droplets className="w-5 h-5 text-sky-400" />;
      case 'seismic': return <Activity className="w-5 h-5 text-amber-400" />;
      case 'atmospheric': return <Wind className="w-5 h-5 text-emerald-400" />;
      case 'gas': return <Flame className="w-5 h-5 text-purple-400" />;
    }
  };

  const criticalCount = sensors.filter(s => s.status === 'critical').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-4">
      
      {/* Top Layer Control & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              Layer 1: IoT Sensor Layer & Mesh Telemetry
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              LoRaWAN / ESP32 Mesh Protocol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed environmental telemetry with automatic Last-Known-Good (LKG) caching during network isolation.
          </p>
        </div>

        {/* Live Counters & Quick Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">{sensors.length} Active Nodes</span>
          </div>

          {warningCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-950/60 border border-amber-700/60 rounded-lg text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{warningCount} Warning</span>
            </div>
          )}

          {criticalCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-rose-950/60 border border-rose-700/60 rounded-lg text-xs font-semibold text-rose-300 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{criticalCount} Critical Alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {sensors.map((sensor) => {
          const ratio = Math.min(100, Math.round((sensor.currentValue / (sensor.criticalThreshold * 1.2)) * 100));
          const isWarning = sensor.status === 'warning';
          const isCritical = sensor.status === 'critical';

          return (
            <div
              key={sensor.id}
              className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-600/70 shadow-lg shadow-rose-950/30'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-600/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${
                    isCritical ? 'bg-rose-900/50' : isWarning ? 'bg-amber-900/40' : 'bg-slate-800'
                  }`}>
                    {getSensorIcon(sensor.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-sky-400">{sensor.id}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                      }`}>
                        {sensor.status}
                      </span>
                      {sensor.isLastKnownGood && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-950 border border-indigo-700 text-indigo-300">
                          LKG Cache
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate max-w-[200px]" title={sensor.name}>
                      {sensor.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setFocusedMapCoords([sensor.lat, sensor.lng])}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Locate on GIS Map"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Location & Mesh Status */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="truncate max-w-[180px]">{sensor.locationName}</span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-0.5 text-slate-400" title="Low-Power Mesh Relays">
                    <Radio className="w-3 h-3 text-sky-400" />
                    {sensor.meshHops} hop{sensor.meshHops > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-0.5 text-slate-400" title="Battery Reserve">
                    <Battery className="w-3 h-3 text-emerald-400" />
                    {sensor.batteryLevel}%
                  </span>
                </div>
              </div>

              {/* Large Current Value Display */}
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Live Telemetry:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-extrabold tracking-tight font-mono ${
                      isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-100'
                    }`}>
                      {sensor.currentValue}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{sensor.unit}</span>
                  </div>
                </div>

                {/* Threshold Reference */}
                <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                  <div>Warn: <span className="text-amber-400 font-mono font-medium">≥{sensor.warningThreshold}</span></div>
                  <div>Crit: <span className="text-rose-400 font-mono font-medium">≥{sensor.criticalThreshold}</span></div>
                </div>
              </div>

              {/* Sparkline History Chart */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Trend History (Last 5 Ticks)</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {sensor.lastReportedTime}
                  </span>
                </div>
                <div className="h-10 w-full bg-slate-950/50 rounded flex items-end gap-1 p-1 border border-slate-800/50">
                  {sensor.history.map((pt, idx) => {
                    const barHeight = Math.min(100, Math.max(15, (pt.value / (sensor.criticalThreshold * 1.1)) * 100));
                    const isLast = idx === sensor.history.length - 1;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col justify-end items-center h-full group relative"
                      >
                        <div
                          style={{ height: `${barHeight}%` }}
                          className={`w-full rounded-t transition-all ${
                            isCritical
                              ? 'bg-rose-500'
                              : isWarning
                              ? 'bg-amber-500'
                              : isLast
                              ? 'bg-sky-400'
                              : 'bg-slate-700'
                          }`}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10 border border-slate-700">
                          {pt.time}: {pt.value} {sensor.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Threshold Meter Bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  style={{ width: `${ratio}%` }}
                  className={`h-full transition-all duration-300 ${
                    isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Manual Calibration & Test Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] text-slate-400">Manual Test:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => manuallyAdjustSensor(sensor.id, -0.4)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Decrease reading"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => manuallyAdjustSensor(sensor.id, 0.4)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Increase reading"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
