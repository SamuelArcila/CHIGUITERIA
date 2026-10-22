# Capycoffe

Requisito: tener instalado Node.js (gratis, nodejs.org).

    npm install     (una sola vez; descarga las herramientas)
    npm run dev     (abre la web en modo desarrollo; el link sale en la terminal)

Estado: paso 7 (conexión con Supabase lista; sin variables en .env sigue funcionando con datos de prueba).

Rutas:
- /                      pantalla del cliente (sin cuenta)
- /staff                 selector de rol del personal
- /staff/ingresar/:rol   login (empleado o administrador)
- /staff/pedidos         empleado y administrador
- /staff/inventario      solo administrador
- /staff/equipo          solo administrador

IMPORTANTE: el login es solo visual por ahora. Acepta cualquier correo y contraseña que no estén vacíos.
La sesión real y los roles llegan al conectar Supabase.
La guía de componentes del paso 1 está en src/GuiaComponentes.jsx.

Cómo probar el paso 5 (simulación): abre "/" en una pestaña y "/staff/pedidos" (entrando como empleado) en otra,
ambas en el mismo navegador y con el mismo link. Haz un pedido en la primera y míralo aparecer en la segunda.
Los pedidos de prueba se guardan en el navegador; para borrarlos, borra los datos del sitio.

## Conectar con Supabase (paso 7)
Sin configurar nada, la app usa datos de prueba. Para usar la base de datos real:
1. En supabase.com crea un proyecto (plan gratuito).
2. En SQL Editor ejecuta, en este orden: database/01_esquema.sql, database/02_politicas.sql y, para probar, database/03_datos_ejemplo.sql (datos inventados).
3. Crea la primera cuenta de administrador: Authentication > Users > Add user (marca "Auto Confirm User"). Copia su UUID y ejecuta en SQL Editor:
   insert into usuario (id, nombre, correo, rol) values ('EL-UUID', 'Tu nombre', 'tu@correo.com', 'administrador');
4. Copia .env.example como .env y llena VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (botón Connect, o Settings > API Keys). Nunca pongas ahí una clave secreta (secret / service_role).
5. Para crear cuentas desde la pantalla Equipo, publica la función crear-cuenta (carpeta supabase/functions) con la verificación de JWT apagada. Está sin probar. Mira la guía paso a paso.
6. Reinicia npm run dev.
