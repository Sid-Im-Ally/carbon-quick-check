export type ResolvedLocation = {
  input: string;
  city?: string;
  country: string;
  countryCode: string;
  region?: string;
  regionCode?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  confidence: 'high' | 'medium' | 'low';
  source: 'mapbox' | 'google' | 'opencage' | 'fallback';
  formattedAddress?: string;
  warnings?: string[];
};
