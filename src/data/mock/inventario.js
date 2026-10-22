// CAPA DE DATOS de inventario. Simulación: nombres, unidades y cantidades son EJEMPLOS, no los insumos reales.
// Igual que en la base de datos, el stock NO se edita: es la suma de movimientos (entradas menos salidas).
import { crearAlmacen } from './almacenLocal.js'

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

const INSUMOS = [
  { id: 'leche', nombre: 'Leche entera', unidad: 'ml', capacidad: 5000, stockMinimo: 1000 },
  { id: 'cafe', nombre: 'Café en grano', unidad: 'g', capacidad: 1000, stockMinimo: 200 },
  { id: 'vasos-medianos', nombre: 'Vasos medianos', unidad: 'unidad', capacidad: 50, stockMinimo: 15 },
]
const STOCK_INICIAL = { leche: 2500, cafe: 700, 'vasos-medianos': 12 }

const almacen = crearAlmacen('capycoffe-inventario-demo', () =>
  Object.entries(STOCK_INICIAL).map(([insumoId, cantidad]) => ({
    insumoId, tipo: 'entrada', cantidad, motivo: 'Inventario inicial', creadoEn: new Date().toISOString(),
  }))
)
export const suscribir = almacen.suscribir

export async function listarInventario() {
  await esperar(100)
  const movimientos = almacen.leer()
  return INSUMOS.map((insumo) => ({
    ...insumo,
    stock: movimientos
      .filter((m) => m.insumoId === insumo.id)
      .reduce((suma, m) => suma + (m.tipo === 'entrada' ? m.cantidad : -m.cantidad), 0),
  }))
}

// Con Supabase: insertar una fila en movimiento_inventario (tipo 'entrada').
export async function registrarEntrada({ insumoId, cantidad, proveedor }) {
  await esperar(200)
  if (!(cantidad > 0)) throw new Error('cantidad-invalida')
  almacen.guardar([
    ...almacen.leer(),
    { insumoId, tipo: 'entrada', cantidad, motivo: 'Reposición', proveedor: proveedor || null, creadoEn: new Date().toISOString() },
  ])
}
