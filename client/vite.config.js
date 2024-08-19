import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Proxy is for fetch default baseURL, delete when using axios
    proxy: {
      '/api': {
        target: 'http://192.168.101.143:5000',  // Office network
        // target: 'http://192.168.94.232:5000',  // mobile network
        secure: false
      }
    }
  } 
})
