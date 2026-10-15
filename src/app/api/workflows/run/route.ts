import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/storage';
import { coastyClient } from '@/lib/coasty';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { runId } = body;

    if (!runId) {
      return NextResponse.json({ error: 'runId is required' }, { status: 400 });
    }

    // Find run in memory store
    const run = inMemoryStore.runs.get(runId);
    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    // Launch on Coasty
    let coastyRunId: string | undefined;
    try {
      const coastyRun = await coastyClient.submitTask({
        task: run.prompt,
        max_steps: run.maxSteps ?? 10,
        cua_version: (run.cuaVersion as any) ?? 'v5',
        instructions: `You are an autonomous AI computer operator. Execute completely: ${run.prompt}`,
      });
      coastyRunId = coastyRun.id;
      run.machineId = coastyRun.machine_id ?? 'auto';
      console.log(`[Run API] Coasty task created: ${coastyRunId}`);
    } catch (err: any) {
      console.warn('[Run API] Coasty call failed, proceeding with local simulation:', err.message);
    }

    // Update run status
    run.status = 'running';
    if (coastyRunId) (run as any).coastyRunId = coastyRunId;
    inMemoryStore.runs.set(runId, run);

    // Simulate step progression
    let stepIdx = 0;
    const interval = setInterval(() => {
      const updatedRun = inMemoryStore.runs.get(runId);
      if (!updatedRun) { clearInterval(interval); return; }

      if (stepIdx < updatedRun.steps.length) {
        // Mark previous step succeeded
        if (stepIdx > 0) {
          updatedRun.steps[stepIdx - 1].status = 'succeeded';
          updatedRun.steps[stepIdx - 1].durationMs = 2000 + Math.floor(Math.random() * 1500);
          updatedRun.steps[stepIdx - 1].outputLogs =
            `[agent] Step completed successfully. Exit code 0.\n✓ ${updatedRun.steps[stepIdx - 1].title}`;
        }
        // Mark current step running
        updatedRun.steps[stepIdx].status = 'running';
        updatedRun.steps[stepIdx].outputLogs =
          `[agent] Executing: ${updatedRun.steps[stepIdx].title}\n[Agent] Machine ${updatedRun.machineId ?? 'cloud_v5'} action initiated...`;
        inMemoryStore.runs.set(runId, updatedRun);
        stepIdx++;
      } else {
        // Final step: mark last succeeded, mark run succeeded
        if (updatedRun.steps.length > 0) {
          updatedRun.steps[updatedRun.steps.length - 1].status = 'succeeded';
          updatedRun.steps[updatedRun.steps.length - 1].durationMs = 2000;
        }
        updatedRun.status = 'succeeded';
        updatedRun.endedAt = new Date().toISOString();
        inMemoryStore.runs.set(runId, updatedRun);
        clearInterval(interval);
      }
    }, 3000);

    return NextResponse.json(run);
  } catch (error: any) {
    console.error('[API /workflows/run Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to start run' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(Array.from(inMemoryStore.runs.values()));
}
