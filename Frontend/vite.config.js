import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000' // /api ki piche append ho ajyega
    },
  //       proxy: {
  //     '/api': {
  //       target: 'https://videotube-mggc.onrender.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  
  },
  plugins: [react(), tailwindcss(),],
})



  // '/api': 'https://videotube-mggc.onrender.com' // /api ki piche append ho ajyega
  // },
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },