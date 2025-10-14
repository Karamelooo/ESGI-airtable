'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = { id: string; email: string } | null;

export default function SessionBadge() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        setUser(data.user ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.reload();
  };

  if (loading) {
    return <span className="text-sm text-neutral-500">Chargement…</span>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link className="text-sm underline" href="/auth/login">Se connecter</Link>
        <Link className="text-sm underline" href="/auth/signup">Créer un compte</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-600">Connecté&nbsp;: {user.email}</span>
      <button type="button" onClick={logout} className="text-sm underline">Se déconnecter</button>
    </div>
  );
}
