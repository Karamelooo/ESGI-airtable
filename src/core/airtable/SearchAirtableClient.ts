import { getAirtableConfig } from "@/config/env";
import { AirtableHttpClient } from "./AirtableHttpClient";

export type SearchParams = {
  search?: string;
  sortby?: '' | 'asc' | 'desc';
};

export class SearchAirtableClient extends AirtableHttpClient {
  constructor() {
    const cfg = getAirtableConfig();
    super({
      apiKey: cfg.apiKey,
      baseId: cfg.baseId,
      tableId: cfg.tableId,
    });
  }

  async searchRecords(params: SearchParams) {
    const { search, sortby } = params;
    const queryParams = new URLSearchParams();
    
    if (search) {
      queryParams.set('filterByFormula', `SEARCH(LOWER("${search.replace(/"/g, '\\"')}"), LOWER({Nom}))`);
    }
    if (sortby) {
      queryParams.set('sort[0][field]', 'Nom');
      queryParams.set('sort[0][direction]', sortby);
    }

    const records = await this.listRecordsRaw(Object.fromEntries(queryParams.entries()));
    return records;
  }
}