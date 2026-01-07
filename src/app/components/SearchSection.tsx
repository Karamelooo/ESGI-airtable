"use client";
import React from 'react';
import SearchBar from '@/app/components/SearchBar';
import RecordsClientList from '@/app/components/RecordsClientList';
import { SearchProvider } from '@/store/SearchContext';
import { RecordEntity } from '@/domain/records/Record';

export default function SearchSection({ initialRecords }: { initialRecords: RecordEntity[] }) {
  return (
    <SearchProvider>
      <div className="mt-4 flex flex-col items-center gap-4 text-black w-full max-w-3xl">
        <SearchBar />
        <RecordsClientList initialRecords={initialRecords} />
      </div>
    </SearchProvider>
  );
}

