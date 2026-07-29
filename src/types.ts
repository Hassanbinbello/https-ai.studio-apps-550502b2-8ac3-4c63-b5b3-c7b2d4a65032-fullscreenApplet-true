export interface InstitutionalDetails {
  studentName: string;
  matricNo: string;
  department: string;
  institution: string;
  faculty: string;
  supervisor: string;
  submissionYear: string;
  formattingStyle: string;
  projectTitle: string;
  specificFocus: string;
}

export interface ProposalDocumentation {
  backgroundOfStudy: string;
  problemStatement: string;
  aimAndObjectives: string[];
  significanceOfStudy: string[];
  scopeAndLimitations: string;
  mongoDbErdDescription: string;
  srsSummary: {
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
  };
}

export interface IncidentReport {
  id: string;
  title: string;
  lga: string;
  locationDetails: string;
  incidentType: 'Illegal Logging' | 'Charcoal Production' | 'Bush Burning' | 'Soil Erosion / Gulley' | 'Encroachment';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  dateReported: string;
  reporterName: string;
  reporterContact: string;
  status: 'Pending Review' | 'Ranger Dispatched' | 'Investigated' | 'Action Taken / Resolved';
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  photoUrl?: string;
  aiAnalysis?: {
    severityScore: string;
    environmentalImpact: string;
    floraFaunaThreat: string;
    legalViolation: string;
    recommendedActions: string[];
  };
}

export interface PlantedTree {
  id: string;
  speciesName: string;
  botanicalName: string;
  localHausaName: string;
  lga: string;
  plantingLocation: string;
  planterName: string;
  organization: string;
  datePlanted: string;
  quantity: number;
  survivalRatePercent: number;
  nurserySource: string;
  co2AbsorbedPerYearKg: number;
  status: 'Healthy' | 'Needs Watering' | 'Replanted' | 'Thriving';
  photoUrl?: string;
}

export interface ZamfaraLGA {
  id: string;
  name: string;
  headquarters: string;
  centroid: { lat: number; lng: number };
  deforestationRisk: 'Critical' | 'High' | 'Moderate' | 'Low';
  forestCoverPercent: number;
  hectaresMonitored: number;
  treesPlanted: number;
  activeIncidentsCount: number;
  activeRangers: number;
  primaryThreat: string;
  greatGreenWallZone: boolean;
}

export interface TreeSpecies {
  id: string;
  commonName: string;
  botanicalName: string;
  hausaName: string;
  idealForZamfaraSoil: string;
  droughtResistance: 'High' | 'Very High' | 'Extreme';
  co2AbsorbedPerYearKg: number;
  matureHeightMeters: number;
  ecologicalBenefits: string;
}

export interface EcoChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
