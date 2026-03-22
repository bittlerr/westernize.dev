import type { Metadata } from "next";
import { Figtree, Lora, Unbounded } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Westernize — Rebuild your CV for Western tech",
    template: "%s | Westernize",
  },
  description:
    "AI-powered CV optimization for Eastern European developers targeting Western tech companies. Get ATS-friendly, westernized bullet points in minutes.",
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "https://westernize.dev"),
  openGraph: {
    title: "Westernize — Rebuild your CV for Western tech",
    description:
      "Upload your CV + job description. Get a match score, gap analysis, and westernized bullet points in minutes.",
    siteName: "Westernize",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westernize — Rebuild your CV for Western tech",
    description: "AI-powered CV optimization for Eastern European devs targeting Western tech companies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${lora.variable} ${figtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_URL ?? "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
