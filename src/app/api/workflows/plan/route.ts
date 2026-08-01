import { NextResponse } from 'next/server';
import { openAIPlanner } from '@/lib/openai';
import { inMemoryStore } from '@/lib/storage';
import { WorkflowRunData } from '@/types/workflow';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, cuaVersion } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    // Generate intelligent execution plan
    const plan = await openAIPlanner.generatePlan(prompt);

    // Build run object in memory
    const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const steps = plan.steps.map((s, idx) => ({
      id: `step_${runId}_${idx + 1}`,
      runId,
      stepNumber: idx + 1,
      title: s.title,
      description: s.description,
      actionType: s.actionType,
      targetApp: s.targetApp,
      command: s.command,
      status: 'pending' as const,
      durationMs: 0,
      riskLevel: s.riskLevel,
      requiresApproval: s.requiresApproval,
      isApproved: s.isApproved,
      outputLogs: s.outputLogs,
      createdAt: now,
      updatedAt: now,
    }));

    const run: WorkflowRunData = {
      id: runId,
      title: plan.title,
      prompt,
      status: 'queued',
      cuaVersion: cuaVersion ?? 'v5',
      machineId: 'machine_cloud_node_v5',
      maxSteps: steps.length,
      stepsCount: steps.length,
      riskScore: plan.overallRisk,
      createdAt: now,
      updatedAt: now,
      steps,
    };

    inMemoryStore.runs.set(runId, run);

    return NextResponse.json(run);
  } catch (error: any) {
    console.error('[Plan API Error]:', error);
    return NextResponse.json({ error: error.message || 'Planning failed' }, { status: 500 });
  }
}
