'use client';
import React, { useEffect, useMemo } from 'react';
import { useSearch } from '@/store/SearchContext';
import { RecordEntity } from '@/domain/records/Record';

export default function SearchBar() {
  const {
    search,
    setSearch,
    sortby,
    setSortby,
    setRecords,
    loading,
    setLoading,
    error,
    setError,
  } = useSearch();

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!debouncedSearch && !sortby) {
        setRecords(null);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (sortby) params.set('sortby', sortby);
        const res = await fetch(`/api/search/portfolio?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Erreur lors de la recherche');
        }
        const mapped: RecordEntity[] = (data.records as Array<{ id: string; createdTime: string; fields: Record<string, unknown> }> ).map((r) => ({
          id: r.id,
          createdAt: new Date(r.createdTime),
          fields: r.fields as Record<string, string | number | boolean | null | Array<string | number | boolean | null>>,
        }));
        if (!cancelled) setRecords(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur inconnue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, sortby, setError, setLoading, setRecords]);

  const toggleSort = () => {
    setSortby((prev) => (prev === '' ? 'asc' : prev === 'asc' ? 'desc' : ''));
  };

  return (
    <div className="w-full">
      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
        <div className="mr-3 flex h-5 w-5 items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          id="search-project"
          type="text"
          name="search-project-bar"
          placeholder="nom de projet"
          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="flex items-center border-l border-gray-300 px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={toggleSort}
          title={sortby ? `Tri ${sortby}` : 'Pas de tri'}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
          <p className="ml-1 text-sm text-gray-400">Trier{sortby ? ` (${sortby})` : ''}</p>
        </button>
      </div>

      <div className="mt-2">
        {loading && <p className="text-sm text-neutral-500">Recherche…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
