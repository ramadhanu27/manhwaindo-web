"use client";

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TurnstileGate from "@/components/security/TurnstileGate";
import PopupModal from "@/components/modal/PopupModal";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TurnstileGate>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <PopupModal />
    </TurnstileGate>
  );
}
