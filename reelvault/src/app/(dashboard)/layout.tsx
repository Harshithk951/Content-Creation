import React from "react";
import { WebsiteNav } from "@/components/website-nav";
import { WebsiteFooter } from "@/components/website-footer";
import { ToastProvider } from "@/components/toast";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-orange-500 selection:text-white">
        {/* Top Sticky Website Navigation */}
        <WebsiteNav />

        {/* Main Website Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>

        {/* Website Public Footer */}
        <WebsiteFooter />
      </div>
    </ToastProvider>
  );
}
