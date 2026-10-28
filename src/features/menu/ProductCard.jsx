import { useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import { pesos } from '../../lib/formato.js'
import './ProductCard.css'

// Toda la tarjeta es un botón grande (más fácil de tocar). Sin foto, o si la foto falla, muestra la inicial.
export default function ProductCard({ producto, onElegir }) {
  const { nombre, precio, disponible, imagenUrl } = producto
  const [fallo, setFallo] = useState(false)

  return (
    <button
      type="button"
      className={disponible ? 'producto' : 'producto producto--agotado'}
      disabled={!disponible}
      onClick={() => onElegir(producto)}
    >
      <span className="producto__foto">
        {imagenUrl && !fallo ? (
          <img src={imagenUrl} alt="" loading="lazy" onError={() => setFallo(true)} />
        ) : (
          <span className="producto__inicial" aria-hidden="true">{nombre.slice(0, 1).toUpperCase()}</span>
        )}
        {!disponible && (
          <span className="producto__etiqueta"><Badge tipo="error">Agotado</Badge></span>
        )}
      </span>
      <span className="producto__info">
        <span className="producto__nombre">{nombre}</span>
        <span className="producto__precio">{pesos(precio)}</span>
      </span>
    </button>
  )
}
