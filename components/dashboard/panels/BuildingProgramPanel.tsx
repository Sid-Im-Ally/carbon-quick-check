'use client';

import { useState } from 'react';
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

const SQM_TO_SQFT = 10.76391;
const SQFT_TO_SQM = 1 / SQM_TO_SQFT;

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

type InputMode = 'area' | 'percent';

export default function BuildingProgramPanel({ data, onChange, errors }: Props) {
  const [unit, setUnit] = useState<'m2' | 'sqft'>('m2');
  const [mode, setMode] = useState<InputMode>('area');
  const unitLabel = unit === 'sqft' ? 'ft²' : 'm²';
  const toDisplay = (m2: number) => unit === 'sqft' ? m2 * SQM_TO_SQFT : m2;
  const toM2      = (v:  number) => unit === 'sqft' ? v  * SQFT_TO_SQM : v;

  const totalBuiltArea = data.totalBuiltAreaM2 ?? 0;
  const programAreas   = data.programAreas ?? { residential: 0, office: 0, retail: 0, hospitality: 0, educational: 0, healthcare: 0, industrial: 0, institutional: 0 };
  const residentialSplit = data.residentialSplit ?? { singleFamilyPercent: 30, multifamilyPercent: 70 };

  const totalAssigned = Object.values(programAreas).reduce((s, v) => s + (v || 0), 0);
  const overAllocated = totalAssigned > totalBuiltArea && totalBuiltArea > 0;

  function updateArea(key: keyof FrontendProgramArea, displayValue: number) {
    const m2 = isNaN(displayValue) || displayValue < 0 ? 0 : toM2(displayValue);
    onChange({ programAreas: { ...programAreas, [key]: m2 } });
  }

  function updatePercent(key: keyof FrontendProgramArea, pct: number) {
    if (totalBuiltArea <= 0) return;
    const clamped = isNaN(pct) || pct < 0 ? 0 : pct;
    const m2 = (clamped / 100) * totalBuiltArea;
    onChange({ programAreas: { ...programAreas, [key]: m2 } });
  }

  function updateSplit(sfPct: number) {
    const c = Math.max(0, Math.min(100, sfPct));
    onChange({ residentialSplit: { singleFamilyPercent: c, multifamilyPercent: 100 - c } });
  }

  const totalPctAssigned = totalBuiltArea > 0 ? (totalAssigned / totalBuiltArea) * 100 : 0;
  const percentDisabled = mode === 'percent' && totalBuiltArea <= 0;

  // Mini segmented control for input mode
  const SegBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '3px 9px', fontSize: 11, fontWeight: 600,
        border: 'none', background: active ? '#fff' : 'transparent',
        color: active ? '#1f2622' : '#6b7670',
        boxShadow: active ? '0 1px 2px rgba(31,38,34,0.08)' : 'none',
        borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit', outline: 'none',
        transition: 'all .12s',
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ padding: '10px 16px 14px' }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#9aada4' }}>Input as</span>
        <div style={{ display: 'inline-flex', padding: 2, background: '#f3efe6', border: '1px solid rgba(31,38,34,0.06)', borderRadius: 7 }}>
          <SegBtn active={mode === 'area'}    onClick={() => setMode('area')}>Area</SegBtn>
          <SegBtn active={mode === 'percent'} onClick={() => setMode('percent')}>%</SegBtn>
        </div>
      </div>

      {/* Total allocation summary + unit toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed rgba(31,38,34,0.08)', marginBottom: 4, gap: 8 }}>
        <span style={{ fontSize: 12, color: '#6b7670' }}>Total Program Area</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: overAllocated ? '#dc2626' : '#1e3128', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(toDisplay(totalAssigned))}{totalBuiltArea > 0 ? ` / ${fmt(toDisplay(totalBuiltArea))}` : ''}
          </span>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as 'm2' | 'sqft')}
            style={{ width: 52, fontSize: 11, padding: '4px 4px', textAlign: 'center', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: '#fbfaf6', color: '#1f2622', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', outline: 'none' }}
          >
            <option value="m2">m²</option>
            <option value="sqft">ft²</option>
          </select>
        </div>
      </div>

      {percentDisabled && (
        <p style={{ fontSize: 11, color: '#b45309', margin: '6px 0 4px' }}>
          Set Total Built Area in Project Details to enter percentages.
        </p>
      )}

      {PROGRAMS.map(prog => {
        const m2Val = programAreas[prog.key] ?? 0;
        const displayVal = m2Val === 0 ? 0 : toDisplay(m2Val);
        const pctVal = totalBuiltArea > 0 ? (m2Val / totalBuiltArea) * 100 : 0;
        const pctRoundedDisplay = pctVal.toFixed(0);

        const inputValue =
          mode === 'area'
            ? (displayVal === 0 ? '' : Math.round(displayVal))
            : (m2Val === 0 ? '' : pctVal.toFixed(1).replace(/\.0$/, ''));

        return (
          <div key={prog.key}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 12 }}>
              <span style={{ color: '#3d4a44', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#9aada4', display: 'inline-block' }} />
                {prog.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <input
                  type="number" min={0} max={mode === 'percent' ? 100 : undefined}
                  value={inputValue}
                  onChange={e => {
                    const v = parseFloat(e.target.value) || 0;
                    if (mode === 'area') updateArea(prog.key, v);
                    else updatePercent(prog.key, v);
                  }}
                  disabled={percentDisabled}
                  placeholder="0"
                  style={{ width: 90, padding: '4px 8px', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: percentDisabled ? '#f3efe6' : '#fbfaf6', fontSize: 12, textAlign: 'right', color: percentDisabled ? '#9aada4' : '#1f2622', fontVariantNumeric: 'tabular-nums', outline: 'none', fontFamily: 'inherit' }}
                />
                <span style={{ color: '#9aada4', fontSize: 10.5, width: 22, textAlign: 'left' }}>
                  {mode === 'area' ? unitLabel : '%'}
                </span>
              </div>
              <span style={{ color: '#6b7670', width: 60, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: 11 }}>
                {mode === 'area' ? `${pctRoundedDisplay}%` : (m2Val > 0 ? `${fmt(toDisplay(m2Val))} ${unitLabel}` : '—')}
              </span>
            </div>

            {/* Residential split */}
            {prog.key === 'residential' && m2Val > 0 && (
              <div style={{ paddingLeft: 16, paddingBottom: 6 }}>
                {[
                  { label: 'Single Family', value: residentialSplit.singleFamilyPercent, editable: true },
                  { label: 'Multifamily',   value: residentialSplit.multifamilyPercent,  editable: false },
                ].map(row => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: 11.5, color: '#9aada4' }}>
                    <span>• {row.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                      <span style={{ fontSize: 10.5, width: 22, textAlign: 'left' }}>%</span>
                    </div>
                    <span style={{ width: 60 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {mode === 'percent' && totalBuiltArea > 0 && Math.abs(totalPctAssigned - 100) > 0.5 && totalAssigned > 0 && (
        <p style={{ fontSize: 11, color: totalPctAssigned > 100 ? '#dc2626' : '#9aada4', marginTop: 8 }}>
          {totalPctAssigned > 100 ? 'Over' : 'Under'}-allocated: {totalPctAssigned.toFixed(0)}% assigned
        </p>
      )}
      {mode === 'area' && overAllocated && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>Over-allocated by {fmt(toDisplay(totalAssigned - totalBuiltArea))} {unitLabel}</p>
      )}
      {errors.programAreas && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.programAreas}</p>
      )}
    </div>
  );
}
