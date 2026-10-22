// Guarda datos de PRUEBA en el navegador (localStorage) y avisa cuando cambian, incluso entre pestañas.
// Desaparece al conectar Supabase: ahí los datos viven en la base de datos.
export function crearAlmacen(clave, valorInicial) {
  const oyentes = new Set()
  const leer = () => {
    try { return JSON.parse(localStorage.getItem(clave)) ?? valorInicial() } catch { return valorInicial() }
  }
  const guardar = (valor) => {
    localStorage.setItem(clave, JSON.stringify(valor))
    oyentes.forEach((avisar) => avisar())
  }
  const suscribir = (avisar) => {
    oyentes.add(avisar)
    window.addEventListener('storage', avisar)
    return () => {
      oyentes.delete(avisar)
      window.removeEventListener('storage', avisar)
    }
  }
  return { leer, guardar, suscribir }
}
