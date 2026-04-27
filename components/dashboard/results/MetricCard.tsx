import type { CalculationResult } from '@/types/carbon';
import Icon, { type IconName } from '../Icon';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

type Sector = 'buildings' | 'mobility' | 'infra';

const CONFIG: Record<Sector, { label: string; icon: IconName; accent: string }> = {
  buildings: { label: 'Buildings',      icon: 'building', accent: '#5a7a5a' },
  mobility:  { label: 'Mobility',       icon: 'car',      accent: '#e8954a' },
  infra:     { label: 'Infrastructure', icon: 'infra',    accent: '#c9a961' },
};

type Props = { sector: Sector; result: CalculationResult };

export default function MetricCard({ sector, result }: Props) {
  const { label, icon, accent } = CONFIG[sector];
  const value = sector === 'buildings' ? result.buildingEmissionsTCO2e
              : sector === 'mobility'  ? result.mobilityEmissionsTCO2e
              : result.infrastructureEmissionsTCO2e;
  const share = result.contributionPercentages[sector === 'infra' ? 'infrastructure' : sector];
  const perCap = (result.ghgPerCapitaTCO2e * share / 100).toFixed(1);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(31,38,34,0.07)', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', background: accent + '1a', color: accent }}>
        <Icon name={icon} size={18} stroke={1.7} />
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: accent }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, color: '#1e3128' }}>{fmt(Math.round(value))}</div>
      <div style={{ fontSize: 11, color: '#6b7670' }}>tCO₂e / year</div>
      <div style={{ height: 1, background: 'rgba(31,38,34,0.06)', margin: '4px 0' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#1e3128' }}>{perCap}</span>
        <span style={{ fontSize: 10.5, color: '#9aada4' }}>tCO₂e / person / year</span>
      </div>
    </div>
  );
}
