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
};

export default function RegLayout({ children }) { return children; }
