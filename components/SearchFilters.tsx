'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFiltersProps {
  order?: string;
  type?: string;
  status?: string;
  genre?: string;
  title?: string;
}

export default function SearchFilters({ order, type, status, genre, title }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [titleInput, setTitleInput] = useState(title || '');
  const [genreInput, setGenreInput] = useState(genre || '');

  const buildQueryString = (newParams: any) => {
    const params = new URLSearchParams(searchParams);
    
    if (newParams.title !== undefined) {
      if (newParams.title) params.set('title', newParams.title);
      else params.delete('title');
    }
    if (newParams.order !== undefined) {
      if (newParams.order) params.set('order', newParams.order);
      else params.delete('order');
    }
    if (newParams.type !== undefined) {
      if (newParams.type) params.set('type', newParams.type);
      else params.delete('type');
    }
    if (newParams.status !== undefined) {
      if (newParams.status) params.set('status', newParams.status);
      else params.delete('status');
    }
    if (newParams.genre !== undefined) {
      if (newParams.genre) params.set('genre', newParams.genre);
      else params.delete('genre');
    }
    
    // Reset to page 1 when filter changes
    if (newParams.page !== undefined) {
      params.set('page', newParams.page);
    } else {
      params.set('page', '1');
    }
    
    return `?${params.toString()}`;
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams: any = {};
    newParams[filterType] = value;
    router.push(`/search${buildQueryString(newParams)}`);
  };

  const handleTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newTitle = (e.target as HTMLInputElement).value;
      handleFilterChange('title', newTitle);
    }
  };

  const handleGenreChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newGenre = (e.target as HTMLInputElement).value;
      handleFilterChange('genre', newGenre);
    }
  };

  return (
    <div className="mb-8 p-4 bg-card border border-border rounded-lg">
      <h3 className="font-semibold mb-4 text-white">Filters</h3>
      <div className="grid grid-cols-1 gap-4">
        {/* Order Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-white">Order By</label>
          <select 
            value={order || ''}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm cursor-pointer text-white hover:border-slate-600 transition-colors"
          >
            <option value="" className="bg-slate-900 text-white">All</option>
            <option value="update" className="bg-slate-900 text-white">Latest Update</option>
            <option value="popular" className="bg-slate-900 text-white">Popular</option>
            <option value="latest" className="bg-slate-900 text-white">Latest</option>
            <option value="title" className="bg-slate-900 text-white">Title</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-white">Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value=""
                checked={!type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="cursor-pointer"
              />
              <span className="text-sm text-white">All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="manhwa"
                checked={type === 'manhwa'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="cursor-pointer"
              />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-purple-600">Manhwa</span>
              <span className="text-xs text-slate-400">(Korean)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="manga"
                checked={type === 'manga'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="cursor-pointer"
              />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-blue-600">Manga</span>
              <span className="text-xs text-slate-400">(Japanese)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="manhua"
                checked={type === 'manhua'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="cursor-pointer"
              />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-orange-600">Manhua</span>
              <span className="text-xs text-slate-400">(Chinese)</span>
            </label>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-white">Status</label>
          <select 
            value={status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm cursor-pointer text-white hover:border-slate-600 transition-colors"
          >
            <option value="" className="bg-slate-900 text-white">All</option>
            <option value="ongoing" className="bg-slate-900 text-white">Ongoing</option>
            <option value="completed" className="bg-slate-900 text-white">Completed</option>
            <option value="hiatus" className="bg-slate-900 text-white">Hiatus</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-white">Genre</label>
          <input 
            type="text"
            value={genreInput}
            placeholder="e.g. action, romance"
            onKeyDown={handleGenreChange}
            onChange={(e) => setGenreInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-400 hover:border-slate-600 transition-colors focus:outline-none focus:border-primary"
          />
        </div>

        {/* Search Title */}
        <div>
          <label className="text-sm font-medium block mb-2 text-white">Search Title</label>
          <input 
            type="text"
            value={titleInput}
            placeholder="e.g. solo leveling"
            onKeyDown={handleTitleChange}
            onChange={(e) => setTitleInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-400 hover:border-slate-600 transition-colors focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
