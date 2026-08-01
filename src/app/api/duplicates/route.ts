import { NextResponse } from 'next/server';
import { optimizerStore } from '@/lib/storage';

export async function GET() {
  const totalMb = optimizerStore.duplicates.reduce((acc, d) => acc + d.fileSizeMb, 0);
  return NextResponse.json({
    items: optimizerStore.duplicates,
    totalRecoverableGb: (totalMb / 1024).toFixed(2),
  });
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    optimizerStore.duplicates = optimizerStore.duplicates.filter((d) => d.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
