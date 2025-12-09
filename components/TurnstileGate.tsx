"use client";

import { useState, useEffect, useCallback } from "react";
import Turnstile from "@/components/Turnstile";

interface TurnstileGateProps {
  children: React.ReactNode;
}

const VERIFICATION_KEY = "manhwaindo_verified";
const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function TurnstileGate({ children }: TurnstileGateProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already verified
  useEffect(() => {
    const checkVerification = () => {
      try {
        const stored = localStorage.getItem(VERIFICATION_KEY);
        if (stored) {
          const { timestamp } = JSON.parse(stored);
          const now = Date.now();
          // Check if verification is still valid (24 hours)
          if (now - timestamp < VERIFICATION_EXPIRY) {
            setIsVerified(true);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(VERIFICATION_KEY);
      }
      setIsVerified(false);
      setIsLoading(false);
    };

    checkVerification();
  }, []);

  const handleVerify = useCallback((token: string) => {
    // Store verification in localStorage with timestamp
    const data = {
      verified: true,
      timestamp: Date.now(),
      token: token.substring(0, 20) + "...", // Store partial token for reference
    };
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(data));
    setIsVerified(true);
  }, []);

  const handleExpire = useCallback(() => {
    // Token expired, but don't force re-verification unless page is refreshed
    console.log("Turnstile token expired");
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show verification gate if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-8 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}></div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative text-center">
              {/* Logo/Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-3">ManhwaIndo</h1>

              <h2 className="text-xl font-semibold text-white mb-2">Verifikasi Keamanan</h2>

              <p className="text-slate-400 mb-8 text-sm leading-relaxed">Untuk melindungi website dari bot dan spam, silakan selesaikan verifikasi di bawah ini.</p>

              {/* Turnstile Widget */}
              <div className="flex justify-center mb-6">
                <Turnstile onVerify={handleVerify} onExpire={handleExpire} theme="dark" />
              </div>

              {/* Info Text */}
              <p className="text-xs text-slate-500">Verifikasi ini hanya dilakukan sekali setiap 24 jam.</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs mt-6">Protected by Cloudflare Turnstile</p>
        </div>
      </div>
    );
  }

  // User is verified, show children
  return <>{children}</>;
}
