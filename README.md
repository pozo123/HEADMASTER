# Head
Depto. de Innovacion y Optimizacion

HTMLs:
 - app_atributo (probar)

TO DO:
 - ADMON
   - Generar adic sin pdf
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - COMPRAS
   - app_compras_credito -> definida en foto
*   - status odec -> rama_bd (con catalogo), en datatable de odecs y datatable para supervisor
 - PRODUCCION
   - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
     - Gestionar sups solo si creden < 3 o admin
   - app_prod_remisiones (definir y programar)
*   - app_prod_copeo (definir y programar)
*   - app_prod_entrada_estimacion
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - Subprocesos colapsables por proc al hacer click en el renglon (limpieza de codigo editable, buscar catalogo de procs)
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
     - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - PROYECTOS
*   - gestionar_presu -> Gestionar horas score (distribuir por wey);
     - App para terminar un proyecto. Se puede revertir. Lo qu ehace es copiar el ppto al pag en kaizen proy
     - Si terminado no se puede editar
 - RRHH
 - GENERALES
   - 7iWWod9RyOh5tPBo8r1Qlrygk142 y c7y9OvOccgMhPr4kB1fPLIbFL153 (uno es luis) tienen ms en baja california/SCORE/horas_trabajadas
   - Subir templates de excel con formatos necesarios para imprtar (importar proveedores, trabajadores y ppto adic)
   - Borrar todos los onAuthStateChanged y usar la variable global de app_principal
   - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
   - Titulos de obra en catalogo de proceso en negritas y mas grandes
   - KICK-OFF 
     - subir y editar por req (req = {id, alcance, nombre_corto, familia})
     - asignar a proc (al dar de alta el proc, con ddcb)
     - Palomear (con pda, necesita creden, subir archivo)
     - liberar
   - Errores:
     - reg -LfKD9-qk6Kh_vims3jY de rojas se guardo en proyectos/obras
     - cM3eoNLl81K1W9r de luis igual

 Obsoletos: 
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