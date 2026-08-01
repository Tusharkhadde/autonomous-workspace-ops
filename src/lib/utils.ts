import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from '@/types/workflow';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${minutes}m ${remainingSecs}s`;
}

export function getRiskBadgeColor(risk: RiskLevel): string {
  switch (risk) {
    case 'critical':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'high':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
    case 'low':
    default:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'succeeded':
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    case 'running':
      return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 animate-pulse';
    case 'awaiting_human':
    case 'awaiting_approval':
      return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    case 'failed':
      return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    case 'recovering':
    case 'self_healing':
      return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    default:
      return 'text-zinc-400 border-zinc-700 bg-zinc-800/50';
  }
}

/**
 * Generates a Base64 SVG Data URI representing realistic desktop application screenshots
 * with active window titlebars, terminal buffers, VS Code, and mouse targets.
 */
export function generateSyntheticScreenshot(
  app: string = 'Google Chrome',
  title: string = 'Coasty AI Autonomous Workspace',
  actionText: string = 'Executing task...',
  stepNumber: number = 1
): string {
  const lowerApp = (app || '').toLowerCase();
  const lowerTitle = (title || '').toLowerCase();

  const isTerminal = lowerApp.includes('terminal') || lowerApp.includes('command') || lowerApp.includes('bash');
  const isVSCode = lowerApp.includes('code') || lowerApp.includes('editor');

  let bgColor = '#0f172a'; // slate 900
  let headerColor = '#1e293b';
  let accentColor = '#38bdf8';
  let bodyContent = '';

  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeAction = actionText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  if (isTerminal) {
    bgColor = '#030712';
    headerColor = '#111827';
    accentColor = '#10b981';
    bodyContent = `
      <text x="20" y="70" fill="#10b981" font-family="monospace" font-size="14">operator@coasty-vm-node-5:~$</text>
      <text x="250" y="70" fill="#f3f4f6" font-family="monospace" font-size="14">${safeTitle.slice(0, 35)}</text>
      <text x="20" y="100" fill="#9ca3af" font-family="monospace" font-size="13">[INFO] Initializing Coasty CUA Agent v5 driver...</text>
      <text x="20" y="125" fill="#60a5fa" font-family="monospace" font-size="13">[STEP ${stepNumber}] ${safeAction.slice(0, 50)}</text>
      <text x="20" y="155" fill="#34d399" font-family="monospace" font-size="13">&#10003; Command completed with status code 0</text>
      <text x="20" y="185" fill="#d1d5db" font-family="monospace" font-size="13">Listening on port 3000 (HTTP/1.1 200 OK)</text>
      <text x="20" y="215" fill="#10b981" font-family="monospace" font-size="14">operator@coasty-vm-node-5:~$ <tspan fill="#60a5fa">&#9608;</tspan></text>
    `;
  } else if (isVSCode) {
    bgColor = '#1e1e1e';
    headerColor = '#252526';
    accentColor = '#007acc';
    bodyContent = `
      <rect x="0" y="40" width="180" height="360" fill="#252526" />
      <text x="15" y="70" fill="#cccccc" font-family="sans-serif" font-size="12" font-weight="bold">EXPLORER</text>
      <text x="25" y="95" fill="#9cdcfe" font-family="monospace" font-size="12">hackathon-app</text>
      <text x="40" y="120" fill="#ce9178" font-family="monospace" font-size="12">package.json</text>
      <text x="40" y="145" fill="#4ec9b0" font-family="monospace" font-size="12">docker-compose.yml</text>
      <text x="40" y="170" fill="#569cd6" font-family="monospace" font-size="12">src/index.ts</text>
      
      <rect x="180" y="40" width="620" height="360" fill="#1e1e1e" />
      <text x="200" y="75" fill="#569cd6" font-family="monospace" font-size="13">import</text>
      <text x="255" y="75" fill="#9cdcfe" font-family="monospace" font-size="13"> { CoastyOperator } </text>
      <text x="390" y="75" fill="#569cd6" font-family="monospace" font-size="13">from</text>
      <text x="430" y="75" fill="#ce9178" font-family="monospace" font-size="13">&apos;@coasty/sdk&apos;</text>
      <text x="200" y="105" fill="#6a9955" font-family="monospace" font-size="13">// ${safeAction.slice(0, 45)}</text>
      <text x="200" y="135" fill="#dcdcaa" font-family="monospace" font-size="13">runAutonomousWorkflow</text>
      <text x="365" y="135" fill="#ffd700" font-family="monospace" font-size="13">({ goal: &quot;${safeTitle.slice(0, 30)}&quot; })</text>
    `;
  } else {
    // Web Browser Viewport (Google Chrome / Arc / Website / Documentation / OpenAI / Google)
    bgColor = '#0f172a';
    headerColor = '#1e293b';
    accentColor = '#38bdf8';

    let displayUrl = 'https://google.com';
    if (lowerTitle.includes('openai') || safeAction.toLowerCase().includes('openai')) {
      displayUrl = 'https://platform.openai.com/docs/guides';
    } else if (lowerTitle.includes('github') || safeAction.toLowerCase().includes('github')) {
      displayUrl = 'https://github.com/coasty-ai/ghost-operator';
    } else if (lowerTitle.includes('youtube')) {
      displayUrl = 'https://youtube.com';
    }

    bodyContent = `
      <!-- URL Bar -->
      <rect x="15" y="48" width="770" height="32" rx="8" fill="#334155" />
      <text x="30" y="69" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="500">&#128274; ${displayUrl}</text>
      
      <!-- Webpage Viewport Container -->
      <rect x="15" y="90" width="770" height="295" rx="8" fill="#1e293b" stroke="#334155" />
      
      <!-- Web Header -->
      <text x="35" y="125" fill="#f8fafc" font-family="sans-serif" font-size="18" font-weight="bold">${safeTitle.slice(0, 42)}</text>
      <rect x="35" y="140" width="180" height="24" rx="12" fill="#0369a1" />
      <text x="50" y="156" fill="#7dd3fc" font-family="sans-serif" font-size="11" font-weight="bold">COASTY CUA VERIFIED 200 OK</text>
      
      <!-- Document Article Card -->
      <rect x="35" y="180" width="730" height="180" rx="6" fill="#0f172a" stroke="#334155" />
      <text x="55" y="210" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Documentation Overview &amp; API Reference</text>
      <text x="55" y="235" fill="#94a3b8" font-family="sans-serif" font-size="13">Active Action: ${safeAction.slice(0, 55)}</text>
      <text x="55" y="260" fill="#cbd5e1" font-family="monospace" font-size="12">const operator = new CoastyAgent({ model: &quot;v5-autonomous&quot; });</text>
      <text x="55" y="285" fill="#cbd5e1" font-family="monospace" font-size="12">await operator.executeTask(&quot;${safeTitle.slice(0, 35)}&quot;);</text>
      <text x="55" y="315" fill="#34d399" font-family="sans-serif" font-size="12" font-weight="bold">&#10003; Target element perceived and clicked by Coasty CUA Agent v5</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
    <rect width="800" height="400" fill="${bgColor}" />
    <rect width="800" height="36" fill="${headerColor}" />
    <circle cx="20" cy="18" r="6" fill="#ef4444" />
    <circle cx="38" cy="18" r="6" fill="#f59e0b" />
    <circle cx="56" cy="18" r="6" fill="#10b981" />
    <text x="400" y="23" fill="#9ca3af" font-family="sans-serif" font-size="12" text-anchor="middle" font-weight="500">${app} — Coasty AI CUA Engine v5</text>
    ${bodyContent}
    <rect x="220" y="110" width="340" height="60" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4,4" />
    <polygon points="230,120 230,145 240,138 248,155 253,153 245,135 255,135" fill="${accentColor}" stroke="#ffffff" stroke-width="1" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
