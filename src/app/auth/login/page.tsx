'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/auth/login', {
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
      <div className="w-full max-w-sm space-y-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </a>
        <form onSubmit={onSubmit} className="w-full bg-white p-8 rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/50 space-y-6 text-black">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-sm text-neutral-500">Heureux de vous revoir !</p>
          </div>

          {err && <p className="text-sm p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg">{err}</p>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input 
              type="email"
              placeholder="votre@email.com"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-4 pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 cursor-pointer">
              Se connecter
            </button>
            <p className="text-center text-sm text-neutral-500">
              Pas encore de compte ?{' '}
              <a href="/auth/signup" className="text-blue-600 font-semibold hover:underline">S'inscrire</a>
            </p>
          </div>
      </form>
    </div>
  </main>
  );
}