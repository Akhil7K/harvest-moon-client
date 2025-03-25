import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasoraj",
  description: "Rasoraj: Bringing Delta Food to your Doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
