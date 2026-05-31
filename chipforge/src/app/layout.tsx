import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "ChipForge — Hardware for Engineers",
  description:
    "ESP32, STM32, Arduino, Raspberry Pi, and 3,200+ SKUs. Hand-picked silicon shipped fast across India.",
  keywords: ["ESP32", "STM32", "microcontroller", "Arduino", "hardware store", "India"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
