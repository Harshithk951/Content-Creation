import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "100 Days of Free AI — Harshith Kumar & Claude",
  description:
    "Daily free AI video masterclasses, open-source code workflows, and verified setup guides. Zero subscriptions required.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "100 Days Free AI",
  },
  icons: {
    icon: "/avatars/harshith_official.jpg",
    apple: "/avatars/harshith_official.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF8F5] text-stone-900 antialiased font-sans min-h-screen selection:bg-orange-500 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
