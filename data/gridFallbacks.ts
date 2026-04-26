// Country-level grid emission fallbacks.
// Used when EPA eGRID (US) and Electricity Maps (international) are unavailable.
// TODO: Replace with validated data from Our World in Data / Ember / IEA.
// Source candidates: https://ourworldindata.org/grapher/carbon-intensity-electricity
//                   https://ember-energy.org/data/
//                   https://www.iea.org/data-and-statistics

export type GridFallbackRecord = {
  country: string;
  countryCode: string;
  gridFactorKgCO2ePerKwh: number;
  gridFactorGCO2ePerKwh: number;
  renewableSharePercent?: number;
  year: number;
  geographyLevel: 'country';
  emissionsBoundary: 'unknown';
  source: string;
  confidence: 'fallback';
  notes: string;
};

export const GRID_FALLBACKS: GridFallbackRecord[] = [
  {
    country: 'United States', countryCode: 'US',
    gridFactorKgCO2ePerKwh: 0.386, gridFactorGCO2ePerKwh: 386,
    renewableSharePercent: 22, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'US national average fallback. Replace with EPA eGRID subregion factor.',
  },
  {
    country: 'United Arab Emirates', countryCode: 'AE',
    gridFactorKgCO2ePerKwh: 0.400, gridFactorGCO2ePerKwh: 400,
    renewableSharePercent: 7, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with Electricity Maps or IEA UAE factor.',
  },
  {
    country: 'Saudi Arabia', countryCode: 'SA',
    gridFactorKgCO2ePerKwh: 0.720, gridFactorGCO2ePerKwh: 720,
    renewableSharePercent: 1, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with IEA or SEC Saudi Arabia factor.',
  },
  {
    country: 'Qatar', countryCode: 'QA',
    gridFactorKgCO2ePerKwh: 0.510, gridFactorGCO2ePerKwh: 510,
    renewableSharePercent: 1, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with IEA or KAHRAMAA Qatar factor.',
  },
  {
    country: 'Oman', countryCode: 'OM',
    gridFactorKgCO2ePerKwh: 0.580, gridFactorGCO2ePerKwh: 580,
    renewableSharePercent: 4, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with IEA or regional Oman factor.',
  },
  {
    country: 'India', countryCode: 'IN',
    gridFactorKgCO2ePerKwh: 0.716, gridFactorGCO2ePerKwh: 716,
    renewableSharePercent: 20, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with CEA India or Electricity Maps India factor.',
  },
  {
    country: 'China', countryCode: 'CN',
    gridFactorKgCO2ePerKwh: 0.559, gridFactorGCO2ePerKwh: 559,
    renewableSharePercent: 28, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with Electricity Maps China factor.',
  },
  {
    country: 'Vietnam', countryCode: 'VN',
    gridFactorKgCO2ePerKwh: 0.610, gridFactorGCO2ePerKwh: 610,
    renewableSharePercent: 12, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with EVN Vietnam or Electricity Maps factor.',
  },
  {
    country: 'Singapore', countryCode: 'SG',
    gridFactorKgCO2ePerKwh: 0.408, gridFactorGCO2ePerKwh: 408,
    renewableSharePercent: 4, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with EMA Singapore factor.',
  },
  {
    country: 'Canada', countryCode: 'CA',
    gridFactorKgCO2ePerKwh: 0.130, gridFactorGCO2ePerKwh: 130,
    renewableSharePercent: 68, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'National average. TODO: Replace with provincial factors (BC, ON, AB vary significantly).',
  },
  {
    country: 'Australia', countryCode: 'AU',
    gridFactorKgCO2ePerKwh: 0.500, gridFactorGCO2ePerKwh: 500,
    renewableSharePercent: 28, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with AEMO / Clean Energy Regulator NEM factor.',
  },
  {
    country: 'Chile', countryCode: 'CL',
    gridFactorKgCO2ePerKwh: 0.300, gridFactorGCO2ePerKwh: 300,
    renewableSharePercent: 32, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with CNE Chile or Electricity Maps factor.',
  },
  {
    country: 'Mexico', countryCode: 'MX',
    gridFactorKgCO2ePerKwh: 0.458, gridFactorGCO2ePerKwh: 458,
    renewableSharePercent: 24, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with SENER Mexico or Electricity Maps factor.',
  },
  {
    country: 'Brazil', countryCode: 'BR',
    gridFactorKgCO2ePerKwh: 0.100, gridFactorGCO2ePerKwh: 100,
    renewableSharePercent: 80, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with ANEEL Brazil or Electricity Maps factor.',
  },
  {
    country: 'United Kingdom', countryCode: 'GB',
    gridFactorKgCO2ePerKwh: 0.233, gridFactorGCO2ePerKwh: 233,
    renewableSharePercent: 42, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with DESNZ / National Grid ESO factor.',
  },
  {
    country: 'Germany', countryCode: 'DE',
    gridFactorKgCO2ePerKwh: 0.350, gridFactorGCO2ePerKwh: 350,
    renewableSharePercent: 52, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with Umweltbundesamt or Electricity Maps factor.',
  },
  {
    country: 'Netherlands', countryCode: 'NL',
    gridFactorKgCO2ePerKwh: 0.290, gridFactorGCO2ePerKwh: 290,
    renewableSharePercent: 38, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with CBS Netherlands or Electricity Maps factor.',
  },
  {
    country: 'Sweden', countryCode: 'SE',
    gridFactorKgCO2ePerKwh: 0.045, gridFactorGCO2ePerKwh: 45,
    renewableSharePercent: 90, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with Energimyndigheten factor.',
  },
  {
    country: 'Kenya', countryCode: 'KE',
    gridFactorKgCO2ePerKwh: 0.170, gridFactorGCO2ePerKwh: 170,
    renewableSharePercent: 75, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with KETRACO / EPRA factor.',
  },
  {
    country: 'South Africa', countryCode: 'ZA',
    gridFactorKgCO2ePerKwh: 0.928, gridFactorGCO2ePerKwh: 928,
    renewableSharePercent: 8, year: 2022,
    geographyLevel: 'country', emissionsBoundary: 'unknown',
    source: 'Fallback placeholder',
    confidence: 'fallback',
    notes: 'TODO: Replace with NERSA / Eskom factor.',
  },
];

// Global fallback when country is not in the list
export const GLOBAL_GRID_FALLBACK = {
  gridFactorKgCO2ePerKwh: 0.400,
  gridFactorGCO2ePerKwh: 400,
  year: 2022,
  geographyLevel: 'fallback' as const,
  emissionsBoundary: 'unknown' as const,
  source: 'Global average placeholder',
  confidence: 'fallback' as const,
  notes: 'No country-specific grid data available. Using global placeholder average. Replace with country-specific factor.',
};
