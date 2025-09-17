import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactBloggerPlugin from './react-blogger-plugin';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    react(),
    devtoolsJson(),
    reactBloggerPlugin({
      proxyBlog: 'https://react-template-preview.blogspot.com',
    }),
    tailwindcss(),
  ],
});
