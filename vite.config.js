import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Por si querés tener una base en .env, pero el proxy apunta a 8000 por defecto
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_AUTH_BASE_URL || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "^/oauth": { target, changeOrigin: true },
        "^/api":   { target, changeOrigin: true },
      },
    },
  };
});
