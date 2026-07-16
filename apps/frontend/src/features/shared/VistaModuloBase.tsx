import type { ReactNode } from 'react'

type VistaModuloBaseProps = {
  children: ReactNode
}

export function VistaModuloBase({ children }: VistaModuloBaseProps) {
  return (
    <div className="page-stack">
      {children}

      <section className="module-placeholder">
        <div className="module-placeholder__card">
          <span className="module-placeholder__tag">Modulo</span>
          <h2 className="module-placeholder__title">Pantalla en preparacion</h2>
          <p className="module-placeholder__description">
            Esta seccion quedara disponible con su contenido operativo en la siguiente etapa.
          </p>
        </div>
        <div className="module-placeholder__list">
          <div className="module-placeholder__item">Navegacion principal disponible</div>
          <div className="module-placeholder__item">Estructura visual compartida</div>
          <div className="module-placeholder__item">Base lista para continuar</div>
        </div>
      </section>
    </div>
  )
}
