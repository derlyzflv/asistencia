import { Router, type NextFunction, type Request, type Response } from 'express'
import {
  createTrabajador,
  getTrabajadorById,
  listTrabajadores,
  updateTrabajador,
  updateTrabajadorActivo,
} from './trabajadores.service.js'
import type { TrabajadorInput } from './trabajadores.types.js'

const router = Router()

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function getParamValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : ''
}

function isEstado(value: unknown): value is TrabajadorInput['estado'] {
  return value === 'activo' || value === 'inactivo'
}

function parseTrabajadorInput(body: Record<string, unknown>): TrabajadorInput {
  if (typeof body.apellidos !== 'string' || body.apellidos.trim() === '') {
    throw new Error('`apellidos` es obligatorio')
  }

  if (typeof body.nombres !== 'string' || body.nombres.trim() === '') {
    throw new Error('`nombres` es obligatorio')
  }

  if (!isEstado(body.estado)) {
    throw new Error('`estado` debe ser `activo` o `inactivo`')
  }

  return {
    dni: typeof body.dni === 'string' ? body.dni : null,
    codigoInterno: typeof body.codigoInterno === 'string' ? body.codigoInterno : null,
    apellidos: body.apellidos,
    nombres: body.nombres,
    cargoId: typeof body.cargoId === 'number' ? body.cargoId : null,
    areaId: typeof body.areaId === 'number' ? body.areaId : null,
    condicionLaboralId:
      typeof body.condicionLaboralId === 'number' ? body.condicionLaboralId : null,
    fechaIngreso: typeof body.fechaIngreso === 'string' ? body.fechaIngreso : null,
    correo: typeof body.correo === 'string' ? body.correo : null,
    telefono: typeof body.telefono === 'string' ? body.telefono : null,
    observacion: typeof body.observacion === 'string' ? body.observacion : null,
    estado: body.estado,
  }
}

router.get('/', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listTrabajadores())
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseId(getParamValue(request.params.id))

    if (!id) {
      response.status(400).json({ message: 'Id invalido' })
      return
    }

    const trabajador = await getTrabajadorById(id)

    if (!trabajador) {
      response.status(404).json({ message: 'Trabajador no encontrado' })
      return
    }

    response.json(trabajador)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const trabajador = await createTrabajador(parseTrabajadorInput(request.body))
    response.status(201).json(trabajador)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseId(getParamValue(request.params.id))

    if (!id) {
      response.status(400).json({ message: 'Id invalido' })
      return
    }

    const trabajador = await updateTrabajador(id, parseTrabajadorInput(request.body))

    if (!trabajador) {
      response.status(404).json({ message: 'Trabajador no encontrado' })
      return
    }

    response.json(trabajador)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/activo', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseId(getParamValue(request.params.id))

    if (!id) {
      response.status(400).json({ message: 'Id invalido' })
      return
    }

    if (typeof request.body.activo !== 'boolean') {
      response.status(400).json({ message: '`activo` debe ser booleano' })
      return
    }

    const trabajador = await updateTrabajadorActivo(id, request.body.activo)

    if (!trabajador) {
      response.status(404).json({ message: 'Trabajador no encontrado' })
      return
    }

    response.json(trabajador)
  } catch (error) {
    next(error)
  }
})

export { router as trabajadoresRouter }
