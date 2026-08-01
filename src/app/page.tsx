'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
  Globe,
  Layers,
  Code2,
  Wand2,
  Radio,
  Star,
  Monitor,
  Command,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LiveScreenshotCanvas } from '@/components/execution/LiveScreenshotCanvas';

export default function LandingPage() {
  const [activeDemoStep, setActiveDemoStep] = useState(2);

  const demoSteps = [
    {
      stepNumber: 1,
      title: 'Initialize Terminal & Inspect Node Environment',
      targetApp: 'Terminal',
      actionText: 'Checking Node.js v20.11.0 & verifying available ports',
      command: 'node -v && lsof -i :3000',
      status: 'succeeded' as const,
      outputLogs: '[STDOUT] Node.js v20.11.0 verified\n[STDOUT] Port 3000 open for dev server.',
    },
    {
      stepNumber: 2,
      title: 'Launch VS Code Workspace Editor',
      targetApp: 'VS Code',
      actionText: 'Opening project repository in VS Code editor with split windows',
      command: 'code ./workspace',
      status: 'running' as const,
      outputLogs: '[COASTY CUA] Launched VS Code executable. Workspace ./workspace opened.',
    },
    {
      stepNumber: 3,
      title: 'Start Next.js Development Server',
      targetApp: 'Terminal',
      actionText: 'Executing npm run dev and starting local dev server on port 3000',
      command: 'npm run dev',
      status: 'pending' as const,
      outputLogs: '[COASTY CUA] > next dev\n[INFO] Ready in 1.8s at http://localhost:3000',
    },
    {
      stepNumber: 4,
      title: 'Open Google Chrome Developer Docs',
      targetApp: 'Google Chrome',
      actionText: 'Navigating to API reference guide & developer documentation',
      command: 'google-chrome http://localhost:3000',
      status: 'pending' as const,
      outputLogs: '[PENDING] Awaiting step 3 completion before launching browser view.',
    },
  ];

  const currentDemo = demoSteps[activeDemoStep];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="h-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">COASTY AI</span>
              <Badge variant="default" className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                CUA ENGINE v5
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400">Autonomous Computer-Use AI Operator</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Live CUA Stream</a>
          <a href="#benchmarks" className="hover:text-white transition-colors">Benchmarks</a>
          <a href="#api" className="hover:text-white transition-colors">Coasty API</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link href={'/login' as any}>
            <Button variant="ghost" className="text-xs text-zinc-300 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link href={'/dashboard' as any}>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 px-5 rounded-xl">
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 text-center max-w-6xl mx-auto overflow-hidden z-10">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-xl backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Autonomous Desktop Agent Model • Coasty CUA Engine v5</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Your Autonomous <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AI Productivity Engineer
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Coasty AI operates your desktop applications, VS Code, terminals, and browsers completely autonomously. 
            Automate complex multi-step routines, inspect live execution feeds, and elevate developer throughput by 10x.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={'/missions' as any}>
              <Button size="lg" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm px-8 py-6 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all">
                <Play className="w-4 h-4 mr-2 fill-black" />
                <span>Launch Autonomous Mission</span>
              </Button>
            </Link>

            <Link href={'/dashboard' as any}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-bold text-sm px-8 py-6 rounded-2xl">
                <span>Explore Workspace Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Social Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>50-Step Multi-Action Loops</span>
            </div>
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>1-Click Safety Confirmations</span>
            </div>
            <div className="flex items-center space-x-1.5 text-amber-400">
              <Cpu className="w-4 h-4" />
              <span>Coasty API Integration Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Stream Demo */}
      <section id="demo" className="py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full z-10">
        <div className="text-center space-y-2 mb-8">
          <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
            INTERACTIVE REPLAY STREAM DEMO
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Live Desktop Screen Stream & Step Timeline
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            Click any step below to test the time-travel step replay and observe Coasty CUA Agent executing actions.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {demoSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDemoStep(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 border ${
                activeDemoStep === idx
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                {step.stepNumber}
              </span>
              <span>{step.targetApp}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Screen Feed */}
          <div className="lg:col-span-2">
            <LiveScreenshotCanvas
              step={{
                id: `demo_step_${currentDemo.stepNumber}`,
                runId: 'demo_run_999',
                stepNumber: currentDemo.stepNumber,
                title: currentDemo.title,
                description: currentDemo.actionText,
                actionType: 'command',
                targetApp: currentDemo.targetApp,
                command: currentDemo.command,
                status: currentDemo.status,
                durationMs: 1500,
                riskLevel: 'low',
                requiresApproval: false,
                isApproved: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }}
              runTitle="Morning Developer Startup Routine"
              isLive={true}
            />
          </div>

          {/* CUA Stream Log & Stats */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-4 flex flex-col justify-between shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>CUA ACTION STREAM</span>
                </div>
                <Badge variant="default" className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400">
                  LIVE POLLED
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5">
                <p className="text-cyan-400 font-bold">$ {currentDemo.command}</p>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{currentDemo.actionText}</p>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap">
                  {currentDemo.outputLogs}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Active Execution Progress</span>
                <span className="text-cyan-400 font-bold">Step {activeDemoStep + 1} / 4</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((activeDemoStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section id="benchmarks" className="py-16 px-6 lg:px-12 bg-zinc-900/40 border-y border-zinc-800/80 z-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
              PERFORMANCE & AGENT ACCURACY
            </Badge>
            <h2 className="text-3xl font-extrabold text-white">Engine Benchmarks & Metrics</h2>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">
              Built on Coasty CUA Engine v5 for autonomous computer interaction across desktop and browser environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-zinc-950 border-zinc-800 p-6 space-y-2 shadow-2xl">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">10x</p>
              <h3 className="font-bold text-sm text-zinc-200">Developer Velocity</h3>
              <p className="text-xs text-zinc-400">Automates repetitive setup, build tasks, and environment config.</p>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800 p-6 space-y-2 shadow-2xl">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">99.4%</p>
              <h3 className="font-bold text-sm text-zinc-200">Action Perception Accuracy</h3>
              <p className="text-xs text-zinc-400">Coasty vision model predicts UI target coordinates with pixel precision.</p>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800 p-6 space-y-2 shadow-2xl">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">50 Steps</p>
              <h3 className="font-bold text-sm text-zinc-200">Max Task Horizon</h3>
              <p className="text-xs text-zinc-400">Supports long multi-step workflows with autonomous self-correction.</p>
            </Card>

            <Card className="bg-zinc-950 border-zinc-800 p-6 space-y-2 shadow-2xl">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">100%</p>
              <h3 className="font-bold text-sm text-zinc-200">Human Safety Guard</h3>
              <p className="text-xs text-zinc-400">High-risk terminal commands trigger 1-click human confirmation modal.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section id="features" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto space-y-12 z-10">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/30">
            INTELLIGENT MODULES
          </Badge>
          <h2 className="text-3xl font-extrabold text-white">Full-Stack Productivity Ecosystem</h2>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            Everything you need to observe, analyze, and automate desktop & web operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/80 border-zinc-800 p-6 space-y-4 hover:border-cyan-500/50 transition-colors shadow-2xl">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Mission Automation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Launch pre-built or custom computer-use missions. Powered directly by <span className="font-mono text-cyan-400">POST https://coasty.ai/v1/tasks</span>.
            </p>
            <Link href={'/missions' as any} className="inline-flex items-center text-xs font-bold text-cyan-400 hover:underline">
              <span>Open Missions</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Card>

          <Card className="bg-zinc-900/80 border-zinc-800 p-6 space-y-4 hover:border-cyan-500/50 transition-colors shadow-2xl">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Macro Recorder & Workflows</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Record user actions, edit execution steps, and generate structured execution plans with risk scoring.
            </p>
            <Link href={'/workflows' as any} className="inline-flex items-center text-xs font-bold text-cyan-400 hover:underline">
              <span>Open Workflows</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Card>

          <Card className="bg-zinc-900/80 border-zinc-800 p-6 space-y-4 hover:border-cyan-500/50 transition-colors shadow-2xl">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 w-fit">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Time-Travel Replay Feed</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Step forward and backward through past step executions with detailed log inspection and step screenshot playback.
            </p>
            <Link href={'/live' as any} className="inline-flex items-center text-xs font-bold text-cyan-400 hover:underline">
              <span>View Replay Stream</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Card>
        </div>
      </section>

      {/* Coasty API Callout */}
      <section id="api" className="py-16 px-6 lg:px-12 bg-zinc-900/60 border-t border-zinc-800 z-10">
        <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Coasty CUA API Integration</h2>
              </div>
              <p className="text-xs text-zinc-400 max-w-xl">
                Configure your API key in <code className="font-mono text-cyan-400">.env</code> to unleash real managed execution containers on Coasty cloud machines.
              </p>
            </div>
            <Link href={'/settings' as any}>
              <Button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-mono font-bold">
                Configure COASTY_API_KEY
              </Button>
            </Link>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-cyan-300 overflow-x-auto">
{`// POST https://coasty.ai/v1/tasks
const taskResponse = await coastyClient.submitTask({
  task: "Morning startup routine: Open Slack, email client, VS Code, and start terminal services.",
  cua_version: "v5",
  max_steps: 50
});`}
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-zinc-800 text-center text-xs text-zinc-500 space-y-4 z-10">
        <div className="flex items-center justify-center space-x-6">
          <Link href={'/dashboard' as any} className="hover:text-zinc-300">Dashboard</Link>
          <Link href={'/missions' as any} className="hover:text-zinc-300">Missions</Link>
          <Link href={'/workflows' as any} className="hover:text-zinc-300">Workflows</Link>
          <Link href={'/login' as any} className="hover:text-zinc-300">Sign In</Link>
        </div>
        <p>© 2026 COASTY AI • Autonomous Computer-Use AI Operator • Powered by Coasty CUA Engine v5</p>
      </footer>
    </div>
  );
}
