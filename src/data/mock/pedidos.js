// CAPA DE DATOS de pedidos. HOY es una simulación: guarda los pedidos en el navegador (localStorage),
// así que un pedido hecho en "/" aparece en "/staff/pedidos" si ambas pestañas son del mismo navegador.
// Con Supabase, estas mismas funciones leerán y escribirán en las tablas pedido y detalle_pedido,
// y "entregado" llamará a la función entregar_pedido de la base de datos (que descuenta los insumos).
import { crearAlmacen } from './almacenLocal.js'

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))
const { leer, guardar, suscribir } = crearAlmacen('capycoffe-pedidos-demo', () => [])
export { suscribir } // avisa cuando cambian los pedidos (con Supabase será "tiempo real")

// Estados: 'recibido' -> 'preparando' -> 'entregado'
export async function crearPedido(items) {
  await esperar(300)
  const pedidos = leer()
  const id = Math.max(0, ...pedidos.map((p) => p.id)) + 1
  const pedido = {
    id,
    estado: 'recibido',
    creadoEn: new Date().toISOString(),
    items: items.map((i) => ({
      productoId: i.producto.id,
      nombre: i.producto.nombre,
      tamano: i.tamano,
      adiciones: i.adiciones.map((a) => ({ id: a.id, nombre: a.nombre, precio: a.precio })),
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
    })),
  }
  guardar([...pedidos, pedido])
  return { numero: id }
}

export async function listarPedidos() {
  await esperar(100)
  return leer()
}

export async function cambiarEstado(id, estado) {
  await esperar(100)
  const ahora = new Date().toISOString()
  guardar(leer().map((p) => (p.id === id ? { ...p, estado, ...(estado === 'entregado' ? { entregadoEn: ahora } : {}) } : p)))
}
