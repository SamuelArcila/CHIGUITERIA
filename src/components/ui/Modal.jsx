import { useEffect, useRef } from 'react'
import './Modal.css'

// Ventana modal nativa. "children" puede ser una función que recibe cerrar() para cerrarla con foco bien devuelto.
export default function Modal({ titulo, onCerrar, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])
  const cerrar = () => ref.current.close()

  return (
    <dialog ref={ref} className="modal" onClose={onCerrar}>
      <h2>{titulo}</h2>
      {typeof children === 'function' ? children(cerrar) : children}
    </dialog>
  )
}
