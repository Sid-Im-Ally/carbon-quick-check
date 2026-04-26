import type {
  GeographicContext,
  ProjectType,
  MobilityQuestionnaireInput,
  DensityResult,
  MobilityScoringResult,
  MobilityProfileType,
} from '@/types/carbon';
import { m2ToHectares } from './unitConversions';

export function calculateDensity(population: number, siteAreaM2: number): DensityResult {
  const siteAreaHectares = m2ToHectares(siteAreaM2);
  const densityPeoplePerHa = siteAreaHectares > 0 ? population / siteAreaHectares : 0;

  let densityCategory: DensityResult['densityCategory'];
  let densityModifier: number;

  if (densityPeoplePerHa < 50) {
    densityCategory = 'low';
    densityModifier = -1;
  } else if (densityPeoplePerHa <= 150) {
    densityCategory = 'medium';
    densityModifier = 0;
  } else {
    densityCategory = 'high';
    densityModifier = 1;
  }

  return { siteAreaHectares, densityPeoplePerHa, densityCategory, densityModifier };
}

export function getDensityModifier(density: DensityResult): number {
  return density.densityModifier;
}

export function getGeographicContextModifier(context: GeographicContext): number {
  const modifiers: Record<GeographicContext, number> = {
    urban_core: 1,
    urban_inner_ring: 0.5,
    suburban_edge: -1,
    peri_urban_fringe: -0.5,
    greenfield_undeveloped: -1,
  };
  return modifiers[context];
}

export function getProjectTypeModifier(projectType: ProjectType): number {
  const modifiers: Record<ProjectType, number> = {
    infill_redevelopment: 1,
    greenfield_development: -1,
    campus_planned_district: 0,
  };
  return modifiers[projectType];
}

export function assignMobilityProfile(finalScore: number): MobilityProfileType {
  if (finalScore <= 7) return 'auto_oriented';
  if (finalScore < 15) return 'balanced';
  return 'transit_oriented';
}

export function calculateMobilityScore(
  questionnaire: MobilityQuestionnaireInput,
  density: DensityResult,
  geographicContext: GeographicContext,
  projectType: ProjectType,
): MobilityScoringResult {
  const parkingWeightedScore = questionnaire.parkingProvisionScore * 2;
  const transitWeightedScore = questionnaire.transitAccessScore * 2;
  const mobilityCultureScore = questionnaire.mobilityCultureScore;
  const catchmentScore = questionnaire.catchmentTypeScore;
  const arrivalModeScore = questionnaire.expectedArrivalModeScore;

  const densityModifier = getDensityModifier(density);
  const geographicContextModifier = getGeographicContextModifier(geographicContext);
  const projectTypeModifier = getProjectTypeModifier(projectType);

  const rawScore =
    parkingWeightedScore +
    transitWeightedScore +
    mobilityCultureScore +
    catchmentScore +
    arrivalModeScore +
    densityModifier +
    geographicContextModifier +
    projectTypeModifier;

  const finalScore = Math.max(0, rawScore);
  const assignedProfile = assignMobilityProfile(finalScore);

  return {
    parkingWeightedScore,
    transitWeightedScore,
    mobilityCultureScore,
    catchmentScore,
    arrivalModeScore,
    densityModifier,
    geographicContextModifier,
    projectTypeModifier,
    finalScore,
    assignedProfile,
  };
}

export const GEOGRAPHIC_CONTEXT_LABELS: Record<GeographicContext, string> = {
  urban_core: 'Urban Core',
  urban_inner_ring: 'Urban / Inner Ring',
  suburban_edge: 'Suburban Edge',
  peri_urban_fringe: 'Peri-Urban / Fringe',
  greenfield_undeveloped: 'Greenfield / Undeveloped Land',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  infill_redevelopment: 'Infill / Redevelopment',
  greenfield_development: 'Greenfield Development',
  campus_planned_district: 'Campus / Planned District',
};
