import { useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import './OrderCard.css'

const BADGE = { recibido: ['info', 'Recibido'], preparando: ['aviso', 'Preparando'], entregado: ['ok', 'Entregado'] }
const SIGUIENTE = {
  recibido: { estado: 'preparando', texto: 'Empezar a preparar' },
  preparando: { estado: 'entregado', texto: 'Marcar entregado' },
}
const hora = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

export default function OrderCard({ pedido, onAvanzar }) {
  const [confirmando, setConfirmando] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [tipo, texto] = BADGE[pedido.estado]
  const siguiente = SIGUIENTE[pedido.estado]

  async function avanzar() {
    setOcupado(true)
    setError('')
    try {
      await onAvanzar(pedido.id, siguiente.estado)
    } catch {
      setError('No se pudo actualizar el pedido. Intenta de nuevo.')
    } finally {
      setOcupado(false)
      setConfirmando(false)
    }
  }

  // Entregar no se puede deshacer, así que pide confirmación para evitar toques por error.
  const pideConfirmar = siguiente?.estado === 'entregado'

  return (
    <Card apagada={pedido.estado === 'entregado'}>
      <div className="pedido__cabecera">
        <h3>Pedido #{pedido.id}</h3>
        <Badge tipo={tipo}>{texto}</Badge>
      </div>
      <p className="pedido__hora">Recibido a las {hora(pedido.creadoEn)}</p>

      <ul className="pedido__items">
        {pedido.items.map((i, n) => (
          <li key={n}>
            <strong>{i.cantidad} {i.nombre}{i.tamano ? ` ${i.tamano}` : ''}</strong>
            {i.adiciones.length > 0 && <span>{i.adiciones.map((a) => a.nombre).join(', ')}</span>}
          </li>
        ))}
      </ul>

      {siguiente && !confirmando && (
        <Button bloque cargando={ocupado} onClick={pideConfirmar ? () => setConfirmando(true) : avanzar}>
          {siguiente.texto}
        </Button>
      )}
      {confirmando && (
        <div className="pedido__confirmar">
          <p>¿Entregar el pedido #{pedido.id}? Esto no se puede deshacer.</p>
          <div className="pedido__acciones">
            <Button variante="secundario" disabled={ocupado} onClick={() => setConfirmando(false)}>Cancelar</Button>
            <Button cargando={ocupado} onClick={avanzar}>Sí, entregado</Button>
          </div>
        </div>
      )}
      {error && <p className="pedido__error" role="alert">{error}</p>}
    </Card>
  )
}
