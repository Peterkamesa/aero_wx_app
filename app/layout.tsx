import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "AeroWx - Aviation Weather Dashboard",
  description: "METAR/SPECI observation dashboard and management system for aviation meteorology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-container">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
