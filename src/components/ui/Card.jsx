import './Card.css'

// apagada: se ve atenuada (por ejemplo, un producto agotado)
export default function Card({ apagada = false, children }) {
  return <div className={apagada ? 'card card--apagada' : 'card'}>{children}</div>
}
