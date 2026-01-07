'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? 'Erreur');
      return;
    }
    router.replace('/');
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg border shadow-sm space-y-4 text-black">
        <h1 className="text-xl font-semibold">Inscription</h1>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Mot de passe</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="w-full bg-black text-white rounded py-2">Créer mon compte</button>
      </form>
    </main>
  );
}