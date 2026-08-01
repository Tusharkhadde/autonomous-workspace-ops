import { NextRequest, NextResponse } from 'next/server';
import { coastyClient } from '@/lib/coasty';
import { optimizerStore } from '@/lib/storage';
import { MissionAutomationItem } from '@/types/optimizer';

export async function GET() {
  return NextResponse.json(optimizerStore.missions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if creating a new custom mission task
    if (body.action === 'create') {
      const { name, description, prompt, cuaVersion, icon } = body;
      if (!name || !prompt) {
        return NextResponse.json({ error: 'Name and prompt are required for new mission task' }, { status: 400 });
      }

      const newMission: MissionAutomationItem = {
        id: `mission_custom_${Date.now()}`,
        name,
        description: description || 'Custom user-defined autonomous mission task',
        prompt,
        icon: icon || 'Sparkles',
        cuaVersion: cuaVersion || 'v5',
        estimatedTimeMins: 3,
        stepsCount: 5,
        lastRunAt: undefined,
      };

      optimizerStore.missions.unshift(newMission);
      return NextResponse.json({ success: true, mission: newMission });
    }

    // Launch existing or one-off mission task on Coasty CUA
    const { missionId, prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required to launch a task' }, { status: 400 });
    }

    // Submit real Coasty Task (max_steps=50 for full completion)
    const coastyRun = await coastyClient.submitTask({
      task: prompt,
      max_steps: 50,
      deadline_seconds: 600,
      cua_version: 'v5',
      instructions: `You are an autonomous AI computer operator working on a cloud desktop (Linux/XFCE). Execute the following task completely and autonomously: ${prompt}. Use the terminal, application menu, file manager, and browser as needed. Verify each step before marking it complete.`,
    });

    console.log(`[Missions API] Coasty task created: ${coastyRun.id} | status: ${coastyRun.status}`);

    return NextResponse.json({
      success: true,
      coastyRunId: coastyRun.id,
      status: coastyRun.status,
      machineId: coastyRun.machine_id,
      message: `Mission launched on Coasty CUA Engine. Run ID: ${coastyRun.id}`,
    });
  } catch (err: any) {
    console.error('[Missions API] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Failed to launch mission' },
      { status: 500 }
    );
  }
}
