import { create } from 'zustand';
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

export type Tab =
  | 'dashboard'
  | 'activity'
  | 'insights'
  | 'suggestions'
  | 'duplicates'
  | 'workflows'
  | 'live'
  | 'focus'
  | 'coach'
  | 'missions'
  | 'settings';

interface OptimizerState {
  activeTab: Tab;
  activities: ActivityItem[];
  insights: ProductivityInsightItem[];
  suggestions: AutomationSuggestionItem[];
  duplicates: DuplicateFileItem[];
  workflows: WorkflowSequenceItem[];
  focus: FocusMetrics | null;
  coachingAdvice: AICoachingAdvice[];
  missions: MissionAutomationItem[];
  isLoading: boolean;

  setActiveTab: (tab: Tab) => void;
  fetchAllData: () => Promise<void>;
  addMission: (mission: MissionAutomationItem) => void;
  executeSuggestion: (id: string) => Promise<void>;
  deleteDuplicate: (id: string) => Promise<void>;
}

export const useOptimizerStore = create<OptimizerState>((set, get) => ({
  activeTab: 'dashboard',
  activities: [],
  insights: [],
  suggestions: [],
  duplicates: [],
  workflows: [],
  focus: null,
  coachingAdvice: [],
  missions: [],
  isLoading: false,

  setActiveTab: (activeTab) => set({ activeTab }),

  fetchAllData: async () => {
    set({ isLoading: true });
    try {
      const [actRes, insRes, sugRes, dupRes, focRes, coaRes, misRes] = await Promise.all([
        fetch('/api/activity').then((r) => r.json()).catch(() => []),
        fetch('/api/insights').then((r) => r.json()).catch(() => []),
        fetch('/api/suggestions').then((r) => r.json()).catch(() => []),
        fetch('/api/duplicates').then((r) => r.json()).catch(() => []),
        fetch('/api/focus').then((r) => r.json()).catch(() => null),
        fetch('/api/coach').then((r) => r.json()).catch(() => []),
        fetch('/api/missions').then((r) => r.json()).catch(() => []),
      ]);
      set((state) => ({
        activities: actRes || state.activities,
        insights: insRes || state.insights,
        suggestions: sugRes || state.suggestions,
        duplicates: (dupRes.items || dupRes) ?? state.duplicates,
        focus: focRes ?? state.focus,
        coachingAdvice: coaRes || state.coachingAdvice,
        missions: (misRes && misRes.length > 0) ? misRes : state.missions,
      }));
    } catch (err) {
      console.warn('[OptimizerStore] fetchAllData error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addMission: (mission: MissionAutomationItem) => {
    set((state) => ({ missions: [mission, ...state.missions] }));
  },

  executeSuggestion: async (suggestionId: string) => {
    try {
      await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId }),
      });
      await get().fetchAllData();
    } catch (err) {
      console.warn('[OptimizerStore] executeSuggestion error:', err);
    }
  },

  deleteDuplicate: async (duplicateId: string) => {
    try {
      await fetch('/api/duplicates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: duplicateId }),
      });
      await get().fetchAllData();
    } catch (err) {
      console.warn('[OptimizerStore] deleteDuplicate error:', err);
    }
  },
}));
