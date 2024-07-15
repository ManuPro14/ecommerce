import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dotenv from 'dotenv';

dotenv.config();
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true,
    port: 5173, // o el puerto que prefieras
    strictPort: true,
    middlewareMode: false
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  define: {
    'process.env': process.env
  }
})