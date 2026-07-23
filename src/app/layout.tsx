import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vital RP Staff Yearbook",
  description:
    "Celebrate the characters and staff who make Vital RP unforgettable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
