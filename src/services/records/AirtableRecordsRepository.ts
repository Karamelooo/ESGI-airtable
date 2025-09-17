import {
  AirtableClient,
  AirtableRecord,
} from '@/core/airtable/AirtableHttpClient';
import { RecordEntity, RecordFields } from '@/domain/records/Record';
import { RecordsRepository } from '@/domain/records/RecordsRepository';

const toRecordFields = (fields: AirtableRecord['fields']): RecordFields => {
  return Object.keys(fields).reduce<RecordFields>((acc, key) => {
    acc[key] = fields[key] as RecordFields[typeof key];
    return acc;
  }, {});
};

const toRecordEntity = (record: AirtableRecord): RecordEntity => ({
  id: record.id,
  createdAt: new Date(record.createdTime),
  fields: toRecordFields(record.fields),
});

export class AirtableRecordsRepository implements RecordsRepository {
  constructor(private readonly client: AirtableClient) {}

  async list(): Promise<RecordEntity[]> {
    const { records } = await this.client.listRecords();
    return records.map(toRecordEntity);
  }
}
