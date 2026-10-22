import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { pesos } from '../../lib/formato.js'
import { crearPedido } from '../../data/pedidos.js'
import { useCart } from './CartContext.jsx'
import './CartPanel.css'

export default function CartPanel() {
  const { items, cambiarCantidad, vaciar, total } = useCart()
  const [enviando, setEnviando] = useState(false)
  const [numero, setNumero] = useState(null)
  const [error, setError] = useState(false)

  async function confirmar() {
    setEnviando(true)
    setError(false)
    try {
      const pedido = await crearPedido(items)
      setNumero(pedido.numero)
      vaciar()
    } catch {
      setError(true)
    } finally {
      setEnviando(false)
    }
  }

  if (numero) {
    return (
      <aside className="carrito">
        <h2>Pedido recibido</h2>
        <p className="carrito__numero">#{numero}</p>
        <p>Este es tu número de pedido.</p>
        <Button bloque onClick={() => setNumero(null)}>Hacer otro pedido</Button>
      </aside>
    )
  }

  return (
    <aside className="carrito">
      <h2>Tu pedido</h2>
      {items.length === 0 ? (
        <p className="carrito__detalle">Está vacío. Toca un producto para empezar.</p>
      ) : (
        <>
          <ul className="carrito__lista">
            {items.map((i) => (
              <li key={i.id} className="carrito__item">
                <div>
                  <strong>{i.producto.nombre}{i.tamano ? ` (${i.tamano})` : ''}</strong>
                  {i.adiciones.length > 0 && <p className="carrito__detalle">{i.adiciones.map((a) => a.nombre).join(', ')}</p>}
                  <p className="carrito__detalle">{pesos(i.precioUnitario * i.cantidad)}</p>
                </div>
                <div className="carrito__cantidad">
                  <Button variante="secundario" aria-label={`Quitar una unidad de ${i.producto.nombre}`} onClick={() => cambiarCantidad(i.id, -1)}>−</Button>
                  <span>{i.cantidad}</span>
                  <Button variante="secundario" aria-label={`Agregar una unidad de ${i.producto.nombre}`} onClick={() => cambiarCantidad(i.id, 1)}>+</Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="carrito__total">Total {pesos(total)}</p>
          <Button tamano="grande" bloque cargando={enviando} onClick={confirmar}>Confirmar pedido</Button>
          {error && <p className="carrito__detalle">No pudimos enviar el pedido. Intenta de nuevo o avisa a un empleado.</p>}
        </>
      )}
    </aside>
  )
}
