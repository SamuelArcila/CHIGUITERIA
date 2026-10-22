import './Badge.css'

// tipo: 'ok' | 'error' | 'aviso' | 'info' | 'neutro'
// Siempre lleva texto: el color solo nunca basta para entender el estado.
export default function Badge({ tipo = 'info', children }) {
  return <span className={`badge badge--${tipo}`}>{children}</span>
}
