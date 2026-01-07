"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';
import { RecordEntity } from '@/domain/records/Record';

type SortBy = '' | 'asc' | 'desc';

type SearchContextState = {
  records: RecordEntity[] | null;
  setRecords: React.Dispatch<React.SetStateAction<RecordEntity[] | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedTag: string | null;
  setSelectedTag: React.Dispatch<React.SetStateAction<string | null>>;
  sortby: SortBy;
  setSortby: React.Dispatch<React.SetStateAction<SortBy>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchContext = createContext<SearchContextState | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<RecordEntity[] | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortby, setSortby] = useState<SortBy>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(
    () => ({ records, setRecords, search, setSearch, selectedTag, setSelectedTag, sortby, setSortby, loading, setLoading, error, setError }),
    [records, search, selectedTag, sortby, loading, error],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
