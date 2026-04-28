'use client';

import type { CarbonQuickCheckInput, GeographicContext, ProjectType, SiteAreaUnit } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { DEFAULT_INFRA_ALLOWANCE_PERCENT, INFRA_ALLOWANCE_OPTIONS } from '@/data/infrastructureAssumptions';
import NumberInput from './NumberInput';
import SelectField from './SelectField';
import { LocationInput } from './LocationInput';
import { formatDensity } from '@/lib/formatting';
import { calculateDensity } from '@/lib/mobilityScoring';
import { m2ToHectares } from '@/lib/unitConversions';

type ResolvedData = {
  location: ResolvedLocation;
  climate: KoppenClimateResult | null;
  grid: GridEmissionResult;
};

type Props = {
  data: Partial<CarbonQuickCheckInput>;
  onChange: (updates: Partial<CarbonQuickCheckInput>) => void;
  errors: Record<string, string>;
  onLocationResolved: (data: ResolvedData) => void;
};

const GEOGRAPHIC_CONTEXT_OPTIONS = [
  { value: 'urban_core', label: 'Urban Core', description: 'Dense city center or CBD with strong urban infrastructure.' },
  { value: 'urban_inner_ring', label: 'Urban / Inner Ring', description: 'Medium-density city fabric, mixed-use districts, or transitional urban areas.' },
  { value: 'suburban_edge', label: 'Suburban Edge', description: 'Lower-density, car-oriented surroundings at the edge of a city.' },
  { value: 'peri_urban_fringe', label: 'Peri-Urban / Fringe', description: 'Transitional growth area between urban and rural conditions.' },
  { value: 'greenfield_undeveloped', label: 'Greenfield / Undeveloped Land', description: 'Largely undeveloped land with limited existing urban infrastructure.' },
];

const PROJECT_TYPE_OPTIONS = [
  { value: 'infill_redevelopment', label: 'Infill / Redevelopment', description: 'Development within an already urbanized area.' },
  { value: 'greenfield_development', label: 'Greenfield Development', description: 'New development on mostly undeveloped land.' },
  { value: 'campus_planned_district', label: 'Campus / Planned District', description: 'University, institutional, corporate, or master-planned district.' },
];

export default function ProjectDetailsStep({ data, onChange, errors, onLocationResolved }: Props) {
  const siteAreaHectares =
    data.siteAreaValue != null && data.siteAreaValue > 0
      ? data.siteAreaUnit === 'hectares'
        ? data.siteAreaValue
        : m2ToHectares(data.siteAreaValue)
      : null;

  const density =
    data.totalPopulation != null &&
    data.totalPopulation > 0 &&
    siteAreaHectares != null &&
    siteAreaHectares > 0
      ? calculateDensity(
          data.totalPopulation,
          data.siteAreaUnit === 'hectares' ? data.siteAreaValue! * 10000 : data.siteAreaValue!,
        )
      : null;

  function handleResolved(resolved: ResolvedData) {
    onChange({
      locationInput: resolved.location.formattedAddress ?? resolved.location.input,
    });
    onLocationResolved(resolved);
  }

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
          Project name
        </label>
        <input
          id="projectName"
          type="text"
          value={data.projectName ?? ''}
          placeholder="Sample District"
          onChange={e => onChange({ projectName: e.target.value })}
          className={[
            'mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            errors.projectName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
          ].join(' ')}
        />
        {errors.projectName && (
          <p className="text-xs text-red-600 mt-1">{errors.projectName}</p>
        )}
      </div>

      {/* Location — resolved via geocoding */}
      <LocationInput
        onResolved={handleResolved}
        error={errors.locationInput}
      />

      {/* Population + Built Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <NumberInput
            id="population"
            label="Total population"
            value={data.totalPopulation ?? ''}
            onChange={v => onChange({ totalPopulation: v === '' ? 0 : v })}
            min={1}
            error={errors.totalPopulation}
            placeholder="5,000"
          />
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Residents, workers, students, or regular daily users depending on project type.
          </p>
        </div>
        <NumberInput
          id="totalBuiltArea"
          label="Total built area"
          value={data.totalBuiltAreaM2 ?? ''}
          onChange={v => onChange({ totalBuiltAreaM2: v === '' ? 0 : v })}
          unit="m²"
          min={1}
          error={errors.totalBuiltAreaM2}
          placeholder="100,000"
        />
      </div>

      {/* Site Area */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Site area</p>
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <NumberInput
              id="siteArea"
              label=""
              value={data.siteAreaValue ?? ''}
              onChange={v => onChange({ siteAreaValue: v === '' ? 0 : v })}
              min={1}
              error={errors.siteAreaValue}
              placeholder="20"
            />
          </div>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0">
            {(['m2', 'hectares'] as SiteAreaUnit[]).map(unit => (
              <button
                key={unit}
                type="button"
                onClick={() => onChange({ siteAreaUnit: unit })}
                className={[
                  'px-3 py-2 text-sm font-medium transition-colors',
                  data.siteAreaUnit === unit
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50',
                ].join(' ')}
              >
                {unit === 'm2' ? 'm²' : 'ha'}
              </button>
            ))}
          </div>
        </div>

        {density && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Calculated density:</span>
            <span className="font-semibold text-gray-800">{formatDensity(density.densityPeoplePerHa)}</span>
            <span className={[
              'text-xs px-2 py-0.5 rounded-full font-medium',
              density.densityCategory === 'high'
                ? 'bg-emerald-100 text-emerald-700'
                : density.densityCategory === 'medium'
                ? 'bg-sky-100 text-sky-700'
                : 'bg-gray-100 text-gray-600',
            ].join(' ')}>
              {density.densityCategory.charAt(0).toUpperCase() + density.densityCategory.slice(1)} density
            </span>
          </div>
        )}
      </div>

      {/* Geographic Context + Project Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Geographic context"
          value={data.geographicContext ?? ''}
          onChange={v => onChange({ geographicContext: v as GeographicContext })}
          options={GEOGRAPHIC_CONTEXT_OPTIONS}
          error={errors.geographicContext}
          helpText="What surrounds the project site?"
        />
        <SelectField
          label="Project type"
          value={data.projectType ?? ''}
          onChange={v => onChange({ projectType: v as ProjectType })}
          options={PROJECT_TYPE_OPTIONS}
          error={errors.projectType}
          helpText="What kind of development is being proposed?"
        />
      </div>

      {/* Infrastructure Allowance */}
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Shared infrastructure operational allowance
          <span className="ml-2 text-xs font-normal text-gray-400">Advanced</span>
        </p>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Early-stage allowance for shared infrastructure loads: lighting, pumping, controls, and common systems.
          Not embodied carbon — operational only.
        </p>
        <div className="flex flex-wrap gap-2">
          {INFRA_ALLOWANCE_OPTIONS.map(pct => (
            <button
              key={pct}
              type="button"
              onClick={() => onChange({ infrastructureAllowancePercent: pct })}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                data.infrastructureAllowancePercent === pct
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300',
              ].join(' ')}
            >
              {pct}%
              {pct === DEFAULT_INFRA_ALLOWANCE_PERCENT && (
                <span className="ml-1 text-xs opacity-70">default</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
