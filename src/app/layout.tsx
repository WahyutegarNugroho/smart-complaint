import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Smart Complaint - Pesona Serpong",
    template: "%s | Smart Complaint"
  },
  description: "Platform resmi pengaduan warga Perumahan Pesona Serpong. Ciptakan lingkungan yang lebih baik dengan pelaporan yang transparan dan cepat.",
  keywords: ["pengaduan", "warga", "pesona serpong", "rt rw", "laporan", "keamanan", "kebersihan"],
  authors: [{ name: "Smart Complaint Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
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
  maximumScale: 5,
  themeColor: "#101010",
};

import NetworkStatusBanner from "@/components/NetworkStatusBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <NetworkStatusBanner />
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(e){console.error('SW registration failed:',e)})})}`}
        </Script>
      </body>
    </html>
  );
}
