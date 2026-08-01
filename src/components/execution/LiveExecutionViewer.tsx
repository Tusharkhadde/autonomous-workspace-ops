'use client';

import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { LiveScreenshotCanvas } from './LiveScreenshotCanvas';
import { StepTimeline } from './StepTimeline';
import { ApprovalModal } from '../approval/ApprovalModal';
import { PageContainer } from '../layout/PageContainer';
import { PendingApprovalRequest } from '@/types/approval';
import { soundFx } from '@/lib/audio';
import {
  Pause,
  Play,
  Square,
  RefreshCw,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  Wrench,
  Rewind,
  FastForward,
} from 'lucide-react';

export const LiveExecutionViewer: React.FC = () => {
  const { activeRun, selectedStep, setSelectedStep, pollRunStatus } = useWorkflowStore();
  const [pendingApproval, setPendingApproval] = useState<PendingApprovalRequest | null>(null);
  const [replayIndex, setReplayIndex] = useState<number>(0);

  // Poll active run status every 1.5 seconds while running
  useEffect(() => {
    if (!activeRun) return;

    const interval = setInterval(() => {
      if (activeRun.status === 'running' || activeRun.status === 'awaiting_human' || activeRun.status === 'recovering') {
        pollRunStatus(activeRun.id);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeRun, pollRunStatus]);

  // Audio Cue Trigger on status change
  useEffect(() => {
    if (!activeRun) return;
    if (activeRun.status === 'awaiting_human') {
      soundFx.playApprovalAlert();
    } else if (activeRun.status === 'recovering') {
      soundFx.playSelfHealingPulse();
    } else if (activeRun.status === 'succeeded') {
      soundFx.playStepSuccess();
    }
  }, [activeRun?.status]);

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

  if (!activeRun) {
    return (
      <div className="p-12 text-center text-zinc-500 space-y-4">
        <Play className="w-12 h-12 text-zinc-600 mx-auto" />
        <p className="text-sm">No active execution. Launch a workflow from the Dashboard or Saved Workflows.</p>
      </div>
    );
  }

  const handleApprovalResponse = async (
    approvalId: string,
    responseType: 'approve' | 'reject' | 'execute_with_input',
    customInput?: string
  ) => {
    await fetch(`/api/workflows/${activeRun.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId, responseType, customInput }),
    });
    await pollRunStatus(activeRun.id);
  };

  const handleCancelRun = async () => {
    await fetch(`/api/workflows/${activeRun.id}/cancel`, { method: 'POST' });
    await pollRunStatus(activeRun.id);
  };

  const currentStep = selectedStep || activeRun.steps?.[replayIndex] || activeRun.steps?.[0] || null;

  return (
    <PageContainer>
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {activeRun.status.toUpperCase()}
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-md">{activeRun.title}</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">Machine: {activeRun.machineId || 'cloud_v5_vm'}</p>
        </div>

        {/* Time-Travel Step Replay Controls */}
        <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              const newIdx = Math.max(0, replayIndex - 1);
              setReplayIndex(newIdx);
              if (activeRun.steps?.[newIdx]) setSelectedStep(activeRun.steps[newIdx]);
            }}
            className="p-1 text-zinc-400 hover:text-white"
            title="Step Back"
          >
            <Rewind className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-cyan-400 font-bold px-2">
            Replay Step {replayIndex + 1} / {activeRun.steps?.length || 1}
          </span>
          <button
            onClick={() => {
              const newIdx = Math.min((activeRun.steps?.length || 1) - 1, replayIndex + 1);
              setReplayIndex(newIdx);
              if (activeRun.steps?.[newIdx]) setSelectedStep(activeRun.steps[newIdx]);
            }}
            className="p-1 text-zinc-400 hover:text-white"
            title="Step Forward"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => pollRunStatus(activeRun.id)}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCancelRun}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-rose-400" />
            <span>Abort Run</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Desktop Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <LiveScreenshotCanvas
            step={currentStep}
            runTitle={activeRun.title}
            isLive={activeRun.status === 'running'}
          />

          {/* Active Step Terminal Logs Stream */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Action Logs ({currentStep?.title || 'Terminal'})</span>
              </div>
              <span className="text-zinc-500">Auto-scroll Active</span>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-900 font-mono text-xs text-zinc-300 overflow-x-auto max-h-36 border border-zinc-800 leading-relaxed whitespace-pre-wrap">
              {currentStep?.outputLogs || '[Coasty Agent Log] Standing by for desktop events...'}
            </pre>
          </div>
        </div>

        {/* Right Col: Step Timeline & Details */}
        <div className="space-y-4">
          <StepTimeline
            steps={activeRun.steps || []}
            selectedStep={currentStep}
            onSelectStep={setSelectedStep}
          />
        </div>
      </div>

      {/* Human Approval Modal */}
      <ApprovalModal
        approval={pendingApproval}
        onRespond={handleApprovalResponse}
        onClose={() => setPendingApproval(null)}
      />
    </PageContainer>
  );
};
