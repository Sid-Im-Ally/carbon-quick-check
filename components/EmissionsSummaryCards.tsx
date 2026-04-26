'use client';

import type { CalculationResult } from '@/types/carbon';
import { formatEmissionsShort, formatGhgPerCapitaShort, formatPercent } from '@/lib/formatting';
import { MOBILITY_PROFILES } from '@/data/mobilityProfiles';

type Props = {
  result: CalculationResult;
};

export default function EmissionsSummaryCards({ result }: Props) {
  const largestPct = Math.max(
    result.contributionPercentages.buildings,
    result.contributionPercentages.mobility,
    result.contributionPercentages.infrastructure,
  );
  const largestLabel =
    largestPct === result.contributionPercentages.buildings
      ? 'Buildings'
      : largestPct === result.contributionPercentages.mobility
      ? 'Mobility'
      : 'Infrastructure';

  const profileData = MOBILITY_PROFILES[result.mobilityScoring.assignedProfile];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total GHG */}
      <div className="col-span-2 lg:col-span-1 bg-emerald-500 rounded-2xl p-5 text-white">
        <p className="text-xs font-medium text-emerald-100 uppercase tracking-wide mb-1">Total Annual GHG</p>
        <p className="text-3xl font-bold tabular-nums leading-tight">
          {formatEmissionsShort(result.totalEmissionsTCO2e)}
        </p>
        <p className="text-sm text-emerald-100 mt-1">tCO2e / year</p>
      </div>

      {/* GHG per capita */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">GHG per Capita</p>
        <p className="text-2xl font-bold text-gray-900 tabular-nums leading-tight">
          {formatGhgPerCapitaShort(result.ghgPerCapitaTCO2e)}
        </p>
        <p className="text-sm text-gray-500 mt-1">tCO2e / person / yr</p>
      </div>

      {/* Largest contributor */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Largest Contributor</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{largestLabel}</p>
        <p className="text-sm text-gray-500 mt-1">{formatPercent(largestPct)} of total</p>
      </div>

      {/* Mobility profile */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Mobility Profile</p>
        <p className="text-sm font-bold text-gray-900 leading-snug">{profileData.label}</p>
        <p className="text-xs text-gray-500 mt-1">Score: {result.mobilityScoring.finalScore.toFixed(1)}</p>
      </div>
    </div>
  );
}
