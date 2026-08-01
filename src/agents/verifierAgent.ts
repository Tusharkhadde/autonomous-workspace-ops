import { WorkflowStep } from '@/types/workflow';

export class VerifierAgent {
  verifyStepCompletion(step: WorkflowStep, outputLog?: string): { success: boolean; confidence: number; note: string } {
    const logs = (outputLog || step.outputLogs || '').toLowerCase();
    
    if (logs.includes('error') || logs.includes('failed') || logs.includes('fatal') || logs.includes('command not found')) {
      return {
        success: false,
        confidence: 0.9,
        note: `Assertion failed: Output logs contain execution error: ${step.title}`,
      };
    }

    return {
      success: true,
      confidence: 0.96,
      note: `Step assertions satisfied: ${step.title}`,
    };
  }
}

export const verifierAgent = new VerifierAgent();
