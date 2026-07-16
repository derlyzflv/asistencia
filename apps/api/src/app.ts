import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { env } from './config/env.js'
import { router } from './routes/index.js'

export const app = express()

app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())

app.use('/api', router)

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error)
  response.status(500).json({ message: error.message || 'Unexpected server error' })
})
