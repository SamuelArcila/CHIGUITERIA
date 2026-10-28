# Capycoffe

Aplicación web del menú de clientes y las pantallas de pedidos, inventario y equipo. Está construida con React y Vite.

## Ejecutar en modo de demostración

Desde la carpeta del proyecto:

```sh
npm install
npm run dev
```

Abre la dirección que muestra la terminal. Sin variables Supabase configuradas, la app usa datos de demostración.

## Conectar Supabase

1. En el SQL Editor ejecuta, en este orden, `database/01_esquema.sql`, `database/02_politicas.sql` y, si quieres productos de ejemplo, `database/03_datos_ejemplo.sql`.
2. Crea el primer usuario administrador en **Authentication > Users** y copia su UUID. En el SQL Editor crea su perfil:

   ```sql
   insert into usuario (id, nombre, correo, rol)
   values ('UUID-DEL-USUARIO', 'Tu nombre', 'tu@correo.com', 'administrador');
   ```

3. Copia `.env.example` como `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. La clave publishable puede estar en el navegador; nunca pongas una clave secret o `service_role` allí.
4. Reinicia `npm run dev` para que Vite lea las variables.
5. Para crear cuentas desde Equipo, despliega la Edge Function `crear-cuenta`. La función usa la clave secreta del entorno de Supabase; no la agregues al `.env` de la app. Antes de publicar, limita el CORS al dominio de la aplicación.

## Agregar fotos de productos (paso 8)

1. En **Supabase > SQL Editor**, ejecuta `database/04_imagenes.sql` una sola vez, después del esquema y las políticas. Esto agrega la columna `imagen` a `producto`.
2. Prepara una foto por producto, idealmente en formato WebP o JPG, proporción 4:3 (por ejemplo, 800 × 600 píxeles) y menos de 100 KB. Puedes redimensionarlas y comprimirlas gratis en [Squoosh](https://squoosh.app/). Mantén una iluminación y un fondo similares entre fotos.
3. En **Supabase > Storage**, crea un bucket llamado `productos` y activa la opción de bucket público para que el menú pueda mostrar las imágenes.
4. Abre el bucket `productos` y sube tus archivos. Usa nombres sencillos y únicos, por ejemplo `cappuccino.webp` o `croissant.jpg`.
5. En **Table Editor > producto**, escribe en la columna `imagen` el nombre o la ruta del archivo dentro del bucket, por ejemplo `cappuccino.webp`. Si subiste la imagen dentro de una carpeta, guarda la ruta relativa completa, por ejemplo `bebidas/cappuccino.webp`.
6. Recarga el menú. Los productos con imagen la mostrarán en la tarjeta; si la imagen no está registrada o no carga, aparecerá la inicial del producto. Los productos agotados muestran la etiqueta sobre la foto en escala de grises.

El menú abre en **Todo el menú** y organiza los productos por categoría. Puedes elegir una categoría desde la navegación lateral.

## Notas de seguridad

La clave publishable es pública y depende de las reglas RLS de `database/02_politicas.sql`. La clave secret nunca debe salir del entorno del servidor. Después de crear y verificar la primera cuenta administradora, desactiva el registro público de usuarios en la configuración de Authentication; las cuentas de personal se crean desde la función protegida.

La integración de la Edge Function y los cambios SQL deben verificarse en un proyecto Supabase de desarrollo antes de usarlos con datos reales.
