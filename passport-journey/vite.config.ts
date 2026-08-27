import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Honour PORT so the dev server can be started on an assigned port when 5173
  // is already taken.
  server: { port: Number(process.env.PORT) || 5173 },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './@'),
    },
  },
})
