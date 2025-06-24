import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/Mobica-project-managment" : "",
  assetPrefix: isProd ? "/Mobica-project-managment/" : "",
};

export default nextConfig;
