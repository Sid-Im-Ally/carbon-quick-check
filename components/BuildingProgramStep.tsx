'use client';

import type { CarbonQuickCheckInput, FrontendProgramArea } from '@/types/carbon';
import NumberInput from './NumberInput';

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
};

const PROGRAM_ROWS: Array<{ key: keyof FrontendProgramArea; label: string }> = [
  { key: 'residential', label: 'Residential' },
  { key: 'office', label: 'Office' },
  { key: 'retail', label: 'Retail' },
  { key: 'hospitality', label: 'Hospitality' },
  { key: 'educational', label: 'Educational' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'industrial', label: 'Industrial' },
  { key: 'institutional', label: 'Institutional / Other' },
];

export default function BuildingProgramStep({ data, onChange, errors }: Props) {
  const areas = data.programAreas ?? {
    residential: 0, office: 0, retail: 0, hospitality: 0,
    educational: 0, healthcare: 0, industrial: 0, institutional: 0,
  };
  const totalBuilt = data.totalBuiltAreaM2 ?? 0;
  const totalProgram = Object.values(areas).reduce((s, v) => s + (v || 0), 0);
  const difference = totalProgram - totalBuilt;
  const isOver = difference > 0;
  const isUnder = difference < -1;
  const progressPercent = totalBuilt > 0 ? Math.min((totalProgram / totalBuilt) * 100, 100) : 0;

  function updateArea(key: keyof FrontendProgramArea, value: number | '') {
    const newAreas = { ...areas, [key]: value === '' ? 0 : value };
    onChange({ programAreas: newAreas });
  }

  const singleFamilyPct = data.residentialSplit?.singleFamilyPercent ?? 20;
  const multifamilyPct = 100 - singleFamilyPct;
  const showResidentialSplit = (areas.residential ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Allocation bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Program area allocation</span>
          <span className={[
            'font-semibold tabular-nums',
            isOver ? 'text-red-600' : isUnder ? 'text-amber-600' : 'text-emerald-600',
          ].join(' ')}>
            {Math.round(totalProgram).toLocaleString()} / {Math.round(totalBuilt).toLocaleString()} m²
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={[
              'h-full rounded-full transition-all duration-300',
              isOver ? 'bg-red-500' : progressPercent > 90 ? 'bg-emerald-500' : 'bg-sky-400',
            ].join(' ')}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {isOver && (
          <p className="text-xs text-red-600 mt-1.5 font-medium">
            Program areas exceed total built area by {Math.round(difference).toLocaleString()} m². Reduce before continuing.
          </p>
        )}
        {isUnder && (
          <p className="text-xs text-amber-600 mt-1.5">
            {Math.round(-difference).toLocaleString()} m² unassigned. Calculation will use assigned areas only.
          </p>
        )}
        {!isOver && !isUnder && totalProgram > 0 && (
          <p className="text-xs text-emerald-600 mt-1.5 font-medium">Program areas match total built area.</p>
        )}
        {errors.programTotal && (
          <p className="text-xs text-red-600 mt-1.5">{errors.programTotal}</p>
        )}
      </div>

      {/* Program rows */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span>Program type</span>
          <span className="text-right pr-4">Area (m²)</span>
          <span className="text-right w-16">Share</span>
        </div>
        {PROGRAM_ROWS.map(({ key, label }) => {
          const areaValue = areas[key] || 0;
          const share = totalProgram > 0 ? (areaValue / totalProgram) * 100 : 0;
          return (
            <div
              key={key}
              className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700 font-medium">{label}</span>
              <div className="w-36 pr-4">
                <input
                  type="number"
                  min="0"
                  value={areaValue === 0 ? '' : areaValue}
                  placeholder="0"
                  onChange={e => {
                    const v = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    updateArea(key, isNaN(v) ? 0 : v);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>
              <span className="text-xs text-gray-400 w-16 text-right tabular-nums">
                {areaValue > 0 ? `${share.toFixed(1)}%` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Residential split */}
      {showResidentialSplit && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <p className="text-sm font-medium text-sky-800 mb-1">Residential split</p>
          <p className="text-xs text-sky-600 mb-3">
            How should the residential area ({Math.round(areas.residential ?? 0).toLocaleString()} m²) be split?
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-sky-700 mb-1 block">Single-family %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={singleFamilyPct}
                onChange={e => {
                  const pct = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                  onChange({
                    residentialSplit: {
                      singleFamilyPercent: pct,
                      multifamilyPercent: 100 - pct,
                    },
                  });
                }}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-sky-700 mb-1 block">Multifamily %</label>
              <div className="w-full border border-sky-100 rounded-lg px-3 py-2 text-sm bg-sky-100 text-sky-700 font-medium tabular-nums">
                {multifamilyPct}% (auto)
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-sky-700 mb-1 block">Total</label>
              <div className={[
                'w-full border rounded-lg px-3 py-2 text-sm font-medium',
                Math.abs(singleFamilyPct + multifamilyPct - 100) < 0.01
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700',
              ].join(' ')}>
                {singleFamilyPct + multifamilyPct}%
              </div>
            </div>
          </div>
          {errors.residentialSplit && (
            <p className="text-xs text-red-600 mt-2">{errors.residentialSplit}</p>
          )}
        </div>
      )}
    </div>
  );
}
