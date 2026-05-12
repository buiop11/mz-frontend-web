import { Inter, Nunito } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: {
    default: "우리결정 (OurPick)",
    template: "%s | 우리결정",
  },
  description:
    "커플·부부를 위한 합리적인 의사결정 — 안건을 모으고 투표로 결정해요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${nunito.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
