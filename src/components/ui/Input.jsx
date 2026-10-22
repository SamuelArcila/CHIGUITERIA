import { useId } from 'react'
import './Input.css'

// Campo de texto con su etiqueta enlazada (necesario para lectores de pantalla y para tocar la etiqueta).
export default function Input({ etiqueta, ...resto }) {
  const id = useId()
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} {...resto} />
    </div>
  )
}
