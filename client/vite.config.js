import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://selfroom.rmutp.ac.th:5000',
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // กำหนดให้ third-party libraries แยกออกเป็นไฟล์ chunk เอง
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
