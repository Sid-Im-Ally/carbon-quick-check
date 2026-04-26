import { NextRequest, NextResponse } from 'next/server';
import { getKoppenClimateZone } from '@/lib/koppenClimateService';
import type { ResolvedLocation } from '@/types/location';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, location } = body as {
      latitude?: number;
      longitude?: number;
      location?: ResolvedLocation;
    };

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'latitude and longitude are required numbers' }, { status: 400 });
    }

    const result = await getKoppenClimateZone(latitude, longitude, location);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to determine climate zone';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
