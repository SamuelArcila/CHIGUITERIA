import Button from './components/ui/Button.jsx'
import Badge from './components/ui/Badge.jsx'
import Card from './components/ui/Card.jsx'

// Página temporal para ver los componentes base. Se reemplaza en el paso 2 por el menú real.
// Los nombres y precios son datos de ejemplo, no el menú definitivo.
const seccion = { marginTop: 'var(--espacio-8)' }
const fila = { display: 'flex', gap: 'var(--espacio-4)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--espacio-4)' }

export default function App() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: 'var(--espacio-8) var(--espacio-4)' }}>
      <h1 style={{ fontSize: 'var(--texto-2xl)' }}>Capycoffe: componentes base</h1>
      <p style={{ color: 'var(--color-tinta-suave)' }}>Datos de ejemplo para revisar colores, tamaños y estados.</p>

      <section style={seccion}>
        <h2 style={{ fontSize: 'var(--texto-xl)' }}>Botones</h2>
        <div style={fila}>
          <Button>Agregar al carrito</Button>
          <Button variante="secundario">Cancelar</Button>
          <Button disabled>Agotado</Button>
          <Button cargando>Guardar</Button>
        </div>
        <div style={fila}>
          <Button tamano="grande">Confirmar pedido</Button>
        </div>
      </section>

      <section style={seccion}>
        <h2 style={{ fontSize: 'var(--texto-xl)' }}>Etiquetas de estado</h2>
        <div style={fila}>
          <Badge tipo="ok">Disponible</Badge>
          <Badge tipo="error">Agotado</Badge>
          <Badge tipo="aviso">Preparando</Badge>
          <Badge tipo="info">Recibido</Badge>
        </div>
      </section>

      <section style={seccion}>
        <h2 style={{ fontSize: 'var(--texto-xl)' }}>Tarjetas</h2>
        <div style={{ ...fila, alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 300px' }}>
            <Card>
              <h3 style={{ fontSize: 'var(--texto-lg)' }}>Cappuccino</h3>
              <p style={{ margin: 'var(--espacio-2) 0 var(--espacio-4)', fontWeight: 700 }}>$8.500</p>
              <Badge tipo="ok">Disponible</Badge>
            </Card>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <Card apagada>
              <h3 style={{ fontSize: 'var(--texto-lg)' }}>Croissant</h3>
              <p style={{ margin: 'var(--espacio-2) 0 var(--espacio-4)', fontWeight: 700 }}>$5.500</p>
              <Badge tipo="error">Agotado</Badge>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
