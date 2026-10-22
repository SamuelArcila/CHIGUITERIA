import { createClient } from '@supabase/supabase-js'

// Sin variables en el archivo .env la app funciona con datos de prueba (modo simulado).
const url = import.meta.env?.VITE_SUPABASE_URL
const clave = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY // la anon es la clave antigua
export const supabase = url && clave ? createClient(url, clave) : null

// Avisa cuando cambian filas en esas tablas (tiempo real). Devuelve la función para dejar de escuchar.
export function escucharCambios(tablas, avisar) {
  const canal = supabase.channel(`cambios-${crypto.randomUUID()}`)
  tablas.forEach((tabla) => canal.on('postgres_changes', { event: '*', schema: 'public', table: tabla }, avisar))
  canal.subscribe()
  return () => supabase.removeChannel(canal)
}
