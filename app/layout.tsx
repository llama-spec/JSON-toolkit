import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "API Debug Toolkit - Fast JSON Tools for Developers",
  description: "A fast, privacy-first API debug toolkit. Format JSON, convert to TypeScript, validator, diff tool, and more. Processing happens client-side.",
  verification: {
    google: "Sbcd-tx6O9b-8xC6ux0hJkwWHLxDc5PRd6UgFUuMGHc",
  },
  icons: {
    icon: "/bracket-curly.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col relative w-full h-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
