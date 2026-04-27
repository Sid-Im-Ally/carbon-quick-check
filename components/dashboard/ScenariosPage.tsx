'use client';

import type { CalculationResult } from '@/types/carbon';

export type SavedScenario = {
  id: string;
  savedAt: Date;
  result: CalculationResult;
};

const C = {
  bg: '#f6f3ec',
  card: '#ffffff',
  border: 'rgba(31,38,34,0.07)',
  borderMd: 'rgba(31,38,34,0.11)',
  sage: '#5a7a5a',
  sageLt: '#eef4ee',
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

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const PROFILE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  transit_oriented: { label: 'Transit-Oriented', color: '#3a6b3a', bg: '#eef4ee' },
  balanced:         { label: 'Balanced',          color: '#1a6b8a', bg: '#e8f4fb' },
  auto_oriented:    { label: 'Auto-Oriented',     color: '#dc2626', bg: '#fef2f2' },
};

function EmptyState({ onGoToOverview }: { onGoToOverview: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, textAlign: 'center', padding: 40 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.sageLt, border: `1px solid #d6e3d6`, display: 'grid', placeItems: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a7a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: 0, marginBottom: 6 }}>No scenarios saved yet</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7, maxWidth: 280 }}>
          Run a Quick Check and click <strong style={{ color: C.sage }}>Save Scenario</strong> to compare up to 3 results here.
          Scenarios are kept for this session only.
        </p>
      </div>
      <button
        type="button"
        onClick={onGoToOverview}
        style={{ padding: '8px 18px', borderRadius: 7, background: C.sage, color: '#fff', fontSize: 12.5, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Go to Overview
      </button>
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'rgba(31,38,34,0.07)', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: color, borderRadius: 3 }} />
    </div>
  );
}

function ScenarioCard({ scenario, index, onDelete }: { scenario: SavedScenario; index: number; onDelete: () => void }) {
  const { result } = scenario;
  const profile = PROFILE_STYLES[result.assignedMobilityProfile] ?? PROFILE_STYLES.balanced;
  const city = result.location?.city ?? '—';
  const country = result.location?.country ?? '';
  const savedTime = scenario.savedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const pct = result.contributionPercentages;
  const SECTORS = [
    { label: 'Buildings', pct: pct.buildings, color: C.sage },
    { label: 'Mobility',  pct: pct.mobility,  color: C.orange },
    { label: 'Infra',     pct: pct.infrastructure, color: C.gold },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header band */}
      <div style={{ background: C.dark, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>
            Scenario {index + 1}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            {result.projectName || 'Untitled Project'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
            {city}{country ? `, ${country}` : ''} · Saved {savedTime}
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          title="Remove scenario"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', width: 28, height: 28, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: 'inherit', fontSize: 14, lineHeight: 1, transition: 'all .15s' }}
        >
          ×
        </button>
      </div>

      {/* Hero numbers */}
      <div style={{ padding: '18px 18px 14px', display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ paddingRight: 18 }}>
          <div style={{ fontSize: 10, color: C.faint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Total GHG</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.dark, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmt(result.totalEmissionsTCO2e)}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>tCO₂e / year</div>
        </div>
        <div style={{ background: C.border }} />
        <div style={{ paddingLeft: 18 }}>
          <div style={{ fontSize: 10, color: C.faint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>GHG / Capita</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.dark, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{result.ghgPerCapitaTCO2e.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>tCO₂e / person / yr</div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.faint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Emissions Breakdown</div>
        {SECTORS.map(s => (
          <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 36px', gap: 8, alignItems: 'center', marginBottom: 7 }}>
            <span style={{ fontSize: 11, color: C.muted }}>{s.label}</span>
            <MiniBar pct={s.pct} color={s.color} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.dark, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(s.pct)}%</span>
          </div>
        ))}
      </div>

      {/* Footer metadata */}
      <div style={{ padding: '12px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { label: 'Climate', value: result.climate?.climateZone ?? '—' },
          { label: 'Grid', value: `${result.grid?.gridFactorKgCO2ePerKwh?.toFixed(3) ?? '—'} kgCO₂e/kWh` },
          { label: 'Density', value: `${result.density?.densityPeoplePerHa?.toFixed(0) ?? '—'} ppl/ha` },
        ].map(m => (
          <div key={m.label} style={{ background: C.strip, borderRadius: 6, padding: '4px 8px', border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 10, color: C.faint }}>{m.label}: </span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: C.dark }}>{m.value}</span>
          </div>
        ))}
        <div style={{ background: profile.bg, borderRadius: 6, padding: '4px 8px', border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, color: C.faint }}>Profile: </span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: profile.color }}>{profile.label}</span>
        </div>
      </div>
    </div>
  );
}

type Props = {
  scenarios: SavedScenario[];
  onDelete: (id: string) => void;
  onGoToOverview: () => void;
};

export default function ScenariosPage({ scenarios, onDelete, onGoToOverview }: Props) {
  if (scenarios.length === 0) {
    return (
      <div style={{ height: '100%', background: C.bg }}>
        <EmptyState onGoToOverview={onGoToOverview} />
      </div>
    );
  }

  const slots = [0, 1, 2];

  return (
    <div style={{ padding: '24px 32px 40px', overflowY: 'auto', height: '100%', background: C.bg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: 0, marginBottom: 4, letterSpacing: 0.3 }}>Saved Scenarios</h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            {scenarios.length} of 3 slots used · Session only — scenarios reset on page refresh
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToOverview}
          style={{ padding: '7px 14px', borderRadius: 7, background: C.sage, color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ← Back to Overview
        </button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {slots.map(i => {
          const scenario = scenarios[i];
          if (scenario) {
            return (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                index={i}
                onDelete={() => onDelete(scenario.id)}
              />
            );
          }
          return (
            <div
              key={`empty-${i}`}
              onClick={onGoToOverview}
              style={{ border: `1.5px dashed ${C.borderMd}`, borderRadius: 12, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'border-color .15s', color: C.faint }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.strip, border: `1px solid ${C.border}`, display: 'grid', placeItems: 'center' }}>
                <span style={{ fontSize: 20, lineHeight: 1, color: C.faint }}>+</span>
              </div>
              <span style={{ fontSize: 11.5, color: C.faint, fontWeight: 500 }}>Empty slot</span>
            </div>
          );
        })}
      </div>

      {/* Comparison row — only when 2+ scenarios */}
      {scenarios.length >= 2 && (
        <div style={{ marginTop: 24, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, color: C.faint, textTransform: 'uppercase' }}>Side-by-Side Comparison</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.strip }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: 0.6, textTransform: 'uppercase', borderBottom: `1px solid ${C.borderMd}` }}>Metric</th>
                  {scenarios.map((s, i) => (
                    <th key={s.id} style={{ padding: '10px 16px', textAlign: 'right', fontSize: 10, fontWeight: 700, color: C.dark, letterSpacing: 0.6, textTransform: 'uppercase', borderBottom: `1px solid ${C.borderMd}` }}>
                      Scenario {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Project Name',     getValue: (r: CalculationResult) => r.projectName || '—', isText: true },
                  { label: 'Total GHG (tCO₂e/yr)', getValue: (r: CalculationResult) => fmt(r.totalEmissionsTCO2e) },
                  { label: 'GHG / Capita',         getValue: (r: CalculationResult) => `${r.ghgPerCapitaTCO2e.toFixed(2)} t` },
                  { label: 'Buildings %',           getValue: (r: CalculationResult) => `${Math.round(r.contributionPercentages.buildings)}%` },
                  { label: 'Mobility %',            getValue: (r: CalculationResult) => `${Math.round(r.contributionPercentages.mobility)}%` },
                  { label: 'Infrastructure %',      getValue: (r: CalculationResult) => `${Math.round(r.contributionPercentages.infrastructure)}%` },
                  { label: 'Mobility Profile',      getValue: (r: CalculationResult) => PROFILE_STYLES[r.assignedMobilityProfile]?.label ?? r.assignedMobilityProfile, isText: true },
                  { label: 'Climate Zone',          getValue: (r: CalculationResult) => r.climate?.climateZone ?? '—', isText: true },
                  { label: 'Grid Factor',           getValue: (r: CalculationResult) => `${r.grid?.gridFactorKgCO2ePerKwh?.toFixed(3) ?? '—'} kgCO₂e/kWh`, isText: true },
                  { label: 'Density',               getValue: (r: CalculationResult) => `${r.density?.densityPeoplePerHa?.toFixed(0) ?? '—'} ppl/ha` },
                ].map((row, ri) => {
                  const values = scenarios.map(s => row.getValue(s.result));
                  const isLowest = !row.isText && values.length > 1
                    ? (() => {
                        const nums = values.map(v => parseFloat(v.replace(/[^0-9.-]/g, '')));
                        const min = Math.min(...nums);
                        return nums.map(n => n === min);
                      })()
                    : values.map(() => false);

                  return (
                    <tr key={row.label} style={{ borderBottom: `1px solid rgba(31,38,34,0.04)`, background: ri % 2 === 0 ? 'transparent' : C.strip }}>
                      <td style={{ padding: '8px 16px', color: C.muted, fontSize: 11.5 }}>{row.label}</td>
                      {values.map((v, vi) => (
                        <td key={vi} style={{ padding: '8px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isLowest[vi] ? 700 : 400, color: isLowest[vi] ? C.sage : C.dark, fontSize: 11.5 }}>
                          {v}
                          {isLowest[vi] && scenarios.length > 1 && <span style={{ marginLeft: 4, fontSize: 10, color: C.sage }}>↓best</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
