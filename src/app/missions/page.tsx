'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MissionAutomationView } from '@/features/missions/MissionAutomationView';

export default function MissionsPage() {
  return (
    <AppShell>
      <MissionAutomationView />
    </AppShell>
  );
}
