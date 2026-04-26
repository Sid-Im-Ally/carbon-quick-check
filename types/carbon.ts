export type { ResolvedLocation } from './location';
export type { KoppenClimateResult } from './climate';
export type { GridEmissionResult } from './grid';
export type {
  MobilityProfileType,
  TransportMode,
  MobilityQuestionnaireInput,
  MobilityScoringResult,
  MobilityProfileData,
  MobilityModeResult,
} from './mobility';
export type { ResolvedAssumptions } from './assumptions';

export type GeographicContext =
  | 'urban_core'
  | 'urban_inner_ring'
  | 'suburban_edge'
  | 'peri_urban_fringe'
  | 'greenfield_undeveloped';

export type ProjectType =
  | 'infill_redevelopment'
  | 'greenfield_development'
  | 'campus_planned_district';

export type ProgramType =
  | 'residential_single_family'
  | 'residential_multifamily'
  | 'office'
  | 'retail'
  | 'hospitality'
  | 'educational'
  | 'healthcare'
  | 'industrial'
  | 'institutional';

export type SiteAreaUnit = 'm2' | 'hectares' | 'acres';

export type FrontendProgramArea = {
  residential: number;
  office: number;
  retail: number;
  hospitality: number;
  educational: number;
  healthcare: number;
  industrial: number;
  institutional: number;
};

export type ResidentialSplit = {
  singleFamilyPercent: number;
  multifamilyPercent: number;
};

export type CarbonQuickCheckInput = {
  projectName: string;
  locationInput: string;
  totalPopulation: number;
  totalBuiltAreaM2: number;
  siteAreaValue: number;
  siteAreaUnit: SiteAreaUnit;
  geographicContext: GeographicContext;
  projectType: ProjectType;
  programAreas: FrontendProgramArea;
  residentialSplit: ResidentialSplit;
  mobilityQuestionnaire: import('./mobility').MobilityQuestionnaireInput;
  infrastructureAllowancePercent: number;
};

export type DensityResult = {
  siteAreaHectares: number;
  densityPeoplePerHa: number;
  densityCategory: 'low' | 'medium' | 'high';
  densityModifier: number;
};

export type BuildingEuiAssumption = {
  climateZone: string;
  climateLabel?: string;
  programType: ProgramType;
  defaultEuiKwhPerM2Year: number;
  lowEuiKwhPerM2Year?: number;
  highEuiKwhPerM2Year?: number;
  sourceMethod: string;
  sourceUrl?: string;
  proxyCities?: { city: string; country: string; euiKwhPerM2Year: number }[];
  confidence: 'high' | 'medium' | 'low' | 'placeholder';
  notes?: string;
};

export type BuildingResult = {
  programType: ProgramType;
  areaM2: number;
  euiKwhPerM2Year: number;
  annualEnergyKwh: number;
  emissionsTCO2e: number;
  euiConfidence: 'high' | 'medium' | 'low' | 'placeholder';
};

export type ProgramAreaValidationResult = {
  totalProgramAreaM2: number;
  totalBuiltAreaM2: number;
  differenceM2: number;
  status: 'match' | 'under' | 'over';
};

export type CalculationResult = {
  projectName: string;
  location: import('./location').ResolvedLocation;
  climate: import('./climate').KoppenClimateResult;
  grid: import('./grid').GridEmissionResult;
  density: DensityResult;
  mobilityScoring: import('./mobility').MobilityScoringResult;
  assignedMobilityProfile: import('./mobility').MobilityProfileType;
  buildingResults: BuildingResult[];
  mobilityResults: import('./mobility').MobilityModeResult[];
  buildingEmissionsTCO2e: number;
  mobilityEmissionsTCO2e: number;
  infrastructureEmissionsTCO2e: number;
  totalEmissionsTCO2e: number;
  ghgPerCapitaTCO2e: number;
  contributionPercentages: {
    buildings: number;
    mobility: number;
    infrastructure: number;
  };
  programAreaValidation: ProgramAreaValidationResult;
  assumptionsNotes: string[];
  warnings: string[];
};
