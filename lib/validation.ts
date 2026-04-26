import type { CarbonQuickCheckInput, MobilityQuestionnaireInput } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateProjectDetails(
  data: Partial<CarbonQuickCheckInput>,
  resolvedLocation?: ResolvedLocation | null,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.projectName?.trim()) {
    errors.projectName = 'Project name is required.';
  }
  if (!resolvedLocation) {
    errors.locationInput = 'Please resolve a project location before continuing.';
  }
  if (!data.totalPopulation || data.totalPopulation <= 0) {
    errors.totalPopulation = 'Population must be greater than 0.';
  }
  if (!data.totalBuiltAreaM2 || data.totalBuiltAreaM2 <= 0) {
    errors.totalBuiltAreaM2 = 'Total built area must be greater than 0.';
  }
  if (!data.siteAreaValue || data.siteAreaValue <= 0) {
    errors.siteAreaValue = 'Site area must be greater than 0.';
  }
  if (!data.geographicContext) {
    errors.geographicContext = 'Geographic context is required.';
  }
  if (!data.projectType) {
    errors.projectType = 'Project type is required.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBuildingProgram(
  data: Partial<CarbonQuickCheckInput>,
): ValidationResult {
  const errors: Record<string, string> = {};

  const areas = data.programAreas;
  if (!areas) {
    errors.programAreas = 'Building program is required.';
    return { valid: false, errors };
  }

  const total =
    (areas.residential || 0) +
    (areas.office || 0) +
    (areas.retail || 0) +
    (areas.hospitality || 0) +
    (areas.educational || 0) +
    (areas.healthcare || 0) +
    (areas.industrial || 0) +
    (areas.institutional || 0);

  const totalBuilt = data.totalBuiltAreaM2 || 0;

  if (total > totalBuilt) {
    errors.programTotal = `Program areas (${Math.round(total).toLocaleString()} m²) exceed total built area (${Math.round(totalBuilt).toLocaleString()} m²). Please adjust before continuing.`;
  }

  if (areas.residential > 0) {
    const sfPct = data.residentialSplit?.singleFamilyPercent ?? 0;
    const mfPct = data.residentialSplit?.multifamilyPercent ?? 0;
    if (Math.abs(sfPct + mfPct - 100) > 0.01) {
      errors.residentialSplit = 'Single-family and multifamily percentages must total 100%.';
    }
    if (sfPct < 0 || sfPct > 100) {
      errors.residentialSplit = 'Single-family percentage must be between 0 and 100.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateMobilityQuestionnaire(
  questionnaire: Partial<MobilityQuestionnaireInput> | undefined,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!questionnaire) {
    errors.questionnaire = 'Mobility questionnaire is required.';
    return { valid: false, errors };
  }

  if (questionnaire.parkingProvisionScore == null) {
    errors.parkingProvisionScore = 'Please answer the parking provision question.';
  }
  if (questionnaire.transitAccessScore == null) {
    errors.transitAccessScore = 'Please answer the transit access question.';
  }
  if (questionnaire.mobilityCultureScore == null) {
    errors.mobilityCultureScore = 'Please answer the mobility culture question.';
  }
  if (questionnaire.catchmentTypeScore == null) {
    errors.catchmentTypeScore = 'Please answer the catchment type question.';
  }
  if (questionnaire.expectedArrivalModeScore == null) {
    errors.expectedArrivalModeScore = 'Please answer the expected arrival mode question.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
