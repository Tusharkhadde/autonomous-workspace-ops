import { openAIPlanner } from '@/lib/openai';
import { ExecutionPlan } from '@/types/workflow';

export class PlannerAgent {
  async planGoal(prompt: string, parameters?: Record<string, string>): Promise<ExecutionPlan> {
    return await openAIPlanner.generatePlan(prompt, parameters);
  }
}

export const plannerAgent = new PlannerAgent();
