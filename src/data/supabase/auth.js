import { supabase } from '../../lib/supabase.js'

// El rol sale de la tabla usuario, nunca de lo que diga el navegador.
async function cargarPerfil(user) {
  const { data, error } = await supabase.from('usuario').select('nombre, correo, rol, activo').eq('id', user.id).single()
  if (error || !data?.activo) return null
  return { id: user.id, nombre: data.nombre, correo: data.correo, rol: data.rol }
}

export async function iniciarSesion({ correo, clave }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password: clave })
  if (error) throw new Error('credenciales')
  const usuario = await cargarPerfil(data.user)
  if (!usuario) {
    await supabase.auth.signOut()
    throw new Error('sin-acceso')
  }
  return usuario
}

export async function cerrarSesion() {
  await supabase.auth.signOut()
}

export async function restaurarSesion() {
  const { data } = await supabase.auth.getSession()
  return data.session ? cargarPerfil(data.session.user) : null
}
