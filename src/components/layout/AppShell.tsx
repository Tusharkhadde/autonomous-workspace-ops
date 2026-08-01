'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { useOptimizerStore, type Tab } from '@/store/optimizerStore';
import { useUIStore } from '@/store/uiStore';

interface AppShellProps {
  children: React.ReactNode;
}

/** G then <key> quick-navigation map (matches Keyboard Shortcuts modal). */
const NAV_KEYS: Record<string, { href: string; tab: Tab }> = {
  d: { href: '/dashboard', tab: 'dashboard' },
  m: { href: '/missions', tab: 'missions' },
  w: { href: '/workflows', tab: 'workflows' },
  l: { href: '/live', tab: 'live' },
  i: { href: '/insights', tab: 'insights' },
  f: { href: '/focus', tab: 'focus' },
  c: { href: '/coach', tab: 'coach' },
  s: { href: '/settings', tab: 'settings' },
};

/** Default tab per route, used to keep activeTab in sync with the URL. */
const ROUTE_DEFAULT_TAB: Record<string, Tab> = {
  '/dashboard': 'dashboard',
  '/missions': 'missions',
  '/workflows': 'workflows',
  '/live': 'live',
  '/insights': 'insights',
  '/focus': 'focus',
  '/coach': 'coach',
  '/settings': 'settings',
};

/** Tabs that are rendered on a shared route via the sidebar sub-views. */
const ROUTE_TABS: Record<string, Tab[]> = {
  '/dashboard': ['dashboard', 'activity', 'duplicates'],
  '/insights': ['insights', 'suggestions'],
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { fetchAllData, setActiveTab, activeTab } = useOptimizerStore();
  const { isCommandPaletteOpen } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Keep activeTab consistent with the current route so direct navigation
  // (URL, header links, G-key nav) never leaves a stale sub-view active.
  useEffect(() => {
    const routeTabs = ROUTE_TABS[pathname];
    if (routeTabs) {
      if (!routeTabs.includes(activeTab)) {
        setActiveTab(ROUTE_DEFAULT_TAB[pathname] ?? 'dashboard');
      }
      return;
    }
    const defaultTab = ROUTE_DEFAULT_TAB[pathname];
    if (defaultTab && activeTab !== defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [pathname, activeTab, setActiveTab]);

  // G + key quick navigation
  useEffect(() => {
    let pendingG = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandPaletteOpen) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'g') {
        pendingG = true;
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => {
          pendingG = false;
        }, 1000);
        return;
      }

      if (pendingG && NAV_KEYS[key]) {
        const nav = NAV_KEYS[key];
        e.preventDefault();
        setActiveTab(nav.tab);
        router.push(nav.href);
        pendingG = false;
        if (gTimer) clearTimeout(gTimer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [router, setActiveTab, isCommandPaletteOpen]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-12">
          <div key={pathname} className="animate-fade-in-up h-full">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
      <KeyboardShortcutsModal />
    </div>
  );
};
