import SessionBadge from './components/SessionBadge';
import SearchSection from './components/SearchSection';
import { RecordEntity } from '@/domain/records/Record';
import { createRecordsService } from '@/services/records/createRecordsService';

const formatDate = (value: Date): string =>
  value.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default async function Home() {
  try {
    const recordsService = createRecordsService();
    const records: RecordEntity[] = await recordsService.listRecords();

    return (
      <main className="flex min-h-screen flex-col items-center gap-8 bg-neutral-100 px-6 py-12">
        <header className="max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            ESGI Portfolio
          </h1>
          <p className="mt-2 text-neutral-600">
            Interface Next.js combinant frontend et backend pour consulter une base Airtable.
          </p>
          <a 
  href="/profile"
  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
>
  Voir mon profil
</a>
          <div className="mt-4 flex justify-center text-black">
            <SessionBadge />
          </div>
          <SearchSection initialRecords={records} />
        </header>
        
      </main>
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
