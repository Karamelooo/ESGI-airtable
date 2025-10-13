"use client";
import { create } from 'zustand';
import { RecordEntity } from '@/domain/records/Record';

type SortBy = '' | 'asc' | 'desc';

type SearchState = {
  records: RecordEntity[] | null;
  setRecords: (records: RecordEntity[] | null) => void;
  search: string;
  setSearch: (s: string) => void;
  sortby: SortBy;
  setSortby: (s: SortBy) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  records: null,
  setRecords: (records) => set({ records }),
  search: '',
  setSearch: (search) => set({ search }),
  sortby: '',
  setSortby: (sortby) => set({ sortby }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}));

