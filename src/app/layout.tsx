import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keven William | Portfólio",
  description: "Desenvolvedor & Criativo. Explore meus projetos e histórias.",
  manifest: "/manifest.json",
  icons: {
    icon: "/profile.jpg",
    apple: "/profile.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

import { PersonaProvider } from "@/context/PersonaContext";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PersonaProvider>
          {children}
          <Footer />
        </PersonaProvider>
      </body>
    </html>
  );
}
