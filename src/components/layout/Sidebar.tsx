'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOptimizerStore, type Tab } from '@/store/optimizerStore';
import {
  LayoutDashboard,
  Monitor,
  BrainCircuit,
  Zap,
  Files,
  GitBranch,
  Target,
  Compass,
  Sparkles,
  Settings,
  Shield,
  Radio,
} from 'lucide-react';

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string | null;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeTab, setActiveTab, insights, suggestions, duplicates } = useOptimizerStore();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'activity', label: 'Activity Timeline', icon: Monitor, href: '/dashboard' },
    { id: 'missions', label: 'Mission Automation', icon: Sparkles, href: '/missions', highlight: true },
    { id: 'workflows', label: 'Workflow Analyzer', icon: GitBranch, href: '/workflows' },
    { id: 'live', label: 'Live Replay Feed', icon: Radio, href: '/live' },
    { id: 'insights', label: 'AI Insights', icon: BrainCircuit, badge: insights.length ? `${insights.length}` : null, href: '/insights' },
    { id: 'suggestions', label: 'Automations', icon: Zap, badge: suggestions.length ? `${suggestions.length}` : null, href: '/insights' },
    { id: 'duplicates', label: 'Duplicate Finder', icon: Files, badge: duplicates.length ? `${duplicates.length}` : null, href: '/dashboard' },
    { id: 'focus', label: 'Focus & Deep Work', icon: Target, href: '/focus' },
    { id: 'coach', label: 'AI Coach', icon: Compass, href: '/coach' },
    { id: 'settings', label: 'Privacy & Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-4">
        <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-500 px-3 flex items-center justify-between">
          <span>Productivity Modules</span>
          <span className="text-[9px] text-cyan-400 font-mono">v5 LIVE</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id || pathname === item.href;

            return (
              <Link key={item.id} href={item.href}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isTabActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-indigo-600/15 text-white font-bold border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isTabActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/80">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Local Privacy Active</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Risky agent steps pause for human confirmation before they run.
          </p>
        </div>
      </div>
    </aside>
  );
};
