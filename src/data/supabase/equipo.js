import { supabase } from '../../lib/supabase.js'

export async function listarEquipo() {
  const { data, error } = await supabase.from('usuario').select('id, nombre, correo, rol, activo').order('creado_en')
  if (error) throw error
  return data
}

// Crear la cuenta de OTRA persona necesita la clave secreta service_role, que no puede estar en el navegador.
// Por eso lo hace la Edge Function crear-cuenta (supabase/functions/crear-cuenta), que comprueba que quien llama es administrador.
export async function crearCuenta({ nombre, correo, rol }) {
  const { data, error } = await supabase.functions.invoke('crear-cuenta', { body: { nombre, correo, rol } })
  if (error) {
    const detalle = await error.context?.json?.().catch(() => null)
    throw new Error(detalle?.error ?? 'error')
  }
  return { clave: data.clave } // contraseña temporal: se muestra una sola vez
}

export const suscribir = () => () => {} // la lista se carga al entrar a la pantalla
