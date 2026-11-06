const SITE = "https://cases.hyphen-eventskw.com";
const PRICE = Number(process.env.PRICE_KWD || 4.75).toFixed(3);
const DESC =
  "اشتروا كود الفريق لقضية خالد — لعبة تحقيق، ساعة وحدة، على ٦ موبايلات بنفس الكود، تنلعب على التلفزيون.";

import { getLang } from "../../lib/lang";

const metadataAr = {
  title: "اشترِ كود الفريق",
  description: DESC,
  alternates: { canonical: "/buy" },
  openGraph: {
    type: "website",
    url: `${SITE}/buy`,
    title: "قضية خالد · اشترِ كود الفريق",
    description: DESC,
    images: [{ url: "/og/og-khalid.png", width: 1200, height: 630, alt: "قضية خالد" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "قضية خالد · اشترِ كود الفريق",
    description: DESC,
    images: ["/og/og-khalid.png"],
  },
};

const DESC_EN = "Buy a team code for The Khalid Case — a detective game, one hour, on 6 phones with one code, played on the TV.";
export function generateMetadata() {
  if (getLang() !== "en") return metadataAr;
  return {
    title: "Buy a team code", description: DESC_EN, alternates: { canonical: "/en/buy" },
    openGraph: { type: "website", url: `${SITE}/en/buy`, title: "The Khalid Case · Buy a team code", description: DESC_EN, images: [{ url: "/og/og-khalid.png", width: 1200, height: 630, alt: "The Khalid Case" }] },
    twitter: { card: "summary_large_image", title: "The Khalid Case · Buy a team code", description: DESC_EN, images: ["/og/og-khalid.png"] },
  };
}

const PRODUCT = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "قضية خالد — لعبة تحقيق جماعية",
  description:
    "اختفى صاحب مجموعة مطاعم قبل أكبر صفقة في حياته بساعات. موبايله بين إيدينكم، مقفول. ساعة وحدة، خمسة مشتبهين، وعلى ٦ موبايلات بنفس الكود.",
  image: `${SITE}/og/og-khalid.png`,
  brand: { "@type": "Brand", name: "HYPHEN Events" },
  category: "ألعاب جماعية",
  inLanguage: "ar-KW",
  offers: {
    "@type": "Offer",
    price: PRICE,
    priceCurrency: "KWD",
    availability: "https://schema.org/InStock",
    url: `${SITE}/buy`,
    seller: { "@type": "Organization", name: "HYPHEN Events" },
  },
};

export default function BuyLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT) }}
      />
      {children}
    </>
  );
}
