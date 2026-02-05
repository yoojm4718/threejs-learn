import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // R3F-PERF의 GPU monitoring 활성화를 위한 StrictMode off

  // Webpack GLSL import 설정
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["ts-shader-loader"],
    });

    return config;
  },

  // Turbopack GLSL import 설정
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["ts-shader-loader"],
        as: "*.ts",
      },
      "*.vert": {
        loaders: ["ts-shader-loader"],
        as: "*.ts",
      },
      "*.frag": {
        loaders: ["ts-shader-loader"],
        as: "*.ts",
      },
      "*.vs": {
        loaders: ["ts-shader-loader"],
        as: "*.ts",
      },
      "*.fs": {
        loaders: ["ts-shader-loader"],
        as: "*.ts",
      },
    },
  },
};

export default nextConfig;
