import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Lato } from "next/font/google";
import "./globals.css";
// 1. IMPORT THE AUTH PROVIDER
// Try this if "@/" doesn't work
import { AuthProvider } from "../components/AuthProvider";
import { ProspectusProvider } from "@/context/ProspectusContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Dindigul AR Biryani | International Franchise Portal",
  description: "Join the legacy of Dindigul AR Biryani. 18+ years of excellence. Explore exclusive franchise opportunities in the global culinary ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${cinzel.variable} ${lato.variable} font-sans antialiased bg-brand-ivory text-brand-burgundy`}
      >
        {/* 2. WRAP THE APP WITH BOTH PROVIDERS */}
        <ProspectusProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ProspectusProvider>
      </body>
    </html>
  );
}