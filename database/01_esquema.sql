-- Capycoffe: esquema de base de datos (PostgreSQL 15+, pensado para Supabase).
-- Ejecutar completo en el SQL Editor de Supabase. Los dos backend lo revisan antes de usarlo.

create type rol_usuario as enum ('empleado', 'administrador');
create type estado_pedido as enum ('recibido', 'preparando', 'entregado');
create type tipo_movimiento as enum ('entrada', 'salida');
create type tamano as enum ('S', 'M', 'L');

-- Cuentas del personal. El cliente NO tiene cuenta.
create table usuario (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  correo text not null unique,
  rol rol_usuario not null default 'empleado',
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table categoria (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  orden int not null default 0
);

create table producto (
  id bigint generated always as identity primary key,
  categoria_id bigint not null references categoria (id),
  nombre text not null,
  precio numeric(10,0) not null check (precio >= 0),
  activo boolean not null default true
);

create table insumo (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  unidad text not null,                         -- 'g', 'ml', 'unidad'
  capacidad numeric(12,2) check (capacidad > 0), -- cantidad cuando está "lleno" (para la barra de stock)
  stock_minimo numeric(12,2) not null default 0 -- por debajo se muestra "Bajo stock"
);

-- Cuánto insumo gasta una unidad de un producto. tamano NULL = producto sin tamaños.
-- Un producto sin receta nunca aparece como disponible.
create table receta (
  id bigint generated always as identity primary key,
  producto_id bigint not null references producto (id) on delete cascade,
  insumo_id bigint not null references insumo (id),
  tamano tamano,
  cantidad numeric(12,2) not null check (cantidad > 0),
  unique nulls not distinct (producto_id, insumo_id, tamano)
);

create table adicion (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  precio numeric(10,0) not null default 0 check (precio >= 0),
  insumo_id bigint references insumo (id),      -- insumo que gasta (opcional)
  cantidad_insumo numeric(12,2) check (cantidad_insumo > 0),
  activo boolean not null default true,
  check ((insumo_id is null) = (cantidad_insumo is null))
);

-- Qué adiciones admite cada producto.
create table producto_adicion (
  producto_id bigint references producto (id) on delete cascade,
  adicion_id bigint references adicion (id) on delete cascade,
  primary key (producto_id, adicion_id)
);

create table pedido (
  id bigint generated always as identity primary key, -- se muestra al cliente como número de pedido
  estado estado_pedido not null default 'recibido',
  creado_en timestamptz not null default now(),
  entregado_en timestamptz,
  entregado_por uuid references usuario (id)
);

create table detalle_pedido (
  id bigint generated always as identity primary key,
  pedido_id bigint not null references pedido (id) on delete cascade,
  producto_id bigint not null references producto (id),
  tamano tamano,
  cantidad int not null check (cantidad > 0),
  precio_unitario numeric(10,0) not null       -- precio base al momento de pedir
);

create table detalle_adicion (
  detalle_id bigint not null references detalle_pedido (id) on delete cascade,
  adicion_id bigint not null references adicion (id),
  precio numeric(10,0) not null,
  primary key (detalle_id, adicion_id)
);

-- El stock NO se edita a mano: es la suma de entradas menos salidas.
create table movimiento_inventario (
  id bigint generated always as identity primary key,
  insumo_id bigint not null references insumo (id),
  tipo tipo_movimiento not null,
  cantidad numeric(12,2) not null check (cantidad > 0),
  motivo text,                                   -- 'Reposición', 'Venta', 'Merma'...
  proveedor text,
  pedido_id bigint references pedido (id),       -- si fue por una venta
  usuario_id uuid references usuario (id),
  creado_en timestamptz not null default now()
);

-- Stock actual de cada insumo (puede ser negativo si se vendió más de lo registrado: refleja la realidad).
create view stock_insumo as
select i.id as insumo_id, i.nombre, i.unidad, i.capacidad, i.stock_minimo,
       coalesce(sum(case m.tipo when 'entrada' then m.cantidad else -m.cantidad end), 0) as stock
from insumo i
left join movimiento_inventario m on m.insumo_id = i.id
group by i.id;
revoke all on stock_insumo from anon;           -- el cliente no debe ver el stock, solo disponible/agotado

-- Un producto está disponible si, para al menos un tamaño, alcanza el stock de todos sus insumos.
-- "tamanos" son los tamaños que tiene en sus recetas (vacío si no tiene tamaños). El cliente solo lee esta vista.
create view producto_disponible as
select p.id as producto_id,
       coalesce(bool_or(t.alcanza), false) as disponible,
       coalesce(array_agg(t.tamano order by t.tamano) filter (where t.tamano is not null), '{}') as tamanos
from producto p
left join (
  select r.producto_id, r.tamano, bool_and(s.stock >= r.cantidad) as alcanza
  from receta r
  join stock_insumo s on s.insumo_id = r.insumo_id
  group by r.producto_id, r.tamano
) t on t.producto_id = p.id
group by p.id;

-- Marcar un pedido como entregado y descontar los insumos, todo en una sola operación.
-- El bloqueo "for update" evita que dos empleados lo descuenten dos veces.
create function entregar_pedido(p_pedido_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  p pedido;
begin
  if not exists (select 1 from usuario where id = auth.uid() and activo) then
    raise exception 'Solo el personal puede entregar pedidos';
  end if;

  select * into p from pedido where id = p_pedido_id for update;
  if not found then raise exception 'El pedido no existe'; end if;
  if p.estado = 'entregado' then raise exception 'El pedido ya fue entregado'; end if;

  insert into movimiento_inventario (insumo_id, tipo, cantidad, motivo, pedido_id, usuario_id)
  select r.insumo_id, 'salida', sum(r.cantidad * d.cantidad), 'Venta', p.id, auth.uid()
  from detalle_pedido d
  join receta r on r.producto_id = d.producto_id and r.tamano is not distinct from d.tamano
  where d.pedido_id = p.id
  group by r.insumo_id;

  insert into movimiento_inventario (insumo_id, tipo, cantidad, motivo, pedido_id, usuario_id)
  select a.insumo_id, 'salida', sum(a.cantidad_insumo * d.cantidad), 'Venta (adición)', p.id, auth.uid()
  from detalle_adicion da
  join detalle_pedido d on d.id = da.detalle_id
  join adicion a on a.id = da.adicion_id
  where d.pedido_id = p.id and a.insumo_id is not null
  group by a.insumo_id;

  update pedido
  set estado = 'entregado', entregado_en = now(), entregado_por = auth.uid()
  where id = p.id;
end;
$$;
revoke execute on function entregar_pedido(bigint) from public, anon;
grant execute on function entregar_pedido(bigint) to authenticated;

-- Seguridad: con RLS activado y sin políticas, NADIE puede leer ni escribir por la API.
-- Las políticas por rol (cliente, empleado, administrador) están en 02_politicas.sql.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table %I enable row level security', t);
  end loop;
end;
$$;
