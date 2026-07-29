import React, { useState } from 'react';
import { IncidentReport } from '../types';
import { ZAMFARA_LGAS } from '../data/zamfaraData';
import {
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Send,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  FileCheck,
  Flame,
  Search,
  Filter,
  Camera,
  ChevronDown,
  Info,
} from 'lucide-react';

interface IncidentProps {
  incidents: IncidentReport[];
  onAddIncident: (incident: IncidentReport) => void;
  onUpdateIncidentStatus: (id: string, newStatus: IncidentReport['status']) => void;
  preselectedLga?: string;
}

export const IncidentReporting: React.FC<IncidentProps> = ({
  incidents,
  onAddIncident,
  onUpdateIncidentStatus,
  preselectedLga,
}) => {
  const [title, setTitle] = useState('');
  const [lga, setLga] = useState(preselectedLga || 'Maru');
  const [locationDetails, setLocationDetails] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentReport['incidentType']>('Charcoal Production');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('High');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Community Ranger Volunteer');
  const [reporterContact, setReporterContact] = useState('08031234567');
  const [lat, setLat] = useState('12.3333');
  const [lng, setLng] = useState('6.4000');

  const [isAuditingAi, setIsAuditingAi] = useState(false);
  const [selectedIncidentForAudit, setSelectedIncidentForAudit] = useState<IncidentReport | null>(incidents[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const samplePhotoOptions = [
    { label: 'Charcoal Kiln Smoke', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80' },
    { label: 'Felled Mahogany Tree', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Gully Soil Erosion', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80' },
  ];
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(samplePhotoOptions[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket: IncidentReport = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      lga,
      locationDetails: locationDetails || `${lga} Forest Corridor`,
      incidentType,
      severity,
      dateReported: new Date().toISOString().split('T')[0],
      reporterName,
      reporterContact,
      status: 'Pending Review',
      coordinates: {
        lat: parseFloat(lat) || 12.1628,
        lng: parseFloat(lng) || 6.6614,
      },
      description,
      photoUrl: selectedPhotoUrl,
    };

    onAddIncident(newTicket);
    setSelectedIncidentForAudit(newTicket);

    // Reset form
    setTitle('');
    setDescription('');
    setLocationDetails('');
  };

  const handleTriggerAiAudit = async (incident: IncidentReport) => {
    setIsAuditingAi(true);
    try {
      const res = await fetch('/api/gemini/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: incident.title,
          lga: incident.lga,
          incidentType: incident.incidentType,
          severity: incident.severity,
          description: incident.description,
          coordinates: incident.coordinates,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        const updatedWithAnalysis: IncidentReport = {
          ...incident,
          aiAnalysis: data.analysis,
        };
        setSelectedIncidentForAudit(updatedWithAnalysis);
      }
    } catch (err) {
      console.error('Failed to run AI audit:', err);
    } finally {
      setIsAuditingAi(false);
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.lga.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.incidentType.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Geotagged Incident Reporting & AI Ranger Audit</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Community Deforestation & Charcoal Logging Monitoring
          </h2>
          <p className="text-xs text-slate-300">
            Report illegal tree cutting, charcoal kiln fires, and gully soil erosion in Zamfara State. Submissions are verified via Gemini AI and dispatched to taskforce rangers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
            <span className="text-xl font-bold text-amber-400 font-mono block">{incidents.length}</span>
            <span className="text-[10px] text-slate-400">Total Reports</span>
          </div>
          <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
            <span className="text-xl font-bold text-emerald-400 font-mono block">
              {incidents.filter((i) => i.status === 'Ranger Dispatched' || i.status === 'Action Taken / Resolved').length}
            </span>
            <span className="text-[10px] text-slate-400">Ranger Actioned</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Submit New Incident */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Log New Environmental Incident</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              GPS Enabled
            </span>
          </div>

          {/* 1-Click Fast Presets */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              1-Click Quick Incident Fill Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setTitle('Charcoal Kiln Active in Dansadau Forest');
                  setLga('Maru');
                  setIncidentType('Charcoal Production');
                  setSeverity('Critical');
                  setDescription('Multiple active charcoal earth kilns emitting heavy smoke near Maru forest reserve corridor. Rapid tree cutting observed.');
                  setLat('12.3333');
                  setLng('6.4000');
                }}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
              >
                🔥 Charcoal Fire (Maru)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle('Illegal Commercial Mahogany Logging');
                  setLga('Anka');
                  setIncidentType('Illegal Logging');
                  setSeverity('High');
                  setDescription('Unlicensed timber trucks loading felled mature African Mahogany trees along the Bagega forest axis.');
                  setLat('12.1100');
                  setLng('5.9200');
                }}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
              >
                🪓 Mahogany Cutting (Anka)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle('Gully Soil Erosion Threatening Farmlands');
                  setLga('Tsafe');
                  setIncidentType('Soil Erosion / Gulley');
                  setSeverity('Moderate');
                  setDescription('Severe rainwater runoff eroding topsoil and exposing tree roots near Yankuzo community farming zone.');
                  setLat('11.9500');
                  setLng('6.9100');
                }}
                className="px-2 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
              >
                🌊 Soil Erosion (Tsafe)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Incident Headline / Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Illegal Charcoal Kilns Active in Maru Forest"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select LGA *</label>
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 bg-white"
                >
                  {ZAMFARA_LGAS.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Category *</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 bg-white"
                >
                  <option value="Charcoal Production">Charcoal Production</option>
                  <option value="Illegal Logging">Illegal Logging</option>
                  <option value="Bush Burning">Bush Burning</option>
                  <option value="Soil Erosion / Gulley">Soil Erosion / Gulley</option>
                  <option value="Encroachment">Encroachment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity Rating</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 bg-white font-bold text-amber-800"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Moderate">Moderate Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Details</label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="District / Forest Landmark"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-800 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-800 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Environmental Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe estimated trees damaged, commercial trucks present, or soil erosion depth..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Evidence Photo Attachments</label>
              <div className="grid grid-cols-3 gap-2">
                {samplePhotoOptions.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPhotoUrl(photo.url)}
                    className={`relative rounded-lg overflow-hidden border-2 text-[10px] font-medium h-16 transition-all ${
                      selectedPhotoUrl === photo.url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white p-0.5 truncate text-[9px] text-center">
                      {photo.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Incident Report to Taskforce</span>
            </button>
          </form>
        </div>

        {/* Right Section: Reported Tickets & AI Gemini Audit View */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Audit Modal/Card if Selected */}
          {selectedIncidentForAudit && (
            <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      Gemini AI Environmental Audit
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        SDG 15 Evaluator
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Ticket: <span className="font-mono text-emerald-400">{selectedIncidentForAudit.id}</span> ({selectedIncidentForAudit.lga} LGA)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerAiAudit(selectedIncidentForAudit)}
                  disabled={isAuditingAi}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAuditingAi ? 'animate-spin' : ''}`} />
                  <span>{isAuditingAi ? 'Analyzing...' : 'Re-Run AI Assessment'}</span>
                </button>
              </div>

              {/* Audit Content Body */}
              {selectedIncidentForAudit.aiAnalysis ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">AI Risk Rating</span>
                      <p className="font-bold text-amber-400 font-mono text-sm">
                        {selectedIncidentForAudit.aiAnalysis.severityScore || 'CRITICAL / HIGH'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Legal Forestry Breach</span>
                      <p className="font-semibold text-slate-200 text-[11px]">
                        {selectedIncidentForAudit.aiAnalysis.legalViolation || 'Zamfara State Forestry Edict Cap 55'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Environmental Impact Analysis</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedIncidentForAudit.aiAnalysis.environmentalImpact}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-teal-400 block">Flora & Native Canopy Threat</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedIncidentForAudit.aiAnalysis.floraFaunaThreat}
                    </p>
                  </div>

                  {selectedIncidentForAudit.aiAnalysis.recommendedActions && (
                    <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-300 block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Ranger Action Protocol Recommendations:
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                        {selectedIncidentForAudit.aiAnalysis.recommendedActions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <p className="text-xs">Click "Re-Run AI Assessment" to evaluate this reported incident with Gemini 3.6 Flash model.</p>
                </div>
              )}
            </div>
          )}

          {/* Ticket List Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Active Incident Tickets Queue</span>
              </h4>

              <div className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter ticket..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 pr-2 py-1 rounded-lg border border-slate-300 text-xs w-36 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Ranger Dispatched">Ranger Dispatched</option>
                  <option value="Investigated">Investigated</option>
                  <option value="Action Taken / Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* List of Incidents */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredIncidents.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedIncidentForAudit(ticket)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedIncidentForAudit?.id === ticket.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{ticket.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {ticket.lga} LGA
                      </span>
                      <span className="text-[11px] text-slate-500">{ticket.incidentType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateIncidentStatus(ticket.id, e.target.value as any)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-bold px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-800"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Ranger Dispatched">Ranger Dispatched</option>
                        <option value="Investigated">Investigated</option>
                        <option value="Action Taken / Resolved">Action Taken / Resolved</option>
                      </select>
                    </div>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900">{ticket.title}</h5>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{ticket.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {ticket.locationDetails}
                    </span>
                    <span className="font-mono text-slate-500">Reported: {ticket.dateReported}</span>
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
