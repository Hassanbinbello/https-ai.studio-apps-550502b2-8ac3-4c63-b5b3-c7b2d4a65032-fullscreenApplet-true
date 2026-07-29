import React, { useState } from 'react';
import { PlantedTree } from '../types';
import { INDIGENOUS_TREE_SPECIES, ZAMFARA_LGAS } from '../data/zamfaraData';
import {
  Sprout,
  Trees,
  Award,
  PlusCircle,
  BarChart2,
  CheckCircle2,
  MapPin,
  Calendar,
  Sparkles,
  Droplets,
  Wind,
  ShieldCheck,
  Search,
  BookOpen,
} from 'lucide-react';

interface TreeTrackerProps {
  trees: PlantedTree[];
  onAddTree: (tree: PlantedTree) => void;
}

export const TreeTracker: React.FC<TreeTrackerProps> = ({ trees, onAddTree }) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(INDIGENOUS_TREE_SPECIES[0].id);
  const [lga, setLga] = useState('Gusau');
  const [plantingLocation, setPlantingLocation] = useState('');
  const [planterName, setPlanterName] = useState('');
  const [organization, setOrganization] = useState('GreenWatch Youth Network');
  const [quantity, setQuantity] = useState(50);
  const [nurserySource, setNurserySource] = useState('Zamfara Ministry Central Nursery');

  const [selectedTreeForCert, setSelectedTreeForCert] = useState<PlantedTree | null>(trees[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSpecies = INDIGENOUS_TREE_SPECIES.find((s) => s.id === selectedSpeciesId) || INDIGENOUS_TREE_SPECIES[0];

  const totalTreeCount = trees.reduce((acc, t) => acc + t.quantity, 0);
  const totalCo2OffsetKg = trees.reduce((acc, t) => acc + t.co2AbsorbedPerYearKg, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planterName.trim()) return;

    const newRecord: PlantedTree = {
      id: `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
      speciesName: currentSpecies.commonName,
      botanicalName: currentSpecies.botanicalName,
      localHausaName: currentSpecies.hausaName,
      lga,
      plantingLocation: plantingLocation || `${lga} Community Belt`,
      planterName,
      organization: organization || 'Individual Community Planter',
      datePlanted: new Date().toISOString().split('T')[0],
      quantity: Number(quantity) || 10,
      survivalRatePercent: 92,
      nurserySource,
      co2AbsorbedPerYearKg: Math.round(Number(quantity) * currentSpecies.co2AbsorbedPerYearKg),
      status: 'Healthy',
    };

    onAddTree(newRecord);
    setSelectedTreeForCert(newRecord);

    // Reset
    setPlantingLocation('');
    setPlanterName('');
  };

  const filteredTrees = trees.filter(
    (t) =>
      t.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.planterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>SDG 15 Target 15.2 — Tree Planting & Adoption Tracker</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Zamfara Reforestation Registry & CO2 Sequestration Calculator
          </h2>
          <p className="text-xs text-slate-300">
            Log planted trees, track dryland survival rates, and generate verifiable digital tree adoption certificates for indigenous species.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-2xl font-bold text-emerald-400 font-mono block">{totalTreeCount.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">Trees Planted</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-2xl font-bold text-teal-400 font-mono block">
              {(totalCo2OffsetKg / 1000).toFixed(1)} Tons
            </span>
            <span className="text-[10px] text-slate-400">Annual CO2 Offset</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Log Planted Tree */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Register New Tree Batch</span>
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              SDG 15 Verified
            </span>
          </div>

          {/* 1-Click Fast Presets */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-900 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              1-Click Quick Planting Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedSpeciesId('sp-neem');
                  setLga('Gusau');
                  setQuantity(50);
                  setPlantingLocation('FUGUS Campus Green Belt');
                  setPlanterName('Hassan Bin Bello');
                  setOrganization('FUGUS SIWES Unit');
                }}
                className="px-2 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-[10px] font-semibold text-emerald-900 transition-colors"
              >
                🌲 50 Neem Trees (Gusau)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpeciesId('sp-baobab');
                  setLga('Anka');
                  setQuantity(100);
                  setPlantingLocation('Bagega Reforestation Corridor');
                  setPlanterName('Bagega Youth Vanguard');
                  setOrganization('Zamfara GGW Volunteer Corps');
                }}
                className="px-2 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-[10px] font-semibold text-emerald-900 transition-colors"
              >
                🌳 100 Baobab (Anka)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpeciesId('sp-desert-date');
                  setLga('Gummi');
                  setQuantity(30);
                  setPlantingLocation('Gummi Shelterbelt Buffer');
                  setPlanterName('Amina Umar');
                  setOrganization('Women Desert Farmers');
                }}
                className="px-2 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-[10px] font-semibold text-emerald-900 transition-colors"
              >
                🌴 30 Desert Date (Gummi)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Indigenous Tree Species *</label>
              <select
                value={selectedSpeciesId}
                onChange={(e) => setSelectedSpeciesId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-white font-medium"
              >
                {INDIGENOUS_TREE_SPECIES.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.commonName} ({sp.botanicalName}) — Hausa: {sp.hausaName}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Species Quick Spec Card */}
            <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-slate-800 space-y-1 text-[11px]">
              <div className="font-bold text-emerald-950 flex items-center justify-between">
                <span>Botanical Spec: {currentSpecies.botanicalName}</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                  {currentSpecies.co2AbsorbedPerYearKg} kg CO2/yr per tree
                </span>
              </div>
              <p className="text-emerald-900 leading-tight">
                <strong>Zamfara Soil Suitability:</strong> {currentSpecies.idealForZamfaraSoil}
              </p>
              <p className="text-emerald-800 text-[10px] italic">{currentSpecies.ecologicalBenefits}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select LGA *</label>
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-white"
                >
                  {ZAMFARA_LGAS.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tree Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Planting Site Location</label>
              <input
                type="text"
                value={plantingLocation}
                onChange={(e) => setPlantingLocation(e.target.value)}
                placeholder="e.g. Maru Forest Belt / School Farm Windbreak"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Planter / Adopter Name *</label>
                <input
                  type="text"
                  required
                  value={planterName}
                  onChange={(e) => setPlanterName(e.target.value)}
                  placeholder="e.g. Hassan Bin Bello"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization / Group</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. FUGUS Eco Club"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nursery Source</label>
              <input
                type="text"
                value={nurserySource}
                onChange={(e) => setNurserySource(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Sprout className="w-4 h-4" />
              <span>Log Tree Planting & Generate Certificate</span>
            </button>
          </form>
        </div>

        {/* Right Section: Digital Certificate & Registry Table */}
        <div className="lg:col-span-7 space-y-4">
          {/* Digital Tree Adoption Certificate */}
          {selectedTreeForCert && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-slate-100 rounded-xl border-2 border-emerald-500/40 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <Award className="w-48 h-48 text-emerald-400" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
                        Official Tree Adoption & Planting Certificate
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        GreenWatch Zamfara • SDG 15 Verification
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-mono font-bold text-xs rounded shadow">
                    ID: {selectedTreeForCert.id}
                  </span>
                </div>

                <div className="text-center py-2 space-y-2">
                  <p className="text-xs text-slate-300 uppercase tracking-widest font-sans">This certifies that</p>
                  <h3 className="text-2xl font-bold text-white font-serif text-emerald-300">
                    {selectedTreeForCert.planterName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    ({selectedTreeForCert.organization})
                  </p>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto pt-1 leading-relaxed">
                    has successfully planted and registered <strong className="text-emerald-400">{selectedTreeForCert.quantity}</strong> units of <strong className="text-white">{selectedTreeForCert.speciesName}</strong> (<em>{selectedTreeForCert.botanicalName}</em>) in <strong>{selectedTreeForCert.lga} LGA</strong>, contributing to dryland reforestation in Zamfara State.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-t border-slate-800 pt-3">
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Annual CO2 Absorption</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {selectedTreeForCert.co2AbsorbedPerYearKg.toLocaleString()} kg/yr
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Survival Rate</span>
                    <span className="font-bold text-teal-400 text-sm">{selectedTreeForCert.survivalRatePercent}%</span>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Date Registered</span>
                    <span className="font-bold text-amber-400 text-sm">{selectedTreeForCert.datePlanted}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Downloading official PDF Certificate for ${selectedTreeForCert.planterName} (${selectedTreeForCert.id})...`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                    <span>Print / Export Adoption Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Planted Trees List */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Reforestation Registry Records</span>
              </h4>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-1 rounded-lg border border-slate-300 text-xs w-36 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredTrees.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTreeForCert(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedTreeForCert?.id === item.id
                      ? 'border-emerald-500 bg-emerald-50/60 font-medium'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.speciesName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {item.lga} LGA
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                        {item.quantity} trees
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Planted by <strong>{item.planterName}</strong> ({item.organization}) • {item.plantingLocation}
                    </p>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold block">{item.co2AbsorbedPerYearKg} kg CO2</span>
                    <span className="text-slate-400 text-[10px]">{item.datePlanted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
