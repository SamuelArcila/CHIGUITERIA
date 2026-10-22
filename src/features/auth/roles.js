// Qué es cada rol y qué pestañas ve. Si cambia un permiso de pantalla, se cambia solo aquí.
export const PESTANAS = {
  pedidos: { ruta: '/staff/pedidos', etiqueta: 'Pedidos' },
  inventario: { ruta: '/staff/inventario', etiqueta: 'Inventario' },
  equipo: { ruta: '/staff/equipo', etiqueta: 'Equipo' },
}

export const ROLES = {
  empleado: { etiqueta: 'Empleado', descripcion: 'Ver y gestionar pedidos', pestanas: ['pedidos'] },
  administrador: { etiqueta: 'Administrador', descripcion: 'Gestionar inventario', pestanas: ['pedidos', 'inventario', 'equipo'] },
}
