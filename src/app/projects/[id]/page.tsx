import { createRecordsService } from '@/services/records/createRecordsService';
import Navbar from '@/app/components/Navbar';
import LikeButton from '@/app/components/LikeButton';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AuthService } from '@/services/auth/AuthService';

const formatDate = (value: Date | string): string =>
  new Date(value).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  let isLoggedIn = false;
  if (token) {
    try {
      const auth = new AuthService();
      auth.verify(token);
      isLoggedIn = true;
    } catch {
      isLoggedIn = false;
    }
  }

  const recordsService = createRecordsService();

  try {
    const project = await recordsService.getRecordById(id);
    
    const fields = project.fields as any;
    const title = fields.Nom || fields.nom || fields.Name || fields.name || 'Projet sans titre';
    const description = fields.Description || fields.description || '';
    const tags = Array.isArray(fields.Tags || fields.tags) 
      ? (fields.Tags || fields.tags) 
      : (typeof (fields.Tags || fields.tags) === 'string' ? (fields.Tags || fields.tags).split(',').map((t: string) => t.trim()) : []);

    const imageUrl = (() => {
      const imageField = fields.Image || fields.image;
      if (Array.isArray(imageField) && imageField.length > 0) {
        return imageField[0]?.thumbnails?.large?.url || imageField[0]?.url;
      }
      return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop";
    })();

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-neutral-100 mt-16 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux projets
            </Link>

            <article className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden text-black">
              <div className="relative h-[400px]">
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-medium uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
                  <p className="text-blue-100 text-sm">
                    Publié le {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8 border-b border-neutral-100 pb-8">
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">À propos du projet</h2>
                    <p className="text-lg text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {description || "Aucune description disponible pour ce projet."}
                    </p>
                  </div>
                  <div className="ml-8 flex flex-col items-center">
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <LikeButton contentId={id} />
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${isLoggedIn ? '' : 'md:grid-cols-2'} gap-8`}>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Spécifications</h3>
                    <ul className="space-y-3">
                      {Object.entries(fields).map(([key, value]) => {
                        if (['Nom', 'nom', 'Name', 'name', 'Description', 'description', 'Image', 'image', 'Likes', 'likes'].includes(key)) return null;
                        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
                        return (
                          <li key={key} className="flex justify-between items-start gap-4 text-sm py-2 border-b border-neutral-50">
                            <span className="font-medium text-neutral-500 shrink-0">{key}</span>
                            <span className="text-neutral-900 text-right break-words">{displayValue}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {!isLoggedIn && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 h-fit">
                      <h3 className="text-blue-900 font-bold mb-2">Besoin de plus d'infos ?</h3>
                      <p className="text-blue-700 text-sm mb-4">Inscrivez-vous pour être contacté par notre service admissions.</p>
                      <Link href="/auth/signup" className="inline-block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Créer un compte
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
        </main>
      </>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Projet introuvable</h1>
          <p className="text-neutral-600 mb-8">Désolé, nous n'avons pas pu trouver les informations pour ce projet.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }
}
