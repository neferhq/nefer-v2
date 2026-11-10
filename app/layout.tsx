import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";

import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { FluidBackground } from "@/components/ui/FluidBackground";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.businessUrl),
  title: {
    default: `${site.brand}${site.tld} | Frontend engineer and UI/UX designer`,
    template: `%s | ${site.brand}${site.tld}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.brand}${site.tld} | Frontend engineer and UI/UX designer`,
    description: site.description,
    type: "website",
    url: site.businessUrl,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#090D16" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes writes the theme class onto <html> before hydration, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-chalk transition-transform focus:translate-y-0 dark:bg-chalk dark:text-ink"
          >
            Skip to content
          </a>
          <FluidBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
