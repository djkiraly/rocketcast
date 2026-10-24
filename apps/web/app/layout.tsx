import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BRAND } from "@rocketcast/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: BRAND.productName,
    template: `%s · ${BRAND.productName}`,
  },
  description: BRAND.tagline,
  applicationName: BRAND.productName,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
