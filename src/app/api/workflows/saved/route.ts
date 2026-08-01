import { NextResponse } from 'next/server';
import { getSavedWorkflows } from '@/workflows/templates';
import { inMemoryStore } from '@/lib/storage';

export async function GET() {
  const workflows = getSavedWorkflows();
  return NextResponse.json(workflows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, prompt, tags, icon } = body;

    const newWf = {
      id: `wf_custom_${Date.now()}`,
      title,
      description,
      prompt,
      tags: tags || ['Custom'],
      parameters: [],
      icon: icon || 'Terminal',
      isBuiltin: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.savedWorkflows.set(newWf.id, newWf);
    return NextResponse.json(newWf);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
