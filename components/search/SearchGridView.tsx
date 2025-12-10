"use client";

import { useState, useEffect } from "react";
import SeriesCard from "@/components/series/SeriesCard";
import { getSeriesDetail } from "@/lib/api";

interface SearchGridViewProps {
  results: any[];
}

export default function SearchGridView({ results }: SearchGridViewProps) {
  const [seriesDetails, setSeriesDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchDetails = async () => {
      const details: Record<string, any> = {};
      // Only fetch details for visible items (first 15) to avoid rate limiting
      const visibleResults = results.slice(0, 15);

      for (const series of visibleResults) {
        if (!seriesDetails[series.slug]) {
          try {
            const result = await getSeriesDetail(series.slug);
            if (result.success && result.data) {
              details[series.slug] = result.data;
            }
          } catch (error) {
            // Silently fail - use fallback data
            console.debug(`Could not fetch details for ${series.slug}`);
          }
          // Add small delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      setSeriesDetails((prev) => ({ ...prev, ...details }));
    };

    if (results.length > 0) {
      fetchDetails();
    }
  }, [results]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
      {results.map((series: any) => {
        const detail = seriesDetails[series.slug];
        const type = detail?.type || series.type;

        return <SeriesCard key={series.slug} title={series.title} slug={series.slug} image={series.image} type={type} rating={series.rating} latestChapter={series.chapters?.[0]?.title} chapters={series.chapters} />;
      })}
    </div>
  );
}
