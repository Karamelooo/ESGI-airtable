import { AirtableHttpClient, AirtableRecord, AirtableFieldMap } from '@/core/airtable/AirtableHttpClient';
import { getAirtableUsersConfig } from '@/config/envUsers';

export type UsersRecord = AirtableRecord & {
  fields: {
    Email: string;
    PasswordHash: string;
    FirstName?: string;
    LastName?: string;
    Phone?: string;
    Location?: string;
    Bio?: string;
    Position?: string;
    School?: string;
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

  async findById(id: string): Promise<UsersRecord | null> {
    try {
      const rec = await this.getRecord(id);
      return rec as UsersRecord;
    } catch {
      return null;
    }
  }

  async createUser(fields: { Email: string; PasswordHash: string }): Promise<UsersRecord> {
    const payload: AirtableFieldMap = {
      Email: fields.Email,
      PasswordHash: fields.PasswordHash
    };
    const rec = await this.createRecord(payload);
    return rec as UsersRecord;
  }

  async updateUser(id: string, fields: Partial<UsersRecord['fields']>): Promise<UsersRecord> {
    const { id: _, ID: __, CreatedAt: ___, CreatedTime: ____, ...cleanFields } = fields as any;
    const rec = await this.updateRecord(id, cleanFields as AirtableFieldMap);
    return rec as UsersRecord;
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${(this as any).baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${(this as any).config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
  }
}