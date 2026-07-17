import { Router, type NextFunction, type Request, type Response } from 'express'
import {
  createHorario,
  getHorarioById,
  listHorarios,
  updateHorario,
  updateHorarioActivo,
} from './horarios.service.js'
import type { HorarioInput } from './horarios.types.js'

const router = Router()

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function getParamValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : ''
}

function isEstado(value: unknown): value is HorarioInput['estado'] {
  return value === 'activo' || value === 'inactivo'
}

function parseNonNegativeNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`\`${field}\` debe ser un numero entero mayor o igual a 0`)
  }

  return value
}

function parseTime(value: unknown, field: string) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) {
    throw new Error(`\`${field}\` debe tener formato HH:MM`)
  }

  return value
}

function parseHorarioInput(body: Record<string, unknown>): HorarioInput {
  if (typeof body.codigo !== 'string' || body.codigo.trim() === '') {
    throw new Error('`codigo` es obligatorio')
  }

  if (typeof body.nombre !== 'string' || body.nombre.trim() === '') {
    throw new Error('`nombre` es obligatorio')
  }

  if (!isEstado(body.estado)) {
    throw new Error('`estado` debe ser `activo` o `inactivo`')
  }

  return {
    codigo: body.codigo,
    nombre: body.nombre,
    horaEntrada: parseTime(body.horaEntrada, 'horaEntrada'),
    horaSalida: parseTime(body.horaSalida, 'horaSalida'),
    toleranciaEntrada: parseNonNegativeNumber(body.toleranciaEntrada, 'toleranciaEntrada'),
    toleranciaSalida: parseNonNegativeNumber(body.toleranciaSalida, 'toleranciaSalida'),
    descripcion: typeof body.descripcion === 'string' ? body.descripcion : null,
    estado: body.estado,
  }
}

router.get('/', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listHorarios())
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

    const horario = await getHorarioById(id)

    if (!horario) {
      response.status(404).json({ message: 'Horario no encontrado' })
      return
    }

    response.json(horario)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const horario = await createHorario(parseHorarioInput(request.body))
    response.status(201).json(horario)
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

    const horario = await updateHorario(id, parseHorarioInput(request.body))

    if (!horario) {
      response.status(404).json({ message: 'Horario no encontrado' })
      return
    }

    response.json(horario)
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

    const horario = await updateHorarioActivo(id, request.body.activo)

    if (!horario) {
      response.status(404).json({ message: 'Horario no encontrado' })
      return
    }

    response.json(horario)
  } catch (error) {
    next(error)
  }
})

export { router as horariosRouter }
