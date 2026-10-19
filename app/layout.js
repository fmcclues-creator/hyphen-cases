import "./globals.css";
import MetaPixel from "./components/MetaPixel";

const SITE = "https://cases.hyphen-eventskw.com";
const DESC =
  "ألعاب تحقيق جماعية باللهجة الكويتية. موبايل مقفول، ساعة وحدة، وفريق — افتحوا القضية على التلفزيون في البيت أو الشاليه.";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "قضايا HYPHEN · ألعاب تحقيق باللهجة الكويتية",
    template: "%s · قضايا HYPHEN",
  },
  description: DESC,
  applicationName: "قضايا HYPHEN",
  keywords: [
    "ألعاب جماعية", "لعبة تحقيق", "قضايا", "ألعاب كويتية", "لهجة كويتية",
    "ألعاب عائلية", "ألعاب دواوين", "غرفة الهروب", "escape room الكويت",
    "ألعاب على التلفزيون", "HYPHEN Events", "قضية خالد", "قضية الشاليه",
    "ألعاب شاليه", "ألعاب تجمعات", "العاب الكويت",
  ],
  authors: [{ name: "HYPHEN Events", url: "https://instagram.com/hyphen.events" }],
  creator: "HYPHEN Events",
  publisher: "HYPHEN Events",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "قضايا HYPHEN",
    locale: "ar_KW",
    url: SITE,
    title: "قضايا HYPHEN · ألعاب تحقيق باللهجة الكويتية",
    description: DESC,
    images: [{ url: "/og/og.png", width: 1200, height: 630, alt: "قضايا HYPHEN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "قضايا HYPHEN · ألعاب تحقيق باللهجة الكويتية",
    description: DESC,
    images: ["/og/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport = { themeColor: "#0d1016" };

const ORG = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "HYPHEN Events",
      alternateName: "قضايا HYPHEN",
      url: SITE,
      logo: `${SITE}/icon-512.png`,
      image: `${SITE}/og/og.png`,
      description:
        "شركة كويتية في مجال الفعاليات: الإنتاج والتنفيذ، تفعيلات العلامات التجارية، والألعاب الجماعية.",
      areaServed: { "@type": "Country", name: "Kuwait" },
      address: { "@type": "PostalAddress", addressCountry: "KW" },
      sameAs: ["https://instagram.com/hyphen.events"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      url: SITE,
      name: "قضايا HYPHEN",
      inLanguage: "ar-KW",
      publisher: { "@id": `${SITE}/#org` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }}
        />
      </head>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
