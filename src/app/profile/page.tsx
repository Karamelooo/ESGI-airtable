"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

interface ProfileData {
  id?: string;
  Email: string;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  Location?: string;
  Bio?: string;
  Position?: string;
  School?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (!data.user) {
        router.push('/auth/login');
        return;
      }

      const profileRes = await fetch('/api/auth/me');
      const profileData = await profileRes.json();
      
      if (profileData.user) {
        setProfile(profileData.user);
        setFormData(profileData.user);
      }
    } catch (err) {
      setError("Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Échec de la mise à jour");
      
      const data = await res.json();
      setProfile(data.user.fields);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    
    try {
      const res = await fetch('/api/auth/profile', { method: 'DELETE' });
      if (!res.ok) throw new Error("Échec de la suppression");
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-100 mt-16 px-6 py-12 text-black">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mon profil</h1>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-neutral-200 text-neutral-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}
              >
                {isEditing ? 'Annuler' : 'Modifier mes infos'}
              </button>
              <button 
                onClick={handleDelete}
                className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all"
              >
                Supprimer le compte
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar and Quick Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.Email?.[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-bold truncate">{profile?.Email}</h2>
                <p className="text-neutral-500 text-sm mt-1">Étudiant ESGI</p>
              </div>
            </div>

            {/* Right Column: Form or Info */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Prénom</label>
                        <input 
                          type="text" 
                          value={formData.FirstName || ''}
                          onChange={e => setFormData({...formData, FirstName: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Nom</label>
                        <input 
                          type="text" 
                          value={formData.LastName || ''}
                          onChange={e => setFormData({...formData, LastName: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.Email || ''}
                        disabled
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
                      <input 
                        type="text" 
                        value={formData.Phone || ''}
                        onChange={e => setFormData({...formData, Phone: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Localisation</label>
                      <input 
                        type="text" 
                        value={formData.Location || ''}
                        onChange={e => setFormData({...formData, Location: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                      <textarea 
                        rows={4}
                        value={formData.Bio || ''}
                        onChange={e => setFormData({...formData, Bio: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Informations personnelles</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <dt className="text-sm text-neutral-500">Nom complet</dt>
                          <dd className="text-lg font-medium">{profile?.FirstName} {profile?.LastName || '-'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-neutral-500">Email</dt>
                          <dd className="text-lg font-medium">{profile?.Email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-neutral-500">Téléphone</dt>
                          <dd className="text-lg font-medium">{profile?.Phone || '-'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-neutral-500">Localisation</dt>
                          <dd className="text-lg font-medium">{profile?.Location || '-'}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Bio</h3>
                      <p className="text-neutral-700 leading-relaxed italic">
                        {profile?.Bio || "Aucune bio renseignée."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}