import { getAirtableConfig } from '@/config/env';
import { AirtableHttpClient } from '@/core/airtable/AirtableHttpClient';
import { AirtableRecordsRepository } from '@/services/records/AirtableRecordsRepository';
import { RecordsService } from '@/services/records/RecordsService';

let cachedService: RecordsService | null = null;

export const createRecordsService = (): RecordsService => {
  if (cachedService) {
    return cachedService;
  }

  const airtableConfig = getAirtableConfig();
  const airtableClient = new AirtableHttpClient(airtableConfig);
  const repository = new AirtableRecordsRepository(airtableClient);

  cachedService = new RecordsService(repository);
  return cachedService;
};
