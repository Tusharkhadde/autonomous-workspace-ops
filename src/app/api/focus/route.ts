import { NextResponse } from 'next/server';
import { optimizerStore } from '@/lib/storage';

export async function GET() {
  return NextResponse.json(optimizerStore.focus);
}
