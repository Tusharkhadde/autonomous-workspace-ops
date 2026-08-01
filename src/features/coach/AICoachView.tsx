'use client';

import React from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const AICoachView: React.FC = () => {
  const { coachingAdvice } = useOptimizerStore();

  return (
    <PageContainer>
      <PageHeader
        icon={Compass}
        title="AI Productivity Coach"
        description="Personalized telemetry advice to optimize peak working hours, batch research, and reduce friction."
      />

      <div className="space-y-4">
        {coachingAdvice.map((item) => (
          <Card key={item.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
              </div>
              <Badge variant="secondary">{item.category}</Badge>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              {item.advice}
            </p>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Actionable Step: {item.actionableStep}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
