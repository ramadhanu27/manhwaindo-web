"use client";

import { useState } from "react";
import Link from "next/link";

interface Announcement {
  id: string;
  type: "info" | "warning" | "success" | "new";
  title: string;
  message: string;
  link?: string;
  linkText?: string;
}

const announcements: Announcement[] = [
  {
    id: "1",
    type: "new",
    title: "🎉 Fitur Baru!",
    message: "Sekarang kamu bisa download chapter dalam format PDF dan ZIP. Coba fitur download baru kami!",
    link: "/download",
    linkText: "Coba Sekarang",
  },
  {
    id: "2",
    type: "info",
    title: "📢 Pengumuman",
    message: "Website ManhwaIndo telah diperbarui dengan tampilan baru yang lebih modern dan responsif.",
  },
];

export default function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || announcements.length === 0) return null;

  const announcement = announcements[currentIndex];

  const typeStyles = {
    info: "from-blue-600/20 to-blue-800/20 border-blue-500/30",
    warning: "from-yellow-600/20 to-orange-800/20 border-yellow-500/30",
    success: "from-green-600/20 to-emerald-800/20 border-green-500/30",
    new: "from-purple-600/20 to-pink-800/20 border-purple-500/30",
  };

  const iconColors = {
    info: "text-blue-400",
    warning: "text-yellow-400",
    success: "text-green-400",
    new: "text-purple-400",
  };

  const buttonStyles = {
    info: "bg-blue-500 hover:bg-blue-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    success: "bg-green-500 hover:bg-green-600",
    new: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${typeStyles[announcement.type]} border backdrop-blur-sm mb-6`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-16 translate-y-16"></div>
      </div>

      <div className="relative px-4 py-4 md:px-6 md:py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Content */}
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div className={`flex-shrink-0 mt-0.5 ${iconColors[announcement.type]}`}>
              {announcement.type === "info" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {announcement.type === "warning" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {announcement.type === "success" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {announcement.type === "new" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm md:text-base">{announcement.title}</p>
              <p className="text-gray-300 text-sm mt-0.5">{announcement.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pl-9 md:pl-0">
            {announcement.link && (
              <Link href={announcement.link} className={`px-4 py-2 ${buttonStyles[announcement.type]} text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap`}>
                {announcement.linkText || "Lihat"}
              </Link>
            )}

            {/* Navigation dots if multiple announcements */}
            {announcements.length > 1 && (
              <div className="flex gap-1.5">
                {announcements.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"}`} />
                ))}
              </div>
            )}

            {/* Close button */}
            <button onClick={() => setIsVisible(false)} className="p-1 text-gray-400 hover:text-white transition-colors" aria-label="Tutup pengumuman">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
