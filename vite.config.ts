import path from 'path'
import react from '@vitejs/plugin-react'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), topLevelAwait()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ['**/src-tauri/**']
        }
    },

    // Shadcn UI
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },

    worker: {
        format: 'es',
        plugins: () => [topLevelAwait()]
    },
    build: {
        target: process.env.TAURI_PLATFORM === 'windows' ? 'es2021' : 'esnext',
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_DEBUG,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            format: 'es',
          },
        },
      },

})