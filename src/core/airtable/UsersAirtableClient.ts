import { AirtableHttpClient, AirtableRecord, AirtableFieldMap } from '@/core/airtable/AirtableHttpClient';
import { getAirtableUsersConfig } from '@/config/envUsers';

export type UsersRecord = AirtableRecord & {
  fields: {
    Email: string;
    PasswordHash: string;
  };
};

export class UsersAirtableClient extends AirtableHttpClient {
  constructor() {
    const cfg = getAirtableUsersConfig();
    super({
      apiKey: cfg.apiKey,
      baseId: cfg.baseId,
      tableId: cfg.usersTableId,
    });
  }

  async findByEmail(email: string): Promise<UsersRecord | null> {
    const formula = `LOWER({Email}) = LOWER("${email.replace(/"/g, '\\"')}")`;
    const records = await this.listRecordsRaw({ maxRecords: 1, filterByFormula: formula });
    if (records.length === 0) return null;
    return records[0] as UsersRecord;
  }

  async createUser(fields: { Email: string; PasswordHash: string }): Promise<UsersRecord> {
    const payload: AirtableFieldMap = {
      Email: fields.Email,
      PasswordHash: fields.PasswordHash
    };
    const rec = await this.createRecord(payload);
    return rec as UsersRecord;
  }
}