/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fal.media",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fal.media",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fal-cdn.batuhan-941.workers.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v3.fal.media",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
