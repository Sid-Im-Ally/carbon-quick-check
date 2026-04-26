// Server-side only.
import type { GridEmissionResult } from '@/types/grid';

const BASE_URL = 'https://api.ember-energy.org/v1/carbon-intensity/yearly';

// ISO 3166-1 alpha-2 → alpha-3 mapping for countries relevant to master planning
const ALPHA2_TO_ALPHA3: Record<string, string> = {
  AF: 'AFG', AL: 'ALB', DZ: 'DZA', AO: 'AGO', AR: 'ARG', AM: 'ARM', AU: 'AUS',
  AT: 'AUT', AZ: 'AZE', BH: 'BHR', BD: 'BGD', BY: 'BLR', BE: 'BEL', BJ: 'BEN',
  BO: 'BOL', BA: 'BIH', BW: 'BWA', BR: 'BRA', BG: 'BGR', BF: 'BFA', KH: 'KHM',
  CM: 'CMR', CA: 'CAN', CL: 'CHL', CN: 'CHN', CO: 'COL', CD: 'COD', CR: 'CRI',
  HR: 'HRV', CY: 'CYP', CZ: 'CZE', DK: 'DNK', EC: 'ECU', EG: 'EGY', SV: 'SLV',
  ET: 'ETH', FI: 'FIN', FR: 'FRA', GA: 'GAB', GE: 'GEO', DE: 'DEU', GH: 'GHA',
  GR: 'GRC', GT: 'GTM', HN: 'HND', HK: 'HKG', HU: 'HUN', IS: 'ISL', IN: 'IND',
  ID: 'IDN', IR: 'IRN', IQ: 'IRQ', IE: 'IRL', IL: 'ISR', IT: 'ITA', CI: 'CIV',
  JM: 'JAM', JP: 'JPN', JO: 'JOR', KZ: 'KAZ', KE: 'KEN', KW: 'KWT', KG: 'KGZ',
  LB: 'LBN', LY: 'LBY', LT: 'LTU', LU: 'LUX', MK: 'MKD', MG: 'MDG', MW: 'MWI',
  MY: 'MYS', ML: 'MLI', MR: 'MRT', MX: 'MEX', MD: 'MDA', MN: 'MNG', MA: 'MAR',
  MZ: 'MOZ', MM: 'MMR', NA: 'NAM', NP: 'NPL', NL: 'NLD', NZ: 'NZL', NI: 'NIC',
  NE: 'NER', NG: 'NGA', NO: 'NOR', OM: 'OMN', PK: 'PAK', PA: 'PAN', PY: 'PRY',
  PE: 'PER', PH: 'PHL', PL: 'POL', PT: 'PRT', QA: 'QAT', RO: 'ROU', RU: 'RUS',
  RW: 'RWA', SA: 'SAU', SG: 'SGP', SN: 'SEN', RS: 'SRB', SL: 'SLE', SK: 'SVK', SI: 'SVN',
  SO: 'SOM', ZA: 'ZAF', KR: 'KOR', SS: 'SSD', ES: 'ESP', LK: 'LKA', SD: 'SDN',
  SE: 'SWE', CH: 'CHE', SY: 'SYR', TW: 'TWN', TJ: 'TJK', TZ: 'TZA', TH: 'THA',
  TG: 'TGO', TN: 'TUN', TR: 'TUR', TM: 'TKM', UG: 'UGA', UA: 'UKR', AE: 'ARE',
  GB: 'GBR', US: 'USA', UY: 'URY', UZ: 'UZB', VE: 'VEN', VN: 'VNM', YE: 'YEM',
  ZM: 'ZMB', ZW: 'ZWE',
};

type EmberResponse = {
  data: Array<{
    entity_code: string;
    entity: string;
    date: string;
    emissions_intensity_gco2_per_kwh: number;
  }>;
};

export async function getEmberGridEmissionFactor(
  location: { country: string; countryCode: string; latitude: number; longitude: number; region?: string; regionCode?: string; city?: string },
): Promise<GridEmissionResult | null> {
  const key = process.env.ELECTRICITY_MAPS_API_KEY;
  if (!key) return null;

  const alpha3 = ALPHA2_TO_ALPHA3[location.countryCode.toUpperCase()];
  if (!alpha3) return null;

  try {
    // Try latest year first, fall back to previous year
    for (const year of [2023, 2022, 2021]) {
      const url = `${BASE_URL}?entity_code=${alpha3}&start_date=${year}&end_date=${year}&api_key=${key}`;
      const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } }); // cache 30 days
      if (!res.ok) continue;

      const data: EmberResponse = await res.json();
      const record = data.data?.[0];
      if (!record) continue;

      const gco2 = record.emissions_intensity_gco2_per_kwh;
      const kgco2 = gco2 / 1000;

      return {
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        regionCode: location.regionCode,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        gridFactorKgCO2ePerKwh: kgco2,
        gridFactorGCO2ePerKwh: gco2,
        year,
        geographyLevel: 'country',
        emissionsBoundary: 'lifecycle',
        source: 'ElectricityMaps',
        sourceDetail: `Ember Climate — ${record.entity} annual average (${year})`,
        sourceUrl: 'https://ember-energy.org',
        confidence: 'high',
      };
    }

    return null;
  } catch {
    return null;
  }
}
