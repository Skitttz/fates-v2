import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    defaultCommandTimeout: 8000,
  },
});
