const controlDiarioBaseCte = `
  with fecha_objetivo as (
    select coalesce($1::date, (select max(fecha_marcacion) from marcaciones), current_date) as fecha
  ),
  asignacion_vigente as (
    select distinct on (ht.id_trabajador)
      ht.id_trabajador,
      ht.id_horario_trabajador,
      ht.modo_horario,
      ht.id_horario_base,
      ht.fecha_inicio
    from fecha_objetivo f
    join horario_trabajador ht
      on ht.activo = true
     and ht.fecha_inicio <= f.fecha
     and (ht.fecha_fin is null or ht.fecha_fin >= f.fecha)
    order by ht.id_trabajador, ht.fecha_inicio desc, ht.id_horario_trabajador desc
  ),
  horario_resuelto as (
    select
      av.id_trabajador,
      av.id_horario_trabajador,
      av.modo_horario,
      coalesce(hd.id_horario, hb.id_horario) as id_horario,
      coalesce(hd.codigo_horario, hb.codigo_horario) as codigo_horario,
      coalesce(hd.nombre_horario, hb.nombre_horario) as nombre_horario,
      coalesce(hd.hora_entrada, hb.hora_entrada) as hora_entrada,
      coalesce(hd.hora_salida, hb.hora_salida) as hora_salida,
      coalesce(hd.tolerancia_entrada_minutos, hb.tolerancia_entrada_minutos, 0) as tolerancia_entrada_minutos,
      coalesce(hd.tolerancia_salida_minutos, hb.tolerancia_salida_minutos, 0) as tolerancia_salida_minutos
    from fecha_objetivo f
    join asignacion_vigente av on true
    left join horarios hb on hb.id_horario = av.id_horario_base
    left join horario_trabajador_dia htd
      on av.modo_horario = 'VARIABLE'
     and htd.id_horario_trabajador = av.id_horario_trabajador
     and htd.activo = true
     and htd.dia_semana = extract(isodow from f.fecha)::smallint
    left join horarios hd on hd.id_horario = htd.id_horario
  ),
  marcaciones_resumen as (
    select
      m.id_trabajador,
      m.fecha_marcacion,
      min(m.fecha_hora_marcacion) as primera_marcacion,
      max(m.fecha_hora_marcacion) as ultima_marcacion,
      count(m.id_marcacion)::int as cantidad_marcaciones
    from marcaciones m
    group by m.id_trabajador, m.fecha_marcacion
  ),
  base as (
    select
      t.id_trabajador as id,
      t.id_trabajador as "trabajadorId",
      trim(t.apellidos || ' ' || t.nombres) as "trabajadorNombre",
      coalesce(t.dni, '') as dni,
      a.id_area as "areaId",
      a.nombre_area as "areaNombre",
      c.nombre_cargo as "cargoNombre",
      coalesce(hr.nombre_horario, 'Sin horario asignado') as "horarioNombre",
      to_char(f.fecha, 'YYYY-MM-DD') as fecha,
      to_char(hr.hora_entrada, 'HH24:MI') as "horaProgramadaEntrada",
      to_char(mr.primera_marcacion, 'HH24:MI') as "primeraMarcacion",
      to_char(hr.hora_salida, 'HH24:MI') as "horaProgramadaSalida",
      to_char(mr.ultima_marcacion, 'HH24:MI') as "ultimaMarcacion",
      greatest(
        0,
        coalesce(
          floor(extract(epoch from (mr.primera_marcacion::time - (hr.hora_entrada + (hr.tolerancia_entrada_minutos * interval '1 minute')))) / 60),
          0
        )
      )::int as "minutosTardanza",
      greatest(
        0,
        coalesce(
          floor(extract(epoch from ((hr.hora_salida - (hr.tolerancia_salida_minutos * interval '1 minute')) - mr.ultima_marcacion::time)) / 60),
          0
        )
      )::int as "minutosSalidaTemprano",
      coalesce(mr.cantidad_marcaciones, 0) as "cantidadMarcaciones",
      hr.id_horario as horario_id
    from fecha_objetivo f
    join trabajadores t on t.activo = true
    left join areas a on a.id_area = t.id_area
    left join cargos c on c.id_cargo = t.id_cargo
    left join horario_resuelto hr on hr.id_trabajador = t.id_trabajador
    left join marcaciones_resumen mr
      on mr.id_trabajador = t.id_trabajador
     and mr.fecha_marcacion = f.fecha
  )
`

const controlDiarioSelect = `
  select
    id,
    "trabajadorId",
    "trabajadorNombre",
    dni,
    "areaId",
    "areaNombre",
    "cargoNombre",
    "horarioNombre",
    fecha,
    "horaProgramadaEntrada",
    "primeraMarcacion",
    "horaProgramadaSalida",
    "ultimaMarcacion",
    "minutosTardanza",
    "minutosSalidaTemprano",
    "cantidadMarcaciones",
    case
      when horario_id is null then 'sin-horario'
      when "cantidadMarcaciones" = 0 then 'falta'
      when "cantidadMarcaciones" = 1 then 'incompleto'
      when "minutosTardanza" > 0 and "minutosSalidaTemprano" > 0 then 'observado'
      when "minutosTardanza" > 0 then 'tardanza'
      when "minutosSalidaTemprano" > 0 then 'salida-anticipada'
      else 'asistio'
    end as estado,
    case
      when horario_id is null then 'No existe una asignacion de horario vigente para la fecha consultada.'
      when "cantidadMarcaciones" = 0 then 'No se registraron marcaciones para el horario asignado.'
      when "cantidadMarcaciones" = 1 then 'Solo se registro una marcacion durante la jornada.'
      when "minutosTardanza" > 0 and "minutosSalidaTemprano" > 0 then 'Se detecto tardanza y salida anticipada en la misma jornada.'
      when "minutosTardanza" > 0 then 'Se detecto ingreso posterior a la tolerancia permitida.'
      when "minutosSalidaTemprano" > 0 then 'Se detecto salida antes del horario permitido.'
      else 'Jornada registrada dentro del horario asignado.'
    end as observacion
  from base
`

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
  asignacionesHorario: `
    select
      ht.id_horario_trabajador as id,
      t.id_trabajador as "trabajadorId",
      trim(t.apellidos || ' ' || t.nombres) as "trabajadorNombre",
      coalesce(t.dni, '') as dni,
      a.id_area as "areaId",
      a.nombre_area as "areaNombre",
      c.nombre_cargo as "cargoNombre",
      ht.modo_horario as "modoHorario",
      h.id_horario as "horarioId",
      h.codigo_horario as "horarioCodigo",
      h.nombre_horario as "horarioNombre",
      to_char(ht.fecha_inicio, 'YYYY-MM-DD') as "fechaInicio",
      to_char(ht.fecha_fin, 'YYYY-MM-DD') as "fechaFin",
      case when ht.activo then 'activo' else 'inactivo' end as estado,
      ht.observacion
    from horario_trabajador ht
    join trabajadores t on t.id_trabajador = ht.id_trabajador
    left join areas a on a.id_area = t.id_area
    left join cargos c on c.id_cargo = t.id_cargo
    left join horarios h on h.id_horario = ht.id_horario_base
    order by ht.fecha_inicio desc, t.apellidos asc, t.nombres asc
  `,
  asignacionHorarioById: `
    select
      ht.id_horario_trabajador as id,
      t.id_trabajador as "trabajadorId",
      trim(t.apellidos || ' ' || t.nombres) as "trabajadorNombre",
      coalesce(t.dni, '') as dni,
      a.id_area as "areaId",
      a.nombre_area as "areaNombre",
      c.nombre_cargo as "cargoNombre",
      ht.modo_horario as "modoHorario",
      h.id_horario as "horarioId",
      h.codigo_horario as "horarioCodigo",
      h.nombre_horario as "horarioNombre",
      to_char(ht.fecha_inicio, 'YYYY-MM-DD') as "fechaInicio",
      to_char(ht.fecha_fin, 'YYYY-MM-DD') as "fechaFin",
      case when ht.activo then 'activo' else 'inactivo' end as estado,
      ht.observacion
    from horario_trabajador ht
    join trabajadores t on t.id_trabajador = ht.id_trabajador
    left join areas a on a.id_area = t.id_area
    left join cargos c on c.id_cargo = t.id_cargo
    left join horarios h on h.id_horario = ht.id_horario_base
    where ht.id_horario_trabajador = $1
  `,
  asignacionHorarioDias: `
    select
      htd.id_horario_trabajador_dia as id,
      htd.dia_semana as "diaSemana",
      h.id_horario as "horarioId",
      h.codigo_horario as "horarioCodigo",
      h.nombre_horario as "horarioNombre",
      case when htd.activo then true else false end as activo,
      htd.observacion
    from horario_trabajador_dia htd
    join horarios h on h.id_horario = htd.id_horario
    where htd.id_horario_trabajador = $1
    order by htd.dia_semana asc
  `,
  insertAsignacionHorario: `
    insert into horario_trabajador (
      id_trabajador,
      modo_horario,
      id_horario_base,
      fecha_inicio,
      fecha_fin,
      activo,
      observacion
    ) values (
      $1, $2, $3, $4, $5, $6, $7
    ) returning id_horario_trabajador as id
  `,
  updateAsignacionHorario: `
    update horario_trabajador
    set
      id_trabajador = $2,
      modo_horario = $3,
      id_horario_base = $4,
      fecha_inicio = $5,
      fecha_fin = $6,
      activo = $7,
      observacion = $8
    where id_horario_trabajador = $1
    returning id_horario_trabajador as id
  `,
  updateAsignacionHorarioActivo: `
    update horario_trabajador
    set activo = $2
    where id_horario_trabajador = $1
    returning id_horario_trabajador as id
  `,
  deleteAsignacionHorarioDias: `
    delete from horario_trabajador_dia
    where id_horario_trabajador = $1
  `,
  insertAsignacionHorarioDia: `
    insert into horario_trabajador_dia (
      id_horario_trabajador,
      dia_semana,
      id_horario,
      activo,
      observacion
    ) values (
      $1, $2, $3, $4, $5
    )
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
  controlDiario: `${controlDiarioBaseCte}
    ${controlDiarioSelect}
    order by "trabajadorNombre" asc
  `,
  controlDiarioDetalle: `${controlDiarioBaseCte}
    , detalle_marcaciones as (
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
        on m.id_trabajador = $2
       and m.fecha_marcacion = f.fecha
    )
    select detalle.*, coalesce(d.marcaciones, '[]'::json) as marcaciones
    from (
      ${controlDiarioSelect}
      where "trabajadorId" = $2
    ) detalle
    cross join detalle_marcaciones d
  `,
}
