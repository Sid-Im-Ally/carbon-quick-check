// EPA eGRID subregion mapping by U.S. state/territory code.
// Source: EPA eGRID2022 — https://www.epa.gov/egrid
// Note: Some states span multiple subregions. This uses the dominant subregion.
// For precision, use coordinate-based shapefile lookup.

export const STATE_TO_EGRID_SUBREGION: Record<string, { subregion: string; note?: string }> = {
  // ── New England (NEWE) ────────────────────────────────────────────────────
  MA: { subregion: 'NEWE' },
  CT: { subregion: 'NEWE' },
  RI: { subregion: 'NEWE' },
  NH: { subregion: 'NEWE' },
  VT: { subregion: 'NEWE' },
  ME: { subregion: 'NEWE' },

  // ── New York ──────────────────────────────────────────────────────────────
  NY: { subregion: 'NYUP', note: 'NYC metro uses NYCW; Long Island uses NYLI. Upstate used as state-level default.' },

  // ── Mid-Atlantic / RFC East ───────────────────────────────────────────────
  PA: { subregion: 'RFCE' },
  NJ: { subregion: 'RFCE' },
  DE: { subregion: 'RFCE' },
  MD: { subregion: 'RFCE' },
  DC: { subregion: 'RFCE' },
  VA: { subregion: 'SRVC', note: 'Northern VA in RFCE; majority in SRVC.' },
  NC: { subregion: 'SRVC' },

  // ── RFC Michigan ──────────────────────────────────────────────────────────
  MI: { subregion: 'RFCM' },

  // ── RFC West ──────────────────────────────────────────────────────────────
  OH: { subregion: 'RFCW' },
  IN: { subregion: 'RFCW' },
  WV: { subregion: 'RFCW' },
  KY: { subregion: 'RFCW', note: 'KY partially in SRTV; RFCW used as dominant.' },
  IL: { subregion: 'RFCW', note: 'IL partially in SRMW; RFCW used as dominant.' },

  // ── SERC Virginia / Carolinas ─────────────────────────────────────────────
  SC: { subregion: 'SRVC' },

  // ── SERC Tennessee Valley ─────────────────────────────────────────────────
  TN: { subregion: 'SRTV' },
  AL: { subregion: 'SRTV', note: 'Southern AL partially in SRSO; SRTV used as dominant.' },

  // ── SERC Mississippi Valley ───────────────────────────────────────────────
  MS: { subregion: 'SRMV' },
  LA: { subregion: 'SRMV' },
  AR: { subregion: 'SRMV', note: 'AR partially in SPSO; SRMV used as dominant.' },

  // ── SERC Midwest ──────────────────────────────────────────────────────────
  WI: { subregion: 'SRMW', note: 'WI partially in MROW; SRMW used as dominant.' },

  // ── SERC South ────────────────────────────────────────────────────────────
  GA: { subregion: 'SRSO' },

  // ── Florida ───────────────────────────────────────────────────────────────
  FL: { subregion: 'FRCC' },

  // ── Texas ─────────────────────────────────────────────────────────────────
  TX: { subregion: 'ERCT', note: 'Most of TX in ERCOT; panhandle in SPP. ERCOT used as primary.' },

  // ── MRO West (Upper Midwest) ──────────────────────────────────────────────
  MN: { subregion: 'MROW' },
  IA: { subregion: 'MROW' },
  MO: { subregion: 'MROW', note: 'MO partially in SRMW/SPNO; MROW used as dominant.' },
  ND: { subregion: 'MROW' },
  SD: { subregion: 'MROW' },
  NE: { subregion: 'MROW', note: 'NE partially in SPNO; MROW used as dominant.' },

  // ── MRO East ─────────────────────────────────────────────────────────────
  // (no full states map cleanly to MROE — it covers portions of MN/WI/IA within MISO)

  // ── SPP ───────────────────────────────────────────────────────────────────
  KS: { subregion: 'SPNO' },
  OK: { subregion: 'SPSO' },

  // ── WECC Southwest ────────────────────────────────────────────────────────
  AZ: { subregion: 'AZNM' },
  NM: { subregion: 'AZNM' },

  // ── WECC Rockies ─────────────────────────────────────────────────────────
  CO: { subregion: 'RMPA' },
  WY: { subregion: 'RMPA', note: 'WY partially in NWPP; RMPA used as dominant.' },

  // ── WECC Northwest ───────────────────────────────────────────────────────
  WA: { subregion: 'NWPP' },
  OR: { subregion: 'NWPP' },
  ID: { subregion: 'NWPP' },
  MT: { subregion: 'NWPP' },
  UT: { subregion: 'NWPP' },
  NV: { subregion: 'NWPP' },

  // ── WECC California ──────────────────────────────────────────────────────
  CA: { subregion: 'CAMX' },

  // ── Non-contiguous ───────────────────────────────────────────────────────
  AK: { subregion: 'AKGD', note: 'Alaska Railbelt grid. Remote areas use AKMS.' },
  HI: { subregion: 'HIOA', note: 'Oahu grid. Neighbor islands use HIMS.' },
  PR: { subregion: 'PRMS' },
};

export function getStatesForSubregion(subregion: string): string[] {
  return Object.entries(STATE_TO_EGRID_SUBREGION)
    .filter(([, v]) => v.subregion === subregion)
    .map(([k]) => k);
}
