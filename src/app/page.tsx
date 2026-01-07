import { RecordEntity } from '@/domain/records/Record';
import SearchSection from './components/SearchSection';
import { createRecordsService } from '@/services/records/createRecordsService';
import Navbar from './components/Navbar';
import LikeButton from './components/LikeButton';

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
    const initialRecords = await recordsService.listRecords();
    const allTags = await recordsService.getAllTags();

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-neutral-100 mt-16 px-6 py-12 flex flex-col items-center">
          <section className="w-full max-w-7xl flex flex-col items-center">
            <div className="mb-6 w-full text-center">
              <h2 className="text-3xl font-bold text-neutral-900">
                Découvrez nos projets
              </h2>
              <p className="text-neutral-500 mt-2">
                Explorez les réalisations des étudiants de la filière Ingénierie du Web.
              </p>
            </div>
            <SearchSection initialRecords={initialRecords} allTags={allTags} />
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
