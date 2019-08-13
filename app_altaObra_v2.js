// id's de los elementos HTML
var id_tab_obra = "tabAltaObra";
var id_form_obra = "formobra";

// Hay que definir bien como queremos esta tabla. 
// Creo solo hay que desplegar los datos que pueden ser modificados desde aquí

var id_dataTable_obra = "dataTableObra";

// NOTA: Creo que lo mejor es no asignar supervisores desde esta pestaña por 2 razones:
// 1) puede ser que den de alta una obra sin saber a quienes van a asignar a esa obra
// 2) para manejar las fechas de salida del supervisor.

// Validaciones (Igual se pueden decidir más) OBL significa obligatorio

// la clave es letras y números (Todo en mayúscula) OBL
// Nombre: Sólo la primera letra mayúscula es obligatorio OBL
// Fondo de Garantía: Solo que escriba número, y quizá que se le acepte el signo "%" ya el procesamiendo del dato
// lo hacemos internamente.

// Dirección: IDEM a app_altaCliente_v2.js

var id_clave_obra = "claveObra";
var id_nombre_obra = "nombreObra";
var id_garantia_obra = "garantiaObra";
var id_estado_obra = "estadoObra";
var id_ciudad_obra = "ciudadObra";
var id_colonia_obra = "coloniaObra";
var id_calle_obra = "calleObra";
var id_codigo_postal_obra = "cpObra";
var id_numero_obra = "numeroObra";

var id_agregar_obra = "agregarButtonObra";

jQuery.datetimepicker.setLocale('es');

// "Fechas" Puedes ver en la app_admon_reporte_investime.js la funcionalidad
// Usabamos el formato m.d.Y ya que así lo sacaba más facil, pero por lo de Mozilla necesitamos ya hacerlo como en 
// app_admon_pago_kaizen_v2.js

var id_fecha_inicio_obra = "fechaInicioObra";
var id_fecha_final_obra = "fechaFinalObra";

$('#' + id_tab_obra).click(function() {

    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_inicio_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_final_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
});