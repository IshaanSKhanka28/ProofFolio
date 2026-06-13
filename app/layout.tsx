import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

// Fraunces: a high-contrast serif with character, used for big display names.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

// JetBrains Mono: a developer-flavored monospace, used for body + metadata.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

// Sora: a geometric sans used only on the neon 3D portfolio (/u/<username>).
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ProofFolio",
  description: "Auto-generated developer portfolios from a GitHub username.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jetbrainsMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
