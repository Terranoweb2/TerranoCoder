import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/" : "/",
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@supabase/supabase-js",
            "monaco-editor",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: ["monaco-editor/esm/vs/editor/editor.api"],
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "monaco-editor": path.resolve(__dirname, "node_modules/monaco-editor"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    fs: {
      allow: ["../"],
    },
  },
});
