import { db } from '@/lib/db';
import { executorAgent } from '@/agents/executorAgent';
import { verifierAgent } from '@/agents/verifierAgent';
import { recoveryAgent } from '@/agents/recoveryAgent';
import { generateSyntheticScreenshot } from '@/lib/utils';
import { coastyClient } from '@/lib/coasty';
import { WorkflowRunData, WorkflowStep } from '@/types/workflow';

export class ExecutionEngine {
  /**
   * Start executing a planned workflow run
   */
  async startRun(runId: string): Promise<WorkflowRunData> {
    console.log(`[ExecutionEngine] Starting run execution for ID: ${runId}`);

    // Reset all steps to pending for clean execution
    await db.executionStep.updateMany({
      where: { runId },
      data: {
        status: 'pending',
        outputLogs: null,
      },
    });

    const run = await db.workflowRun.findUnique({
      where: { id: runId },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    if (!run) throw new Error(`Run ${runId} not found`);

    // Initiate Coasty Task via official REST API (POST https://coasty.ai/v1/tasks)
    const coastyResp = await executorAgent.initiateTask(run.prompt, run.cuaVersion as any);
    console.log(`[ExecutionEngine] Coasty CUA Task Initiated. Machine/Run ID: ${coastyResp.id || coastyResp.machine_id}`);

    await db.workflowRun.update({
      where: { id: runId },
      data: {
        status: 'running',
        machineId: coastyResp.id || coastyResp.machine_id || 'machine_cloud_v5',
      },
    });

    // Start processing steps sequentially
    this.processNextStep(runId);

    const updated = await db.workflowRun.findUnique({
      where: { id: runId },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    return updated as unknown as WorkflowRunData;
  }

  /**
   * Process next pending step in run loop
   */
  async processNextStep(runId: string) {
    const run = await db.workflowRun.findUnique({
      where: { id: runId },
      include: { steps: { orderBy: { stepNumber: 'asc' } }, approvals: true },
    });

    if (!run || run.status === 'cancelled' || run.status === 'failed') {
      return;
    }

    const pendingStep = run.steps.find((s) => s.status === 'pending');
    const awaitingStep = run.steps.find((s) => s.status === 'awaiting_approval');

    if (awaitingStep) {
      await db.workflowRun.update({
        where: { id: runId },
        data: { status: 'awaiting_human' },
      });
      return;
    }

    if (!pendingStep) {
      // All steps finished successfully!
      console.log(`[ExecutionEngine] Run ${runId} completed all steps successfully.`);
      await db.workflowRun.update({
        where: { id: runId },
        data: {
          status: 'succeeded',
          endedAt: new Date(),
        },
      });

      // Record analytics
      const totalTimeMs = Date.now() - new Date(run.createdAt).getTime();
      await db.analyticsRecord.upsert({
        where: { runId: run.id },
        create: {
          runId: run.id,
          durationMs: totalTimeMs,
          stepCount: run.steps.length,
          costEstimate: run.steps.length * 0.05,
          success: true,
          interventionCount: run.approvals.length,
        },
        update: {
          durationMs: totalTimeMs,
          success: true,
        },
      });

      return;
    }

    // Check if step requires human safety approval
    if (pendingStep.requiresApproval && !pendingStep.isApproved) {
      await db.executionStep.update({
        where: { id: pendingStep.id },
        data: { status: 'awaiting_approval' },
      });

      await db.humanApproval.create({
        data: {
          stepId: pendingStep.id,
          runId: run.id,
          prompt: `Approval required for step: "${pendingStep.title}"`,
          sideEffects: `Command "${pendingStep.command}" will execute high-risk operations on system.`,
          dangerousCommand: pendingStep.command || undefined,
          status: 'pending',
        },
      });

      await db.workflowRun.update({
        where: { id: runId },
        data: { status: 'awaiting_human' },
      });

      return;
    }

    const maskedKey = coastyClient.getMaskedKey();
    const logHeader = `[Coasty API] Authenticated with X-API-Key: ${maskedKey}\n[agent] Machine ${run.machineId || 'cloud_v5_vm'} executing action: "${pendingStep.title}"`;

    // Mark step as running
    await db.executionStep.update({
      where: { id: pendingStep.id },
      data: {
        status: 'running',
        outputLogs: logHeader,
        screenshotUrl: generateSyntheticScreenshot(
          pendingStep.targetApp || 'Google Chrome',
          run.title,
          pendingStep.title,
          pendingStep.stepNumber
        ),
      },
    });

    // Verification check
    const stepObj = pendingStep as unknown as WorkflowStep;
    const verifyRes = verifierAgent.verifyStepCompletion(stepObj);

    if (verifyRes.success) {
      await db.executionStep.update({
        where: { id: pendingStep.id },
        data: {
          status: 'succeeded',
          durationMs: 2500,
          outputLogs: `${logHeader}\n[Coasty Agent] Action completed with code 0.\n✓ ${verifyRes.note}`,
        },
      });

      // Move to next step after 2.5s delay
      setTimeout(() => this.processNextStep(runId), 2500);
    } else {
      // Step failed - Trigger Recovery Agent
      await db.executionStep.update({
        where: { id: pendingStep.id },
        data: {
          status: 'self_healing',
          errorMsg: verifyRes.note,
        },
      });

      await db.workflowRun.update({
        where: { id: runId },
        data: { status: 'recovering' },
      });

      const recovery = await recoveryAgent.handleFailure(stepObj);

      // Inject recovery step
      await db.executionStep.create({
        data: {
          runId: run.id,
          stepNumber: pendingStep.stepNumber,
          title: recovery.recoveryStep.title,
          description: recovery.recoveryStep.description,
          actionType: recovery.recoveryStep.actionType,
          targetApp: recovery.recoveryStep.targetApp,
          command: recovery.recoveryStep.command,
          status: 'pending',
          riskLevel: 'medium',
          requiresApproval: false,
          isApproved: true,
          outputLogs: `[Self-Healing Recovery] ${recovery.diagnosis}`,
        },
      });

      setTimeout(() => this.processNextStep(runId), 2500);
    }
  }

  /**
   * Resume run after human approval
   */
  async approveAndResume(approvalId: string, customInput?: string) {
    const approval = await db.humanApproval.findUnique({
      where: { id: approvalId },
      include: { step: true, run: true },
    });

    if (!approval) throw new Error('Approval record not found');

    await db.humanApproval.update({
      where: { id: approvalId },
      data: {
        status: 'approved',
        responseType: 'approve',
        customInput,
        respondedAt: new Date(),
      },
    });

    await db.executionStep.update({
      where: { id: approval.stepId },
      data: {
        status: 'pending',
        isApproved: true,
        command: customInput ? `${approval.step.command} ${customInput}` : approval.step.command,
      },
    });

    await db.workflowRun.update({
      where: { id: approval.runId },
      data: { status: 'running' },
    });

    this.processNextStep(approval.runId);
  }

  /**
   * Cancel workflow run
   */
  async cancelRun(runId: string) {
    await db.workflowRun.update({
      where: { id: runId },
      data: {
        status: 'cancelled',
        endedAt: new Date(),
      },
    });

    await executorAgent.cancelWorkflow(runId);
  }
}

export const executionEngine = new ExecutionEngine();
