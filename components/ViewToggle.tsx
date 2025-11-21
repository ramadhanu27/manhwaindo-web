'use client';

import { useState } from 'react';

interface ViewToggleProps {
  onViewChange?: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleViewChange = (newView: 'grid' | 'list') => {
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
    </div>
  );
}
