import type { CalculationResult } from '@/types/carbon';
import Icon, { type IconName } from '../Icon';

type StripItem = { icon: IconName; iconColor: string; label: string; value: string; sub?: string };

type Props = { result: CalculationResult };

export default function AssumptionStrip({ result }: Props) {
  const items: StripItem[] = [
    {
      icon: 'globe', iconColor: '#6b7670',
      label: `Grid Factor (${result.grid.geographyLevel ?? 'detected'})`,
      value: `${result.grid.gridFactorKgCO2ePerKwh.toFixed(3)} kgCO₂e / kWh`,
      sub: result.grid.source,
    },
    {
      icon: 'leaf', iconColor: '#5a7a5a',
      label: 'Renewable Share',
      value: '10%',
    },
    {
      icon: 'sun', iconColor: '#c9a961',
      label: 'Climate Zone',
      value: `${result.climate.climateZone} — ${result.climate.climateLabel}`,
    },
    {
      icon: 'car', iconColor: '#e8954a',
      label: 'Mobility Profile',
      value: result.assignedMobilityProfile.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    },
    {
      icon: 'infra', iconColor: '#6b7670',
      label: 'Infrastructure Factor',
      value: `${Math.round((result.infrastructureEmissionsTCO2e / (result.buildingEmissionsTCO2e + result.mobilityEmissionsTCO2e)) * 100)}% of Buildings + Mobility`,
    },
  ];

  return (
    <div style={{ padding: '14px 28px', borderTop: '1px solid rgba(31,38,34,0.07)', background: '#fbfaf6', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', flexShrink: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#3d4a44' }}>
          <Icon name={item.icon} size={16} color={item.iconColor} />
          <div>
            <div style={{ fontSize: 10.5, color: '#9aada4', letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600 }}>
              {item.value}
              {item.sub && <span style={{ color: '#9aada4', fontWeight: 400, fontSize: 10.5, marginLeft: 6 }}>· {item.sub}</span>}
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginLeft: 'auto', fontSize: 12, color: '#5a7a5a', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        View all assumptions <Icon name="chevron-right" size={12} color="#5a7a5a" />
      </div>
    </div>
  );
}
