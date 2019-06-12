# Head
Depto. de Innovacion y Optimizacion

HTMLs:
 - app_atributo (probar)

TO DO:
 - ADMON
*   - importar adicionaes desde excel
*   - meter pdf a pptos adics con la tabla de arturo
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
 - GENERALES
 **- pptos en presupuesto, imprimir_presupuesto, admon_resumen_ppto y admon_ppto_adic
   - Subir templates de excel con formatos necesarios para imprtar (importar proveedores, trabajadores y ppto adic)
   - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
   - KICK-OFF 
     - subir y editar por req (req = {id, alcance, nombre_corto, familia})
     - asignar a proc (al dar de alta el proc, con ddcb)
     - Palomear (con pda, necesita creden, subir archivo)
     - liberar

 ddl_corregidos:
 - Admon: 3281
    - 202 + 74 + 206 + 266 + 99 + 303 + 201 + 251 + 102 + 298 + 93 + 646 + 211 + 157 + 172
    - app_admin_registro
    - app_admon_resumen_ppto
    - qpp_admon_areas
    - app_admon_colaborador
    - app_admon_corruptos
    - app_admon_importar_adic
    - app_admon_kaizen_ppto
    - app_admon_pago_kaizen
    - app_admon_reporte_diario
    - app_admon_reporte_investime
    - app_cliente
    - app_cuenta_cc
    - app_editar_proceso
    - app_obra
    - app_procesos
 - Catalogos: 752
    - 129 + 75 + 108 + 106 + 59 + 113 + 71 + 53 + 38
    - app_catalogo_atn
    - app_catalogo_categorias
    - app_catalogo_clientes
    - app_catalogo_destajistas
    - app_catalogo_diversos
    - app_catalogo_obras
    - app_catalogo_odec
    - app_catalogo_personal
    - app_catalogo_proveedores
 - Compras 1606
    - 100 + 129 + 69 + 375 + 238 + 318 + 85 + 292
    - app_compras_asigna_contrato
    - app_compras_contrato
    - app_compras_importar_proveedores
    - app_compras_odec
    - app_compras_pag_kaizen
    - app_compras_pagos
    - app_compras_proveedor
    - app_compras_solped
    - compras
 - Produccion 1645
    - 567 + 33 + 187 + 280 + 271 + 36 + 52 + 219
    - app_desplegar_kaizen
    - app_destajista
    - app_gestionar_supervisores
    - app_kaizen_global
    - app_prod_copeo
    - app_prod_cuadrilla
    - app_prod_dash_individual   
    - app_prod_est 
 - Proyectos 4841
    - 660 + 62 + 1165 + 123 + 43 + 26 + 427 + + 38 + 167 + 111 + 215 + 372 + 401 + 957 + 74
    - app_actualizar_regs
    - app_atn
    - app_bibliotecas
    - app_cierre_maestro
    - app_exc_reqs
    - app_generos_tipos
    - app_gestionar_presu
    - app_proy_actualizar_esp
    - app_proy_cuant_kaizen
    - app_proy_gestionar_score
    - app_proy_registros
    - app_reporte
    - app_reporte_obras
    - app_reporte_ppto
    - score

 - Faltan:
    - RRHH
    - app_proy_scoreboard

    - app_presupuesto
    - admon_ppto_Adic
    - app_imprimir_presupuesto

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