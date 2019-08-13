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
var id_ddl_cliente_obra = "clienteObra"; // primero terminar app de clientes.
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
    resetFormObra();
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_inicio_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_final_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    //Se restringe el numero de digitos para el codigo postal
    $('#' + id_codigo_postal_obra).attr('maxlength',5)

    // Necesita funcionalidad para llenar el ddl de cliente.
    $('#' + id_ddl_cliente_obra).empty();
    var select = document.getElementById(id_ddl_cliente_obra);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var cliente;
    firebase.database().ref(rama_bd_clientes + "/despachos").orderByChild('nombre').on('child_added',function(snapshot){
        cliente = snapshot.val();
        option = document.createElement('option');
        option.value = cliente.key;
        option.text = cliente.nombre;
        select.appendChild(option);
    });

});

$('#' + id_agregar_obra).click(function() {
  validateFormObra();
})

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_clave_obra).change(function(){
    $('#' + id_clave_obra).val($('#' + id_clave_obra).val().toUpperCase());
});

$('#' + id_clave_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789",e)
});

$('#' + id_nombre_obra).change(function(){
    $('#' + id_nombre_obra).val($('#' + id_nombre_obra).val().toUpperCase());
});

$('#' + id_nombre_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789",e)
});

$('#' + id_garantia_obra).keypress(function(e){
    charactersAllowed("0123456789.",e)
});

$('#' + id_estado_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_estado_obra).change(function(){
  $('#' + id_estado_obra).val(corrigeCampoComplejo(id_estado_obra));
});

$('#' + id_ciudad_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_ciudad_obra).change(function(){
  $('#' + id_ciudad_obra).val(corrigeCampoComplejo(id_ciudad_obra));
});

$('#' + id_colonia_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_colonia_obra).change(function(){
  $('#' + id_colonia_obra).val(corrigeCampoComplejo(id_colonia_obra));
});

$('#' + id_calle_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
});

$('#' + id_calle_obra).change(function(){
  $('#' + id_calle_obra).val(corrigeCampoComplejo(id_calle_obra));
});

$('#' + id_codigo_postal_obra).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#' + id_numero_obra).keypress(function(e){
    charactersAllowed("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ 0123456789-",e);
});



// ----------------------- FUNCIONES NECESARIAS ----------------------------
function resetFormObra (){
  $('#' + id_clave_obra).val("");
  $('#' + id_nombre_obra).val("");
  $('#' + id_garantia_obra).val("");
  $('#' + id_estado_obra).val("");
  $('#' + id_ciudad_obra).val("");
  $('#' + id_colonia_obra).val("");
  $('#' + id_calle_obra).val("");
  $('#' + id_codigo_postal_obra).val("");
  $('#' + id_numero_obra).val("");
  $('#' + id_ddl_cliente_obra + " option:selected").val("")
}

function corrigeCampoComplejo(campo){
  var campo_array = deleteBlankSpaces(campo).split(" ");
  var aux = "";
  for(var i=0; i<campo_array.length; i++){
      if(i>0){
          aux += " ";
      }
      if(isPrepOrArt(campo_array[i].toLowerCase())){
          aux += campo_array[i].toLowerCase();
      } else {
          aux += campo_array[i].charAt(0).toUpperCase() + campo_array[i].slice(1).toLowerCase();
      }
  }
  return aux;
}

function validateFormObra(){
    if ($('#' + id_clave_obra).val() == ""){
        alert("Escribe la clave de la obra");
        highLightColor(id_clave_obra,"#FF0000");
        return false;
    } else if($('#' + id_nombre_obra).val() == "" && !existe_colaborador){
        alert("Escribe el nombre de la obra");
        highLightColor(id_nombre_obra,"#FF0000");
        return false;
    } else if($('#' + id_garantia_obra).val() == "" || parseFloat($('#' + id_garantia_obra).val() ) > 100){
        alert("Escribe porcentaje del fondo de garantía en un rango de 1-100");
        highLightColor(id_garantia_obra,"#FF0000");
        return false;
    } else if($('#' + id_estado_obra).val() == ""){
        alert("Escribe el estado de la republica donde se encuentra la obra.");
        highLightColor(id_estado_obra,"#FF0000");
        return false;
    } else if($('#' + id_ciudad_obra).val() == ""){
        alert("Escribe la ciudad donde se encuentra la obra.");
        highLightColor(id_ciudad_obra,"#FF0000");
        return false;
    } else if($('#' + id_colonia_obra).val() == ""){
        alert("Escribe la colonia donde se encuentra la obra.");
        highLightColor(id_colonia_obra,"#FF0000");
        return false;
    } else if($('#' + id_calle_obra).val() == ""){
        alert("Escribe la calle donde se encuentra la obra.");
        highLightColor(id_calle_obra,"#FF0000");
        return false;
    } else if($('#' + id_codigo_postal_obra).val() == "" || $('#' + id_codigo_postal_obra).val().length < 5 ){
        alert("Escribe el codigo postal correspondiente a la ubicacion de la obra.");
        highLightColor(id_codigo_postal_obra,"#FF0000");
        return false;
    } else if($('#' + id_numero_obra).val() == ""){
        alert("Escribe el numero exterior de la obra.");
        highLightColor(id_numero_obra,"#FF0000");
        return false;
    }  else if($('#' + id_ddl_cliente_obra + " option:selected").val() === ""){
        alert("Ningún cliente fue seleccionado");
        highLightColor(id_ddl_cliente_obra,"#FF0000");
        return false;
    } else {
        return true;
    }
}
function highLightColor(id, color){
  document.getElementById(id).style.background = color;
  setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
}
