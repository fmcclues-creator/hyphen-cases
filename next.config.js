/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/game", destination: "/game/index.html" }];
  },
  async headers() {
    const noStore = [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" }];
    return [
      { source: "/game", headers: noStore },
      { source: "/game/index.html", headers: noStore },
      { source: "/game/manifest.json", headers: noStore },
    ];
  },
};
