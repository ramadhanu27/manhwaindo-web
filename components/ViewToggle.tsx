'use client';

import { useState } from 'react';

interface ViewToggleProps {
  onViewChange?: (view: 'grid' | 'list' | 'compact') => void;
}

export default function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list' | 'compact'>('grid');

  const handleViewChange = (newView: 'grid' | 'list' | 'compact') => {
    setView(newView);
    onViewChange?.(newView);
  };

  return (
    <div className="flex gap-2">
      {/* Grid View Button */}
      <button
        onClick={() => handleViewChange('grid')}
        className={`p-2 rounded transition-colors ${
          view === 'grid'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
        }`}
        title="Grid View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
        </svg>
      </button>

      {/* List View Button */}
      <button
        onClick={() => handleViewChange('list')}
        className={`p-2 rounded transition-colors ${
          view === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
        }`}
        title="List View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
        </svg>
      </button>

      {/* Compact View Button */}
      <button
        onClick={() => handleViewChange('compact')}
        className={`p-2 rounded transition-colors ${
          view === 'compact'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
        }`}
        title="Compact View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h2v6h-2V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h2v6h-2v-6zM3 19h6v2H3v-2zm8 0h6v2h-6v-2zm8 0h2v2h-2v-2z" />
        </svg>
      </button>
    </div>
  );
}
