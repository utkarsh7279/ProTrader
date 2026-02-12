import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme-provider";
import "@/app/globals.css";

export const metadata = {
  title: "AI Trading & Portfolio Risk Analytics",
  description: "Professional real-time market data & risk management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
