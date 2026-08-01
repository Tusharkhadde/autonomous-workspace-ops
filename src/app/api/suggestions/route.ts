import { NextResponse } from 'next/server';
import { optimizerStore } from '@/lib/storage';

export async function GET() {
  return NextResponse.json(optimizerStore.suggestions);
}

export async function POST(req: Request) {
  try {
    const { suggestionId } = await req.json();
    const item = optimizerStore.suggestions.find((s) => s.id === suggestionId);
    if (item) {
      item.isExecuted = true;
    }
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
