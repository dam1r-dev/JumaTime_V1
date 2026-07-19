import type { Metadata } from "next";
import { Noto_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Jumma Time",
  description: "Платформа для мечетей: пятничные хутбы на казахском, русском и английском",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="kk"
      suppressHydrationWarning
      className={`${notoSans.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
