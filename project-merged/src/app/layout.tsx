import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

// Debug logging
const debug = (...args: any[]) => console.log('[Font Debug]', ...args);

debug('Initializing font configuration...');

// Configure Inter font with all weights and display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

debug('Font configuration complete:', {
  variable: inter.variable,
  className: inter.className,
});

export const metadata: Metadata = {
  title: "Scailer - Business Scaling Service",
  description: "Scale your business with precision using Scailer's innovative solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  debug('Rendering RootLayout');
  
  return (
    <html lang="en" className={cn("antialiased", inter.variable)}>
      <body className={cn(
        inter.className,
        "min-h-screen bg-scailer-dark text-white",
        "flex flex-col antialiased",
        "selection:bg-scailer-green selection:text-white",
        "relative" // Add relative positioning for proper stacking context
      )}>
        {/* Main content wrapper */}
        <div className="relative w-full h-full flex flex-col"> 
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#3a3a3a',
                color: '#ffffff',
                border: '1px solid rgba(37, 211, 102, 0.1)',
              },
              className: 'toast-custom',
            }}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
