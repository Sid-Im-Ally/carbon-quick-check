'use client';

import Icon, { type IconName } from './Icon';

export type NavTab = 'overview' | 'scenarios' | 'comparison' | 'reports' | 'assumptions' | 'help';

type NavItem = { key: NavTab; label: string; icon: IconName; disabled?: boolean };

const NAV_ITEMS: NavItem[] = [
  { key: 'overview',    label: 'Overview',    icon: 'gauge' },
  { key: 'scenarios',   label: 'Scenarios',   icon: 'layers',   disabled: true },
  { key: 'comparison',  label: 'Comparison',  icon: 'bars',     disabled: true },
  { key: 'reports',     label: 'Reports',     icon: 'doc',      disabled: true },
  { key: 'assumptions', label: 'Assumptions', icon: 'settings', disabled: true },
  { key: 'help',        label: 'Help',        icon: 'help',     disabled: true },
];

type Props = { activeTab: NavTab; onTabChange: (t: NavTab) => void };

export default function SidebarNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ background: '#1e3128', color: '#cfd8d2', display: 'flex', flexDirection: 'column', padding: '20px 0', width: 76, flexShrink: 0 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#5a7a5a', margin: '0 auto 28px', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
        CQ
      </div>

      <div style={{ flex: 1 }}>
        {NAV_ITEMS.map(it => {
          const active = it.key === activeTab;
          return (
            <div
              key={it.key}
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
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', marginInline: 'auto', width: 32, height: 32, borderRadius: '50%', background: '#3a5446', color: '#cfd8d2', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>
        AK
      </div>
    </div>
  );
}
