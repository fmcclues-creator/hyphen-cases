const SITE = "https://cases.hyphen-eventskw.com";
const PRICE = Number(process.env.PRICE_KWD || 4.75).toFixed(3);
const DESC =
  "اشتروا رمز الفريق لقضية خالد — لعبة تحقيق باللهجة الكويتية، ساعة وحدة، لين ٦ موبايلات بنفس الرمز، تنلعب على التلفزيون.";

export const metadata = {
  title: "اشترِ رمز الفريق",
  description: DESC,
  alternates: { canonical: "/buy" },
  openGraph: {
    type: "website",
    url: `${SITE}/buy`,
    title: "قضية خالد · اشترِ رمز الفريق",
    description: DESC,
    images: [{ url: "/og/og-khalid.png", width: 1200, height: 630, alt: "قضية خالد" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "قضية خالد · اشترِ رمز الفريق",
    description: DESC,
    images: ["/og/og-khalid.png"],
  },
};

const PRODUCT = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "قضية خالد — لعبة تحقيق جماعية",
  description:
    "اختفى صاحب مجموعة مطاعم قبل أكبر صفقة في حياته بساعات. موبايله بين إيديكم، مقفول. ساعة وحدة، خمسة مشتبهين، ولين ٦ موبايلات بنفس الرمز.",
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
