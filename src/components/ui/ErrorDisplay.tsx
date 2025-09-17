'use client';

import React from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Erreur de configuration Airtable",
  message,
  details,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="max-w-md w-full mx-4">
        <div className="card p-8 text-center border-red-200 bg-red-50">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-4">
            {title}
          </h2>
          
          <p className="text-red-700 mb-4 leading-relaxed">
            {message}
          </p>
          
          {details && (
            <p className="text-sm text-red-600 mb-6 bg-red-100 p-3 rounded-lg">
              {details}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button 
                onClick={onRetry}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Réessayer
              </button>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};