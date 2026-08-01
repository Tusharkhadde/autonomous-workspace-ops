export type StepStatus = "queued" | "running" | "completed" | "failed" | "retrying" | "awaiting_approval" | "skipped";

export type ApprovalRisk = "delete_files" | "close_apps" | "push_code" | "submit_form" | "purchase" | "credential_use";

export interface OperatorGoal {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
  status: StepStatus;
  app: string;
  risk?: ApprovalRisk;
  retries: number;
  startedAt?: string;
  completedAt?: string;
}

export interface TimelineEvent {
  id: string;
  stepId: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

export interface ScreenFrame {
  id: string;
  stepId: string;
  label: string;
  timestamp: string;
  imageUrl: string;
}

export interface ApprovalRequest {
  id: string;
  stepId: string;
  risk: ApprovalRisk;
  question: string;
  context: string;
}

export interface OperatorMemory {
  editor: string;
  browser: string;
  terminal: string;
  githubUsername: string;
  projectFolder: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  successRate: number;
  tags: string[];
  goal: string;
}

export interface ExecutionState {
  goal: OperatorGoal;
  steps: WorkflowStep[];
  events: TimelineEvent[];
  frames: ScreenFrame[];
  approvals: ApprovalRequest[];
  memory: OperatorMemory;
  startedAt: string;
  finishedAt?: string;
}

export interface CoastyAction {
  action_type: "click" | "type_text" | "key_press" | "key_combo" | "scroll" | "wait";
  params: Record<string, unknown>;
}

export interface CoastyPredictResponse {
  status: "continue" | "done" | "fail";
  actions: CoastyAction[];
  reason?: string;
}
