import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
      },
    },
  },
})