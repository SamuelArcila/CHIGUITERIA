// Edge Function de Supabase: crea la cuenta de una persona del equipo. SOLO puede pedirla un administrador.
// Usa la clave service_role, que Supabase inyecta en el servidor: nunca debe ir en el código del navegador.
// SIN PROBAR contra un proyecto real de Supabase: el backend debe probarla antes de usarla.
// Se despliega con la verificación de JWT apagada: la función comprueba por su cuenta que quien llama es administrador.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*', // en producción, cambiar por el dominio real de la app
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  // Clave secreta: formato nuevo (un JSON con las claves por nombre) o, si no existe, la antigua service_role.
  const secretas = Deno.env.get('SUPABASE_SECRET_KEYS')
  const claveSecreta = secretas ? JSON.parse(secretas)['default'] : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, claveSecreta)

  // 1. ¿Quién llama y es administrador activo?
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  const { data: { user } } = await admin.auth.getUser(token)
  if (!user) return json({ error: 'no-autenticado' }, 401)
  const { data: quien } = await admin.from('usuario').select('rol, activo').eq('id', user.id).single()
  if (!quien?.activo || quien.rol !== 'administrador') return json({ error: 'sin-permiso' }, 403)

  // 2. Validar los datos
  const { nombre, correo, rol } = await req.json().catch(() => ({}))
  if (!nombre?.trim() || !/^\S+@\S+\.\S+$/.test(correo ?? '') || !['empleado', 'administrador'].includes(rol)) {
    return json({ error: 'datos-invalidos' }, 400)
  }

  // 3. Crear la cuenta con una contraseña temporal aleatoria y su perfil con rol
  const clave = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => ALFABETO[b % ALFABETO.length]).join('')
  const { data: creado, error } = await admin.auth.admin.createUser({ email: correo.trim(), password: clave, email_confirm: true })
  if (error || !creado.user) {
    return json({ error: /already|registered/i.test(error?.message ?? '') ? 'correo-repetido' : 'no-se-pudo-crear' }, 400)
  }
  const { error: errorPerfil } = await admin.from('usuario').insert({ id: creado.user.id, nombre: nombre.trim(), correo: correo.trim(), rol })
  if (errorPerfil) {
    await admin.auth.admin.deleteUser(creado.user.id) // no dejar una cuenta sin perfil
    return json({ error: 'no-se-pudo-crear' }, 500)
  }
  return json({ clave })
})
