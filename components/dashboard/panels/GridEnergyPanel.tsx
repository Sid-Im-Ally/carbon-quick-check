'use client';

import { useState } from 'react';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import type { CarbonQuickCheckInput } from '@/types/carbon';

type Props = {
  resolvedGrid: GridEmissionResult | null;
  resolvedClimate: KoppenClimateResult | null;
  locationResolved: boolean;
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  onClimateUpdate: (climate: KoppenClimateResult) => void;
};

const fieldRow = { display: 'grid', gridTemplateColumns: '1fr 1.1fr', alignItems: 'center', padding: '8px 16px', gap: 12 } as const;
const fieldLabel = { fontSize: 12, color: '#6b7670' } as const;
const fieldValue = { fontSize: 12.5, fontWeight: 600, color: '#1e3128', textAlign: 'right' as const };

// Derive a readable label from a Köppen zone code
function deriveKoppenLabel(zone: string): string {
  const first = zone.charAt(0).toUpperCase();
  const prefixes: Record<string, string> = {
    A: 'Tropical', B: 'Arid / Dry', C: 'Temperate', D: 'Continental', E: 'Polar / Alpine',
  };
  return prefixes[first] ? `${prefixes[first]} (${zone})` : zone;
}

const RenewableInput = ({ data, onChange }: { data: Partial<CarbonQuickCheckInput>; onChange: (u: Partial<CarbonQuickCheckInput>) => void }) => (
  <div style={{ padding: '10px 16px 0' }}>
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: '#9aada4', textTransform: 'uppercase' as const, marginBottom: 8 }}>Project Renewables</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 12, color: '#6b7670' }}>On-site / contracted<br />renewable share</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="number" min={0} max={100}
          value={data.renewableSharePercent ?? 0}
          onChange={e => {
            const v = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
            onChange({ renewableSharePercent: v });
          }}
          style={{ width: 64, padding: '6px 8px', border: '1px solid rgba(31,38,34,0.1)', borderRadius: 6, background: '#fbfaf6', fontSize: 12.5, textAlign: 'right', color: '#1f2622', fontVariantNumeric: 'tabular-nums', outline: 'none', fontFamily: 'inherit' }}
        />
        <span style={{ fontSize: 11, color: '#9aada4' }}>%</span>
      </div>
    </div>
    <p style={{ fontSize: 11, color: '#9aada4', margin: '8px 0 0', fontStyle: 'italic' }}>
      Reduces building emissions only. 0% = grid-only (default).
    </p>
  </div>
);

export default function GridEnergyPanel({ resolvedGrid, resolvedClimate, locationResolved, data, onChange, onClimateUpdate }: Props) {
  const [manualZone, setManualZone] = useState('');
  const [manualError, setManualError] = useState('');

  function submitManualZone() {
    const zone = manualZone.trim().toUpperCase();
    if (!zone) { setManualError('Enter a Köppen zone code (e.g. BWh, Cfa, Dfb).'); return; }
    if (!/^[ABCDE][A-Z]*[a-z]*$/.test(zone)) { setManualError('Invalid format. Example valid codes: BWh, Cfa, Am, Dfb.'); return; }
    setManualError('');
    onClimateUpdate({
      climateZone: zone,
      climateLabel: deriveKoppenLabel(zone),
      latitude: 0,
      longitude: 0,
      source: 'manual',
      confidence: 'manual',
    });
  }

  if (!resolvedGrid && !resolvedClimate) {
    return (
      <div style={{ padding: '8px 0 14px' }}>
        <div style={{ padding: '12px 16px', textAlign: 'center', color: '#9aada4', fontSize: 12 }}>
          Resolve a project location to see grid and climate data.
        </div>
        <RenewableInput data={data} onChange={onChange} />
      </div>
    );
  }

  const climateNotFound = locationResolved && !resolvedClimate;

  return (
    <div style={{ padding: '8px 0 14px' }}>
      {resolvedGrid && (
        <>
          <div style={fieldRow}>
            <span style={fieldLabel}>Grid emission factor</span>
            <span style={fieldValue}>{resolvedGrid.gridFactorKgCO2ePerKwh.toFixed(3)} kgCO₂e/kWh</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Geography level</span>
            <span style={fieldValue}>{resolvedGrid.geographyLevel ?? '—'}</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Emissions boundary</span>
            <span style={fieldValue}>{resolvedGrid.emissionsBoundary ?? '—'}</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Data year</span>
            <span style={fieldValue}>{resolvedGrid.year ?? '—'}</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Confidence</span>
            <span style={fieldValue}>{resolvedGrid.confidence}</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Source</span>
            <span style={{ fontSize: 11, color: '#9aada4', textAlign: 'right' }}>{resolvedGrid.sourceDetail ?? resolvedGrid.source}</span>
          </div>
        </>
      )}

      {/* Climate — auto-resolved */}
      {resolvedClimate && (
        <>
          <div style={{ padding: '10px 16px 4px' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: '#9aada4', textTransform: 'uppercase' as const }}>Climate</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Köppen zone</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e3128' }}>{resolvedClimate.climateZone}</span>
              {resolvedClimate.source === 'manual' && (
                <span style={{ fontSize: 10, color: '#c9a961', marginLeft: 6 }}>manual</span>
              )}
              <p style={{ fontSize: 11, color: '#9aada4', margin: '1px 0 0' }}>{resolvedClimate.climateLabel}</p>
            </div>
          </div>
          {resolvedClimate.source !== 'manual' && (
            <div style={fieldRow}>
              <span style={fieldLabel}>Confidence</span>
              <span style={fieldValue}>{resolvedClimate.confidence}</span>
            </div>
          )}
        </>
      )}

      {/* Manual entry — shown when climate could not be auto-resolved */}
      {climateNotFound && (
        <div style={{ margin: '8px 16px 0', padding: '12px 14px', background: '#fdf3ea', border: '1px solid #f4d9b9', borderRadius: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#8a4a1a', marginBottom: 6 }}>
            Climate zone not found
          </div>
          <p style={{ fontSize: 11, color: '#9aada4', margin: '0 0 10px', lineHeight: 1.5 }}>
            Could not auto-detect Köppen zone for this location. Enter it manually (e.g. BWh, Cfa, Am, Dfb).
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              value={manualZone}
              onChange={e => { setManualZone(e.target.value); setManualError(''); }}
              onKeyDown={e => e.key === 'Enter' && submitManualZone()}
              placeholder="e.g. BWh"
              maxLength={4}
              style={{ flex: 1, padding: '6px 10px', border: `1px solid ${manualError ? '#dc2626' : 'rgba(31,38,34,0.15)'}`, borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600, color: '#1f2622', outline: 'none', fontFamily: 'inherit', textTransform: 'uppercase' }}
            />
            <button
              type="button"
              onClick={submitManualZone}
              style={{ padding: '6px 14px', borderRadius: 6, background: '#5a7a5a', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Set
            </button>
          </div>
          {manualError && <p style={{ fontSize: 11, color: '#dc2626', margin: '4px 0 0' }}>{manualError}</p>}
        </div>
      )}

      <RenewableInput data={data} onChange={onChange} />

      <div style={{ padding: '8px 16px 0' }}>
        <p style={{ fontSize: 11, color: '#9aada4', margin: 0, fontStyle: 'italic' }}>
          Grid and climate data are automatically resolved from your project location.
        </p>
      </div>
    </div>
  );
}
