import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';

type Props = {
  resolvedGrid: GridEmissionResult | null;
  resolvedClimate: KoppenClimateResult | null;
};

const fieldRow = { display: 'grid', gridTemplateColumns: '1fr 1.1fr', alignItems: 'center', padding: '8px 16px', gap: 12 } as const;
const fieldLabel = { fontSize: 12, color: '#6b7670' } as const;
const fieldValue = { fontSize: 12.5, fontWeight: 600, color: '#1e3128', textAlign: 'right' as const };

export default function GridEnergyPanel({ resolvedGrid, resolvedClimate }: Props) {
  if (!resolvedGrid && !resolvedClimate) {
    return (
      <div style={{ padding: '20px 16px', textAlign: 'center', color: '#9aada4', fontSize: 12 }}>
        Resolve a project location to see grid and climate data.
      </div>
    );
  }

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

      {resolvedClimate && (
        <>
          <div style={{ padding: '10px 16px 4px' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: '#9aada4', textTransform: 'uppercase' as const }}>Climate</span>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Köppen zone</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e3128' }}>{resolvedClimate.climateZone}</span>
              <p style={{ fontSize: 11, color: '#9aada4', margin: '1px 0 0' }}>{resolvedClimate.climateLabel}</p>
            </div>
          </div>
          <div style={fieldRow}>
            <span style={fieldLabel}>Confidence</span>
            <span style={fieldValue}>{resolvedClimate.confidence}</span>
          </div>
          {resolvedClimate.notes && (
            <div style={{ padding: '4px 16px' }}>
              <p style={{ fontSize: 11, color: '#9aada4', margin: 0 }}>{resolvedClimate.notes.slice(0, 80)}</p>
            </div>
          )}
        </>
      )}

      <div style={{ padding: '10px 16px 0' }}>
        <p style={{ fontSize: 11, color: '#9aada4', margin: 0, fontStyle: 'italic' }}>
          Grid and climate data are automatically resolved from your project location.
        </p>
      </div>
    </div>
  );
}
