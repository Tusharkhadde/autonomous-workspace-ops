import { NextResponse } from 'next/server';
import { memoryService } from '@/services/memoryService';

export async function GET() {
  const items = await memoryService.getAllItems();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, value, category, isSecret, tags } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and Value are required' }, { status: 400 });
    }

    const item = await memoryService.setItem(key, value, category, isSecret, tags);
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key query parameter required' }, { status: 400 });
    }

    await memoryService.deleteItem(key);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
