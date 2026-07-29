import React, { useState } from 'react';
import { InstitutionalDetails } from '../types';
import { MONGODB_SCHEMA_DOCS } from '../data/zamfaraData';
import {
  GraduationCap,
  FileText,
  Database,
  CheckCircle2,
  Download,
  Copy,
  Sparkles,
  BookOpen,
  Layers,
  Printer,
  ChevronRight,
  School,
  UserCheck,
  Code2,
  Search,
} from 'lucide-react';

interface Phase1Props {
  details: InstitutionalDetails;
  onUpdateDetails: (updated: InstitutionalDetails) => void;
}

export const Phase1AcademicSuite: React.FC<Phase1Props> = ({ details, onUpdateDetails }) => {
  const [activeDocTab, setActiveDocTab] = useState<'cover' | 'chapter1' | 'erd' | 'srs'>('cover');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedText, setAiGeneratedText] = useState<any>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const handleInputChange = (field: keyof InstitutionalDetails, value: string) => {
    onUpdateDetails({
      ...details,
      [field]: value,
    });
  };

  const handleAiEnhanceProposal = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (data.proposal) {
        setAiGeneratedText(data.proposal);
      }
    } catch (err) {
      console.error('Failed to generate AI proposal:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const fullMarkdownDoc = `# ${details.projectTitle.toUpperCase()}
**SUBMITTED BY:** ${details.studentName} (${details.matricNo})
**DEPARTMENT:** ${details.department}
**FACULTY:** ${details.faculty}
**INSTITUTION:** ${details.institution}
**SUPERVISOR:** ${details.supervisor}
**YEAR:** ${details.submissionYear}
**FORMATTING GUIDELINES:** ${details.formattingStyle}

---

## CHAPTER ONE: INTRODUCTION

### 1.1 Background of the Study
Desertification and unsustainable deforestation represent critical ecological emergencies across Northern Nigeria, particularly in Zamfara State. Situated along the arid Sahelian fringe, Zamfara experiences rapid land degradation driven by commercial charcoal kiln burning, illegal logging of native hardwoods (such as Mahogany and Acacia), and fuel wood harvesting. UN Sustainable Development Goal 15 (Life on Land) emphasizes combating desertification, halting biodiversity loss, and promoting sustainable forest management. "GreenWatch Zamfara" is an innovative, localized web-based software application designed to empower community members, forestry rangers, and government officials to monitor deforestation incidents in real-time, log indigenous tree planting initiatives, and leverage geospatial analytics to protect dryland ecosystems.

### 1.2 Problem Statement
Traditional forestry management in Zamfara State relies heavily on manual paper logs and localized ranger reports, leading to severe monitoring gaps across vast rural LGAs such as Maru, Anka, Zurmi, and Shinkafi. Illegal logging operations and charcoal kilns often operate undetected for months due to delayed reporting channels and lack of precise GPS mapping. Furthermore, community tree planting campaigns frequently lack digital survival rate tracking, making it impossible to measure long-term reforestation success or carbon sequestration impact. There is an urgent requirement for an automated, accessible, geotagged web platform that bridges community reports with ranger dispatch and AI-driven environmental risk evaluation.

### 1.3 Aim and Objectives
The primary aim of this project is to design and implement **GreenWatch Zamfara**, a localized web platform for deforestation monitoring, tree planting tracking, and SDG 15 analytics.

Specific objectives include:
1. To design an interactive GIS mapping interface covering all 14 Local Government Areas (LGAs) of Zamfara State to visualize deforestation hotspots and re-greening belts.
2. To develop a geotagged incident reporting module enabling community members to submit reports with photos, coordinates, and severity levels.
3. To integrate an AI-powered environmental assessment engine (using Gemini API) that evaluates reported incidents, identifies forestry law violations, and generates immediate ranger response protocols.
4. To implement a Tree Planting & Adoption Tracker that calculates annual CO2 absorption based on dryland Sahelian tree species (e.g., Neem, Baobab, Bagaruwa).
5. To construct a high-performance MongoDB database architecture optimized for geospatial queries and SDG 15 impact reporting.

### 1.4 Significance of the Study
- **Zamfara Ministry of Environment:** Provides actionable real-time incident data to deploy community rangers efficiently to high-risk zones.
- **Local Communities & Farmers:** Protects arable agricultural land from sand dune encroachment and gully erosion through verified tree windbreaks.
- **Academic & Research Community:** Serves as a benchmark reference architecture for environmental informatics in dryland regions of West Africa.
- **Global Sustainability (SDG 15):** Direct contribution to Target 15.2 (promoting sustainable management of all types of forests) and Target 15.3 (halting land degradation).

---

## DATABASE SCHEMA ARCHITECTURE (MongoDB Collections)
- **users Collection:** Stores reporter, ranger, admin, and student profiles.
- **incidents Collection:** Stores geotagged illegal logging & erosion reports with GeoJSON 2dsphere indexing.
- **tree_plantings Collection:** Records planted tree batches, survival percentages, and CO2 offset metrics.
- **lga_metrics Collection:** Aggregates real-time forest cover % and active ranger dispatches across Zamfara.
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullMarkdownDoc);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Phase 1: SIWES Program Setup & Official Documentation</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              GreenWatch Zamfara — SIWES Program Workspace
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generate official proposal cover pages, institutional preliminary approvals, Chapter One documentation, MongoDB database architecture models, and Software Requirement Specifications (SRS) tailored to SDG 15.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAiEnhanceProposal}
              disabled={isGeneratingAi}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Generating AI Proposal...' : 'Auto-Generate via Gemini AI'}</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
            >
              {copiedStatus ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedStatus ? 'Copied Markdown!' : 'Copy Full Documentation'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Institutional Details Form), Right Column (Document Live Generator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Institutional Details Setup */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Phase 1: Institutional Form</span>
            </div>
            <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Active Session
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">1. Full Name (Cover Page)</label>
              <input
                type="text"
                value={details.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                placeholder="e.g. Hassan Bin Bello"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">2. Matriculation / Reg. Number</label>
              <input
                type="text"
                value={details.matricNo}
                onChange={(e) => handleInputChange('matricNo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                placeholder="e.g. FUGUS/2022/CSC/1042"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">3. Department</label>
                <input
                  type="text"
                  value={details.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">4. Faculty / School</label>
                <input
                  type="text"
                  value={details.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  placeholder="Faculty of Computing"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">5. Institution / University</label>
              <input
                type="text"
                value={details.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium text-emerald-900"
                placeholder="e.g. Federal University Gusau"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">6. Supervisor Name</label>
                <input
                  type="text"
                  value={details.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  placeholder="Dr. Abubakar Faruk"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">7. Submission Year</label>
                <input
                  type="text"
                  value={details.submissionYear}
                  onChange={(e) => handleInputChange('submissionYear', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  placeholder="2026"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">8. Project Title</label>
              <textarea
                rows={2}
                value={details.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Departmental Formatting Style</label>
              <input
                type="text"
                value={details.formattingStyle}
                onChange={(e) => handleInputChange('formattingStyle', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 text-[11px]"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-950">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Phase 1 Verification Complete</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              All details entered dynamically update the Official Proposal Cover Page, Preliminary Approval Sheets, and Technical Architecture in real-time.
            </p>
          </div>
        </div>

        {/* Right Output: Document Live Viewer */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[680px]">
          {/* Document Tab Bar */}
          <div className="bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-1 overflow-x-auto rounded-t-xl">
            <button
              onClick={() => setActiveDocTab('cover')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeDocTab === 'cover'
                  ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cover & Approval Page</span>
            </button>

            <button
              onClick={() => setActiveDocTab('chapter1')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeDocTab === 'chapter1'
                  ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chapter 1: Introduction</span>
            </button>

            <button
              onClick={() => setActiveDocTab('erd')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeDocTab === 'erd'
                  ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>MongoDB Schema & ERD</span>
            </button>

            <button
              onClick={() => setActiveDocTab('srs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeDocTab === 'srs'
                  ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>SRS & System Specs</span>
            </button>
          </div>

          {/* Document Content View */}
          <div className="p-8 flex-1 bg-white text-slate-900 overflow-y-auto max-h-[750px]">
            {/* TAB 1: COVER PAGE */}
            {activeDocTab === 'cover' && (
              <div className="max-w-2xl mx-auto text-center space-y-8 py-6 font-serif border border-slate-300 p-10 bg-slate-50/50 shadow-inner rounded-sm">
                <div className="border-b-2 border-slate-800 pb-4">
                  <h1 className="text-xl font-bold uppercase tracking-wide text-slate-950 leading-snug">
                    {details.projectTitle}
                  </h1>
                </div>

                <div className="space-y-2 py-4">
                  <p className="text-xs uppercase tracking-widest text-slate-600 font-sans">A Project Proposal Submitted By:</p>
                  <p className="text-lg font-bold text-slate-900 font-sans uppercase">{details.studentName}</p>
                  <p className="text-sm font-semibold text-emerald-800 font-mono">MATRIC NO: {details.matricNo}</p>
                </div>

                <div className="py-2 text-xs italic text-slate-700 max-w-lg mx-auto font-sans leading-relaxed">
                  SUBMITTED TO THE {details.department.toUpperCase()}, {details.faculty.toUpperCase()}, {details.institution.toUpperCase()}, IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE AWARD OF BACHELOR OF SCIENCE (B.SC.) DEGREE IN COMPUTER SCIENCE.
                </div>

                <div className="pt-6 border-t border-slate-300 space-y-1 font-sans text-xs">
                  <p className="font-semibold text-slate-800">SUPERVISOR: {details.supervisor.toUpperCase()}</p>
                  <p className="font-semibold text-slate-800">INSTITUTION: {details.institution.toUpperCase()}</p>
                  <p className="font-bold text-emerald-900 pt-2">SUBMISSION YEAR: {details.submissionYear}</p>
                </div>

                {/* Formal Approval Box */}
                <div className="mt-12 text-left font-sans text-xs border border-slate-300 p-4 rounded bg-white space-y-3">
                  <p className="font-bold text-slate-900 uppercase text-center border-b pb-1">CERTIFICATION & APPROVAL SHEET</p>
                  <p className="text-slate-700 leading-relaxed">
                    This is to certify that this project proposal entitled <strong>"{details.projectTitle}"</strong> was written and prepared by <strong>{details.studentName} ({details.matricNo})</strong> under the guidance and supervision of <strong>{details.supervisor}</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-6 text-[11px]">
                    <div className="border-t border-slate-400 pt-1">
                      <p className="font-bold">{details.supervisor}</p>
                      <p className="text-slate-500">Project Supervisor</p>
                      <p className="text-slate-400 pt-1">Date: ____/____/2026</p>
                    </div>
                    <div className="border-t border-slate-400 pt-1">
                      <p className="font-bold">Head of Department</p>
                      <p className="text-slate-500">{details.department}</p>
                      <p className="text-slate-400 pt-1">Date: ____/____/2026</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHAPTER ONE */}
            {activeDocTab === 'chapter1' && (
              <div className="space-y-6 text-slate-800 max-w-3xl mx-auto leading-relaxed text-sm">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">Documentation Module</span>
                  <h2 className="text-2xl font-bold text-slate-950 font-serif mt-1">CHAPTER ONE: INTRODUCTION</h2>
                </div>

                {aiGeneratedText?.backgroundOfStudy ? (
                  <div className="space-y-4 p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Gemini AI Enhanced Research Text</span>
                    </div>
                    <p className="whitespace-pre-line text-xs text-slate-800 leading-relaxed">{aiGeneratedText.backgroundOfStudy}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-600 pl-3">1.1 Background of the Study</h3>
                    <p className="text-slate-700 text-xs leading-relaxed text-justify">
                      Desertification and rapid forest degradation represent severe environmental threats in Northern Nigeria, particularly within Zamfara State. Located on the arid fringe of the Sahel savannah, Zamfara experiences extreme temperature fluctuations, sparse rainfall, and accelerating land degradation driven by commercial charcoal kiln operations, illegal logging of mature hardwood species (such as <em>Khaya senegalensis</em> and <em>Acacia nilotica</em>), and unsustainable fuelwood extraction. 
                    </p>
                    <p className="text-slate-700 text-xs leading-relaxed text-justify">
                      Targeting Sustainable Development Goal 15 (SDG 15: Life on Land), <strong>GreenWatch Zamfara</strong> is developed as a localized web platform to provide digital monitoring, geotagged incident reporting, tree planting verification, and automated ecological impact assessment across the 14 Local Government Areas (LGAs) of Zamfara State.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-600 pl-3">1.2 Problem Statement</h3>
                  <p className="text-slate-700 text-xs leading-relaxed text-justify">
                    Forestry administration in Zamfara State currently suffers from reliance on manual, paper-based incident reporting and delayed physical dispatch protocols. In expansive forest belts like the Maru and Kankara reserves, illegal charcoal kilns operate continuously for weeks before being reported. Furthermore, tree planting campaigns organized by community groups lack persistent digital tracking mechanisms to monitor survival rates, species suitability, or carbon sequestration. Without a centralized, geotagged web platform, local environmental taskforces cannot effectively prioritize ranger deployments or measure re-greening progress.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-600 pl-3">1.3 Aim and Objectives</h3>
                  <p className="text-slate-700 text-xs">
                    The primary aim of this research project is to design and implement <strong>GreenWatch Zamfara</strong> — a web application for real-time deforestation tracking, tree adoption monitoring, and SDG 15 analytics.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                    <p className="font-bold text-slate-900">Specific Objectives:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      <li>To construct an interactive GIS vector map representing the 14 LGAs of Zamfara State with color-coded deforestation threat indices.</li>
                      <li>To build a geotagged incident submission system allowing citizens and volunteers to report illegal logging with GPS coordinates and photos.</li>
                      <li>To integrate Gemini AI for automated environmental audit analysis, severity scoring, and regulatory forestry edict compliance tagging.</li>
                      <li>To implement an Indigenous Tree Planting & CO2 Absorption Tracker customized for Sahelian species (Neem, Baobab, Acacia, Mahogany).</li>
                      <li>To design a high-performance MongoDB schema optimized for geospatial 2dsphere indexing and SDG 15 impact aggregation.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-600 pl-3">1.4 Significance of the Study</h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Zamfara Ministry of Environment & Forestry:</strong> Equips forest rangers with instant geotagged alert tickets for targeted field enforcement.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Farmers & Rural Communities:</strong> Halts sand dune encroachment and protects vital agricultural topsoil from severe wind erosion.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Academic & Software Engineering Body:</strong> Demonstrates practical full-stack application of web technologies, MongoDB geospatial indexes, and AI APIs in African dryland conservation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: MONGODB SCHEMA & ERD */}
            {activeDocTab === 'erd' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">Database Architecture</span>
                    <h2 className="text-xl font-bold text-slate-950 font-serif">MongoDB Schemas & Entity Relationship Model</h2>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-900 text-emerald-400 font-mono text-xs rounded border border-slate-800">
                    Database: GreenWatchDB
                  </span>
                </div>

                {/* Visual ERD Architecture Diagram Box */}
                <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                      <Code2 className="w-4 h-4" />
                      <span>System Entity Relationship Diagram (Visual ERD)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Geospatial 2dsphere Enabled</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                    {/* Collection 1: Users */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/30 space-y-2">
                      <div className="font-bold text-emerald-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>users</span>
                        <span className="text-[10px] text-slate-500">Collection</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div><span className="text-emerald-500">PK</span> _id: ObjectId</div>
                        <div>fullName: String</div>
                        <div>email: String</div>
                        <div>role: Enum</div>
                        <div>assignedLGA: String</div>
                        <div className="text-slate-500">createdAt: Date</div>
                      </div>
                    </div>

                    {/* Collection 2: Incidents */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/30 space-y-2">
                      <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>incidents</span>
                        <span className="text-[10px] text-slate-500">Collection</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div><span className="text-amber-500">PK</span> _id: ObjectId</div>
                        <div>ticketId: String</div>
                        <div>lga: String</div>
                        <div>incidentType: Enum</div>
                        <div>severity: Enum</div>
                        <div className="text-emerald-400 font-semibold">location: GeoJSON</div>
                        <div><span className="text-slate-500">FK</span> reporterId: ObjectId</div>
                      </div>
                    </div>

                    {/* Collection 3: TreePlantings */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-teal-500/30 space-y-2">
                      <div className="font-bold text-teal-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>tree_plantings</span>
                        <span className="text-[10px] text-slate-500">Collection</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div><span className="text-teal-500">PK</span> _id: ObjectId</div>
                        <div>batchId: String</div>
                        <div>speciesName: String</div>
                        <div>lga: String</div>
                        <div>quantity: Number</div>
                        <div>co2AbsorbedKg: Number</div>
                        <div>survivalRate: Number</div>
                      </div>
                    </div>

                    {/* Collection 4: LGAMetrics */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-indigo-500/30 space-y-2">
                      <div className="font-bold text-indigo-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>lga_metrics</span>
                        <span className="text-[10px] text-slate-500">Collection</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div><span className="text-indigo-500">PK</span> _id: ObjectId</div>
                        <div>lgaName: String</div>
                        <div>forestCoverPct: Number</div>
                        <div>hectaresMonitored: Number</div>
                        <div>treesPlantedTotal: Number</div>
                        <div>activeRangers: Number</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schema Specifications Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-bold text-sm text-slate-900">Document Schemas Specification (MongoDB / JSON)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MONGODB_SCHEMA_DOCS.collections.map((col, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs font-mono">db.{col.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">MongoDB Collection</span>
                        </div>
                        <p className="text-xs text-slate-600">{col.description}</p>
                        <pre className="bg-slate-900 text-emerald-300 p-3 rounded text-[11px] font-mono overflow-x-auto">
                          {col.fields.trim()}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SRS & SYSTEM SPECS */}
            {activeDocTab === 'srs' && (
              <div className="space-y-6 max-w-3xl mx-auto text-slate-800 text-xs">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">Software Engineering Specs</span>
                  <h2 className="text-xl font-bold text-slate-950 font-serif">Software Requirement Specifications (SRS)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Functional Requirements */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Functional Requirements (FR)</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li><strong>FR-01 (GIS Visualization):</strong> System shall render interactive vector maps for all 14 LGAs of Zamfara with real-time deforestation risk styling.</li>
                      <li><strong>FR-02 (Geotagged Incident Reporting):</strong> Platform shall allow reporters to log illegal logging tickets with GPS coordinates, photos, and severity ratings.</li>
                      <li><strong>FR-03 (AI Environmental Audit):</strong> System shall call Gemini API to evaluate incident descriptions, outputting flora/fauna threat scores and ranger protocols.</li>
                      <li><strong>FR-04 (Tree Adoption Tracker):</strong> System shall calculate annual CO2 offset values for planted Sahelian trees (Neem, Baobab, Acacia, Mahogany).</li>
                      <li><strong>FR-05 (Documentation Exporter):</strong> Platform shall format and export complete academic proposal documentation for students.</li>
                    </ul>
                  </div>

                  {/* Non-Functional Requirements */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Non-Functional Requirements (NFR)</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li><strong>NFR-01 (Performance):</strong> API responses and geospatial queries shall complete in under 500ms for mobile bandwidth environments.</li>
                      <li><strong>NFR-02 (Availability):</strong> The web application shall achieve 99.9% uptime hosted on Cloud Run container architecture.</li>
                      <li><strong>NFR-03 (Mobile Responsiveness):</strong> Interface must render cleanly across mobile smartphones, tablets, and desktop displays.</li>
                      <li><strong>NFR-04 (Security):</strong> Server-side API key proxying prevents exposure of AI credentials to client browsers.</li>
                      <li><strong>NFR-05 (Accessibility):</strong> Pass WCAG AA contrast guidelines with legible typography across all modules.</li>
                    </ul>
                  </div>
                </div>

                {/* Tech Stack Diagram */}
                <div className="bg-slate-900 text-slate-100 p-5 rounded-xl space-y-3 border border-slate-800">
                  <p className="font-bold text-xs text-emerald-400 font-mono">System Architecture Tech Stack</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono text-slate-300">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-emerald-400 font-bold block">Frontend</span>
                      React 19, TypeScript, Tailwind CSS, Motion
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-amber-400 font-bold block">Backend API</span>
                      Express.js, Node.js (Port 3000)
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-teal-400 font-bold block">AI Engine</span>
                      Google GenAI SDK (Gemini 3.6 Flash)
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-indigo-400 font-bold block">Database Layer</span>
                      MongoDB / GeoJSON 2dsphere
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
