import { useEffect, useState } from 'react'
import { obtenerAdicionesDe, obtenerCategorias, obtenerProductos } from '../../data/menu.js'
import CategoryTabs from './CategoryTabs.jsx'
import ProductCard from './ProductCard.jsx'
import ProductDetail from './ProductDetail.jsx'
import CartPanel from './CartPanel.jsx'
import { useCart } from './CartContext.jsx'
import './MenuPage.css'

export default function MenuPage() {
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [activa, setActiva] = useState(null)
  const [seleccion, setSeleccion] = useState(null) // { producto, adiciones }
  const { agregar } = useCart()

  useEffect(() => {
    Promise.all([obtenerCategorias(), obtenerProductos()])
      .then(([cats, prods]) => {
        setCategorias(cats)
        setProductos(prods)
        setActiva(cats[0]?.id ?? null)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  async function elegir(producto) {
    const adiciones = await obtenerAdicionesDe(producto.id)
    setSeleccion({ producto, adiciones })
  }

  const categoriaActiva = categorias.find((c) => c.id === activa)
  const visibles = productos.filter((p) => p.categoriaId === activa)

  return (
    <main className="menu">
      <aside className="menu__lateral">
        <h1>Capycoffe</h1>
        {estado === 'listo' && (
          <CategoryTabs categorias={categorias} activa={activa} onCambiar={setActiva} />
        )}
      </aside>

      <section>
        {estado === 'cargando' && <p className="menu__aviso">Cargando el menú…</p>}
        {estado === 'error' && (
          <p className="menu__aviso">No pudimos cargar el menú. Avisa a un empleado.</p>
        )}
        {estado === 'listo' && (
          <>
            <h2 style={{ fontSize: 'var(--texto-xl)' }}>{categoriaActiva?.nombre}</h2>
            {visibles.length === 0 ? (
              <p className="menu__aviso">Todavía no hay productos en esta categoría.</p>
            ) : (
              <div className="menu__grilla">
                {visibles.map((p) => (
                  <ProductCard key={p.id} producto={p} onElegir={elegir} />
                ))}
              </div>
            )}
          </>
        )}
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
