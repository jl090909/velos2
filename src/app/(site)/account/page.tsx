/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-location-assign-relative-destination */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { medusa } from '@/lib/medusa-client';

type View = 'sign-in' | 'register';

export default function AccountPage() {
  const [view, setView] = useState<View>('sign-in');
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '' });

  async function loadCustomer() {
    try {
      const { customer: c } = await medusa.store.customer.retrieve();
      setCustomer(c);
      const { orders: o } = await medusa.client.fetch<{ orders: any[] }>('/store/orders', { query: { limit: 20 } });
      setOrders(o || []);
    } catch (e) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomer(); }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/commerce/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Login failed');
      if (data.token) {
        localStorage.setItem('medusa_auth_token', data.token);
      }
      if (data.verification_required) {
        setError('Email verification required. Check your inbox.');
        return;
      }
      await loadCustomer();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/commerce/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, first_name: form.first_name, last_name: form.last_name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Registration failed');
      if (data.token) {
        localStorage.setItem('medusa_auth_token', data.token);
      }
      if (data.verification_required) {
        setError('Email verification required. Check your inbox.');
        return;
      }
      await loadCustomer();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  }

  async function handleLogout() {
    try { await medusa.auth.logout(); } catch {}
    if (typeof window !== 'undefined') localStorage.removeItem('medusa_auth_token');
    setCustomer(null);
    setOrders([]);
  }

  if (loading) return <p className="p-10">Loading account…</p>;

  if (customer) {
    return (
      <>
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Account</p>
          <h1 className="text-4xl font-semibold text-[#003C64]">Welcome, {customer.first_name || customer.email}</h1>
          <p className="mt-2 text-slate-600">{customer.email}</p>
          <button onClick={handleLogout} className="mt-4 rounded-full border border-[#003C64] px-6 py-3 font-semibold text-[#003C64]">Sign out</button>

          <h2 className="mt-10 text-2xl font-semibold text-[#003C64]">Orders</h2>
          {orders.length === 0 && <p className="mt-3 text-slate-600">No orders yet.</p>}
          <div className="mt-4 space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="rounded-2xl border bg-white p-6">
                <p className="font-semibold text-[#003C64]">{o.id}</p>
                <p className="text-sm text-slate-500">{new Date(o.created_at).toLocaleString()} · {o.status}</p>
                <p className="mt-1">Total: {((o.total || 0) / 100).toFixed(2)} {o.currency_code ? o.currency_code.toUpperCase() : ''}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/licensing" className="rounded-full border border-[#003C64] px-6 py-3 font-semibold text-[#003C64]">Licensing</Link>
          </div>
        </section>
        <SiteFooter />
      </>
    );
  }

  const inputCls = "w-full rounded border border-slate-300 px-3 py-2";

  return (
    <>
      <section className="mx-auto max-w-md px-6 pb-24 pt-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Account</p>
        <h1 className="text-4xl font-semibold text-[#003C64]">{view === 'sign-in' ? 'Sign in' : 'Register'}</h1>
        <div className="mt-4 flex gap-3 text-sm">
          <button onClick={() => setView('sign-in')} className={view==='sign-in' ? 'font-semibold text-[#003C64]' : 'text-slate-500'}>Sign in</button>
          <button onClick={() => setView('register')} className={view==='register' ? 'font-semibold text-[#003C64]' : 'text-slate-500'}>Register</button>
        </div>
        <form onSubmit={view === 'sign-in' ? handleLogin : handleRegister} className="mt-6 space-y-3">
          {view === 'register' && (
            <>
              <input placeholder="First name" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className={inputCls} />
              <input placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className={inputCls} />
            </>
          )}
          <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inputCls} />
          <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className={inputCls} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">
            {view === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
      <SiteFooter />
    </>
  );
}
