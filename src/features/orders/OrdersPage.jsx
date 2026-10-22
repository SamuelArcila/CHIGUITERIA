import { useCallback, useEffect, useState } from 'react'
import { cambiarEstado, listarPedidos, suscribir } from '../../data/pedidos.js'
import OrderCard from './OrderCard.jsx'
import './OrdersPage.css'

export default function OrdersPage() {
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [pedidos, setPedidos] = useState([])

  const cargar = useCallback(async () => {
    try {
      setPedidos(await listarPedidos())
      setEstado('listo')
    } catch {
      setEstado('error')
    }
  }, [])

  // Carga al entrar y se vuelve a cargar cada vez que algo cambia (nuevo pedido o cambio de estado).
  useEffect(() => {
    cargar()
    return suscribir(cargar)
  }, [cargar])

  const pendientes = pedidos.filter((p) => p.estado !== 'entregado') // ya vienen del más antiguo al más nuevo
  const entregados = pedidos.filter((p) => p.estado === 'entregado').slice(-5).reverse()

  return (
    <div className="pedidos">
      <h1>Pedidos</h1>
      {estado === 'cargando' && <p className="pedidos__aviso">Cargando pedidos…</p>}
      {estado === 'error' && <p className="pedidos__aviso">No pudimos cargar los pedidos. Recarga la página.</p>}
      {estado === 'listo' && (
        <>
          {pendientes.length === 0 ? (
            <p className="pedidos__aviso">No hay pedidos pendientes.</p>
          ) : (
            <div className="pedidos__grilla">
              {pendientes.map((p) => (
                <OrderCard key={p.id} pedido={p} onAvanzar={cambiarEstado} />
              ))}
            </div>
          )}
          {entregados.length > 0 && (
            <>
              <h2>Entregados recientes</h2>
              <div className="pedidos__grilla">
                {entregados.map((p) => (
                  <OrderCard key={p.id} pedido={p} onAvanzar={cambiarEstado} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
