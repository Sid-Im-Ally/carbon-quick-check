'use client';

import { useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f6f3ec',
  card: '#ffffff',
  border: 'rgba(31,38,34,0.07)',
  borderMd: 'rgba(31,38,34,0.11)',
  sage: '#5a7a5a',
  sageLt: '#eef4ee',
  sageMid: '#3a6b3a',
  orange: '#e8954a',
  orangeLt: '#fdf3ea',
  gold: '#c9a961',
  goldLt: '#fbf3df',
  dark: '#1e3128',
  mid: '#3d4a44',
  muted: '#6b7670',
  faint: '#9aada4',
  strip: '#f6f3ec',
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: C.faint, margin: 0, marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 24px', ...style }}>
      {children}
    </div>
  );
}

function Pill({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, background: bg, color, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5 }}>
      {children}
    </span>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f8f7f3', border: `1px solid ${C.borderMd}`, borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: C.dark, lineHeight: 1.8, marginTop: 8 }}>
      {children}
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{ padding: '7px 10px', textAlign: right ? 'right' : 'left', color: C.faint, fontWeight: 700, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', borderBottom: `1px solid ${C.borderMd}`, whiteSpace: 'nowrap' }}>
      {children}
    </th>
  );
}

function Td({ children, right, mono, bold, muted }: { children: React.ReactNode; right?: boolean; mono?: boolean; bold?: boolean; muted?: boolean }) {
  return (
    <td style={{ padding: '6px 10px', textAlign: right ? 'right' : 'left', color: muted ? C.muted : C.dark, fontWeight: bold ? 700 : 400, fontVariantNumeric: mono ? 'tabular-nums' : undefined, fontSize: 11.5, borderBottom: `1px solid rgba(31,38,34,0.04)` }}>
      {children}
    </td>
  );
}

function Tr({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <tr style={{ background: highlight ? C.strip : 'transparent' }}>
      {children}
    </tr>
  );
}

// ─── EUI table data ───────────────────────────────────────────────────────────

const EUI_ZONES = [
  { zone: 'Af',  label: 'Tropical Rainforest',        examples: 'Singapore, KL',         res_sf: 93,  res_mf: 120, office: 121, retail: 171, hotel: 153, edu: 74,  health: 220, ind: 83,  inst: 68  },
  { zone: 'Am',  label: 'Tropical Monsoon',            examples: 'Mumbai, Ho Chi Minh',   res_sf: 100, res_mf: 127, office: 119, retail: 168, hotel: 150, edu: 73,  health: 208, ind: 78,  inst: 66  },
  { zone: 'Aw',  label: 'Tropical Savanna',            examples: 'Bangkok, Manila',       res_sf: 90,  res_mf: 122, office: 121, retail: 181, hotel: 153, edu: 76,  health: 212, ind: 84,  inst: 68  },
  { zone: 'BWh', label: 'Hot Desert',                  examples: 'Dubai, Riyadh',         res_sf: 92,  res_mf: 116, office: 110, retail: 163, hotel: 151, edu: 56,  health: 207, ind: 77,  inst: 69  },
  { zone: 'BWk', label: 'Cold Desert',                 examples: 'Tehran, Salt Lake City', res_sf: 99, res_mf: 175, office: 100, retail: 166, hotel: 216, edu: 93,  health: 253, ind: 108, inst: 91  },
  { zone: 'BSh', label: 'Hot Semi-Arid',               examples: 'Salalah, Karachi',      res_sf: 93,  res_mf: 117, office: 111, retail: 145, hotel: 148, edu: 69,  health: 198, ind: 72,  inst: 48  },
  { zone: 'BSk', label: 'Cold Semi-Arid',              examples: 'Denver, Madrid',        res_sf: 100, res_mf: 177, office: 115, retail: 156, hotel: 231, edu: 82,  health: 241, ind: 91,  inst: 78  },
  { zone: 'Cfa', label: 'Humid Subtropical',examples: 'New York, Atlanta',     res_sf: 83,  res_mf: 105, office: 96,  retail: 124, hotel: 152, edu: 64,  health: 191, ind: 72,  inst: 61, fallback: true },
  { zone: 'Cfb', label: 'Oceanic',                     examples: 'London, Seattle',       res_sf: 96,  res_mf: 118, office: 95,  retail: 115, hotel: 188, edu: 68,  health: 201, ind: 74,  inst: 69  },
  { zone: 'Csa', label: 'Hot Mediterranean',           examples: 'Athens, Los Angeles',   res_sf: 85,  res_mf: 111, office: 100, retail: 121, hotel: 155, edu: 63,  health: 160, ind: 68,  inst: 62  },
  { zone: 'Csb', label: 'Warm Mediterranean',          examples: 'Santiago, San Francisco',res_sf: 82, res_mf: 120, office: 92,  retail: 100, hotel: 165, edu: 61,  health: 171, ind: 67,  inst: 60  },
  { zone: 'Cwa', label: 'Humid Sub. Monsoon',          examples: 'Delhi, Lahore',         res_sf: 115, res_mf: 95,  office: 180, retail: 220, hotel: 245, edu: 145, health: 430, ind: 145, inst: 150 },
  { zone: 'Cwb', label: 'Subtropical Highland',        examples: 'Mexico City, Bogotá',   res_sf: 95,  res_mf: 78,  office: 145, retail: 175, hotel: 185, edu: 115, health: 355, ind: 125, inst: 130 },
  { zone: 'Dfa', label: 'Hot Summer Continental',      examples: 'Chicago, Beijing',      res_sf: 120, res_mf: 190, office: 134, retail: 204, hotel: 294, edu: 105, health: 289, ind: 111, inst: 104 },
  { zone: 'Dfb', label: 'Warm Summer Continental',     examples: 'Toronto, Berlin',       res_sf: 121, res_mf: 201, office: 136, retail: 189, hotel: 271, edu: 120, health: 901, ind: 108, inst: 120, flag: 'health' },
  { zone: 'Dfc', label: 'Subarctic',                   examples: 'Helsinki, Anchorage',   res_sf: 144, res_mf: 249, office: 125, retail: 201, hotel: 347, edu: 103, health: 328, ind: 109, inst: 115 },
];

const GRID_DATA = [
  { country: 'United States',     code: 'US', factor: 0.386, renew: 22 },
  { country: 'Canada',            code: 'CA', factor: 0.130, renew: 68 },
  { country: 'United Kingdom',    code: 'GB', factor: 0.233, renew: 42 },
  { country: 'Germany',           code: 'DE', factor: 0.350, renew: 52 },
  { country: 'Netherlands',       code: 'NL', factor: 0.290, renew: 38 },
  { country: 'Sweden',            code: 'SE', factor: 0.045, renew: 90 },
  { country: 'United Arab Emirates', code: 'AE', factor: 0.400, renew: 7 },
  { country: 'Saudi Arabia',      code: 'SA', factor: 0.720, renew: 1 },
  { country: 'Qatar',             code: 'QA', factor: 0.510, renew: 1 },
  { country: 'Oman',              code: 'OM', factor: 0.580, renew: 4 },
  { country: 'India',             code: 'IN', factor: 0.716, renew: 20 },
  { country: 'China',             code: 'CN', factor: 0.559, renew: 28 },
  { country: 'Singapore',         code: 'SG', factor: 0.408, renew: 4 },
  { country: 'Vietnam',           code: 'VN', factor: 0.610, renew: 12 },
  { country: 'Australia',         code: 'AU', factor: 0.500, renew: 28 },
  { country: 'Brazil',            code: 'BR', factor: 0.100, renew: 80 },
  { country: 'Chile',             code: 'CL', factor: 0.300, renew: 32 },
  { country: 'Mexico',            code: 'MX', factor: 0.458, renew: 24 },
  { country: 'Kenya',             code: 'KE', factor: 0.170, renew: 75 },
  { country: 'South Africa',      code: 'ZA', factor: 0.928, renew: 8 },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AssumptionsPage() {
  const [euiOpen, setEuiOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [euiUnit, setEuiUnit] = useState<'kwh' | 'kbtu'>('kwh');

  // 1 kWh/m²/yr = 0.316998 kBtu/ft²/yr
  const KWH_TO_KBTU = 0.316998;
  function fmtEui(val: number) {
    return euiUnit === 'kbtu' ? Math.round(val * KWH_TO_KBTU) : val;
  }

  return (
    <div style={{ padding: '24px 32px 40px', overflowY: 'auto', height: '100%', background: C.bg }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: 0, marginBottom: 4, letterSpacing: 0.3 }}>Methodology & Assumptions</h1>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7, maxWidth: 680 }}>
          This page documents all formulas, data tables, emission factors, and assumptions used to calculate operational carbon estimates. All values are early-stage planning proxies — intended for comparative analysis and rapid feasibility screening, not certified carbon accounting.
        </p>
      </div>

      {/* ── 1. Scope & Boundaries ───────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="1 · Scope & Boundaries" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: C.sage, marginBottom: 12, textTransform: 'uppercase' }}>Included in this calculation</div>
            {[
              ['Buildings', 'Annual operational energy use × grid emission factor'],
              ['Mobility', 'Person-trips × mode split × trip length × emission factor'],
              ['Infrastructure', 'Shared systems as % of building emissions (proxy)'],
            ].map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{t}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#b45309', marginBottom: 12, textTransform: 'uppercase' }}>Not included</div>
            {[
              ['Embodied carbon', 'Construction materials, upfront carbon'],
              ['Waste & water', 'Operational waste and water treatment emissions'],
              ['Land use change', 'Carbon sequestration or release from land conversion'],
              ['Upstream supply chain', 'Scope 3 indirect emissions beyond mobility'],
            ].map(([t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706', flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{t}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── 2. Core Formulas ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="2 · Core Formulas" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.sage }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.sage, letterSpacing: 0.5 }}>BUILDINGS</span>
            </div>
            <FormulaBox>
              E_bldg =<br />
              {'  '}Σ (Area_i × EUI_i × GF)<br />
              {'  '}÷ 1000
            </FormulaBox>
            <div style={{ marginTop: 12, fontSize: 11, color: C.muted, lineHeight: 1.8 }}>
              <div><strong style={{ color: C.dark }}>E_bldg</strong> — building emissions (tCO₂e/yr)</div>
              <div><strong style={{ color: C.dark }}>Area_i</strong> — gross floor area per program (m²)</div>
              <div><strong style={{ color: C.dark }}>EUI_i</strong> — energy use intensity (kWh/m²/yr)</div>
              <div><strong style={{ color: C.dark }}>GF</strong> — grid emission factor (kgCO₂e/kWh)</div>
              <div><strong style={{ color: C.dark }}>÷ 1000</strong> — convert kg → tonnes</div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.orange }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.orange, letterSpacing: 0.5 }}>MOBILITY</span>
            </div>
            <FormulaBox>
              Trips = Pop × T/p/d × 365<br /><br />
              E_mob =<br />
              {'  '}Σ (Trips × Share_m<br />
              {'    '}× Len_m × EF_m)<br />
              {'  '}÷ 1000
            </FormulaBox>
            <div style={{ marginTop: 12, fontSize: 11, color: C.muted, lineHeight: 1.8 }}>
              <div><strong style={{ color: C.dark }}>T/p/d</strong> — trips per person per day</div>
              <div><strong style={{ color: C.dark }}>Share_m</strong> — mode split fraction (0–1)</div>
              <div><strong style={{ color: C.dark }}>Len_m</strong> — avg trip length per mode (km)</div>
              <div><strong style={{ color: C.dark }}>EF_m</strong> — emission factor (kgCO₂e/pass-km)</div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9a7a2a', letterSpacing: 0.5 }}>INFRASTRUCTURE</span>
            </div>
            <FormulaBox>
              E_infra =<br />
              {'  '}E_bldg × (Pct ÷ 100)<br /><br />
              E_total =<br />
              {'  '}E_bldg + E_mob<br />
              {'  '}+ E_infra<br /><br />
              GHG/cap = E_total ÷ Pop
            </FormulaBox>
            <div style={{ marginTop: 12, fontSize: 11, color: C.muted, lineHeight: 1.8 }}>
              <div><strong style={{ color: C.dark }}>Pct</strong> — infrastructure allowance % (5–20)</div>
              <div><strong style={{ color: C.dark }}>Pop</strong> — total project population</div>
              <div><strong style={{ color: C.dark }}>GHG/cap</strong> — per capita emissions (tCO₂e/person/yr)</div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 3. Building EUI Table ────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader
          title="3 · Building Energy Use Intensity (EUI)"
          subtitle={`Default EUI values in ${euiUnit === 'kwh' ? 'kWh/m²/yr' : 'kBtu/ft²/yr'} by Köppen climate zone and program type. Low = default × 0.80; High = default × 1.25.`}
        />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {/* Toggle header */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: euiOpen ? `1px solid ${C.border}` : 'none' }}
          >
            <span
              onClick={() => setEuiOpen(o => !o)}
              style={{ fontSize: 12.5, fontWeight: 600, color: C.dark, cursor: 'pointer', flex: 1 }}
            >
              16 Climate Zones × 9 Program Types — {euiOpen ? 'Hide' : 'Show'} Full Table
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Unit toggle */}
              <div style={{ display: 'flex', background: C.strip, borderRadius: 6, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                {(['kwh', 'kbtu'] as const).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={e => { e.stopPropagation(); setEuiUnit(u); }}
                    style={{ padding: '4px 10px', fontSize: 10.5, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: euiUnit === u ? C.sage : 'transparent', color: euiUnit === u ? '#fff' : C.muted, transition: 'all .15s' }}
                  >
                    {u === 'kwh' ? 'kWh/m²' : 'kBtu/ft²'}
                  </button>
                ))}
              </div>
              <span onClick={() => setEuiOpen(o => !o)} style={{ fontSize: 11, color: C.sage, fontWeight: 600, cursor: 'pointer' }}>{euiOpen ? '▲ Collapse' : '▼ Expand'}</span>
            </div>
          </div>

          {euiOpen && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: C.strip }}>
                    <Th>Zone</Th>
                    <Th>Classification</Th>
                    <Th>Examples</Th>
                    <Th right>Res SF</Th>
                    <Th right>Res MF</Th>
                    <Th right>Office</Th>
                    <Th right>Retail</Th>
                    <Th right>Hotel</Th>
                    <Th right>Edu</Th>
                    <Th right>Health</Th>
                    <Th right>Ind.</Th>
                    <Th right>Inst.</Th>
                  </tr>
                </thead>
                <tbody>
                  {EUI_ZONES.map((z, i) => (
                    <Tr key={z.zone} highlight={z.fallback || i % 2 === 0}>
                      <Td>
                        <code style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: C.sage }}>{z.zone}</code>
                      </Td>
                      <Td muted>{z.label}</Td>
                      <Td muted>{z.examples}</Td>
                      <Td right mono>{fmtEui(z.res_sf)}</Td>
                      <Td right mono>{fmtEui(z.res_mf)}</Td>
                      <Td right mono>{fmtEui(z.office)}</Td>
                      <Td right mono>{fmtEui(z.retail)}</Td>
                      <Td right mono>{fmtEui(z.hotel)}</Td>
                      <Td right mono>{fmtEui(z.edu)}</Td>
                      <Td right mono>
                        <span style={{ color: z.flag === 'health' ? '#dc2626' : 'inherit' }}>
                          {fmtEui(z.health)}{z.flag === 'health' ? ' ⚠' : ''}
                        </span>
                      </Td>
                      <Td right mono>{fmtEui(z.ind)}</Td>
                      <Td right mono>{fmtEui(z.inst)}</Td>
                    </Tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 20px', borderTop: `1px solid ${C.border}`, fontSize: 10.5, color: C.faint }}>
                ⚠ Dfb Healthcare ({fmtEui(901)} {euiUnit === 'kwh' ? 'kWh/m²/yr' : 'kBtu/ft²/yr'}) appears anomalous vs adjacent zones (Dfa: {fmtEui(289)}, Dfc: {fmtEui(328)}). Verify before use. · All values are medium-confidence benchmarks.
              </div>
            </div>
          )}

          {!euiOpen && (
            <div style={{ padding: '10px 20px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EUI_ZONES.map(z => (
                <code key={z.zone} style={{ fontSize: 10.5, background: z.fallback ? C.sageLt : C.strip, color: z.fallback ? C.sageMid : C.muted, padding: '2px 6px', borderRadius: 4, border: `1px solid ${C.border}` }}>
                  {z.zone}
                </code>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── 4. Grid Emission Factors ─────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader
          title="4 · Grid Emission Factors"
          subtitle="Country-level fallback values used when EPA eGRID (US subregion) or live API data is unavailable. Source: placeholder benchmarks — see notes for official data sources."
        />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div
            onClick={() => setGridOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: gridOpen ? `1px solid ${C.border}` : 'none' }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.dark }}>20 Countries — {gridOpen ? 'Hide' : 'Show'} Table</span>
            <span style={{ fontSize: 11, color: C.sage, fontWeight: 600 }}>{gridOpen ? '▲ Collapse' : '▼ Expand'}</span>
          </div>
          {gridOpen && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.strip }}>
                    <Th>Country</Th>
                    <Th>ISO</Th>
                    <Th right>kgCO₂e/kWh</Th>
                    <Th right>gCO₂e/kWh</Th>
                    <Th right>Renew. Share</Th>
                    <Th right>Ref. Year</Th>
                  </tr>
                </thead>
                <tbody>
                  {[...GRID_DATA].sort((a, b) => a.factor - b.factor).map((r, i) => (
                    <Tr key={r.code} highlight={i % 2 === 0}>
                      <Td bold>{r.country}</Td>
                      <Td muted><code style={{ fontFamily: 'monospace', fontSize: 10.5 }}>{r.code}</code></Td>
                      <Td right mono bold>
                        <span style={{ color: r.factor > 0.6 ? '#dc2626' : r.factor < 0.2 ? C.sage : C.dark }}>
                          {r.factor.toFixed(3)}
                        </span>
                      </Td>
                      <Td right mono muted>{(r.factor * 1000).toFixed(0)}</Td>
                      <Td right mono>
                        <span style={{ color: r.renew >= 50 ? C.sage : r.renew >= 25 ? '#b45309' : '#dc2626' }}>
                          {r.renew}%
                        </span>
                      </Td>
                      <Td right muted>2022</Td>
                    </Tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 20px', borderTop: `1px solid ${C.border}`, fontSize: 10.5, color: C.faint }}>
                Grid factor color coding: <span style={{ color: '#dc2626' }}>red {'>'} 0.600</span> · <span style={{ color: C.dark }}>grey 0.200–0.600</span> · <span style={{ color: C.sage }}>green {'<'} 0.200</span> · Global fallback: 0.400 kgCO₂e/kWh
              </div>
            </div>
          )}
          {!gridOpen && (
            <div style={{ padding: '8px 20px 14px', display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 11, color: C.muted }}>
              <span>Range: <strong style={{ color: C.sage }}>0.045</strong> (SE) → <strong style={{ color: '#dc2626' }}>0.928</strong> (ZA)</span>
              <span>Global fallback: <strong style={{ color: C.dark }}>0.400 kgCO₂e/kWh</strong></span>
              <span>Confidence: <strong>country-level placeholder</strong></span>
            </div>
          )}
        </Card>
      </div>

      {/* ── 5. Mobility Profiles ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader
          title="5 · Mobility Profiles"
          subtitle="Three discrete transport demand profiles assigned based on the mobility scoring system. Mode splits and trip lengths are calibrated planning-level proxies."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            {
              key: 'auto_oriented', label: 'Auto-Oriented / Suburban', color: '#dc2626', bg: '#fef2f2',
              desc: 'High car dependency, limited transit, minimal active mobility.',
              trips: 3,
              split: [['Car', '90%'], ['Transit', '2%'], ['Walk', '4%'], ['Bike', '1%'], ['Taxi', '2%'], ['Other', '1%']],
              lengths: [['Car', '20 km'], ['Transit', '15 km'], ['Walk', '1.5 km'], ['Bike', '3.0 km'], ['Taxi', '20 km'], ['Other', '8 km']],
            },
            {
              key: 'balanced', label: 'Balanced / Mixed', color: '#1a6b8a', bg: '#e8f4fb',
              desc: 'Mix of car, transit, and active modes. Car still dominant.',
              trips: 3,
              split: [['Car', '65%'], ['Transit', '18%'], ['Walk', '10%'], ['Bike', '3%'], ['Taxi', '3%'], ['Other', '1%']],
              lengths: [['Car', '12 km'], ['Transit', '9 km'], ['Walk', '1.0 km'], ['Bike', '2.5 km'], ['Taxi', '12 km'], ['Other', '5 km']],
            },
            {
              key: 'transit_oriented', label: 'Transit-Oriented', color: C.sageMid, bg: C.sageLt,
              desc: 'Strong transit and active mobility. Car is a minority mode.',
              trips: 3,
              split: [['Car', '35%'], ['Transit', '35%'], ['Walk', '20%'], ['Bike', '5%'], ['Taxi', '4%'], ['Other', '1%']],
              lengths: [['Car', '10 km'], ['Transit', '8 km'], ['Walk', '0.8 km'], ['Bike', '2.0 km'], ['Taxi', '10 km'], ['Other', '4 km']],
            },
          ].map(p => (
            <Card key={p.key} style={{ padding: '16px 18px' }}>
              <div style={{ marginBottom: 10 }}>
                <Pill color={p.color} bg={p.bg}>{p.label}</Pill>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{p.desc}</div>
                <div style={{ fontSize: 11, marginTop: 6 }}>
                  <span style={{ color: C.faint }}>Trips/person/day: </span>
                  <strong style={{ color: C.dark }}>{p.trips}</strong>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 0', marginTop: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: 0.5, textTransform: 'uppercase', paddingBottom: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>Mode Split</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: 0.5, textTransform: 'uppercase', paddingBottom: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 4, paddingLeft: 8 }}>Trip Length</div>
                {p.split.map(([mode, share], idx) => (
                  <>
                    <div key={`s-${mode}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 11 }}>
                      <span style={{ color: C.muted }}>{mode}</span>
                      <strong style={{ color: C.dark }}>{share}</strong>
                    </div>
                    <div key={`l-${mode}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 11, paddingLeft: 8 }}>
                      <span style={{ color: C.muted }}>{mode}</span>
                      <strong style={{ color: C.dark }}>{p.lengths[idx][1]}</strong>
                    </div>
                  </>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Emission factors table */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.dark, marginBottom: 12 }}>Transport Emission Factors <span style={{ color: C.faint, fontWeight: 400 }}>(kgCO₂e per passenger-km — shared across all profiles)</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {[
              { mode: 'Car', ef: '0.130', note: 'Petrol/diesel fleet avg' },
              { mode: 'Transit', ef: '0.050', note: 'Blended bus + rail' },
              { mode: 'Walking', ef: '0.000', note: 'Zero operational' },
              { mode: 'Bike / Micro', ef: '0.000', note: 'Zero operational' },
              { mode: 'Taxi / Ridehail', ef: '0.190', note: 'Higher intensity car' },
              { mode: 'Other', ef: '0.080', note: 'Motorcycle, informal' },
            ].map(r => (
              <div key={r.mode} style={{ background: C.strip, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 4, fontWeight: 600 }}>{r.mode}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: parseFloat(r.ef) === 0 ? C.sage : parseFloat(r.ef) > 0.15 ? C.orange : C.dark, fontVariantNumeric: 'tabular-nums' }}>{r.ef}</div>
                <div style={{ fontSize: 10, color: C.faint, marginTop: 3 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 6. Infrastructure Allowance ──────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader
          title="6 · Infrastructure Allowance"
          subtitle="A simple percentage uplift on building emissions representing shared operational loads: street lighting, pumping stations, common systems, public realm. This is not embodied carbon."
        />
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { pct: 5,  label: 'Low-impact',          note: 'Minimal shared infrastructure, high building efficiency' },
              { pct: 10, label: 'Typical (default)',    note: 'Standard master plan with conventional shared systems' },
              { pct: 15, label: 'Higher-complexity',    note: 'Significant public realm, dense utilities, cooling networks' },
              { pct: 20, label: 'Significant infra.',   note: 'Major district infrastructure, district cooling/heating' },
            ].map(o => (
              <div key={o.pct} style={{ background: o.pct === 10 ? C.sageLt : C.strip, borderRadius: 8, padding: '12px 14px', border: `1px solid ${o.pct === 10 ? '#d6e3d6' : C.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: o.pct === 10 ? C.sageMid : C.dark, fontVariantNumeric: 'tabular-nums' }}>{o.pct}%</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: o.pct === 10 ? C.sageMid : C.mid, marginTop: 2 }}>{o.label}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{o.note}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', background: C.goldLt, borderRadius: 8, border: `1px solid rgba(201,169,97,0.25)`, fontSize: 11, color: '#7a5f20', lineHeight: 1.6 }}>
            <strong>Note:</strong> The infrastructure allowance is applied as E_infra = E_bldg × (Pct ÷ 100). It scales with building energy, not independently. Projects with very low building emissions will also show low infrastructure emissions. Replace with project-specific infrastructure energy modeling for detailed assessments.
          </div>
        </Card>
      </div>

      {/* ── 7. Units & Metrics Reference ────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="7 · Units & Metrics Reference" />
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            {[
              { unit: 'tCO₂e/yr', def: 'Tonnes of CO₂ equivalent per year — primary emissions unit' },
              { unit: 'tCO₂e/person/yr', def: 'Per capita emissions intensity — key benchmark metric' },
              { unit: 'kgCO₂e/kWh', def: 'Grid emission intensity — energy-to-emissions conversion' },
              { unit: 'gCO₂e/kWh', def: 'Same as above × 1000 — used in some reporting standards' },
              { unit: 'kWh/m²/yr', def: 'Energy Use Intensity (EUI) — building energy benchmark' },
              { unit: 'kWh/yr', def: 'Annual building energy use' },
              { unit: 'ppl/ha', def: 'Population density per hectare — mobility scoring input' },
              { unit: 'kgCO₂e/pass-km', def: 'Passenger transport emission factor per kilometre travelled' },
              { unit: 'm²', def: 'Square metres — gross floor area (GFA) per program type' },
              { unit: 'ha', def: 'Hectares — site area unit (1 ha = 10,000 m²)' },
              { unit: 'ac', def: 'Acres — alternative site area unit (1 ac ≈ 0.405 ha)' },
              { unit: 'pass-km', def: 'Passenger-kilometres — trips × trip length per person' },
            ].map(r => (
              <div key={r.unit} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: `1px solid rgba(31,38,34,0.05)` }}>
                <code style={{ fontFamily: 'monospace', fontSize: 11, color: C.sage, fontWeight: 700, whiteSpace: 'nowrap', paddingTop: 1, minWidth: 140 }}>{r.unit}</code>
                <span style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>{r.def}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 8. Data Sources & Limitations ───────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <SectionHeader title="8 · Data Sources & Limitations" />
        <Card style={{ background: C.strip, border: `1px solid ${C.borderMd}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
            {[
              { label: 'Building EUI', status: 'autodetected', note: 'Regional benchmarking averages. Should be replaced with country/project-specific measured data or ASHRAE/ISO standards.' },
              { label: 'Grid Factors', status: 'autodetected', note: 'Country-level fallbacks only. US: EPA eGRID subregion data used when available. International: replace with Electricity Maps or IEA factors.' },
              { label: 'Mobility Profiles', status: 'proxy', note: 'Calibrated planning-level proxies. Trip rates and lengths based on urban mobility literature, not measured project data.' },
              { label: 'Infrastructure Allowance', status: 'proxy', note: 'Simplified % of building emissions. Should be replaced with project-specific infrastructure energy modeling.' },
              { label: 'Climate Zones', status: 'lookup', note: 'Köppen classification via city lookup table. Unrecognized cities fall back to Cfa (Humid Subtropical) with a warning.' },
              { label: 'GHG Scope', status: 'scope2', note: 'Building emissions use location-based Scope 2 (market-based grid factor). Mobility uses vehicle operational factors only (Scope 1 for owned fleet perspective).' },
            ].map(r => (
              <div key={r.label} style={{ padding: '8px 0', borderBottom: `1px solid rgba(31,38,34,0.05)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{r.label}</span>
                  <Pill
                    color={r.status === 'autodetected' ? '#3a6b3a' : r.status === 'proxy' ? '#1a6b8a' : r.status === 'scope2' ? C.sageMid : C.muted}
                    bg={r.status === 'autodetected' ? '#eef4ee' : r.status === 'proxy' ? '#e8f4fb' : r.status === 'scope2' ? C.sageLt : C.strip}
                  >
                    {r.status}
                  </Pill>
                </div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{r.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.dark }}>Appropriate use:</strong> Carbon Quick Check is designed for early-stage feasibility and comparative scenario analysis — not for certified GHG reporting, regulatory compliance, or investment-grade carbon accounting. Results should be cross-validated against detailed energy modeling (e.g. EnergyPlus, IES-VE) before design decisions are finalized.
          </div>
        </Card>
      </div>
    </div>
  );
}
