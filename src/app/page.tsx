import { createRecordsService } from '@/services/records/createRecordsService';
import { Header } from '@/components/layout/Header';
import { RecordsList } from '@/components/records/RecordsList';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default async function Home() {
  try {
    const recordsService = createRecordsService();
    const records = await recordsService.listRecords();

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <RecordsList records={records} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Impossible de charger les enregistrements Airtable.';

    const details = "Vérifiez que le fichier .env.local contient des identifiants Airtable valides et relancez le serveur.";

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorDisplay 
            message={message}
            details={details}
          />
        </main>
      </div>
    );
  }
}
