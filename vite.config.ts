import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import content from '@originjs/vite-plugin-content'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3500,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [react(), content()],
})
