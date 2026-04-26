import type { BuildingEuiAssumption } from '@/types/carbon';

const SOURCE = 'Regional energy benchmarking averages by Köppen climate zone and program type.';

function eui(
  climateZone: string,
  programType: BuildingEuiAssumption['programType'],
  def: number,
  notes?: string,
): BuildingEuiAssumption {
  return {
    climateZone,
    programType,
    defaultEuiKwhPerM2Year: def,
    lowEuiKwhPerM2Year: Math.round(def * 0.80),
    highEuiKwhPerM2Year: Math.round(def * 1.25),
    sourceMethod: SOURCE,
    confidence: 'medium',
    notes,
  };
}

export const BUILDING_EUI_ASSUMPTIONS: BuildingEuiAssumption[] = [
  // ── Af — Tropical Rainforest: Singapore, Kuala Lumpur ─────────────────────
  eui('Af', 'residential_single_family',  93),
  eui('Af', 'residential_multifamily',   120),
  eui('Af', 'office',                    121),
  eui('Af', 'retail',                    171),
  eui('Af', 'hospitality',               153),
  eui('Af', 'educational',                74),
  eui('Af', 'healthcare',                220),
  eui('Af', 'industrial',                 83),
  eui('Af', 'institutional',              68),

  // ── Am — Tropical Monsoon: Mumbai, Ho Chi Minh City ───────────────────────
  eui('Am', 'residential_single_family', 100),
  eui('Am', 'residential_multifamily',   127),
  eui('Am', 'office',                    119),
  eui('Am', 'retail',                    168),
  eui('Am', 'hospitality',               150),
  eui('Am', 'educational',                73),
  eui('Am', 'healthcare',                208),
  eui('Am', 'industrial',                 78),
  eui('Am', 'institutional',              66),

  // ── Aw — Tropical Savanna: Bangkok, Manila, Nairobi ───────────────────────
  eui('Aw', 'residential_single_family',  90),
  eui('Aw', 'residential_multifamily',   122),
  eui('Aw', 'office',                    121),
  eui('Aw', 'retail',                    181),
  eui('Aw', 'hospitality',               153),
  eui('Aw', 'educational',                76),
  eui('Aw', 'healthcare',                212),
  eui('Aw', 'industrial',                 84),
  eui('Aw', 'institutional',              68),

  // ── BWh — Hot Desert: Dubai, Riyadh, Phoenix ──────────────────────────────
  eui('BWh', 'residential_single_family',  92),
  eui('BWh', 'residential_multifamily',   116),
  eui('BWh', 'office',                    110),
  eui('BWh', 'retail',                    163),
  eui('BWh', 'hospitality',               151),
  eui('BWh', 'educational',                56),
  eui('BWh', 'healthcare',                207),
  eui('BWh', 'industrial',                 77),
  eui('BWh', 'institutional',              69),

  // ── BWk — Cold Desert: Tehran, Almaty, Salt Lake City ─────────────────────
  eui('BWk', 'residential_single_family',  99),
  eui('BWk', 'residential_multifamily',   175),
  eui('BWk', 'office',                    100),
  eui('BWk', 'retail',                    166),
  eui('BWk', 'hospitality',               216),
  eui('BWk', 'educational',                93),
  eui('BWk', 'healthcare',                253),
  eui('BWk', 'industrial',                108),
  eui('BWk', 'institutional',              91),

  // ── BSh — Hot Semi-Arid: Salalah, Karachi, Jaipur ────────────────────────
  eui('BSh', 'residential_single_family',  93),
  eui('BSh', 'residential_multifamily',   117),
  eui('BSh', 'office',                    111),
  eui('BSh', 'retail',                    145),
  eui('BSh', 'hospitality',               148),
  eui('BSh', 'educational',                69),
  eui('BSh', 'healthcare',                198),
  eui('BSh', 'industrial',                 72),
  eui('BSh', 'institutional',              48),

  // ── BSk — Cold Semi-Arid: Denver, Madrid, Ankara ─────────────────────────
  eui('BSk', 'residential_single_family', 100),
  eui('BSk', 'residential_multifamily',   177),
  eui('BSk', 'office',                    115),
  eui('BSk', 'retail',                    156),
  eui('BSk', 'hospitality',               231),
  eui('BSk', 'educational',                82),
  eui('BSk', 'healthcare',                241),
  eui('BSk', 'industrial',                 91),
  eui('BSk', 'institutional',              78),

  // ── Cfa — Humid Subtropical: New York, Atlanta, Shanghai, Sydney ──────────
  //    Used as global default fallback zone
  eui('Cfa', 'residential_single_family',  83),
  eui('Cfa', 'residential_multifamily',   105),
  eui('Cfa', 'office',                     96),
  eui('Cfa', 'retail',                    124),
  eui('Cfa', 'hospitality',               152),
  eui('Cfa', 'educational',                64),
  eui('Cfa', 'healthcare',                191),
  eui('Cfa', 'industrial',                 72),
  eui('Cfa', 'institutional',              61),

  // ── Cfb — Oceanic: London, Amsterdam, Seattle ─────────────────────────────
  eui('Cfb', 'residential_single_family',  96),
  eui('Cfb', 'residential_multifamily',   118),
  eui('Cfb', 'office',                     95),
  eui('Cfb', 'retail',                    115),
  eui('Cfb', 'hospitality',               188),
  eui('Cfb', 'educational',                68),
  eui('Cfb', 'healthcare',                201),
  eui('Cfb', 'industrial',                 74),
  eui('Cfb', 'institutional',              69),

  // ── Csa — Hot Mediterranean: Athens, Rome, Los Angeles ───────────────────
  eui('Csa', 'residential_single_family',  85),
  eui('Csa', 'residential_multifamily',   111),
  eui('Csa', 'office',                    100),
  eui('Csa', 'retail',                    121),
  eui('Csa', 'hospitality',               155),
  eui('Csa', 'educational',                63),
  eui('Csa', 'healthcare',                160),
  eui('Csa', 'industrial',                 68),
  eui('Csa', 'institutional',              62),

  // ── Csb — Warm Mediterranean: Santiago, San Francisco, Cape Town ──────────
  eui('Csb', 'residential_single_family',  82),
  eui('Csb', 'residential_multifamily',   120),
  eui('Csb', 'office',                     92),
  eui('Csb', 'retail',                    100),
  eui('Csb', 'hospitality',               165),
  eui('Csb', 'educational',                61),
  eui('Csb', 'healthcare',                171),
  eui('Csb', 'industrial',                 67),
  eui('Csb', 'institutional',              60),

  // ── Cwa — Humid Subtropical / Monsoon: Delhi, Lahore, Kolkata ────────────
  eui('Cwa', 'residential_single_family', 115),
  eui('Cwa', 'residential_multifamily',    95),
  eui('Cwa', 'office',                    180),
  eui('Cwa', 'retail',                    220),
  eui('Cwa', 'hospitality',               245),
  eui('Cwa', 'educational',               145),
  eui('Cwa', 'healthcare',                430),
  eui('Cwa', 'industrial',                145),
  eui('Cwa', 'institutional',             150),

  // ── Cwb — Subtropical Highland: Mexico City, Nairobi, Bogotá ─────────────
  eui('Cwb', 'residential_single_family',  95),
  eui('Cwb', 'residential_multifamily',    78),
  eui('Cwb', 'office',                    145),
  eui('Cwb', 'retail',                    175),
  eui('Cwb', 'hospitality',               185),
  eui('Cwb', 'educational',               115),
  eui('Cwb', 'healthcare',                355),
  eui('Cwb', 'industrial',                125),
  eui('Cwb', 'institutional',             130),

  // ── Dfa — Hot Summer Continental: Chicago, St. Louis, Beijing ────────────
  eui('Dfa', 'residential_single_family', 120),
  eui('Dfa', 'residential_multifamily',   190),
  eui('Dfa', 'office',                    134),
  eui('Dfa', 'retail',                    204),
  eui('Dfa', 'hospitality',               294),
  eui('Dfa', 'educational',               105),
  eui('Dfa', 'healthcare',                289),
  eui('Dfa', 'industrial',                111),
  eui('Dfa', 'institutional',             104),

  // ── Dfb — Warm Summer Continental: Toronto, Berlin, Warsaw ───────────────
  eui('Dfb', 'residential_single_family', 121),
  eui('Dfb', 'residential_multifamily',   201),
  eui('Dfb', 'office',                    136),
  eui('Dfb', 'retail',                    189),
  eui('Dfb', 'hospitality',               271),
  eui('Dfb', 'educational',               120),
  eui('Dfb', 'healthcare',                901, 'VERIFY: 901 kWh/m²/yr appears anomalous vs Dfa=289 and Dfc=328. Possible data entry error.'),
  eui('Dfb', 'industrial',                108),
  eui('Dfb', 'institutional',             120),

  // ── Dfc — Subarctic: Helsinki, Anchorage, Novosibirsk ────────────────────
  eui('Dfc', 'residential_single_family', 144),
  eui('Dfc', 'residential_multifamily',   249),
  eui('Dfc', 'office',                    125),
  eui('Dfc', 'retail',                    201),
  eui('Dfc', 'hospitality',               347),
  eui('Dfc', 'educational',               103),
  eui('Dfc', 'healthcare',                328),
  eui('Dfc', 'industrial',                109),
  eui('Dfc', 'institutional',             115),
];

// Lookup helper: get EUI record by climate zone and program type
export function getEuiAssumption(
  climateZone: string,
  programType: BuildingEuiAssumption['programType'],
): BuildingEuiAssumption | null {
  return (
    BUILDING_EUI_ASSUMPTIONS.find(
      r => r.climateZone === climateZone && r.programType === programType,
    ) ?? null
  );
}

// Get EUI with fallback to Cfa if zone not found
export function getEuiAssumptionWithFallback(
  climateZone: string,
  programType: BuildingEuiAssumption['programType'],
): { assumption: BuildingEuiAssumption; usedFallback: boolean; fallbackZone?: string } {
  const direct = getEuiAssumption(climateZone, programType);
  if (direct) return { assumption: direct, usedFallback: false };

  const fallback = getEuiAssumption('Cfa', programType);
  if (fallback) {
    return { assumption: { ...fallback, climateZone }, usedFallback: true, fallbackZone: 'Cfa' };
  }

  // Last resort — should never happen as Cfa covers all program types
  return {
    assumption: {
      climateZone,
      programType,
      defaultEuiKwhPerM2Year: 150,
      sourceMethod: 'Emergency fallback',
      confidence: 'placeholder',
      notes: 'No EUI data found. Using 150 kWh/m²/yr emergency fallback.',
    },
    usedFallback: true,
    fallbackZone: 'emergency',
  };
}
