import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <PersonaProvider>
            {children}
            <Footer />
          </PersonaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
