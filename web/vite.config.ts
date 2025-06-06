import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Esto hace que se enlace en todas las interfaces
    // Puedes especificar un puerto si es necesario:
    // port: 5173
  }
});
