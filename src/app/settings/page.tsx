'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsView } from '@/components/settings/SettingsView';

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}
