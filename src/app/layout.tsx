import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "F1 Command Center", template: "%s | F1 Command Center" },
  description: "Live Formula 1 race timing, championship standings, driver profiles, team info, and full historical records — all in one place.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "F1 Hub",
  },
  openGraph: {
    title: "F1 Command Center",
    description: "Your ultimate Formula 1 companion",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E10600",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ServiceWorker />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
