'use client';

import { useState, useEffect, useRef } from 'react';
import type { CarbonQuickCheckInput, GeographicContext, ProjectType, SiteAreaUnit } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { LocationInput } from '@/components/LocationInput';
import Icon from '@/components/dashboard/Icon';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
  onLocationResolved: (data: { location: ResolvedLocation; climate: KoppenClimateResult | null; grid: GridEmissionResult }) => void;
};

type DefinedOption = { value: string; label: string; desc: string };

const GEO_OPTIONS: DefinedOption[] = [
  { value: 'urban_core',              label: 'Urban Core',              desc: 'Dense mixed-use city centre' },
  { value: 'urban_inner_ring',        label: 'Urban / Inner Ring',      desc: 'Connected urban neighbourhood' },
  { value: 'suburban_edge',           label: 'Suburban Edge',           desc: 'Lower density, car-oriented area' },
  { value: 'peri_urban_fringe',       label: 'Peri-Urban / Fringe',     desc: 'Transitional edge of urban area' },
  { value: 'greenfield_undeveloped',  label: 'Greenfield / Undeveloped',desc: 'Previously undeveloped land' },
];

const TYPE_OPTIONS: DefinedOption[] = [
  { value: 'infill_redevelopment',    label: 'Infill / Redevelopment',  desc: 'Within existing urban fabric' },
  { value: 'greenfield_development',  label: 'Greenfield Development',  desc: 'New development on undeveloped land' },
  { value: 'campus_planned_district', label: 'Campus / Planned District',desc: 'Self-contained master-planned area' },
];

const UNIT_OPTIONS = [
  { value: 'm2',       label: 'm²' },
  { value: 'hectares', label: 'ha' },
  { value: 'acres',    label: 'ac' },
];

// ─── Field styles ─────────────────────────────────────────────────────────────
const fieldRow   = { display: 'grid', gridTemplateColumns: '1fr 1.1fr', alignItems: 'center', padding: '8px 16px', gap: 12 } as const;
const fieldLabel = { fontSize: 12, color: '#6b7670' } as const;
const fieldInput = { display: 'flex', alignItems: 'center', padding: '6px 10px', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: '#fbfaf6', fontSize: 12.5, color: '#1f2622', justifyContent: 'space-between', width: '100%', outline: 'none', fontFamily: 'inherit' } as const;
const fieldUnit  = { fontSize: 11, color: '#9aada4', marginLeft: 8, whiteSpace: 'nowrap' as const };
const selectStyle = { ...fieldInput, cursor: 'pointer', appearance: 'none' as const };

// ─── Custom dropdown with label + description ─────────────────────────────────
function DefinedSelect({ options, value, onChange, placeholder, error }: {
  options: DefinedOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ ...fieldInput, cursor: 'pointer', width: '100%', textAlign: 'left', border: open ? '1px solid #5a7a5a' : '1px solid rgba(31,38,34,0.1)' }}
      >
        <span style={{ color: selected ? '#1f2622' : '#9aada4', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <span style={{ flexShrink: 0, marginLeft: 6, color: '#9aada4', transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>
          <Icon name="chevron-down" size={12} />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 8, boxShadow: '0 4px 16px rgba(31,38,34,0.10)', zIndex: 200, overflow: 'hidden' }}>
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '9px 12px', background: isSelected ? '#eef4ee' : 'transparent', border: 'none', borderBottom: '1px solid rgba(31,38,34,0.05)', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .1s' }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#f6f3ec'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600, color: isSelected ? '#3a6b3a' : '#1f2622', marginBottom: 1 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: '#9aada4', lineHeight: 1.4 }}>{opt.desc}</div>
              </button>
            );
          })}
        </div>
      )}

      {error && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 3 }}>{error}</p>}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
const SQM_TO_SQFT = 10.76391;
const SQFT_TO_SQM = 1 / SQM_TO_SQFT;

export default function ProjectDetailsPanel({ data, onChange, errors, onLocationResolved }: Props) {
  const siteAreaUnit = data.siteAreaUnit ?? 'hectares';
  const [gfaUnit, setGfaUnit] = useState<'m2' | 'sqft'>('m2');

  const gfaDisplayValue = data.totalBuiltAreaM2
    ? gfaUnit === 'sqft' ? Math.round(data.totalBuiltAreaM2 * SQM_TO_SQFT) : data.totalBuiltAreaM2
    : '';

  let densityDisplay = '—';
  if (data.totalPopulation && data.siteAreaValue && data.siteAreaValue > 0) {
    const ha = siteAreaUnit === 'hectares' ? data.siteAreaValue : siteAreaUnit === 'acres' ? data.siteAreaValue * 0.404686 : data.siteAreaValue / 10000;
    if (ha > 0) densityDisplay = `${(data.totalPopulation / ha).toFixed(1)} ppl / ha`;
  }

  return (
    <div style={{ padding: '8px 0 14px' }}>
      {/* Project name */}
      <div style={fieldRow}>
        <span style={fieldLabel}>Project name</span>
        <input
          type="text"
          value={data.projectName ?? ''}
          onChange={e => onChange({ projectName: e.target.value })}
          placeholder="Waterfront Master Plan"
          style={fieldInput}
        />
      </div>

      {/* Location (auto-resolves on blur / Enter) */}
      <div style={{ padding: '4px 16px 8px' }}>
        <LocationInput onResolved={onLocationResolved} error={errors.locationInput} />
      </div>

      {/* Population */}
      <div style={fieldRow}>
        <span style={fieldLabel}>Projected Population</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="number" min={1}
            value={data.totalPopulation ?? ''}
            onChange={e => onChange({ totalPopulation: parseFloat(e.target.value) || undefined as unknown as number })}
            placeholder="25,000"
            style={{ ...fieldInput, flex: 1 }}
          />
          <span style={fieldUnit}>people</span>
        </div>
      </div>
      {errors.totalPopulation && <p style={{ fontSize: 11, color: '#dc2626', padding: '0 16px 4px' }}>{errors.totalPopulation}</p>}

      {/* Site area */}
      <div style={fieldRow}>
        <span style={fieldLabel}>Site Area</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number" min={0.1}
            value={data.siteAreaValue ?? ''}
            onChange={e => onChange({ siteAreaValue: parseFloat(e.target.value) || undefined as unknown as number })}
            placeholder="120"
            style={{ ...fieldInput, flex: 1, minWidth: 0 }}
          />
          <select
            value={siteAreaUnit}
            onChange={e => onChange({ siteAreaUnit: e.target.value as SiteAreaUnit })}
            style={{ ...selectStyle, flexShrink: 0, width: 56, fontSize: 11, padding: '6px 4px', textAlign: 'center' }}
          >
            {UNIT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      {errors.siteAreaValue && <p style={{ fontSize: 11, color: '#dc2626', padding: '0 16px 4px' }}>{errors.siteAreaValue}</p>}

      {/* Total built area */}
      <div style={fieldRow}>
        <span style={fieldLabel}>Total Built Area (GFA)</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number" min={1}
            value={gfaDisplayValue}
            onChange={e => {
              const raw = parseFloat(e.target.value) || undefined as unknown as number;
              const m2 = raw ? (gfaUnit === 'sqft' ? raw * SQFT_TO_SQM : raw) : undefined as unknown as number;
              onChange({ totalBuiltAreaM2: m2 });
            }}
            placeholder={gfaUnit === 'sqft' ? '12,916,000' : '1,200,000'}
            style={{ ...fieldInput, flex: 1, minWidth: 0 }}
          />
          <select
            value={gfaUnit}
            onChange={e => {
              const next = e.target.value as 'm2' | 'sqft';
              setGfaUnit(next);
            }}
            style={{ ...selectStyle, flexShrink: 0, width: 52, fontSize: 11, padding: '6px 4px', textAlign: 'center' }}
          >
            <option value="m2">m²</option>
            <option value="sqft">ft²</option>
          </select>
        </div>
      </div>
      {errors.totalBuiltAreaM2 && <p style={{ fontSize: 11, color: '#dc2626', padding: '0 16px 4px' }}>{errors.totalBuiltAreaM2}</p>}

      {/* Density preview */}
      <div style={fieldRow}>
        <span style={fieldLabel}>Calculated density</span>
        <div style={{ ...fieldInput, color: '#9aada4', fontVariantNumeric: 'tabular-nums' }}>{densityDisplay}</div>
      </div>

      {/* Geographic context */}
      <div style={{ ...fieldRow, alignItems: 'flex-start', paddingTop: 10 }}>
        <span style={{ ...fieldLabel, paddingTop: 7 }}>Geographic Context</span>
        <DefinedSelect
          options={GEO_OPTIONS}
          value={data.geographicContext ?? ''}
          onChange={v => onChange({ geographicContext: v as GeographicContext })}
          placeholder="Select context…"
          error={errors.geographicContext}
        />
      </div>

      {/* Project type */}
      <div style={{ ...fieldRow, alignItems: 'flex-start', paddingTop: 10 }}>
        <span style={{ ...fieldLabel, paddingTop: 7 }}>Project Type</span>
        <DefinedSelect
          options={TYPE_OPTIONS}
          value={data.projectType ?? ''}
          onChange={v => onChange({ projectType: v as ProjectType })}
          placeholder="Select type…"
          error={errors.projectType}
        />
      </div>

    </div>
  );
}
