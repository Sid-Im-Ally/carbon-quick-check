'use client';

import type { MobilityModeResult } from '@/types/carbon';
import { TRANSPORT_MODE_LABELS } from '@/data/mobilityProfiles';
import { formatModeShare, formatNumber, formatEmissionsShort } from '@/lib/formatting';

type Props = {
  modes: MobilityModeResult[];
  profileLabel: string;
};

export default function MobilityBreakdownTable({ modes, profileLabel }: Props) {
  const sorted = [...modes].sort((a, b) => b.emissionsTCO2e - a.emissionsTCO2e);
  const totalEmissions = modes.reduce((s, r) => s + r.emissionsTCO2e, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
          {profileLabel}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2.5 pr-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mode</th>
              <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Share</th>
              <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Avg Trip (km)</th>
              <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Trips/yr</th>
              <th className="text-right py-2.5 pl-2 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">tCO2e/yr</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr key={row.mode} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2.5 pr-3 text-gray-700 font-medium whitespace-nowrap">
                  {TRANSPORT_MODE_LABELS[row.mode] ?? row.mode}
                </td>
                <td className="py-2.5 px-2 text-right text-gray-600 tabular-nums">{formatModeShare(row.modeShare)}</td>
                <td className="py-2.5 px-2 text-right text-gray-600 tabular-nums">{row.averageTripLengthKm.toFixed(1)}</td>
                <td className="py-2.5 px-2 text-right text-gray-600 tabular-nums">{formatNumber(Math.round(row.tripsPerYear))}</td>
                <td className="py-2.5 pl-2 text-right font-semibold text-gray-800 tabular-nums">{formatEmissionsShort(row.emissionsTCO2e)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50">
              <td className="py-2.5 pr-3 text-sm font-semibold text-gray-800">Total</td>
              <td className="py-2.5 px-2" />
              <td className="py-2.5 px-2" />
              <td className="py-2.5 px-2" />
              <td className="py-2.5 pl-2 text-right text-sm font-semibold text-sky-600 tabular-nums">{formatEmissionsShort(totalEmissions)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
