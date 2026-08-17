'use client';

import { useEffect, useState } from 'react';

export function FormStatus() {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const sent = new URLSearchParams(window.location.search).get('sent');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL param, must be read after mount to avoid an SSR hydration mismatch
    setStatus(sent === 'success' || sent === 'error' ? sent : null);
  }, []);

  if (!status) return null;

  return (
    <div
      className={`mb-4 rounded-[1rem] px-4 py-3 text-sm ${
        status === 'success'
          ? 'bg-[linear-gradient(180deg,rgba(34,197,94,.12)_0%,rgba(34,197,94,.06)_100%)] text-emerald-700 ring-1 ring-emerald-500/20'
          : 'bg-[linear-gradient(180deg,rgba(239,68,68,.10)_0%,rgba(239,68,68,.05)_100%)] text-red-600 ring-1 ring-red-500/20'
      }`}
    >
      {status === 'success'
        ? 'Thanks — your request has been received. We’ll be in touch shortly.'
        : 'Something went wrong sending your request. Please email us directly.'}
    </div>
  );
}
