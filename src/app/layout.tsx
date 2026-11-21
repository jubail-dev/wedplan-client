import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/shared/toaster";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Wedding Planning Made Beautiful",
    template: "%s | WedPlan",
  },
  description:
    "Discover trusted wedding vendors, explore beautiful services, and plan your perfect wedding with WedPlan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <Suspense fallback="loading...">

          <Navbar />
         </Suspense>
        {children}
        <Toaster />
         <Footer />
        </body>
    </html>
  );
}
