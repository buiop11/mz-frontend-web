import { Funnel_Sans, Inter } from "next/font/google";

import "./globals.css";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-funnel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Matjzing Market.",
    template: "%s | Matjzing Market.",
  },
  description: "맛찡 마켓 — Cute & Simple.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${funnelSans.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
