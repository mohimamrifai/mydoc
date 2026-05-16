import { defineConfig } from '@prisma/config'
import 'dotenv/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    // Tambahkan flag --tsconfig untuk memaksa runner membaca alias
    seed: 'pnpm dlx tsx --tsconfig tsconfig.json prisma/seed.ts', 
  },
})