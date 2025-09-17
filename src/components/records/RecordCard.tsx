import React from 'react';
import { RecordEntity } from '@/domain/records/Record';

interface RecordCardProps {
  record: RecordEntity;
  className?: string;
}

const formatDate = (value: Date): string =>
  value.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatFieldValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (typeof value === 'number') return value.toLocaleString('fr-FR');
  return String(value);
};

const getFieldIcon = (fieldName: string, value: unknown) => {
  const name = fieldName.toLowerCase();
  
  if (name.includes('email') || name.includes('mail')) {
    return (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.44a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  
  if (name.includes('phone') || name.includes('tel')) {
    return (
      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  }
  
  if (name.includes('url') || name.includes('link') || name.includes('site')) {
    return (
      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  }
  
  if (typeof value === 'number') {
    return (
      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    );
  }
  
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

export const RecordCard: React.FC<RecordCardProps> = ({ record, className = '' }) => {
  const fieldEntries = Object.entries(record.fields);
  const hasFields = fieldEntries.length > 0;

  return (
    <article className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {record.id.slice(-2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {record.id}
            </h3>
            <p className="text-sm text-muted">
              Créé le {formatDate(record.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <span className="badge badge-primary">Actif</span>
        </div>
      </div>

      {hasFields ? (
        <div className="space-y-4">
          {fieldEntries.map(([fieldName, fieldValue]) => (
            <div key={fieldName} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getFieldIcon(fieldName, fieldValue)}
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-700 mb-1">
                  {fieldName}
                </dt>
                <dd className="text-sm text-gray-900 break-words">
                  {formatFieldValue(fieldValue)}
                </dd>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Aucun champ disponible</p>
        </div>
      )}
    </article>
  );
};