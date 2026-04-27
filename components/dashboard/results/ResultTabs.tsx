'use client';

import { useState } from 'react';
import type { CalculationResult } from '@/types/carbon';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const PROGRAM_LABELS: Record<string, string> = {
  residential_single_family: 'Single Family',
  residential_multifamily:   'Multifamily',
  office:                    'Office',
  retail:                    'Retail',
  hospitality:               'Hospitality',
  educational:               'Educational',
  healthcare:                'Healthcare',
  industrial:                'Industrial',
  institutional:             'Institutional',
};

const MODE_LABELS: Record<string, string> = {
  car:               'Car',
  transit:           'Transit',
  walk:              'Walk',
  bike_micromobility:'Bike',
  taxi_ridehail:     'Taxi / Ride-hail',
  other:             'Other',
};

type Props = { result: CalculationResult };

function BarRow({ label, value, max, color, suffix, share }: { label: string; value: number; max: number; color: string; suffix?: string; share?: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: share != null ? '92px 1fr 60px 32px' : '92px 1fr 60px', gap: 10, alignItems: 'center', padding: '5px 0', fontSize: 11.5 }}>
      <span style={{ color: '#3d4a44' }}>{label}</span>
      <div style={{ height: 18, background: '#f3efe6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width .3s' }} />
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#1e3128', fontWeight: 500, textAlign: 'right' }}>{fmt(value)}{suffix || ''}</span>
      {share != null && <span style={{ fontVariantNumeric: 'tabular-nums', color: '#9aada4', textAlign: 'right' }}>{share}%</span>}
    </div>
  );
}

const TABS = ['Breakdown', 'Mobility', 'Buildings', 'Assumptions'] as const;
type Tab = typeof TABS[number];

export default function ChartArea({ result }: Props) {
  const [tab, setTab] = useState<Tab>('Breakdown');

  const emissionsByProgram = [...result.buildingResults]
    .filter(r => r.areaM2 > 0)
    .sort((a, b) => b.emissionsTCO2e - a.emissionsTCO2e)
    .map(r => ({ label: PROGRAM_LABELS[r.programType] ?? r.programType, value: Math.round(r.emissionsTCO2e) }));

  const mobilityByMode = result.mobilityResults.map(r => ({
    label: MODE_LABELS[r.mode] ?? r.mode,
    value: Math.round(r.emissionsTCO2e),
    share: Math.round(r.modeShare * 100),
  })).filter(r => r.value > 0 || r.share > 0);

  const maxProg = Math.max(...emissionsByProgram.map(d => d.value), 1);
  const maxMob  = Math.max(...mobilityByMode.map(d => d.value), 1);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(31,38,34,0.07)', borderRadius: 10, padding: 0 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(31,38,34,0.08)', padding: '0 18px' }}>
        {TABS.map(t => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', borderBottom: tab === t ? '2px solid #5a7a5a' : '2px solid transparent', color: tab === t ? '#1e3128' : '#9aada4', cursor: 'pointer', transition: 'all .15s', marginBottom: -1 }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Content */}
      {tab === 'Breakdown' && (
        <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: '#3d4a44', marginBottom: 8, fontWeight: 600 }}>Emissions by Program <span style={{ color: '#9aada4', fontWeight: 400 }}>(tCO₂e / year)</span></div>
            {emissionsByProgram.map(d => <BarRow key={d.label} label={d.label} value={d.value} max={maxProg} color="#5a7a5a" />)}
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#3d4a44', marginBottom: 8, fontWeight: 600 }}>Mobility by Mode <span style={{ color: '#9aada4', fontWeight: 400 }}>(tCO₂e / year)</span></div>
            {mobilityByMode.map(d => <BarRow key={d.label} label={d.label} value={d.value} max={maxMob} color="#e8954a" share={d.share} />)}
          </div>
        </div>
      )}

      {tab === 'Mobility' && (
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 12, color: '#3d4a44', marginBottom: 12, fontWeight: 600 }}>
            Profile: <span style={{ color: '#1e3128' }}>{result.assignedMobilityProfile.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            <span style={{ color: '#9aada4', fontWeight: 400, marginLeft: 12 }}>Score: {result.mobilityScoring.finalScore.toFixed(1)}</span>
          </div>
          {mobilityByMode.map(d => <BarRow key={d.label} label={d.label} value={d.value} max={maxMob} color="#e8954a" share={d.share} />)}
        </div>
      )}

      {tab === 'Buildings' && (
        <div style={{ padding: '16px 18px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(31,38,34,0.08)' }}>
                {['Program', 'Area (m²)', 'EUI', 'Energy (MWh)', 'tCO₂e/yr'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: h === 'Program' ? 'left' : 'right', color: '#9aada4', fontWeight: 600, fontSize: 10.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.buildingResults.filter(r => r.areaM2 > 0).sort((a, b) => b.emissionsTCO2e - a.emissionsTCO2e).map(r => (
                <tr key={r.programType} style={{ borderBottom: '1px solid rgba(31,38,34,0.04)' }}>
                  <td style={{ padding: '7px 8px', color: '#3d4a44' }}>{PROGRAM_LABELS[r.programType] ?? r.programType}</td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1f2622' }}>{fmt(r.areaM2)}</td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#6b7670' }}>{r.euiKwhPerM2Year.toFixed(0)}</td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1f2622' }}>{fmt(Math.round(r.annualEnergyKwh / 1000))}</td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#1e3128', fontWeight: 600 }}>{fmt(Math.round(r.emissionsTCO2e))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(31,38,34,0.1)', background: '#f6f3ec' }}>
                <td style={{ padding: '8px 8px', fontWeight: 700, color: '#1e3128', fontSize: 11.5 }}>Total</td>
                <td colSpan={3} />
                <td style={{ padding: '8px 8px', textAlign: 'right', fontWeight: 700, color: '#1e3128', fontVariantNumeric: 'tabular-nums' }}>{fmt(Math.round(result.buildingEmissionsTCO2e))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {tab === 'Assumptions' && (
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {[
              { label: 'Grid Factor', value: `${result.grid.gridFactorKgCO2ePerKwh.toFixed(3)} kgCO₂e/kWh` },
              { label: 'Climate Zone', value: `${result.climate.climateZone} — ${result.climate.climateLabel}` },
              { label: 'Mobility Profile', value: result.assignedMobilityProfile.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) },
              { label: 'Mobility Score', value: result.mobilityScoring.finalScore.toFixed(1) },
              { label: 'Infra Allowance', value: `${Math.round(result.contributionPercentages.infrastructure)}% of total` },
              { label: 'Data Source', value: result.grid.source },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '8px 0', borderBottom: '1px solid rgba(31,38,34,0.06)' }}>
                <div style={{ fontSize: 10.5, color: '#9aada4', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e3128' }}>{value}</div>
              </div>
            ))}
          </div>
          {result.assumptionsNotes.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#fdf3ea', border: '1px solid #f4d9b9', borderRadius: 8 }}>
              {result.assumptionsNotes.map((n, i) => (
                <p key={i} style={{ fontSize: 11, color: '#6b7670', margin: '2px 0' }}>• {n}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
