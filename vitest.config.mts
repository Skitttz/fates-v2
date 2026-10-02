import { basename } from 'node:path';
import { defineConfig, Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// emula o loader de imagens estáticas do Next (StaticImageData)
const nextStaticImages = (): Plugin => ({
  name: 'next-static-images',
  enforce: 'pre',
  load(id) {
    if (!/\.(png|jpe?g|gif|webp|svg)$/.test(id)) return null;
    const image = {
      src: `/${basename(id)}`,
      width: 100,
      height: 100,
      blurDataURL: 'data:image/png;base64,',
    };
    return `export default ${JSON.stringify(image)};`;
  },
});

export default defineConfig({
  plugins: [nextStaticImages(), tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/app/**', 'src/**/test/**', 'src/**/index.ts'],
    },
  },
});
