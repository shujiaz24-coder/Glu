import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import groqChat from './server/groqChat.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' loads every variable, not just VITE_ ones, so GROQ_DEV stays server-only.
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      groqChat({ apiKey: env.GROQ_DEV, model: env.GROQ_MODEL }),
    ],
  }
})
