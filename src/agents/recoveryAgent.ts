import { openAIPlanner } from '@/lib/openai';
import { WorkflowStep } from '@/types/workflow';

export class RecoveryAgent {
  async handleFailure(step: WorkflowStep): Promise<{
    recoveryStep: Omit<WorkflowStep, 'id' | 'runId' | 'status' | 'durationMs' | 'createdAt' | 'updatedAt'>;
    diagnosis: string;
  }> {
    const diag = await openAIPlanner.diagnoseError(step.title, step.command, step.errorMsg);

    return {
      diagnosis: diag.diagnosis,
      recoveryStep: {
        stepNumber: step.stepNumber,
        title: diag.recoveryStepTitle,
        description: `Autonomous Self-Healing: ${diag.diagnosis}`,
        actionType: 'command',
        targetApp: step.targetApp || 'Terminal',
        command: diag.suggestedFixCommand,
        riskLevel: 'medium',
        requiresApproval: false,
        isApproved: true,
        outputLogs: `Self-healing fix injected: ${diag.suggestedFixCommand}`,
      },
    };
  }
}

export const recoveryAgent = new RecoveryAgent();
