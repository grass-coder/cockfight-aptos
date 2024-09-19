import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [nodePolyfills({ globals: { Buffer: true, global: true, process: true } }), react(), svgr()],
  build: { target: "esnext" },
  clearScreen: false,
  envPrefix: "VITE_",
})
