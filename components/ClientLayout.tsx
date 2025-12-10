"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TurnstileGate from "@/components/TurnstileGate";
import PopupModal from "@/components/PopupModal";

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
