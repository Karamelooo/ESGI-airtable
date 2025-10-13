import { NextResponse } from 'next/server';

import { AirtableError } from '@/core/airtable/AirtableHttpClient';
import { SearchPortfolioService } from '@/services/search/SearchPortfolioService';

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const searchTerm = searchParams.get('search') || '';
  const sortby = searchParams.get('sortby') as '' | 'asc' | 'desc' || '';

  try {
    const recordsService = new SearchPortfolioService();
    const records = await recordsService.searchRecords({ search: searchTerm, sortby });

    return NextResponse.json({ records });
  } catch (error) {
    if (error instanceof AirtableError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 502 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Unexpected error while retrieving Airtable records.' },
      { status: 500 },
    );
  }
}
