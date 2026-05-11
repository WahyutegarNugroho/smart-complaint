import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Complaint - Solusi Pengaduan Masyarakat Modern",
  description: "Laporkan masalah di lingkungan Anda dengan cepat, mudah, dan transparan melalui Smart Complaint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased font-sans text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
