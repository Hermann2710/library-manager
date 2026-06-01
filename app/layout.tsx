import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/query-provider";

// Load the Inter font with a CSS variable for Tailwind integration
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

/**
 * Global SEO and document metadata.
 */
export const metadata: Metadata = {
  title: "BiblioGest CM",
  description: "Gestion de librairie et bibliotheque au Cameroun : catalogue, stock, prets, membres, staff et suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body className="antialiased">
        {/* ThemeProvider: Handles dark/light mode switching 
        */}
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system">

          {/* QueryProvider: Enables TanStack Query for efficient data fetching and caching 
          */}
          <QueryProvider>

            {/* SessionProvider: Exposes the Next-Auth session context to the entire app 
            */}
            <SessionProvider>

              {/* TooltipProvider: Radix UI wrapper for accessible tooltips 
              */}
              <TooltipProvider>
                {children}

                {/* Toaster: Global notification system (Sonner) 
                */}
                <Toaster toastOptions={{
                  closeButton: true,
                  duration: 3000
                }} />
              </TooltipProvider>

            </SessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
