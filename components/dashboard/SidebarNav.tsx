'use client';

import { useEffect, useState } from 'react';
import Icon, { type IconName } from './Icon';

export type NavTab = 'overview' | 'scenarios' | 'comparison' | 'reports' | 'assumptions' | 'help';

type NavItem = { key: NavTab; label: string; icon: IconName; disabled?: boolean };

const NAV_ITEMS: NavItem[] = [
  { key: 'overview',    label: 'Overview',    icon: 'gauge' },
  { key: 'scenarios',   label: 'Scenarios',   icon: 'layers' },
  { key: 'assumptions', label: 'Assumptions', icon: 'settings' },
  { key: 'comparison',  label: 'Comparison',  icon: 'bars',     disabled: true },
  { key: 'reports',     label: 'Reports',     icon: 'doc',      disabled: true },
  { key: 'help',        label: 'Help',        icon: 'help',     disabled: true },
];

type Props = {
  activeTab: NavTab;
  onTabChange: (t: NavTab) => void;
  flashTab?: NavTab | null;
  flashMessage?: string;
};

export default function SidebarNav({ activeTab, onTabChange, flashTab, flashMessage }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!flashTab) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [flashTab, flashMessage]);

  return (
    <div style={{ background: '#1e3128', color: '#cfd8d2', display: 'flex', flexDirection: 'column', padding: '20px 0', width: 76, flexShrink: 0, position: 'relative', zIndex: 10 }}>
      <div style={{ width: 36, height: 36, margin: '0 auto 28px', display: 'grid', placeItems: 'center' }}>
        <img src="/logoicon.png" alt="Carbon Quick Check" style={{ width: 36, height: 36, objectFit: 'contain' }} />
      </div>

      <div style={{ flex: 1 }}>
        {NAV_ITEMS.map(it => {
          const active = it.key === activeTab;
          const isFlash = it.key === flashTab && visible;

          return (
            <div key={it.key} style={{ position: 'relative' }}>
              <div
                onClick={() => !it.disabled && onTabChange(it.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '12px 4px', margin: '0 8px 4px', borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: active ? '#fff' : '#9aada4',
                  cursor: it.disabled ? 'default' : 'pointer',
                  fontSize: 10, letterSpacing: 0.3,
                  opacity: it.disabled ? 0.45 : 1,
                  transition: 'all .15s',
                }}
              >
                <Icon name={it.icon} size={22} stroke={1.5} />
                <span>{it.label}</span>
              </div>

              {/* Flash tooltip */}
              {isFlash && (
                <div style={{
                  position: 'absolute',
                  left: 'calc(100% + 10px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#1e3128',
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: '7px 11px',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  animation: 'tooltipIn 0.18s ease',
                  zIndex: 100,
                }}>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderRight: '6px solid #fff',
                  }} />
                  {flashMessage ?? 'Scenario saved'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', marginInline: 'auto', width: 32, height: 32, borderRadius: '50%', background: '#3a5446', color: '#cfd8d2', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>
        AK
      </div>

      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  );
}
