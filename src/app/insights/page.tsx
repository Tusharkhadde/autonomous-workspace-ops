'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useOptimizerStore } from '@/store/optimizerStore';
import { AIInsightsView } from '@/features/insights/AIInsightsView';
import { AutomationSuggestionsView } from '@/features/suggestions/AutomationSuggestionsView';

export default function InsightsPage() {
  const activeTab = useOptimizerStore((s) => s.activeTab);

  const view =
    activeTab === 'suggestions' ? <AutomationSuggestionsView /> : <AIInsightsView />;

  return <AppShell>{view}</AppShell>;
}
