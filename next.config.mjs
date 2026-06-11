import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hlkxzssxipbowzzpcrpr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/nos-realisations",              destination: "/#portfolio",      permanent: true },
      { source: "/tarifs",                        destination: "/services",         permanent: true },
      { source: "/contactez-nous",                destination: "/contact",          permanent: true },
      { source: "/prendre-rendez-vous",           destination: "/#booking",         permanent: true },
      { source: "/politique-de-confidentialite",  destination: "/mentions-legales", permanent: true },
      { source: "/politique-de-confidentialité",  destination: "/mentions-legales", permanent: true },
      { source: "/service-page/:path*",           destination: "/services",         permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "X-Content-Type-Options",      value: "nosniff" },
          { key: "Referrer-Policy",             value: "origin-when-cross-origin" },
          { key: "Strict-Transport-Security",   value: "max-age=31536000; includeSubDomains" },
          { key: "X-XSS-Protection",            value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
