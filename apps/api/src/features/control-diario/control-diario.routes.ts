import { Router, type NextFunction, type Request, type Response } from 'express'
import { getControlDiario, getControlDiarioDetalle } from './control-diario.service.js'

const router = Router()

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function getParamValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : ''
}

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const fecha = typeof request.query.fecha === 'string' ? request.query.fecha : null
    response.json(await getControlDiario(fecha))
  } catch (error) {
    next(error)
  }
})

router.get('/:trabajadorId', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const trabajadorId = parseId(getParamValue(request.params.trabajadorId))

    if (!trabajadorId) {
      response.status(400).json({ message: 'Id de trabajador invalido' })
      return
    }

    const fecha = typeof request.query.fecha === 'string' ? request.query.fecha : null
    const detalle = await getControlDiarioDetalle(trabajadorId, fecha)

    if (!detalle) {
      response.status(404).json({ message: 'Detalle no encontrado' })
      return
    }

    response.json(detalle)
  } catch (error) {
    next(error)
  }
})

export { router as controlDiarioRouter }
