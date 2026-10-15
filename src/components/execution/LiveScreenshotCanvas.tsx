'use client';

import React, { useState } from 'react';
import { generateSyntheticScreenshot } from '@/lib/utils';
import { WorkflowStep } from '@/types/workflow';
import { Monitor, Zap, ShieldAlert, Terminal, Code2, Globe } from 'lucide-react';

interface LiveScreenshotCanvasProps {
  step: WorkflowStep | null;
  runTitle?: string;
  isLive?: boolean;
}

export const LiveScreenshotCanvas: React.FC<LiveScreenshotCanvasProps> = ({
  step,
  runTitle = 'Agent Desktop',
  isLive = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const targetApp = step?.targetApp || 'Terminal';
  const actionText = step?.title || 'Executing autonomous computer task...';
  const stepNumber = step?.stepNumber || 1;

  const screenshotSrc =
    step?.screenshotUrl ||
    generateSyntheticScreenshot(targetApp, runTitle, actionText, stepNumber);

  // Screens produced by generateSyntheticScreenshot are SVG illustrations, not
  // real captures. Label them so a reviewer never approves a step based on a
  // fake screen.
  const isSimulated = screenshotSrc.startsWith('data:image/svg+xml');

  React.useEffect(() => {
    setImgError(false);
  }, [screenshotSrc]);

  return (
    <div className="rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Top Feed Control Header */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-300">
            {isSimulated ? 'Simulated preview' : 'Agent screen feed'} — {targetApp}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          {isSimulated ? (
            <div
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30"
              title="This screen is an illustration generated in the browser, not a capture from the agent's machine."
            >
              <span>Simulated, not a real capture</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>{isLive ? 'Live' : 'Recorded'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Screen Player Area */}
      <div className="relative flex-1 bg-black flex items-center justify-center p-4 min-h-[360px] overflow-hidden group">
        {!imgError ? (
          <img
            src={screenshotSrc}
            onError={() => setImgError(true)}
            alt={isSimulated ? 'Simulated desktop preview (illustration)' : 'Agent desktop screen'}
            className="w-full h-auto max-h-[460px] object-contain rounded-lg border border-zinc-800 shadow-2xl transition-transform duration-300"
          />
        ) : (
          /* Inline Native Canvas Fallback */
          <div className="w-full h-[360px] rounded-lg bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs">
                <Terminal className="w-4 h-4" />
                <span>operator@sample-vm:~$</span>
              </div>
              <span className="text-xs text-zinc-500">STEP #{stepNumber}</span>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <p className="text-zinc-300 font-bold">[SIMULATED PREVIEW — not a real capture]</p>
              <p className="text-cyan-400">$ {step?.command || 'Executing workspace action...'}</p>
              <p className="text-emerald-400">✓ Step Target: {targetApp}</p>
              <p className="text-zinc-400">{actionText}</p>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                {step?.outputLogs || '[INFO] Action output stream verified satisfied.'}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800 pt-2">
              <span>Status: {step?.status || 'Active'}</span>
              <span className="text-amber-300">Simulated</span>
            </div>
          </div>
        )}

        {/* Action Overlay Indicator */}
        {step?.status === 'running' && (
          <div className="absolute top-8 left-8 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-cyan-500/40 backdrop-blur-md text-xs font-mono text-cyan-400 shadow-xl flex items-center space-x-2 animate-pulse">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Executing UI Action: {step.actionType}</span>
          </div>
        )}

        {step?.status === 'awaiting_approval' && (
          <div className="absolute top-8 left-8 px-3.5 py-2 rounded-xl bg-amber-950/90 border border-amber-500/40 backdrop-blur-md text-xs font-mono text-amber-300 shadow-xl flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>PAUSED: Awaiting Human Safety Confirmation</span>
          </div>
        )}
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="px-4 py-2.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <span>Target App: {targetApp}</span>
          <span className="text-zinc-600">|</span>
          <span>Risk: {step?.riskLevel || 'low'}</span>
        </div>
        <div className="text-cyan-400 font-bold">
          Step #{stepNumber}
        </div>
      </div>
    </div>
  );
};
