import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Карты исходников: без них ошибка в проде читается как «l is not a function»
    // и ищется гаданием, а с ними стек показывает файл и строку. На вес страницы
    // не влияют — браузер грузит карты только при открытом DevTools.
    sourcemap: true,
  },
})
