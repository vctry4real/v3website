import type { Metadata } from "next";
import Script from "next/script";
// import { Inter } from "next/font/google"; 
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Toaster } from "react-hot-toast";
import { JsonLd } from "@/components/seo/JsonLd";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vctry4real.com'), // Replace with actual domain in production
  title: {
    default: "Victory Johnson | Full-Stack Software Engineer",
    template: "%s | Victory Johnson",
  },
  description: "Full-stack software engineer with 4+ years of experience building scalable web applications, custom software solutions, and innovative digital products.",
  keywords: ["Software Engineer", "Custom Web Application Development", "Full Stack Developer", "React", "Next.js", "Node.js", "AI Solutions"],
  authors: [{ name: "Victory Johnson" }],
  creator: "Victory Johnson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vctry4real.com",
    title: "Victory Johnson | Full-Stack Software Engineer",
    description: "Building scalable web applications and innovative digital solutions.",
    siteName: "Victory Johnson Portfolio",
    images: [
      {
        url: '/assets/Portfolio_image.png',
        width: 1200,
        height: 630,
        alt: 'Victory Johnson Portfolio',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Victory Johnson | Full-Stack Software Engineer",
    description: "Building scalable web applications and innovative digital solutions.",
    creator: "@vctry4real", // Update if different
    images: ['/assets/Portfolio_image.png'],
  },
  icons: {
    icon: '/my_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg-dark min-h-screen text-text antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z8QW2ELPPB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z8QW2ELPPB');
          `}
        </Script>
        <JsonLd />
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </body>
    </html>
  );
}
