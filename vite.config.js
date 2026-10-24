import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import geminiChat from './server/geminiChat.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' loads every variable, not just VITE_ ones, so GEMINI_KEY stays server-only.
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      geminiChat({ apiKey: env.GEMINI_KEY, model: env.GEMINI_MODEL }),
    ],
  }
})
