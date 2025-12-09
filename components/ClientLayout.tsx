"use client";

import TurnstileGate from "@/components/TurnstileGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TurnstileGate>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </TurnstileGate>
  );
}
