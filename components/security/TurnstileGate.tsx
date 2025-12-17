"use client";

import { useState, useEffect, useCallback } from "react";
import Turnstile from "@/components/security/Turnstile";

interface TurnstileGateProps {
  children: React.ReactNode;
}

const VERIFICATION_KEY = "manhwaindo_verified";
const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function TurnstileGate({ children }: TurnstileGateProps) {
  const [isVerified, setIsVerified] = useState<boolean>(false);

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
            return;
          }
        }
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(VERIFICATION_KEY);
      }
      // If not verified, trigger verification but don't block UI
      setIsVerified(false);
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
    console.log("✅ Turnstile verification successful");
  }, []);

  const handleExpire = useCallback(() => {
    console.log("⚠️ Turnstile token expired");
    // Don't force re-verification, just log
  }, []);

  const handleError = useCallback(() => {
    console.error("❌ Turnstile verification error");
    // Still allow access even if verification fails
    setIsVerified(true);
  }, []);

  return (
    <>
      {/* Invisible Turnstile Widget - Runs in background */}
      {!isVerified && (
        <div className="fixed bottom-0 right-0 opacity-0 pointer-events-none" style={{ width: 0, height: 0, overflow: "hidden" }}>
          <Turnstile onVerify={handleVerify} onExpire={handleExpire} onError={handleError} theme="dark" size="flexible" appearance="execute" />
        </div>
      )}

      {/* Main Content - Always visible, no blocking */}
      {children}
    </>
  );
}
