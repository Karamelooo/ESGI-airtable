import { AirtableConfig } from '@/config/env';

export type AirtableFieldMap = Record<string, unknown>;

export type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: AirtableFieldMap;
};

export type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

export type ListRecordsParams = {
  maxRecords?: number;
  view?: string;
  filterByFormula?: string;
  [key: string]: any;
};

export interface AirtableClient {
  listRecords: (params?: ListRecordsParams) => Promise<AirtableListResponse>;
  getRecord: (recordId: string) => Promise<AirtableRecord>;
}

export class AirtableError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AirtableError';
    this.status = status;
  }
}

export class AirtableHttpClient implements AirtableClient {
  private readonly baseUrl: string;

  constructor(private readonly config: AirtableConfig) {
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableId)}`;
  }

  async listRecords(params?: ListRecordsParams): Promise<AirtableListResponse> {
    const url = new URL(this.baseUrl);

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new AirtableError('Airtable API request failed', response.status);
    }

    const payload = (await response.json()) as AirtableListResponse;
    return payload;
  }

  async createRecord(fields: AirtableFieldMap): Promise<AirtableRecord> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
      cache: 'no-store',
    });

    if (!response.ok) {
      let detail = '';
      try {
        const t = await response.text();
        if (t) {
          try {
            const j = JSON.parse(t) as { error?: { type?: string; message?: string } };
            detail = j?.error?.message ? `: ${j.error.message}` : `: ${t}`;
          } catch {
            detail = `: ${t}`;
          }
        }
      } catch { }
      throw new AirtableError(`Airtable API request failed${detail}`, response.status);
    }

    const payload = (await response.json()) as AirtableRecord;
    return payload;
  }

  async updateRecord(recordId: string, fields: AirtableFieldMap): Promise<AirtableRecord> {
    const response = await fetch(`${this.baseUrl}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
      cache: 'no-store',
    });

    if (!response.ok) {
      let detail = '';
      try {
        const t = await response.text();
        if (t) {
          try {
            const j = JSON.parse(t) as { error?: { type?: string; message?: string } };
            detail = j?.error?.message ? `: ${j.error.message}` : `: ${t}`;
          } catch {
            detail = `: ${t}`;
          }
        }
      } catch { }
      throw new AirtableError(`Airtable API request failed${detail}`, response.status);
    }

    const payload = (await response.json()) as AirtableRecord;
    return payload;
  }

  async listRecordsRaw(params?: ListRecordsParams): Promise<AirtableRecord[]> {
    const { records } = await this.listRecords(params);
    return records;
  }

  async getRecord(recordId: string): Promise<AirtableRecord> {
    const response = await fetch(`${this.baseUrl}/${recordId}`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new AirtableError('Airtable API request failed', response.status);
    }

    const payload = (await response.json()) as AirtableRecord;
    return payload;
  }
}