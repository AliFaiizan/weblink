import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import {ClerkProvider, RedirectToSignIn, SignedIn, SignedOut} from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme.provider";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weblink",
  description: "All in one agency management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}  
          </ThemeProvider>  
        </ClerkProvider>
      </body>
    </html>
  );
}
