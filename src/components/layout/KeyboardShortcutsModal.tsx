'use client';

import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isKeyboardShortcutsOpen, setKeyboardShortcutsOpen } = useUIStore();

  if (!isKeyboardShortcutsOpen) return null;

  const shortcuts = [
    { key: '⌘/Ctrl + K', description: 'Open Command Palette' },
    { key: 'G then D', description: 'Go to Dashboard' },
    { key: 'G then M', description: 'Go to Mission Automation' },
    { key: 'G then W', description: 'Go to Workflow Analyzer' },
    { key: 'G then L', description: 'Go to Live Replay Feed' },
    { key: 'G then I', description: 'Go to AI Insights' },
    { key: 'G then F', description: 'Go to Focus & Deep Work' },
    { key: 'G then C', description: 'Go to AI Coach' },
    { key: 'G then S', description: 'Go to Settings' },
    { key: 'Esc', description: 'Close Modals & Dismiss Overlays' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-sm">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setKeyboardShortcutsOpen(false)}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs"
            >
              <span className="text-zinc-300">{sc.description}</span>
              <kbd className="px-2 py-1 text-[10px] font-mono font-bold bg-zinc-800 text-cyan-400 rounded border border-zinc-700">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-[11px] text-zinc-500 font-mono">
          Press ESC to dismiss
        </div>
      </div>
    </div>
  );
};
