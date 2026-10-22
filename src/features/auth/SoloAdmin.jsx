import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

// Esto solo mejora la experiencia: la seguridad real la ponen las reglas de la base de datos.
export default function SoloAdmin({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return null
  return usuario?.rol === 'administrador' ? children : <Navigate to="/staff/pedidos" replace />
}
