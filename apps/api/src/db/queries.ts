export const queries = {
  healthcheck: 'select current_database() as database, now() as server_time',
  areas: `
    select id_area as id, nombre_area as nombre, descripcion, activo
    from areas
    order by nombre_area asc
  `,
  cargos: `
    select id_cargo as id, nombre_cargo as nombre, descripcion, activo
    from cargos
    order by nombre_cargo asc
  `,
  condicionesLaborales: `
    select id_condicion_laboral as id, nombre_condicion_laboral as nombre, descripcion, activo
    from condiciones_laborales
    order by nombre_condicion_laboral asc
  `,
  horarios: `
    select
      id_horario as id,
      codigo_horario as codigo,
      nombre_horario as nombre,
      to_char(hora_entrada, 'HH24:MI') as "horaEntrada",
      to_char(hora_salida, 'HH24:MI') as "horaSalida",
      tolerancia_entrada_minutos as "toleranciaEntrada",
      tolerancia_salida_minutos as "toleranciaSalida",
      descripcion,
      case when activo then 'activo' else 'inactivo' end as estado
    from horarios
    order by nombre_horario asc
  `,
  horarioById: `
    select
      id_horario as id,
      codigo_horario as codigo,
      nombre_horario as nombre,
      to_char(hora_entrada, 'HH24:MI') as "horaEntrada",
      to_char(hora_salida, 'HH24:MI') as "horaSalida",
      tolerancia_entrada_minutos as "toleranciaEntrada",
      tolerancia_salida_minutos as "toleranciaSalida",
      descripcion,
      case when activo then 'activo' else 'inactivo' end as estado
    from horarios
    where id_horario = $1
  `,
  insertHorario: `
    insert into horarios (
      codigo_horario,
      nombre_horario,
      hora_entrada,
      hora_salida,
      tolerancia_entrada_minutos,
      tolerancia_salida_minutos,
      descripcion,
      activo
    ) values (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) returning id_horario as id
  `,
  updateHorario: `
    update horarios
    set
      codigo_horario = $2,
      nombre_horario = $3,
      hora_entrada = $4,
      hora_salida = $5,
      tolerancia_entrada_minutos = $6,
      tolerancia_salida_minutos = $7,
      descripcion = $8,
      activo = $9
    where id_horario = $1
    returning id_horario as id
  `,
  updateHorarioActivo: `
    update horarios
    set activo = $2
    where id_horario = $1
    returning id_horario as id
  `,
  trabajadores: `
    select
      t.id_trabajador as id,
      coalesce(t.dni, '') as dni,
      t.codigo_trabajador as "codigoInterno",
      t.apellidos,
      t.nombres,
      trim(t.apellidos || ' ' || t.nombres) as "nombreCompleto",
      t.id_cargo as "cargoId",
      c.nombre_cargo as "cargoNombre",
      t.id_area as "areaId",
      a.nombre_area as "areaNombre",
      t.id_condicion_laboral as "condicionLaboralId",
      cl.nombre_condicion_laboral as "condicionLaboralNombre",
      to_char(t.fecha_ingreso, 'YYYY-MM-DD') as "fechaIngreso",
      t.correo,
      t.telefono,
      t.observacion,
      case when t.activo then 'activo' else 'inactivo' end as estado,
      case
        when tb.userid_biometrico is not null then 'vinculado'
        when t.codigo_biometrico is not null then 'pendiente'
        else 'sin-vinculacion'
      end as "estadoBiometrico"
    from trabajadores t
    left join cargos c on c.id_cargo = t.id_cargo
    left join areas a on a.id_area = t.id_area
    left join condiciones_laborales cl on cl.id_condicion_laboral = t.id_condicion_laboral
    left join trabajador_biometrico tb on tb.id_trabajador = t.id_trabajador and tb.activo = true
    order by t.apellidos asc, t.nombres asc
  `,
  trabajadorById: `
    select
      t.id_trabajador as id,
      coalesce(t.dni, '') as dni,
      t.codigo_trabajador as "codigoInterno",
      t.apellidos,
      t.nombres,
      trim(t.apellidos || ' ' || t.nombres) as "nombreCompleto",
      t.id_cargo as "cargoId",
      c.nombre_cargo as "cargoNombre",
      t.id_area as "areaId",
      a.nombre_area as "areaNombre",
      t.id_condicion_laboral as "condicionLaboralId",
      cl.nombre_condicion_laboral as "condicionLaboralNombre",
      to_char(t.fecha_ingreso, 'YYYY-MM-DD') as "fechaIngreso",
      t.correo,
      t.telefono,
      t.observacion,
      case when t.activo then 'activo' else 'inactivo' end as estado,
      case
        when tb.userid_biometrico is not null then 'vinculado'
        when t.codigo_biometrico is not null then 'pendiente'
        else 'sin-vinculacion'
      end as "estadoBiometrico"
    from trabajadores t
    left join cargos c on c.id_cargo = t.id_cargo
    left join areas a on a.id_area = t.id_area
    left join condiciones_laborales cl on cl.id_condicion_laboral = t.id_condicion_laboral
    left join trabajador_biometrico tb on tb.id_trabajador = t.id_trabajador and tb.activo = true
    where t.id_trabajador = $1
  `,
  insertTrabajador: `
    insert into trabajadores (
      dni,
      codigo_trabajador,
      apellidos,
      nombres,
      id_cargo,
      id_area,
      id_condicion_laboral,
      fecha_ingreso,
      activo,
      correo,
      telefono,
      observacion
    ) values (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) returning id_trabajador as id
  `,
  updateTrabajador: `
    update trabajadores
    set
      dni = $2,
      codigo_trabajador = $3,
      apellidos = $4,
      nombres = $5,
      id_cargo = $6,
      id_area = $7,
      id_condicion_laboral = $8,
      fecha_ingreso = $9,
      activo = $10,
      correo = $11,
      telefono = $12,
      observacion = $13
    where id_trabajador = $1
    returning id_trabajador as id
  `,
  updateTrabajadorActivo: `
    update trabajadores
    set activo = $2
    where id_trabajador = $1
    returning id_trabajador as id
  `,
  controlDiario: `
    with fecha_objetivo as (
      select coalesce($1::date, (select max(fecha_marcacion) from marcaciones), current_date) as fecha
    )
    select
      t.id_trabajador as id,
      t.id_trabajador as "trabajadorId",
      trim(t.apellidos || ' ' || t.nombres) as "trabajadorNombre",
      coalesce(t.dni, '') as dni,
      a.id_area as "areaId",
      a.nombre_area as "areaNombre",
      c.nombre_cargo as "cargoNombre",
      'Sin horario asignado' as "horarioNombre",
      to_char(f.fecha, 'YYYY-MM-DD') as fecha,
      null::text as "horaProgramadaEntrada",
      to_char(min(m.fecha_hora_marcacion), 'HH24:MI') as "primeraMarcacion",
      null::text as "horaProgramadaSalida",
      to_char(max(m.fecha_hora_marcacion), 'HH24:MI') as "ultimaMarcacion",
      0 as "minutosTardanza",
      0 as "minutosSalidaTemprano",
      count(m.id_marcacion)::int as "cantidadMarcaciones",
      case
        when count(m.id_marcacion) = 0 then 'falta'
        when count(m.id_marcacion) = 1 then 'incompleto'
        else 'asistio'
      end as estado,
      case
        when count(m.id_marcacion) = 0 then 'Sin marcaciones registradas para la fecha consultada.'
        when count(m.id_marcacion) = 1 then 'Solo se registro una marcacion durante la jornada.'
        else 'Marcaciones registradas correctamente para el dia.'
      end as observacion
    from fecha_objetivo f
    join trabajadores t on t.activo = true
    left join areas a on a.id_area = t.id_area
    left join cargos c on c.id_cargo = t.id_cargo
    left join marcaciones m
      on m.id_trabajador = t.id_trabajador
     and m.fecha_marcacion = f.fecha
    group by f.fecha, t.id_trabajador, t.apellidos, t.nombres, t.dni, a.id_area, a.nombre_area, c.nombre_cargo
    order by t.apellidos asc, t.nombres asc
  `,
  controlDiarioDetalle: `
    with fecha_objetivo as (
      select coalesce($2::date, (select max(fecha_marcacion) from marcaciones), current_date) as fecha
    ),
    resumen as (
      select
        t.id_trabajador as "trabajadorId",
        trim(t.apellidos || ' ' || t.nombres) as "trabajadorNombre",
        coalesce(t.dni, '') as dni,
        a.nombre_area as "areaNombre",
        c.nombre_cargo as "cargoNombre",
        'Sin horario asignado' as "horarioNombre",
        to_char(f.fecha, 'YYYY-MM-DD') as fecha,
        null::text as "horaProgramadaEntrada",
        to_char(min(m.fecha_hora_marcacion), 'HH24:MI') as "primeraMarcacion",
        null::text as "horaProgramadaSalida",
        to_char(max(m.fecha_hora_marcacion), 'HH24:MI') as "ultimaMarcacion",
        0 as "minutosTardanza",
        0 as "minutosSalidaTemprano",
        count(m.id_marcacion)::int as "cantidadMarcaciones",
        case
          when count(m.id_marcacion) = 0 then 'falta'
          when count(m.id_marcacion) = 1 then 'incompleto'
          else 'asistio'
        end as estado,
        case
          when count(m.id_marcacion) = 0 then 'Sin marcaciones registradas para la fecha consultada.'
          when count(m.id_marcacion) = 1 then 'Solo se registro una marcacion durante la jornada.'
          else 'Marcaciones registradas correctamente para el dia.'
        end as observacion
      from fecha_objetivo f
      join trabajadores t on t.id_trabajador = $1 and t.activo = true
      left join areas a on a.id_area = t.id_area
      left join cargos c on c.id_cargo = t.id_cargo
      left join marcaciones m
        on m.id_trabajador = t.id_trabajador
       and m.fecha_marcacion = f.fecha
      group by f.fecha, t.id_trabajador, t.apellidos, t.nombres, t.dni, a.nombre_area, c.nombre_cargo
    ),
    detalle_marcaciones as (
      select json_agg(
        json_build_object(
          'id', m.id_marcacion,
          'fechaHora', to_char(m.fecha_hora_marcacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
          'hora', to_char(m.fecha_hora_marcacion, 'HH24:MI')
        )
        order by m.fecha_hora_marcacion asc
      ) as marcaciones
      from fecha_objetivo f
      left join marcaciones m
        on m.id_trabajador = $1
       and m.fecha_marcacion = f.fecha
    )
    select r.*, coalesce(d.marcaciones, '[]'::json) as marcaciones
    from resumen r
    cross join detalle_marcaciones d
  `,
}
