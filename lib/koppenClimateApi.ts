// Server-side only.
// Derives Köppen-Geiger zone from NASA POWER 30-year monthly climate normals.
// Free, no API key, worldwide coverage.

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] as const;

const ZONE_LABELS: Record<string, string> = {
  Af: 'Tropical Rainforest',
  Am: 'Tropical Monsoon',
  Aw: 'Tropical Savanna',
  BWh: 'Hot Desert',
  BWk: 'Cold Desert',
  BSh: 'Hot Semi-Arid / Steppe',
  BSk: 'Cold Semi-Arid / Steppe',
  Csa: 'Hot-Summer Mediterranean',
  Csb: 'Warm-Summer Mediterranean',
  Csc: 'Cold-Summer Mediterranean',
  Cwa: 'Monsoon-Influenced Humid Subtropical',
  Cwb: 'Subtropical Highland (Monsoon)',
  Cwc: 'Cold Highland (Monsoon)',
  Cfa: 'Humid Subtropical',
  Cfb: 'Oceanic / Marine West Coast',
  Cfc: 'Subpolar Oceanic',
  Dsa: 'Hot-Summer Mediterranean Continental',
  Dsb: 'Warm-Summer Mediterranean Continental',
  Dsc: 'Cold-Summer Mediterranean Continental',
  Dsd: 'Very Cold Mediterranean Continental',
  Dwa: 'Monsoon Continental (hot summer)',
  Dwb: 'Monsoon Continental (warm summer)',
  Dwc: 'Subarctic (Monsoon)',
  Dwd: 'Subarctic (very cold, Monsoon)',
  Dfa: 'Humid Continental (hot summer)',
  Dfb: 'Humid Continental (warm summer)',
  Dfc: 'Subarctic',
  Dfd: 'Subarctic (very cold)',
  ET: 'Tundra',
  EF: 'Ice Cap',
};

// Official Beck/Köppen classification from 12 monthly temp (°C) + precip (mm/day) values
function classifyKoppen(T: number[], P: number[], lat: number): { zone: string; label: string } {
  // NASA POWER returns precip in mm/day — convert to monthly totals
  const daysPerMonth = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const Pmm = P.map((p, i) => p * daysPerMonth[i]);

  const Tann = T.reduce((a, b) => a + b, 0) / 12;
  const Pann = Pmm.reduce((a, b) => a + b, 0);
  const Tcold = Math.min(...T);
  const Thot = Math.max(...T);

  // Hemisphere: southern if lat < 0
  const isSouthern = lat < 0;
  const summerIdx = isSouthern ? [9, 10, 11, 0, 1, 2] : [3, 4, 5, 6, 7, 8];
  const winterIdx = isSouthern ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 0, 1, 2];

  const Psummer = summerIdx.reduce((s, i) => s + Pmm[i], 0);
  const Pwinter = winterIdx.reduce((s, i) => s + Pmm[i], 0);

  // Aridity threshold
  let Pthreshold: number;
  if (Pann > 0 && Psummer / Pann >= 0.7) {
    Pthreshold = 2 * Tann;
  } else if (Pann > 0 && Pwinter / Pann >= 0.7) {
    Pthreshold = 2 * Tann + 28;
  } else {
    Pthreshold = 2 * Tann + 14;
  }

  const Tmon10 = T.filter(t => t > 10).length;

  // ── E: Polar ─────────────────────────────────────────────────────────────
  if (Thot < 10) {
    const zone = Thot < 0 ? 'EF' : 'ET';
    return { zone, label: ZONE_LABELS[zone] };
  }

  // ── B: Arid ──────────────────────────────────────────────────────────────
  if (Pann < 10 * Pthreshold) {
    const hot = Tann >= 18;
    const zone = Pann < 5 * Pthreshold
      ? (hot ? 'BWh' : 'BWk')
      : (hot ? 'BSh' : 'BSk');
    return { zone, label: ZONE_LABELS[zone] };
  }

  // ── A: Tropical ──────────────────────────────────────────────────────────
  if (Tcold >= 18) {
    const Pmin = Math.min(...Pmm);
    let zone: string;
    if (Pmin >= 60) {
      zone = 'Af';
    } else if (Pann >= 25 * (100 - Pmin)) {
      zone = 'Am';
    } else {
      zone = 'Aw';
    }
    return { zone, label: ZONE_LABELS[zone] };
  }

  // ── C / D: Temperate / Continental ───────────────────────────────────────
  const isC = Tcold >= -3;
  const main = isC ? 'C' : 'D';

  const PminSummer = Math.min(...summerIdx.map(i => Pmm[i]));
  const PmaxSummer = Math.max(...summerIdx.map(i => Pmm[i]));
  const PminWinter = Math.min(...winterIdx.map(i => Pmm[i]));
  const PmaxWinter = Math.max(...winterIdx.map(i => Pmm[i]));

  let precType: string;
  if (PminSummer < 40 && PminSummer < PmaxWinter / 3) {
    precType = 's';
  } else if (PminWinter < PmaxSummer / 10) {
    precType = 'w';
  } else {
    precType = 'f';
  }

  let tempType: string;
  if (Thot >= 22) {
    tempType = 'a';
  } else if (Tmon10 >= 4) {
    tempType = 'b';
  } else if (!isC && Tcold < -38) {
    tempType = 'd';
  } else {
    tempType = 'c';
  }

  const zone = `${main}${precType}${tempType}`;
  return { zone, label: ZONE_LABELS[zone] ?? zone };
}

export async function getKoppenFromClimateApi(
  latitude: number,
  longitude: number,
): Promise<{ climateZone: string; climateLabel: string; source: 'nasa_power'; confidence: 'high' } | null> {
  try {
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR&community=AG&longitude=${longitude}&latitude=${latitude}&format=JSON`;
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } }); // cache 30 days
    if (!res.ok) return null;

    const data = await res.json();
    const params = data?.properties?.parameter;
    if (!params?.T2M || !params?.PRECTOTCORR) return null;

    const T = MONTHS.map(m => params.T2M[m] as number);
    const P = MONTHS.map(m => params.PRECTOTCORR[m] as number);

    // -999 is NASA's fill value for missing/ocean data
    if (T.some(v => v <= -900) || P.some(v => v <= -900)) return null;

    const { zone, label } = classifyKoppen(T, P, latitude);

    return {
      climateZone: zone,
      climateLabel: label,
      source: 'nasa_power',
      confidence: 'high',
    };
  } catch {
    return null;
  }
}
