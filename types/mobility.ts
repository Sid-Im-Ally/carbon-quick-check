export type MobilityProfileType = 'auto_oriented' | 'balanced' | 'transit_oriented';

export type TransportMode =
  | 'car'
  | 'transit'
  | 'walk'
  | 'bike_micromobility'
  | 'taxi_ridehail'
  | 'other';

export type MobilityQuestionnaireInput = {
  parkingProvisionScore: 0 | 1 | 2 | 3;
  transitAccessScore: 0 | 1 | 2 | 3;
  mobilityCultureScore: 0 | 1 | 2 | 3;
  catchmentTypeScore: 0 | 1 | 2 | 3;
  expectedArrivalModeScore: 0 | 1 | 2 | 3;
};

export type MobilityScoringResult = {
  parkingWeightedScore: number;
  transitWeightedScore: number;
  mobilityCultureScore: number;
  catchmentScore: number;
  arrivalModeScore: number;
  densityModifier: number;
  geographicContextModifier: number;
  projectTypeModifier: number;
  finalScore: number;
  assignedProfile: MobilityProfileType;
};

export type MobilityProfileData = {
  label: string;
  description: string;
  tripsPerPersonPerDay: number;
  modeSplit: Record<TransportMode, number>;
  averageTripLengthKmByMode: Record<TransportMode, number>;
  emissionFactorKgCO2ePerPassengerKm: Record<TransportMode, number>;
};

export type MobilityModeResult = {
  mode: TransportMode;
  modeShare: number;
  tripsPerYear: number;
  averageTripLengthKm: number;
  annualDistanceKm: number;
  emissionFactorKgCO2ePerPassengerKm: number;
  emissionsTCO2e: number;
};
