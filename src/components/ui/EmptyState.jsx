import './EmptyState.css'

export default function EmptyState({ titulo, children }) {
  return (
    <div className="vacio">
      <h2>{titulo}</h2>
      <p>{children}</p>
    </div>
  )
}
