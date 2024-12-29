import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: {
      '.js': 'jsx',  // Ensures .js files are treated as JSX
    },
  },
  server: {
    port: 3001, // Set the port to 3001
  },
})
