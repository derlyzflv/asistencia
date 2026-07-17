import { Router, type NextFunction, type Request, type Response } from 'express'
import {
  createAsignacionHorario,
  getAsignacionHorarioById,
  getAsignacionHorarioDias,
  listAsignacionesHorario,
  replaceAsignacionHorarioDias,
  updateAsignacionHorario,
  updateAsignacionHorarioActivo,
} from './asignaciones-horario.service.js'
import type {
  AsignacionHorarioDiaInput,
  AsignacionHorarioInput,
  EstadoAsignacionHorario,
  ModoHorario,
} from './asignaciones-horario.types.js'

const router = Router()

function parseId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function getParamValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : ''
}

function parsePositiveNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`\`${field}\` debe ser un numero entero mayor a 0`)
  }
  return value
}

function parseNullablePositiveNumber(value: unknown, field: string) {
  if (value == null) return null
  return parsePositiveNumber(value, field)
}

function parseDateString(value: unknown, field: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`\`${field}\` debe tener formato YYYY-MM-DD`)
  }
  return value
}

function parseNullableDateString(value: unknown, field: string) {
  if (value == null || value === '') return null
  return parseDateString(value, field)
}

function isEstado(value: unknown): value is EstadoAsignacionHorario {
  return value === 'activo' || value === 'inactivo'
}

function isModoHorario(value: unknown): value is ModoHorario {
  return value === 'FIJO' || value === 'VARIABLE'
}

function parseAsignacionInput(body: Record<string, unknown>): AsignacionHorarioInput {
  if (!isModoHorario(body.modoHorario)) {
    throw new Error('`modoHorario` debe ser `FIJO` o `VARIABLE`')
  }

  if (!isEstado(body.estado)) {
    throw new Error('`estado` debe ser `activo` o `inactivo`')
  }

  return {
    trabajadorId: parsePositiveNumber(body.trabajadorId, 'trabajadorId'),
    modoHorario: body.modoHorario,
    horarioBaseId: parseNullablePositiveNumber(body.horarioBaseId, 'horarioBaseId'),
    fechaInicio: parseDateString(body.fechaInicio, 'fechaInicio'),
    fechaFin: parseNullableDateString(body.fechaFin, 'fechaFin'),
    estado: body.estado,
    observacion: typeof body.observacion === 'string' ? body.observacion : null,
  }
}

function parseDiasInput(body: Record<string, unknown>) {
  if (!Array.isArray(body.dias)) {
    throw new Error('`dias` debe ser un arreglo')
  }

  return body.dias.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Elemento invalido en dias[${index}]`)
    }

    const dia = item as Record<string, unknown>
    const diaSemana = parsePositiveNumber(dia.diaSemana, `dias[${index}].diaSemana`)

    if (diaSemana < 1 || diaSemana > 7) {
      throw new Error(`\`dias[${index}].diaSemana\` debe estar entre 1 y 7`)
    }

    if (typeof dia.activo !== 'boolean') {
      throw new Error(`\`dias[${index}].activo\` debe ser booleano`)
    }

    const parsed: AsignacionHorarioDiaInput = {
      diaSemana,
      horarioId: parsePositiveNumber(dia.horarioId, `dias[${index}].horarioId`),
      activo: dia.activo,
      observacion: typeof dia.observacion === 'string' ? dia.observacion : null,
    }

    return parsed
  })
}

router.get('/', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listAsignacionesHorario())
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

    const asignacion = await getAsignacionHorarioById(id)
    if (!asignacion) {
      response.status(404).json({ message: 'Asignacion no encontrada' })
      return
    }

    response.json(asignacion)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const asignacion = await createAsignacionHorario(parseAsignacionInput(request.body))
    response.status(201).json(asignacion)
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

    const asignacion = await updateAsignacionHorario(id, parseAsignacionInput(request.body))
    if (!asignacion) {
      response.status(404).json({ message: 'Asignacion no encontrada' })
      return
    }

    response.json(asignacion)
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

    const asignacion = await updateAsignacionHorarioActivo(id, request.body.activo)
    if (!asignacion) {
      response.status(404).json({ message: 'Asignacion no encontrada' })
      return
    }

    response.json(asignacion)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/dias', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseId(getParamValue(request.params.id))

    if (!id) {
      response.status(400).json({ message: 'Id invalido' })
      return
    }

    response.json(await getAsignacionHorarioDias(id))
  } catch (error) {
    next(error)
  }
})

router.put('/:id/dias', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = parseId(getParamValue(request.params.id))

    if (!id) {
      response.status(400).json({ message: 'Id invalido' })
      return
    }

    response.json(await replaceAsignacionHorarioDias(id, parseDiasInput(request.body)))
  } catch (error) {
    next(error)
  }
})

export { router as asignacionesHorarioRouter }
