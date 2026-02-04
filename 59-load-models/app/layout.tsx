import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R3F Application",
  description: "R3F Application by Yoo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
