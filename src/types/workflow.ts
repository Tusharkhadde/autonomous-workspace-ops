/**
 * Workflow and Step Types for Coasty AI Engine
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type StepActionType =
  | 'launch_app'
  | 'command'
  | 'browser_nav'
  | 'file_write'
  | 'code_edit'
  | 'terminal_wait'
  | 'inspect'
  | 'verify'
  | 'human_prompt';

export type StepStatus =
  | 'pending'
  | 'running'
  | 'awaiting_approval'
  | 'succeeded'
  | 'failed'
  | 'skipped'
  | 'self_healing';

export type WorkflowStatus =
  | 'queued'
  | 'planning'
  | 'running'
  | 'awaiting_human'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'recovering';

export interface WorkflowStep {
  id: string;
  runId: string;
  stepNumber: number;
  title: string;
  description: string;
  actionType: StepActionType;
  targetApp?: string;
  command?: string;
  status: StepStatus;
  screenshotUrl?: string;
  boundingBox?: [number, number, number, number]; // [x, y, w, h]
  durationMs: number;
  errorMsg?: string;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  isApproved: boolean;
  outputLogs?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRunData {
  id: string;
  title: string;
  prompt: string;
  status: WorkflowStatus;
  cuaVersion: string;
  machineId?: string;
  maxSteps: number;
  stepsCount: number;
  riskScore: RiskLevel;
  errorReason?: string;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
  steps: WorkflowStep[];
}

export interface ParameterDefinition {
  name: string;
  label: string;
  defaultValue: string;
  required: boolean;
  description?: string;
}

export interface SavedWorkflowTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  parameters: ParameterDefinition[];
  icon: string;
  isBuiltin: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanGenerationRequest {
  prompt: string;
  customParameters?: Record<string, string>;
  cuaVersion?: 'v3' | 'v4' | 'v5';
  autoApproveRiskThreshold?: RiskLevel;
}

export interface ExecutionPlan {
  title: string;
  summary: string;
  estimatedTimeMinutes: number;
  overallRisk: RiskLevel;
  steps: Omit<WorkflowStep, 'id' | 'runId' | 'status' | 'durationMs' | 'createdAt' | 'updatedAt'>[];
}
