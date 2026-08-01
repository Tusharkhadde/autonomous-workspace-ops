import { create } from 'zustand';
import { WorkflowRunData, WorkflowStep } from '@/types/workflow';

interface WorkflowState {
  activeRun: WorkflowRunData | null;
  selectedStep: WorkflowStep | null;

  setActiveRun: (run: WorkflowRunData | null) => void;
  setSelectedStep: (step: WorkflowStep | null) => void;
  pollRunStatus: (runId: string) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  activeRun: null,
  selectedStep: null,

  setActiveRun: (activeRun) => set({ activeRun }),
  setSelectedStep: (selectedStep) => set({ selectedStep }),

  pollRunStatus: async (runId: string) => {
    try {
      const res = await fetch(`/api/workflows/${runId}/status`);
      if (res.ok) {
        const data: WorkflowRunData = await res.json();
        set({ activeRun: data });

        // Auto-select running or active step
        if (data.steps && data.steps.length > 0) {
          const current = data.steps.find((s) => s.status === 'running' || s.status === 'awaiting_approval') || data.steps[0];
          set({ selectedStep: current });
        }
      }
    } catch (e) {
      console.warn('Failed to poll run status:', e);
    }
  },
}));
