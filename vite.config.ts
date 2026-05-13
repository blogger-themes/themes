import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import blogger from 'blogger-plugin/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    blogger({
      proxyBlog: 'https://react-template-preview.blogspot.com',
      modules: ['src/index.tsx'],
      styles: ['src/styles/globals.css'],
      template: 'src/template.xml',
      xml: {
        tags: true,
        minify: true,
      },
    }),
    react(),
    tailwindcss(),
    devtoolsJson(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
  },
});
