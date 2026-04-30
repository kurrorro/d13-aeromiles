import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AeroMiles",
  description: "Sistem Manajemen Miles Penerbangan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans antialiased text-[var(--title)] bg-[var(--bg-subtle)]`}>
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen bg-bg-subtle pb-12">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}