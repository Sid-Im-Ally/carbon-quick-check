'use client';

import { useState, useEffect } from 'react';
import type { CalculationResult } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=900&q=80';

type Props = {
  result: CalculationResult | null;
  location: ResolvedLocation | null;
  projectName?: string;
};

async function fetchWikipediaImage(city: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.originalimage?.source || data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

export default function HeroCard({ result, location, projectName }: Props) {
  const [photoUrl, setPhotoUrl] = useState(FALLBACK_PHOTO);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    const city = location?.city;
    if (!city) {
      setPhotoUrl(FALLBACK_PHOTO);
      return;
    }

    setPhotoLoading(true);
    fetchWikipediaImage(city).then(url => {
      setPhotoUrl(url ?? FALLBACK_PHOTO);
      setPhotoLoading(false);
    });
  }, [location?.city]);

  const locationLabel = location
    ? [location.city, location.country].filter(Boolean).join(', ')
    : projectName || 'Your Project';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(380px, 1.05fr) 1.4fr', height: 220, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(31,38,34,0.07)', background: '#fff' }}>
      {/* Left: KPI */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, color: '#3d4a44', textTransform: 'uppercase' }}>GHG Per Capita</div>

        <div>
          {result ? (
            <>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 88, fontWeight: 600, lineHeight: 0.9, letterSpacing: -2, color: '#1e3128' }}>
                {result.ghgPerCapitaTCO2e.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: '#6b7670', marginTop: 8 }}>tCO₂e / person / year</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 88, fontWeight: 600, lineHeight: 0.9, letterSpacing: -2, color: '#d4d8d5' }}>—</div>
              <div style={{ fontSize: 12, color: '#9aada4', marginTop: 8 }}>Run Quick Check to see results</div>
            </>
          )}
        </div>

        {!result && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f6f3ec', border: '1px solid rgba(31,38,34,0.08)', borderRadius: 8, fontSize: 12, color: '#9aada4' }}>
            Fill in project details and click Run Quick Check
          </div>
        )}
      </div>

      {/* Right: city photo */}
      <div
        style={{
          position: 'relative',
          background: `linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.35)), url('${photoUrl}') center/cover`,
          transition: 'background-image 0.4s ease',
        }}
      >
        {photoLoading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,49,40,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        <div style={{ position: 'absolute', left: 14, bottom: 12, color: '#fff', fontSize: 10.5, letterSpacing: 0.5, opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {locationLabel.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
