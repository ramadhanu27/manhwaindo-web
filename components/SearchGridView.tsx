'use client';

import { useState, useEffect } from 'react';
import SeriesCard from '@/components/SeriesCard';
import { getSeriesDetail } from '@/lib/api';

interface SearchGridViewProps {
  results: any[];
}

export default function SearchGridView({ results }: SearchGridViewProps) {
  const [seriesDetails, setSeriesDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchDetails = async () => {
      const details: Record<string, any> = {};
      // Fetch details for all results, not just first 20
      for (const series of results) {
        if (!seriesDetails[series.slug]) {
          try {
            const result = await getSeriesDetail(series.slug);
            if (result.success && result.data) {
              details[series.slug] = result.data;
            }
          } catch (error) {
            console.error(`Failed to fetch details for ${series.slug}:`, error);
          }
        }
      }
      setSeriesDetails((prev) => ({ ...prev, ...details }));
    };

    if (results.length > 0) {
      fetchDetails();
    }
  }, [results]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
      {results.map((series: any) => {
        const detail = seriesDetails[series.slug];
        const type = detail?.type || series.type;

        return (
          <SeriesCard
            key={series.slug}
            title={series.title}
            slug={series.slug}
            image={series.image}
            type={type}
            rating={series.rating}
            latestChapter={series.chapters?.[0]?.title}
            chapters={series.chapters}
          />
        );
      })}
    </div>
  );
}
