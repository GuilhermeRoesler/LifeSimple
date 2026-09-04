/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { geminiApiPlugin } from "./plugins/geminiApiPlugin.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  // Project ID usado pelo proxy /api/chat para validar ID tokens do Firebase
  const firebaseProjectId =
    env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
  if (firebaseProjectId) {
    process.env.FIREBASE_PROJECT_ID = firebaseProjectId;
  }
  if (env.TRUST_PROXY) {
    process.env.TRUST_PROXY = env.TRUST_PROXY;
  }

  const siteUrl = env.VITE_SITE_URL || "http://localhost:5173";
  // Project pages: /RepoName/ — root/custom domain: /
  const base = env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      geminiApiPlugin(),
      {
        name: "html-site-url",
        transformIndexHtml(html) {
          return html.replaceAll("__SITE_URL__", siteUrl);
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      environment: "node",
      include: ["src/**/*.test.ts", "server/**/*.test.ts"],
    },
  };
});
