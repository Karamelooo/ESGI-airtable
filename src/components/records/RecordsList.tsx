'use client';

import React from 'react';
import { RecordEntity } from '@/domain/records/Record';
import { RecordCard } from './RecordCard';
import { LoadingSkeleton } from '../ui/LoadingSpinner';

interface RecordsListProps {
  records: RecordEntity[];
  isLoading?: boolean;
  className?: string;
}

const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucun enregistrement trouvé
    </h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      Aucun enregistrement n'a été trouvé dans votre base Airtable pour le moment. 
      Vérifiez votre configuration ou ajoutez des données à votre table.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="btn-primary mt-6"
    >
      Actualiser
    </button>
  </div>
);

const RecordsHeader: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Enregistrements
      </h2>
      <p className="text-muted mt-1">
        {count} {count === 1 ? 'enregistrement trouvé' : 'enregistrements trouvés'}
      </p>
    </div>
    
    <div className="flex items-center space-x-3">
      {/* Indicateur de statut */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
        <span className="text-sm text-gray-600">Connecté à Airtable</span>
      </div>
    </div>
  </div>
);

export const RecordsList: React.FC<RecordsListProps> = ({ 
  records, 
  isLoading = false, 
  className = '' 
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-32"></div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <RecordsHeader count={records.length} />
      
      <div className="grid gap-6">
        {records.map((record) => (
          <RecordCard 
            key={record.id} 
            record={record}
            className="animate-fade-in"
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-white border rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
          </span>
          <span className="badge badge-primary">
            Total : {records.length} enregistrement{records.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};