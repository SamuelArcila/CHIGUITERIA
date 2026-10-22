import { createContext, useContext, useEffect, useState } from 'react'
import { cerrarSesion, iniciarSesion, restaurarSesion } from '../../data/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true) // mientras se revisa si ya había una sesión abierta

  useEffect(() => {
    restaurarSesion()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  async function entrar(datos) {
    const encontrado = await iniciarSesion(datos)
    // El rol elegido en pantalla debe coincidir con el rol real de la cuenta.
    if (encontrado.rol !== datos.rol) {
      await cerrarSesion()
      throw new Error('rol-incorrecto')
    }
    setUsuario(encontrado)
  }

  async function salir() {
    await cerrarSesion()
    setUsuario(null)
  }

  return <AuthContext.Provider value={{ usuario, cargando, entrar, salir }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
