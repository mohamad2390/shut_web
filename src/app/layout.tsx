import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: { default: "SHUT", template: "%s | SHUT" },
  description: "عکاس، فیلم‌بردار، ادیتور و مکان عکاسی مناسب پروژه‌ات را پیدا کن.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <SiteHeader />
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
