Reestructuración de la base de datos.

LISTA DE CAMBIOS:
Obra simple manda todo a misc

SCORE en proc:
    - Atributo programado, empieza en false.
    - Para proramar, dar horas totales del proc. Sólo se puede dar una vez.
    - quitar equipos. Esp sigue existiendo pero las horas no se dividen por esp. Esp sólo se guarda en el registro, para futuros reportes. 
    - Distribuir horas es por inge, vale madres el equipo. Solo hay horas totales, no por equipo. Los equipos se van a distribuir pq cada subproc sera ie o ihs (en general).
    - Atributo SCORE ya no en ppto, solo en proc, y ya no tiene equipos.

En registros:
    - Ahora por year y semana
    - Que no sume a kaizen, porque no se pagan las horas trabajadas sino las presupuestadas.
En app_areas: 
    - Si se da proy ponerle esp
En obras:
	- todas las obras juntas.
	- obra_simple = (num_procesos == 0 && adic.num_subprocesos == 0)
	- si obra simple score a pc00, todo lo demas (compras y mano de obra y así) a misc
	- Alta obra sólo en admin -> como mágico pero falta dirección y pptos, supervisor [array, key: uid, ativo y nombre], ppr ya no,
	- Obra tiene fecha i y f real y teórica. La real es la de los procesos (min y max) y cuando se da por terminada hay que updatear la final. Los procesos sólo tienen fecha inicio y fecha final
	- Pasamos obras de la rama_bd_compras a los procesos de la obra en sí (tienen odec)
	- Rama ppto pero sólo si obra simple, sólo para el PC00
	- Revisar terminada
En ppto:
    - Sólo para adic y para pc00. No se guarda nada de score ahi. Al hacer un ppto se genera un subproceso en el proc correspondiente.
    - La rama_bd_ppto sólo tiene el url del pdf y si acaso datos para poder recrearlo.
    - Ya no se trabja en pptos, sino en los subps de los procs que les corresponden.
	- clase ya no tiene
	- los pagos los da de alta emmanuel
	- quitar horas_programadas y horas_trabajadas, añadir totales trabajados en rama SCORE (antes colaboradores_asignados)
	- Revisar terminado
En procesos (y subprocesos)
	- atributo SCORE -> tiene todo lo de colaboradores_asignados, mas los totales trabajados
	- Revisar terminado
	- programado
En reportes: 
    - estructura registros nueva
En colaboradores:
	- el alta es también editar si se ingresa un mail existente
	- Sólo da alta en admin -> app_areas
	- activo y revisar si activo
	- falta credenciales, 0 sisadmin, 1 director, 2 lider de area, 3 los demas, 4 bajas/glitches. Sustituye funcionalidad de tipo en prod. Ya no hay esp_chamba, y esp si yienes area proy es "ie", "ihs", status si proy
	- Nomina de sups en pagos_nomina. Obras asignadas en obra.

- App para declarar las horas ppto en el kaizen, sólo se pueden hacer una vez

Cambios en bd:
 - Pasar las OdeCs a obras y borrar 
 - borrar obras y colaboradores
 - activos en personal
 - poner creden en personal
 - status en personal proy
 - mover trab y pag_nom a rrhh Y NUM TRABAJADORES! AGUAS
 - poner el PC00-MISC a los ya existentes
 - borrar todos los registros, pero guardarlos bien en los kaizens antes
 - Poner atributo SCORE en todas las hojas... ? No necesario


 FALTA:
 - obras 
    - Ponerles direccion a todas
    - Procs (Todo con un actualizar_regs)
       - Sumar horas de VIA OFICINAS de registros anteriores.
       - Pasar horas programadas de pptos a procs
    - Pptos -> Darlos de alta
