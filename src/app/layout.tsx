import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://vitalrp.net/staffyearbook",
  ),
  title: "Vital RP Staff Yearbook | The People Behind the City",
  description:
    "Celebrate the characters, stories, and staff who keep Vital RP alive. Vote, suggest categories, and discover this year's staff legends.",
  openGraph: {
    title: "Vital RP Staff Yearbook 2026",
    description: "The people behind the city.",
    type: "website",
    images: [{ url: "/staffyearbook/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vital RP Staff Yearbook 2026",
    description: "The people behind the city.",
    images: ["/staffyearbook/og.png"],
  },
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
