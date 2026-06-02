import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bodega Project",
  description: "A decentralized, hyper-local food grid for Newark.",
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
