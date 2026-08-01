'use client';

import React from 'react';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Files, Trash2, HardDrive, Sparkles } from 'lucide-react';

export const DuplicateFinderView: React.FC = () => {
  const { duplicates, deleteDuplicate } = useOptimizerStore();

  const totalMb = duplicates.reduce((acc, d) => acc + d.fileSizeMb, 0);
  const totalGb = (totalMb / 1024).toFixed(2);

  return (
    <PageContainer>
      <PageHeader
        icon={Files}
        title="Duplicate & Clutter Storage Finder"
        description="Detects duplicate downloads, screenshots, archives, and large unreferenced files for 1-click cleanup."
        right={
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Recoverable Space: {totalGb} GB</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duplicates.map((dup) => (
          <Card key={dup.id} className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-1.5 truncate">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-white truncate">{dup.fileName}</span>
                <Badge variant="outline">{dup.category}</Badge>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate bg-zinc-950 p-1.5 rounded border border-zinc-800">
                {dup.filePath}
              </p>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500">
                <span>Size: {dup.fileSizeMb} MB</span>
                <span>Copies: {dup.duplicateCount}x</span>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteDuplicate(dup.id)}
              className="shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span>Clean</span>
            </Button>
          </Card>
        ))}

        {duplicates.length === 0 && (
          <div className="col-span-2 p-12 text-center text-zinc-500 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm text-zinc-300 font-bold">Storage Clean & Optimized!</p>
            <p className="text-xs">No duplicate downloads or clutter detected.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
