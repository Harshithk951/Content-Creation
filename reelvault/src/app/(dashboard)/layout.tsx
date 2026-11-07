import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] bg-[#07080c] text-zinc-100 selection:bg-brand selection:text-white relative">
      {/* Ambient background mesh glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/[0.04] blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[140px]" />
      </div>

      {/* Desktop Sidebar (Fixed, responsive w-64 to w-72) */}
      <div className="hidden md:block shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Dock & Drawer */}
      <MobileNav />
    </div>
  );
}
