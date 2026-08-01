import { inMemoryStore } from '@/lib/storage';
import { SavedWorkflowTemplate } from '@/types/workflow';

export function getSavedWorkflows(): SavedWorkflowTemplate[] {
  return Array.from(inMemoryStore.savedWorkflows.values());
}

export function getWorkflowTemplateById(id: string): SavedWorkflowTemplate | undefined {
  return inMemoryStore.savedWorkflows.get(id);
}
