"use client";
import React, { createContext, useContext, useMemo, useState } from 'react';
import { RecordEntity } from '@/domain/records/Record';

type SortBy = '' | 'asc' | 'desc';

type SearchContextState = {
  records: RecordEntity[] | null;
  setRecords: (r: RecordEntity[] | null) => void;
  search: string;
  setSearch: (s: string) => void;
  sortby: SortBy;
  setSortby: (s: SortBy) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;
};

const SearchContext = createContext<SearchContextState | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<RecordEntity[] | null>(null);
  const [search, setSearch] = useState('');
  const [sortby, setSortby] = useState<SortBy>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(
    () => ({ records, setRecords, search, setSearch, sortby, setSortby, loading, setLoading, error, setError }),
    [records, search, sortby, loading, error],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}

