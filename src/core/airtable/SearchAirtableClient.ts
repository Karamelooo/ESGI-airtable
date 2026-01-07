import { getAirtableConfig } from "@/config/env";
import { AirtableHttpClient } from "./AirtableHttpClient";

export type SearchParams = {
  search?: string;
  tag?: string;
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
    const { search, tag, sortby } = params;
    const queryParams = new URLSearchParams();
    
    let formula = '';
    const conditions: string[] = [];

    if (search) {
      const escaped = search.replace(/"/g, '\\"');
      conditions.push(`OR(SEARCH(LOWER("${escaped}"), LOWER({Nom})), SEARCH(LOWER("${escaped}"), LOWER({Tags})))`);
    }

    if (tag) {
      conditions.push(`SEARCH(LOWER("${tag.replace(/"/g, '\\"')}"), LOWER({Tags}))`);
    }

    if (conditions.length > 1) {
      formula = `AND(${conditions.join(', ')})`;
    } else if (conditions.length === 1) {
      formula = conditions[0];
    }

    if (formula) {
      queryParams.set('filterByFormula', formula);
    }

    if (sortby) {
      queryParams.set('sort[0][field]', 'Nom');
      queryParams.set('sort[0][direction]', sortby);
    }

    const records = await this.listRecordsRaw(Object.fromEntries(queryParams.entries()));
    return records;
  }
}