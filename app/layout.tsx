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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ase-2420090094.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arqen AI — System Architecture & UML Synthesizer",
    template: "%s | Arqen AI",
  },
  description:
    "Turn natural language system descriptions into exportable UML diagrams, microservice maps, and structural specifications in seconds.",
  keywords: [
    "UML",
    "class diagram",
    "sequence diagram",
    "software architecture",
    "system design",
    "Mermaid",
    "AI synthesis",
    "microservices",
  ],
  authors: [{ name: "ArchiGen AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ArchiGen AI",
    title: "ArchiGen AI — System Architecture & UML Synthesizer",
    description:
      "Turn natural language system descriptions into exportable UML diagrams, microservice maps, and structural specifications in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiGen AI — System Architecture & UML Synthesizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchiGen AI — System Architecture & UML Synthesizer",
    description:
      "Turn natural language system descriptions into exportable UML diagrams, microservice maps, and structural specifications in seconds.",
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
