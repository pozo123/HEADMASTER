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
var id_fecha_inicio_proceso = "fechaInicioProceso";
var id_fecha_final_proceso = "fechaFinalProceso";
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
    jQuery('#' + id_fecha_inicio_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_final_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
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
        obra = snapshot.val();
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
    var uid_obra = $('#' + id_ddl_obraProcesos + " option:selected").val();
    var proceso_update = {};
    var registro_antiguo_s;
    var registro_antiguo_p;
    var modificacion=false;
    var cadena_alert="";
    uid_proceso = $('#' + id_clave_proceso).val();
    firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra).once("value").then(function(snapshot){
      var registro_obra = snapshot.val();
      //Decidir si editar o dar de alta
      if (existe_proceso){ //editar
        registro_antiguo_p = registro_obra["procesos"][uid_proceso];
        var datos_proceso= datosAltaProceso(0);
        var fechas = fechasSubproceso(id_fecha_inicio_proceso, id_fecha_final_proceso);
        var subproceso_antiguo = registro_antiguo_p["subprocesos"][uid_proceso];
        if ($('#' + id_nombre_proceso).val() !== registro_antiguo_p.nombre || $('#' + id_alcance_proceso).val() !== registro_antiguo_p.alcance || fechas.fecha_inicio_teorica == subproceso_antiguo.fechas.fecha_inicio_teorica || fechas.fecha_final_teorica == subproceso_antiguo.fechas.fecha_final_teorica){
          //Actualizar los campos del proceso
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/nombre"] = datos_proceso.nombre;
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/alcance"] = datos_proceso.alcance;
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_proceso + "/nombre"] = datos_proceso.nombre;
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_proceso + "/alcance"] = datos_proceso.alcance;
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_proceso + "/fechas/fecha_inicio_teorica"] = fechas.fecha_inicio_teorica;
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_proceso + "/fechas/fecha_final_teorica"] = fechas.fecha_final_teorica;
          cadena_alert= "¡Edición exitosa de proceso! ";
          modificacion = true;
        } else {
          cadena_alert = "¡Proceso no modificado! ";
        }
        if ($('#' + id_checkbox_supbroceso ).prop("checked") && !existe_subproceso){
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/num_subprocesos"] = registro_antiguo_p.num_subprocesos + 1;
          modificacion = true;
        }
        //resetFormProceso_proceso(true);
      } else { //dar de alta
        var datos_proceso;
        var obra_num_procesos = registro_obra.num_procesos+1;;
        if ($('#' + id_checkbox_supbroceso ).prop("checked")){
            datos_proceso = datosAltaProceso(1);
        } else {
            datos_proceso = datosAltaProceso(0);
        }
        var proceso_path = "procesos/" + uid_obra + "/procesos/" + uid_proceso;
        proceso_update[proceso_path + "/nombre"] = datos_proceso.nombre;
        proceso_update[proceso_path + "/alcance"] = datos_proceso.alcance;
        proceso_update[proceso_path + "/num_subprocesos"] = datos_proceso.num_subprocesos;
        proceso_update[proceso_path + "/subprocesos/" + uid_proceso] = datosAltaSubprocesoCopia();
        proceso_update["procesos/" + uid_obra + "/num_procesos"] = obra_num_procesos;
        cadena_alert= cadena_alert + "¡Alta exitosa de proceso! ";
      };
      if ($('#' + id_checkbox_supbroceso ).prop("checked")){ //tambien subproceso
          var datos_subproceso = datosAltaSubproceso();
          if (existe_subproceso){ //editar
            registro_antiguo_s = registro_obra["procesos"][uid_proceso]["subprocesos"][uid_subproceso];
            //Actualizar los campos del proceso
            var subproceso_path ="procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/"+ uid_subproceso;
            proceso_update[subproceso_path + "/nombre"] = datos_subproceso.nombre;
            proceso_update[subproceso_path + "/categoria"] = datos_subproceso.categoria;
            proceso_update[subproceso_path + "/alcance"] = datos_subproceso.alcance;
            proceso_update[subproceso_path + "/fechas/fecha_inicio_teorica"] = datos_subproceso.fechas.fecha_inicio_teorica;
            proceso_update[subproceso_path + "/fechas/fecha_final_teorica"] = datos_subproceso.fechas.fecha_final_teorica;
            cadena_alert = "¡Edición exitosa de subproceso!";
          } else { //dar de alta
            uid_subproceso = $('#'+id_clave_subproceso).val();
            proceso_update["procesos/" + uid_obra + "/procesos/" +  uid_proceso + "/subprocesos/" + uid_subproceso] = datos_subproceso;
            cadena_alert = cadena_alert + "¡Alta exitosa de subproceso!";
          }
      }
      //Escribir los cambios en la base de datos
      //console.log(proceso_update)
      firebase.database().ref(rama_bd_obras).update(proceso_update);
      //pda
      if(existe_proceso){
        if (modificacion){//edicion proceso
          pda("modificacion", rama_bd_obras + "/procesos/" + uid_obra + "/procesos/" + uid_proceso, registro_antiguo_p);
        }
      } else {//alta proceso
        pda("alta", rama_bd_obras + "/procesos/" + uid_obra + "/procesos/" + uid_proceso, "");
      }
      if ($('#' + id_checkbox_supbroceso ).prop("checked")){
        if (existe_subproceso){//editar subproceso
          pda("modificacion", rama_bd_obras + "/" + subproceso_path, registro_antiguo_s);
        }else {//alta subproceso
          pda("alta", rama_bd_obras + "/procesos/" + uid_obra + "/procesos/" +  uid_proceso + "/subprocesos/" + uid_subproceso, "");
        }
      }
      alert(cadena_alert);
      resetFormProceso();
    });
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
  resetFormProceso_proceso(true);
  resetFormProceso_subproceso(true);
  $('#' + id_ddl_procesoProcesos).empty();
  var select = document.getElementById(id_ddl_procesoProcesos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var proceso;
  firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/procesos").orderByKey().on('child_added',function(snapshot){
      proceso = snapshot.val();
      if (proceso){
        if (snapshot.key !== "ADIC" && snapshot.key !== "MISC" && snapshot.key !== "PC00"){
          option = document.createElement('option');
          option.value = snapshot.key;
          option.text = snapshot.key + " " + proceso.nombre;
          select.appendChild(option);
        }
      }
  });
  option = document.createElement('option');
  option.value = "NUEVO";
  option.text = "-CREAR NUEVO-";
  select.appendChild(option);
});

$('#' + id_ddl_procesoProcesos).change(function(){
  resetFormProceso_proceso(false);
  resetFormProceso_subproceso(true);
  if ($('#' + id_ddl_procesoProcesos + " option:selected").val() !== "NUEVO"){
    existe_proceso = true;
    uid_proceso = $('#' + id_ddl_procesoProcesos + " option:selected").val();
    $('#' + id_clave_proceso). val (uid_proceso);
    var proceso;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/procesos/"+ uid_proceso).on('value',function(snapshot){
        proceso = snapshot.val();
        var fechas = proceso["subprocesos"][snapshot.key]["fechas"];
        $('#' + id_clave_proceso).val(snapshot.key);
        $('#' + id_nombre_proceso ).val(proceso.nombre);
        $('#' + id_alcance_proceso ).val(proceso.alcance);
        if ($('#' + id_checkbox_supbroceso).prop("checked")){
          llenaDdlSubproceso(snapshot.key);
        }
        var fecha = new Date(fechas.fecha_inicio_teorica);
        $('#' + id_fecha_inicio_proceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
        fecha = new Date(fechas.fecha_final_teorica);
        $('#' + id_fecha_final_proceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
    });
  } else {
    existe_proceso = false;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/num_procesos").on('value',function(snapshot){
        var procesos = snapshot.val() - 2;
        var clave;
        if(procesos<10){
          clave = "PC0"+procesos;
        }else {
          clave = "PC"+procesos;
        }
        $('#'+id_clave_proceso).val(clave);
    });
  }
});

$('#' + id_nombre_proceso).change(function(){
    $('#' + id_nombre_proceso ).val(deleteBlankSpaces(id_nombre_proceso).toUpperCase());
});

$('#' + id_nombre_proceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789",e)
});

$('#' + id_alcance_proceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789()",e)
});

$('#' + id_checkbox_supbroceso ).change(function(){
    if ($('#' + id_checkbox_supbroceso ).prop("checked")){
      $('#' + id_seccion_subproceso ).removeClass('hidden');
      if ($('#' + id_ddl_procesoProcesos + " option:selected").val() !== null &&  $('#' + id_ddl_procesoProcesos + " option:selected").val() !== 0){
        llenaDdlSubproceso($('#' + id_ddl_procesoProcesos + " option:selected").val());
      }
      llenaDdlCategoria();
    } else {
      $('#' + id_seccion_subproceso ).addClass('hidden');
    }
});

$('#' + id_ddl_subproceso ).change(function(){
  resetFormProceso_subproceso(false);
  existe_subproceso = false;
  if ($('#' + id_ddl_subproceso + " option:selected").val() !== "NUEVO"){
    $('#' + id_ddl_categoriaSubproceso).prop('disabled',true);
    existe_subproceso = true;
    uid_subproceso = $('#' + id_ddl_subproceso + " option:selected").val();
    var subproceso;
    var fecha;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#'+id_ddl_obraProcesos+" option:selected").val() + "/procesos/"+ $('#'+id_ddl_procesoProcesos +" option:selected").val() + "/subprocesos/" + uid_subproceso).on('value',function(snapshot){
        subproceso = snapshot.val();
        var fechas = subproceso.fechas;
        $('#' + id_clave_subproceso).val(snapshot.key);
        $('#' + id_nombre_subproceso).val(subproceso.nombre);
        $('#' + id_alcance_subproceso).val(subproceso.alcance);
        $('#' + id_ddl_categoriaSubproceso).val(subproceso.categoria);
        fecha = new Date(fechas.fecha_inicio_teorica);
        $('#' + id_fecha_inicio_subproceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
        fecha = new Date(fechas.fecha_final_teorica);
        $('#' + id_fecha_final_subproceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
    });
  } else {
    $('#' + id_ddl_categoriaSubproceso).prop('disabled',false);
  }
});

$('#' + id_clave_subproceso ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-0123456789",e);
});

$('#' + id_clave_subproceso).change(function(){
  $('#' + id_clave_subproceso ).val($('#' + id_clave_subproceso).val().toUpperCase());
});

$('#' + id_nombre_subproceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-0123456789",e);
});

$('#' + id_nombre_subproceso).change(function(e){
    $('#' + id_nombre_subproceso ).val($('#' + id_nombre_subproceso).val().toUpperCase());
});

$('#' + id_alcance_subproceso).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789()",e)
});

$('#' + id_ddl_categoriaSubproceso).change(function(e){
  if(existe_proceso && !existe_subproceso){
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#'+id_ddl_obraProcesos+" option:selected").val() + "/procesos/"+ uid_proceso + "/subprocesos").orderByChild('categoria').on('value',function(snapshot){
        var cont = 1;
        var clave;
        if(snapshot.exists() ){
          snapshot.forEach(function(snapChild){
            if (snapChild.val().categoria == $('#'+id_ddl_categoriaSubproceso+" option:selected").val()){
              cont ++;
            }
          })
        }
        if(cont<10){
          clave = $('#'+id_clave_proceso).val() + "-" + $('#'+id_ddl_categoriaSubproceso+" option:selected").text() + "0" + cont;
        }else {
          clave = $('#'+id_clave_proceso).val() + "-" + + $('#'+id_ddl_categoriaSubproceso+" option:selected").text() + cont;
        }
        $('#' + id_clave_subproceso).val(clave);
    });
  }
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
function resetFormProceso (){
  $('#' + id_ddl_obraProcesos ).val("");
  resetFormProceso_proceso(true);
  $('#' + id_checkbox_supbroceso ).prop('checked', false);
  $('#' + id_seccion_subproceso ).addClass('hidden');
  resetFormProceso_subproceso(true);
  existe_proceso = false;
  existe_subproceso = false;
}
function resetFormProceso_proceso(proceso){
  if (proceso){
    $('#' + id_ddl_procesoProcesos ).val("");
  }
  $('#' + id_clave_proceso ).val("");
  $('#' + id_nombre_proceso ).val("");
  $('#' + id_fecha_inicio_proceso  ).val("");
  $('#' + id_fecha_final_proceso  ).val("");
  $('#' + id_alcance_proceso ).val("");
}
function resetFormProceso_subproceso(subproceso){
  if (subproceso){
      $('#' + id_ddl_subproceso ).val("");
  }
  $('#' + id_clave_subproceso ).val("");
  $('#' + id_nombre_subproceso ).val("")
  $('#' + id_ddl_categoriaSubproceso ).val("");
  $('#' + id_fecha_inicio_subproceso  ).val("");
  $('#' + id_fecha_final_subproceso  ).val("");
  $('#' + id_alcance_subproceso).val("");
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
            alert("Selecciona una categoria para generar la clave del subproceso.");
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
        } else if($('#' + id_fecha_inicio_subproceso  ).val() == ""){
            alert("Selecciona la fecha esperada de inicio de la obra");
            return false;
        } else if($('#' + id_fecha_final_subproceso ).val() == ""){
            alert("Selecciona la fecha esperada de fin de la obra");
            return false;
        } else if($('#' + id_alcance_subproceso ).val() == ""){
            alert("Escribe el alcance del subproceso");
            highLightColor(id_alcance_subproceso ,"#FF0000");
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
function fechasSubproceso(fechaDeInicio, fechaDeFinal){
  var fechas = {};
  var f_inicio = $('#' + fechaDeInicio).val().split('.');
  var f_final = $('#' + fechaDeFinal).val().split('.');
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
    nombre: $('#' + id_nombre_subproceso).val(),
    categoria: $('#'+id_ddl_categoriaSubproceso+' option:selected').val(),
    alcance: $('#' + id_alcance_subproceso).val(),
    fechas: fechasSubproceso(id_fecha_inicio_subproceso, id_fecha_final_subproceso),
    precio_venta: 0,
    costo_suministros:0,
    precopeo: 0,
    score: {
      horas_programadas: 0,
      costo_hora: 0
    }
  }
  return subproceso;
}
//Construir el JSON de la obra
function datosAltaSubprocesoCopia(){
  var subproceso = {};
  subproceso = {
    nombre: $('#' + id_nombre_proceso).val(),
    alcance: $('#' + id_alcance_proceso).val(),
    fechas: fechasSubproceso(id_fecha_inicio_proceso, id_fecha_final_proceso),
    precio_venta: 0,
    costo_suministros:0,
    precopeo: 0,
    score: {
      horas_programadas: 0,
      costo_hora: 0
    }
  }
  return subproceso;
}

function llenaDdlSubproceso(clave){
    $('#' + id_ddl_subproceso).empty();
    var select = document.getElementById(id_ddl_subproceso);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var subproceso;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/procesos/" + clave + "/subprocesos").orderByKey().on('child_added',function(snapshot){
        subproceso = snapshot.val();
        if (subproceso){
          option = document.createElement('option');
          option.value = snapshot.key;
          option.text = snapshot.key + " " + subproceso.nombre;
          select.appendChild(option);
        }
    });
    option = document.createElement('option');
    option.value = "NUEVO";
    option.text = "-CREAR NUEVO-";
    select.appendChild(option);
}

function llenaDdlCategoria(){
  $('#' + id_ddl_categoriaSubproceso ).empty();
  var select = document.getElementById(id_ddl_categoriaSubproceso );
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var categoria;
  firebase.database().ref(rama_bd_datos_referencia + "/especialidades").orderByKey().on('child_added',function(snapshot){
      categoria = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = categoria.clave;
      select.appendChild(option);
  });
}

//Dar formato AAAAMMDD a las fechas
function fechasProgramadasProcesos(){
  var f_inicio = $('#' + id_fecha_inicio_subproceso ).val().split('.');
  var f_final = $('#' + id_fecha_final_subproceso ).val().split('.');
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
function actualizarTablaProcesos(){
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
