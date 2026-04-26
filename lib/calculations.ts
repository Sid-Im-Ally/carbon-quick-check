import type {
  CarbonQuickCheckInput,
  CalculationResult,
  BuildingResult,
  ProgramType,
} from '@/types/carbon';
import type { MobilityModeResult } from '@/types/mobility';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { getEuiAssumptionWithFallback } from '@/data/buildingEuiAssumptions';
import { MOBILITY_PROFILES } from '@/data/mobilityProfiles';
import { calculateDensity, calculateMobilityScore } from './mobilityScoring';
import { m2ToHectares } from './unitConversions';

const TRANSPORT_MODES = ['car', 'transit', 'walk', 'bike_micromobility', 'taxi_ridehail', 'other'] as const;

export function runCalculations(
  input: CarbonQuickCheckInput,
  location: ResolvedLocation,
  climate: KoppenClimateResult,
  grid: GridEmissionResult,
): CalculationResult {
  const assumptionsNotes: string[] = [];
  const warnings: string[] = [];

  // Collect any warnings from resolved data
  if (location.warnings) warnings.push(...location.warnings);
  if (climate.warnings) warnings.push(...climate.warnings);
  if (grid.warnings) warnings.push(...grid.warnings);
  if (climate.notes) assumptionsNotes.push(`Climate: ${climate.notes}`);
  if (grid.notes) assumptionsNotes.push(`Grid: ${grid.notes}`);

  // Grid factor (use directly — already validated by gridEmissionService)
  const gridFactorKgCO2ePerKwh = grid.gridFactorKgCO2ePerKwh;

  // --- Site area ---
  const siteAreaHectares =
    input.siteAreaUnit === 'hectares' ? input.siteAreaValue : m2ToHectares(input.siteAreaValue);
  const siteAreaM2 =
    input.siteAreaUnit === 'hectares' ? input.siteAreaValue * 10000 : input.siteAreaValue;

  // --- Density ---
  const density = calculateDensity(input.totalPopulation, siteAreaM2);

  // --- Expand residential into split programs ---
  const { residential, office, retail, hospitality, educational, healthcare, industrial, institutional } =
    input.programAreas;

  const singleFamilyArea = residential * (input.residentialSplit.singleFamilyPercent / 100);
  const multifamilyArea = residential * (input.residentialSplit.multifamilyPercent / 100);

  const allPrograms: Array<{ type: ProgramType; areaM2: number }> = [
    { type: 'residential_single_family', areaM2: singleFamilyArea },
    { type: 'residential_multifamily', areaM2: multifamilyArea },
    { type: 'office', areaM2: office },
    { type: 'retail', areaM2: retail },
    { type: 'hospitality', areaM2: hospitality },
    { type: 'educational', areaM2: educational },
    { type: 'healthcare', areaM2: healthcare },
    { type: 'industrial', areaM2: industrial },
    { type: 'institutional', areaM2: institutional },
  ];
  const expandedPrograms = allPrograms.filter(p => p.areaM2 > 0);

  // --- Building calculations ---
  const buildingResults: BuildingResult[] = expandedPrograms.map(({ type, areaM2 }) => {
    const { assumption, usedFallback, fallbackZone } = getEuiAssumptionWithFallback(
      climate.climateZone,
      type,
    );

    if (usedFallback && fallbackZone) {
      assumptionsNotes.push(
        `No EUI data for ${type} in zone ${climate.climateZone}. Using ${fallbackZone} (Cfa) fallback.`,
      );
    }

    const euiKwhPerM2Year = assumption.defaultEuiKwhPerM2Year;
    const annualEnergyKwh = areaM2 * euiKwhPerM2Year;
    const emissionsTCO2e = (annualEnergyKwh * gridFactorKgCO2ePerKwh) / 1000;

    return {
      programType: type,
      areaM2,
      euiKwhPerM2Year,
      annualEnergyKwh,
      emissionsTCO2e,
      euiConfidence: assumption.confidence,
    };
  });

  const buildingEmissionsTCO2e = buildingResults.reduce((sum, r) => sum + r.emissionsTCO2e, 0);

  // --- Program area validation ---
  const totalProgramAreaM2 =
    residential + office + retail + hospitality + educational + healthcare + industrial + institutional;
  const differenceM2 = totalProgramAreaM2 - input.totalBuiltAreaM2;
  let programAreaStatus: 'match' | 'under' | 'over';
  if (Math.abs(differenceM2) < 1) {
    programAreaStatus = 'match';
  } else if (differenceM2 < 0) {
    programAreaStatus = 'under';
    assumptionsNotes.push(
      `Building program covers ${totalProgramAreaM2.toLocaleString()} m² of ${input.totalBuiltAreaM2.toLocaleString()} m² declared. Unassigned ${Math.abs(differenceM2).toLocaleString()} m² excluded from building emissions.`,
    );
  } else {
    programAreaStatus = 'over';
  }

  // --- Mobility scoring ---
  const mobilityScoring = calculateMobilityScore(
    input.mobilityQuestionnaire,
    density,
    input.geographicContext,
    input.projectType,
  );

  const profile = MOBILITY_PROFILES[mobilityScoring.assignedProfile];
  const annualTripsTotal = input.totalPopulation * profile.tripsPerPersonPerDay * 365;

  const mobilityResults: MobilityModeResult[] = TRANSPORT_MODES.map(mode => {
    const modeShare = profile.modeSplit[mode];
    const tripsPerYear = annualTripsTotal * modeShare;
    const averageTripLengthKm = profile.averageTripLengthKmByMode[mode];
    const annualDistanceKm = tripsPerYear * averageTripLengthKm;
    const emissionFactorKgCO2ePerPassengerKm = profile.emissionFactorKgCO2ePerPassengerKm[mode];
    const emissionsTCO2e = (annualDistanceKm * emissionFactorKgCO2ePerPassengerKm) / 1000;

    return { mode, modeShare, tripsPerYear, averageTripLengthKm, annualDistanceKm, emissionFactorKgCO2ePerPassengerKm, emissionsTCO2e };
  });

  const mobilityEmissionsTCO2e = mobilityResults.reduce((sum, r) => sum + r.emissionsTCO2e, 0);

  // --- Infrastructure ---
  const infrastructureEmissionsTCO2e = (buildingEmissionsTCO2e * input.infrastructureAllowancePercent) / 100;

  // --- Totals ---
  const totalEmissionsTCO2e = buildingEmissionsTCO2e + mobilityEmissionsTCO2e + infrastructureEmissionsTCO2e;
  const ghgPerCapitaTCO2e = input.totalPopulation > 0 ? totalEmissionsTCO2e / input.totalPopulation : 0;

  const safeTotal = totalEmissionsTCO2e > 0 ? totalEmissionsTCO2e : 1;
  const contributionPercentages = {
    buildings: (buildingEmissionsTCO2e / safeTotal) * 100,
    mobility: (mobilityEmissionsTCO2e / safeTotal) * 100,
    infrastructure: (infrastructureEmissionsTCO2e / safeTotal) * 100,
  };

  return {
    projectName: input.projectName,
    location,
    climate,
    grid,
    density,
    mobilityScoring,
    assignedMobilityProfile: mobilityScoring.assignedProfile,
    buildingResults,
    mobilityResults,
    buildingEmissionsTCO2e,
    mobilityEmissionsTCO2e,
    infrastructureEmissionsTCO2e,
    totalEmissionsTCO2e,
    ghgPerCapitaTCO2e,
    contributionPercentages,
    programAreaValidation: {
      totalProgramAreaM2,
      totalBuiltAreaM2: input.totalBuiltAreaM2,
      differenceM2,
      status: programAreaStatus,
    },
    assumptionsNotes,
    warnings,
  };
}
