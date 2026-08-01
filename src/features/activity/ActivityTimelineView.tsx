'use client';

import React from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Monitor, Cpu } from 'lucide-react';

export const ActivityTimelineView: React.FC = () => {
  const { activities } = useOptimizerStore();

  return (
    <PageContainer>
      <PageHeader
        icon={Monitor}
        title="Activity Timeline & Desktop Monitor"
        description="Continuously observes active application usage, window switching, idle times, and focus duration."
        right={<Badge variant="success">Local Privacy Guard Active</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-medium">Total Apps Tracked</span>
          <div className="text-2xl font-extrabold text-white">{activities.length} Apps</div>
          <span className="text-[10px] text-emerald-400 font-mono">VS Code, Chrome, Terminal, Docker, Slack</span>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-medium">Alt+Tab Switches</span>
          <div className="text-2xl font-extrabold text-cyan-400">288 Switches</div>
          <span className="text-[10px] text-amber-400 font-mono">High context switching window</span>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-medium">Total Active Work</span>
          <div className="text-2xl font-extrabold text-purple-400">5 hrs 15 mins</div>
          <span className="text-[10px] text-purple-300 font-mono">Idle time: 25 mins</span>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Application Usage Log</CardTitle>
          <CardDescription>Observed desktop window focus timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{act.appName}</span>
                      <Badge variant="outline">{act.category}</Badge>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 truncate max-w-md">{act.windowTitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400 shrink-0">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">TIME SPENT</span>
                    <span className="text-white font-bold">{Math.round(act.durationSec / 60)} mins</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SWITCHES</span>
                    <span className="text-cyan-400 font-bold">{act.switches}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
