'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOptimizerStore } from '@/store/optimizerStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  Sparkles,
  Zap,
  Clock,
  HardDrive,
  Target,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const OptimizerDashboardView: React.FC = () => {
  const router = useRouter();
  const {
    focus,
    insights,
    suggestions,
    duplicates,
    missions,
    executeSuggestion,
  } = useOptimizerStore();

  const score = focus?.score || 84;
  const totalMb = duplicates.reduce((acc, d) => acc + d.fileSizeMb, 0);
  const totalGb = (totalMb / 1024).toFixed(2);

  const weeklyData = [
    { date: 'Mon', score: 78, timeSaved: 30 },
    { date: 'Tue', score: 82, timeSaved: 45 },
    { date: 'Wed', score: 88, timeSaved: 60 },
    { date: 'Thu', score: 84, timeSaved: 40 },
    { date: 'Fri', score: 91, timeSaved: 75 },
    { date: 'Sat', score: 76, timeSaved: 25 },
    { date: 'Sun', score: 85, timeSaved: 50 },
  ];

  return (
    <PageContainer>
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/90 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="default">AI PRODUCTIVITY ENGINEER</Badge>
            <span className="text-xs font-mono text-zinc-400">Agent provider: Coasty API</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workspace Optimizer</h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Grammarly for computer productivity. Continuously observes desktop activity, detects friction & Alt+Tab switching, and automates workflows.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button onClick={() => router.push('/missions' as any)}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Launch Mission</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Productivity Score</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{score} / 100</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8 pts
            </span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Time Saved Today</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">45 Mins</span>
            <span className="text-[10px] text-zinc-500 font-mono">3 Automations</span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Recoverable Storage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-purple-400">{totalGb} GB</span>
            <span className="text-[10px] text-purple-300 font-mono">{duplicates.length} Files</span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Context Switches</span>
            <BrainCircuit className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{focus?.contextSwitches || 217}x</span>
            <span className="text-[10px] text-amber-300 font-mono">High switching</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: AI Insights + Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Insights & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Productivity & Time Saved Trends</h3>
              <Badge variant="outline">Weekly Analysis</Badge>
            </div>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="score" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Productivity Score" />
                  <Bar dataKey="timeSaved" fill="#10b981" radius={[4, 4, 0, 0]} name="Mins Saved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* AI Insights Summary */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Detected Inefficiencies & AI Insights</span>
              </h3>
              <Button size="sm" variant="ghost" onClick={() => router.push('/insights' as any)}>
                View All ({insights.length})
              </Button>
            </div>

            <div className="space-y-3">
              {insights.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-white">{item.title}</span>
                    <p className="text-xs text-zinc-400 font-mono">&ldquo;{item.description}&rdquo;</p>
                  </div>
                  <Badge variant={item.impactLevel === 'high' ? 'destructive' : 'warning'}>
                    {item.impactLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Quick Automations & Missions */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>1-Click Automations</span>
              </h3>
              <Button size="sm" variant="ghost" onClick={() => {
                useOptimizerStore.getState().setActiveTab('suggestions');
                router.push('/insights' as any);
              }}>
                All
              </Button>
            </div>

            <div className="space-y-3">
              {suggestions.slice(0, 3).map((sug) => (
                <div key={sug.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{sug.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">+{sug.timeSavedMins}m</span>
                  </div>
                  {sug.isExecuted ? (
                    <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full mt-1" onClick={() => executeSuggestion(sug.id)}>
                      <span>Execute</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Recommended Missions</span>
            </h3>

            <div className="space-y-2">
              {missions.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => router.push('/missions' as any)}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block">{m.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{m.stepsCount} Steps • Coasty {m.cuaVersion}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
