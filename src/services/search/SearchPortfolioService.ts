import { SearchAirtableClient } from "@/core/airtable/SearchAirtableClient";

export class SearchPortfolioService{
  private searchRecord = new SearchAirtableClient();

  async searchRecords(params: { search: string; tag?: string; sortby: '' | 'asc' | 'desc' }) {
    const { search, tag, sortby } = params;
    
    const records = await this.searchRecord.searchRecords({ search, tag, sortby });

    return records;
  }
}
