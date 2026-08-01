/**
 * Human-in-the-loop Approval System Types
 */

import { RiskLevel } from './workflow';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'modified';
export type ApprovalResponseType = 'approve' | 'reject' | 'execute_with_input';

export interface PendingApprovalRequest {
  id: string;
  stepId: string;
  runId: string;
  runTitle: string;
  stepTitle: string;
  stepNumber: number;
  prompt: string;
  sideEffects: string;
  dangerousCommand?: string;
  riskLevel: RiskLevel;
  status: ApprovalStatus;
  createdAt: string;
}

export interface ApprovalActionPayload {
  approvalId: string;
  responseType: ApprovalResponseType;
  customInput?: string;
}
