import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import blogger from 'blogger-plugin/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    devtoolsJson(),
    blogger({
      proxyBlog: 'https://react-template-preview.blogspot.com',
    }),
  ],
});
