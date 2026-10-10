/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/game", destination: "/game/index.html" }];
  },
};
