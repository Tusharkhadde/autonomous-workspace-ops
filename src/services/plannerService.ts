import { db } from '@/lib/db';
import { inMemoryStore } from '@/lib/storage';
import { plannerAgent } from '@/agents/plannerAgent';
import { WorkflowRunData, PlanGenerationRequest, WorkflowStep } from '@/types/workflow';

export class PlannerService {
  async createPlannedRun(req: PlanGenerationRequest): Promise<WorkflowRunData> {
    const plan = await plannerAgent.planGoal(req.prompt, req.customParameters);

    try {
      const run = await db.workflowRun.create({
        data: {
          title: plan.title,
          prompt: req.prompt,
          status: 'queued',
          cuaVersion: req.cuaVersion || 'v5',
          maxSteps: plan.steps.length,
          stepsCount: plan.steps.length,
          riskScore: plan.overallRisk,
          steps: {
            create: plan.steps.map((s, idx) => ({
              stepNumber: idx + 1,
              title: s.title,
              description: s.description,
              actionType: s.actionType,
              targetApp: s.targetApp,
              command: s.command,
              status: 'pending',
              riskLevel: s.riskLevel,
              requiresApproval: s.requiresApproval,
              isApproved: s.isApproved,
              outputLogs: s.outputLogs,
            })),
          },
        },
        include: {
          steps: { orderBy: { stepNumber: 'asc' } },
        },
      });

      return run as unknown as WorkflowRunData;
    } catch (err) {
      console.warn('[PlannerService] DB write fallback to in-memory store:', err);

      const runId = `run_plan_${Date.now()}`;
      const now = new Date().toISOString();

      const steps: WorkflowStep[] = plan.steps.map((s, idx) => ({
        id: `step_${runId}_${idx + 1}`,
        runId,
        stepNumber: idx + 1,
        title: s.title,
        description: s.description,
        actionType: s.actionType,
        targetApp: s.targetApp,
        command: s.command,
        status: 'pending',
        durationMs: 0,
        riskLevel: s.riskLevel,
        requiresApproval: s.requiresApproval,
        isApproved: s.isApproved,
        outputLogs: s.outputLogs,
        createdAt: now,
        updatedAt: now,
      }));

      const fallbackRun: WorkflowRunData = {
        id: runId,
        title: plan.title,
        prompt: req.prompt,
        status: 'queued',
        cuaVersion: req.cuaVersion || 'v5',
        machineId: 'machine_cloud_node_v5',
        maxSteps: plan.steps.length,
        stepsCount: plan.steps.length,
        riskScore: plan.overallRisk,
        createdAt: now,
        updatedAt: now,
        steps,
      };

      inMemoryStore.runs.set(runId, fallbackRun);
      return fallbackRun;
    }
  }
}

export const plannerService = new PlannerService();
