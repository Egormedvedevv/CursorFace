import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/CursorFace/',
  build: {
    outDir: '.',
    assetsDir: 'assets',
    emptyOutDir: false,
  },
})
