'use client';

import React from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { BrainCircuit, ArrowRight, Lightbulb } from 'lucide-react';

export const AIInsightsView: React.FC = () => {
  const { insights, setActiveTab } = useOptimizerStore();

  return (
    <PageContainer>
      <PageHeader
        icon={BrainCircuit}
        title="AI Productivity Insights"
        description="Grammarly-style automated detection of wasted time, context switching, and repetitive friction."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                </div>
                <Badge variant={item.impactLevel === 'high' ? 'destructive' : 'warning'}>
                  {item.impactLevel} Impact
                </Badge>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                &ldquo;{item.description}&rdquo;
              </p>

              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                  AI Recommendation:
                </span>
                <p className="text-xs text-zinc-300">{item.actionRecommendation}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-500">
                Est. Wasted: {item.timeWastedMins} mins/day
              </span>
              <Button size="sm" onClick={() => setActiveTab('suggestions')}>
                <span>Fix Automation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
