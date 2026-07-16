import { Link } from 'react-router-dom'

type TarjetaAccesoRapidoProps = {
  title: string
  description: string
  to: string
  badge: string
}

export function TarjetaAccesoRapido({
  title,
  description,
  to,
  badge,
}: TarjetaAccesoRapidoProps) {
  return (
    <Link className="quick-card" to={to}>
      <div className="quick-card__badge" aria-hidden="true">
        {badge}
      </div>
      <div className="quick-card__content">
        <h2 className="quick-card__title">{title}</h2>
        <p className="quick-card__description">{description}</p>
      </div>
      <span className="quick-card__action">Abrir</span>
    </Link>
  )
}
