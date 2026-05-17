import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import blogger from 'blogger-plugin/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import * as packageJson from './package.json' with { type: 'json' };

const REPOSITORY = 'blogger-themes/themes';
const DEV_BRANCH = 'static-dev';

const APP_BASE =
  process.env.VITE_BASE === 'jsdelivr-dev'
    ? `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${encodeURIComponent(DEV_BRANCH)}/${packageJson.name}/dist/`
    : process.env.VITE_BASE === 'jsdelivr-prod'
      ? `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${encodeURIComponent(`${packageJson.name}@${packageJson.version}`)}/dist/`
      : (process.env.VITE_BASE ?? '/');

// https://vite.dev/config/
export default defineConfig({
  base: APP_BASE,
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
