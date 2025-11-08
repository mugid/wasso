import type { Metadata } from "next";
import { Suspense } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wasso - a tool for brainstorming and design",
  description: "Wasso is a tool that helps you brainstorm faster and design better.",
  icons: {
    icon: "/icon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased pt-[70px]`}
      >
        <Providers>
          <Suspense fallback={<header className="fixed top-0 w-full z-30 backdrop-blur-md flex items-center justify-between py-4 px-10 border-b-2 border-b-accent" />}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
