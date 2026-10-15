'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimizerStore } from '@/store/optimizerStore';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Command,
  Keyboard,
  Activity,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const { setActiveTab } = useOptimizerStore();
  const { setCommandPaletteOpen, setKeyboardShortcutsOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand logo & tagline */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                Approval Desk
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                DEMO
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Workspace AI Productivity Engineer
            </p>
          </div>
        </Link>

        {/* Quick Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-medium text-zinc-400 border-l border-zinc-800 pl-6">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/missions', label: 'Missions' },
            { href: '/workflows', label: 'Workflows' },
            { href: '/live', label: 'Live Stream' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        <Link href="/missions">
          <button
            onClick={() => setActiveTab('missions')}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Launch Mission</span>
          </button>
        </Link>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:text-white hover:border-zinc-700 transition-colors"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Command Palette</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setKeyboardShortcutsOpen(true)}
          title="Keyboard Shortcuts"
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Observer: Active</span>
        </div>

        {/* User Auth Profile Dropdown */}
        <div className="relative">
          {isAuthenticated && user ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30"
              />
              <span className="font-semibold text-white max-w-[100px] truncate hidden sm:inline">{user.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors">
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  <span>Sign In</span>
                </button>
              </Link>
              <Link href="/register">
                <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors">
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  <span>Sign Up</span>
                </button>
              </Link>
            </div>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
                  {user.plan || 'Demo'}
                </span>
              </div>
              <button
                onClick={() => { router.push('/dashboard'); setDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800 flex items-center space-x-2"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => { logout(); setDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
