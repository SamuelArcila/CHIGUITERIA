import { Link, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { ROLES } from './roles.js'
import './Acceso.css'

export default function RoleSelectPage() {
  const { usuario, cargando } = useAuth()
  if (cargando) return null
  if (usuario) return <Navigate to="/staff/pedidos" replace />

  return (
    <main className="acceso">
      <p className="acceso__marca">Capycoffe</p>
      <div>
        <h1>¿Cómo vas a ingresar?</h1>
        <p>Selecciona tu rol para continuar.</p>
      </div>
      <nav className="acceso__roles" aria-label="Roles">
        {Object.entries(ROLES).map(([id, rol]) => (
          <Link key={id} to={`/staff/ingresar/${id}`} className="rol">
            <strong>{rol.etiqueta}</strong>
            <span>{rol.descripcion}</span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
