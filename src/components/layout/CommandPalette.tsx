'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useOptimizerStore, type Tab } from '@/store/optimizerStore';
import {
  LayoutDashboard,
  Sparkles,
  GitBranch,
  Radio,
  BrainCircuit,
  Zap,
  Files,
  Target,
  Compass,
  Settings,
  Search,
  CornerDownLeft,
} from 'lucide-react';

interface Command {
  title: string;
  href: string;
  tab: Tab;
  icon: React.ElementType;
  hint: string;
}

const COMMANDS: Command[] = [
  { title: 'Go to Dashboard', href: '/dashboard', tab: 'dashboard', icon: LayoutDashboard, hint: 'G D' },
  { title: 'Mission Automation', href: '/missions', tab: 'missions', icon: Sparkles, hint: 'G M' },
  { title: 'Workflow Analyzer', href: '/workflows', tab: 'workflows', icon: GitBranch, hint: 'G W' },
  { title: 'Live Replay Feed', href: '/live', tab: 'live', icon: Radio, hint: 'G L' },
  { title: 'AI Insights', href: '/insights', tab: 'insights', icon: BrainCircuit, hint: 'G I' },
  { title: 'Automations', href: '/insights', tab: 'suggestions', icon: Zap, hint: 'G I' },
  { title: 'Duplicate Finder', href: '/dashboard', tab: 'duplicates', icon: Files, hint: 'G D' },
  { title: 'Focus & Deep Work', href: '/focus', tab: 'focus', icon: Target, hint: 'G F' },
  { title: 'AI Coach', href: '/coach', tab: 'coach', icon: Compass, hint: 'G C' },
  { title: 'Settings', href: '/settings', tab: 'settings', icon: Settings, hint: 'G S' },
];

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => COMMANDS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (!isCommandPaletteOpen) return;
    setSelectedIndex(0);
  }, [query, isCommandPaletteOpen]);

  const runCommand = (cmd: Command) => {
    useOptimizerStore.getState().setActiveTab(cmd.tab);
    router.push(cmd.href);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      runCommand(filtered[selectedIndex]);
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command to jump anywhere..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleListKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div ref={listRef} className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${cmd.title}-${idx}`}
                  data-index={idx}
                  onClick={() => runCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors group ${
                    isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${isSelected ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'}`} />
                    <span>{cmd.title}</span>
                  </div>
                  <span className="flex items-center space-x-2 text-[10px] font-mono">
                    {isSelected ? (
                      <kbd className="px-1.5 py-0.5 bg-zinc-950 text-cyan-400 rounded border border-zinc-700">
                        <CornerDownLeft className="w-3 h-3" />
                      </kbd>
                    ) : (
                      <span className="text-zinc-500">{cmd.hint}</span>
                    )}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500">No matching commands found</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Approval Desk Command Menu</span>
          <span className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </span>
        </div>
      </div>
    </div>
  );
};
