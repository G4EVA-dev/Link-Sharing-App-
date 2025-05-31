import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LinkProfileProvider } from "@/contexts/LinkProfileContext";
import AuthStateMonitor from "@/components/AuthStateMonitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShowFolio",
  description: "Show yourself to the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LinkProfileProvider>
            <AuthStateMonitor />
            {children}
          </LinkProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
