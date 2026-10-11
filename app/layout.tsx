
import "./globals.css";
import StoreHeader from "@/components/StoreHeader";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "JL PlayStore",
  description: "Personal Android app store",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreHeader />
        {children}
      </body>
    </html>
  );
}
