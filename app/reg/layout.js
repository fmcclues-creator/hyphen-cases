export const metadata = {
  metadataBase: new URL("https://reg.hyphen-eventskw.com"),
  title: "THE MYSTERY ROUTE",
  description: "Saturday at Ktech · One hour · 4–6 players. Sign up your team.",
  openGraph: {
    title: "THE MYSTERY ROUTE",
    description: "Saturday at Ktech · One hour · 4–6 players. Sign up your team.",
    url: "https://reg.hyphen-eventskw.com",
    siteName: "HYPHEN",
    images: [{ url: "/reg-og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "THE MYSTERY ROUTE", description: "Saturday at Ktech · Sign up your team.", images: ["/reg-og.jpg"] },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#0d1016" };

export default function RegLayout({ children }) { return children; }
