import { RecordEntity } from '@/domain/records/Record';
import SearchSection from './components/SearchSection';
import { createRecordsService } from '@/services/records/createRecordsService';
import Navbar from './components/Navbar';

const formatDate = (value: Date): string =>
  value.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const ProjectCard = ({ record }: { record: RecordEntity }) => {

  const getImageUrl = () => {
    const imageField = record.fields.Image || record.fields.image;
    
    if (Array.isArray(imageField) && imageField.length > 0) {
      // Utiliser la miniature 'large' si disponible, sinon l'URL complète
      return imageField[0].thumbnails?.large?.url || imageField[0].url;
    }
    
    // Image par défaut si aucune image n'est trouvée
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop";
  };

  // Extraire le titre (votre champ s'appelle "Nom")
  const getTitle = () => {
    return record.fields.Nom || 
           record.fields.nom || 
           record.fields.Name ||
           record.fields.name || 
           'Projet sans titre';
  };

  // Extraire la description
  const getDescription = () => {
    return record.fields.Description || record.fields.description || '';
  };

  // Extraire les tags
  const getTags = () => {
    const tags = record.fields.Tags || record.fields.tags;
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
    return [];
  };

  return (
     <article className="group rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-neutral-300">
      {/* Image du projet */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
        <img 
          src={getImageUrl()}
          alt={getTitle()}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Contenu de la card */}
      <div className="p-6">
        {/* En-tête de la card */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {getTitle()}
          </h3>
          <span className="text-xs text-neutral-500 uppercase tracking-wide">
            {formatDate(record.createdAt)}
          </span>
        </div>

      {/* Description */}
      {getDescription() && (
        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
          {getDescription()}
        </p>
      )}

      {/* Tags */}
      {getTags().length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {getTags().slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer avec bouton */}
      <div className="mt-auto pt-4 border-t border-neutral-100">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group">
          Voir le projet
          <svg 
            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      </div>
    </article>
  );
};

const ProjectsGrid = ({ records }: { records: RecordEntity[] }) => {
  if (!records.length) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-neutral-500 text-lg">
          Aucun projet trouvé dans Airtable pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {records.map((record) => (
        <ProjectCard key={record.id} record={record} />
      ))}
    </div>
  );
};

// const RecordsList = ({ records }: { records: RecordEntity[] }) => {
//   if (!records.length) {
//     return (
//       <p className="text-neutral-500">Aucun enregistrement trouvé dans Airtable pour le moment.</p>
//     );
//   }

//   return (
//     <div className="grid gap-4 w-full">
//       {records.map((record) => (
//         <article
//           key={record.id}
//           className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
//         >
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">{record.id}</h2>
//             <span className="text-xs text-neutral-500">
//               Créé le {formatDate(record.createdAt)}
//             </span>
//           </div>
//           <dl className="mt-4 grid gap-2 text-sm text-neutral-700">
//             {Object.entries(record.fields).map(([fieldName, fieldValue]) => (
//               <div key={fieldName} className="grid grid-cols-[150px_1fr] gap-4">
//                 <dt className="font-medium text-neutral-500">{fieldName}</dt>
//                 <dd>
//                   {Array.isArray(fieldValue)
//                     ? fieldValue.join(', ')
//                     : fieldValue ?? '—'}
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </article>
//       ))}
//     </div>
//   );
// };

export default async function Home() {
  try {
    const recordsService = createRecordsService();
    const records = await recordsService.listRecords();

    return (
      <><Navbar />
      <main className="flex min-h-screen flex-col items-center gap-8 bg-neutral-100 mt-18 px-6 py-12">
          <header className="max-w-7xl w-full text-center">
            
          </header>

          <section className="w-full max-w-7xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                Mes Projets
              </h2>
              <p className="text-neutral-600 mt-1">
                {records.length} projet{records.length > 1 ? 's' : ''} disponible{records.length > 1 ? 's' : ''}
              </p>
            </div>
            <ProjectsGrid records={records} />
          </section>
        </main>
      </>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Impossible de charger les enregistrements Airtable.';

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-6 py-12">
        <div className="max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Erreur de configuration Airtable
          </h1>
          <p className="mt-4 text-neutral-700">
            {message}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Vérifiez que le fichier <code>.env.local</code> contient des identifiants Airtable valides et relancez le serveur.
          </p>
        </div>
      </main>
    );
  }
}
