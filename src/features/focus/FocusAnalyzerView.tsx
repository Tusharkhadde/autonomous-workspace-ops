'use client';

import React from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Target } from 'lucide-react';

export const FocusAnalyzerView: React.FC = () => {
  const { focus } = useOptimizerStore();
  const score = focus?.score || 84;

  return (
    <PageContainer>
      <PageHeader
        icon={Target}
        title="Focus & Deep Work Analyzer"
        description="Measures context switching frequency, deep work sessions, research vs coding split, and daily productivity score."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productivity Score Gauge */}
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
            Daily Productivity Score
          </span>
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-zinc-950 border-4 border-cyan-500/40 shadow-2xl">
            <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
            <span className="text-xs text-zinc-500 font-mono absolute bottom-6">/ 100</span>
          </div>
          <p className="text-xs text-emerald-400 font-mono font-bold">✓ High Deep Work Index</p>
        </Card>

        {/* Focus Breakdown Bar */}
        <Card className="md:col-span-2 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Today&apos;s Time Allocation</h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-cyan-400">Deep Work & Coding (240 mins)</span>
                <span className="text-zinc-400">55%</span>
              </div>
              <Progress value={55} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-purple-400">Web Research & Docs (85 mins)</span>
                <span className="text-zinc-400">20%</span>
              </div>
              <Progress value={20} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-400">Meetings & Slack (45 mins)</span>
                <span className="text-zinc-400">15%</span>
              </div>
              <Progress value={15} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-rose-400">Idle & Context Switching (30 mins)</span>
                <span className="text-zinc-400">10%</span>
              </div>
              <Progress value={10} />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
