'use client';

import type { CarbonQuickCheckInput, FrontendProgramArea } from '@/types/carbon';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
};

type ProgramRow = { key: keyof FrontendProgramArea; label: string };

const PROGRAMS: ProgramRow[] = [
  { key: 'residential',  label: 'Residential' },
  { key: 'office',       label: 'Office' },
  { key: 'retail',       label: 'Retail' },
  { key: 'hospitality',  label: 'Hospitality' },
  { key: 'educational',  label: 'Educational' },
  { key: 'healthcare',   label: 'Healthcare' },
  { key: 'industrial',   label: 'Industrial' },
  { key: 'institutional',label: 'Institutional / Other' },
];

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export default function BuildingProgramPanel({ data, onChange, errors }: Props) {
  const totalBuiltArea = data.totalBuiltAreaM2 ?? 0;
  const programAreas   = data.programAreas ?? { residential: 0, office: 0, retail: 0, hospitality: 0, educational: 0, healthcare: 0, industrial: 0, institutional: 0 };
  const residentialSplit = data.residentialSplit ?? { singleFamilyPercent: 30, multifamilyPercent: 70 };

  const totalAssigned = Object.values(programAreas).reduce((s, v) => s + (v || 0), 0);
  const overAllocated = totalAssigned > totalBuiltArea && totalBuiltArea > 0;

  function updateArea(key: keyof FrontendProgramArea, value: number) {
    onChange({ programAreas: { ...programAreas, [key]: isNaN(value) || value < 0 ? 0 : value } });
  }

  function updateSplit(sfPct: number) {
    const c = Math.max(0, Math.min(100, sfPct));
    onChange({ residentialSplit: { singleFamilyPercent: c, multifamilyPercent: 100 - c } });
  }

  return (
    <div style={{ padding: '10px 16px 14px' }}>
      {/* Total allocation summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(31,38,34,0.08)', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7670' }}>Total Program Area</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: overAllocated ? '#dc2626' : '#1e3128' }}>
          {fmt(totalAssigned)} {totalBuiltArea > 0 ? `/ ${fmt(totalBuiltArea)}` : ''} m²
        </span>
      </div>

      {PROGRAMS.map(prog => {
        const val = programAreas[prog.key] ?? 0;
        const pct = totalBuiltArea > 0 ? ((val / totalBuiltArea) * 100).toFixed(0) : '0';
        return (
          <div key={prog.key}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 12 }}>
              <span style={{ color: '#3d4a44', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#9aada4', display: 'inline-block' }} />
                {prog.label}
              </span>
              <input
                type="number" min={0}
                value={val === 0 ? '' : val}
                onChange={e => updateArea(prog.key, parseFloat(e.target.value) || 0)}
                placeholder="0"
                style={{ width: 80, padding: '4px 8px', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: '#fbfaf6', fontSize: 12, textAlign: 'right', color: '#1f2622', fontVariantNumeric: 'tabular-nums', outline: 'none', fontFamily: 'inherit' }}
              />
              <span style={{ color: '#9aada4', fontSize: 10.5 }}>m²</span>
              <span style={{ color: '#6b7670', width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
            </div>

            {/* Residential split */}
            {prog.key === 'residential' && val > 0 && (
              <div style={{ paddingLeft: 16, paddingBottom: 6 }}>
                {[
                  { label: 'Single Family', value: residentialSplit.singleFamilyPercent, editable: true },
                  { label: 'Multifamily',   value: residentialSplit.multifamilyPercent,  editable: false },
                ].map(row => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: 11.5, color: '#9aada4' }}>
                    <span>• {row.label}</span>
                    {row.editable ? (
                      <input
                        type="number" min={0} max={100}
                        value={row.value}
                        onChange={e => updateSplit(parseFloat(e.target.value) || 0)}
                        style={{ width: 48, padding: '3px 6px', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: '#fbfaf6', fontSize: 11.5, textAlign: 'right', fontVariantNumeric: 'tabular-nums', outline: 'none', fontFamily: 'inherit', color: '#1f2622' }}
                      />
                    ) : (
                      <span style={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right', width: 48 }}>{row.value}</span>
                    )}
                    <span style={{ fontSize: 10.5 }}>%</span>
                    <span style={{ width: 28 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {overAllocated && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>Over-allocated by {fmt(totalAssigned - totalBuiltArea)} m²</p>
      )}
      {errors.programAreas && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.programAreas}</p>
      )}
    </div>
  );
}
