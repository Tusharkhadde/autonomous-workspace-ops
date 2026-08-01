'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AICoachView } from '@/features/coach/AICoachView';

export default function CoachPage() {
  return (
    <AppShell>
      <AICoachView />
    </AppShell>
  );
}
