/**
 * Dual Persistence Engine for Coasty AI & Workspace Optimizer
 */

import { WorkflowRunData, SavedWorkflowTemplate } from '@/types/workflow';
import { PendingApprovalRequest } from '@/types/approval';

import {
  ActivityItem,
  ProductivityInsightItem,
  AutomationSuggestionItem,
  DuplicateFileItem,
  WorkflowSequenceItem,
  FocusMetrics,
  AICoachingAdvice,
  MissionAutomationItem,
} from '@/types/optimizer';

export interface MemoryStoreItem {
  id: string;
  key: string;
  value: string;
  category: string;
  confidence: number;
  useCount: number;
  lastUsedAt: string;
  createdAt: string;
}

class InMemoryStore {
  runs: Map<string, WorkflowRunData> = new Map();
  approvals: Map<string, PendingApprovalRequest> = new Map();
  memories: Map<string, MemoryStoreItem> = new Map();
  savedWorkflows: Map<string, SavedWorkflowTemplate> = new Map();

  constructor() {
    this.seedWorkflowData();
  }

  private seedWorkflowData() {
    const seedWorkflow: SavedWorkflowTemplate = {
      id: 'wf_docker_hackathon',
      title: 'Docker Hackathon Workspace',
      description: 'Clone repository, launch VS Code, install dependencies, spin up Docker containers.',
      prompt: 'I have a Docker hackathon in 30 minutes',
      tags: ['docker', 'hackathon', 'setup'],
      parameters: [],
      icon: 'Box',
      isBuiltin: true,
      usageCount: 14,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.savedWorkflows.set(seedWorkflow.id, seedWorkflow);
  }
}

export const inMemoryStore = new InMemoryStore();

class OptimizerStore {
  activities: ActivityItem[] = [];
  insights: ProductivityInsightItem[] = [];
  suggestions: AutomationSuggestionItem[] = [];
  duplicates: DuplicateFileItem[] = [];
  workflows: WorkflowSequenceItem[] = [];
  focus: FocusMetrics;
  coachingAdvice: AICoachingAdvice[] = [];
  missions: MissionAutomationItem[] = [];

  constructor() {
    this.focus = {
      score: 84,
      contextSwitches: 217,
      deepWorkMins: 195,
      codingMins: 240,
      researchMins: 85,
      meetingMins: 45,
      idleMins: 30,
      date: new Date().toISOString(),
    };

    this.seedData();
  }

  private seedData() {
    this.activities = [
      { id: 'act_1', appName: 'VS Code', windowTitle: 'ghost-operator/src/app/page.tsx', category: 'development', durationSec: 7200, switches: 84, idleTimeSec: 120, timestamp: new Date().toISOString() },
      { id: 'act_2', appName: 'Google Chrome', windowTitle: 'OpenAI API Reference & Docs', category: 'research', durationSec: 4500, switches: 112, idleTimeSec: 300, timestamp: new Date().toISOString() },
      { id: 'act_3', appName: 'Terminal', windowTitle: 'npm run dev — Node v20.11.0', category: 'development', durationSec: 3600, switches: 45, idleTimeSec: 90, timestamp: new Date().toISOString() },
      { id: 'act_4', appName: 'Docker Desktop', windowTitle: 'Docker Engine v25.0.3 Running', category: 'utility', durationSec: 1800, switches: 12, idleTimeSec: 600, timestamp: new Date().toISOString() },
      { id: 'act_5', appName: 'Slack', windowTitle: '#general — Engineering Team', category: 'communication', durationSec: 2100, switches: 35, idleTimeSec: 400, timestamp: new Date().toISOString() },
    ];

    this.insights = [
      { id: 'ins_1', title: 'High Context Switching Detected', description: 'You switched between VS Code and Google Chrome 217 times today.', type: 'app_switching', impactLevel: 'high', timeWastedMins: 42, actionRecommendation: 'Batch browser research into dedicated 25-minute blocks.', createdAt: new Date().toISOString() },
      { id: 'ins_2', title: 'File Search Inefficiency', description: 'You spent 43 minutes searching for project folders in File Explorer.', type: 'file_search', impactLevel: 'medium', timeWastedMins: 43, actionRecommendation: 'Pin top 5 active project folders to your Quick Access sidebar.', createdAt: new Date().toISOString() },
      { id: 'ins_3', title: 'Duplicate Download Detected', description: 'You downloaded "docker-compose-spec.pdf" 3 times in your Downloads folder.', type: 'duplicate_download', impactLevel: 'medium', timeWastedMins: 15, actionRecommendation: 'Run 1-Click Downloads Organizer.', createdAt: new Date().toISOString() },
      { id: 'ins_4', title: 'Repetitive Environment Launch', description: 'You manually opened VS Code, Terminal, Chrome, and Docker Desktop every morning.', type: 'repetitive_action', impactLevel: 'high', timeWastedMins: 30, actionRecommendation: 'Create 1-Click Developer Workspace Mission.', createdAt: new Date().toISOString() },
    ];

    this.suggestions = [
      { id: 'sug_1', title: 'Create One-Click Developer Workspace', description: 'Autonomously launch VS Code, terminal server, and browser docs in 1 click.', actionType: 'launch_workspace', timeSavedMins: 25, isExecuted: false, estimatedComplexity: '1-Click', createdAt: new Date().toISOString() },
      { id: 'sug_2', title: 'Automatically Organize Downloads Folder', description: 'Group PDF, zip, and image files into category subfolders every evening.', actionType: 'organize_downloads', timeSavedMins: 15, isExecuted: false, estimatedComplexity: 'Autonomous', createdAt: new Date().toISOString() },
      { id: 'sug_3', title: 'Pin Frequently Used Folders', description: 'Pin top active repository folders to Quick Access for instant search.', actionType: 'pin_folders', timeSavedMins: 20, isExecuted: false, estimatedComplexity: '1-Click', createdAt: new Date().toISOString() },
      { id: 'sug_4', title: 'Batch Rename & Clean Downloaded Files', description: 'Strip duplicate (1).pdf tags and sanitize file names.', actionType: 'batch_rename', timeSavedMins: 10, isExecuted: false, estimatedComplexity: '1-Click', createdAt: new Date().toISOString() },
    ];

    this.duplicates = [
      { id: 'dup_1', fileName: 'docker-compose-spec(1).pdf', filePath: 'C:/Users/operator/Downloads/docker-compose-spec(1).pdf', fileSizeMb: 45.2, duplicateCount: 3, category: 'download', createdAt: new Date().toISOString() },
      { id: 'dup_2', fileName: 'Screenshot_2026-07-28_16.05.png', filePath: 'C:/Users/operator/Pictures/Screenshots/Screenshot_2026-07-28_16.05.png', fileSizeMb: 12.8, duplicateCount: 4, category: 'screenshot', createdAt: new Date().toISOString() },
      { id: 'dup_3', fileName: 'node_modules_backup.tar.gz', filePath: 'C:/Users/operator/Projects/node_modules_backup.tar.gz', fileSizeMb: 420.0, duplicateCount: 2, category: 'archive', createdAt: new Date().toISOString() },
      { id: 'dup_4', fileName: 'large_dataset_raw.json', filePath: 'C:/Users/operator/Downloads/large_dataset_raw.json', fileSizeMb: 850.5, duplicateCount: 2, category: 'large_file', createdAt: new Date().toISOString() },
    ];

    this.workflows = [
      { id: 'wf_seq_1', name: 'Morning Developer Startup', sequenceSteps: ['Open VS Code', 'Open Google Chrome', 'Open GitHub', 'Open Terminal', 'Run npm install', 'Start Dev Server'], occurrenceCount: 14, timeSpentMins: 12, suggestedAutomationName: 'Prepare Coding Workspace' },
      { id: 'wf_seq_2', name: 'Hackathon Project Setup', sequenceSteps: ['Git Clone Repo', 'Open VS Code', 'Copy .env.example', 'Run Docker Compose'], occurrenceCount: 8, timeSpentMins: 18, suggestedAutomationName: 'Prepare Hackathon Workspace' },
    ];

    this.coachingAdvice = [
      { id: 'coach_1', title: 'Peak Productivity Window', advice: 'Your focus score is 38% higher between 9 AM and 12 PM. Reserve this window for deep coding sessions.', category: 'deep_work', actionableStep: 'Block 9 AM - 12 PM on calendar for uninterrupted deep work.' },
      { id: 'coach_2', title: 'Batch Browser Research', advice: 'You switch to Chrome every 3 minutes while coding. Try writing code in 25-minute sprints before checking docs.', category: 'context_switching', actionableStep: 'Enable Focus Guard to delay browser switching during active typing.' },
      { id: 'coach_3', title: 'Digital Clutter Prevention', advice: 'You have 1.3 GB of duplicate downloads accumulated over the last 14 days.', category: 'digital_declutter', actionableStep: 'Run 1-Click Storage Cleanup to recover 1.3 GB immediately.' },
    ];

    this.missions = [
      { id: 'mission_1', name: 'Prepare Coding Workspace', description: 'Autonomously launch VS Code, Terminal server, and split-screen Google Chrome documentation tabs.', prompt: 'Prepare coding workspace: Open VS Code, launch Terminal, start dev server, and open browser documentation.', icon: 'Code', cuaVersion: 'v5', estimatedTimeMins: 2, stepsCount: 4 },
      { id: 'mission_2', name: 'Prepare Hackathon Workspace', description: 'Autonomously clone hackathon repo, open VS Code, set environment variables, and launch Docker Compose.', prompt: 'Prepare hackathon workspace: Clone repo, open VS Code, copy .env file, and run docker compose up.', icon: 'Box', cuaVersion: 'v5', estimatedTimeMins: 3, stepsCount: 5 },
      { id: 'mission_3', name: 'Open Focused Study Session', description: 'Autonomously open reference PDFs, browser documentation tabs, and note-taking application.', prompt: 'Open study session: Launch Chrome reference tabs, PDF reader, and Markdown notes editor.', icon: 'BookOpen', cuaVersion: 'v5', estimatedTimeMins: 2, stepsCount: 3 },
      { id: 'mission_4', name: 'End Workday Digital Cleanup', description: 'Autonomously close idle browser tabs, organize Downloads folder, and commit uncommitted git code.', prompt: 'End workday cleanup: Close idle browser tabs, sort Downloads into subfolders, and git commit draft changes.', icon: 'FolderCheck', cuaVersion: 'v5', estimatedTimeMins: 2, stepsCount: 3 },
      { id: 'mission_5', name: 'Morning Startup Routine', description: 'Autonomously launch Slack, email client, VS Code, and start terminal background services.', prompt: 'Morning startup routine: Open Slack, email client, VS Code, and start terminal services.', icon: 'Sun', cuaVersion: 'v5', estimatedTimeMins: 2, stepsCount: 4 },
    ];
  }
}

export const optimizerStore = new OptimizerStore();
