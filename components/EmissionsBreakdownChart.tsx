'use client';

import { useEffect, useState } from 'react';
import type { CalculationResult } from '@/types/carbon';
import { formatEmissionsShort, formatPercent } from '@/lib/formatting';

type Props = {
  result: CalculationResult;
};

type BarItem = {
  label: string;
  value: number;
  percent: number;
  color: string;
  trackColor: string;
};

export default function EmissionsBreakdownChart({ result }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  const items: BarItem[] = [
    {
      label: 'Buildings',
      value: result.buildingEmissionsTCO2e,
      percent: result.contributionPercentages.buildings,
      color: 'bg-emerald-500',
      trackColor: 'bg-emerald-100',
    },
    {
      label: 'Mobility',
      value: result.mobilityEmissionsTCO2e,
      percent: result.contributionPercentages.mobility,
      color: 'bg-sky-400',
      trackColor: 'bg-sky-100',
    },
    {
      label: 'Infrastructure',
      value: result.infrastructureEmissionsTCO2e,
      percent: result.contributionPercentages.infrastructure,
      color: 'bg-amber-400',
      trackColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">Annual emissions by source (tCO2e/yr)</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-28 shrink-0 font-medium">{item.label}</span>
            <div className={`flex-1 h-6 ${item.trackColor} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: animated ? `${item.percent}%` : '0%' }}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 w-40 justify-end">
              <span className="text-sm font-semibold text-gray-800 tabular-nums">
                {formatEmissionsShort(item.value)}
              </span>
              <span className="text-xs text-gray-400 tabular-nums w-10 text-right">
                {formatPercent(item.percent)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini legend */}
      <div className="flex flex-wrap gap-4 pt-1">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
