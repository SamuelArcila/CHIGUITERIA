// SESIÓN SIMULADA. HOY ES SOLO VISUAL: acepta cualquier correo y contraseña que no estén vacíos.
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))
const CLAVE = 'capycoffe-sesion'

export async function iniciarSesion({ rol, correo, clave }) {
  await esperar(300)
  if (!correo || !clave) throw new Error('faltan-datos')
  const usuario = { id: 'demo', nombre: correo.split('@')[0], correo, rol }
  sessionStorage.setItem(CLAVE, JSON.stringify(usuario))
  return usuario
}

export async function cerrarSesion() {
  await esperar(100)
  sessionStorage.removeItem(CLAVE)
}

export async function restaurarSesion() {
  try { return JSON.parse(sessionStorage.getItem(CLAVE)) } catch { return null }
}
