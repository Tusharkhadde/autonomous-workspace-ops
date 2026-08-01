/**
 * Workspace Optimizer Core Types
 */

export interface ActivityItem {
  id: string;
  appName: string;
  windowTitle: string;
  category: 'development' | 'research' | 'communication' | 'utility';
  durationSec: number;
  switches: number;
  idleTimeSec: number;
  icon?: string;
  timestamp: string;
}

export interface ProductivityInsightItem {
  id: string;
  title: string;
  description: string;
  type: 'app_switching' | 'file_search' | 'duplicate_download' | 'repetitive_action' | 'idle_burn';
  impactLevel: 'low' | 'medium' | 'high';
  timeWastedMins: number;
  actionRecommendation: string;
  createdAt: string;
}

export interface AutomationSuggestionItem {
  id: string;
  title: string;
  description: string;
  actionType: 'launch_workspace' | 'organize_downloads' | 'pin_folders' | 'batch_rename' | 'close_idle_tabs';
  timeSavedMins: number;
  isExecuted: boolean;
  estimatedComplexity: '1-Click' | 'Autonomous';
  createdAt: string;
}

export interface DuplicateFileItem {
  id: string;
  fileName: string;
  filePath: string;
  fileSizeMb: number;
  duplicateCount: number;
  category: 'download' | 'screenshot' | 'document' | 'archive' | 'large_file';
  createdAt: string;
}

export interface WorkflowSequenceItem {
  id: string;
  name: string;
  sequenceSteps: string[];
  occurrenceCount: number;
  timeSpentMins: number;
  suggestedAutomationName: string;
}

export interface FocusMetrics {
  score: number;
  contextSwitches: number;
  deepWorkMins: number;
  codingMins: number;
  researchMins: number;
  meetingMins: number;
  idleMins: number;
  date: string;
}

export interface AICoachingAdvice {
  id: string;
  title: string;
  advice: string;
  category: 'deep_work' | 'context_switching' | 'digital_declutter' | 'time_management';
  actionableStep: string;
}

export interface MissionAutomationItem {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  cuaVersion: 'v4' | 'v5';
  estimatedTimeMins: number;
  stepsCount: number;
  lastRunAt?: string;
}
