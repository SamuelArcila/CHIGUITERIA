import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { ROLES } from '../auth/roles.js'

export default function AddAccountModal({ onCerrar, onCrear }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [rol, setRol] = useState('empleado') // por defecto empleado: dar permisos de administrador es una decisión explícita
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [clave, setClave] = useState(null)

  return (
    <Modal titulo={clave ? 'Cuenta creada' : 'Agregar cuenta'} onCerrar={onCerrar}>
      {(cerrar) => {
        async function enviar(evento) {
          evento.preventDefault()
          if (!nombre.trim() || !/^\S+@\S+\.\S+$/.test(correo.trim())) {
            setError('Escribe el nombre y un correo válido.')
            return
          }
          setEnviando(true)
          setError('')
          try {
            const resultado = await onCrear({ nombre: nombre.trim(), correo: correo.trim(), rol })
            setClave(resultado.clave)
          } catch (e) {
            setError(e.message === 'correo-repetido' ? 'Ya existe una cuenta con ese correo.' : 'No pudimos crear la cuenta. Intenta de nuevo.')
          } finally {
            setEnviando(false)
          }
        }

        if (clave) {
          return (
            <div className="modal__cuerpo">
              <p className="modal__ayuda">Contraseña temporal para {correo.trim()}. Entrégasela a la persona: no se vuelve a mostrar.</p>
              <p className="modal__clave">{clave}</p>
              <div className="modal__acciones"><Button onClick={cerrar}>Listo</Button></div>
            </div>
          )
        }
        return (
          <form onSubmit={enviar} noValidate>
            <Input etiqueta="Nombre completo" type="text" autoComplete="off" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Input etiqueta="Correo electrónico" type="email" autoComplete="off" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <div>
              <p style={{ margin: '0 0 var(--espacio-2)', fontWeight: 600 }}>Rol</p>
              <div className="modal__opciones">
                {Object.entries(ROLES).map(([id, r]) => (
                  <Button key={id} type="button" variante={id === rol ? 'primario' : 'secundario'} aria-pressed={id === rol} onClick={() => setRol(id)}>
                    {r.etiqueta}
                  </Button>
                ))}
              </div>
            </div>
            <p className="modal__ayuda">La contraseña temporal se genera sola al crear la cuenta.</p>
            {error && <p className="modal__error" role="alert">{error}</p>}
            <div className="modal__acciones">
              <Button type="button" variante="secundario" disabled={enviando} onClick={cerrar}>Cancelar</Button>
              <Button type="submit" cargando={enviando}>Crear cuenta</Button>
            </div>
          </form>
        )
      }}
    </Modal>
  )
}
