import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { Providers } from "./providers";
import { SiteBackground } from "@/components/layout/site-background";
import { InlineScript } from "@/components/ui/inline-script";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const heading = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Anime Gallery",
  description: "A cozy, pastel-themed masonry gallery for anime art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
