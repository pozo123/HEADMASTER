# Head
Depto. de Innovacion y Optimizacion

HTMLs:
 - app_atributo (probar)

TO DO:
 - ADMON
   - Quitar candado evidencia en pagos kaizen (admin)
   - Regs corruptos:
     - quitarlos de proy, ponerlo en admin
     - filtrar los horas == 0 porque esta activo de hoy :P
     - revisar corruptos activos (==0 porque activo pero desde ayer)
     - poner la hora de entrada, no solo la fecha
     - corregir poniendo la hora de salida, no la cantidad de horas
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - COMPRAS
   - catalogo de pagos con botones agregar pdf e imprimir pdf (como en odecs)}
   - app_compras_credito -> definida en foto
   - Definir cómo terminar OdeC
 - PRODUCCION
   - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
     - En generador de precios. (jala raro, diferente si entras o si vienes de otra pestaña)
   - Gestionar sups solo si creden <3 o admin
   - app_prod_entrada_estimacion
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
     - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - PROYECTOS
   - reporte_obras -> definir y programar
   - reporte_ppto -> definir y programar
   - gestionar_presu -> Gestionar horas score (distribuir por wey);
 - RRHH
   - App_revertir_cierre, que cierre pago_nomina, diversos, HE O asistencias, dependiendo de un ddl? añoño. Verla bien y mapear los efectos de cada app.
     - Limpiar semana 20 en trabajadores y en pagos nomina
        - Dejar asistencias y HE, limpiar lo demas
   - app_rrh_nomina_completa
     - Mostrar avances de las 3 apps de asistencia, aunque no esten terminados.
     - Poner descargable a excel con formato para mandarlo a la pagadora
     - columna "obra" tiene la obra más frecuentada esa semana, si no tiene asistencias descargar como "-" o "NA"
- CATALOGOS
   - Total
     - Destajistas (en prod y en rrhh, editable (todo?) en rrhh)
     - Diversos, editable (en prod y en rrhh, editable (distribuible) en rrhh)
 - GENERALES
   - Index
   - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
   - Definir y programar la columna PROYECTOS/PAG (cuando, quien y como)
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
    
- Junta Taba
   - Editar odec es como hacer una alta nueva. Solped igual. Contratos no se puede editar. Tampoco pagos.
   - Catalogos de: solped, contratos
   - Error pagos check
   - Orden HTML

- Junta Hector
   //- Error -> !asistencia, check
   //- sem 20, probs desde 0, pero ahora con respaldos.
      //- Resetearla
   //- En pagos nomina si hay semana pero todo esta en false no lo cargues
   //- Carga en pagos a los que tienen diversos aunque no tengan asistencia. Con quitar el reload.
   //- Checar que los botones se disableen bien en diversos
   //- Ya se carga la clave de la pagadora en pagos nomina. Si no tiene "HEAD ID" + id
   //- editar trabajador
   //- label con cuantos renglones en PagoNom
   //- horas extra horas Y $

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