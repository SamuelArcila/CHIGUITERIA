import { NavLink, Navigate, Outlet } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from './AuthContext.jsx'
import { PESTANAS, ROLES } from './roles.js'
import './StaffLayout.css'

export default function StaffLayout() {
  const { usuario, cargando, salir } = useAuth()
  if (cargando) return null
  if (!usuario) return <Navigate to="/staff" replace />
  const rol = ROLES[usuario.rol]

  return (
    <div className="staff">
      <header className="staff__barra">
        <div className="staff__persona">
          <span className="staff__avatar" aria-hidden="true">{usuario.nombre.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{usuario.nombre}</strong>
            <span>{rol.etiqueta}</span>
          </div>
        </div>
        <Button variante="secundario" onClick={salir}>Cerrar sesión</Button>
      </header>

      <main className="staff__contenido"><Outlet /></main>

      <nav className="staff__pestanas" aria-label="Secciones">
        {rol.pestanas.map((id) => (
          <NavLink key={id} to={PESTANAS[id].ruta}>{PESTANAS[id].etiqueta}</NavLink>
        ))}
      </nav>
    </div>
  )
}
