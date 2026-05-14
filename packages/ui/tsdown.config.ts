import { defineConfig } from 'tsdown';

export default defineConfig((_) => ({
  entry: ['src/**/*.{ts,js,tsx,jsx}'],
  platform: 'neutral',
  target: 'es2018',
  sourcemap: true,
  unbundle: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  dts: true,
  clean: true,
  copy: ['src/styles'],
  ignoreWatch: ['.turbo'],
}));
