import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
  maximumScale: 2,
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`}
        </Script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(e){console.error('SW registration failed:',e)})})}`}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

