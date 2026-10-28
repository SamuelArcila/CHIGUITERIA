import { supabase } from '../../lib/supabase.js'

export async function obtenerCategorias() {
  const { data, error } = await supabase.from('categoria').select('id, nombre').order('orden')
  if (error) throw error
  return data
}

export async function obtenerProductos() {
  const [productos, disponibles] = await Promise.all([
    supabase.from('producto').select('id, categoria_id, nombre, precio, imagen').eq('activo', true).order('nombre'),
    supabase.from('producto_disponible').select('producto_id, disponible, tamanos'),
  ])
  if (productos.error) throw productos.error
  if (disponibles.error) throw disponibles.error
  const porId = new Map(disponibles.data.map((d) => [d.producto_id, d]))
  return productos.data.map((p) => ({
    id: p.id,
    categoriaId: p.categoria_id,
    nombre: p.nombre,
    precio: Number(p.precio),
    imagenUrl: p.imagen ? supabase.storage.from('productos').getPublicUrl(p.imagen).data.publicUrl : null,
    disponible: porId.get(p.id)?.disponible ?? false,
    tamanos: porId.get(p.id)?.tamanos ?? [],
  }))
}

export async function obtenerAdicionesDe(productoId) {
  const { data, error } = await supabase.from('producto_adicion').select('adicion(id, nombre, precio)').eq('producto_id', productoId)
  if (error) throw error
  return data.filter((fila) => fila.adicion).map((fila) => ({ ...fila.adicion, precio: Number(fila.adicion.precio) }))
}
