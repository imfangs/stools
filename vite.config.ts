import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  define: {
    __BUILD_TIME__: JSON.stringify(
      new Date()
        .toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '')
        .replace(/,?\s*/g, '')
        .replace(/:/g, '')
    ),
    __BUILD_NUMBER__: JSON.stringify(
      String(Math.floor(Date.now() / 1000) % 100000)
    ),
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
})
