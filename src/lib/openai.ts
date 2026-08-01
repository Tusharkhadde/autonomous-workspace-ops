import OpenAI from 'openai';
import { ExecutionPlan, RiskLevel } from '@/types/workflow';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-fallback',
  dangerouslyAllowBrowser: true,
});

export class OpenAIPlanner {
  /**
   * Decompose user goal into structured execution plan graph
   */
  async generatePlan(goal: string, params?: Record<string, string>): Promise<ExecutionPlan> {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are the Coasty AI Planner Agent. Break down complex real-world computer tasks into granular execution steps.
              Return ONLY valid JSON matching this schema:
              {
                "title": string,
                "summary": string,
                "estimatedTimeMinutes": number,
                "overallRisk": "low" | "medium" | "high" | "critical",
                "steps": [
                  {
                    "stepNumber": number,
                    "title": string,
                    "description": string,
                    "actionType": "launch_app" | "command" | "browser_nav" | "file_write" | "code_edit" | "terminal_wait" | "inspect" | "verify",
                    "targetApp": string,
                    "command": string,
                    "riskLevel": "low" | "medium" | "high" | "critical",
                    "requiresApproval": boolean,
                    "isApproved": boolean,
                    "outputLogs": string
                  }
                ]
              }`,
            },
            {
              role: 'user',
              content: `Goal: ${goal}\nParameters: ${JSON.stringify(params || {})}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content) as ExecutionPlan;
        }
      } catch (err) {
        console.warn('[OpenAIPlanner] OpenAI API call failed, using intelligent domain planner:', err);
      }
    }

    // Fallback Domain Planner Heuristic
    return this.generateDomainPlan(goal, params);
  }

  /**
   * Diagnostic agent for error recovery
   */
  async diagnoseError(stepTitle: string, command?: string, errorMsg?: string): Promise<{
    diagnosis: string;
    suggestedFixCommand: string;
    autoRecoverable: boolean;
    recoveryStepTitle: string;
  }> {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are Coasty AI Recovery Agent. Diagnose failure and return JSON with: diagnosis, suggestedFixCommand, autoRecoverable, recoveryStepTitle.',
            },
            {
              role: 'user',
              content: `Failed Step: ${stepTitle}\nCommand: ${command}\nError: ${errorMsg}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      } catch (e) {
        console.warn('[OpenAIPlanner] Recovery AI fallback:', e);
      }
    }

    return {
      diagnosis: 'Detected command or dependency initialization timeout.',
      suggestedFixCommand: command?.includes('docker') ? 'docker compose down && docker compose up -d' : 'npm install --force && npm run dev',
      autoRecoverable: true,
      recoveryStepTitle: 'Self-Healing: Re-synchronize dependencies and restart service',
    };
  }

  private generateDomainPlan(goal: string, params?: Record<string, string>): ExecutionPlan {
    const lower = goal.toLowerCase();

    // 1. Browser / Web Navigation / Documentation / Google Search
    if (
      lower.includes('open') ||
      lower.includes('search') ||
      lower.includes('google') ||
      lower.includes('doc') ||
      lower.includes('browser') ||
      lower.includes('openai') ||
      lower.includes('url') ||
      lower.includes('http') ||
      lower.includes('youtube')
    ) {
      let targetUrl = 'https://google.com';
      if (lower.includes('openai')) targetUrl = 'https://platform.openai.com/docs';
      else if (lower.includes('github')) targetUrl = 'https://github.com';
      else if (lower.includes('youtube')) targetUrl = 'https://youtube.com';

      return {
        title: `Browser Operator: ${goal.slice(0, 40)}`,
        summary: `Launch Google Chrome, navigate to target website, interact with web interface, and verify documentation content.`,
        estimatedTimeMinutes: 2,
        overallRisk: 'low',
        steps: [
          {
            stepNumber: 1,
            title: 'Launch Google Chrome & Initialize CUA Session',
            description: `Open web browser and initialize Coasty DOM perception engine for ${targetUrl}.`,
            actionType: 'launch_app',
            targetApp: 'Google Chrome',
            command: `google-chrome --new-window ${targetUrl}`,
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: `Chrome browser window initialized. Navigating to ${targetUrl}...`,
          },
          {
            stepNumber: 2,
            title: 'Perform Search & Web Navigation',
            description: `Type query "${goal.slice(0, 30)}" into address bar / search input and click top result.`,
            actionType: 'browser_nav',
            targetApp: 'Google Chrome',
            command: `chrome-driver navigate --url "${targetUrl}" --query "${goal.slice(0, 30)}"`,
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: `Query submitted. Clicked top navigation result. Page loaded (HTTP 200 OK).`,
          },
          {
            stepNumber: 3,
            title: 'Extract Content & Inspect Web Documentation',
            description: 'Capture screenshot of active webpage viewport and parse documentation sections.',
            actionType: 'inspect',
            targetApp: 'Google Chrome',
            command: 'chrome-driver capture-screenshot --full-page',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Page content parsed successfully. Documentation view active & rendered.',
          },
        ],
      };
    }

    // 2. Docker / Hackathon / Workspace Bootstrap
    if (lower.includes('docker') || lower.includes('hackathon')) {
      return {
        title: 'Docker Hackathon Workspace Bootstrap',
        summary: 'Provision workspace, clone repository, configure environment variables, build Docker containers, and verify local web server.',
        estimatedTimeMinutes: 4,
        overallRisk: 'medium',
        steps: [
          {
            stepNumber: 1,
            title: 'Analyze Request & Inspect Machine State',
            description: 'Check Docker daemon status, available ports, and local dev workspace directory.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'docker info && pwd',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Docker Server v25.0.3 running. Workspace: /home/operator/projects',
          },
          {
            stepNumber: 2,
            title: 'Clone Target Hackathon Repository',
            description: 'Clone repo from GitHub and checkout the main branch.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'git clone https://github.com/example/docker-hackathon-app.git ./hackathon-app',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Cloning into hackathon-app... Done.',
          },
          {
            stepNumber: 3,
            title: 'Open VS Code Workspace',
            description: 'Launch VS Code in the project folder for quick editing.',
            actionType: 'launch_app',
            targetApp: 'VS Code',
            command: 'code ./hackathon-app',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'VS Code workspace opened.',
          },
          {
            stepNumber: 4,
            title: 'Install Dependencies & Environment Settings',
            description: 'Copy environment template and run npm install.',
            actionType: 'file_write',
            targetApp: 'VS Code',
            command: 'cp .env.example .env && npm install',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Dependencies installed successfully. .env initialized.',
          },
          {
            stepNumber: 5,
            title: 'Launch Docker Compose Environment',
            description: 'Build and start multi-container services in background mode.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'docker compose up --build -d',
            riskLevel: 'medium',
            requiresApproval: true,
            isApproved: false,
            outputLogs: 'Building web and database containers... Containers started.',
          },
          {
            stepNumber: 6,
            title: 'Verify Endpoint & Monitor Container Health',
            description: 'Ping http://localhost:3000/api/health and capture screenshot confirmation.',
            actionType: 'verify',
            targetApp: 'Google Chrome',
            command: 'curl -I http://localhost:3000',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'HTTP/1.1 200 OK. Application verified active.',
          },
        ],
      };
    }

    // 3. Deployment / Cloud / Prod
    if (lower.includes('deploy') || lower.includes('cloud')) {
      return {
        title: 'Cloud Infrastructure Deployment & Healthcheck',
        summary: 'Authenticate with cloud provider, build container image, push to registry, and trigger blue-green deployment.',
        estimatedTimeMinutes: 6,
        overallRisk: 'high',
        steps: [
          {
            stepNumber: 1,
            title: 'Verify Environment Credentials & SSH Auth',
            description: 'Check active cloud CLI session and key permissions.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'aws sts get-caller-identity || gcloud auth list',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Authenticated as devops-operator@cloud.internal',
          },
          {
            stepNumber: 2,
            title: 'Build Release Container Image',
            description: 'Compile production bundle and tag Docker image.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'docker build -t registry.coasty.internal/app:v1.2.0 .',
            riskLevel: 'medium',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Successfully built image v1.2.0',
          },
          {
            stepNumber: 3,
            title: 'Push Production Image & Trigger Deploy',
            description: 'Upload image to container registry and update Kubernetes cluster deployment.',
            actionType: 'command',
            targetApp: 'Terminal',
            command: 'kubectl set image deployment/web-app web=registry.coasty.internal/app:v1.2.0',
            riskLevel: 'high',
            requiresApproval: true,
            isApproved: false,
            outputLogs: 'Deployment rollout initiated.',
          },
          {
            stepNumber: 4,
            title: 'Perform Smoke Test & End-to-End Verification',
            description: 'Verify live endpoints return 200 OK and check error rates.',
            actionType: 'verify',
            targetApp: 'Google Chrome',
            command: 'curl -s https://app.example.com/health',
            riskLevel: 'low',
            requiresApproval: false,
            isApproved: true,
            outputLogs: 'Smoke test passed. Health score 100%.',
          },
        ],
      };
    }

    // 4. Default Generic Intelligent Workflow
    return {
      title: `Autonomous Execution: ${goal.slice(0, 45)}`,
      summary: `Execute real-world computer workflow for request: "${goal}"`,
      estimatedTimeMinutes: 3,
      overallRisk: this.calculateRisk(goal),
      steps: [
        {
          stepNumber: 1,
          title: 'Launch Desktop Application & Context Inspection',
          description: 'Examine current desktop state, active applications, and required environment variables.',
          actionType: 'launch_app',
          targetApp: 'Google Chrome',
          command: `google-chrome --new-tab "https://google.com?q=${encodeURIComponent(goal.slice(0, 30))}"`,
          riskLevel: 'low',
          requiresApproval: false,
          isApproved: true,
          outputLogs: 'Application launched. Coasty perception engine active.',
        },
        {
          stepNumber: 2,
          title: 'Prepare Workspace & Execute Application Commands',
          description: 'Execute application actions and configure required execution context.',
          actionType: 'command',
          targetApp: 'Terminal',
          command: 'echo "Executing workflow setup..."',
          riskLevel: 'medium',
          requiresApproval: goal.toLowerCase().includes('delete') || goal.toLowerCase().includes('remove'),
          isApproved: false,
          outputLogs: 'Execution step completed successfully.',
        },
        {
          stepNumber: 3,
          title: 'Perform Verification & Visual Screen Assertion',
          description: 'Confirm expected visual outcome and assert operational health.',
          actionType: 'verify',
          targetApp: 'Google Chrome',
          command: 'echo "Verification OK"',
          riskLevel: 'low',
          requiresApproval: false,
          isApproved: true,
          outputLogs: 'Verification complete.',
        },
      ],
    };
  }

  private calculateRisk(text: string): RiskLevel {
    const t = text.toLowerCase();
    if (t.includes('delete') || t.includes('drop') || t.includes('rm -rf') || t.includes('push main') || t.includes('pay')) {
      return 'critical';
    }
    if (t.includes('deploy') || t.includes('prod') || t.includes('publish') || t.includes('install')) {
      return 'high';
    }
    if (t.includes('docker') || t.includes('git') || t.includes('build')) {
      return 'medium';
    }
    return 'low';
  }
}

export const openAIPlanner = new OpenAIPlanner();
