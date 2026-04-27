import type { CalculationResult } from '@/types/carbon';
import Icon, { type IconName } from '../Icon';

type Tone = 'warn' | 'good' | 'info';
type Signal = { tone: Tone; icon: IconName; title: string; body: string };

const TONES: Record<Tone, { bg: string; iconColor: string; border: string }> = {
  warn: { bg: '#fdf3ea', iconColor: '#e8954a', border: '#f4d9b9' },
  good: { bg: '#eef4ee', iconColor: '#5a7a5a', border: '#d6e3d6' },
  info: { bg: '#f6f1e8', iconColor: '#c9a961', border: '#e8dec3' },
};

function buildSignals(result: CalculationResult): Signal[] {
  const signals: Signal[] = [];
  const mobPct = result.contributionPercentages.mobility;
  const bldPct = result.contributionPercentages.buildings;
  const gridFactor = result.grid.gridFactorKgCO2ePerKwh;

  if (mobPct > 40) {
    signals.push({ tone: 'warn', icon: 'car', title: 'Mobility is a major driver', body: `${Math.round(mobPct)}% of total emissions come from travel. Improve transit access and reduce parking provision.` });
  } else if (mobPct < 25) {
    signals.push({ tone: 'good', icon: 'car', title: 'Mobility emissions are low', body: `Only ${Math.round(mobPct)}% of emissions from travel — transit-oriented design is working.` });
  }

  if (bldPct > 55) {
    signals.push({ tone: 'warn', icon: 'building', title: 'Buildings dominate emissions', body: `${Math.round(bldPct)}% of emissions are from buildings. Target lower EUI for major program types.` });
  } else {
    signals.push({ tone: 'good', icon: 'building', title: 'Buildings performing well', body: `${Math.round(bldPct)}% building share is within a healthy range for this program mix.` });
  }

  if (gridFactor > 0.5) {
    signals.push({ tone: 'info', icon: 'leaf', title: 'High-carbon grid detected', body: `Grid factor is ${gridFactor.toFixed(3)} kgCO₂e/kWh. Renewable energy or on-site generation would have a major impact.` });
  } else {
    signals.push({ tone: 'info', icon: 'leaf', title: 'Renewables can still help', body: `Even with a ${gridFactor.toFixed(3)} kgCO₂e/kWh grid, increasing renewable share to 25% could reduce emissions by ~8%.` });
  }

  return signals.slice(0, 3);
}

type Props = { result: CalculationResult };

export default function SignalsPanel({ result }: Props) {
  const signals = buildSignals(result);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(31,38,34,0.07)', borderRadius: 10, padding: '16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: '#fbf3df', color: '#c9a961', display: 'grid', placeItems: 'center' }}>
          <Icon name="bulb" size={14} />
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, color: '#3d4a44', textTransform: 'uppercase' }}>Design Signals</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {signals.map((s, i) => {
          const t = TONES[s.tone];
          return (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', border: `1px solid ${t.border}`, background: t.bg, transition: 'all .15s' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, background: '#fff', color: t.iconColor, border: `1px solid ${t.border}` }}>
                <Icon name={s.icon} size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e3128', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: '#6b7670', lineHeight: 1.5 }}>{s.body}</div>
              </div>
              <Icon name="chevron-right" size={14} color="#9aada4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
