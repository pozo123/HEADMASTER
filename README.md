# Head
Depto. de Innovacion y Optimizacion

  - catalogos
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
  - InvestTime
  - app_funciones algo truena al calcular profits
  - App para poner horas a registro corrupto, sumar en reg y en score -> Sólo falta probar las sumasEnFirebase
  - Meter archivo de evidencia a app_pago_kaizen

  - reg -LfKD9-qk6Kh_vims3jY de rojas se guardo en proyectos/obras
  - cM3eoNLl81K1W9r de luis igual

  - Revisar pago total a las obras y los kaizens que se haya hecho bien, mas encontrar el error

  - Junta Hector
     - En pagos nomina si hay semana pero todo esta en false no lo cargues
     - Carga en pagos a los que tienen diversos aunque no tengan asistencia. Con quitar el reload.
     - Checar que los botones se disableen bien en diversos
     - Ya se carga la clave de la pagadora en pagos nomina. Si no tiene "HEAD ID" + id
     - label con cuantos renglones en PagoNom
     - horas extra horas Y $

  - app_rrh_nomina_completa
     - Mostrar avances de las 3 apps de asistencia, aunque no esten terminados.
     - Poner descargable a excel para mandarlo a la pagadora
     - columna "obra" tiene la obra más frecuentada esa semana, si no tiene asistencias descargar como "-" o "NA"

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
 - app_atributo
 
 Por definir:
 - Centro de costos 
    - Claves
 - Gantt
    - Gantt
     - Hitos
     - Fechas raras :S
     - Sem inic no sale
     - editable

 Errores:
 - Gantt fecha inicial
 - Gantt no saca inicio (sem) pero sí final (sem)

ARTURO:
 - clase rojo y gris en desplegar kaizen
 - Desplegar Kaizen: TODO en colores por columna, sin el negro
 - Titulos de obra en catalogo de proceso en negritas y mas grandes
 - En producción revisar qué cosas pueden ver/usar supervisores. Cargar ddls sólo con las asignadas
    - En generador de precios. (jala raro, diferente si entras o si vienes de otra pestaña)
 - Gestionar sups solo si creden <3 o admin
 - Index
    
DIEGO:
 - Definir cómo terminar OdeC
 - Definir quién llena las horas ppto de SCORE en los procs/pptos, y cómo (no sólo en kaizen)
 - desplegar kaizen lo del cambio de obra, cargarKaizen hay que descomentarlo de funciones y probarlo, que se sumen en totales y asi todo bien
 - app_prod_entrada_estimacion
 
TO DO:
 - Produccion
   - Desplegar Kaizen
     - avance.pag > avance.real = pag en rojo 
     - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
 - Proyectos
   - Revisar reporte_obras
   - Gestionar horas (por proc y distribuir por wey);
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - aÃ±adir al desplegar

 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos