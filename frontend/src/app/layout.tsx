import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import FormbricksProvider from "@/app/formbricks";
import Dashboard from "@/components/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster as RHToaster } from "react-hot-toast";
import Providers from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CodeStash",
  description: "The best solution for keeping code snippets",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background p-4 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <FormbricksProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextUIProvider>
            <Providers>
              <Dashboard>
                <main className="h-full w-full">{children}</main>
              </Dashboard>
            </Providers>
            <Toaster />
            <RHToaster />
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
