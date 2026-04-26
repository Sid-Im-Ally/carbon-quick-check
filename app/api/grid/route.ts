import { NextRequest, NextResponse } from 'next/server';
import { getGridEmissionFactor } from '@/lib/gridEmissionService';
import type { ResolvedLocation } from '@/types/location';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location } = body as { location?: ResolvedLocation };

    if (!location || typeof location !== 'object') {
      return NextResponse.json({ error: 'location object is required' }, { status: 400 });
    }

    if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json({ error: 'location must include numeric latitude and longitude' }, { status: 400 });
    }

    const result = await getGridEmissionFactor(location);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to determine grid emission factor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
