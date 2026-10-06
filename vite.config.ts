import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    // Phaser pesa ~1.2 MB: va en su propio chunk para que el navegador lo cachee
    // aunque cambie el código del juego.
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('node_modules/phaser') ? 'phaser' : undefined;
        },
      },
    },
  },
});
