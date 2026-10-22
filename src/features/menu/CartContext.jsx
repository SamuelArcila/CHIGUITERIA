import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

// Cada item: { id, producto, tamano, adiciones, cantidad, precioUnitario }
export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const agregar = (item) => setItems((actual) => [...actual, { ...item, id: crypto.randomUUID() }])
  const cambiarCantidad = (id, cambio) =>
    setItems((actual) =>
      actual.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + cambio } : i)).filter((i) => i.cantidad > 0)
    )
  const vaciar = () => setItems([])
  const total = items.reduce((suma, i) => suma + i.precioUnitario * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, agregar, cambiarCantidad, vaciar, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
