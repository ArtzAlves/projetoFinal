import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  },
  build: {
    outDir: 'dist'
  }
})