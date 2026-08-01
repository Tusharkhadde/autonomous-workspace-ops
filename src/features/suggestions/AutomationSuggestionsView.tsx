'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Zap, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const AutomationSuggestionsView: React.FC = () => {
  const router = useRouter();
  const { suggestions, executeSuggestion } = useOptimizerStore();

  const totalTimeSaved = suggestions
    .filter((s) => s.isExecuted)
    .reduce((acc, s) => acc + s.timeSavedMins, 0);

  return (
    <PageContainer>
      <PageHeader
        icon={Zap}
        title="One-Click Automation Suggestions"
        description="AI-generated shortcuts to streamline repetitive desktop tasks, organize files, and launch environments."
        right={
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <Clock className="w-4 h-4" />
            <span>Saved: {totalTimeSaved || 45} mins/day</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((sug) => (
          <Card key={sug.id} className="flex flex-col justify-between p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-sm text-white">{sug.title}</h3>
                <Badge variant={sug.isExecuted ? 'success' : 'default'}>
                  {sug.isExecuted ? 'Executed' : sug.estimatedComplexity}
                </Badge>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{sug.description}</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400">
                ⚡ Saves ~{sug.timeSavedMins} mins/day
              </span>

              {sug.isExecuted ? (
                <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    executeSuggestion(sug.id);
                    if (sug.actionType === 'launch_workspace') {
                      router.push('/missions');
                    }
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Execute Automation</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
