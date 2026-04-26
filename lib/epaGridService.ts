// Server-side only.
import type { GridEmissionResult } from '@/types/grid';
import type { ResolvedLocation } from '@/types/location';
import { EPA_EGRID_FACTORS, US_NATIONAL_AVERAGE } from '@/data/epaEgridFactors';
import { STATE_TO_EGRID_SUBREGION } from '@/data/egridSubregionMapping';

export async function getUSGridEmissionFactor(location: ResolvedLocation): Promise<GridEmissionResult> {
  const regionCode = location.regionCode?.toUpperCase() ?? '';
  const warnings: string[] = [];

  // 1. Look up state → eGRID subregion
  const subregionMapping = STATE_TO_EGRID_SUBREGION[regionCode];

  if (subregionMapping) {
    if (subregionMapping.note) {
      warnings.push(subregionMapping.note);
    }

    const record = EPA_EGRID_FACTORS.find(
      r => r.egridSubregion === subregionMapping.subregion,
    );

    if (record) {
      warnings.push(
        'State-to-eGRID mapping used. For higher precision, use coordinate-based subregion lookup with EPA eGRID shapefiles.',
      );

      return {
        country: 'United States',
        countryCode: 'US',
        region: location.region,
        regionCode,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        gridFactorKgCO2ePerKwh: record.gridFactorKgCO2ePerKwh,
        gridFactorGCO2ePerKwh: record.gridFactorGCO2ePerKwh,
        year: record.year,
        geographyLevel: 'grid_region',
        emissionsBoundary: 'direct',
        source: 'EPA',
        sourceDetail: `EPA eGRID ${record.egridSubregion} — ${record.subregionName}`,
        sourceUrl: record.sourceUrl,
        confidence: 'high',
        notes: record.notes,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    }
  }

  // 2. Fallback to US national average
  warnings.push(
    `Could not map state "${regionCode}" to an eGRID subregion. Using U.S. national average.`,
  );

  return {
    country: 'United States',
    countryCode: 'US',
    region: location.region,
    regionCode,
    city: location.city,
    latitude: location.latitude,
    longitude: location.longitude,
    gridFactorKgCO2ePerKwh: US_NATIONAL_AVERAGE.gridFactorKgCO2ePerKwh,
    gridFactorGCO2ePerKwh: US_NATIONAL_AVERAGE.gridFactorGCO2ePerKwh,
    year: US_NATIONAL_AVERAGE.year,
    geographyLevel: 'country',
    emissionsBoundary: 'direct',
    source: 'EPA',
    sourceDetail: 'EPA eGRID — U.S. National Average (state mapping unavailable)',
    sourceUrl: US_NATIONAL_AVERAGE.sourceUrl,
    confidence: 'medium',
    notes: US_NATIONAL_AVERAGE.notes,
    warnings,
  };
}
