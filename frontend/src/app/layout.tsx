import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextUIProvider, useUser } from "@nextui-org/react";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import GenericDashboard from "@/components/GenericDashboard";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CodeStash",
  description: "The best solution for keeping code snippets",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NextUIProvider>
              <GenericDashboard>
                <main>{children}</main>
              </GenericDashboard>
            </NextUIProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
