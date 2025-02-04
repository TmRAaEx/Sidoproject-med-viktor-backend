const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: ["./src/index.ts"], // Your entry file
    bundle: true, // Bundle all files into one
    platform: "node", // Target Node.js environment
    outdir: "dist", // Output folder
    alias: {
      "@config": path.resolve(__dirname, "./src/config"),
      "@controllers": path.resolve(__dirname, "./src/controllers"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
    sourcemap: true, // Optional: Enable sourcemaps for debugging
    external: [
      "mock-aws-s3", // These are packages you probably want external
      "aws-sdk",
      "nock",
      "mongodb-client-encryption",
      "bcrypt",
      "../build/Debug/mongocrypt.node",
      "node-pre-gyp", // Any external native dependencies
    ],
    loader: {
      ".html": "text", // Load HTML files as text
      ".node": "file", // Handle .node files as files (native bindings)
    },
  })
  .catch(() => process.exit(1)); // Exit if there are build errors
