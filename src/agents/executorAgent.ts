import { coastyClient } from '@/lib/coasty';
import { CoastyRunResponse } from '@/types/coasty';

export class ExecutorAgent {
  async initiateTask(task: string, cuaVersion: 'v3' | 'v4' | 'v5' = 'v5'): Promise<CoastyRunResponse> {
    return await coastyClient.submitTask({
      task,
      cua_version: cuaVersion,
      max_steps: 50,
    });
  }

  async checkRunStatus(runId: string): Promise<CoastyRunResponse> {
    return await coastyClient.getRun(runId);
  }

  async approveHumanAction(runId: string, customInput?: string) {
    return await coastyClient.resumeRun(runId, customInput);
  }

  async cancelWorkflow(runId: string) {
    return await coastyClient.cancelRun(runId);
  }
}

export const executorAgent = new ExecutorAgent();
