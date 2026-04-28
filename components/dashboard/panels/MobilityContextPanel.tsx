'use client';

import type { CarbonQuickCheckInput } from '@/types/carbon';
import type { MobilityProfileType } from '@/types/mobility';
import { MOBILITY_PROFILES } from '@/data/mobilityProfiles';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
};

const PROFILES: { key: MobilityProfileType; color: string; bg: string; accentBorder: string }[] = [
  { key: 'auto_oriented',    color: '#b45309', bg: '#fdf3ea', accentBorder: '#e8954a' },
  { key: 'balanced',         color: '#1a6b8a', bg: '#e8f4fb', accentBorder: '#1a6b8a' },
  { key: 'transit_oriented', color: '#3a6b3a', bg: '#eef4ee', accentBorder: '#5a7a5a' },
];

// Short display labels for mode split rows
const MODE_LABELS: Record<string, string> = {
  car:               'Car',
  transit:           'Transit',
  walk:              'Walking',
  bike_micromobility:'Cycling / Micro',
  taxi_ridehail:     'Taxi / Ridehail',
  other:             'Other',
};

const MODE_ORDER = ['car', 'transit', 'walk', 'bike_micromobility', 'taxi_ridehail', 'other'] as const;

export default function MobilityContextPanel({ data, onChange, errors }: Props) {
  const selected = data.selectedMobilityProfile;

  return (
    <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {PROFILES.map(({ key, color, bg, accentBorder }) => {
        const profile = MOBILITY_PROFILES[key];
        const isSelected = selected === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange({ selectedMobilityProfile: key })}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '14px 16px',
              borderRadius: 10,
              border: `1.5px solid ${isSelected ? accentBorder : 'rgba(31,38,34,0.08)'}`,
              background: isSelected ? bg : '#fff',
              cursor: 'pointer',
              transition: 'border-color .15s, background .15s',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          >
            {/* Pill header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 700, padding: '3px 10px',
                borderRadius: 20, background: isSelected ? bg : '#f3efe6',
                color: isSelected ? color : '#6b7670',
                border: `1px solid ${isSelected ? accentBorder : 'transparent'}`,
                transition: 'all .15s',
              }}>
                {isSelected && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {profile.label}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 11, color: '#9aada4', margin: '0 0 10px', lineHeight: 1.5 }}>
              {profile.description}
            </p>

            {/* Mode split table */}
            <div style={{ borderTop: '1px solid rgba(31,38,34,0.06)', paddingTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: '#9aada4', textTransform: 'uppercase', marginBottom: 6 }}>
                Mode Split
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                {MODE_ORDER.map(mode => {
                  const share = Math.round(profile.modeSplit[mode] * 100);
                  if (share === 0) return null;
                  return (
                    <div key={mode} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '1px 0' }}>
                      <span style={{ color: '#6b7670' }}>{MODE_LABELS[mode]}</span>
                      <strong style={{ color: isSelected ? color : '#1e3128', fontVariantNumeric: 'tabular-nums' }}>{share}%</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </button>
        );
      })}

      {errors.selectedMobilityProfile && (
        <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.selectedMobilityProfile}</p>
      )}
    </div>
  );
}
