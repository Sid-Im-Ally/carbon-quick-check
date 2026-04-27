'use client';

import { useState } from 'react';
import type { CalculationResult } from '@/types/carbon';
import DonutChart from './DonutChart';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const SECTORS = [
  { key: 'buildings' as const, label: 'Buildings',       color: '#5a7a5a' },
  { key: 'mobility'  as const, label: 'Mobility',        color: '#e8954a' },
  { key: 'infra'     as const, label: 'Infrastructure',  color: '#c9a961' },
];

type Props = { result: CalculationResult };

export default function BreakdownCard({ result }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const sectors = SECTORS.map(s => {
    const value  = s.key === 'buildings' ? result.buildingEmissionsTCO2e
                 : s.key === 'mobility'  ? result.mobilityEmissionsTCO2e
                 : result.infrastructureEmissionsTCO2e;
    const share  = Math.round(result.contributionPercentages[s.key === 'infra' ? 'infrastructure' : s.key]);
    const perCap = result.ghgPerCapitaTCO2e * (share / 100);
    return { ...s, value, share, perCap };
  });

  const total = Math.round(result.totalEmissionsTCO2e);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(31,38,34,0.07)', borderRadius: 10, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, color: '#3d4a44', textTransform: 'uppercase' }}>Emissions Breakdown</div>
          <div style={{ fontSize: 11, color: '#9aada4', marginTop: 3 }}>Total: {fmt(total)} tCO₂e / year</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
        <DonutChart
          data={sectors}
          size={150}
          thickness={26}
          hoverIdx={hoverIdx}
          setHoverIdx={setHoverIdx}
          center={
            <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1e3128', letterSpacing: -0.5 }}>
                {hoverIdx != null ? `${sectors[hoverIdx].share}%` : fmt(total)}
              </div>
              <div style={{ fontSize: 9.5, color: '#6b7670', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {hoverIdx != null ? sectors[hoverIdx].label : 'tCO₂e / year'}
              </div>
            </div>
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectors.map((s, i) => (
            <div
              key={s.key}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 10, alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: hoverIdx === i ? '#fbfaf6' : 'transparent', cursor: 'pointer', transition: 'background .15s' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'block' }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e3128' }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: '#9aada4' }}>{fmt(Math.round(s.value))} tCO₂e / year</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3d4a44', fontVariantNumeric: 'tabular-nums' }}>{s.share}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
