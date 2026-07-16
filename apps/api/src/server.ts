import { app } from './app.js'
import { env } from './config/env.js'
import { ensureDatabaseReady } from './db/bootstrap.js'

async function startServer() {
  await ensureDatabaseReady()

  app.listen(env.port, () => {
    console.log(`API escuchando en http://localhost:${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('No se pudo iniciar la API', error)
  process.exit(1)
})
