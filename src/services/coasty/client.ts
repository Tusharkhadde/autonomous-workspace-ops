import type { CoastyAction, CoastyPredictResponse } from "@/types/operator";

const COASTY_BASE_URL = process.env.COASTY_BASE_URL ?? "https://coasty.ai/v1";

export interface CoastySessionOptions {
  instructionPreset?: "cautious";
  screenWidth: number;
  screenHeight: number;
}

export class CoastyClient {
  private readonly apiKey = process.env.COASTY_API_KEY;

  async createSession(options: CoastySessionOptions) {
    if (!this.apiKey) {
      throw new Error("COASTY_API_KEY is not configured.");
    }

    const response = await fetch(`${COASTY_BASE_URL}/sessions`, {
      method: "POST",
      headers: this.headers({ "Idempotency-Key": crypto.randomUUID() }),
      body: JSON.stringify({
        cua_version: "v5",
        screen_width: options.screenWidth,
        screen_height: options.screenHeight,
        instructions: options.instructionPreset === "cautious" ? "Cautious" : undefined,
        action_policy: {
          blocked_keys: ["escape"],
          block_window_close: true
        }
      })
    });

    return this.parse(response);
  }

  async predict(sessionId: string, screenshot: string, instruction: string): Promise<CoastyPredictResponse> {
    if (!this.apiKey) {
      throw new Error("COASTY_API_KEY is not configured.");
    }

    const idempotencyKey = crypto.randomUUID();
    const response = await fetch(`${COASTY_BASE_URL}/sessions/${sessionId}/predict`, {
      method: "POST",
      headers: this.headers({ "Idempotency-Key": idempotencyKey }),
      body: JSON.stringify({ screenshot, instruction })
    });

    return this.parse(response);
  }

  rejectUnsafeActions(actions: CoastyAction[]) {
    return actions.filter((action) => {
      if (action.action_type === "key_press" && action.params.key === "escape") return true;
      if (action.action_type === "key_combo" && Array.isArray(action.params.keys) && action.params.keys.includes("alt") && action.params.keys.includes("f4")) return true;
      return false;
    });
  }

  private headers(extra?: Record<string, string>) {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey ?? "",
      ...extra
    };
  }

  private async parse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Coasty request failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
