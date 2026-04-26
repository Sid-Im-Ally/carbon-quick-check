// EPA eGRID 2022 subregion total output emission rates.
// Source: EPA Greenhouse Gas Equivalencies Calculator (eGRID2022)
// https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references
// Values converted from lb CO₂/MWh → kg CO₂e/kWh (× 0.453592 / 1000).

export type EpaEgridRecord = {
  egridSubregion: string;
  subregionName: string;
  gridFactorKgCO2ePerKwh: number;
  gridFactorGCO2ePerKwh: number;
  year: number;
  source: string;
  sourceUrl: string;
  emissionsBoundary: 'direct';
  confidence: 'high';
  notes?: string;
};

const SOURCE_URL = 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references';

function record(
  egridSubregion: string,
  subregionName: string,
  lbCo2PerMwh: number,
  notes?: string,
): EpaEgridRecord {
  const kg = parseFloat((lbCo2PerMwh * 0.453592 / 1000).toFixed(4));
  const gco2 = parseFloat((kg * 1000).toFixed(1));
  return {
    egridSubregion,
    subregionName,
    gridFactorKgCO2ePerKwh: kg,
    gridFactorGCO2ePerKwh: gco2,
    year: 2022,
    source: 'EPA eGRID2022',
    sourceUrl: SOURCE_URL,
    emissionsBoundary: 'direct',
    confidence: 'high',
    notes,
  };
}

export const EPA_EGRID_FACTORS: EpaEgridRecord[] = [
  // ── Northeast ─────────────────────────────────────────────────────────────
  record('NEWE', 'New England',                       536.4),
  record('NYCW', 'New York City / Westchester',       885.2),
  record('NYUP', 'New York Upstate',                  274.6),
  record('NYLI', 'New York Long Island',             1200.7),

  // ── Mid-Atlantic & Great Lakes ────────────────────────────────────────────
  record('RFCE', 'RFC East (Mid-Atlantic)',            657.4),
  record('RFCM', 'RFC Michigan',                     1216.4),
  record('RFCW', 'RFC West (Great Lakes / Ohio)',    1000.1),

  // ── Southeast ─────────────────────────────────────────────────────────────
  record('SRVC', 'SERC Virginia / Carolinas',         623.0),
  record('SRSO', 'SERC South',                        893.3),
  record('SRTV', 'SERC Tennessee Valley',             933.1),
  record('SRMV', 'SERC Mississippi Valley',           801.0),
  record('SRMW', 'SERC Midwest',                     1369.9),
  record('FRCC', 'Florida',                           813.8),

  // ── Texas ─────────────────────────────────────────────────────────────────
  record('ERCT', 'ERCOT (Texas)',                     771.1),

  // ── Midwest ───────────────────────────────────────────────────────────────
  record('MROE', 'MRO East',                         1479.6),
  record('MROW', 'MRO West (Upper Midwest)',           936.5),

  // ── South-Central ─────────────────────────────────────────────────────────
  record('SPNO', 'SPP North',                         952.6),
  record('SPSO', 'SPP South',                         970.4),

  // ── West ──────────────────────────────────────────────────────────────────
  record('NWPP', 'WECC Northwest (Pacific NW)',        602.1),
  record('CAMX', 'WECC California',                   497.4),
  record('AZNM', 'WECC Southwest (AZ/NM)',             776.0),
  record('RMPA', 'WECC Rockies (Colorado)',           1124.9),

  // ── Alaska ────────────────────────────────────────────────────────────────
  record('AKGD', 'Alaska Railbelt',                  1052.1),
  record('AKMS', 'Alaska Miscellaneous',               495.8),

  // ── Hawaii ────────────────────────────────────────────────────────────────
  record('HIOA', 'Hawaii Oahu',                      1575.4),
  record('HIMS', 'Hawaii Maui / Other Islands',      1155.5),

  // ── Territories ───────────────────────────────────────────────────────────
  record('PRMS', 'Puerto Rico',                      1593.5),
];

// US national weighted average (eGRID2022)
export const US_NATIONAL_AVERAGE: EpaEgridRecord = record(
  'US',
  'United States National Average',
  823.1,
  'U.S. national weighted average. Used when state-to-subregion mapping is unavailable.',
);
