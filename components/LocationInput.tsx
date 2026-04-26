'use client';

import { useState } from 'react';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { DataQualityBadge } from './DataQualityBadge';

type ResolvedData = {
  location: ResolvedLocation;
  climate: KoppenClimateResult;
  grid: GridEmissionResult;
};

type Props = {
  onResolved: (data: ResolvedData) => void;
  error?: string;
};

export function LocationInput({ onResolved, error }: Props) {
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [resolved, setResolved] = useState<ResolvedData | null>(null);

  function buildQuery() {
    return [city.trim(), zipcode.trim(), country.trim()].filter(Boolean).join(', ');
  }

  async function handleResolve() {
    const query = buildQuery();
    if (!query) return;

    setLoading(true);
    setResolveError('');
    setResolved(null);

    try {
      const locRes = await fetch('/api/location/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query }),
      });

      if (!locRes.ok) {
        const err = await locRes.json();
        throw new Error(err.error ?? 'Could not resolve location');
      }

      const location: ResolvedLocation = await locRes.json();

      const [climateRes, gridRes] = await Promise.all([
        fetch('/api/climate/koppen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: location.latitude, longitude: location.longitude, location }),
        }),
        fetch('/api/grid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        }),
      ]);

      const climate: KoppenClimateResult = await climateRes.json();
      const grid: GridEmissionResult = await gridRes.json();

      const data: ResolvedData = { location, climate, grid };
      setResolved(data);
      onResolved(data);
    } catch (err) {
      setResolveError(err instanceof Error ? err.message : 'Failed to resolve location');
    } finally {
      setLoading(false);
    }
  }

  const canResolve = !!(city.trim() || zipcode.trim()) && !!country.trim();

  const fieldClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white';

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Project location</p>

      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3">
          <label className="text-xs text-gray-500 mb-1 block">City</label>
          <input
            type="text"
            value={city}
            onChange={e => { setCity(e.target.value); setResolved(null); }}
            placeholder="Boston"
            className={fieldClass}
          />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-500 mb-1 block">Zip / Postal code</label>
          <input
            type="text"
            value={zipcode}
            onChange={e => { setZipcode(e.target.value); setResolved(null); }}
            placeholder="02101"
            className={fieldClass}
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">Country</label>
          <input
            type="text"
            value={country}
            onChange={e => { setCountry(e.target.value); setResolved(null); }}
            onKeyDown={e => e.key === 'Enter' && canResolve && handleResolve()}
            placeholder="United States"
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleResolve}
        disabled={loading || !canResolve}
        className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-emerald-600 transition-colors"
      >
        {loading ? 'Resolving…' : 'Resolve location'}
      </button>

      {(error || resolveError) && (
        <p className="text-sm text-red-600">{error ?? resolveError}</p>
      )}

      {resolved && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-sky-900">
                {resolved.location.formattedAddress ?? resolved.location.city ?? resolved.location.country}
              </p>
              <p className="text-xs text-sky-700 mt-0.5">
                {resolved.location.latitude.toFixed(4)}, {resolved.location.longitude.toFixed(4)}
                {' · '}source: {resolved.location.source}
              </p>
            </div>
            <DataQualityBadge confidence={resolved.location.confidence} />
          </div>

          <hr className="border-sky-200" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-sky-800 mb-0.5">Climate zone</p>
              <p className="text-sm font-medium text-sky-900">
                {resolved.climate.climateZone}
                <span className="font-normal text-sky-700"> — {resolved.climate.climateLabel}</span>
              </p>
              <DataQualityBadge confidence={resolved.climate.confidence} />
              {resolved.climate.notes && (
                <p className="text-xs text-sky-600 mt-1">{resolved.climate.notes}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-sky-800 mb-0.5">Grid emission factor</p>
              <p className="text-sm font-medium text-sky-900">
                {resolved.grid.gridFactorKgCO2ePerKwh.toFixed(3)}
                <span className="font-normal text-sky-700"> kgCO₂e/kWh</span>
              </p>
              <DataQualityBadge confidence={resolved.grid.confidence} />
              <p className="text-xs text-sky-600 mt-1">{resolved.grid.sourceDetail}</p>
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
