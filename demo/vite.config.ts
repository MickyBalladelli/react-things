import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import packageJson from '../packages/ui/package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react()],
  define: {
    __REACT_THINGS_VERSION__: JSON.stringify(packageJson.version)
  },
  resolve: {
    alias: {
      '@mickyballadelli/react-things': resolve(__dirname, '../packages/ui/src/index.ts')
    }
  },
  server: {
    port: 5173
  }
})
