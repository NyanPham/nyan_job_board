import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@/services/clerk/components/ClerkProvider";
import { Toaster } from "@/components/ui/sonner";
import { UploadThingSSR } from "@/services/uploadthing/components/UploadThingSSR";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nyan Job Board",
  description:
    "A job board platform built with Next.js, Supabase, Clerk, and Inngest.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://nyan-job-board.vercel.app"),
  openGraph: {
    title: "Nyan Job Board",
    description:
      "A job board platform built with Next.js, Supabase, Clerk, and Inngest.",
    type: "website",
    url: "https://nyan-job-board.vercel.app",
    images: "/og-image.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
          <UploadThingSSR />
        </body>
      </html>
    </ClerkProvider>
  );
}
