-- Capycoffe: seguridad por rol. Ejecutar DESPUÉS de 01_esquema.sql.
-- Quién puede qué:
--   Cliente (sin cuenta, rol "anon"): ver menú y disponibilidad, y crear pedidos SOLO con crear_pedido().
--   Empleado: ver pedidos y avanzarlos a "preparando"; entregarlos con entregar_pedido().
--   Administrador: todo lo del empleado + inventario, catálogo y equipo.
-- Crear cuentas de otras personas NO se hace aquí: lo hace la Edge Function crear-cuenta (clave service_role).

-- 1. Averiguar el rol de quien pregunta
create function rol_actual() returns rol_usuario
language sql stable security definer set search_path = public as $$
  select rol from usuario where id = auth.uid() and activo
$$;
create function es_personal() returns boolean
language sql stable security definer set search_path = public as $$ select rol_actual() is not null $$;
create function es_admin() returns boolean
language sql stable security definer set search_path = public as $$ select coalesce(rol_actual() = 'administrador', false) $$;

-- 2. Permisos de partida: nada para nadie, y luego solo lo necesario
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated;

grant select on categoria, producto, adicion, producto_adicion, producto_disponible to anon, authenticated;
grant select on pedido, detalle_pedido, detalle_adicion, usuario, insumo, receta, movimiento_inventario to authenticated;
grant update (estado) on pedido to authenticated;                       -- el resto de columnas no se toca a mano
grant insert, update, delete on categoria, producto, insumo, receta, adicion, producto_adicion to authenticated;
grant usage on all sequences in schema public to authenticated;
grant select, insert on usuario to service_role;                        -- la Edge Function crear-cuenta (clave secreta)
grant execute on function rol_actual(), es_personal(), es_admin() to anon, authenticated;

-- 3. Políticas (RLS decide FILA por FILA lo que cada rol ve o cambia)
create policy categoria_leer on categoria for select to anon, authenticated using (true);
create policy producto_leer on producto for select to anon, authenticated using (activo or es_personal());
create policy adicion_leer on adicion for select to anon, authenticated using (activo or es_personal());
create policy producto_adicion_leer on producto_adicion for select to anon, authenticated using (true);

create policy categoria_admin on categoria for all to authenticated using (es_admin()) with check (es_admin());
create policy producto_admin on producto for all to authenticated using (es_admin()) with check (es_admin());
create policy adicion_admin on adicion for all to authenticated using (es_admin()) with check (es_admin());
create policy producto_adicion_admin on producto_adicion for all to authenticated using (es_admin()) with check (es_admin());
create policy insumo_admin on insumo for all to authenticated using (es_admin()) with check (es_admin());
create policy receta_admin on receta for all to authenticated using (es_admin()) with check (es_admin());
create policy movimiento_leer on movimiento_inventario for select to authenticated using (es_admin());

create policy pedido_leer on pedido for select to authenticated using (es_personal());
-- Un empleado NO puede poner "entregado" a mano: eso se hace con entregar_pedido(), que también descuenta los insumos.
create policy pedido_avanzar on pedido for update to authenticated
  using (es_personal() and estado <> 'entregado') with check (es_personal() and estado <> 'entregado');
create policy detalle_pedido_leer on detalle_pedido for select to authenticated using (es_personal());
create policy detalle_adicion_leer on detalle_adicion for select to authenticated using (es_personal());
create policy usuario_leer on usuario for select to authenticated using (id = auth.uid() or es_admin());

-- 4. Operaciones controladas (funciones): validan todo en el servidor

-- El cliente crea pedidos solo por aquí. Los precios salen de la base de datos, nunca del navegador.
create function crear_pedido(p_items jsonb) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  v_pedido bigint; v_item jsonb; v_producto producto; v_tamano tamano;
  v_cantidad int; v_detalle bigint; v_adicion jsonb; v_adic adicion;
begin
  if jsonb_typeof(p_items) is distinct from 'array' then raise exception 'Pedido inválido'; end if;
  if jsonb_array_length(p_items) not between 1 and 50 then raise exception 'Pedido inválido'; end if;

  insert into pedido default values returning id into v_pedido;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_producto from producto where id = (v_item->>'producto_id')::bigint and activo;
    if not found then raise exception 'Producto no disponible'; end if;
    if not coalesce((select disponible from producto_disponible where producto_id = v_producto.id), false) then
      raise exception '% está agotado', v_producto.nombre;
    end if;

    v_tamano := nullif(v_item->>'tamano', '')::tamano;
    if not exists (select 1 from receta where producto_id = v_producto.id and tamano is not distinct from v_tamano) then
      raise exception 'Tamaño inválido para %', v_producto.nombre;
    end if;

    v_cantidad := (v_item->>'cantidad')::int;
    if v_cantidad is null or v_cantidad not between 1 and 20 then raise exception 'Cantidad inválida'; end if;

    insert into detalle_pedido (pedido_id, producto_id, tamano, cantidad, precio_unitario)
    values (v_pedido, v_producto.id, v_tamano, v_cantidad, v_producto.precio)
    returning id into v_detalle;

    for v_adicion in select * from jsonb_array_elements(coalesce(v_item->'adiciones', '[]'::jsonb)) loop
      select a.* into v_adic from adicion a
      join producto_adicion pa on pa.adicion_id = a.id and pa.producto_id = v_producto.id
      where a.id = (v_adicion #>> '{}')::bigint and a.activo;
      if not found then raise exception 'Adición inválida'; end if;
      insert into detalle_adicion (detalle_id, adicion_id, precio) values (v_detalle, v_adic.id, v_adic.precio);
    end loop;
  end loop;

  return v_pedido;
end;
$$;

-- Stock actual de cada insumo, solo para el administrador.
create function obtener_inventario()
returns table (insumo_id bigint, nombre text, unidad text, capacidad numeric, stock_minimo numeric, stock numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not es_admin() then raise exception 'Solo el administrador puede ver el inventario'; end if;
  return query
    select s.insumo_id, s.nombre, s.unidad, s.capacidad, s.stock_minimo, s.stock from stock_insumo s order by s.nombre;
end;
$$;

-- Registrar mercancía que llegó (entrada de inventario), solo el administrador.
create function registrar_entrada(p_insumo_id bigint, p_cantidad numeric, p_proveedor text default null)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not es_admin() then raise exception 'Solo el administrador puede registrar entradas'; end if;
  if p_cantidad is null or p_cantidad <= 0 then raise exception 'La cantidad debe ser mayor que cero'; end if;
  insert into movimiento_inventario (insumo_id, tipo, cantidad, motivo, proveedor, usuario_id)
  values (p_insumo_id, 'entrada', p_cantidad, 'Reposición', nullif(trim(p_proveedor), ''), auth.uid());
end;
$$;

grant execute on function crear_pedido(jsonb) to anon, authenticated;
grant execute on function entregar_pedido(bigint) to authenticated;
grant execute on function obtener_inventario() to authenticated;
grant execute on function registrar_entrada(bigint, numeric, text) to authenticated;

-- 5. Tiempo real: avisar a las pantallas cuando cambian los pedidos o el inventario (respeta las políticas de arriba)
alter publication supabase_realtime add table pedido, movimiento_inventario;
