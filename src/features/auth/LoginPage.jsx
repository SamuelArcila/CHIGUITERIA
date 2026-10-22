import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { useAuth } from './AuthContext.jsx'
import { ROLES } from './roles.js'
import './Acceso.css'

export default function LoginPage() {
  const { rol } = useParams()
  const { usuario, cargando, entrar } = useAuth()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (cargando) return null
  if (!ROLES[rol]) return <Navigate to="/staff" replace />
  if (usuario) return <Navigate to="/staff/pedidos" replace />

  async function enviar(evento) {
    evento.preventDefault()
    if (!correo.trim() || !clave) {
      setError('Escribe tu correo y tu contraseña.')
      return
    }
    setEnviando(true)
    setError('')
    try {
      await entrar({ rol, correo: correo.trim(), clave })
      navigate('/staff/pedidos', { replace: true })
    } catch (e) {
      setError(
        e.message === 'rol-incorrecto'
          ? `Esta cuenta no es de ${ROLES[rol].etiqueta.toLowerCase()}.`
          : 'Correo o contraseña incorrectos.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="acceso">
      <Link to="/staff" className="acceso__volver">Cambiar rol</Link>
      <div>
        <h1>Ingresar como {ROLES[rol].etiqueta.toLowerCase()}</h1>
        <p>Bienvenido de nuevo.</p>
      </div>
      <form onSubmit={enviar} noValidate>
        <Input etiqueta="Correo electrónico" type="email" autoComplete="username" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input etiqueta="Contraseña" type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} />
        {error && <p className="acceso__error" role="alert">{error}</p>}
        <Button type="submit" tamano="grande" bloque cargando={enviando}>Iniciar sesión</Button>
      </form>
    </main>
  )
}
