import { escucharCambios, supabase } from '../../lib/supabase.js'

export async function listarInventario() {
  const { data, error } = await supabase.rpc('obtener_inventario')
  if (error) throw error
  return data.map((i) => ({
    id: i.insumo_id,
    nombre: i.nombre,
    unidad: i.unidad,
    capacidad: i.capacidad == null ? null : Number(i.capacidad),
    stockMinimo: Number(i.stock_minimo),
    stock: Number(i.stock),
  }))
}

export async function registrarEntrada({ insumoId, cantidad, proveedor }) {
  const { error } = await supabase.rpc('registrar_entrada', {
    p_insumo_id: insumoId,
    p_cantidad: cantidad,
    p_proveedor: proveedor || null,
  })
  if (error) throw error
}

export const suscribir = (avisar) => escucharCambios(['movimiento_inventario'], avisar)
