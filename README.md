# Head
Depto. de Innovacion y Optimizacion

HTMLs:
 - app_atributo (probar)

TO DO:
 - ADMON
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - COMPRAS
   - app_compras_credito -> definida en foto
   - Definir cómo terminar OdeC
 - PRODUCCION
   - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
     - En generador de precios. (jala raro, diferente si entras o si vienes de otra pestaña)
   - Gestionar sups solo si creden <3 o admin
*   - app_prod_entrada_estimacion
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
     - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - PROYECTOS
   - reporte_obras -> definir y programar
   - reporte_ppto -> definir y programar
*   - gestionar_presu -> Gestionar horas score (distribuir por wey);
 - RRHH
**   - App_revertir_cierre, que cierre pago_nomina, diversos, HE O asistencias, dependiendo de un ddl? añoño. Verla bien y mapear los efectos de cada app.
     - Limpiar semana 20 en trabajadores y en pagos nomina
        - Dejar asistencias y HE, limpiar lo demas
*   - app_rrh_nomina_completa
     - Mostrar avances de las 3 apps de asistencia, aunque no esten terminados.
     - Poner descargable a excel con formato para mandarlo a la pagadora
     - columna "obra" tiene la obra más frecuentada esa semana, si no tiene asistencias descargar como "-" o "NA"
- CATALOGOS
   - Total
*     - Diversos, editable (en prod y en rrhh, editable (distribuible) en rrhh)
 - GENERALES
   - Index -> nuevo diseño de landing page
   - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
   - Definir y programar la columna PROYECTOS/PAG (cuando, quien y como) -> desde gestionar procs en proy. Al terminar sumo lo ppto a pag, se puede desterminar.
   - Definir y programar la columna COPEO/COPEO (cuando, quien y como)
   - Titulos de obra en catalogo de proceso en negritas y mas grandes
   - Borrar obsoletos comentados en htmls
   - KICK-OFF 
     - subir y editar por req (req = {id, alcance, nombre_corto, familia})
     - asignar a proc (al dar de alta el proc, con ddcb)
     - Palomear (con pda, necesita creden, subir archivo)
     - liberar
   - Errores:
     - reg -LfKD9-qk6Kh_vims3jY de rojas se guardo en proyectos/obras
     - cM3eoNLl81K1W9r de luis igual

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