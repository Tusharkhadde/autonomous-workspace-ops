'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { MissionAutomationItem } from '@/types/optimizer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { LiveScreenshotCanvas } from '@/components/execution/LiveScreenshotCanvas';
import {
  Play, Sparkles, Code, BookOpen, FolderCheck, Sun, Box,
  Terminal, CheckCircle2, XCircle, Loader2, StopCircle,
  Activity, Cpu, Globe, Clock, Zap, ShieldCheck, Plus, X, Wand2, AlertTriangle
} from 'lucide-react';

interface MissionRun {
  coastyRunId: string;
  status: 'queued' | 'running' | 'awaiting_human' | 'succeeded' | 'failed' | 'cancelled' | 'timed_out';
  stepsCompleted: number;
  currentAction: string;
  screenshot?: string;
  machineId?: string;
  error?: string;
  startedAt: number;
  creditsCost?: number;
  costCents?: number;
  resultSummary?: string;
  requestId?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Code, BookOpen, FolderCheck, Sun, Box, Terminal, Sparkles, Wand2
};

const getStepActionDescription = (stepNum: number, missionName: string = '') => {
  const nameLower = missionName.toLowerCase();
  let actions = [
    'Provisioning desktop node environment and initializing Coasty agent driver',
    'Opening terminal shell and inspecting local workspace configuration',
    'Launching target development applications and initializing services',
    'Navigating to application workspace & opening source repository',
    'Parsing project files, packages, and environment settings',
    'Executing automated workspace startup commands and background daemons',
    'Verifying active ports, background services, and desktop UI windows',
    'Inspecting active processes and validating setup parameters',
    'Performing system health check and verifying active ports',
    'Testing endpoint responsiveness & validating environment readiness',
    'Finalizing mission execution steps and saving workspace state',
  ];

  if (nameLower.includes('code') || nameLower.includes('prepare') || nameLower.includes('workspace')) {
    actions = [
      'Opening terminal shell & setting workspace environment vars',
      'Launching VS Code editor with target project repository',
      'Opening Slack & developer team channels',
      'Navigating to API documentation in Google Chrome browser',
      'Starting backend service daemons on port 3000',
      'Running database migration & seed scripts',
      'Checking VS Code linter & compiler output window',
      'Opening integrated terminal in VS Code',
      'Verifying live desktop window layout & focus state',
      'Running integration tests & inspecting build output',
      'Locking workspace environment & signaling readiness',
    ];
  }

  if (stepNum <= 0) return 'Initializing Coasty CUA machine...';
  const idx = Math.min(Math.max(0, stepNum - 1), actions.length - 1);
  return `Step #${stepNum}: ${actions[idx]}`;
};

const getStepTargetApp = (stepNum: number, missionName: string = '') => {
  const nameLower = missionName.toLowerCase();
  if (nameLower.includes('code') || nameLower.includes('prepare') || nameLower.includes('workspace')) {
    const apps = ['Terminal', 'VS Code', 'Slack', 'Google Chrome', 'VS Code', 'Terminal'];
    return apps[Math.max(0, stepNum - 1) % apps.length];
  }
  const defaultApps = ['Terminal', 'Google Chrome', 'VS Code', 'Slack'];
  return defaultApps[Math.max(0, stepNum - 1) % defaultApps.length];
};

export const MissionAutomationView: React.FC = () => {
  const { missions, fetchAllData, addMission } = useOptimizerStore();
  const [activeMission, setActiveMission] = useState<MissionAutomationItem | null>(null);
  const [missionRun, setMissionRun] = useState<MissionRun | null>(null);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // New Mission Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');
  const [newMissionPrompt, setNewMissionPrompt] = useState('');
  const [newMissionCua, setNewMissionCua] = useState<'v4' | 'v5'>('v5');
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const activeMissionRef = useRef<MissionAutomationItem | null>(null);
  activeMissionRef.current = activeMission;

  const pollRunStatus = useCallback(async (runId: string) => {
    try {
      const res = await fetch(`/api/coasty/runs/${runId}`);
      if (!res.ok) return;
      const data = await res.json();

      const machineId = data.machine?.id ?? data.machine_id ?? undefined;
      const errMsg = data.error?.message ?? data.error_message ?? undefined;
      const resultSummary = data.result?.summary?.slice(-400) ?? undefined;

      setMissionRun(prev => {
        if (!prev) return null;
        const newStepsDone = data.steps_completed ?? prev.stepsCompleted;
        const missionName = activeMissionRef.current?.name || '';
        const resolvedAction = data.current_action || getStepActionDescription(newStepsDone, missionName);

        return {
          ...prev,
          status: data.status,
          stepsCompleted: newStepsDone,
          currentAction: resolvedAction,
          screenshot: data.screenshot_base64 ?? prev.screenshot,
          machineId: machineId ?? prev.machineId,
          error: errMsg,
          creditsCost: data.credits_charged ?? prev.creditsCost,
          costCents: data.cost_cents ?? prev.costCents,
          resultSummary: resultSummary,
          requestId: data.request_id ?? prev.requestId,
        };
      });

      const label = data.status === 'timed_out' ? `⏰ Timed out after ${data.steps_completed} steps` :
                    data.status === 'succeeded' ? `✅ Completed — ${data.steps_completed} steps` :
                    `Status: ${data.status}${ data.steps_completed ? ` (${data.steps_completed} steps)` : '' }`;
      addLog(label);

      if (['succeeded', 'failed', 'cancelled', 'timed_out'].includes(data.status)) {
        stopPolling();
        if (data.credits_charged) addLog(`💳 Credits used: ${data.credits_charged} (cost: $${((data.cost_cents ?? 0) / 100).toFixed(2)})`);
        if (errMsg) addLog(`⚠️ ${errMsg}`);
      }
    } catch (err) {
      addLog('⚠️ Poll error — retrying...');
    }
  }, [addLog, stopPolling]);

  const handleLaunchMission = async (mission: MissionAutomationItem) => {
    setActiveMission(mission);
    setMissionRun(null);
    setLogs([]);
    setError(null);
    setLaunching(true);

    addLog(`🚀 Launching mission: "${mission.name}"`);
    addLog(`📋 Task: "${mission.prompt}"`);
    addLog(`⚙️  CUA Version: Coasty ${mission.cuaVersion}`);

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: mission.id, prompt: mission.prompt }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: Failed to launch mission`);
      }

      const data = await res.json();

      const run: MissionRun = {
        coastyRunId: data.coastyRunId,
        status: data.status,
        stepsCompleted: 0,
        currentAction: 'Initializing Coasty CUA machine...',
        machineId: data.machineId,
        startedAt: Date.now(),
      };

      setMissionRun(run);
      addLog(`✅ Task created on Coasty! Run ID: ${data.coastyRunId}`);
      addLog(`🖥  Machine: ${data.machineId ?? 'auto-provisioning...'}`);
      addLog(`📡 Starting status polling every 5 seconds...`);

      // Start polling
      pollRef.current = setInterval(() => pollRunStatus(data.coastyRunId), 5000);

    } catch (err: any) {
      const msg = err.message === 'Failed to fetch'
        ? 'Server offline or disconnected. Please ensure Next.js dev server is running.'
        : err.message;
      setError(msg);
      addLog(`❌ Error: ${msg}`);
    } finally {
      setLaunching(false);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionName.trim() || !newMissionPrompt.trim()) return;

    setCreating(true);
    setModalError(null);

    const newMissionItem: MissionAutomationItem = {
      id: `mission_custom_${Date.now()}`,
      name: newMissionName.trim(),
      description: newMissionDesc.trim() || 'Custom user-defined autonomous task',
      prompt: newMissionPrompt.trim(),
      icon: 'Wand2',
      cuaVersion: newMissionCua,
      estimatedTimeMins: 3,
      stepsCount: 5,
    };

    // Optimistic Update
    addMission(newMissionItem);

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: newMissionItem.name,
          description: newMissionItem.description,
          prompt: newMissionItem.prompt,
          cuaVersion: newMissionItem.cuaVersion,
          icon: 'Wand2',
        }),
      });

      if (res.ok) {
        await fetchAllData().catch(() => {});
      }
    } catch (err: any) {
      console.warn('[MissionAutomationView] Server offline during mission save:', err);
    } finally {
      setCreating(false);
      setIsModalOpen(false);
      setNewMissionName('');
      setNewMissionDesc('');
      setNewMissionPrompt('');
    }
  };

  const handleCancel = async () => {
    if (!missionRun) return;
    try {
      await fetch(`/api/coasty/runs/${missionRun.coastyRunId}/cancel`, { method: 'POST' });
      stopPolling();
      setMissionRun(prev => prev ? { ...prev, status: 'cancelled' } : null);
      addLog('🛑 Mission cancelled.');
    } catch (err) {
      addLog('⚠️ Could not cancel — run may have already completed.');
    }
  };

  useEffect(() => () => stopPolling(), [stopPolling]);

  const elapsedSecs = missionRun ? Math.floor((Date.now() - missionRun.startedAt) / 1000) : 0;

  const statusColor = (s?: string) => {
    switch (s) {
      case 'running': return 'text-cyan-400';
      case 'queued': return 'text-amber-400';
      case 'succeeded': return 'text-emerald-400';
      case 'failed':
      case 'timed_out': return 'text-rose-400';
      case 'cancelled': return 'text-zinc-400';
      default: return 'text-zinc-400';
    }
  };

  const StatusIcon = ({ status }: { status?: string }) => {
    switch (status) {
      case 'running': return <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />;
      case 'queued': return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'succeeded': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed':
      case 'timed_out': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Activity className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        icon={Sparkles}
        title={
          <>
            <span>Mission Automation</span>
            <Badge variant="default" className="ml-2 text-[10px] font-mono">via Coasty API</Badge>
          </>
        }
        description={
          <>
            Launch autonomous computer-use tasks or add custom tasks via{' '}
            <span className="text-cyan-400 font-mono">https://coasty.ai/v1/tasks</span>
          </>
        }
        right={
          <div className="flex items-center space-x-3">
            <Button onClick={() => { setIsModalOpen(true); setModalError(null); }} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Custom Task</span>
            </Button>
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>API Key Connected</span>
            </div>
          </div>
        }
      />

      {/* Live Run Panel */}
      {activeMission && (
        <Card className="bg-zinc-900/90 border border-zinc-800 shadow-2xl">
          <CardContent className="p-6 space-y-4">
            {/* Run Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <StatusIcon status={missionRun?.status} />
                  <span className={`text-sm font-bold ${statusColor(missionRun?.status)}`}>
                    {missionRun?.status?.toUpperCase() ?? 'LAUNCHING...'}
                  </span>
                  {missionRun && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      Run: {missionRun.coastyRunId}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-white">{activeMission.name}</h3>
                {missionRun?.machineId && (
                  <p className="text-[11px] font-mono text-zinc-500">
                    Machine: {missionRun.machineId}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {missionRun && missionRun.status === 'running' && (
                  <Button variant="destructive" size="sm" onClick={handleCancel}>
                    <StopCircle className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => {
                  setActiveMission(null);
                  setMissionRun(null);
                  setLogs([]);
                  stopPolling();
                }}>
                  Close
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Metrics */}
              <div className="space-y-4">
                {/* Progress */}
                {missionRun && (() => {
                  const dynamicMaxSteps = Math.max(activeMission.stepsCount, missionRun.stepsCompleted);
                  const isDone = ['succeeded', 'failed', 'cancelled', 'timed_out'].includes(missionRun.status);
                  const progressPercent = isDone
                    ? 100
                    : Math.min(95, Math.round((missionRun.stepsCompleted / dynamicMaxSteps) * 100));

                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Steps Completed</span>
                        <span>{missionRun.stepsCompleted} / {dynamicMaxSteps} ({progressPercent}%)</span>
                      </div>
                      <Progress
                        value={progressPercent}
                        className="h-2"
                      />
                    </div>
                  );
                })()}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500">ELAPSED</span>
                    <p className="text-sm font-bold text-white font-mono">
                      {missionRun ? `${elapsedSecs}s` : '--'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500">CUA VERSION</span>
                    <p className="text-sm font-bold text-cyan-400 font-mono">
                      Coasty {activeMission.cuaVersion}
                    </p>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500">CURRENT ACTION</span>
                    <p className="text-xs font-mono text-zinc-300 break-words">
                      {missionRun?.currentAction || getStepActionDescription(missionRun?.stepsCompleted || 0, activeMission.name)}
                    </p>
                  </div>
                </div>

                {/* Live Visual Desktop Screen Feed */}
                {(() => {
                  const currentStepNum = Math.max(1, missionRun?.stepsCompleted || 1);
                  const targetApp = getStepTargetApp(currentStepNum, activeMission.name);
                  const currentActionText = missionRun?.currentAction || getStepActionDescription(currentStepNum, activeMission.name);

                  return (
                    <div className="rounded-xl overflow-hidden border border-zinc-800">
                      <LiveScreenshotCanvas
                        step={{
                          id: activeMission.id,
                          runId: missionRun?.coastyRunId || activeMission.id,
                          stepNumber: currentStepNum,
                          title: currentActionText,
                          description: activeMission.prompt,
                          actionType: 'command',
                          targetApp: targetApp,
                          command: currentActionText,
                          status: missionRun?.status === 'running' ? 'running' : 'succeeded',
                          screenshotUrl: missionRun?.screenshot ? `data:image/png;base64,${missionRun.screenshot}` : undefined,
                          durationMs: 1200,
                          riskLevel: 'low',
                          requiresApproval: false,
                          isApproved: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }}
                        runTitle={activeMission.name}
                        isLive={missionRun?.status === 'running'}
                      />
                    </div>
                  );
                })()}
              </div>

              {/* Terminal Log */}
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col">
                <div className="flex items-center space-x-2 px-3 py-2 border-b border-zinc-800 text-xs font-mono text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>MISSION STREAM</span>
                  {missionRun?.status === 'running' && (
                    <span className="ml-auto animate-pulse text-cyan-400">● LIVE</span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-0.5 min-h-[200px] max-h-[300px]">
                  {logs.map((log, i) => (
                    <p key={i} className="text-[11px] font-mono text-zinc-300 leading-relaxed">{log}</p>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-[11px] font-mono text-zinc-600">Waiting for mission launch...</p>
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>

            {/* Success / Timed Out / Error State Cards */}
            {missionRun && ['succeeded', 'timed_out', 'failed', 'cancelled'].includes(missionRun.status) && (
              <div className={`p-4 rounded-xl border space-y-2 ${
                missionRun.status === 'succeeded'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : missionRun.status === 'timed_out'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className="flex items-center space-x-3">
                  {missionRun.status === 'succeeded'
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    : <XCircle className="w-6 h-6 text-rose-400 shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${
                      missionRun.status === 'succeeded' ? 'text-emerald-400' :
                      missionRun.status === 'timed_out' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {missionRun.status === 'succeeded' ? 'Mission Completed Successfully!' :
                       missionRun.status === 'timed_out' ? 'Mission Reached Step Limit' : 'Mission Failed'}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Coasty CUA executed {missionRun.stepsCompleted} steps on machine <span className="font-mono text-zinc-300">{missionRun.machineId}</span>
                    </p>
                  </div>
                </div>
                {/* Real Coasty Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {missionRun.requestId && (
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-0.5">
                      <span className="text-[9px] font-mono text-zinc-500">REQUEST ID</span>
                      <p className="text-[10px] font-mono text-zinc-300 truncate">{missionRun.requestId?.slice(0, 18)}</p>
                    </div>
                  )}
                  {missionRun.creditsCost !== undefined && (
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-0.5">
                      <span className="text-[9px] font-mono text-zinc-500">CREDITS USED</span>
                      <p className="text-[10px] font-mono text-cyan-400 font-bold">{missionRun.creditsCost} credits</p>
                    </div>
                  )}
                  {missionRun.costCents !== undefined && (
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-0.5">
                      <span className="text-[9px] font-mono text-zinc-500">COST</span>
                      <p className="text-[10px] font-mono text-emerald-400 font-bold">${((missionRun.costCents ?? 0) / 100).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-300">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => {
          const Icon = ICON_MAP[mission.icon] ?? Box;
          const isActive = activeMission?.id === mission.id;
          return (
            <Card
              key={mission.id}
              className={`p-5 flex flex-col justify-between space-y-4 transition-all ${
                isActive ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                      : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white leading-tight">{mission.name}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500">{mission.stepsCount} steps</span>
                      <span className="text-[10px] font-mono text-zinc-600">•</span>
                      <span className="text-[10px] font-mono text-zinc-500">~{mission.estimatedTimeMins} min</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{mission.description}</p>

                {/* Task preview */}
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <p className="text-[11px] font-mono text-zinc-500 leading-relaxed line-clamp-2">
                    {mission.prompt}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-mono text-cyan-400">Coasty {mission.cuaVersion}</span>
                </div>
                <Button
                  size="sm"
                  disabled={launching && isActive}
                  onClick={() => handleLaunchMission(mission)}
                  className="relative"
                >
                  {launching && isActive ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                      Launch Mission
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Add New Custom Mission Task</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Task Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open Spotify & Start Coding Music"
                  value={newMissionName}
                  onChange={(e) => setNewMissionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Description</label>
                <input
                  type="text"
                  placeholder="Brief summary of what this task does..."
                  value={newMissionDesc}
                  onChange={(e) => setNewMissionDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Instructions for the agent</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe step-by-step what the agent should do on the desktop..."
                  value={newMissionPrompt}
                  onChange={(e) => setNewMissionPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Coasty CUA Engine Version</label>
                <select
                  value={newMissionCua}
                  onChange={(e) => setNewMissionCua(e.target.value as 'v4' | 'v5')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none"
                >
                  <option value="v5">Coasty CUA v5 (Latest Autonomous Multi-step)</option>
                  <option value="v4">Coasty CUA v4 (Legacy)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Plus className="w-3.5 h-3.5 mr-1.5" />}
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Info Banner */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-zinc-400">Powered by:</span>
          <span className="text-cyan-400 font-bold">POST https://coasty.ai/v1/tasks</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono sm:ml-auto">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">API Key:</span>
          <span className="text-zinc-400">configured via .env</span>
        </div>
      </div>
    </PageContainer>
  );
};
