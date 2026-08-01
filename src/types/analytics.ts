/**
 * Analytics and Performance Metrics Types
 */

export interface SystemAnalytics {
  totalWorkflows: number;
  successfulWorkflows: number;
  failedWorkflows: number;
  successRate: number;
  totalDurationSeconds: number;
  totalComputerHoursSaved: number;
  humanInterventionsCount: number;
  averageStepsPerRun: number;
  estimatedCost: number;
  runsByStatus: Record<string, number>;
  dailyTrends: DailyAnalyticsPoint[];
}

export interface DailyAnalyticsPoint {
  date: string;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  interventions: number;
}
