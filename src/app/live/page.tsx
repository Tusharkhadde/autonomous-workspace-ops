'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LiveExecutionViewer } from '@/components/execution/LiveExecutionViewer';

export default function LivePage() {
  return (
    <AppShell>
      <LiveExecutionViewer />
    </AppShell>
  );
}
