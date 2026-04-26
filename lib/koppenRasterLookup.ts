// TODO: Implement a real Köppen-Geiger raster lookup using the published
// Beck et al. (2018) or Kottek et al. (2006) global climate classification dataset.
//
// Recommended approach for production:
//   1. Download Köppen-Geiger GeoTIFF raster from:
//      https://www.gloh2o.org/koppen/ (Beck et al. 2023)
//   2. Store as a compressed raster in /public or process server-side
//   3. Use a geospatial library (e.g. geotiff.js, GDAL, or a Python sidecar)
//      to query the raster at (lat, lon) and return the climate class integer
//   4. Map the integer to the zone code using the Beck et al. classification table
//
// For now, this module returns null, triggering the fallback logic.

export type RasterLookupResult = {
  climateZone: string;
  climateLabel: string;
  source: 'koppen_geiger_raster';
  confidence: 'high';
} | null;

// Köppen-Geiger integer class to zone code mapping (Beck et al. 2023)
// Reference: https://www.gloh2o.org/koppen/
export const KOPPEN_CLASS_MAP: Record<number, { zone: string; label: string }> = {
  1:  { zone: 'Af',  label: 'Tropical Rainforest' },
  2:  { zone: 'Am',  label: 'Tropical Monsoon' },
  3:  { zone: 'Aw',  label: 'Tropical Savanna' },
  4:  { zone: 'BWh', label: 'Hot Desert' },
  5:  { zone: 'BWk', label: 'Cold Desert' },
  6:  { zone: 'BSh', label: 'Hot Semi-Arid / Steppe' },
  7:  { zone: 'BSk', label: 'Cold Semi-Arid / Steppe' },
  8:  { zone: 'Csa', label: 'Hot-Summer Mediterranean' },
  9:  { zone: 'Csb', label: 'Warm-Summer Mediterranean' },
  10: { zone: 'Csc', label: 'Cold-Summer Mediterranean' },
  11: { zone: 'Cwa', label: 'Monsoon-Influenced Humid Subtropical' },
  12: { zone: 'Cwb', label: 'Subtropical Highland (Monsoon)' },
  13: { zone: 'Cwc', label: 'Cold Highland (Monsoon)' },
  14: { zone: 'Cfa', label: 'Humid Subtropical' },
  15: { zone: 'Cfb', label: 'Oceanic / Marine West Coast' },
  16: { zone: 'Cfc', label: 'Subpolar Oceanic' },
  17: { zone: 'Dsa', label: 'Hot-Summer Mediterranean Continental' },
  18: { zone: 'Dsb', label: 'Warm-Summer Mediterranean Continental' },
  19: { zone: 'Dsc', label: 'Cold-Summer Mediterranean Continental' },
  20: { zone: 'Dsd', label: 'Very Cold Mediterranean Continental' },
  21: { zone: 'Dwa', label: 'Monsoon Continental (hot summer)' },
  22: { zone: 'Dwb', label: 'Monsoon Continental (warm summer)' },
  23: { zone: 'Dwc', label: 'Subarctic (Monsoon)' },
  24: { zone: 'Dwd', label: 'Subarctic (very cold, Monsoon)' },
  25: { zone: 'Dfa', label: 'Humid Continental (hot summer)' },
  26: { zone: 'Dfb', label: 'Humid Continental (warm summer)' },
  27: { zone: 'Dfc', label: 'Subarctic' },
  28: { zone: 'Dfd', label: 'Subarctic (very cold)' },
  29: { zone: 'ET',  label: 'Tundra' },
  30: { zone: 'EF',  label: 'Ice Cap' },
};

/**
 * TODO: Implement this function to query a local Köppen-Geiger raster file.
 * Currently returns null, which causes the calling service to use city-level fallbacks.
 */
export async function lookupKoppenFromRaster(
  latitude: number,
  longitude: number,
): Promise<RasterLookupResult> {
  // TODO: Implement raster lookup.
  // Example pseudocode:
  //   const classInt = await queryGeoTIFF('/data/koppen_geiger_beck2023.tif', latitude, longitude);
  //   const zone = KOPPEN_CLASS_MAP[classInt];
  //   if (zone) return { climateZone: zone.zone, climateLabel: zone.label, source: 'koppen_geiger_raster', confidence: 'high' };

  void latitude; // suppress unused warning until implemented
  void longitude;
  return null;
}
