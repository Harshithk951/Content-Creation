import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "ReelVault — 100 Days of Free AI | Personal Video Library",
  description:
    "Production video library for Harshith and Claude's 100 Days of Free AI Instagram educational Reel series. Store, preview, and download completed 9:16 videos.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0d] text-zinc-100 antialiased font-sans min-h-screen selection:bg-brand/30 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
