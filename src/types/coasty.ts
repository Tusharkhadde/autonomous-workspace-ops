/**
 * Coasty Computer Use API Types
 * Based on official Coasty API specification (https://coasty.ai/docs)
 */

export interface CoastyTaskRequest {
  task: string;
  max_steps?: number;
  deadline_seconds?: number;
  webhook_url?: string;
  cua_version?: 'v3' | 'v4' | 'v5';
  instructions?: string;
  on_awaiting_human?: 'pause' | 'fail' | 'cancel';
}

export interface CoastyRunRequest {
  machine_id: string;
  task: string;
  cua_version?: 'v3' | 'v4' | 'v5';
  instructions?: string;
  max_steps?: number;
  on_awaiting_human?: 'pause' | 'fail' | 'cancel';
}

export interface CoastyRunResponse {
  id: string;
  object?: string;
  status: 'queued' | 'running' | 'awaiting_human' | 'succeeded' | 'failed' | 'cancelled' | 'timed_out';
  task: string;
  cua_version: string;
  machine_id?: string;
  machine?: { mode: string; status: string; id: string; cleanup: string; cleanup_status: string };
  webhook_secret?: string;
  steps_completed?: number;
  current_action?: string;
  screenshot_base64?: string;
  error_message?: string;
  error?: { code: string; message: string };
  credits_charged?: number;
  cost_cents?: number;
  result?: {
    passed?: boolean;
    status?: string;
    summary?: string;
    usage?: Record<string, unknown>;
  };
  created_at: string;
  started_at?: string;
  finished_at?: string;
  updated_at: string;
  request_id?: string;
}

export interface CoastyPredictRequest {
  screenshot: string; // Base64 encoded PNG/JPEG
  instruction: string;
  context?: string;
}

export interface CoastyPredictResponse {
  action_type: 'click' | 'type' | 'scroll' | 'key_combination' | 'wait' | 'done' | 'fail';
  target_coords?: { x: number; y: number };
  target_element_description?: string;
  text_input?: string;
  explanation: string;
  confidence: number;
}

export interface CoastyEvent {
  event_id: string;
  run_id: string;
  type: 'step_start' | 'step_complete' | 'action_executed' | 'screenshot_captured' | 'human_approval_required' | 'error' | 'status_change';
  timestamp: string;
  payload: {
    step_number?: number;
    action_type?: string;
    description?: string;
    screenshot_base64?: string;
    bounding_box?: [number, number, number, number]; // [x, y, w, h]
    command?: string;
    log?: string;
    status?: string;
    error?: string;
    risk_level?: 'low' | 'medium' | 'high' | 'critical';
  };
}
