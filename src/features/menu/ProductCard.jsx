import Badge from '../../components/ui/Badge.jsx'
import { pesos } from '../../lib/formato.js'
import './ProductCard.css'

// Toda la tarjeta es un botón grande: más fácil de tocar en una pantalla.
export default function ProductCard({ producto, onElegir }) {
  const { nombre, precio, disponible } = producto
  return (
    <button
      type="button"
      className={disponible ? 'producto' : 'producto producto--agotado'}
      disabled={!disponible}
      onClick={() => onElegir(producto)}
    >
      <span className="producto__nombre">{nombre}</span>
      <span className="producto__precio">{pesos(precio)}</span>
      <Badge tipo={disponible ? 'ok' : 'error'}>{disponible ? 'Disponible' : 'Agotado'}</Badge>
    </button>
  )
}
