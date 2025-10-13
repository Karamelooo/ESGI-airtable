import { SearchAirtableClient } from "@/core/airtable/SearchAirtableClient";

export class SearchPortfolioService{
  private searchRecord = new SearchAirtableClient();

  async searchRecords(params: { search: string; sortby: '' | 'asc' | 'desc' }) {
    const { search, sortby } = params;
    
    const records = await this.searchRecord.searchRecords({ search, sortby });

    return records;
  }
}
