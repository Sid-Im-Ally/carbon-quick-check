// Server-side only.
import type { KoppenClimateResult } from '@/types/climate';
import type { ResolvedLocation } from '@/types/location';
import { KOPPEN_FALLBACKS, DEFAULT_KOPPEN_FALLBACK } from '@/data/koppenFallbacks';
import { lookupKoppenFromRaster } from './koppenRasterLookup';
import { getKoppenFromClimateApi } from './koppenClimateApi';
import { normalizeString, normalizeCountryName } from './normalization';

// ─── City-level fallback lookup ───────────────────────────────────────────────

function lookupKoppenFromFallbacks(location: ResolvedLocation): KoppenClimateResult | null {
  const cityNorm = location.city ? normalizeString(location.city) : '';
  const countryNorm = normalizeCountryName(location.country);
  const countryCode = (location.countryCode ?? '').toUpperCase();

  for (const record of KOPPEN_FALLBACKS) {
    const matchCountry =
      normalizeCountryName(record.country) === countryNorm ||
      record.countryCode === countryCode;

    if (!matchCountry) continue;

    const matchCity =
      cityNorm === normalizeString(record.city) ||
      record.aliases.some(alias => cityNorm === normalizeString(alias));

    if (matchCity) {
      return {
        climateZone: record.climateZone,
        climateLabel: record.climateLabel,
        latitude: location.latitude,
        longitude: location.longitude,
        source: 'fallback',
        confidence: 'fallback',
        notes: record.notes,
      };
    }
  }

  // Partial city name match
  if (cityNorm) {
    for (const record of KOPPEN_FALLBACKS) {
      if (normalizeString(record.city).includes(cityNorm) || cityNorm.includes(normalizeString(record.city))) {
        return {
          climateZone: record.climateZone,
          climateLabel: record.climateLabel,
          latitude: location.latitude,
          longitude: location.longitude,
          source: 'fallback',
          confidence: 'fallback',
          notes: `Partial city name match. ${record.notes}`,
        };
      }
    }
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function getKoppenClimateZone(
  latitude: number,
  longitude: number,
  location?: ResolvedLocation,
): Promise<KoppenClimateResult> {
  // 1. Try raster lookup (returns null until implemented)
  const rasterResult = await lookupKoppenFromRaster(latitude, longitude);
  if (rasterResult) {
    return { ...rasterResult, latitude, longitude };
  }

  // 2. NASA POWER API — 30-year climate normals, derives zone algorithmically
  const apiResult = await getKoppenFromClimateApi(latitude, longitude);
  if (apiResult) {
    return { ...apiResult, latitude, longitude };
  }

  // 3. City-level fallback if location is provided
  if (location) {
    const fallbackResult = lookupKoppenFromFallbacks(location);
    if (fallbackResult) return fallbackResult;
  }

  // 4. Last resort: global default fallback
  return {
    climateZone: DEFAULT_KOPPEN_FALLBACK.climateZone,
    climateLabel: DEFAULT_KOPPEN_FALLBACK.climateLabel,
    latitude,
    longitude,
    source: 'fallback',
    confidence: 'fallback',
    notes: DEFAULT_KOPPEN_FALLBACK.notes,
    warnings: DEFAULT_KOPPEN_FALLBACK.warnings,
  };
}
