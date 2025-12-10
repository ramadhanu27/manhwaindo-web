"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PopupConfig {
  enabled: boolean;
  type: string;
  title: string;
  message: string;
  image?: string | null;
  buttonText: string;
  buttonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  showOnce: boolean;
  delay: number;
  backdrop: boolean;
  closable: boolean;
  position: "center" | "bottom" | "top";
  theme: "default" | "success" | "warning" | "info";
}

export default function PopupModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<PopupConfig | null>(null);

  useEffect(() => {
    const fetchPopupConfig = async () => {
      try {
        const res = await fetch("/api/popup", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!data.enabled) return;

        // Check if popup was already shown (for showOnce feature)
        if (data.showOnce) {
          const popupShown = localStorage.getItem("popup_shown");
          if (popupShown) return;
        }

        setConfig(data);

        // Show popup after delay
        setTimeout(() => {
          setIsVisible(true);
          if (data.showOnce) {
            localStorage.setItem("popup_shown", "true");
          }
        }, data.delay || 2000);
      } catch (error) {
        console.error("Error fetching popup config:", error);
      }
    };

    fetchPopupConfig();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePrimaryClick = () => {
    if (!config?.buttonLink) {
      handleClose();
    }
  };

  if (!isVisible || !config) return null;

  const themeStyles = {
    default: "from-green-500 to-emerald-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-orange-500 to-red-600",
    info: "from-blue-500 to-indigo-600",
  };

  const positionStyles = {
    center: "items-center justify-center",
    bottom: "items-end justify-center pb-8",
    top: "items-start justify-center pt-20",
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex ${positionStyles[config.position]} p-4`}>
      {/* Backdrop */}
      {config.backdrop && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={config.closable ? handleClose : undefined} />}

      {/* Modal */}
      <div className="relative bg-[#1a1f2e] rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        {config.closable && (
          <button onClick={handleClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header gradient */}
        <div className={`h-2 bg-gradient-to-r ${themeStyles[config.theme]} rounded-t-2xl`} />

        {/* Content */}
        <div className="p-6 pt-8 text-center">
          {/* Image */}
          {config.image && (
            <div className="mb-4">
              <img src={config.image} alt="" className="w-24 h-24 mx-auto rounded-xl object-cover" />
            </div>
          )}

          {/* Icon if no image */}
          {!config.image && (
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${themeStyles[config.theme]} rounded-2xl flex items-center justify-center`}>
              {config.type === "welcome" && <span className="text-3xl">👋</span>}
              {config.type === "announcement" && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              )}
              {config.type === "promo" && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              )}
              {config.type === "newsletter" && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-3">{config.title}</h2>

          {/* Message */}
          <p className="text-gray-400 mb-6">{config.message}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {config.buttonLink ? (
              <Link href={config.buttonLink} onClick={handleClose} className={`px-6 py-3 bg-gradient-to-r ${themeStyles[config.theme]} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}>
                {config.buttonText}
              </Link>
            ) : (
              <button onClick={handlePrimaryClick} className={`px-6 py-3 bg-gradient-to-r ${themeStyles[config.theme]} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}>
                {config.buttonText}
              </button>
            )}

            {config.secondaryButtonText &&
              (config.secondaryButtonLink ? (
                <Link href={config.secondaryButtonLink} onClick={handleClose} className="px-6 py-3 bg-[#2a3142] text-gray-300 font-semibold rounded-xl hover:bg-[#3a4152] transition-colors">
                  {config.secondaryButtonText}
                </Link>
              ) : (
                <button onClick={handleClose} className="px-6 py-3 bg-[#2a3142] text-gray-300 font-semibold rounded-xl hover:bg-[#3a4152] transition-colors">
                  {config.secondaryButtonText}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
