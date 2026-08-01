'use client';

import React from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Settings, Key, ShieldCheck, Cpu, Save } from 'lucide-react';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors';

export const SettingsView: React.FC = () => {
  const {
    coastyApiKey,
    setCoastyApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    cuaVersion,
    setCuaVersion,
    autoApproveRiskThreshold,
    setAutoApproveRiskThreshold,
    machineOs,
    setMachineOs,
    resolution,
    setResolution,
  } = useSettingsStore();

  return (
    <PageContainer>
      <PageHeader
        icon={Settings}
        title="Settings & Operator Configuration"
        description="Configure Coasty API keys, OpenAI planner credentials, safety thresholds, and virtual desktop parameters."
      />

      {/* API Keys Configuration */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>API Credentials</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Coasty API Key (X-API-Key)</label>
            <input
              type="password"
              value={coastyApiKey}
              onChange={(e) => setCoastyApiKey(e.target.value)}
              placeholder="Enter your Coasty API key"
              className={`${inputClass} font-mono text-cyan-400`}
            />
            <p className="text-[11px] text-zinc-500">Official key used for computer-use machine provisioning and REST operations.</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">OpenAI API Key (Optional Planner Boost)</label>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className={`${inputClass} font-mono`}
            />
            <p className="text-[11px] text-zinc-500">Used for GPT-4o execution plan graph generation and error diagnostics.</p>
          </div>
        </div>
      </div>

      {/* Risk Governance & Engine Config */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Safety & Auto-Approval Policy</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Auto-Approve Risk Threshold</label>
            <select
              value={autoApproveRiskThreshold}
              onChange={(e) => setAutoApproveRiskThreshold(e.target.value as 'low' | 'medium' | 'high')}
              className={inputClass}
            >
              <option value="low">Low Risk Only (Strict Confirmation)</option>
              <option value="medium">Medium Risk Cap (Recommended)</option>
              <option value="high">High Risk Cap (Autonomous)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Coasty CUA Version</label>
            <select
              value={cuaVersion}
              onChange={(e) => setCuaVersion(e.target.value as 'v3' | 'v4' | 'v5')}
              className={inputClass}
            >
              <option value="v5">Coasty CUA v5 (Autonomous + Self-Verification)</option>
              <option value="v4">Coasty CUA v4 (Standard Autonomous)</option>
              <option value="v3">Coasty CUA v3 (Manual Driver)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Virtual Machine Specifications */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Virtual Machine Environment</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Machine Operating System</label>
            <select
              value={machineOs}
              onChange={(e) => setMachineOs(e.target.value as 'Ubuntu 22.04 LTS' | 'macOS Sonoma' | 'Windows 11 Pro')}
              className={inputClass}
            >
              <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS (Cloud VM)</option>
              <option value="macOS Sonoma">macOS Sonoma (M3 Cloud)</option>
              <option value="Windows 11 Pro">Windows 11 Pro (Cloud VM)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Display Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as '1920x1080' | '2560x1440' | '1280x720')}
              className={inputClass}
            >
              <option value="1920x1080">1920 x 1080 (Full HD)</option>
              <option value="2560x1440">2560 x 1440 (2K QHD)</option>
              <option value="1280x720">1280 x 720 (720p HD)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          <Save className="w-4 h-4" />
          <span>Settings Auto-Saved</span>
        </div>
      </div>
    </PageContainer>
  );
};
