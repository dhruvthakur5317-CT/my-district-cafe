import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Scene3D from "@/components/ui/Scene3D";
import TrackButton from "@/components/ui/TrackButton";
import BackButton from "@/components/ui/BackButton";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "My District Cafe | Cyber & Print Solution",
  description: "Premium digital printing, scanning, and stationery services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-foreground antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Scene3D />
          <Navbar />
          <BackButton />
          {children}
          <TrackButton />

          <footer className="border-t border-white/10 dark:border-white/10 bg-white/80 dark:bg-black/80 py-8 relative z-10 text-center text-gray-500 dark:text-gray-400 backdrop-blur-md">
            <p>&copy; {new Date().getFullYear()} My District Cafe. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
