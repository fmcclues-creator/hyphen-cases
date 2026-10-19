const SITE = "https://cases.hyphen-eventskw.com";

// The game pages carry <meta name="robots" content="noindex"> themselves, so they are
// left crawlable on purpose: WhatsApp/Instagram/Facebook's preview fetcher obeys
// robots.txt, and blocking them here would kill the link preview when a team shares
// their code (the invite link is /shaleh#code=XXXX).
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/buy/done"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
