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
};

export interface AirtableClient {
  listRecords: (params?: ListRecordsParams) => Promise<AirtableListResponse>;
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

    if (params?.maxRecords) {
      url.searchParams.set('maxRecords', params.maxRecords.toString());
    }

    if (params?.view) {
      url.searchParams.set('view', params.view);
    }

    if (params?.filterByFormula) {
      url.searchParams.set('filterByFormula', params.filterByFormula);
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
}
