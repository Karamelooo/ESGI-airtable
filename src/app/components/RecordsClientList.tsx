"use client";
import React from 'react';
import { RecordEntity } from '@/domain/records/Record';
import { useSearch } from '@/store/SearchContext';

const formatDate = (value: Date): string =>
  value.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function RecordsClientList({ initialRecords }: { initialRecords: RecordEntity[] }) {
  const { records } = useSearch();
  const list = records ?? initialRecords;

  if (!list.length) {
    return (
      <p className="text-neutral-500">Aucun enregistrement trouvé dans Airtable pour le moment.</p>
    );
  }

  return (
    <div className="grid gap-4 w-full">
      {list.map((record) => {
        const displayName = (record.fields['nom'] as string)
          || (record.fields['Nom'] as string)
          || (record.fields['Name'] as string)
          || record.id;

        return (
          <article
            key={record.id}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{displayName}</h2>
              <span className="text-xs text-neutral-500">
                Créé le {formatDate(record.createdAt)}
              </span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm text-neutral-700">
              {Object.entries(record.fields).map(([fieldName, fieldValue]) => (
                <div key={fieldName} className="grid grid-cols-[150px_1fr] gap-4">
                  <dt className="font-medium text-neutral-500">{fieldName}</dt>
                  <dd>
                    {Array.isArray(fieldValue)
                      ? (fieldValue as unknown[]).map(String).join(', ')
                      : (fieldValue as unknown as string | number | boolean | null) ?? '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        );
      })}
    </div>
  );
}

