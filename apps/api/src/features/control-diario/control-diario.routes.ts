import { Router, type NextFunction, type Request, type Response } from 'express'
import { getControlDiario } from './control-diario.service.js'

const router = Router()

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const fecha = typeof request.query.fecha === 'string' ? request.query.fecha : null
    response.json(await getControlDiario(fecha))
  } catch (error) {
    next(error)
  }
})

export { router as controlDiarioRouter }
