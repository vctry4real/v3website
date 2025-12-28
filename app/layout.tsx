import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // If you want to use Inter
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"; // If exists, else comment out or remove

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "vctry4real",
  description: "Full-stack software engineer with 4+ years of experience building scalable web applications and innovative digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg-dark min-h-screen text-text antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
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
