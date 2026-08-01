import type { OperatorMemory, WorkflowStep } from "@/types/operator";
import { createId } from "@/utils/id";

export function createPlan(goal: string, memory: OperatorMemory): WorkflowStep[] {
  const normalized = goal.toLowerCase();
  const includesHackathon = normalized.includes("hackathon") || normalized.includes("docker");

  const base: Omit<WorkflowStep, "id" | "status" | "retries">[] = includesHackathon
    ? [
        { title: `Open ${memory.browser}`, detail: "Launch browser and verify network access.", app: memory.browser },
        { title: "Open GitHub", detail: "Navigate to the target repository or organization.", app: memory.browser },
        { title: "Clone repository", detail: `Clone into ${memory.projectFolder}.`, app: memory.terminal },
        { title: `Open ${memory.editor}`, detail: "Open the cloned workspace in the preferred editor.", app: memory.editor },
        { title: "Install dependencies", detail: "Run package installation and detect package manager.", app: memory.terminal },
        { title: "Create environment file", detail: "Create .env from template after checking required keys.", app: memory.editor, risk: "credential_use" },
        { title: "Start development server", detail: "Run dev server and monitor logs for readiness.", app: memory.terminal },
        { title: "Open localhost", detail: "Open the app and verify it renders correctly.", app: memory.browser },
        { title: "Record readiness summary", detail: "Save execution proof, screenshots, and next actions.", app: "Ghost Operator" }
      ]
    : [
        { title: "Clarify target workspace", detail: "Infer apps, files, and success criteria from the goal.", app: "Ghost Operator" },
        { title: `Open ${memory.browser}`, detail: "Start with a visual check of the current desktop.", app: memory.browser },
        { title: `Open ${memory.editor}`, detail: "Prepare the working project area.", app: memory.editor },
        { title: "Execute workflow", detail: "Run the required steps with screen verification after each action.", app: "Coasty" },
        { title: "Verify completion", detail: "Capture a final screenshot and compare against the goal.", app: "Ghost Operator" }
      ];

  return base.map((step) => ({ ...step, id: createId("step"), status: "queued", retries: 0 }));
}
