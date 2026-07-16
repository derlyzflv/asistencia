import { Router, type NextFunction, type Request, type Response } from 'express'
import { pool } from '../db/pool.js'
import { queries } from '../db/queries.js'
import { listAreas, listCargos, listCondicionesLaborales } from '../features/catalogos/catalogos.service.js'
import { controlDiarioRouter } from '../features/control-diario/control-diario.routes.js'
import { trabajadoresRouter } from '../features/trabajadores/trabajadores.routes.js'

const router = Router()

router.get('/health', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query(queries.healthcheck)

    response.json({
      status: 'ok',
      database: rows[0]?.database ?? null,
      serverTime: rows[0]?.server_time ?? null,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/areas', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listAreas())
  } catch (error) {
    next(error)
  }
})

router.get('/cargos', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listCargos())
  } catch (error) {
    next(error)
  }
})

router.get('/condiciones-laborales', async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.json(await listCondicionesLaborales())
  } catch (error) {
    next(error)
  }
})

router.use('/control-diario', controlDiarioRouter)
router.use('/trabajadores', trabajadoresRouter)

export { router }
