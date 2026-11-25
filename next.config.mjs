/** @type {import('next').NextConfig} */
const apiUrl = process.env.API_URL ?? "http://localhost:8080";

const nextConfig = {
  // The browser calls /api/... on this site; Next forwards it to the Spring Boot backend.
  // That keeps one origin (no CORS) and lets pictures load with plain <img src="/api/...">.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
