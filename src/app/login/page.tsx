'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, Loader2, Github, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Approval Desk <span className="text-cyan-400 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">demo</span>
          </span>
        </Link>
        <Link href="/register">
          <Button variant="ghost" className="text-xs text-zinc-400 hover:text-white">
            Need an account? <span className="text-cyan-400 ml-1 font-semibold">Sign Up</span>
          </Button>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="w-full max-w-md bg-zinc-900/90 border-zinc-800/90 shadow-2xl backdrop-blur-xl relative z-10">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Sign in to review agent runs and approve risky steps.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="alex.rivera@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                  <a href="#" className="text-[11px] text-cyan-400 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>Sign In to Operator Console</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-900 px-3 text-[10px] font-mono text-zinc-500 uppercase absolute">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => { setEmail('alex.rivera@example.com'); setPassword('demo1234'); }}
                className="bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs"
              >
                <Github className="w-4 h-4 mr-2" />
                <span>GitHub SSO</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => { setEmail('alex.rivera@example.com'); setPassword('demo1234'); }}
                className="bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
                <span>Demo One-Click</span>
              </Button>
            </div>

            <p className="text-center text-[11px] text-zinc-500 pt-2">
              Demo sign-in: no real account is created yet.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-zinc-800/80 text-center text-xs text-zinc-500 font-mono">
        APPROVAL DESK • DEMO AUTHENTICATION
      </footer>
    </div>
  );
}
