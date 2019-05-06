# Head
Depto. de Innovacion y Optimizacion

REESTRUCTURA_BD:
 - admon: 
    - app_admon_pago -> ya no va a ppto
    - app_procesos -> no se puede dar adics ni pc00, esos son con pptos
 - compras: check
 - rrhh: check
 - prod: check
 - proy
    - bibliotecas -> definir areas (en donde como catalogo y en donde editar), definir ediciones y eliminados, cambiar las ramas adecuadsa
    - dashboard -> checar cual es la ultima version, definir formato y datos. Mandar a obsoletos
    - gestionar_presu -> depende de def_ppto. Tambien gestiona procs, no?
    - presupuesto -> definir que si lleva y que no, separar pdf de crear elemento en bd
    - reporte_ppto -> depende de def_ppto   
    - imprimir_ppto -> ppto ya esta en subprocs 
    - actualizar_Regs
    


 HTMLs:
 - app_admin_registro
 - app_admon_pago_kaizen -> (REVISAR HTML) nueva app + pad + checo si obra terminada
 - app_obra -> cambio de rama a administracion
 - app_proy_scoreboard -> nueva app 
 - app_proy_actualizar_esp -> (REVISAR HTML) nueva app. 2 radio buttons y un botón nada más.
 - app_proy_registros -> (REVISAR HTML) ya no pptos ni equipos, PC00-MISC, (+ comenté que alimentara a kaizen + corregí error + nuevos registros usando el nuevo uml)
 - app_reporte_obras -> (REVISAR HTML, faltan divs y sobran dropdown checkboxes) reestructura_bd. 
 - app_distribucion_supervisores (los pagos de la pagadora)
 - app_gestionar_supervisores -> (REVISAR HTML) reestructura_bd, solo se asigna por obra, se comenta un ddl
 - app_rrhh_horas_extra -> (REVISAR HTML) reestructura_bd, contemplo terminados, si obra simple mete a misc, simple también considera adicionales, botón carga semana anterior, trab y pagos a rrhh
  - app_rrhh_pagos_diversos -> (REVISAR HTML) si mismo trab, obra y proc, actualiza valor ahí, en impuestos y en total de nom y trab Y lo mismo que horas_extra, botón "Carga semana anterior" con id = "semanaAnteriorButtonDiversos" en hidden, contempla terminados, reestructura_bd, trab y pagos a rrhh
 - app_rrhh_editar_trabajadores
 - app_atributo
 - app_areas

 Obsoletos: 
 - app_prod_gestionar_pptos, app_colaboradores_compras, app_colaboradores_produccion, app_colaboradores_rrhh, app_datos_kaizen, app_obra_prod, app_personal, app_inge, app_permisos, dashgrid, pagos (todo se va a hacer con el admon), perfil, app_proy_asigna_proc, app_graphs (hice funcion nueva en app_proy_scoreboard)
     
 Por probar:
 - app_pagos_nomina
 - app_rrhh_pagos_diversos -> terminar: sumar, distribuir, y KAIZEN, ya no al kaizen si atencion a clientes, distribuir horas si semana quebrada, que carguen los ddls, si funciona con multiples diversos
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - app_gestionar_supervisores
 - app_atributo
 
 Por definir:
 - Centro de costos 
    - Claves
 - eliminar en bibliotecas score

 Errores:
 - Gantt fecha inicial
 - Gantt no saca inicio (sem) pero sí final (sem)
 - registros con horas 0
 - falta empty a muchos ddls antes de cargarlos

ARTURO:
 - Falta el app_generos_tipos en proyectos
 - Quitar todos los colaboradores de todo lo que no sea admin
 - en app_pryo_cuant_kaizen cambiar el placeholder de descripcion
 - clase rojo y gris en desplegar kaizen
 - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - Titulos de obra en catalogo de proceso en negritas y mas grandes
 - Poner los labels de anterior y nuevo separados en proy_cuant_kaizen
 - En producción revisar qué cosas pueden ver/usar supervisores. Bloquear tabs y cargar ddls sólo con las asignadas
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Ddl para navegar entre pestañas de areas
 - Poner filtros para pestañas en prod (gerente/supervisor)
    
DIEGO:
 - Cierre maestro no creo que quite la modalidad de picar "salida"
 - Definir quién llena las horas ppto de SCORE en los procs/pptos, y cómo (no sólo en kaizen)
 - desplegar kaizen lo del cambio de obra
 - app_prod_entrada_estimacion
 - app_presupuesto -> cargar datos a kaizen/proy/ppto (subp, proc y obra) y manejo correcto de ddls y hiddens (empty y hide proc y clase de ppto cuando cambio de obra). Simplificación de formato si clase == prod?
 - Todo lo de Gantt
 - Desplegar CC
 - Botón respaldo (aunque baje sólo el json)
 - Manual de usuario
 - diversos en bd, alta, editar, etc, hacer todo en una tabla
 - app_cuenta_cc 
    - crear los fields necesarios para el UML
    - corregir un error
    - programar el boton
 - Reportes:
    - app_reporte_supervisores
       - filtros
          - obra
          - proceso
          - periodo de tiempo
       - datos
          - OdeC
          - Asistencias/faltas
          - $$
          - completez
          - fechas?
    - app_reporte_rrhh
       - filtros
          - obra
          - proceso
          - trabajador
          - periodo de tiempo
       - datos
          - diversos (ddcheckbox)
          - horas trabajadas
          - horas extra
          - falta
 
TO DO:
 - Produccion
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
   - Gantt
     - Hitos
     - Fechas raras :S
     - Sem inic no sale
     - editable
 - Proyectos
   - Revisar reporte_obras
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - RRHH
   - editar_trabajadores (como en bibliotecas en proy)
   - supervisores
 - Pagina Web
   - arreglar las apps de permisos de usuario y de inicio de sesion
   - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
   - Botón respaldo (aunque baje sólo el json)
   - Poner botón regresar a index o links para navegar entre páginas
   - Manual de usuario, por sección y global.

 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos

 - SCORE:
   - actualizar regs > 15 (darle un botonazo)
   - Reporte semanal
      - Tabla de colabs contra procesos con totales
   - Eliminar en bibliotecas
      - Colabs? borrarlos de auth pero no de database, no? meterle atributo "eliminado"? -> No, sólo en auth. lo demás es con permisos.
      - Obras Poner activo/No activo?
      - pptos sí
      - Despachos no, o sí?
      - atn sí
      - req/exc sí
      - tipos/generos sí
   - Dashgrid
   - Dashcards nuevo diseño
   - Amarillo y rojo en dashcards y graphs para cuando esten al 90% o se hayan pasado de las horas programadas
   - Update uml
   - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
   - Los editar en bibliotecas ya no solo afectan la bd de proyectos. Checar que si se cambia el nombre de cliente, por ejemplo, se cambie también en obra magico y en todos los lugares que sean correspondientes

dudas:
Obras divididas ya existentes
   - CPBR -> Son el mismo
   - zentral -> Partirla en t1 y t2, todo lo que ya va a torre 1
   - via -> Partirla en comercios y oficinas, todo lo ya trabajado va en com
Ya terminadas? 
   - Amira -> cerrada
   - Blume -> cerrada
   - Box Metepec -> cerrada
   - LA CITE (td y te) -> clausurada
   - Periferico 2840 -> = pc00
Cambiar UNICO por EJE 8

OBRAS:
 - Kaizen:
   - FOR US -> :S
   - MARINA 196-48
   - UNICO 149
   - ACANTO
   - AVERANDA T-A
   - ENTTORNO T-F
   - NEO
   - VIA 515 oficinas
   - ZENTRAL T2
 - Terminator:
   - Mayo:
      - ICON
      - EPIC
      - WEST PARK
      - COSMOCRAT
      - AVERANDA T-B
      - ENTTORNO T-E
      - ZENTRAL T1
   - Junio:
      - SAN ANTONIO 88 / 95
      - VIA 515 COM
   - Agosto:
      - MINAS
      - LAS VENTANAS
      - CENTRAL PARK T-A/T-B
HOLA ARTURO! 3/5/19

QU� ONDA DIEGO?