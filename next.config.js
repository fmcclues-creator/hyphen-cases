/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/game", destination: "/game/index.html" },{ source: "/shaleh", destination: "/shaleh/index.html" },{ source: "/tv", destination: "/tv/index.html" },{ source: "/villa", destination: "/villa/index.html" }];
  },
  async headers() {
    const noStore = [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" }];
    return [
      { source: "/game", headers: noStore },
      { source: "/game/index.html", headers: noStore },
      { source: "/game/manifest.json", headers: noStore },
      { source: "/shaleh", headers: noStore },
      { source: "/shaleh/index.html", headers: noStore },
      { source: "/shaleh/manifest.json", headers: noStore },
      { source: "/villa/manifest.json", headers: noStore },
      { source: "/tv", headers: noStore },
      { source: "/tv/index.html", headers: noStore },
      { source: "/villa", headers: noStore },
      { source: "/villa/index.html", headers: noStore },
    ];
  },
};
