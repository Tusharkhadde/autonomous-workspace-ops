/**
 * Coasty AI Computer Use API Client
 * Official API: https://coasty.ai
 * API key is loaded exclusively from the COASTY_API_KEY environment variable (.env)
 */

import {
  CoastyTaskRequest,
  CoastyRunRequest,
  CoastyRunResponse,
  CoastyPredictRequest,
  CoastyPredictResponse,
} from '@/types/coasty';

const COASTY_BASE_URL = process.env.COASTY_BASE_URL || 'https://coasty.ai';

if (!process.env.COASTY_API_KEY) {
  console.warn('[CoastyClient] WARNING: COASTY_API_KEY environment variable is not set. Set it in your .env file or Vercel settings.');
}

export class CoastyClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COASTY_API_KEY || '';
  }

  private getEffectiveApiKey(): string {
    const key = this.apiKey || process.env.COASTY_API_KEY || '';
    if (!key) {
      throw new Error('COASTY_API_KEY is not configured. Add it to your Vercel Environment Variables or .env file.');
    }
    return key;
  }

  public getMaskedKey(): string {
    const key = this.apiKey || process.env.COASTY_API_KEY || '';
    if (!key) return 'No Key';
    return `${key.slice(0, 18)}...${key.slice(-4)}`;
  }

  private getHeaders(withIdempotency = false): Record<string, string> {
    const key = this.getEffectiveApiKey();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': key,
    };
    if (withIdempotency) {
      headers['Idempotency-Key'] = `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    return headers;
  }

  /**
   * Create an autonomous computer-use task (managed provisioning)
   * POST https://coasty.ai/v1/tasks
   */
  async submitTask(request: CoastyTaskRequest): Promise<CoastyRunResponse> {
    console.log(`[Coasty] POST /v1/tasks | key=${this.getMaskedKey()} | task="${request.task.slice(0, 60)}"`);
    const res = await fetch(`${COASTY_BASE_URL}/v1/tasks`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Coasty /v1/tasks ${res.status}: ${err}`);
    }
    const data = (await res.json()) as CoastyRunResponse;
    console.log(`[Coasty] Task created: id=${data.id} status=${data.status} machine=${data.machine_id ?? 'auto'}`);
    return data;
  }

  /**
   * Create a run on an explicit machine
   * POST https://coasty.ai/v1/runs
   */
  async createRun(request: CoastyRunRequest): Promise<CoastyRunResponse> {
    console.log(`[Coasty] POST /v1/runs | task="${request.task.slice(0, 60)}"`);
    const res = await fetch(`${COASTY_BASE_URL}/v1/runs`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Coasty /v1/runs ${res.status}: ${err}`);
    }
    const data = (await res.json()) as CoastyRunResponse;
    console.log(`[Coasty] Run created: id=${data.id}`);
    return data;
  }

  /**
   * Get run status
   * GET https://coasty.ai/v1/runs/{id}
   */
  async getRun(runId: string): Promise<CoastyRunResponse> {
    console.log(`[Coasty] GET /v1/runs/${runId}`);
    const res = await fetch(`${COASTY_BASE_URL}/v1/runs/${runId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Coasty GET run ${res.status}`);
    }
    return (await res.json()) as CoastyRunResponse;
  }

  /**
   * Get SSE event stream from a run
   * GET https://coasty.ai/v1/runs/{id}/events
   */
  getEventStreamUrl(runId: string): string {
    return `${COASTY_BASE_URL}/v1/runs/${runId}/events`;
  }

  getEventStreamHeaders(): Record<string, string> {
    return { 'X-API-Key': this.getEffectiveApiKey() };
  }

  /**
   * Resume a run awaiting human input
   * POST https://coasty.ai/v1/runs/{id}/resume
   */
  async resumeRun(runId: string, userInput?: string): Promise<{ success: boolean }> {
    console.log(`[Coasty] POST /v1/runs/${runId}/resume`);
    const res = await fetch(`${COASTY_BASE_URL}/v1/runs/${runId}/resume`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ user_input: userInput }),
    });
    return { success: res.ok };
  }

  /**
   * Cancel a run
   * POST https://coasty.ai/v1/runs/{id}/cancel
   */
  async cancelRun(runId: string): Promise<{ success: boolean }> {
    console.log(`[Coasty] POST /v1/runs/${runId}/cancel`);
    const res = await fetch(`${COASTY_BASE_URL}/v1/runs/${runId}/cancel`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return { success: res.ok };
  }

  /**
   * Predict next UI action from screenshot (free, no key required but we send anyway)
   * POST https://coasty.ai/v1/predict
   */
  async predictAction(request: CoastyPredictRequest): Promise<CoastyPredictResponse> {
    const res = await fetch(`${COASTY_BASE_URL}/v1/predict`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      throw new Error(`Coasty /v1/predict ${res.status}`);
    }
    return (await res.json()) as CoastyPredictResponse;
  }
}

export const coastyClient = new CoastyClient();
