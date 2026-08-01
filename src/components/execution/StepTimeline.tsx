'use client';

import React from 'react';
import { WorkflowStep } from '@/types/workflow';
import { getStatusColor } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Play,
  ShieldAlert,
  Wrench,
  ChevronRight,
  Layers,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
      <CardHeader className="p-4 border-b border-zinc-800/80 flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Execution Graph ({steps.length} Steps)</span>
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
          Replay Mode
        </Badge>
      </CardHeader>

      <CardContent className="p-3 space-y-2 max-h-[480px] overflow-y-auto">
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
                  ? 'bg-zinc-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  {/* Status Icon */}
                  {isSucceeded && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isRunning && <Play className="w-4 h-4 text-cyan-400 animate-pulse shrink-0 fill-cyan-400" />}
                  {isAwaiting && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                  {isHealing && <Wrench className="w-4 h-4 text-purple-400 animate-spin shrink-0" />}
                  {!isSucceeded && !isRunning && !isAwaiting && !isHealing && (
                    <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}

                  <span className="font-semibold text-xs text-white truncate">
                    #{idx + 1}. {step.title}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
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

              {step.targetApp && (
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>App: {step.targetApp}</span>
                  </span>
                  <span className="text-zinc-500">Risk: {step.riskLevel || 'low'}</span>
                </div>
              )}

              {step.command && (
                <p className="text-[11px] font-mono text-zinc-400 truncate bg-zinc-900/90 p-2 rounded-lg border border-zinc-800/80">
                  $ {step.command}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
