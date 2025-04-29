import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { SessionInitializer } from "@/components/session/session-initializer";

export const metadata: Metadata = {
  title: "Rasoraj",
  description: "Rasoraj: Bringing Delta Food to your Doorstep",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  console.log(session);
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`antialiased`}
        >
          <SessionInitializer />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
