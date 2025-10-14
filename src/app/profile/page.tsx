import Link from 'next/link';
import Image from 'next/image';
import type { ElementType } from 'react';

// Composant pour afficher une information de profil
const ProfileInfo = ({ icon: Icon, label, value }: {
  icon?: ElementType;
  label: string;
  value: string | undefined;
}) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
      {Icon ? <Icon className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" /> : null}
      <div className="flex-1">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-neutral-900">{value}</p>
      </div>
    </div>
  );
};

// Interface pour les données de profil
interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  birthDate?: string;
  position?: string;
  school?: string;
  bio?: string;
  photoUrl?: string;
}

// Composant principal de la page profil
export default function ProfilePage({ profile = {} }: { profile?: ProfileData }) {
  // Valeurs par défaut
  const defaultProfile: ProfileData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@esgi.fr',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    birthDate: '15 mars 1998',
    position: 'Développeur Full Stack',
    school: 'ESGI - École Supérieure de Génie Informatique',
    bio: 'Passionné par le développement web et les nouvelles technologies, je suis actuellement étudiant à l\'ESGI où je me spécialise en développement full stack. J\'aime créer des applications modernes avec React, Next.js et Node.js.',
    photoUrl: undefined,
  };

  // Fusion des valeurs par défaut avec les valeurs fournies
  const mergedProfile = { ...defaultProfile, ...profile };
  
  const fullName = [mergedProfile.firstName, mergedProfile.lastName].filter(Boolean).join(' ') || 'Nom complet';
  const initials = [mergedProfile.firstName?.[0], mergedProfile.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'NC';

  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-100 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* En-tête avec bouton retour */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Carte de profil principale */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
          {/* Bannière de couleur */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          {/* Contenu du profil */}
          <div className="px-8 pb-8">
            {/* Photo de profil */}
            <div className="relative -mt-16 mb-6">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={fullName}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-neutral-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{initials}</span>
                </div>
              )}
            </div>

            {/* Nom et titre */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {fullName}
              </h1>
              {profile.position && (
                <p className="text-lg text-neutral-600 flex items-center gap-2">
                  {profile.position}
                </p>
              )}
              {profile.school && (
                <p className="text-neutral-600 flex items-center gap-2 mt-1">
                  {profile.school}
                </p>
              )}
            </div>

            {/* Biographie */}
            {profile.bio && (
              <div className="mb-8 p-4 bg-neutral-50 rounded-lg">
                <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2">
                  À propos
                </h2>
                <p className="text-neutral-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Informations de contact */}
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileInfo label="Email" value={profile.email} />
              <ProfileInfo label="Téléphone" value={profile.phone} />
              <ProfileInfo label="Localisation" value={profile.location} />
              <ProfileInfo label="Date de naissance" value={profile.birthDate} />
            </div>
          </div>
        </div>

        {/* Section projets (optionnelle) */}
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Mes Projets</h2>
          <p className="text-neutral-600">
            Consultez mes projets sur la <Link href="/" className="text-blue-600 hover:underline">page d'accueil</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
