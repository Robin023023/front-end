import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title:"Blood-Donation",
  description: "Blood donnet site..",
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

