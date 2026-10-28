-- Paso 8: imagen de cada producto. Ejecutar UNA sola vez en el SQL Editor (después de 01, 02 y 03).
-- "imagen" guarda el NOMBRE del archivo dentro del bucket público "productos" de Supabase Storage
-- (por ejemplo: cappuccino.webp). Si queda vacío, el menú muestra un recuadro con la inicial del producto.
alter table producto add column if not exists imagen text;
