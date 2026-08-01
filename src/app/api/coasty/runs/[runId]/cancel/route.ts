import { NextRequest, NextResponse } from 'next/server';
import { coastyClient } from '@/lib/coasty';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;

    if (!runId) {
      return NextResponse.json({ error: 'runId required' }, { status: 400 });
    }

    const result = await coastyClient.cancelRun(runId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
