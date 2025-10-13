import { RecordEntity } from '@/domain/records/Record';
import { createRecordsService } from '@/services/records/createRecordsService';
import SessionBadge from './components/SessionBadge';

const formatDate = (value: Date): string =>
  value.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const RecordsList = ({ records }: { records: RecordEntity[] }) => {
  if (!records.length) {
    return (
      <p className="text-neutral-500">Aucun enregistrement trouvé dans Airtable pour le moment.</p>
    );
  }

  return (
    <div className="grid gap-4 w-full">
      {records.map((record) => (
        <article
          key={record.id}
          className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{record.id}</h2>
            <span className="text-xs text-neutral-500">
              Créé le {formatDate(record.createdAt)}
            </span>
          </div>
          <dl className="mt-4 grid gap-2 text-sm text-neutral-700">
            {Object.entries(record.fields).map(([fieldName, fieldValue]) => (
              <div key={fieldName} className="grid grid-cols-[150px_1fr] gap-4">
                <dt className="font-medium text-neutral-500">{fieldName}</dt>
                <dd>
                  {Array.isArray(fieldValue)
                    ? fieldValue.join(', ')
                    : fieldValue ?? '—'}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
};

export default async function Home() {
  try {
    const recordsService = createRecordsService();
    const records = await recordsService.listRecords();

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
        </header>
        <section className="w-full max-w-3xl">
          <RecordsList records={records} />
        </section>
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
