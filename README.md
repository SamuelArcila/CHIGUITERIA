# Capycoffe UwU

Requisito: tener instalado Node.js (gratis, nodejs.org).

        Seguir estos pasos para abrir la web, esto es en la terminal de la carpeta del proyecto
    npm install     (una sola vez; descarga las herramientas)
    npm run dev     (abre la web en modo desarrollo; el link sale en la terminal)

Estado:Todas las funcionalidades principales estan ya integradas

Rutas:
- /                      pantalla del cliente (sin cuenta)
- /staff                 selector de rol del personal
- /staff/ingresar/:rol   login (empleado o administrador)
- /staff/pedidos         empleado y administrador
- /staff/inventario      solo administrador
- /staff/equipo          solo administrador

NOTA: Las rutas principales son estas dos(/staff , /), abrirlas en dos pestañas diferentes para ver la compatibilidad y la base de datos integrada. Si hay alguna duda o necesitan claves o usuario de administrador consultar a Samuel :v