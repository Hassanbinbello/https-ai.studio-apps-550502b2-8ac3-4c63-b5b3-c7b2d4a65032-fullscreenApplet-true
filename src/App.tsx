import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Phase1AcademicSuite } from './components/Phase1AcademicSuite';
import { EnvironmentalMap } from './components/EnvironmentalMap';
import { IncidentReporting } from './components/IncidentReporting';
import { TreeTracker } from './components/TreeTracker';
import { EcoAiAssistant } from './components/EcoAiAssistant';
import { SdgDashboard } from './components/SdgDashboard';

import {
  DEFAULT_INSTITUTIONAL_DETAILS,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_PLANTED_TREES,
} from './data/zamfaraData';
import { InstitutionalDetails, IncidentReport, PlantedTree } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('phase1-academic');
  const [details, setDetails] = useState<InstitutionalDetails>(DEFAULT_INSTITUTIONAL_DETAILS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENT_REPORTS);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>(INITIAL_PLANTED_TREES);
  const [preselectedLga, setPreselectedLga] = useState<string>('Maru');

  const handleAddIncident = (newIncident: IncidentReport) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentReport['status']) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleAddTree = (newTree: PlantedTree) => {
    setPlantedTrees((prev) => [newTree, ...prev]);
  };

  const handleSelectLgaForReport = (lgaName: string) => {
    setPreselectedLga(lgaName);
    setActiveTab('incident-reporting');
  };

  const totalTreesCount = plantedTrees.reduce((acc, t) => acc + t.quantity, 0);
  const pendingIncidentsCount = incidents.filter((i) => i.status === 'Pending Review').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingIncidentsCount={pendingIncidentsCount}
        totalTreesPlanted={totalTreesCount}
        studentName={details.studentName}
        institution={details.institution}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'phase1-academic' && (
          <Phase1AcademicSuite details={details} onUpdateDetails={setDetails} />
        )}

        {activeTab === 'map-hotspots' && (
          <EnvironmentalMap onSelectLgaForReport={handleSelectLgaForReport} />
        )}

        {activeTab === 'incident-reporting' && (
          <IncidentReporting
            incidents={incidents}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            preselectedLga={preselectedLga}
          />
        )}

        {activeTab === 'tree-tracker' && (
          <TreeTracker trees={plantedTrees} onAddTree={handleAddTree} />
        )}

        {activeTab === 'eco-assistant' && <EcoAiAssistant />}

        {activeTab === 'sdg-dashboard' && (
          <SdgDashboard incidents={incidents} plantedTrees={plantedTrees} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-slate-200">
              GreenWatch Zamfara — Localized Environmental Management Platform
            </p>
            <p className="text-slate-500">
              SIWES Program Suite for UN Sustainable Development Goal 15 (Life on Land) • {details.institution} ({details.department})
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-emerald-400">
            <span>Student: {details.studentName} ({details.matricNo})</span>
            <span className="text-slate-700">•</span>
            <span>Supervisor: {details.supervisor}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
