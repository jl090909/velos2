'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = '/';
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src="/veloshield-logo.svg" alt="Veloshield" className="h-12 w-auto mx-auto mb-5" />
            <p className="text-muted-foreground text-sm">Sign in to view the secure operations platform</p>
          </div>

          <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.97)_0%,rgba(246,247,249,.9)_100%)] shadow-[0_24px_70px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] ring-1 ring-white/70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.8),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,.1),transparent_38%)] pointer-events-none" />
            <CardContent className="relative p-8 md:p-10">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-semibold tracking-[.12em] uppercase text-muted-foreground mb-2 block">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold tracking-[.12em] uppercase text-muted-foreground mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,.95)_0%,rgba(244,245,247,.84)_100%)] border-transparent shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.04)]"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="mt-2 inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(242,243,246,.88)_100%)] text-foreground ring-1 ring-white/80 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.05)] hover:brightness-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
