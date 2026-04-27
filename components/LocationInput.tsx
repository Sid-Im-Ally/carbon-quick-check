'use client';

import { useState, useCallback } from 'react';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';

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
  const [city, setCity]       = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [resolved, setResolved] = useState<ResolvedData | null>(null);

  const canResolve = city.trim().length > 0 && country.trim().length > 0;

  const resolve = useCallback(async () => {
    if (!canResolve || loading) return;
    const query = `${city.trim()}, ${country.trim()}`;

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
  }, [city, country, canResolve, loading, onResolved]);

  const fieldStyle = {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid rgba(31,38,34,0.1)',
    borderRadius: 6,
    background: '#fbfaf6',
    fontSize: 12.5,
    color: '#1f2622',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
        <div>
          <label style={{ fontSize: 11, color: '#9aada4', display: 'block', marginBottom: 3 }}>City</label>
          <input
            type="text"
            value={city}
            onChange={e => { setCity(e.target.value); setResolved(null); }}
            onKeyDown={e => e.key === 'Enter' && resolve()}
            placeholder="Dubai"
            style={fieldStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#9aada4', display: 'block', marginBottom: 3 }}>
            Country
            {loading && <span style={{ marginLeft: 6, color: '#c9a961' }}>Resolving…</span>}
          </label>
          <input
            type="text"
            value={country}
            onChange={e => { setCountry(e.target.value); setResolved(null); }}
            onBlur={resolve}
            onKeyDown={e => e.key === 'Enter' && resolve()}
            placeholder="UAE"
            style={fieldStyle}
          />
        </div>
      </div>

      {(error || resolveError) && (
        <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{error ?? resolveError}</p>
      )}

      {resolved && (
        <div style={{ marginTop: 6, padding: '8px 10px', background: '#eef4ee', border: '1px solid #d6e3d6', borderRadius: 7, fontSize: 11.5, color: '#3d4a44' }}>
          ✓ {resolved.location.formattedAddress ?? `${resolved.location.city}, ${resolved.location.country}`}
        </div>
      )}
    </div>
  );
}
