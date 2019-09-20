// id's de los elementos HTML
var id_tab_obra = "tabAltaObra";
var id_form_obra = "formobra";
var id_dataTable_obra = "dataTableObra";

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

//Definición de variables del formulario
var id_clave_obra = "claveObra";
var id_nombre_obra = "nombreObra";
var id_ddl_cliente_obra = "clienteObra";
var id_garantia_obra = "garantiaObra";
var id_estado_obra = "estadoObra";
var id_ciudad_obra = "ciudadObra";
var id_colonia_obra = "coloniaObra";
var id_calle_obra = "calleObra";
var id_codigo_postal_obra = "cpObra";
var id_numero_obra = "numeroObra";
var id_fecha_inicio_obra = "fechaInicioObra";
var id_fecha_final_obra = "fechaFinalObra";

var id_agregar_obra = "agregarButtonObra";
var id_borrar_obra = "borrarButtonObra";

//Variables globales para controlar edición
var existe_obra = false;
var uid_existente = "";

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
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

    // Llenado del ddl de cliente.
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
    actualizarTablaObras();

});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_agregar_obra).click(function() {
  //Validar datos ingresados
  if (validateFormObra()){
    var datos_obra = datosAltaObra();
    //console.log(datos_obra);
    //Decidir si editar o dar de alta
    if (existe_obra){ //editar
        firebase.database().ref(rama_bd_obras + "/obras/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var obra_update = {};
            //Actualizar los campos de la obra
            obra_update["obras/" + uid_existente + "/clave_obra"] = datos_obra.clave_obra;
            obra_update["obras/" + uid_existente + "/nombre"] = datos_obra.nombre;
            obra_update["obras/" + uid_existente + "/id_cliente"] = datos_obra.id_cliente;
            obra_update["obras/" + uid_existente + "/direccion"] = datos_obra.direccion;
            obra_update["obras/" + uid_existente + "/retencion_fondo_garantia"] =datos_obra.retencion_fondo_garantia;
            if(datos_obra.terminada){
              obra_update["listas/obras_terminadas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            } else {
              obra_update["listas/obras_no_terminadas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            };
            if(!datos_obra.habilitada){
              obra_update["listas/obras_no_activas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            } else {
              obra_update["listas/obras_activas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            }

            //Actualizar fechas en obra y MISC
            if (registro_antiguo.fechas.fecha_inicio_teorica !== datos_obra.fechas.fecha_inicio_teorica){
              obra_update["obras/" + uid_existente + "/fechas/fecha_inicio_teorica"] = datos_obra.fechas.fecha_inicio_teorica;
              obra_update["procesos/" + uid_existente + "/procesos/MISC/subprocesos/MISC/fechas/fecha_inicio_teorica"] = datos_obra.fechas.fecha_inicio_teorica;
              obra_update["listas/fechas_obra_inicio/programada/" + datos_obra.fechas.fecha_inicio_teorica + "/" + uid_existente] = true;
              obra_update["listas/fechas_obra_inicio/programada/" + registro_antiguo.fechas.fecha_inicio_teorica + "/" + uid_existente] = null;
            }
            if (registro_antiguo.fechas.fecha_final_teorica !== datos_obra.fechas.fecha_final_teorica){
              obra_update["obras/" + uid_existente + "/fechas/fecha_final_teorica"] = datos_obra.fechas.fecha_final_teorica;
              obra_update["procesos/" + uid_existente + "/procesos/MISC/subprocesos/MISC/fechas/fecha_final_teorica"] = datos_obra.fechas.fecha_final_teorica;
              obra_update["listas/fechas_obra_fin/programada/" + datos_obra.fechas.fecha_final_teorica + "/" + uid_existente] = true;
              obra_update["listas/fechas_obra_fin/programada/" + registro_antiguo.fechas.fecha_final_teorica + "/" + uid_existente] = null;
            }
            firebase.database().ref(rama_bd_obras).update(obra_update);

            // PAD
            pda("modificacion", rama_bd_obras + "/obras/" + uid_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormObra();
        });
    } else { //dar de alta
        firebase.database().ref(rama_bd_obras + "/obras").push(datos_obra).then(function(snapshot){
            var regKey = snapshot.key;
            var obra_paths = {};
            var fechas = fechasAltaObra();
            //Dar de alta los 3 procesos default
            obra_paths["procesos/" + regKey + "/procesos/PC00"]=datosPC00();
            obra_paths["procesos/" + regKey + "/procesos/MISC"]=datosMISC(fechas);
            obra_paths["procesos/" + regKey + "/procesos/ADIC"]=datosADIC();
            obra_paths["procesos/" + regKey + "/num_procesos"]=0;

            // Actualizar listas
            var fechas = fechasProgramadasObra();
            obra_paths["listas/obras_no_terminadas/" + regKey + "/nombre"] = datos_obra.nombre;
            obra_paths["listas/obras_activas/" + regKey + "/nombre"] = datos_obra.nombre;
            obra_paths["listas/fechas_obra_inicio/programada/" + fechas.inicio + "/" + regKey] = true;
            obra_paths["listas/fechas_obra_fin/programada/" + fechas.final + "/" + regKey] = true;
            //console.log(obra_paths);
            firebase.database().ref(rama_bd_obras).update(obra_paths);

            // PAD
            pda("alta", rama_bd_obras + "/obras/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormObra();
        });
    };
  };
});
//Funcionalidad del boton 'Borrar todo'
$('#' + id_borrar_obra).click(function() {
  resetFormObra();
  existe_obra=false;
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_clave_obra).change(function(){
    $('#' + id_clave_obra).val($('#' + id_clave_obra).val().toUpperCase());
    //existe_obra=false;
    //llenaCamposObra($('#' + id_clave_obra).val());
});

$('#' + id_clave_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú",e)
});

$('#' + id_nombre_obra).change(function(){
    $('#' + id_nombre_obra).val($('#' + id_nombre_obra).val().toUpperCase());
});

$('#' + id_nombre_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú",e)
});

$('#' + id_garantia_obra).keypress(function(e){
    charactersAllowed("0123456789.",e)
});

$('#' + id_estado_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});

$('#' + id_estado_obra).change(function(){
  $('#' + id_estado_obra).val(corrigeCampoComplejo(id_estado_obra));
});

$('#' + id_ciudad_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});

$('#' + id_ciudad_obra).change(function(){
  $('#' + id_ciudad_obra).val(corrigeCampoComplejo(id_ciudad_obra));
});

$('#' + id_colonia_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú",e);
});

$('#' + id_colonia_obra).change(function(){
  var colonia = deleteBlankSpaces(id_colonia_obra);
  colonia = colonia.charAt(0).toUpperCase() + colonia.slice(1);
  $('#' + id_colonia_obra).val(colonia);
});

$('#' + id_calle_obra).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú",e);
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
//Borrar la información de todos los campos
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
  existe_obra=false;
}
//Dar formato de mayusculas y minúsculas
//Ejemplo: ciudad de    mexico -> Ciudad de Mexico
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
//Validar que no esté vacío nungún campo
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
//Construir el JSON de direccion para la obra
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
//Construir el JSON de fechas para la obra
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
//Construir el JSON de la obra
function datosAltaObra(){
  var obra = {};
  obra = {
    clave_obra : $('#' + id_clave_obra).val(),
    nombre: $('#' + id_nombre_obra).val(),
    id_cliente: $('#' + id_ddl_cliente_obra + ' option:selected').val(),
    habilitada: true,
    direccion: direccionAltaObra(),
    retencion_fondo_garantia: parseFloat($('#' + id_garantia_obra).val()),
    fechas: fechasAltaObra()
  }
  return obra;
}
//Construir el JSON del proceso PC00
function datosPC00(){
  var pc00 = {};
  pc00 = {
    nombre: "PREPROYECTO",
    alcance:"Trabajo previo a firmar contrato",
    num_subprocesos: 0,
    subprocesos:{
      PC00:{
        nombre: "PREPROYECTO",
        alcance: "Trabajo previo a firmar contrato"
      }
    }
  }
  return pc00;
}
//Construir el JSON del proceso MISC
function datosMISC(fechas){
  var misc = {};
  misc = {
    nombre: "MISCELANEOS",
    alcance:"Miscelaneos",
    num_subprocesos: 0,
    subprocesos:{
      MISC:{
        nombre: "MISCELANEOS",
        alcance: "",
        fechas: fechas,
      }
    }
  }
  return misc
}
//Construir el JSON del proceso ADIC
function datosADIC(){
  var adic = {};
  adic = {
    nombre: "ADICIONALES",
    alcance:"Adicionales",
    num_subprocesos: 0
  }
  return adic;
}
//Llenar los campos en caso de existir la clave de la obra
function llenaCamposObra(clave){
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
              highLightAllObra();
          } else {
              existe_obra = false;
          }
      });
  });
}

//Dar formato AAAAMMDD a las fechas
function fechasProgramadasObra(){
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

// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaObras(){
    firebase.database().ref(rama_bd_obras + "/obras").on("value",function(snapshot){
        var datos_obras = [];
        snapshot.forEach(function(obraSnap){
            var uid = obraSnap.key;
            var obra = obraSnap.val();
            var clave = obra.clave_obra;
            var nombre = obra.nombre;
            var habilitada = obra.habilitada;
            var fondo_garantia = obra.retencion_fondo_garantia;
            var direccion_json = obra.direccion;
            var fechas = obra.fechas;
            var id_cliente = obra.id_cliente;
            var terminada = obra.terminada;
            var cliente;
            firebase.database().ref(rama_bd_clientes + "/despachos/" + id_cliente + "/nombre").on("value", function(snapcliente){
              cliente = snapcliente.val();
            });

            var direccion = direccion_json.calle + "/" + direccion_json.numero + "/" +
                            direccion_json.colonia + "/" + direccion_json.ciudad + "/" +
                            direccion_json.estado + "/" + direccion_json.cp;
            var direccion_text = direccion_json.calle + " " + direccion_json.numero + ", " +
                              direccion_json.colonia + ". " + direccion_json.ciudad + ", " +
                              direccion_json.estado + ". CP: " + direccion_json.cp;

            var fecha = new Date(fechas.fecha_inicio_teorica);
            var fecha_inicio = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);
            fecha = new Date(fechas.fecha_final_teorica);
            var fecha_final = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);

            var icon_class = "";
            if(habilitada) {
                icon_class = "'icono_verde fas fa-check-circle'";
            } else {
                icon_class = "'icono_rojo fas fa-times-circle'"
            }
            if (terminada){
              terminada = "Sí";
            } else {
              terminada = "No";
            }

            datos_obras.push([
                uid,
                id_cliente,
                clave,
                nombre,
                cliente,
                direccion,
                direccion_text,
                fondo_garantia,
                fecha_inicio,
                fecha_final,
                terminada,
                "<button type='button' class='btn btn-transparente' onclick='habilitarObra(" + habilitada + "," + "\`"  + uid  + "\`" + ")'><i class=" + icon_class + "></i></button>",
            ]);
        });

        tabla_obra = $('#'+ id_dataTable_obra).DataTable({
            destroy: true,
            data: datos_obras,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 3 },
                { "width": "100px", "targets": 6 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 }, //campos auxiliares
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 5 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                { targets: [2,7,8,9,10], className: 'dt-body-center'},
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_obra + ' tbody').on( 'click', '.editar', function () {
            highLightAllObra();
            var data = tabla_obra.row( $(this).parents('tr') ).data();
            var direccion = data[5].split("/");
            resetFormObra();
            existe_obra = true;
            uid_existente = data[0];
            $('#' + id_clave_obra).val(data[2]);
            $('#' + id_nombre_obra).val(data[3]);
            $('#' + id_ddl_cliente_obra).val(data[1]);
            $('#' + id_garantia_obra).val(data[7]);
            $('#' + id_estado_obra).val(direccion[4]);
            $('#' + id_ciudad_obra).val(direccion[3]);
            $('#' + id_colonia_obra).val(direccion[2]);
            $('#' + id_calle_obra).val(direccion[0]);
            $('#' + id_codigo_postal_obra).val(direccion[5]);
            $('#' + id_numero_obra).val(direccion[1]);
            $('#' + id_fecha_inicio_obra).val(data[8]);
            $('#' + id_fecha_final_obra).val(data[9]);
        } );
    });
}

// función para actualizar el valor "habilitado:boolean" en la database.
function  habilitarObra(habilitada, id){
    var aux = {"habilitada": !habilitada};

    firebase.database().ref(rama_bd_obras + "/obras/" + id).once("value").then(function(snapshot){
        var registro_antiguo = snapshot.val();

        // actualizar registro
        firebase.database().ref(rama_bd_obras + "/obras/" + id).update(aux);

        // actualizar listas
        if(habilitada){
            firebase.database().ref(rama_bd_obras + "/listas/obras_activas/" + id).remove();
            firebase.database().ref(rama_bd_obras + "/listas/obras_no_activas/" + id + "/nombre").set(registro_antiguo.nombre);
        } else {
            firebase.database().ref(rama_bd_obras + "/listas/obras_activas/" + id+ "/nombre").set(registro_antiguo.nombre);
            firebase.database().ref(rama_bd_obras + "/listas/obras_no_activas/" + id).remove();
        }
        // pda
        pda("modificacion", rama_bd_obras + "/obras/" + id, registro_antiguo)
    });
}

//Funcion para resaltar todos los campos
function highLightAllObra(){
    highLight(id_clave_obra);
    highLight(id_nombre_obra);
    highLight(id_ddl_cliente_obra);
    highLight(id_garantia_obra);
    highLight(id_estado_obra);
    highLight(id_ciudad_obra);
    highLight(id_colonia_obra);
    highLight(id_calle_obra);
    highLight(id_codigo_postal_obra);
    highLight(id_numero_obra);
    highLight(id_fecha_inicio_obra);
    highLight(id_fecha_final_obra);
}

//Funcion para colorear un campo
function highLightColor(id, color){
  document.getElementById(id).style.background = color;
  setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
}
