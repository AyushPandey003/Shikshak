import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shikshak.com"),
  title: "Shikshak - Revolutionizing Education",
  description:
    "Join Shikshak to experience a new era of learning. Empowering students and teachers with cutting-edge tools and resources.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Shikshak - Revolutionizing Education",
    description:
      "Join Shikshak to experience a new era of learning. Empowering students and teachers with cutting-edge tools and resources.",
    url: "https://shikshak.com",
    siteName: "Shikshak",
    images: [
      {
        url: "/logo.png", // Next.js will now resolve this using metadataBase
        width: 800,
        height: 600,
        alt: "Shikshak Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shikshak - Revolutionizing Education",
    description:
      "Join Shikshak to experience a new era of learning. Empowering students and teachers with cutting-edge tools and resources.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
  keywords: ["Education", "Online Learning", "LMS", "Shikshak", "Courses", "Student", "Teacher"],
  authors: [{ name: "Shikshak Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shikshak",
    url: "https://shikshak.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://shikshak.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
