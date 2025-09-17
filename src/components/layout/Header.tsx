'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "ESGI Airtable Workspace",
  subtitle = "Interface Next.js combinant frontend et backend pour consulter une base Airtable."
}) => {
  return (
    <header className="header-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                AT
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              <p className="text-sm opacity-80 text-white">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="btn-ghost text-sm"
              onClick={() => window.location.reload()}
            >
              Actualiser
            </button>
          </div>
        </div>
        <div className="pb-4 md:hidden">
          <h1 className="text-lg font-semibold text-white mb-1">{title}</h1>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};