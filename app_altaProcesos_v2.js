// id's de los elementos HTML
var id_tab_proceso = "tabAltaProcesos";
var id_form_proceso = "formProcesos";
var id_dataTable_proceso = "dataTableProcesos";

var id_ddl_obraProcesos = "obraProcesos";
var id_ddl_procesoProcesos = "ddl_nombreProcesoProcesos";
var id_clave_proceso = "claveProcesoProcesos";
var id_nombre_proceso = "nombreProcesoProcesos";
var id_alcance_proceso = "alcanceProcesoProcesos";
var id_checkbox_supbroceso = "altaSubprocesoCheckbox";
var id_seccion_subproceso = "seccionSubprocesoProcesos";
var id_ddl_subproceso = "ddl_subprocesoProcesos";
var id_clave_subproceso = "claveSubproceso";
var id_nombre_subproceso = "nombreSubproceso";
var id_ddl_categoriaSubproceso = "categoriaSubprocesoProcesos";
var id_fecha_inicio_subproceso = "fechaInicioSubproceso";
var id_fecha_final_subproceso = "fechaFinalSubproceso";
var id_alcance_subproceso = "alcanceSubprocesoProcesos";

var id_agregar_proceso = "botonAgregarProceso";
var id_borrar_proceso = "botonBorrarProceso";

//Variables globales para controlar edición
var existe_proceso = false;
var uid_proceso = "";
var existe_subproceso = false;
var uid_subproceso = "";

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
$('#' + id_tab_proceso).click(function() {
    resetFormProceso();
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_inicio_subproceso).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_final_subproceso).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );

    // Necesita funcionalidad para llenar el ddl de obra.
    $('#' + id_ddl_obraProcesos).empty();
    var select = document.getElementById(id_ddl_obraProcesos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var obra;
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        cliente = snapshot.val();
        option = document.createElement('option');
        option.value = snapshot.key;
        option.text = obra.nombre;
        select.appendChild(option);
    });
    //actualizarTablaObras();

});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_agregar_proceso).click(function() {
  //Validar datos ingresados
  if (validateFormProceso()){
    var datos_proceso = datosAltaProceso();
    var datos_subproceso = datosAltaSubproceso();
    //Decidir si editar o dar de alta
    if (existe_proceso){ //editar
        //firebase.database().ref(rama_bd_obras + "/obras/" + uid_existente).once("value").then(function(snapshot){
            alert("¡Edición exitosa!");
            resetFormProceso();
        //});
    } else { //dar de alta
        //firebase.database().ref(rama_bd_obras + "/obras").push(datos_obra).then(function(snapshot){
            alert("¡Alta exitosa!");
            resetFormProceso();
        //});
    };
  };
});
//Funcionalidad del boton 'Borrar todo'
$('#' + id_borrar_proceso).click(function() {
  resetFormProceso();
  existe_proceso=false;
  existe_subproceso=false;
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_ddl_obraProcesos).change(function(){

});

$('#' + id_ddl_procesoProcesos).change(function(){

});

$('#' + id_nombre_proceso).change(function(){
    $('#' + id_nombre_proceso ).val(corrigeCampoComplejo(id_nombre_proceso));
});

$('#' + id_nombre_proceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789",e)
});

$('#' + id_alcance_proceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789()",e)
});

$('#' + id_checkbox_supbroceso ).change(function(){
    if (this.prop("checked")){
      $('#' + id_seccion_subproceso ).removeClass(“hidden”);
    } else {
      $('#' + id_seccion_subproceso ).addClass(“hidden”);
    }
});

$('#' + id_ddl_subproceso ).change(function(){

});

$('#' + id_clave_subproceso ).keypress(function(e){
    charactersAllowed("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-0123456789",e);
});

$('#' + id_clave_subproceso).change(function(){

});

$('#' + id_nombre_subproceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
});

$('#' + id_ddl_categoriaSubproceso).change(function(){

});

$('#' + id_suministros_subproceso).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#' + id_precopeo_subproceso).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#' + id_horasScore_subproceso ).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#' + id_costoScore_subproceso ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});


// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
function resetFormObra (){
  $('#' + id_ddl_obraProcesos ).val("");
  $('#' + id_ddl_procesoProcesos ).val("");
  $('#' + id_clave_proceso ).val("");
  $('#' + id_nombre_proceso ).val("");
  $('#' + id_alcance_proceso ).val("");
  $('#' + id_checkbox_supbroceso ).prop('checked', false);
  //$('#' + id_seccion_subproceso ).addClass("hidden");
  $('#' + id_ddl_subproceso ).val("");
  $('#' + id_clave_subproceso ).val("");
  $('#' + id_nombre_subproceso ).val("")
  $('#' + id_ddl_categoriaSubproceso ).val("");
  $('#' + id_suministros_subproceso ).val("");
  $('#' + id_precopeo_subproceso  ).val("");
  $('#' + id_fecha_inicio_subproceso  ).val("");
  $('#' + id_fecha_final_subproceso  ).val("");
  $('#' + id_horasScore_subproceso  ).val("");
  $('#' + id_costoScore_subproceso  ).val("");
  existe_proceso = false;
  existe_subproceso = false;
}

//Validar que no esté vacío nungún campo
function validateFormProceso(){
    if($('#' + id_ddl_obraProcesos + " option:selected").val() === ""){
        alert("Ninguna obra fue seleccionada");
        highLightColor(id_ddl_obraProcesos,"#FF0000");
        return false;
    }else if($('#' + id_ddl_procesoProcesos  + " option:selected").val() === ""){
        alert("Ningún proceso fue seleccionado");
        highLightColor(id_ddl_procesoProcesos ,"#FF0000");
        return false;
    } else if ($('#' + id_clave_proceso ).val() == ""){
        alert("Escribe la clave del proceso");
        highLightColor(id_clave_obra,"#FF0000");
        return false;
    } else if($('#' + id_nombre_proceso ).val() == ""){
        alert("Escribe el nombre del proceso");
        highLightColor(id_nombre_proceso,"#FF0000");
        return false;
    } else if($('#' + id_alcance_proceso ).val() == ""){
        alert("Escribe el alcance del proceso");
        highLightColor(id_alcance_proceso ,"#FF0000");
        return false;
    } else if($('#' + id_checkbox_supbroceso ).prop('checked')){
        if($('#' + id_ddl_subproceso + " option:selected").val() == ""){
            alert("Ningún subproceso fue seleccionado.");
            highLightColor(id_ddl_subproceso,"#FF0000");
            return false;
        } else if($('#' + id_clave_subproceso ).val() == ""){
            alert("Escribe la clave del subproceso.");
            highLightColor(id_clave_subproceso,"#FF0000");
            return false;
        } else if($('#' + id_nombre_subproceso ).val() == ""){
            alert("Escribe el nombre del subproceso.");
            highLightColor(id_nombre_subproceso,"#FF0000");
            return false;
        } else if($('#' + id_ddl_categoriaSubproceso).val() == ""){
            alert("Ninguna categoría fue seleccionada.");
            highLightColor(id_ddl_categoriaSubproceso ,"#FF0000");
            return false;
        }  else if($('#' + id_suministros_subproceso).val() === ""){
            alert("Escribe el monto de suministros para el subproceso");
            highLightColor(id_suministros_subproceso ,"#FF0000");
            return false;
        }  else if($('#' + id_precopeo_subproceso ).val() === ""){
            alert("Escribe el monto de precopeo para el subproceso");
            highLightColor(id_precopeo_subproceso  ,"#FF0000");
            return false;
        } else if($('#' + id_fecha_inicio_subproceso  ).val() == ""){
            alert("Selecciona la fecha esperada de inicio de la obra");
            return false;
        } else if($('#' + id_fecha_final_subproceso ).val() == ""){
            alert("Selecciona la fecha esperada de fin de la obra");
            return false;
        } else if($('#' + id_horasScore_subproceso ).val() == ""){
            alert("Escribe la cantidad de horas 'Score' del subproceso");
            highLightColor(id_horasScore_subproceso ,"#FF0000");
            return false;
        } else if($('#' + id_costoScore_subproceso).val() == ""){
            alert("Escribe el costo por hora 'Score' del subproceso");
            highLightColor(id_costoScore_subproceso ,"#FF0000");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
//Construir el JSON del proceso
function datosAltaProceso(num_subp){
  var proceso = {};
  proceso = {
    nombre : $('#' + id_nombre_proceso).val(),
    alcance: $('#' + id_alcance_proceso).val(),
    num_subprocesos: num_subp
  }
  return proceso;
}
//Construir el JSON de fechas para la obra
function fechasAltaSubproceso(){
  var fechas = {};
  var f_inicio = $('#' + id_fecha_inicio_subproceso ).val().split('.');
  var f_final = $('#' + id_fecha_final_subproceso ).val().split('.');
  fechas = {
      fecha_inicio_teorica: new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]).getTime(),
      fecha_final_teorica: new Date(f_final[0], f_final[1] - 1, f_final[2]).getTime()
  }
  return fechas;
}
//Construir el JSON de la obra
function datosAltaSubproceso(){
  var subproceso = {};
  subproceso = {
    nombre: $('#' + id_nombre_subproceso ).val(),
    categoria: $('#' + id_ddl_categoriaSubproceso  + ' option:selected').val(),
    alcance: $('#' + id_suministros_subproceso).val(),
    fechas: fechasAltaSubproceso()
  }
  return subproceso;
}
//Construir el JSON del proceso PC00
function datosPC00(){
  var pc00 = {};
  pc00 = {
    nombre: "PREPROYECTO",
    alcance:"Trabajo previo a firmar contrato",
    num_subprocesos: 1,
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
    num_subprocesos: 1,
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
              highLightAllObra();
          } else {
              existe_obra = false;
          }
      });
  });
}

//Dar formato AAAAMMDD a las fechas
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
            "columnDefs": [
                { "width": "150px", "targets": 3 },
                { "width": "100px", "targets": 6 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 },
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 5 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });

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
            firebase.database().ref(rama_bd_obras + "/listas/obras_no_activas/" + id).set(true);
        } else {
            firebase.database().ref(rama_bd_obras + "/listas/obras_activas/" + id).set(true)
            firebase.database().ref(rama_bd_obras + "/listas/obras_no_activas/" + id).remove();
        }
        // pda
        pda("modificacion", rama_bd_obras + "/obras/" + id, registro_antiguo)
    });
}

function highLightAllProceso(){
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
