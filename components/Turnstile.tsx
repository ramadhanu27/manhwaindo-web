"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// Cloudflare Turnstile test keys (for development)
// Always passes: 1x00000000000000000000AA
// Always blocks: 2x00000000000000000000AB
// Forces interactive: 3x00000000000000000000FF

// Production site key
const PRODUCTION_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACEUW7xPCpPb8yS5";

// Use test key for localhost, production key otherwise
const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const TURNSTILE_SITE_KEY = isLocalhost ? "1x00000000000000000000AA" : PRODUCTION_SITE_KEY;

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
}

export default function Turnstile({ onVerify, onExpire, onError, theme = "dark", size = "normal", className = "" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!containerRef.current) {
      console.error("Turnstile: Container ref not available");
      return;
    }

    if (!window.turnstile) {
      console.error("Turnstile: window.turnstile not available");
      return;
    }

    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // Widget might already be removed
      }
    }

    try {
      // Render new widget
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          setIsLoading(false);
          onVerify(token);
        },
        "expired-callback": () => {
          setIsLoading(false);
          onExpire?.();
        },
        "error-callback": () => {
          setIsLoading(false);
          setError("Verification failed. Please refresh the page.");
          onError?.();
        },
        theme,
        size,
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Turnstile render error:", err);
      setError("Failed to load verification widget");
      setIsLoading(false);
    }
  }, [onVerify, onExpire, onError, theme, size]);

  useEffect(() => {
    // Check if script is already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Set callback for when script loads
    window.onTurnstileLoad = () => {
      console.log("Turnstile script loaded");
      renderWidget();
    };

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="turnstile"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setError("Failed to load Cloudflare script");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Widget might already be removed
        }
      }
    };
  }, [renderWidget]);

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-slate-400">Loading verification...</span>
        </div>
      )}
      {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">{error}</div>}
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}

// Hook for easy usage
export function useTurnstileVerification() {
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/turnstile-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  };

  return { verifyToken };
}
