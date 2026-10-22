import './ProgressBar.css'

// valor entre 0 y 1. tono: 'normal' | 'alerta'
export default function ProgressBar({ valor, tono = 'normal', etiqueta }) {
  const porcentaje = Math.round(Math.min(1, Math.max(0, valor)) * 100)
  return (
    <div className="barra" role="progressbar" aria-label={etiqueta} aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
      <div className={`barra__relleno barra__relleno--${tono}`} style={{ width: `${porcentaje}%` }} />
    </div>
  )
}
