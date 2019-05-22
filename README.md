# Head
Depto. de Innovacion y Optimizacion
//prueba merge
REESTRUCTURA_BD:
 - admon: check
 - compras: check
 - rrhh: check
 - prod: check
 - proy
    - bibliotecas -> cambiar a "catalogos"
       - Total
          - Destajistas, editable
          - Diversos, editable
       - Produccion
          - destajistas
          - Diversos
       - RRHH
          - destajistas (editar: Todo (creo, checar funcionalidad))
          - Diversos (editar: distribuible)
    - gestionar_presu -> depende de def_ppto. Tambien gestiona procs, no?
    - reporte_ppto -> depende de def_ppto   

  - Para anexos jalar archivos excel y jalar el formato (mezcla apps importar con apps ppto)
  - Poner nota en registro si creden == 2
  - generador de pptos (solo pdf) -> contratos de obra

  - Cierre maestro:
     - checar asincronía
     - Habilitar modal
     - Revisar pad
     - Agregar toLocale en pad
     - if(automatico)
     - sacar pad aunque no automatico

 KICK-OFF 
 - subir y editar por req (req = {id, alcance, nombre_corto, familia})
 - asignar a proc (al dar de alta el proc, con ddcb)
 - Palomear (con pda, necesita creden, subir archivo)
 - liberar

 HTMLs:
 - app_admin_registro
 - app_admon_pago_kaizen -> (REVISAR HTML) nueva app + pad + checo si obra terminada
 - app_reporte_obras -> (REVISAR HTML, faltan divs y sobran dropdown checkboxes) reestructura_bd. 
 - app_distribucion_supervisores (los pagos de la pagadora)
 - app_gestionar_supervisores -> (REVISAR HTML) reestructura_bd, solo se asigna por obra, se comenta un ddl
 - app_rrhh_editar_trabajadores
 - app_atributo

 Obsoletos: 
 - app_prod_gestionar_pptos
 - app_compras_odec_kaizen (la cambie por app_compras_odec)
 - app_colaboradores_compras
 - app_colaboradores_produccion
 - app_colaboradores_rrhh
 - app_datos_kaizen
 - app_obra_prod
 - app_personal
 - app_inge
 - app_permisos
 - dashgrid
 - pagos (todo se va a hacer con el admon)
 - perfil
 - app_proy_asigna_proc
 - app_graphs (hice funcion nueva en app_proy_scoreboard)
     
 Por probar:
 - app_pagos_nomina
 - app_rrhh_pagos_diversos -> terminar: sumar, distribuir, y KAIZEN, ya no al kaizen si atencion a clientes, distribuir horas si semana quebrada, que carguen los ddls, si funciona con multiples diversos
 - app_reporte_obras ->(editÃ©, ahora tiene checkboxes... creo :S)
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
 - clase rojo y gris en desplegar kaizen
 - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - Titulos de obra en catalogo de proceso en negritas y mas grandes
 - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Ddl para navegar entre pestaÃ±as de areas
    
DIEGO:
 - Definir cómo terminar OdeC
 - En Odec revisar proveedor en on change (compararlo con la bd) 
 - Definir quién llena las horas ppto de SCORE en los procs/pptos, y cómo (no sólo en kaizen)
 - desplegar kaizen lo del cambio de obra, cargarKaizen hay que descomentarlo de funciones y probarlo, que se sumen en totales y asi todo bien
 - app_prod_entrada_estimacion
 - Todo lo de Gantt
 - Desplegar CC
 - Boton respaldo (aunque baje solo el json)
 - Manual de usuario
 - diversos en bd, alta, editar, etc, hacer todo en una tabla
 - app_cuenta_cc 
    - crear los fields necesarios para el UML
    - corregir un error
    - programar el boton
 
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
   - Gestionar horas (por proc y distribuir por wey);
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - aÃ±adir al desplegar
 - RRHH
   - editar_trabajadores (como en bibliotecas en proy)
   - supervisores
 - Pagina Web
   - arreglar las apps de permisos de usuario y de inicio de sesion
   - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
   - BotÃ³n respaldo (aunque baje sÃ³lo el json)
   - Poner botÃ³n regresar a index o links para navegar entre pÃ¡ginas
   - Manual de usuario, por secciÃ³n y global.

 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos