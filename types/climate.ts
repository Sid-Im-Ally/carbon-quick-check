export type KoppenClimateResult = {
  climateZone: string;
  climateLabel: string;
  latitude: number;
  longitude: number;
  source: 'koppen_geiger_raster' | 'koppen_api' | 'nasa_power' | 'fallback';
  confidence: 'high' | 'medium' | 'low' | 'fallback';
  notes?: string;
  warnings?: string[];
};
