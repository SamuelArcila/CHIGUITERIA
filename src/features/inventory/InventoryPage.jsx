import { useCallback, useEffect, useState } from 'react'
import { listarInventario, registrarEntrada, suscribir } from '../../data/inventario.js'
import RestockModal from './RestockModal.jsx'
import StockRow from './StockRow.jsx'
import './InventoryPage.css'

export default function InventoryPage() {
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [insumos, setInsumos] = useState([])
  const [reponiendo, setReponiendo] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setInsumos(await listarInventario())
      setEstado('listo')
    } catch {
      setEstado('error')
    }
  }, [])

  useEffect(() => {
    cargar()
    return suscribir(cargar)
  }, [cargar])

  return (
    <div className="inventario">
      <h1>Inventario</h1>
      {estado === 'cargando' && <p className="inventario__aviso">Cargando inventario…</p>}
      {estado === 'error' && <p className="inventario__aviso">No pudimos cargar el inventario. Recarga la página.</p>}
      {estado === 'listo' && (
        <ul className="inventario__lista">
          {insumos.map((i) => (
            <StockRow key={i.id} insumo={i} onReponer={setReponiendo} />
          ))}
        </ul>
      )}
      {reponiendo && (
        <RestockModal
          key={reponiendo.id}
          insumo={insumos.find((i) => i.id === reponiendo.id) ?? reponiendo}
          onCerrar={() => setReponiendo(null)}
          onRegistrar={registrarEntrada}
        />
      )}
    </div>
  )
}
