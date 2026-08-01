'use client';

import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { LiveScreenshotCanvas } from './LiveScreenshotCanvas';
import { StepTimeline } from './StepTimeline';
import { ApprovalModal } from '../approval/ApprovalModal';
import { PageContainer } from '../layout/PageContainer';
import { PendingApprovalRequest } from '@/types/approval';
import { WorkflowRunData } from '@/types/workflow';
import { soundFx } from '@/lib/audio';
import {
  Play,
  Square,
  RefreshCw,
  Terminal,
  Rewind,
  FastForward,
  Activity,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DEFAULT_DEMO_RUN: WorkflowRunData = {
  id: 'run_demo_morning_startup',
  title: 'Prepare Coding Workspace — Coasty CUA v5',
  prompt: 'Prepare coding workspace: Open VS Code, launch Terminal, start dev server, and open browser documentation.',
  status: 'running',
  cuaVersion: 'v5',
  machineId: 'coasty-node-v5-cloud-09',
  maxSteps: 4,
  stepsCount: 4,
  riskScore: 'low',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  steps: [
    {
      id: 'step_1',
      runId: 'run_demo_morning_startup',
      stepNumber: 1,
      title: 'Initialize Terminal & Inspect Environment',
      description: 'Open terminal, inspect node version, and check local port availability.',
      actionType: 'command',
      targetApp: 'Terminal',
      command: 'node -v && lsof -i :3000',
      status: 'succeeded',
      durationMs: 850,
      riskLevel: 'low',
      requiresApproval: false,
      isApproved: true,
      outputLogs: '[STDOUT] v20.11.0\n[STDOUT] Port 3000 available for dev server daemon.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_2',
      runId: 'run_demo_morning_startup',
      stepNumber: 2,
      title: 'Launch VS Code Workspace Editor',
      description: 'Open target project repository in VS Code with split editor windows.',
      actionType: 'launch_app',
      targetApp: 'VS Code',
      command: 'code ./workspace',
      status: 'succeeded',
      durationMs: 1200,
      riskLevel: 'low',
      requiresApproval: false,
      isApproved: true,
      outputLogs: '[COASTY CUA] Launched VS Code executable. Opened workspace folder ./workspace.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_3',
      runId: 'run_demo_morning_startup',
      stepNumber: 3,
      title: 'Start Next.js Development Server',
      description: 'Run npm run dev in integrated terminal buffer and listen on port 3000.',
      actionType: 'command',
      targetApp: 'Terminal',
      command: 'npm run dev',
      status: 'running',
      durationMs: 2100,
      riskLevel: 'medium',
      requiresApproval: false,
      isApproved: true,
      outputLogs: '[COASTY CUA] > next dev\n[INFO] Ready in 1.8s at http://localhost:3000\n[LIVE] Polling event stream active...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'step_4',
      runId: 'run_demo_morning_startup',
      stepNumber: 4,
      title: 'Open Google Chrome Developer Docs',
      description: 'Navigate to http://localhost:3000 and open team Slack channel.',
      actionType: 'browser_nav',
      targetApp: 'Google Chrome',
      command: 'google-chrome http://localhost:3000',
      status: 'pending',
      durationMs: 0,
      riskLevel: 'low',
      requiresApproval: false,
      isApproved: false,
      outputLogs: '[PENDING] Awaiting step 3 completion before launching browser view.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export const LiveExecutionViewer: React.FC = () => {
  const { activeRun, setActiveRun, selectedStep, setSelectedStep, pollRunStatus } = useWorkflowStore();
  const [pendingApproval, setPendingApproval] = useState<PendingApprovalRequest | null>(null);
  const [replayIndex, setReplayIndex] = useState<number>(0);

  // Auto-seed demo run if activeRun is null
  useEffect(() => {
    if (!activeRun) {
      setActiveRun(DEFAULT_DEMO_RUN);
      setSelectedStep(DEFAULT_DEMO_RUN.steps[2]);
      setReplayIndex(2);
    }
  }, [activeRun, setActiveRun, setSelectedStep]);

  // Poll active run status every 3 seconds if non-demo run is active
  useEffect(() => {
    if (!activeRun || activeRun.id === 'run_demo_morning_startup') return;

    const interval = setInterval(() => {
      if (activeRun.status === 'running' || activeRun.status === 'awaiting_human' || activeRun.status === 'recovering') {
        pollRunStatus(activeRun.id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeRun, pollRunStatus]);

  // Check pending approval
  useEffect(() => {
    if (activeRun?.status === 'awaiting_human' && activeRun.steps) {
      const awaitingStep = activeRun.steps.find((s) => s.status === 'awaiting_approval');
      if (awaitingStep) {
        setPendingApproval({
          id: awaitingStep.id,
          stepId: awaitingStep.id,
          runId: activeRun.id,
          runTitle: activeRun.title,
          stepTitle: awaitingStep.title,
          stepNumber: awaitingStep.stepNumber,
          prompt: `Confirmation required for step: ${awaitingStep.title}`,
          sideEffects: `Executing command: "${awaitingStep.command}" on host machine.`,
          dangerousCommand: awaitingStep.command || undefined,
          riskLevel: awaitingStep.riskLevel,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      setPendingApproval(null);
    }
  }, [activeRun]);

  const currentRun = activeRun || DEFAULT_DEMO_RUN;
  const stepsList = currentRun.steps || [];
  const currentStep = selectedStep || stepsList[replayIndex] || stepsList[0] || null;

  const handleApprovalResponse = async (
    approvalId: string,
    responseType: 'approve' | 'reject' | 'execute_with_input',
    customInput?: string
  ) => {
    if (currentRun.id !== 'run_demo_morning_startup') {
      await fetch(`/api/workflows/${currentRun.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, responseType, customInput }),
      });
      await pollRunStatus(currentRun.id);
    } else {
      setPendingApproval(null);
    }
  };

  const handleCancelRun = async () => {
    if (currentRun.id !== 'run_demo_morning_startup') {
      await fetch(`/api/workflows/${currentRun.id}/cancel`, { method: 'POST' });
      await pollRunStatus(currentRun.id);
    } else {
      setActiveRun({ ...currentRun, status: 'cancelled' });
    }
  };

  return (
    <PageContainer>
      {/* Top Replay Control Header */}
      <Card className="bg-zinc-900/90 border-zinc-800 shadow-2xl backdrop-blur-xl mb-6">
        <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {currentRun.status.toUpperCase()}
              </span>
              <h2 className="text-base font-extrabold text-white truncate max-w-lg">{currentRun.title}</h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono flex items-center space-x-2">
              <span>Machine: {currentRun.machineId || 'coasty-node-v5-cloud-09'}</span>
              <span>•</span>
              <span className="text-cyan-400">Coasty CUA Engine {currentRun.cuaVersion}</span>
            </p>
          </div>

          {/* Time-Travel Step Replay Controls */}
          <div className="flex items-center space-x-3 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 shadow-inner">
            <button
              onClick={() => {
                const newIdx = Math.max(0, replayIndex - 1);
                setReplayIndex(newIdx);
                if (stepsList[newIdx]) setSelectedStep(stepsList[newIdx]);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Previous Step"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-bold">
                Step {replayIndex + 1} / {stepsList.length}
              </span>
            </div>

            <button
              onClick={() => {
                const newIdx = Math.min(stepsList.length - 1, replayIndex + 1);
                setReplayIndex(newIdx);
                if (stepsList[newIdx]) setSelectedStep(stepsList[newIdx]);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Next Step"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentRun.id !== 'run_demo_morning_startup') pollRunStatus(currentRun.id);
              }}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Refresh Feed</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancelRun}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
            >
              <Square className="w-3.5 h-3.5 mr-1.5 fill-rose-400" />
              <span>Abort Run</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Split Screen Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Visual Screen Feed */}
        <div className="lg:col-span-2 space-y-4">
          <LiveScreenshotCanvas
            step={currentStep}
            runTitle={currentRun.title}
            isLive={currentRun.status === 'running'}
          />

          {/* Active Step Terminal Stream */}
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Action Terminal Stream ({currentStep?.title || 'Terminal'})</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-800">
                  Auto-Scroll Active
                </Badge>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-300 overflow-x-auto max-h-36 border border-zinc-800/80 leading-relaxed whitespace-pre-wrap">
                {currentStep?.outputLogs || '[Coasty Agent Log] Standing by for desktop action stream...'}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Interactive Step Timeline */}
        <div className="space-y-4">
          <StepTimeline
            steps={stepsList}
            selectedStep={currentStep}
            onSelectStep={(step) => {
              setSelectedStep(step);
              const idx = stepsList.findIndex((s) => s.id === step.id);
              if (idx !== -1) setReplayIndex(idx);
            }}
          />
        </div>
      </div>

      {/* Human Approval Safety Confirmation Modal */}
      <ApprovalModal
        approval={pendingApproval}
        onRespond={handleApprovalResponse}
        onClose={() => setPendingApproval(null)}
      />
    </PageContainer>
  );
};
