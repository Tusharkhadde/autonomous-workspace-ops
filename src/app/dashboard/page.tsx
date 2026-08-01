'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useOptimizerStore } from '@/store/optimizerStore';
import { OptimizerDashboardView } from '@/features/dashboard/OptimizerDashboardView';
import { ActivityTimelineView } from '@/features/activity/ActivityTimelineView';
import { DuplicateFinderView } from '@/features/duplicates/DuplicateFinderView';

export default function DashboardPage() {
  const activeTab = useOptimizerStore((s) => s.activeTab);

  const view =
    activeTab === 'activity' ? <ActivityTimelineView /> :
    activeTab === 'duplicates' ? <DuplicateFinderView /> :
    <OptimizerDashboardView />;

  return <AppShell>{view}</AppShell>;
}
