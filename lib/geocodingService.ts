// Server-side only — do not import in client components.
// Geocoding strategy: Mapbox → Google → OpenCage → local fallback

import type { ResolvedLocation } from '@/types/location';
import { KOPPEN_FALLBACKS } from '@/data/koppenFallbacks';
import { normalizeString, normalizeCountryName } from './normalization';

// ─── Mapbox ──────────────────────────────────────────────────────────────────

async function geocodeWithMapbox(input: string): Promise<ResolvedLocation | null> {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const encoded = encodeURIComponent(input);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&limit=1&types=place,postcode,address,region,country`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;

    const feature = data.features[0];
    const [longitude, latitude] = feature.center;

    const getContext = (id: string) =>
      feature.context?.find((c: { id: string; text: string }) => c.id.startsWith(id));

    const countryCtx = getContext('country');
    const regionCtx = getContext('region');
    const placeCtx = getContext('place');
    const postcodeCtx = getContext('postcode');

    return {
      input,
      city: placeCtx?.text ?? feature.text,
      country: countryCtx?.text ?? '',
      countryCode: countryCtx?.short_code?.toUpperCase() ?? '',
      region: regionCtx?.text,
      regionCode: regionCtx?.short_code?.replace(/[a-z]{2}-/i, '').toUpperCase(),
      postalCode: postcodeCtx?.text,
      latitude,
      longitude,
      confidence: feature.relevance >= 0.8 ? 'high' : feature.relevance >= 0.5 ? 'medium' : 'low',
      source: 'mapbox',
      formattedAddress: feature.place_name,
      warnings: feature.relevance < 0.6 ? ['Location match confidence is low. Please verify.'] : undefined,
    };
  } catch {
    return null;
  }
}

// ─── Google Geocoding ─────────────────────────────────────────────────────────

async function geocodeWithGoogle(input: string): Promise<ResolvedLocation | null> {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!key) return null;

  try {
    const encoded = encodeURIComponent(input);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 'OK' || data.results.length === 0) return null;

    const result = data.results[0];
    const loc = result.geometry.location;

    const getComponent = (type: string) =>
      result.address_components?.find((c: { types: string[]; long_name: string; short_name: string }) =>
        c.types.includes(type),
      );

    const country = getComponent('country');
    const adminArea = getComponent('administrative_area_level_1');
    const locality = getComponent('locality') ?? getComponent('sublocality_level_1');
    const postalCode = getComponent('postal_code');

    return {
      input,
      city: locality?.long_name,
      country: country?.long_name ?? '',
      countryCode: country?.short_name?.toUpperCase() ?? '',
      region: adminArea?.long_name,
      regionCode: adminArea?.short_name?.toUpperCase(),
      postalCode: postalCode?.long_name,
      latitude: loc.lat,
      longitude: loc.lng,
      confidence: result.geometry.location_type === 'ROOFTOP' ? 'high' : 'medium',
      source: 'google',
      formattedAddress: result.formatted_address,
    };
  } catch {
    return null;
  }
}

// ─── OpenCage ─────────────────────────────────────────────────────────────────

async function geocodeWithOpenCage(input: string): Promise<ResolvedLocation | null> {
  const key = process.env.OPENCAGE_API_KEY;
  if (!key) return null;

  try {
    const encoded = encodeURIComponent(input);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encoded}&key=${key}&limit=1&no_annotations=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    const comp = result.components;

    return {
      input,
      city: comp.city ?? comp.town ?? comp.village ?? comp.county,
      country: comp.country ?? '',
      countryCode: (comp.country_code ?? '').toUpperCase(),
      region: comp.state ?? comp.province,
      postalCode: comp.postcode,
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      confidence: result.confidence >= 8 ? 'high' : result.confidence >= 5 ? 'medium' : 'low',
      source: 'opencage',
      formattedAddress: result.formatted,
    };
  } catch {
    return null;
  }
}

// ─── Local fallback resolver ──────────────────────────────────────────────────

function geocodeWithLocalFallback(input: string): ResolvedLocation | null {
  const normalized = normalizeString(input);

  // Try each known city
  for (const record of KOPPEN_FALLBACKS) {
    const cityNorm = normalizeString(record.city);
    const countryNorm = normalizeCountryName(record.country);

    // Check aliases first
    const matched =
      record.aliases.some(alias => normalized === normalizeString(alias)) ||
      normalized === cityNorm ||
      normalized === `${cityNorm} ${countryNorm}` ||
      normalized === `${cityNorm} ${normalizeString(record.countryCode)}`;

    if (matched) {
      return {
        input,
        city: record.city,
        country: record.country,
        countryCode: record.countryCode,
        latitude: record.latitude,
        longitude: record.longitude,
        confidence: 'low',
        source: 'fallback',
        formattedAddress: `${record.city}, ${record.country}`,
        warnings: [
          'Location resolved using local fallback data. Latitude/longitude are approximate city centroids. For precision, configure a geocoding API.',
        ],
      };
    }
  }

  // Try partial match: does input contain a known city name?
  for (const record of KOPPEN_FALLBACKS) {
    const cityNorm = normalizeString(record.city);
    if (normalized.includes(cityNorm)) {
      return {
        input,
        city: record.city,
        country: record.country,
        countryCode: record.countryCode,
        latitude: record.latitude,
        longitude: record.longitude,
        confidence: 'low',
        source: 'fallback',
        formattedAddress: `${record.city}, ${record.country}`,
        warnings: [
          'Location resolved using partial local fallback match. Configure a geocoding API for improved accuracy.',
        ],
      };
    }
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function geocodeLocation(input: string): Promise<ResolvedLocation> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Location input is empty.');
  }

  // Try providers in priority order
  const mapboxResult = await geocodeWithMapbox(trimmed);
  if (mapboxResult) return mapboxResult;

  const googleResult = await geocodeWithGoogle(trimmed);
  if (googleResult) return googleResult;

  const openCageResult = await geocodeWithOpenCage(trimmed);
  if (openCageResult) return openCageResult;

  const localResult = geocodeWithLocalFallback(trimmed);
  if (localResult) return localResult;

  throw new Error(
    `Could not resolve location "${trimmed}". Try entering a city and country (e.g. "Dubai, UAE") or a postal code and country.`,
  );
}
