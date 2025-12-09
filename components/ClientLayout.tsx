"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TurnstileGate from "@/components/TurnstileGate";

interface ClientLayoutProps {
  children: ReactNode;
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
