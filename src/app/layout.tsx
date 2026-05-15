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
  title: {
    default: "Smart Complaint - Pesona Serpong",
    template: "%s | Smart Complaint"
  },
  description: "Platform resmi pengaduan warga Perumahan Pesona Serpong. Ciptakan lingkungan yang lebih baik dengan pelaporan yang transparan dan cepat.",
  keywords: ["pengaduan", "warga", "pesona serpong", "rt rw", "laporan", "keamanan", "kebersihan"],
  authors: [{ name: "Smart Complaint Team" }],
  openGraph: {
    title: "Smart Complaint - Pesona Serpong",
    description: "Laporkan masalah lingkungan dengan mudah dan pantau progresnya secara real-time.",
    url: "https://smart-complaint-app.vercel.app",
    siteName: "Smart Complaint",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
