import type { ResolvedLocation } from './location';
import type { KoppenClimateResult } from './climate';
import type { GridEmissionResult } from './grid';
import type { MobilityProfileData, MobilityProfileType, MobilityScoringResult } from './mobility';

export type ResolvedAssumptions = {
  location: ResolvedLocation;
  climate: KoppenClimateResult;
  grid: GridEmissionResult;
  mobilityProfile: MobilityProfileData;
  mobilityProfileType: MobilityProfileType;
  mobilityScoring: MobilityScoringResult;
  infrastructureAllowancePercent: number;
  assumptionWarnings: string[];
};
