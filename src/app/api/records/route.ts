import { NextResponse } from 'next/server';

import { AirtableError } from '@/core/airtable/AirtableHttpClient';
import { createRecordsService } from '@/services/records/createRecordsService';

export async function GET() {
  try {
    const recordsService = createRecordsService();
    const records = await recordsService.listRecords();

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
