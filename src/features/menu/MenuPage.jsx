import { useEffect, useState } from 'react'
import { obtenerAdicionesDe, obtenerCategorias, obtenerProductos } from '../../data/menu.js'
import CartPanel from './CartPanel.jsx'
import { useCart } from './CartContext.jsx'
import CategoryTabs from './CategoryTabs.jsx'
import ProductCard from './ProductCard.jsx'
import ProductDetail from './ProductDetail.jsx'
import './MenuPage.css'

const TODO = { id: 'todo', nombre: 'Todo el menú' }

export default function MenuPage() {
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [activa, setActiva] = useState(TODO.id)
  const [seleccion, setSeleccion] = useState(null) // { producto, adiciones }
  const { agregar } = useCart()

  useEffect(() => {
    Promise.all([obtenerCategorias(), obtenerProductos()])
      .then(([cats, prods]) => {
        setCategorias(cats)
        setProductos(prods)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  async function elegir(producto) {
    const adiciones = await obtenerAdicionesDe(producto.id)
    setSeleccion({ producto, adiciones })
  }

  // "Todo el menú" muestra cada categoría con productos, una debajo de otra; así la página se aprovecha completa.
  const deCategoria = (c) => ({ categoria: c, productos: productos.filter((p) => p.categoriaId === c.id) })
  const secciones =
    activa === TODO.id
      ? categorias.map(deCategoria).filter((s) => s.productos.length > 0)
      : categorias.filter((c) => c.id === activa).map(deCategoria)

  return (
    <main className="menu">
      <aside className="menu__lateral">
        <h1>Capycoffe</h1>
        {estado === 'listo' && (
          <CategoryTabs categorias={[TODO, ...categorias]} activa={activa} onCambiar={setActiva} />
        )}
      </aside>

      <section className="menu__centro">
        {estado === 'cargando' && <p className="menu__aviso">Cargando el menú…</p>}
        {estado === 'error' && <p className="menu__aviso">No pudimos cargar el menú. Avisa a un empleado.</p>}
        {estado === 'listo' && secciones.length === 0 && <p className="menu__aviso">Todavía no hay productos en el menú.</p>}
        {estado === 'listo' &&
          secciones.map(({ categoria, productos: lista }) => (
            <div key={categoria.id} className="menu__seccion">
              <h2>{categoria.nombre}</h2>
              {lista.length === 0 ? (
                <p className="menu__aviso">Todavía no hay productos en esta categoría.</p>
              ) : (
                <div className="menu__grilla">
                  {lista.map((p) => (
                    <ProductCard key={p.id} producto={p} onElegir={elegir} />
                  ))}
                </div>
              )}
            </div>
          ))}
      </section>

      <CartPanel />

      {seleccion && (
        <ProductDetail
          key={seleccion.producto.id}
          producto={seleccion.producto}
          adiciones={seleccion.adiciones}
          onCerrar={() => setSeleccion(null)}
          onAgregar={agregar}
        />
      )}
    </main>
  )
}
