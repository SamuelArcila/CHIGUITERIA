// CAPA DE DATOS. Las pantallas piden los datos solo desde aquí.
// Hoy devuelve datos de ejemplo; cuando exista la base de datos (Supabase),
// solo se cambia el contenido de estas funciones y las pantallas no se tocan.
// Nombres y precios son EJEMPLOS, no el menú real de la cafetería.
const TAMANOS = ['S', 'M', 'L']

const categorias = [
  { id: 'calientes', nombre: 'Calientes' },
  { id: 'frias', nombre: 'Frías' },
  { id: 'panaderia', nombre: 'Panadería' },
]

// "disponible" por ahora es un dato fijo. Más adelante lo calculará el backend
// según el stock de los insumos de cada receta.
const productos = [
  { id: 'cappuccino', categoriaId: 'calientes', nombre: 'Cappuccino', precio: 8500, tamanos: TAMANOS, disponible: true },
  { id: 'latte', categoriaId: 'calientes', nombre: 'Latte', precio: 8000, tamanos: TAMANOS, disponible: true },
  { id: 'limonada', categoriaId: 'frias', nombre: 'Limonada', precio: 6500, tamanos: TAMANOS, disponible: true },
  { id: 'croissant', categoriaId: 'panaderia', nombre: 'Croissant', precio: 5500, tamanos: [], disponible: false },
  { id: 'muffin', categoriaId: 'panaderia', nombre: 'Muffin', precio: 6000, tamanos: [], disponible: true },
]

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

export async function obtenerCategorias() {
  await esperar(150)
  return categorias
}

export async function obtenerProductos() {
  await esperar(150)
  return productos
}

// En la base de datos esto será la tabla producto_adicion (qué adiciones admite cada producto).
const adiciones = [
  { id: 'shot-extra', nombre: 'Shot extra', precio: 2000, productoIds: ['cappuccino', 'latte'] },
  { id: 'leche-vegetal', nombre: 'Leche vegetal', precio: 1500, productoIds: ['cappuccino', 'latte'] },
]

export async function obtenerAdicionesDe(productoId) {
  await esperar(100)
  return adiciones.filter((a) => a.productoIds.includes(productoId))
}
