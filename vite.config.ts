import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, writeFileSync } from 'fs'

/** GitHub Pages has no SPA rewrite: unknown routes must serve the app shell. */
function githubPagesSpa(): Plugin {
  return {
    name: 'github-pages-spa',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
      writeFileSync(path.join(dist, '.nojekyll'), '')
    },
  }
}

export default defineConfig({
  base: '/GenesisLab',
  plugins: [react(), githubPagesSpa()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
    },
    strictPort: false,
    port: 5173,
  },
})

