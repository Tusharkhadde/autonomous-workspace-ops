import type { OperatorMemory, WorkflowTemplate } from "@/types/operator";

export const defaultMemory: OperatorMemory = {
  editor: "VS Code",
  browser: "Chrome",
  terminal: "PowerShell",
  githubUsername: "mayur",
  projectFolder: "C:\\Users\\mayur\\tushar"
};

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "hackathon-setup",
    name: "Hackathon Setup",
    description: "Prepare repository, dependencies, env files, server, and browser verification.",
    estimatedMinutes: 12,
    successRate: 94,
    tags: ["GitHub", "VS Code", "Docker"],
    goal: "I have a Docker hackathon in 30 minutes. Prepare everything."
  },
  {
    id: "react-project",
    name: "React Project Setup",
    description: "Create a fresh app, install packages, configure linting, and open the dev server.",
    estimatedMinutes: 8,
    successRate: 96,
    tags: ["React", "Next.js"],
    goal: "Create a polished React workspace and verify it runs locally."
  },
  {
    id: "open-source",
    name: "Open Source Contribution",
    description: "Fork, clone, install, run tests, create branch, and prepare a draft PR.",
    estimatedMinutes: 18,
    successRate: 89,
    tags: ["GitHub", "Tests"],
    goal: "Prepare an open source contribution workspace for my assigned issue."
  },
  {
    id: "interview-prep",
    name: "Interview Preparation",
    description: "Open docs, calendar, notes, coding pad, and record a readiness checklist.",
    estimatedMinutes: 6,
    successRate: 98,
    tags: ["Calendar", "Notes"],
    goal: "Prepare my desktop for a technical interview."
  }
];

export const destructiveRisks = ["delete_files", "close_apps", "push_code", "submit_form", "purchase"] as const;
