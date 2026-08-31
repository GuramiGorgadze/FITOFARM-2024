import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import PluginCritical from 'rollup-plugin-critical'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    PluginCritical({
      criticalUrl: './dist/',
      criticalBase: './dist/',
      criticalPages: [
        { uri: 'index.html', template: 'index' },
      ],
      criticalConfig: {
        inline: true,
        extract: true,
        width: 1300,
        height: 900,
      },
    }),
  ],
  build: {
    cssMinify: 'esbuild',
  },
})