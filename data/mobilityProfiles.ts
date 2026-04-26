import type { MobilityProfileType, TransportMode } from '@/types/carbon';

export type MobilityProfileData = {
  label: string;
  description: string;
  tripsPerPersonPerDay: number;
  modeSplit: Record<TransportMode, number>;
  averageTripLengthKmByMode: Record<TransportMode, number>;
  emissionFactorKgCO2ePerPassengerKm: Record<TransportMode, number>;
};

// Emission factors shared across profiles (vehicle technology, not behavior)
const EMISSION_FACTORS: Record<TransportMode, number> = {
  car: 0.13,              // kgCO2e/passenger-km — average private petrol/diesel fleet
  transit: 0.05,          // kgCO2e/passenger-km — blended bus + rail system
  walk: 0,
  bike_micromobility: 0,  // kgCO2e/passenger-km — operational zero
  taxi_ridehail: 0.19,    // kgCO2e/passenger-km — higher-intensity car use
  other: 0.08,            // kgCO2e/passenger-km — motorcycle, informal, micro-mobility
};

export const MOBILITY_PROFILES: Record<MobilityProfileType, MobilityProfileData> = {
  auto_oriented: {
    label: 'Auto-Oriented / Suburban',
    description: 'High car dependency, limited transit, minimal active mobility.',
    tripsPerPersonPerDay: 3.4,
    modeSplit: {
      car: 0.90,
      transit: 0.02,
      walk: 0.04,
      bike_micromobility: 0.01,
      taxi_ridehail: 0.02,
      other: 0.01,
    },
    // Per-mode distances calibrated so weighted average ≈ 20 km
    averageTripLengthKmByMode: {
      car: 20,
      transit: 15,
      walk: 1.5,
      bike_micromobility: 3.0,
      taxi_ridehail: 20,
      other: 8,
    },
    emissionFactorKgCO2ePerPassengerKm: EMISSION_FACTORS,
  },

  balanced: {
    label: 'Balanced / Mixed Auto + Transit',
    description: 'Mix of car, transit, and active modes. Transit viable but car still dominant.',
    tripsPerPersonPerDay: 3.0,
    modeSplit: {
      car: 0.65,
      transit: 0.18,
      walk: 0.10,
      bike_micromobility: 0.03,
      taxi_ridehail: 0.03,
      other: 0.01,
    },
    // Per-mode distances calibrated so weighted average = 10 km
    averageTripLengthKmByMode: {
      car: 12,
      transit: 9,
      walk: 1.0,
      bike_micromobility: 2.5,
      taxi_ridehail: 12,
      other: 5,
    },
    emissionFactorKgCO2ePerPassengerKm: EMISSION_FACTORS,
  },

  transit_oriented: {
    label: 'Transit-Oriented / Strong Public Transit + Active Mobility',
    description: 'Strong transit and active mobility culture. Car is a minority mode.',
    tripsPerPersonPerDay: 2.8,
    modeSplit: {
      car: 0.35,
      transit: 0.35,
      walk: 0.20,
      bike_micromobility: 0.05,
      taxi_ridehail: 0.04,
      other: 0.01,
    },
    // Per-mode distances calibrated so weighted average = 7 km
    averageTripLengthKmByMode: {
      car: 10,
      transit: 8,
      walk: 0.8,
      bike_micromobility: 2.0,
      taxi_ridehail: 10,
      other: 4,
    },
    emissionFactorKgCO2ePerPassengerKm: EMISSION_FACTORS,
  },
};

export const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  car: 'Private Car',
  transit: 'Public Transit',
  walk: 'Walking',
  bike_micromobility: 'Cycling / Micromobility',
  taxi_ridehail: 'Taxi / Ridehail',
  other: 'Other',
};
