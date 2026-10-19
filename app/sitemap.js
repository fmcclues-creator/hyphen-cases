const SITE = "https://cases.hyphen-eventskw.com";

export default function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = "weekly") => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1.0, "weekly"),
    page("/buy", 0.9, "weekly"),
    page("/about", 0.6, "monthly"),
    page("/play", 0.5, "monthly"),
    page("/terms", 0.3, "yearly"),
  ];
}
