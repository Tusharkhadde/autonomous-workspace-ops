import { NextRequest, NextResponse } from 'next/server';
import { coastyClient } from '@/lib/coasty';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { screenshot, instruction, context } = body;

    if (!screenshot || !instruction) {
      return NextResponse.json({ error: 'screenshot and instruction are required' }, { status: 400 });
    }

    const prediction = await coastyClient.predictAction({ screenshot, instruction, context });
    return NextResponse.json(prediction);
  } catch (err: any) {
    console.error('[Coasty Predict API] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Prediction failed' }, { status: 500 });
  }
}
