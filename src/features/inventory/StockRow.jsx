import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { cantidad } from '../../lib/formato.js'

export default function StockRow({ insumo, onReponer }) {
  const { nombre, unidad, stock, capacidad, stockMinimo } = insumo
  const bajo = stock <= stockMinimo

  return (
    <li className="stock">
      <div className="stock__texto">
        <div className="stock__titulo">
          <strong>{nombre}</strong>
          {bajo && <Badge tipo="error">Bajo stock</Badge>}
        </div>
        <span className="stock__cifras">
          {cantidad(stock)}{capacidad ? ` / ${cantidad(capacidad)}` : ''} {unidad}
        </span>
        {capacidad && <ProgressBar valor={stock / capacidad} tono={bajo ? 'alerta' : 'normal'} etiqueta={`Nivel de ${nombre}`} />}
      </div>
      <Button variante="secundario" aria-label={`Reponer ${nombre}`} onClick={() => onReponer(insumo)}>Reponer</Button>
    </li>
  )
}
