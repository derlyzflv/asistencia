import dotenv from 'dotenv'

dotenv.config()

function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  port: Number(process.env.PORT ?? '3001'),
  databaseUrl: requireEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/asistencia'),
  corsOrigin: requireEnv('CORS_ORIGIN', 'http://localhost:5173'),
}
