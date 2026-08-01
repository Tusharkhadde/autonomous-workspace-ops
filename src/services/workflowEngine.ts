import { createPlan } from "@/agents/planner";
import { defaultMemory } from "@/lib/constants";
import type { ApprovalRequest, ExecutionState, ScreenFrame, TimelineEvent, WorkflowStep } from "@/types/operator";
import { createId } from "@/utils/id";

const demoFrames = [
  "linear-gradient(135deg,#082f49,#111827 55%,#134e4a)",
  "linear-gradient(135deg,#172554,#020617 58%,#064e3b)",
  "linear-gradient(135deg,#1e293b,#020617 58%,#7c2d12)",
  "linear-gradient(135deg,#0f172a,#111827 52%,#155e75)"
];

function event(stepId: string, message: string, level: TimelineEvent["level"] = "info"): TimelineEvent {
  return { id: createId("evt"), stepId, message, level, timestamp: new Date().toISOString() };
}

function frame(stepId: string, index: number, label: string): ScreenFrame {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0f172a"/><stop offset="0.55" stop-color="#111827"/><stop offset="1" stop-color="#0e7490"/></linearGradient></defs>
      <rect width="1280" height="760" fill="url(#g)"/>
      <rect x="48" y="46" width="1184" height="668" rx="18" fill="rgba(15,23,42,.72)" stroke="rgba(148,163,184,.28)"/>
      <text x="92" y="124" fill="#e5e7eb" font-family="Inter,Arial" font-size="36" font-weight="700">Coasty AI Screen Capture</text>
      <text x="92" y="178" fill="#67e8f9" font-family="Inter,Arial" font-size="24">${label}</text>
      <rect x="92" y="238" width="${360 + index * 84}" height="18" rx="9" fill="#22d3ee"/>
      <rect x="92" y="286" width="760" height="14" rx="7" fill="#475569"/>
      <rect x="92" y="326" width="620" height="14" rx="7" fill="#334155"/>
      <rect x="92" y="418" width="1096" height="198" rx="12" fill="rgba(2,6,23,.64)" stroke="rgba(34,211,238,.22)"/>
      <text x="132" y="486" fill="#d1d5db" font-family="Consolas,monospace" font-size="22">$ ${label.toLowerCase()}</text>
      <text x="132" y="534" fill="#86efac" font-family="Consolas,monospace" font-size="22">status: verified</text>
    </svg>
  `);

  return {
    id: createId("frame"),
    stepId,
    label,
    timestamp: new Date().toISOString(),
    imageUrl: `data:image/svg+xml,${svg}`
  };
}

export function createInitialExecution(prompt: string): ExecutionState {
  const steps = createPlan(prompt, defaultMemory);
  return {
    goal: { id: createId("goal"), title: "Active Mission", prompt, createdAt: new Date().toISOString() },
    steps,
    events: [event(steps[0]?.id ?? "system", "Planner converted the goal into an executable workflow.")],
    frames: [],
    approvals: [],
    memory: defaultMemory,
    startedAt: new Date().toISOString()
  };
}

export function advanceDemoExecution(state: ExecutionState): ExecutionState {
  const steps = [...state.steps];
  const events = [...state.events];
  const frames = [...state.frames];
  const approvals = [...state.approvals];
  const running = steps.find((step) => step.status === "running" || step.status === "retrying" || step.status === "awaiting_approval");

  if (running?.status === "awaiting_approval") return state;

  if (running) {
    const index = steps.findIndex((step) => step.id === running.id);
    const failedOnce = running.title === "Install dependencies" && running.retries === 0;

    if (failedOnce) {
      steps[index] = { ...running, status: "retrying", retries: 1 };
      events.push(event(running.id, "Dependency install hit a lockfile mismatch. Retrying with the detected package manager.", "warning"));
      frames.push(frame(running.id, frames.length, "Recovered package install"));
      return { ...state, steps, events, frames };
    }

    steps[index] = { ...running, status: "completed", completedAt: new Date().toISOString() };
    events.push(event(running.id, `${running.title} completed and verified from a fresh screen capture.`, "success"));
    frames.push(frame(running.id, frames.length, running.title));
  }

  const nextIndex = steps.findIndex((step) => step.status === "queued");
  if (nextIndex === -1) return { ...state, steps, events, frames, approvals, finishedAt: new Date().toISOString() };

  const next = steps[nextIndex];
  if (next.risk) {
    const approval: ApprovalRequest = {
      id: createId("approval"),
      stepId: next.id,
      risk: next.risk,
      question: "Approve this action?",
      context: `${next.title}: ${next.detail}`
    };
    steps[nextIndex] = { ...next, status: "awaiting_approval", startedAt: new Date().toISOString() };
    approvals.push(approval);
    events.push(event(next.id, `Paused for human approval before ${next.title.toLowerCase()}.`, "warning"));
    return { ...state, steps, events, frames, approvals };
  }

  steps[nextIndex] = { ...next, status: "running", startedAt: new Date().toISOString() };
  events.push(event(next.id, `Executing ${next.title} in ${next.app}.`));
  return { ...state, steps, events, frames, approvals };
}

export function resolveApproval(state: ExecutionState, approved: boolean): ExecutionState {
  const approval = state.approvals[0];
  if (!approval) return state;

  const steps = state.steps.map<WorkflowStep>((step) =>
    step.id === approval.stepId ? { ...step, status: approved ? "running" : "skipped" } : step
  );

  return {
    ...state,
    steps,
    approvals: state.approvals.slice(1),
    events: [
      ...state.events,
      event(approval.stepId, approved ? "Human approved the guarded action." : "Human rejected the guarded action. Step skipped.", approved ? "success" : "warning")
    ]
  };
}
