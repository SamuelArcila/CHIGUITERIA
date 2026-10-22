// CAPA DE DATOS del equipo. Simulación.
// OJO para el backend: crear cuentas de OTRAS personas en Supabase exige la clave "service_role",
// que NUNCA puede ir en el navegador. Debe hacerse en el servidor (por ejemplo, una Edge Function)
// que verifique que quien llama es administrador, genere la contraseña temporal y cree el usuario.
import { crearAlmacen } from './almacenLocal.js'

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))
const almacen = crearAlmacen('capycoffe-equipo-demo', () => [])
export const suscribir = almacen.suscribir

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789' // sin letras que se confunden
function generarClave() {
  return Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => ALFABETO[b % ALFABETO.length]).join('')
}

export async function listarEquipo() {
  await esperar(100)
  return almacen.leer()
}

// Devuelve la contraseña temporal UNA sola vez; no se guarda en ningún lado.
export async function crearCuenta({ nombre, correo, rol }) {
  await esperar(300)
  const cuentas = almacen.leer()
  if (cuentas.some((c) => c.correo.toLowerCase() === correo.toLowerCase())) throw new Error('correo-repetido')
  almacen.guardar([...cuentas, { id: crypto.randomUUID(), nombre, correo, rol, activo: true }])
  return { clave: generarClave() }
}
