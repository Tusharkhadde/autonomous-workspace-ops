'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FocusAnalyzerView } from '@/features/focus/FocusAnalyzerView';

export default function FocusPage() {
  return (
    <AppShell>
      <FocusAnalyzerView />
    </AppShell>
  );
}
