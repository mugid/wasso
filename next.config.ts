import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true,
  // Note: cacheComponents is enabled in Next.js 16 but has compatibility issues with:
  // - next-themes (ThemeProvider) - accesses localStorage during SSR
  // - Client components in layouts that access browser APIs
  // The app is ready for cacheComponents once next-themes is updated or we refactor theme handling
  // All data fetching is already wrapped in Suspense boundaries for future compatibility
};

export default nextConfig;
