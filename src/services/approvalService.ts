import { db } from '@/lib/db';
import { inMemoryStore } from '@/lib/storage';
import { PendingApprovalRequest, ApprovalResponseType } from '@/types/approval';
import { executionEngine } from './executionEngine';

export class ApprovalService {
  async getPendingApprovals(): Promise<PendingApprovalRequest[]> {
    try {
      const dbApprovals = await db.humanApproval.findMany({
        where: { status: 'pending' },
        include: { step: true, run: true },
        orderBy: { createdAt: 'desc' },
      });

      return dbApprovals.map((app) => ({
        id: app.id,
        stepId: app.stepId,
        runId: app.runId,
        runTitle: app.run.title,
        stepTitle: app.step.title,
        stepNumber: app.step.stepNumber,
        prompt: app.prompt,
        sideEffects: app.sideEffects,
        dangerousCommand: app.dangerousCommand || undefined,
        riskLevel: app.step.riskLevel as any,
        status: app.status as any,
        createdAt: app.createdAt.toISOString(),
      }));
    } catch {
      return Array.from(inMemoryStore.approvals.values()).filter((a) => a.status === 'pending');
    }
  }

  async respondToApproval(approvalId: string, responseType: ApprovalResponseType, customInput?: string) {
    if (responseType === 'approve' || responseType === 'execute_with_input') {
      await executionEngine.approveAndResume(approvalId, customInput);
    } else {
      // Rejected
      const approval = await db.humanApproval.findUnique({ where: { id: approvalId } });
      if (approval) {
        await db.humanApproval.update({
          where: { id: approvalId },
          data: {
            status: 'rejected',
            responseType: 'reject',
            respondedAt: new Date(),
          },
        });
        await executionEngine.cancelRun(approval.runId);
      }
    }
  }
}

export const approvalService = new ApprovalService();
