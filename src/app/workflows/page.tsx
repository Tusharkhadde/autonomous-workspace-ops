'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { WorkflowAnalyzerView } from '@/features/workflows/WorkflowAnalyzerView';

export default function WorkflowsPage() {
  return (
    <AppShell>
      <WorkflowAnalyzerView />
    </AppShell>
  );
}
