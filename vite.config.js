import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/lang-sql"],
  },
  plugins: [svelte()],
  base: "./",
  build: {
    outDir: './docs',
    emptyOutDir: true, // also necessary
  }
})
