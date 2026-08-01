'use client';

import React, { useState } from 'react';
import { PendingApprovalRequest } from '@/types/approval';
import { ShieldAlert, CheckCircle2, XCircle, Terminal, AlertTriangle } from 'lucide-react';

interface ApprovalModalProps {
  approval: PendingApprovalRequest | null;
  onRespond: (approvalId: string, responseType: 'approve' | 'reject' | 'execute_with_input', customInput?: string) => Promise<void>;
  onClose: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  approval,
  onRespond,
  onClose,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!approval) return null;

  const handleAction = async (type: 'approve' | 'reject' | 'execute_with_input') => {
    setIsSubmitting(true);
    try {
      await onRespond(approval.id, type, customInput || undefined);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Alert Banner */}
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-200">
              HUMAN CONFIRMATION REQUIRED: HIGH-RISK ACTION
            </h3>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Ghost Operator paused execution before running a potentially dangerous computer action.
            </p>
          </div>
        </div>

        {/* Workflow & Step Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Workflow: {approval.runTitle}</span>
            <span className="text-amber-400 font-bold">Step #{approval.stepNumber}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h4 className="font-bold text-sm text-white">{approval.stepTitle}</h4>
            <p className="text-xs text-zinc-400">{approval.sideEffects}</p>

            {approval.dangerousCommand && (
              <div className="pt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  Proposed System Command:
                </span>
                <div className="p-2.5 rounded-lg bg-zinc-900 font-mono text-xs text-emerald-400 border border-zinc-800 flex items-center space-x-2 overflow-x-auto">
                  <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>$ {approval.dangerousCommand}</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Custom Parameter Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Provide Custom Override Parameters (Optional):
            </label>
            <input
              type="text"
              placeholder='e.g., --force or custom flag...'
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-zinc-800">
          <button
            disabled={isSubmitting}
            onClick={() => handleAction('reject')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject & Abort</span>
          </button>

          <button
            disabled={isSubmitting}
            onClick={() => handleAction(customInput ? 'execute_with_input' : 'approve')}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
