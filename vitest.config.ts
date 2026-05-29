import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    alias: { 'server-only': path.resolve(__dirname, 'src/lib/__mocks__/server-only.ts') },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
