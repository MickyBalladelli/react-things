import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-things/ui': resolve(__dirname, '../packages/ui/src/index.ts')
    }
  },
  server: {
    port: 5173
  }
})
