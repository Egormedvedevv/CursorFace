import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Определяем, запущена ли сборка на Vercel
// Vercel устанавливает VERCEL=1, VERCEL_ENV или VERCEL_URL
const isVercel = process.env.VERCEL === '1' || 
                 !!process.env.VERCEL_ENV || 
                 !!process.env.VERCEL_URL

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: isVercel ? '/' : '/CursorFace/',
  build: {
    outDir: isVercel ? 'dist' : '.',
    assetsDir: 'assets',
    emptyOutDir: isVercel ? true : false,
  },
})
