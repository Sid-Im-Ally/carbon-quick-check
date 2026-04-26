// Server-side only.
import type { GridEmissionResult } from '@/types/grid';
import type { ResolvedLocation } from '@/types/location';
import { getUSGridEmissionFactor } from './epaGridService';
import { getEmberGridEmissionFactor } from './emberGridService';
import { GRID_FALLBACKS, GLOBAL_GRID_FALLBACK } from '@/data/gridFallbacks';
import { normalizeCountryName } from './normalization';

function getCountryFallback(
  location: ResolvedLocation,
  warningMessage: string,
): GridEmissionResult {
  const countryNorm = normalizeCountryName(location.country);
  const countryCode = location.countryCode.toUpperCase();

  const record =
    GRID_FALLBACKS.find(r => r.countryCode === countryCode) ??
    GRID_FALLBACKS.find(r => normalizeCountryName(r.country) === countryNorm);

  if (record) {
    return {
      country: location.country,
      countryCode: location.countryCode,
      region: location.region,
      regionCode: location.regionCode,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
      gridFactorKgCO2ePerKwh: record.gridFactorKgCO2ePerKwh,
      gridFactorGCO2ePerKwh: record.gridFactorGCO2ePerKwh,
      year: record.year,
      geographyLevel: 'country',
      emissionsBoundary: 'unknown',
      source: 'Fallback',
      sourceDetail: `Country-level fallback — ${record.country}`,
      confidence: 'fallback',
      notes: record.notes,
      warnings: [warningMessage],
    };
  }

  return {
    country: location.country,
    countryCode: location.countryCode,
    region: location.region,
    regionCode: location.regionCode,
    city: location.city,
    latitude: location.latitude,
    longitude: location.longitude,
    gridFactorKgCO2ePerKwh: GLOBAL_GRID_FALLBACK.gridFactorKgCO2ePerKwh,
    gridFactorGCO2ePerKwh: GLOBAL_GRID_FALLBACK.gridFactorGCO2ePerKwh,
    year: GLOBAL_GRID_FALLBACK.year,
    geographyLevel: 'fallback',
    emissionsBoundary: 'unknown',
    source: 'Fallback',
    sourceDetail: 'Global average fallback — no country-specific data available',
    confidence: 'fallback',
    notes: GLOBAL_GRID_FALLBACK.notes,
    warnings: [warningMessage],
  };
}

export async function getGridEmissionFactor(
  location: ResolvedLocation,
): Promise<GridEmissionResult> {
  const countryCode = location.countryCode.toUpperCase();

  // US: EPA eGRID (state-level subregion)
  if (countryCode === 'US') {
    return getUSGridEmissionFactor(location);
  }

  // International: Ember Climate annual average
  const emberResult = await getEmberGridEmissionFactor(location);
  if (emberResult) return emberResult;

  // Fallback: static country-level data
  return getCountryFallback(
    location,
    'Ember Climate API unavailable. Using country-level fallback grid factor.',
  );
}
