import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
   define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  },
  resolve: {
    alias: {
      'jwt-decode': 'jwt-decode/dist/jwt-decode.esm.js'
    }
  },
  plugins: [react()],
})
