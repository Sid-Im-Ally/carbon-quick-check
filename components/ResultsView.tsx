'use client';

import type { CalculationResult } from '@/types/carbon';
import { MOBILITY_PROFILES } from '@/data/mobilityProfiles';
import EmissionsSummaryCards from './EmissionsSummaryCards';
import EmissionsBreakdownChart from './EmissionsBreakdownChart';
import BuildingBreakdownTable from './BuildingBreakdownTable';
import MobilityBreakdownTable from './MobilityBreakdownTable';
import AssumptionsPanel from './AssumptionsPanel';
import { MobilityScoringPanel } from './MobilityScoringPanel';

type Props = {
  result: CalculationResult;
  onReset: () => void;
  onEditInputs: () => void;
};

export default function ResultsView({ result, onReset, onEditInputs }: Props) {
  const profileData = MOBILITY_PROFILES[result.mobilityScoring.assignedProfile];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{result.projectName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {result.location.formattedAddress ?? [result.location.city, result.location.country].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={onEditInputs}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit Inputs
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Run Another Scenario
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <EmissionsSummaryCards result={result} />

      {/* Emissions breakdown chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <EmissionsBreakdownChart result={result} />
      </div>

      {/* Building + Mobility tables side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Building Operational Carbon</h3>
          <BuildingBreakdownTable buildings={result.buildingResults} />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Mobility Carbon</h3>
          <MobilityBreakdownTable
            modes={result.mobilityResults}
            profileLabel={profileData.label}
          />
        </div>
      </div>

      {/* Mobility scoring breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mobility Profile Scoring</h3>
        <MobilityScoringPanel scoring={result.mobilityScoring} />
      </div>

      {/* Assumptions panel */}
      <AssumptionsPanel result={result} />

      {/* Methodology note */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Methodology Note</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Carbon Quick Check provides early-stage operational carbon estimates for scenario comparison.
          Results are based on default assumptions for building energy use, grid carbon intensity, mobility behavior,
          and shared infrastructure operations. These outputs should be used for planning conversations and should
          be replaced with project-specific engineering, transportation, and energy modeling as the design progresses.
        </p>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 justify-end pb-6">
        <button
          type="button"
          onClick={onEditInputs}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit Inputs
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Run Another Scenario
        </button>
      </div>
    </div>
  );
}
