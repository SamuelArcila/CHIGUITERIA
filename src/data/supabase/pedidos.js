import { escucharCambios, supabase } from '../../lib/supabase.js'

// El precio NO se envía: lo calcula la base de datos en crear_pedido().
export async function crearPedido(items) {
  const { data, error } = await supabase.rpc('crear_pedido', {
    p_items: items.map((i) => ({
      producto_id: i.producto.id,
      tamano: i.tamano,
      cantidad: i.cantidad,
      adiciones: i.adiciones.map((a) => a.id),
    })),
  })
  if (error) throw error
  return { numero: data }
}

// Pendientes de cualquier fecha y los entregados de las últimas 24 horas.
export async function listarPedidos() {
  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('pedido')
    .select('id, estado, creado_en, detalle_pedido(cantidad, tamano, producto(nombre), detalle_adicion(adicion(nombre)))')
    .or(`estado.neq.entregado,creado_en.gte.${desde}`)
    .order('creado_en')
  if (error) throw error
  return data.map((p) => ({
    id: p.id,
    estado: p.estado,
    creadoEn: p.creado_en,
    items: p.detalle_pedido.map((d) => ({
      nombre: d.producto?.nombre ?? 'Producto',
      tamano: d.tamano,
      cantidad: d.cantidad,
      adiciones: d.detalle_adicion.map((a) => ({ nombre: a.adicion?.nombre ?? '' })),
    })),
  }))
}

// "Entregado" pasa por entregar_pedido(), que además descuenta los insumos en una sola operación.
export async function cambiarEstado(id, estado) {
  if (estado === 'entregado') {
    const { error } = await supabase.rpc('entregar_pedido', { p_pedido_id: id })
    if (error) throw error
    return
  }
  const { error } = await supabase.from('pedido').update({ estado }).eq('id', id)
  if (error) throw error
}

export const suscribir = (avisar) => escucharCambios(['pedido'], avisar)
