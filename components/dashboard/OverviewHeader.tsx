'use client';

import Icon from './Icon';

type Props = {
  onShare: () => void;
  onReset: () => void;
  onSaveScenario: () => void;
  shareMessage?: string;
  canSave: boolean;
  scenarioCount: number;
};

const pill = { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 6, background: 'transparent', border: '1px solid transparent', color: '#3d4a44', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' } as const;
const pillActive = { ...pill, background: '#fff', border: '1px solid rgba(31,38,34,0.1)', color: '#1f2622', boxShadow: '0 1px 0 rgba(0,0,0,0.02)' } as const;

export default function OverviewHeader({ onShare, onReset, onSaveScenario, shareMessage, canSave, scenarioCount }: Props) {
  const atLimit = scenarioCount >= 3;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 14px', borderBottom: '1px solid rgba(31,38,34,0.06)', background: '#f6f3ec', flexShrink: 0 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1.6, color: '#1e3128', margin: 0 }}>CARBON QUICKCHECK</h1>
        <div style={{ fontSize: 12, color: '#6b7670', marginTop: 2, letterSpacing: 0.2 }}>Early-Stage GHG Estimator for Master Plans</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          onClick={onSaveScenario}
          disabled={!canSave || atLimit}
          title={atLimit ? 'Maximum 3 scenarios saved. Delete one to save a new one.' : !canSave ? 'Run a calculation first' : 'Save current result as a scenario'}
          style={{
            ...pillActive,
            background: canSave && !atLimit ? '#5a7a5a' : '#fff',
            color: canSave && !atLimit ? '#fff' : '#9aada4',
            borderColor: canSave && !atLimit ? '#5a7a5a' : 'rgba(31,38,34,0.1)',
            cursor: canSave && !atLimit ? 'pointer' : 'default',
            fontFamily: 'inherit',
          }}
        >
          <Icon name="save" size={14} color={canSave && !atLimit ? '#fff' : '#9aada4'} />
          Save Scenario
          {scenarioCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, background: canSave && !atLimit ? 'rgba(255,255,255,0.25)' : 'rgba(31,38,34,0.07)', borderRadius: 10, padding: '0 5px', lineHeight: '16px', display: 'inline-block', color: canSave && !atLimit ? '#fff' : '#9aada4' }}>
              {scenarioCount}/3
            </span>
          )}
        </button>
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
