import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "docs.espressif.com" },
      { protocol: "https", hostname: "www.st.com" },
      { protocol: "https", hostname: "www.raspberrypi.com" },
      { protocol: "https", hostname: "docs.nordicsemi.com" },
      { protocol: "https", hostname: "store.arduino.cc" },
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
    ],
  },
};

export default nextConfig;
