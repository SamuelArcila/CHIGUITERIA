import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { cantidad as formatoCantidad } from '../../lib/formato.js'

export default function RestockModal({ insumo, onCerrar, onRegistrar }) {
  const [texto, setTexto] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  return (
    <Modal titulo={`Registrar entrada: ${insumo.nombre}`} onCerrar={onCerrar}>
      {(cerrar) => {
        async function enviar(evento) {
          evento.preventDefault()
          const n = Number(texto.replace(',', '.'))
          if (!(n > 0)) {
            setError('Escribe una cantidad mayor que cero.')
            return
          }
          setEnviando(true)
          setError('')
          try {
            await onRegistrar({ insumoId: insumo.id, cantidad: n, proveedor: proveedor.trim() })
            cerrar()
          } catch {
            setError('No pudimos registrar la entrada. Intenta de nuevo.')
            setEnviando(false)
          }
        }
        return (
          <form onSubmit={enviar} noValidate>
            <p className="modal__ayuda">Stock actual: {formatoCantidad(insumo.stock)} {insumo.unidad}</p>
            <Input etiqueta={`Cantidad recibida (${insumo.unidad})`} type="text" inputMode="decimal" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <Input etiqueta="Proveedor (opcional)" type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
            {error && <p className="modal__error" role="alert">{error}</p>}
            <div className="modal__acciones">
              <Button type="button" variante="secundario" disabled={enviando} onClick={cerrar}>Cancelar</Button>
              <Button type="submit" cargando={enviando}>Registrar</Button>
            </div>
          </form>
        )
      }}
    </Modal>
  )
}
