'use client';

import { useEffect, useState } from 'react';

export type BarItem = {
  label: string;
  value: number;
  formattedValue: string;
  color?: string;
};

type Props = {
  items: BarItem[];
  unit?: string;
  maxValue?: number;
};

export default function HorizontalBarList({ items, unit, maxValue }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const max = maxValue ?? Math.max(...items.map(i => i.value), 1);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const pct = Math.max((item.value / max) * 100, 0);
        const color = item.color ?? '#10b981';
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 truncate max-w-[55%]">{item.label}</span>
              <span className="text-xs font-semibold text-gray-800 tabular-nums">
                {item.formattedValue}
                {unit && <span className="font-normal text-gray-400 ml-1">{unit}</span>}
              </span>
            </div>
            <div className="h-5 bg-gray-100 rounded-md overflow-hidden">
              <div
                className="h-full rounded-md transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  backgroundColor: color,
                  minWidth: item.value > 0 ? '4px' : '0',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
