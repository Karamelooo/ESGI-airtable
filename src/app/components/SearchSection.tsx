"use client";
import React from 'react';
import SearchBar from '@/app/components/SearchBar';
import RecordsClientList from '@/app/components/RecordsClientList';
import { SearchProvider, useSearch } from '@/store/SearchContext';
import { RecordEntity } from '@/domain/records/Record';

function SearchContent({ initialRecords, allTags }: { initialRecords: RecordEntity[], allTags: string[] }) {
  const { selectedTag, setSelectedTag } = useSearch();

  return (
    <div className="mt-4 flex flex-col items-center gap-6 text-black w-full">
      <div className="w-full max-w-3xl">
        <SearchBar />
        
        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedTag === null 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-blue-300'
              }`}
            >
              Tous les projets
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedTag === tag 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-blue-300 shadow-sm'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <RecordsClientList initialRecords={initialRecords} />
    </div>
  );
}

export default function SearchSection({ initialRecords, allTags = [] }: { initialRecords: RecordEntity[], allTags?: string[] }) {
  return (
    <SearchProvider>
      <SearchContent initialRecords={initialRecords} allTags={allTags} />
    </SearchProvider>
  );
}
