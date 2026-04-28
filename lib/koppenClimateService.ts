// Server-side only.
import type { KoppenClimateResult } from '@/types/climate';
import { lookupKoppenFromRaster } from './koppenRasterLookup';
import { getKoppenFromClimateApi } from './koppenClimateApi';

export async function getKoppenClimateZone(
  latitude: number,
  longitude: number,
): Promise<KoppenClimateResult | null> {
  const rasterResult = await lookupKoppenFromRaster(latitude, longitude);
  if (rasterResult) return { ...rasterResult, latitude, longitude };

  const apiResult = await getKoppenFromClimateApi(latitude, longitude);
  if (apiResult) return { ...apiResult, latitude, longitude };

  return null;
}
