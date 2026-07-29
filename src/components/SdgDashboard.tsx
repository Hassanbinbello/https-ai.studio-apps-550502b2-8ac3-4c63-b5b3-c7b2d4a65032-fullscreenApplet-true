import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ZAMFARA_LGAS, INDIGENOUS_TREE_SPECIES, INITIAL_INCIDENT_REPORTS, INITIAL_PLANTED_TREES } from '../data/zamfaraData';
import { IncidentReport, PlantedTree } from '../types';
import {
  BarChart3,
  Trees,
  ShieldCheck,
  Globe,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  PieChart as PieChartIcon,
  Sparkles,
  Info,
  Sprout,
  AlertTriangle,
} from 'lucide-react';

interface SdgDashboardProps {
  incidents?: IncidentReport[];
  plantedTrees?: PlantedTree[];
}

export const SdgDashboard: React.FC<SdgDashboardProps> = ({
  incidents = INITIAL_INCIDENT_REPORTS,
  plantedTrees = INITIAL_PLANTED_TREES,
}) => {
  const [barMetric, setBarMetric] = useState<'trees' | 'canopy' | 'hectares'>('trees');
  const [pieView, setPieView] = useState<'incidents' | 'lgaRisk' | 'species'>('incidents');
  const [selectedBarData, setSelectedBarData] = useState<any | null>(null);
  const [selectedPieSlice, setSelectedPieSlice] = useState<any | null>(null);

  // Aggregated totals
  const totalHectares = ZAMFARA_LGAS.reduce((acc, l) => acc + l.hectaresMonitored, 0);
  const totalLgaTrees = ZAMFARA_LGAS.reduce((acc, l) => acc + l.treesPlanted, 0);
  const customTreesCount = plantedTrees.reduce((acc, t) => acc + t.quantity, 0);
  const grandTotalTrees = totalLgaTrees + customTreesCount;
  const totalRangers = ZAMFARA_LGAS.reduce((acc, l) => acc + l.activeRangers, 0);

  // 1. Prepare Bar Chart Data across 14 LGAs
  const barChartData = ZAMFARA_LGAS.map((lga) => {
    // Add extra custom planted trees if any match this LGA
    const extraTreesForLga = plantedTrees
      .filter((t) => t.lga.toLowerCase() === lga.name.toLowerCase())
      .reduce((sum, t) => sum + t.quantity, 0);

    return {
      name: lga.name,
      treesPlanted: lga.treesPlanted + extraTreesForLga,
      forestCover: lga.forestCoverPercent,
      hectaresMonitored: lga.hectaresMonitored,
      risk: lga.deforestationRisk,
      rangers: lga.activeRangers,
      threat: lga.primaryThreat,
    };
  });

  // 2. Prepare Pie Chart Data (Incident Status Distribution)
  const incidentStatusCounts: Record<string, number> = {
    'Pending Review': 0,
    'Ranger Dispatched': 0,
    'Investigated': 0,
    'Action Taken / Resolved': 0,
  };
  incidents.forEach((inc) => {
    if (incidentStatusCounts[inc.status] !== undefined) {
      incidentStatusCounts[inc.status] += 1;
    } else {
      incidentStatusCounts[inc.status] = 1;
    }
  });

  const incidentPieData = [
    { name: 'Pending Review', value: incidentStatusCounts['Pending Review'] || 0, color: '#f59e0b' },
    { name: 'Ranger Dispatched', value: incidentStatusCounts['Ranger Dispatched'] || 0, color: '#3b82f6' },
    { name: 'Investigated', value: incidentStatusCounts['Investigated'] || 0, color: '#8b5cf6' },
    { name: 'Action Taken', value: incidentStatusCounts['Action Taken / Resolved'] || 0, color: '#10b981' },
  ].filter((item) => item.value > 0);

  // 3. Prepare Pie Chart Data (LGA Risk Levels)
  const riskCounts = {
    Critical: ZAMFARA_LGAS.filter((l) => l.deforestationRisk === 'Critical').length,
    High: ZAMFARA_LGAS.filter((l) => l.deforestationRisk === 'High').length,
    Moderate: ZAMFARA_LGAS.filter((l) => l.deforestationRisk === 'Moderate').length,
  };

  const lgaRiskPieData = [
    { name: 'Critical Risk', value: riskCounts.Critical, color: '#ef4444' },
    { name: 'High Risk', value: riskCounts.High, color: '#f97316' },
    { name: 'Moderate Risk', value: riskCounts.Moderate, color: '#10b981' },
  ];

  // 4. Prepare Species Sequestration Chart Data
  const speciesData = INDIGENOUS_TREE_SPECIES.map((sp) => ({
    name: sp.commonName.split(' ')[0], // Short name
    fullName: sp.commonName,
    co2Kg: sp.co2AbsorbedPerYearKg,
    drought: sp.droughtResistance,
    color: '#059669',
  }));

  // Custom Bar Chart Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <div className="font-bold text-emerald-400 text-sm flex items-center justify-between gap-4">
            <span>{data.name} LGA</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                data.risk === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : data.risk === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {data.risk} Risk
            </span>
          </div>
          <div className="text-slate-200">
            🌳 Trees Planted: <strong className="text-emerald-300 font-mono">{data.treesPlanted.toLocaleString()}</strong>
          </div>
          <div className="text-slate-200">
            🌿 Canopy Cover: <strong className="text-teal-300 font-mono">{data.forestCover}%</strong>
          </div>
          <div className="text-slate-200">
            🗺️ Monitored Area: <strong className="text-indigo-300 font-mono">{data.hectaresMonitored.toLocaleString()} Ha</strong>
          </div>
          <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
            Rangers On Duty: {data.rangers} Officers
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Pie Chart Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-0.5 z-50">
          <div className="font-bold flex items-center gap-2" style={{ color: data.payload.color || '#10b981' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-200 font-mono">
            Total Count: <strong>{data.value}</strong> ({((data.value / (pieView === 'incidents' ? incidents.length : 14)) * 100).toFixed(1)}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>UN SDG 15: Life on Land — Interactive Analytics Platform</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            GreenWatch Zamfara State Environmental Impact Dashboard
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Real-time interactive data visualizers powered by <strong>Recharts</strong>. Track dryland reforestation progress, Great Green Wall canopy recovery, ranger dispatch statuses, and CO2 offset across all 14 LGAs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xl font-bold text-emerald-400 font-mono block">{grandTotalTrees.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">Total Trees Planted</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xl font-bold text-teal-400 font-mono block">4,860 Tons</span>
            <span className="text-[10px] text-slate-400">Est. Annual CO2 Offset</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Monitored Area</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalHectares.toLocaleString()} Ha</div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" /> Across 14 Zamfara LGAs
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Trees Planted</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{grandTotalTrees.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-teal-600" /> 89% Avg Survival Rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Active Rangers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{totalRangers} Officers</div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-600" /> Mobile Forest Patrols
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Critical Risk LGAs</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono">
            {ZAMFARA_LGAS.filter((l) => l.deforestationRisk === 'Critical').length} LGAs
          </div>
          <p className="text-[11px] text-slate-500">Maru, Anka, Zurmi, Bukkuyum, Shinkafi, Birnin Magaji</p>
        </div>
      </div>

      {/* RECHARTS INTERACTIVE VISUALIZERS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BAR CHART: 14 LGAs Comparative Progress */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          
          {/* Header & Metric Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>14 LGAs Environmental Metrics (Recharts Bar)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Click any bar to highlight LGA details</p>
            </div>

            {/* Bar Metric Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBarMetric('trees')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  barMetric === 'trees'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trees Planted
              </button>
              <button
                type="button"
                onClick={() => setBarMetric('canopy')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  barMetric === 'canopy'
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Canopy Cover %
              </button>
              <button
                type="button"
                onClick={() => setBarMetric('hectares')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  barMetric === 'hectares'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monitored Ha
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Canvas */}
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey={
                    barMetric === 'trees'
                      ? 'treesPlanted'
                      : barMetric === 'canopy'
                      ? 'forestCover'
                      : 'hectaresMonitored'
                  }
                  name={
                    barMetric === 'trees'
                      ? 'Trees Planted'
                      : barMetric === 'canopy'
                      ? 'Forest Cover %'
                      : 'Monitored Hectares'
                  }
                  radius={[6, 6, 0, 0]}
                  cursor="pointer"
                  onClick={(entry: any) => {
                    if (entry) {
                      setSelectedBarData(entry);
                    }
                  }}
                >
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        selectedBarData?.name === entry.name
                          ? '#059669'
                          : barMetric === 'trees'
                          ? '#10b981'
                          : barMetric === 'canopy'
                          ? '#0d9488'
                          : '#6366f1'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Selected LGA Detail Inspector Box */}
          {selectedBarData && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Selected LGA: {selectedBarData.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      selectedBarData.risk === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : selectedBarData.risk === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedBarData.risk} Deforestation Risk
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>Primary Threat:</strong> {selectedBarData.threat}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBarData(null)}
                className="text-[10px] text-emerald-800 hover:underline shrink-0 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* PIE / DONUT CHART: Incident Status & Risk Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          
          {/* Header & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-teal-600" />
                <span>Distribution Analytics (Recharts Pie)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Interactive categorical proportions</p>
            </div>

            {/* Pie Category Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPieView('incidents')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  pieView === 'incidents'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incidents
              </button>
              <button
                type="button"
                onClick={() => setPieView('lgaRisk')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  pieView === 'lgaRisk'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                LGA Risk
              </button>
              <button
                type="button"
                onClick={() => setPieView('species')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  pieView === 'species'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CO2 Species
              </button>
            </div>
          </div>

          {/* Pie Chart Canvas */}
          <div className="h-[250px] w-full pt-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    pieView === 'incidents'
                      ? incidentPieData
                      : pieView === 'lgaRisk'
                      ? lgaRiskPieData
                      : speciesData
                  }
                  dataKey={pieView === 'species' ? 'co2Kg' : 'value'}
                  nameKey={pieView === 'species' ? 'fullName' : 'name'}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  cursor="pointer"
                  onClick={(entry) => setSelectedPieSlice(entry)}
                >
                  {(pieView === 'incidents'
                    ? incidentPieData
                    : pieView === 'lgaRisk'
                    ? lgaRiskPieData
                    : speciesData
                  ).map((entry: any, index: number) => (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={
                        entry.color ||
                        ['#10b981', '#14b8a6', '#0284c7', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'][index % 7]
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend Badge Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {pieView === 'incidents'
                  ? 'Incident Report Resolution Pipeline'
                  : pieView === 'lgaRisk'
                  ? 'Deforestation Vulnerability Proportions'
                  : 'Indigenous Species Annual CO2 Sequestration Rate (kg/year)'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {pieView === 'incidents' &&
                'Tracks community deforestation, charcoal kiln, and soil erosion reports from submission to ranger dispatch and legal resolution.'}
              {pieView === 'lgaRisk' &&
                'Categorizes Zamfara State LGAs based on canopy degradation speed, aridity index, and proximity to the Sahara desertification frontline.'}
              {pieView === 'species' &&
                'Compares carbon absorption rates per mature tree among dryland species like Baobab (35kg/yr), Mahogany (32.2kg/yr), and Neem (24.5kg/yr).'}
            </p>
          </div>
        </div>

      </div>

      {/* SDG 15 Target Compliance & Ranking Matrix Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SDG 15 Targets Checklist */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>UN SDG 15 Target Compliance Matrix</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              2030 Agenda Aligned
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-emerald-700">Target 15.1 — Terrestrial Ecosystem Conservation</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  ACHIEVING
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Conserve dryland terrestrial ecosystems in Zamfara State through real-time GIS mapping of forest reserves in Maru, Tsafe, and Kimbambare corridors.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-emerald-700">Target 15.2 — Reforestation & Sustainable Forest Management</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  ON TRACK
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Halt illegal charcoal logging and significantly increase afforestation using indigenous drought-resistant species (Neem, Baobab, Acacia, Mahogany).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-emerald-700">Target 15.3 — Combat Desertification & Restore Degraded Land</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Integrate Great Green Wall sand dune stabilization belts in northern border LGAs (Shinkafi, Zurmi, Kaura Namoda).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-emerald-700">Target 15.c — Combat Poaching & Illegal Flora Trafficking</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  ENFORCED
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Geotagged community incident reporting empowers forest rangers to apprehend commercial charcoal transporters and illegal logging taskforces.
              </p>
            </div>
          </div>
        </div>

        {/* Right: LGA Forest Cover Ranking List */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>LGA Reforestation & Canopy Cover Leaderboard</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">14 LGAs Ranked</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {barChartData
              .slice()
              .sort((a, b) => b.forestCover - a.forestCover)
              .map((lga, rank) => (
                <div
                  key={lga.name}
                  onClick={() => setSelectedBarData(lga)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                    selectedBarData?.name === lga.name
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono">
                      #{rank + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{lga.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            lga.risk === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : lga.risk === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {lga.risk}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {lga.treesPlanted.toLocaleString()} trees planted • {lga.rangers} Rangers
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900 text-sm">{lga.forestCover}%</span>
                    <span className="text-[10px] text-slate-400 block font-sans">Canopy Cover</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
