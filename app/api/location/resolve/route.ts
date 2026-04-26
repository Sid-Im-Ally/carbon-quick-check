import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@/lib/geocodingService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body as { input?: string };

    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json({ error: 'input is required' }, { status: 400 });
    }

    const result = await geocodeLocation(input.trim());
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to resolve location';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
