import React, { useState } from 'react';
import { ZAMFARA_LGAS } from '../data/zamfaraData';
import { ZamfaraLGA } from '../types';
import {
  Map,
  Flame,
  TreePine,
  ShieldAlert,
  SlidersHorizontal,
  Compass,
  Trees,
  Search,
  ChevronRight,
  Info,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

interface MapProps {
  onSelectLgaForReport: (lgaName: string) => void;
}

export const EnvironmentalMap: React.FC<MapProps> = ({ onSelectLgaForReport }) => {
  const [selectedLga, setSelectedLga] = useState<ZamfaraLGA>(ZAMFARA_LGAS[1]); // Default Maru LGA (Critical)
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [showHotspots, setShowHotspots] = useState(true);
  const [showGgwBelts, setShowGgwBelts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLgas = ZAMFARA_LGAS.filter((lga) => {
    const matchesRisk = filterRisk === 'All' || lga.deforestationRisk === filterRisk;
    const matchesSearch = lga.name.toLowerCase().includes(searchQuery.toLowerCase()) || lga.primaryThreat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskColor = (risk: ZamfaraLGA['deforestationRisk']) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-500 text-white border-red-600 shadow-red-500/30';
      case 'High':
        return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30';
      case 'Moderate':
        return 'bg-yellow-500 text-slate-900 border-yellow-600';
      case 'Low':
        return 'bg-emerald-500 text-white border-emerald-600';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getMapSvgPosition = (idx: number) => {
    // Relative visual grid placements representing Zamfara LGA geography
    const mapGridPositions: Record<string, { x: number; y: number }> = {
      'Shinkafi': { x: 520, y: 50 },
      'Zurmi': { x: 620, y: 110 },
      'Kaura Namoda': { x: 510, y: 170 },
      'Birnin Magaji': { x: 640, y: 220 },
      'Bakura': { x: 230, y: 160 },
      'Talata Mafara': { x: 330, y: 220 },
      'Maradun': { x: 420, y: 220 },
      'Bungudu': { x: 500, y: 270 },
      'Gusau': { x: 580, y: 310 },
      'Gummi': { x: 120, y: 300 },
      'Bukkuyum': { x: 210, y: 310 },
      'Anka': { x: 310, y: 360 },
      'Maru': { x: 440, y: 380 },
      'Tsafe': { x: 630, y: 420 },
    };
    return mapGridPositions[ZAMFARA_LGAS[idx]?.name] || { x: 100 + (idx * 40) % 600, y: 100 + (idx * 30) % 400 };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Header */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Zamfara State Environmental & GIS Map
              <span className="text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                14 LGAs Coverage
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive vector map of deforestation threats, Great Green Wall re-greening belts, and active ranger zones.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search LGA or threat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-emerald-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {['All', 'Critical', 'High', 'Moderate'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterRisk === risk ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector SVG Map Stage */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-xl relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Map Controls Overlay */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 bg-slate-900/90 backdrop-blur p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={showHotspots}
                  onChange={(e) => setShowHotspots(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="flex items-center gap-1 text-red-400">
                  <Flame className="w-3.5 h-3.5" /> Deforestation Hotspots
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={showGgwBelts}
                  onChange={(e) => setShowGgwBelts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="flex items-center gap-1 text-emerald-400">
                  <Trees className="w-3.5 h-3.5" /> Great Green Wall Re-greening Belts
                </span>
              </label>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Coordinates: <span className="text-emerald-400">12.1628° N, 6.6614° E</span>
            </div>
          </div>

          {/* Interactive SVG Map Visualizer */}
          <div className="my-4 relative w-full h-[420px] flex items-center justify-center bg-slate-950/60 rounded-lg border border-slate-900 overflow-hidden">
            <svg viewBox="0 0 800 520" className="w-full h-full max-w-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Great Green Wall Belt Visual Line */}
              {showGgwBelts && (
                <path
                  d="M 80 280 C 200 240, 400 120, 720 90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeOpacity="0.25"
                  strokeDasharray="6 4"
                />
              )}

              {/* LGA Node Markers */}
              {ZAMFARA_LGAS.map((lga, idx) => {
                const pos = getMapSvgPosition(idx);
                const isSelected = selectedLga.id === lga.id;
                const isMatchingFilter = filteredLgas.some((f) => f.id === lga.id);

                return (
                  <g
                    key={lga.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedLga(lga)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for critical areas */}
                    {showHotspots && lga.deforestationRisk === 'Critical' && (
                      <circle
                        r="24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Outer Glow */}
                    <circle
                      r={isSelected ? '20' : '14'}
                      fill={
                        isSelected
                          ? '#059669'
                          : lga.deforestationRisk === 'Critical'
                          ? '#ef4444'
                          : lga.deforestationRisk === 'High'
                          ? '#f59e0b'
                          : '#10b981'
                      }
                      fillOpacity={isMatchingFilter ? (isSelected ? '0.9' : '0.6') : '0.15'}
                      stroke={isSelected ? '#34d399' : '#0f172a'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-all duration-300"
                    />

                    {/* Inner Icon Point */}
                    <circle r="4" fill="#ffffff" />

                    {/* LGA Label */}
                    <text
                      y="26"
                      textAnchor="middle"
                      fill={isSelected ? '#34d399' : isMatchingFilter ? '#cbd5e1' : '#64748b'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : 'medium'}
                      className="font-sans pointer-events-none select-none transition-all"
                    >
                      {lga.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[10px] text-slate-300 space-y-1 backdrop-blur">
              <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">Risk Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Critical Deforestation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>High Threat Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Re-greened / Moderate</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Click any LGA node on the map or list to inspect local forestry metrics.</span>
            <span className="text-emerald-400 font-semibold">{filteredLgas.length} LGAs Displayed</span>
          </div>
        </div>

        {/* Right LGA Inspector Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  LGA Inspector Panel
                </span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedLga.name} LGA
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${getRiskColor(selectedLga.deforestationRisk)}`}>
                {selectedLga.deforestationRisk} Risk
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Headquarters:</span>
                <span className="font-bold text-slate-900">{selectedLga.headquarters}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Forest Canopy Cover</span>
                  <span className="text-xl font-bold text-emerald-950 font-mono">{selectedLga.forestCoverPercent}%</span>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-800 block">Hectares Monitored</span>
                  <span className="text-xl font-bold text-indigo-950 font-mono">{selectedLga.hectaresMonitored.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Trees Planted</span>
                  <span className="text-xl font-bold text-amber-950 font-mono">{selectedLga.treesPlanted.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-700 block">Active Rangers</span>
                  <span className="text-xl font-bold text-slate-900 font-mono">{selectedLga.activeRangers}</span>
                </div>
              </div>

              {/* Primary Threat Box */}
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Primary Ecological Threat</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed font-medium">
                  {selectedLga.primaryThreat}
                </p>
              </div>

              {selectedLga.greatGreenWallZone && (
                <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-2 text-xs">
                  <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Designated Great Green Wall (GGW) Priority Reforestation Corridor.</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => onSelectLgaForReport(selectedLga.name)}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Submit Incident for {selectedLga.name}</span>
              </button>
            </div>
          </div>

          {/* List of LGAs */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
            <h4 className="font-bold text-xs text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>All 14 Zamfara LGAs List</span>
              <span className="text-[10px] font-normal text-slate-500">Select to inspect</span>
            </h4>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {filteredLgas.map((lga) => (
                <button
                  key={lga.id}
                  onClick={() => setSelectedLga(lga)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedLga.id === lga.id
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lga.deforestationRisk === 'Critical'
                          ? 'bg-red-500'
                          : lga.deforestationRisk === 'High'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span>{lga.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{lga.forestCoverPercent}% cover</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
