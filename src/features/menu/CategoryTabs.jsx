import Button from '../../components/ui/Button.jsx'

export default function CategoryTabs({ categorias, activa, onCambiar }) {
  return (
    <nav
      aria-label="Categorías"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}
    >
      {categorias.map((c) => (
        <Button
          key={c.id}
          bloque
          variante={c.id === activa ? 'primario' : 'secundario'}
          aria-pressed={c.id === activa}
          onClick={() => onCambiar(c.id)}
        >
          {c.nombre}
        </Button>
      ))}
    </nav>
  )
}
