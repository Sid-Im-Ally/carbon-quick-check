'use client';

import { useState } from 'react';
import type { CalculationResult } from '@/types/carbon';
import { MOBILITY_PROFILES } from '@/data/mobilityProfiles';
import { DataQualityBadge } from './DataQualityBadge';

type Props = {
  result: CalculationResult;
};

export default function AssumptionsPanel({ result }: Props) {
  const [open, setOpen] = useState(false);
  const profileData = MOBILITY_PROFILES[result.mobilityScoring.assignedProfile];
  const hasFallbacks =
    result.climate.confidence === 'fallback' || result.grid.confidence === 'fallback';
  const allWarnings = [...result.warnings, ...result.assumptionsNotes];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Assumptions &amp; Data Sources</span>
          {hasFallbacks && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Fallbacks used
            </span>
          )}
        </div>
        <svg
          className={['w-4 h-4 text-gray-400 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 py-5 bg-white border-t border-gray-200 space-y-5">
          {allWarnings.length > 0 && (
            <div className="space-y-1.5">
              {allWarnings.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}

          {/* Location */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <Row label="Resolved address" value={result.location.formattedAddress ?? result.location.input} />
              <Row label="Coordinates" value={`${result.location.latitude.toFixed(4)}, ${result.location.longitude.toFixed(4)}`} />
              <Row label="Geocoding source" value={result.location.source} />
              <RowWithBadge label="Location confidence" confidence={result.location.confidence} />
            </div>
          </section>

          {/* Climate */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Climate</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <Row label="Köppen zone" value={`${result.climate.climateZone} — ${result.climate.climateLabel}`} />
              <Row label="Climate source" value={result.climate.source} />
              <RowWithBadge label="Climate confidence" confidence={result.climate.confidence} />
            </div>
          </section>

          {/* Grid */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Grid</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <Row label="Emission factor" value={`${result.grid.gridFactorKgCO2ePerKwh.toFixed(3)} kgCO₂e/kWh`} />
              <Row label="Source" value={result.grid.sourceDetail} />
              <Row label="Geography level" value={result.grid.geographyLevel} />
              <Row label="Boundary" value={result.grid.emissionsBoundary} />
              {result.grid.year && <Row label="Data year" value={String(result.grid.year)} />}
              <RowWithBadge label="Grid confidence" confidence={result.grid.confidence} />
            </div>
          </section>

          {/* Mobility */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mobility</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <Row label="Assigned profile" value={profileData.label} />
              <Row label="Trips per person per day" value={profileData.tripsPerPersonPerDay.toFixed(1)} />
            </div>
          </section>

          {/* Site */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Site</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <Row label="Site area" value={`${result.density.siteAreaHectares.toFixed(2)} ha`} />
              <Row label="Population density" value={`${result.density.densityPeoplePerHa.toFixed(1)} ppl/ha (${result.density.densityCategory})`} />
              <Row label="Density modifier" value={`${result.density.densityModifier >= 0 ? '+' : ''}${result.density.densityModifier}`} />
              <Row label="Infrastructure allowance" value={`${((result.infrastructureEmissionsTCO2e / (result.buildingEmissionsTCO2e || 1)) * 100).toFixed(0)}% of building emissions`} />
            </div>
          </section>

          <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            All EUI values are placeholder estimates for early-stage planning only.
            Grid factors and climate zone are sourced from authoritative data where available, with automatic fallback.
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function RowWithBadge({ label, confidence }: { label: string; confidence: 'high' | 'medium' | 'low' | 'fallback' | 'manual' }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <DataQualityBadge confidence={confidence} />
    </div>
  );
}
