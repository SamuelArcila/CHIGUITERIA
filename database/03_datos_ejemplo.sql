-- DATOS DE EJEMPLO solo para probar. Nombres, precios, cantidades y recetas son INVENTADOS:
-- reemplazarlos por los reales de la cafetería. Ejecutar DESPUÉS de 01 y 02.
insert into categoria (nombre, orden) values ('Calientes', 1), ('Frías', 2), ('Panadería', 3);

insert into producto (categoria_id, nombre, precio)
select c.id, v.nombre, v.precio
from (values ('Calientes', 'Cappuccino', 8500), ('Calientes', 'Latte', 8000), ('Panadería', 'Croissant', 5500), ('Panadería', 'Muffin', 6000)) v(cat, nombre, precio)
join categoria c on c.nombre = v.cat;

insert into insumo (nombre, unidad, capacidad, stock_minimo) values
  ('Leche entera', 'ml', 5000, 1000), ('Café en grano', 'g', 1000, 200), ('Vasos medianos', 'unidad', 50, 15),
  ('Croissant', 'unidad', 24, 4), ('Muffin', 'unidad', 24, 4);

-- Stock inicial (el croissant queda en 0 a propósito: aparece "Agotado").
insert into movimiento_inventario (insumo_id, tipo, cantidad, motivo)
select id, 'entrada', case nombre when 'Leche entera' then 2500 when 'Café en grano' then 700 when 'Vasos medianos' then 12 else 10 end, 'Inventario inicial'
from insumo where nombre <> 'Croissant';

-- Bebidas: cantidad base para tamaño M; S = 80 %, L = 130 %. El vaso siempre es 1 unidad.
insert into receta (producto_id, insumo_id, tamano, cantidad)
select p.id, i.id, t.tamano, case when i.nombre = 'Vasos medianos' then 1 else round(r.base * t.factor, 2) end
from producto p
join (values ('Cappuccino', 'Leche entera', 150), ('Cappuccino', 'Café en grano', 18), ('Cappuccino', 'Vasos medianos', 1),
             ('Latte', 'Leche entera', 200), ('Latte', 'Café en grano', 14), ('Latte', 'Vasos medianos', 1)) r(producto, insumo, base) on r.producto = p.nombre
join insumo i on i.nombre = r.insumo
cross join (values ('S'::tamano, 0.8), ('M'::tamano, 1.0), ('L'::tamano, 1.3)) t(tamano, factor);

-- Panadería: sin tamaños, 1 unidad por producto.
insert into receta (producto_id, insumo_id, tamano, cantidad)
select p.id, i.id, null, 1 from producto p join insumo i on i.nombre = p.nombre where p.nombre in ('Croissant', 'Muffin');

insert into adicion (nombre, precio, insumo_id, cantidad_insumo)
select 'Shot extra', 2000, id, 9 from insumo where nombre = 'Café en grano';
insert into adicion (nombre, precio) values ('Leche vegetal', 1500);

insert into producto_adicion (producto_id, adicion_id)
select p.id, a.id from producto p cross join adicion a where p.nombre in ('Cappuccino', 'Latte');
