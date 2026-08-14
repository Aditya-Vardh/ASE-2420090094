import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ArchiGen AI — Turn Ideas into UML Diagrams",
    template: "%s | ArchiGen AI",
  },
  description:
    "Describe your software idea in plain English and instantly generate a polished UML class diagram powered by AI. Export, refine, and iterate — no modeling tools required.",
  keywords: [
    "UML",
    "class diagram",
    "software architecture",
    "AI",
    "Mermaid",
    "Groq",
  ],
  authors: [{ name: "ArchiGen AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ArchiGen AI",
    title: "ArchiGen AI — Turn Ideas into UML Diagrams",
    description:
      "Describe your software idea in plain English and instantly generate a polished UML class diagram powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiGen AI — Turn Ideas into UML Diagrams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchiGen AI — Turn Ideas into UML Diagrams",
    description:
      "Describe your software idea in plain English and instantly generate a polished UML class diagram powered by AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
