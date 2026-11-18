import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SmoothScrollHandler, PageTransitionWrapper } from "@/components/SmoothNavigation";

export const metadata: Metadata = {
  title: "ringkasnya.id — Baca Intinya, Praktikkan Ilmunya",
  description:
    "Platform ringkasan buku best-seller dunia dalam Bahasa Indonesia. Dilengkapi Mode Kilat 6–10 Menit, Mode Mendalam 20–30 Menit, dan Action Checklist interaktif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col antialiased">
        <SmoothScrollHandler />
        <Navbar />
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
        <Footer />
      </body>
    </html>
  );
}
