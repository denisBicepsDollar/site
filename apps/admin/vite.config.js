import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
    server: {
        host: "0.0.0.0",
        allowedHosts: true,
        proxy: {
            "/api": {
                target: process.env.API_PROXY_TARGET || "http://127.0.0.1:3000",
                changeOrigin: true,
            },
            "/auth": {
                target: process.env.API_PROXY_TARGET || "http://127.0.0.1:3000",
                changeOrigin: true,
            },
        },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
