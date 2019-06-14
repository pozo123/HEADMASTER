# Head
Depto. de Innovacion y Optimizacion

HTMLs:
 - app_atributo (probar)

TO DO:
 - ADMON
*   - importar adicionaes desde excel
   - manejar las imagenes en el editar_ppto_adic
   - datatable en pagos de emmanuel
   - Edicion inve$stime
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - COMPRAS
   - app_compras_credito -> definida en foto
   - status odec -> rama_bd (con catalogo), en datatable de odecs y datatable para supervisor
 - PRODUCCION
   - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
     - Gestionar sups solo si creden < 3 o admin
   - app_prod_remisiones (definir y programar)
   - Kaizen desplegar -> actualiza totales y profit pero no se ve hasta que se recarga
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - Subprocesos colapsables por proc al hacer click en el renglon (limpieza de codigo editable, buscar catalogo de procs)
     - hacer que las columnas prec se hagan grises si el otro tiene datos
     - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - PROYECTOS
   - en dashcards al hacer mouseover desplegar un resumen de la obra entera en un modal/popup
   - gestionar_presu -> Gestionar horas score programadas
 - RRHH
   - num_traajadores_id no se actualiza al importar / dar de alta nuevo
 - GENERALES
   - **pptos en presupuesto, imprimir_presupuesto, admon_resumen_ppto y admon_ppto_adic**
      - ver parametros funciones generar
      - guardarlos en la bd
   - Subir templates de excel con formatos necesarios para imprtar (importar proveedores, trabajadores y ppto adic)
   - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
   - KICK-OFF 
     - subir y editar por req (req = {id, alcance, nombre_corto, familia})
     - asignar a proc (al dar de alta el proc, con ddcb)
     - Palomear (con pda, necesita creden, subir archivo)
     - liberar


 - 3281 + 752 + 1606 + 1645 + 4841 + 3768 + 1215 + 482 + 1304 + 1507 + 93 = 20494
 - Faltan:
    - app_proy_scoreboard 482

    - app_presupuesto 1304
    - admon_ppto_Adic 1507
    - app_imprimir_presupuesto 93

 Obsoletos: 
 (fantasmas)
 - app_bibliotecas
 - app_gestionar_presu
 - app_reporte_obra
 - app_reporte_ppto
 - app_kaizen_global
 - app_cierre_maestro
 - app_proy_cuant_kaizen
 (muertos)
 - app_distribucion_supervisores
 - app_utilidad
 - app_proy_cuant_kaizen
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