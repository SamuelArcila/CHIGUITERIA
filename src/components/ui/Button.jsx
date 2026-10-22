import './Button.css'

// variante: 'primario' | 'secundario'   tamano: 'normal' | 'grande'
export default function Button({
  variante = 'primario',
  tamano = 'normal',
  bloque = false,
  cargando = false,
  children,
  ...resto
}) {
  const clases = ['btn', `btn--${variante}`]
  if (tamano === 'grande') clases.push('btn--grande')
  if (bloque) clases.push('btn--bloque')

  return (
    <button
      className={clases.join(' ')}
      aria-busy={cargando}
      disabled={cargando || resto.disabled}
      {...resto}
    >
      {cargando ? 'Cargando…' : children}
    </button>
  )
}
