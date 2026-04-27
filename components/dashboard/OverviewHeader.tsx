'use client';

import { useState } from 'react';
import Icon from './Icon';

type Props = {
  onShare: () => void;
  onReset: () => void;
  shareMessage?: string;
};

const pill = { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6, background: 'transparent', border: '1px solid transparent', color: '#3d4a44', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' } as const;
const pillActive = { ...pill, background: '#fff', border: '1px solid rgba(31,38,34,0.1)', color: '#1f2622', boxShadow: '0 1px 0 rgba(0,0,0,0.02)' } as const;

export default function OverviewHeader({ onShare, onReset, shareMessage }: Props) {
  const [saved] = useState(true);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 14px', borderBottom: '1px solid rgba(31,38,34,0.06)', background: '#f6f3ec', flexShrink: 0 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1.6, color: '#1e3128', margin: 0 }}>CARBON QUICKCHECK</h1>
        <div style={{ fontSize: 12, color: '#6b7670', marginTop: 2, letterSpacing: 0.2 }}>Early-Stage GHG Estimator for Master Plans</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ ...pill, color: saved ? '#5a7a5a' : '#3d4a44' }}>
          <Icon name="check" size={14} /> {saved ? 'All changes saved' : 'Saving…'}
        </div>
        <div style={pillActive}>
          <Icon name="save" size={14} /> Save Scenario
        </div>
        <div style={pillActive} onClick={onShare}>
          <Icon name="share" size={14} /> {shareMessage || 'Share'}
        </div>
        <div style={pill} onClick={onReset}>
          <Icon name="reset" size={14} /> Reset
        </div>
      </div>
    </div>
  );
}
