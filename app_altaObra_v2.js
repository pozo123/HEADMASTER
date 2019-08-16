// id's de los elementos HTML
var id_tab_obra = "tabAltaObra";
var id_form_obra = "formobra";
var id_dataTable_obra = "dataTableObra"; //falta por definir

// NOTA: Creo que lo mejor es no asignar supervisores desde esta pestaña por 2 razones:
// 1) puede ser que den de alta una obra sin saber a quienes van a asignar a esa obra
// 2) para manejar las fechas de salida del supervisor.

// Clave: es letras y números (Todo en mayúscula) OBL
// Nombre: todo en mayusculas OBL
// Cliente: viene de la base de datos
// Garantía: numero real entre 0 y 100
// Estado: Se trata como apellido (Ciudad de México va aquí)
// Ciudad: idem a Estado (ciudades o alcaldías en caso de la cdmx)
// Colonia: primera letra en mayuscula
// Calle:  primera letra en mayuscula
// Codigo Postal: Solo Números (string por el 0) solo son 5 números
// numero: numeros y letras son caracterés permitidos: ("- .")

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

var id_fecha_inicio_obra = "fechaInicioObra";
var id_fecha_final_obra = "fechaFinalObra";

var existe_obra = false;
var uid_existente = "";

jQuery.datetimepicker.setLocale('es');

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
        option.value = snapshot.key;
        option.text = cliente.nombre;
        select.appendChild(option);
    });

});

$('#' + id_agregar_obra).click(function() {
  if (validateFormObra()){
    var datos_obra = datosAltaObra();
    console.log(datos_obra);
    //Revisar bien como se quiere la funcionalidad en cuanto a edición o alta de una obra
    if (existe_obra){
        firebase.database().ref(rama_bd_obras + "/obras/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var obra_update = {};
            obra_update["obras/" + uid_existente + "/clave_obra"] = datos_obra.clave_obra;
            obra_update["obras/" + uid_existente + "/nombre"] = datos_obra.nombre;
            obra_update["obras/" + uid_existente + "/id_cliente"] = datos_obra.id_cliente;
            obra_update["obras/" + uid_existente + "/direccion"] = datos_obra.direccion;
            obra_update["obras/" + uid_existente + "/fechas"] = datos_obra.fechas;
            obra_update["obras/" + uid_existente + "/retencion_fondo_garantia"] =datos_obra.retencion_fondo_garantia;
            if (registro_antiguo.fechas.fecha_inicio_teorica !== datos_obra.fechas.fecha_inicio_teorica){
              listas_path["listas/fechas_obra_inicio/programada/" + datos_obra.fechas.fecha_inicio_teorica + "/" + regKey] = true;
              listas_path["listas/fechas_obra_inicio/programada/" + registro_antiguo.fechas.fecha_inicio_teorica + "/" + regKey] = null;
            }
            if (registro_antiguo.fechas.fecha_final_teorica !== datos_obra.fechas.fecha_final_teorica){
              listas_path["listas/fechas_obra_fin/programada/" + datos_obra.fechas.fecha_final_teorica + "/" + regKey] = true;
              listas_path["listas/fechas_obra_fin/programada/" + registro_antiguo.fechas.fecha_final_teorica + "/" + regKey] = null;
            }
            firebase.database().ref(rama_bd_obras).update(obra_update);
            // pad
            pda("modificacion", rama_bd_obras + "/obras/" + uid_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormObra();
        });
    } else {
        firebase.database().ref(rama_bd_obras + "/obras").push(datos_obra).then(function(snapshot){
            var regKey = snapshot.key
            // actualizar listas
            var fechas = fechasProgramadas();
            var listas_path = {}
            listas_path["listas/obras_no_terminadas/" + regKey + "/nombre"] = datos_obra.nombre;
            listas_path["listas/obras_activas/" + regKey + "/nombre"] = datos_obra.nombre;
            listas_path["listas/fechas_obra_inicio/programada/" + fechas.inicio + "/" + regKey] = true;
            listas_path["listas/fechas_obra_fin/programada/" + fechas.final + "/" + regKey] = true;
            console.log(listas_path);
            //firebase.database().ref(rama_bd_obras).update(listas_path);

            // pista de auditoría
            //pda("alta", rama_bd_clientes + "/despachos/" + regKey, "");
            //alert("¡Alta exitosa!");
            //resetFormCliente();
            alert("Registro exitoso");
            //resetFormObra();
        });
    };
  };
})

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_clave_obra).change(function(){
    $('#' + id_clave_obra).val($('#' + id_clave_obra).val().toUpperCase());
    existe_obra=false;
    llenaCampos($('#' + id_clave_obra).val());
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
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
});

$('#' + id_colonia_obra).change(function(){
  var colonia = deleteBlankSpaces(id_colonia_obra);
  colonia = colonia.charAt(0).toUpperCase() + colonia.slice(1);
  $('#' + id_colonia_obra).val(colonia);
});

$('#' + id_calle_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
});

$('#' + id_calle_obra).change(function(){
  var calle = deleteBlankSpaces(id_calle_obra);
  calle = calle.charAt(0).toUpperCase() + calle.slice(1);
  $('#' + id_calle_obra).val(calle);
});

$('#' + id_codigo_postal_obra).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#' + id_codigo_postal_obra).change(function(){
    $('#' + id_codigo_postal_obra).val("" + $('#' + id_codigo_postal_obra).val());
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
  $('#' + id_ddl_cliente_obra).val("")
  $('#' + id_fecha_inicio_obra).val("");
  $('#' + id_fecha_final_obra).val("");
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
        alert("Escribe el codigo postal correspondiente a la ubicacion de la obra (5 dígitos).");
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
    } else if($('#' + id_fecha_inicio_obra).val() == ""){
        alert("Selecciona la fecha esperada de inicio de la obra");
        return false;
    } else if($('#' + id_fecha_final_obra).val() == ""){
        alert("Selecciona la fecha esperada de fin de la obra");
        return false;
    } else {
        return true;
    }
}

function direccionAltaObra(){
  var direccion = {};
  direccion = {
      estado: $('#' + id_estado_obra).val(),
      ciudad: $('#' + id_ciudad_obra).val(),
      colonia: $('#' + id_colonia_obra).val(),
      cp: $('#' + id_codigo_postal_obra).val(),
      calle: $('#' + id_calle_obra).val(),
      numero: $('#' + id_numero_obra).val()
  }
  return direccion;
};

function fechasAltaObra(){
  var fechas = {};
  var f_inicio = $('#' + id_fecha_inicio_obra).val().split('.');
  var f_final = $('#' + id_fecha_final_obra).val().split('.');
  fechas = {
      fecha_inicio_teorica: new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]).getTime(),
      fecha_final_teorica: new Date(f_final[0], f_final[1] - 1, f_final[2]).getTime()
  }
  return fechas;
}

function datosAltaObra(){
  var obra = {};
  obra = {
    clave_obra : $('#' + id_clave_obra).val(),
    nombre: $('#' + id_nombre_obra).val(),
    id_cliente: $('#' + id_ddl_cliente_obra + ' option:selected').val(),
    habilitada: true,
    direccion: direccionAltaObra(),
    retencion_fondo_garantia: $('#' + id_garantia_obra).val(),
    fechas: fechasAltaObra()
  }
  return obra;
}

function llenaCampos(clave){
  firebase.database().ref(rama_bd_obras + "/obras").orderByChild('clave_obra').equalTo(clave).limitToFirst(1).once("value").then(function(snapshot){
      snapshot.forEach(function(child_snap){
          var value = child_snap.val();
          if (value){
              existe_obra = true;
              uid_existente = child_snap.key;
              var direccion = value.direccion;
              var fechas = value.fechas;
              var fecha;
              $('#' + id_nombre_obra).val(value.nombre);
              $('#' + id_ddl_cliente_obra).val(value.id_cliente);
              $('#' + id_garantia_obra).val(value.retencion_fondo_garantia);
              $('#' + id_estado_obra).val(direccion.estado);
              $('#' + id_ciudad_obra).val(direccion.ciudad);
              $('#' + id_colonia_obra).val(direccion.colonia);
              $('#' + id_calle_obra).val(direccion.calle);
              $('#' + id_codigo_postal_obra).val(direccion.cp);
              $('#' + id_numero_obra).val(direccion.numero);
              fecha = new Date(fechas.fecha_inicio_teorica);
              $('#' + id_fecha_inicio_obra).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
              fecha = new Date(fechas.fecha_final_teorica);
              $('#' + id_fecha_final_obra).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
          } else {
              existe_obra = false;
          }
      });
  });
}

function highLightColor(id, color){
  document.getElementById(id).style.background = color;
  setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
}

function fechasProgramadas(){
  var f_inicio = $('#' + id_fecha_inicio_obra).val().split('.');
  var f_final = $('#' + id_fecha_final_obra).val().split('.');
  var lista_obra_inicio = f_inicio[0] + ("0" + f_inicio[1]).slice(-2) + ("0" + f_inicio[2]).slice(-2);
  var lista_obra_final = f_final[0] + ("0" + f_final[1]).slice(-2) + ("0" + f_final[2]).slice(-2);
  var fechas = {
    inicio: lista_obra_inicio,
    final: lista_obra_final
  }
  return fechas;
}
