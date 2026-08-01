'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { GitBranch, Play, ArrowRight } from 'lucide-react';

export const WorkflowAnalyzerView: React.FC = () => {
  const router = useRouter();
  const { workflows } = useOptimizerStore();

  return (
    <PageContainer>
      <PageHeader
        icon={GitBranch}
        title="Workflow Sequence Analyzer"
        description="Detects repetitive multi-application sequence chains and offers 1-click mission automation."
      />

      <div className="space-y-4">
        {workflows.map((wf) => (
          <Card key={wf.id} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">{wf.name}</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  Observed {wf.occurrenceCount} times this week (~{wf.timeSpentMins} mins/run)
                </span>
              </div>
              <Badge variant="warning">Repetitive Pattern Detected</Badge>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                Observed Sequence Chain:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {wf.sequenceSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1 rounded-lg bg-zinc-950 text-xs font-mono text-cyan-300 border border-zinc-800">
                      {step}
                    </span>
                    {idx < wf.sequenceSteps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">
                Suggested Automation: &ldquo;{wf.suggestedAutomationName}&rdquo;
              </span>
              <Button size="sm" onClick={() => router.push('/missions')}>
                <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                <span>Turn into 1-Click Mission</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
