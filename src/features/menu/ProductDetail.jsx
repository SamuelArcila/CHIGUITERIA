import { useEffect, useRef, useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { pesos } from '../../lib/formato.js'
import './ProductDetail.css'

// Ventana modal nativa (<dialog>): atrapa el foco y se cierra con Escape sin código extra.
export default function ProductDetail({ producto, adiciones, onCerrar, onAgregar }) {
  const ref = useRef(null)
  const [tamano, setTamano] = useState(producto.tamanos.includes('M') ? 'M' : producto.tamanos[0] ?? null)
  const [marcadas, setMarcadas] = useState([])
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])

  const elegidas = adiciones.filter((a) => marcadas.includes(a.id))
  const precioUnitario = producto.precio + elegidas.reduce((suma, a) => suma + a.precio, 0)
  const alternar = (id) => setMarcadas((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))

  function agregar() {
    onAgregar({ producto, tamano, adiciones: elegidas, cantidad, precioUnitario })
    ref.current.close()
  }

  return (
    <dialog ref={ref} className="detalle" onClose={onCerrar}>
      <h2>{producto.nombre}</h2>
      <p className="detalle__precio">{pesos(producto.precio)}</p>

      {producto.tamanos.length > 0 && (
        <fieldset>
          <legend>Tamaño</legend>
          <div className="detalle__fila">
            {producto.tamanos.map((t) => (
              <Button key={t} variante={t === tamano ? 'primario' : 'secundario'} aria-pressed={t === tamano} onClick={() => setTamano(t)}>
                {t}
              </Button>
            ))}
          </div>
        </fieldset>
      )}

      {adiciones.length > 0 && (
        <fieldset>
          <legend>Adiciones</legend>
          {adiciones.map((a) => (
            <label key={a.id} className="detalle__opcion">
              <input type="checkbox" checked={marcadas.includes(a.id)} onChange={() => alternar(a.id)} />
              <span>{a.nombre}</span>
              <span>+{pesos(a.precio)}</span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="detalle__fila detalle__cantidad">
        <span>Cantidad</span>
        <Button variante="secundario" aria-label="Quitar una unidad" disabled={cantidad <= 1} onClick={() => setCantidad((c) => c - 1)}>−</Button>
        <strong>{cantidad}</strong>
        <Button variante="secundario" aria-label="Agregar una unidad" onClick={() => setCantidad((c) => c + 1)}>+</Button>
      </div>

      <div className="detalle__fila detalle__acciones">
        <Button variante="secundario" onClick={() => ref.current.close()}>Cancelar</Button>
        <Button onClick={agregar}>Agregar por {pesos(precioUnitario * cantidad)}</Button>
      </div>
    </dialog>
  )
}
