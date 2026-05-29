"use client";

import { useEffect, useState } from "react";

export default function AdBanner({ position = "content" }) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`/api/ads?position=${position}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAds(json.data);
      })
      .catch(() => {});
  }, [position]);

  if (ads.length === 0) return null;

  return (
    <div className="ad-banner w-full py-6 space-y-4">
      {ads.map((ad) => (
        <div key={ad.id} className="ad-slot">
          {ad.type === "image" && ad.imageUrl ? (
            <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer nofollow">
              <img src={ad.imageUrl} alt={ad.name} className="w-full h-auto block rounded-lg" loading="lazy" />
            </a>
          ) : ad.type === "script" && ad.content ? (
            <div className="ad-script-content grid grid-cols-2 gap-3" dangerouslySetInnerHTML={{ __html: ad.content }} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
