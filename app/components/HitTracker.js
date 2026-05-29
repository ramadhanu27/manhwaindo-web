"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          referrer: document.referrer || "",
        }),
      }).catch(() => {});
    }, 500); // Small delay to avoid tracking bounces

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This component renders nothing
}
