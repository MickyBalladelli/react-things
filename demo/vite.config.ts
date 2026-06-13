import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mickyballadelli/react-things': resolve(__dirname, '../packages/ui/src/index.ts')
    }
  },
  server: {
    port: 5173
  }
})
