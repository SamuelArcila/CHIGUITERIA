import { useCallback, useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import { crearCuenta, listarEquipo, suscribir } from '../../data/equipo.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { ROLES } from '../auth/roles.js'
import AddAccountModal from './AddAccountModal.jsx'
import './TeamPage.css'

function Cuenta({ nombre, correo, rol, tu }) {
  return (
    <li className="cuenta">
      <span className="cuenta__avatar" aria-hidden="true">{nombre.slice(0, 2).toUpperCase()}</span>
      <div className="cuenta__datos">
        <strong>{nombre}{tu ? ' (tú)' : ''}</strong>
        {correo && <span>{correo}</span>}
      </div>
      <Badge tipo={rol === 'administrador' ? 'info' : 'neutro'}>{ROLES[rol].etiqueta}</Badge>
    </li>
  )
}

export default function TeamPage() {
  const { usuario } = useAuth()
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [cuentas, setCuentas] = useState([])
  const [agregando, setAgregando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      setCuentas(await listarEquipo())
      setEstado('listo')
    } catch {
      setEstado('error')
    }
  }, [])

  useEffect(() => {
    cargar()
    return suscribir(cargar)
  }, [cargar])

  return (
    <div className="equipo">
      <div className="equipo__cabecera">
        <h1>Equipo</h1>
        <Button onClick={() => setAgregando(true)}>Agregar cuenta</Button>
      </div>
      {estado === 'cargando' && <p className="equipo__aviso">Cargando equipo…</p>}
      {estado === 'error' && <p className="equipo__aviso">No pudimos cargar el equipo. Recarga la página.</p>}
      {estado === 'listo' && (
        <ul className="equipo__lista">
          <Cuenta nombre={usuario.nombre} correo={usuario.correo} rol={usuario.rol} tu />
          {cuentas.filter((c) => c.id !== usuario.id).map((c) => (
            <Cuenta key={c.id} nombre={c.nombre} correo={c.correo} rol={c.rol} />
          ))}
        </ul>
      )}
      {agregando && <AddAccountModal onCerrar={() => setAgregando(false)} onCrear={crearCuenta} />}
    </div>
  )
}
