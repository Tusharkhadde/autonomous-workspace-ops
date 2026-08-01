'use client';

import React from 'react';
import { WorkflowStep } from '@/types/workflow';
import { getStatusColor, getRiskBadgeColor } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ShieldAlert,
  Wrench,
  ChevronRight,
} from 'lucide-react';

interface StepTimelineProps {
  steps: WorkflowStep[];
  selectedStep: WorkflowStep | null;
  onSelectStep: (step: WorkflowStep) => void;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({
  steps,
  selectedStep,
  onSelectStep,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Live Execution Graph ({steps.length} Steps)
        </h3>
      </div>

      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
        {steps.map((step, idx) => {
          const isSelected = selectedStep?.id === step.id;
          const isRunning = step.status === 'running';
          const isAwaiting = step.status === 'awaiting_approval';
          const isSucceeded = step.status === 'succeeded';
          const isHealing = step.status === 'self_healing';

          return (
            <div
              key={step.id || idx}
              onClick={() => onSelectStep(step)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-zinc-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  {/* Status Icon */}
                  {isSucceeded && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isRunning && <Play className="w-4 h-4 text-cyan-400 animate-pulse shrink-0 fill-cyan-400" />}
                  {isAwaiting && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                  {isHealing && <Wrench className="w-4 h-4 text-purple-400 animate-spin shrink-0" />}
                  {!isSucceeded && !isRunning && !isAwaiting && !isHealing && (
                    <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}

                  <span className="font-semibold text-xs text-white truncate max-w-[180px]">
                    {idx + 1}. {step.title}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getStatusColor(
                      step.status
                    )}`}
                  >
                    {step.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </div>

              {step.command && (
                <p className="text-[11px] font-mono text-zinc-400 truncate bg-zinc-900/90 p-1.5 rounded border border-zinc-800/60">
                  $ {step.command}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
