'use client';

import type { MobilityScoringResult } from '@/types/mobility';

type Props = {
  scoring: MobilityScoringResult;
};

const PROFILE_LABELS: Record<string, string> = {
  auto_oriented: 'Auto-oriented',
  balanced: 'Balanced',
  transit_oriented: 'Transit-oriented',
};

const PROFILE_COLORS: Record<string, string> = {
  auto_oriented: 'bg-red-50 text-red-700 border-red-200',
  balanced: 'bg-amber-50 text-amber-700 border-amber-200',
  transit_oriented: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

type ScoreRow = {
  label: string;
  value: number;
  note?: string;
};

export function MobilityScoringPanel({ scoring }: Props) {
  const rows: ScoreRow[] = [
    { label: 'Parking provision (×2)', value: scoring.parkingWeightedScore, note: 'double-weighted' },
    { label: 'Transit access (×2)', value: scoring.transitWeightedScore, note: 'double-weighted' },
    { label: 'Mobility culture', value: scoring.mobilityCultureScore },
    { label: 'Catchment type', value: scoring.catchmentScore },
    { label: 'Expected arrival mode', value: scoring.arrivalModeScore },
    { label: 'Density modifier', value: scoring.densityModifier, note: 'context adjustment' },
    { label: 'Geographic context modifier', value: scoring.geographicContextModifier, note: 'context adjustment' },
    { label: 'Project type modifier', value: scoring.projectTypeModifier, note: 'context adjustment' },
  ];

  const profileClass = PROFILE_COLORS[scoring.assignedProfile] ?? PROFILE_COLORS.balanced;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-800">Mobility scoring breakdown</p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${profileClass}`}>
          {PROFILE_LABELS[scoring.assignedProfile]}
        </span>
      </div>

      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {rows.map(row => (
            <tr key={row.label} className="px-4">
              <td className="px-4 py-2 text-gray-600">
                {row.label}
                {row.note && (
                  <span className="ml-1.5 text-xs text-gray-400">({row.note})</span>
                )}
              </td>
              <td className="px-4 py-2 text-right font-mono font-medium text-gray-800">
                {row.value > 0 ? `+${row.value}` : row.value}
              </td>
            </tr>
          ))}

          <tr className="bg-gray-50 font-semibold">
            <td className="px-4 py-2.5 text-gray-800">Final mobility score</td>
            <td className="px-4 py-2.5 text-right font-mono text-gray-900">{scoring.finalScore}</td>
          </tr>
        </tbody>
      </table>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Thresholds: ≤7 → auto-oriented · 7–15 → balanced · ≥15 → transit-oriented
        </p>
      </div>
    </div>
  );
}
