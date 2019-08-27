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

    // Llenado del ddl de obra.
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
    // Llenado del ddl de categoría.
    llenaDdlCategoria();
    actualizarTablaProcesos();
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_agregar_proceso).click(function() {
  //Validar datos ingresados
  if (validateFormProceso()){
    var uid_obra = $('#' + id_ddl_obraProcesos + " option:selected").val();
    var proceso_update = {}; //variable para guardar todos los cambios a la bd
    var registro_antiguo_s; //variable para informacion antigua
    var registro_antiguo_p; //variable para informacion antigua
    var modificacion=false; //variable auxiliar para modificacion de proceso
    var cadena_alert=""; //varible auxiliar para mensaje
    uid_proceso = $('#' + id_clave_proceso).val();
    firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra).once("value").then(function(snapshot){
      var registro_obra = snapshot.val(); //obtencion de toda la informacion de la obra
      //Decidir si editar o dar de alta
      if (existe_proceso){ //editar proceso
        registro_antiguo_p = registro_obra["procesos"][uid_proceso];
        var datos_proceso= datosAltaProceso(0);
        var fechas = fechasSubproceso(id_fecha_inicio_proceso, id_fecha_final_proceso);
        var subproceso_antiguo = registro_antiguo_p["subprocesos"][uid_proceso];
        if ($('#' + id_nombre_proceso).val() !== registro_antiguo_p.nombre || $('#' + id_alcance_proceso).val() !== registro_antiguo_p.alcance || fechas.fecha_inicio_teorica !== subproceso_antiguo.fechas.fecha_inicio_teorica || fechas.fecha_final_teorica !== subproceso_antiguo.fechas.fecha_final_teorica){
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
          //No actualizar nada del proceso
          cadena_alert = "¡Proceso no modificado! ";
        }
        if ($('#' + id_checkbox_supbroceso ).prop("checked") && !existe_subproceso){ //Determinar si se crea un subproceso nuevo
          proceso_update["procesos/" + uid_obra + "/procesos/" + uid_proceso + "/num_subprocesos"] = registro_antiguo_p.num_subprocesos + 1;
          modificacion = true;
        }
      } else { //dar de alta proceso
        var datos_proceso;
        var obra_num_procesos = registro_obra.num_procesos+1;;
        if ($('#' + id_checkbox_supbroceso ).prop("checked")){ //Determinar si se crea un subproceso n
            datos_proceso = datosAltaProceso(1);
        } else {
            datos_proceso = datosAltaProceso(0);
        }
        var proceso_path = "procesos/" + uid_obra + "/procesos/" + uid_proceso;
        //Crear los campos del proceso
        proceso_update[proceso_path + "/nombre"] = datos_proceso.nombre;
        proceso_update[proceso_path + "/alcance"] = datos_proceso.alcance;
        proceso_update[proceso_path + "/num_subprocesos"] = datos_proceso.num_subprocesos;
        proceso_update[proceso_path + "/subprocesos/" + uid_proceso] = datosAltaSubprocesoCopia();
        proceso_update["procesos/" + uid_obra + "/num_procesos"] = obra_num_procesos;
        cadena_alert= cadena_alert + "¡Alta exitosa de proceso! ";
      };
      if ($('#' + id_checkbox_supbroceso ).prop("checked")){ //tambien subproceso
          var datos_subproceso = datosAltaSubproceso(); //crear un JSON del subproceso
          if (existe_subproceso){ //editar subproceso
            registro_antiguo_s = registro_obra["procesos"][uid_proceso]["subprocesos"][uid_subproceso];
            //Actualizar los campos del proceso
            var subproceso_path ="procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/"+ uid_subproceso;
            proceso_update[subproceso_path + "/nombre"] = datos_subproceso.nombre;
            proceso_update[subproceso_path + "/categoria"] = datos_subproceso.categoria;
            proceso_update[subproceso_path + "/alcance"] = datos_subproceso.alcance;
            proceso_update[subproceso_path + "/fechas/fecha_inicio_teorica"] = datos_subproceso.fechas.fecha_inicio_teorica;
            proceso_update[subproceso_path + "/fechas/fecha_final_teorica"] = datos_subproceso.fechas.fecha_final_teorica;
            cadena_alert = cadena_alert + "¡Edición exitosa de subproceso!";
          } else { //dar de alta subproceso
            uid_subproceso = $('#'+id_clave_subproceso).val();
            //Crear el subproceso en su direccion correspondiente
            proceso_update["procesos/" + uid_obra + "/procesos/" +  uid_proceso + "/subprocesos/" + uid_subproceso] = datos_subproceso;
            cadena_alert = cadena_alert + "¡Alta exitosa de subproceso!";
          }
      }
      //console.log(proceso_update)
      //Escribir los cambios en la base de datos
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
      alert(cadena_alert); //retroalimentacion al usuario
      resetFormProceso(); //limpiar el formulario
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
//Funcionalidad del ddl de obra: llenar el ddl de procesos y tabla de contenido
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
      if (snapshot.exists()){
        if (snapshot.key !== "ADIC" && snapshot.key !== "MISC" && snapshot.key !== "PC00"){ //descartamos los procesos default
          option = document.createElement('option');
          option.value = snapshot.key;
          option.text = snapshot.key + " " + proceso.nombre;
          select.appendChild(option);
        }
      }
  });
  //Agregar opcion de agregar nuevo proceso
  option = document.createElement('option');
  option.value = "NUEVO";
  option.text = "-CREAR NUEVO-";
  select.appendChild(option);
  actualizarTablaProcesos();
});

//Funcionalidad del ddl de procesos: llenar los campos correspondientes en caso de existir el proceso
$('#' + id_ddl_procesoProcesos).change(function(){
  resetFormProceso_proceso(false);
  resetFormProceso_subproceso(true);
  if ($('#' + id_ddl_procesoProcesos + " option:selected").val() !== "NUEVO"){ //Proceso ya existe
    existe_proceso = true;
    uid_proceso = $('#' + id_ddl_procesoProcesos + " option:selected").val();
    $('#' + id_clave_proceso).val(uid_proceso);
    var proceso;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/procesos/"+ uid_proceso).on('value',function(snapshot){
        proceso = snapshot.val();
        var fechas = proceso["subprocesos"][snapshot.key]["fechas"];
        //Llenar de campos
        $('#' + id_clave_proceso).val(snapshot.key);
        $('#' + id_nombre_proceso ).val(proceso.nombre);
        $('#' + id_alcance_proceso ).val(proceso.alcance);
        var fecha = new Date(fechas.fecha_inicio_teorica);
        $('#' + id_fecha_inicio_proceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
        fecha = new Date(fechas.fecha_final_teorica);
        $('#' + id_fecha_final_proceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
        if ($('#' + id_checkbox_supbroceso).prop("checked")){ //llenar los campos de subproceso en caso de estar habilitados
          llenaDdlSubproceso(snapshot.key);
        }
    });
  } else { //Proceso nuevo
    existe_proceso = false;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/num_procesos").on('value',function(snapshot){
        var procesos = snapshot.val() + 1; //Generar la clave de acuerdo a los procesos que ya existen
        var clave;
        if(procesos<10){
          clave = "PC0"+procesos;
        }else {
          clave = "PC"+procesos;
        }
        $('#'+id_clave_proceso).val(clave);
    });
    if ($('#' + id_checkbox_supbroceso).prop("checked")){ //llenar los campos de subproceso en caso de estar habilitados
      llenaDdlSubproceso("");
    }
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
//Funcionalidad del checkbox subproceso: Ocultar o mostrar la seccion de subprocesos.
$('#' + id_checkbox_supbroceso ).change(function(){
    if ($('#' + id_checkbox_supbroceso ).prop("checked")){
      $('#' + id_seccion_subproceso ).removeClass('hidden');
      if ($('#' + id_ddl_procesoProcesos + " option:selected").val() !== "" &&  $('#' + id_ddl_procesoProcesos + " option:selected").val() !== 0){
        llenaDdlSubproceso($('#' + id_ddl_procesoProcesos + " option:selected").val()); //Llenado del ddl
      }
    } else {
      $('#' + id_seccion_subproceso ).addClass('hidden');
    }
});
//Funcionalidad del ddl de subprocesos: llenar los campos correspondientes en caso de existir el subproceso
$('#' + id_ddl_subproceso ).change(function(){
  resetFormProceso_subproceso(false); //Limpiar campos
  existe_subproceso = false;
  if ($('#' + id_ddl_subproceso + " option:selected").val() !== "NUEVO"){ //subproceso existe
    $('#' + id_ddl_categoriaSubproceso).prop('disabled',true); //bloquear el ddl categoría, afectaría la clave ya establecida
    existe_subproceso = true;
    uid_subproceso = $('#' + id_ddl_subproceso + " option:selected").val();
    var subproceso;
    var fecha;
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#'+id_ddl_obraProcesos+" option:selected").val() + "/procesos/"+ $('#'+id_ddl_procesoProcesos +" option:selected").val() + "/subprocesos/" + uid_subproceso).on('value',function(snapshot){
        subproceso = snapshot.val();
        var fechas = subproceso.fechas;
        //Llenar campos
        $('#' + id_clave_subproceso).val(snapshot.key);
        $('#' + id_nombre_subproceso).val(subproceso.nombre);
        $('#' + id_alcance_subproceso).val(subproceso.alcance);
        $('#' + id_ddl_categoriaSubproceso).val(subproceso.categoria);
        fecha = new Date(fechas.fecha_inicio_teorica);
        $('#' + id_fecha_inicio_subproceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
        fecha = new Date(fechas.fecha_final_teorica);
        $('#' + id_fecha_final_subproceso ).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
    });
  } else { //subproceso nuevo
    $('#' + id_ddl_categoriaSubproceso).prop('disabled',false); //Habiliar el ddl categoria
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
//Funcionalidad del ddl de categoria: Generar la clave de un subproceso nuevo
$('#' + id_ddl_categoriaSubproceso).change(function(e){
  if($('#'+id_clave_proceso).val() !== "" && $('#'+id_ddl_subproceso+" option:selected").val() !== "" && !existe_subproceso){ //Generar clave si hay un proceso seleccionado y un nuevo subproceso
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#'+id_ddl_obraProcesos+" option:selected").val() + "/procesos/"+ uid_proceso + "/subprocesos").orderByChild('categoria').on('value',function(snapshot){
        var cont = 1;
        var clave;
        if(snapshot.exists() ){
          snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
            if (snapChild.val().categoria == $('#'+id_ddl_categoriaSubproceso+" option:selected").val()){
              cont ++;
            }
          })
        }
        if(cont<10){ //Dar formato correcto a la clave
          clave = $('#'+id_clave_proceso).val() + "-" + $('#'+id_ddl_categoriaSubproceso+" option:selected").text() + "0" + cont;
        }else {
          clave = $('#'+id_clave_proceso).val() + "-" + + $('#'+id_ddl_categoriaSubproceso+" option:selected").text() + cont;
        }
        $('#' + id_clave_subproceso).val(clave);
    });
  }
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos y variables globales
function resetFormProceso (){
  $('#' + id_ddl_obraProcesos ).val("");
  resetFormProceso_proceso(true);
  $('#' + id_ddl_procesoProcesos).empty();
  $('#' + id_checkbox_supbroceso ).prop('checked', false);
  $('#' + id_seccion_subproceso ).addClass('hidden');
  resetFormProceso_subproceso(true);
  $('#' + id_ddl_subproceso ).empty();
  existe_proceso = false;
  existe_subproceso = false;
  actualizarTablaProcesos();
}
//Borrar los campos de proceso. Opcion para deseleccionar el ddl
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
//Borrar los campos de subproceso. Opcion para deselleccionar el ddl
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
//Construir el JSON de fechas para el subproceso
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

//Construir el JSON del subproceso
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
//Construir el JSON del subproceso copia
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
//Llenar el ddl de subprocesos con las opciones correspondientes
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
        if (snapshot.exists()){
          if (clave !== snapshot.key){
            option = document.createElement('option');
            option.value = snapshot.key;
            option.text = snapshot.key + " " + subproceso.nombre;
            select.appendChild(option);
          }
        }
    });
    //Opcion para agregar nuevo
    option = document.createElement('option');
    option.value = "NUEVO";
    option.text = "-CREAR NUEVO-";
    select.appendChild(option);
}
//Llenar el ddl de categoria con las opciones correspondientes
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
// se utiliza on "value" para que en cada movimiento en la base de datos "obras/procesos/obra/procesos",
//la tabla se actualize automáticamente.
function actualizarTablaProcesos(){
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraProcesos + " option:selected").val() + "/procesos").on("value",function(snapshot){
        var datos_obra = [];
        snapshot.forEach(function(procesoSnap){
            var clave = procesoSnap.key;
            var proceso = procesoSnap.val();
            var nombre = proceso.nombre;
            var alcance = proceso.alcance;
            var num_subp = proceso.num_subprocesos;
            if(clave !== "ADIC" && clave !== "MISC" && clave !== "PC00"){
              var fechas = proceso["subprocesos"][clave]["fechas"];
              var fecha = new Date(fechas.fecha_inicio_teorica);
              var fecha_inicio = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);
              fecha = new Date(fechas.fecha_final_teorica);
              var fecha_final = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);
              datos_obra.push([
                  clave,
                  nombre,
                  alcance,
                  fecha_inicio,
                  fecha_final,
                  clave,
                  nombre,
                  "PROCESO",
                  "PROCESO",
                  alcance,
                  fecha_inicio,
                  fecha_final
              ]);
              if (num_subp > 0){
                procesoSnap.child("subprocesos").forEach(function(subprocesoSnap){
                  var clave_sub = subprocesoSnap.key;
                  var subproceso = subprocesoSnap.val();
                  var nombre_sub = subproceso.nombre;
                  var categoria_id_sub = subproceso.categoria;
                  var alcance_sub = subproceso.alcance;
                  var fechas_sub = subproceso.fechas;
                  var fecha_sub = new Date(fechas_sub.fecha_inicio_teorica);
                  var fecha_inicio_sub = fecha_sub.getFullYear() +"."+ ("0" + (fecha_sub.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_sub.getDate()).slice(-2);
                  fecha_sub = new Date(fechas_sub.fecha_final_teorica);
                  var fecha_final_sub = fecha_sub.getFullYear() +"."+ ("0" + (fecha_sub.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_sub.getDate()).slice(-2);
                  if (clave !== clave_sub){
                    firebase.database().ref(rama_bd_datos_referencia + "/especialidades/" + categoria_id_sub ).on('value',function(snapshot){
                        categoria = snapshot.val();
                        var categoria_sub = categoria.clave;
                        datos_obra.push([
                            clave,
                            nombre,
                            alcance,
                            fecha_inicio,
                            fecha_final,
                            clave_sub,
                            nombre_sub,
                            categoria_id_sub,
                            categoria_sub,
                            alcance_sub,
                            fecha_inicio_sub,
                            fecha_final_sub,
                        ]);
                    });
                  }
                });
              }
            }
        });

        tabla_procesos = $('#'+ id_dataTable_proceso).DataTable({
            destroy: true,
            data: datos_obra,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "100px", "targets": 5 },
                { "width": "120px", "targets": 6 },
                { "width": "150px", "targets": 7 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 }, //Campos auxiliares
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 2 },
                { "visible": false, "targets": 3 },
                { "visible": false, "targets": 4 },
                { "visible": false, "targets": 7 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_proceso + ' tbody').on( 'click', '.editar', function () {
            var data = tabla_procesos.row( $(this).parents('tr') ).data();
            resetFormProceso_proceso(true);
            resetFormProceso_subproceso(true);
            existe_proceso = true;
            uid_proceso = data[0];
            $('#' + id_ddl_procesoProcesos).val(data[0]);
            $('#' + id_clave_proceso).val(data[0]);
            $('#' + id_nombre_proceso).val(data[1]);
            $('#' + id_alcance_proceso).val(data[2]);
            $('#' + id_fecha_inicio_proceso).val(data[3]);
            $('#' + id_fecha_final_proceso).val(data[4]);
            if (data[0] == data [5]){
              $('#' + id_checkbox_supbroceso ).prop('checked', false);
              $('#' + id_seccion_subproceso ).addClass('hidden');
              existe_subproceso = false;
            } else {
              existe_subproceso = true;
              uid_subproceso = data[5];
              llenaDdlSubproceso(data[0]);
              $('#' + id_ddl_subproceso).val(data[5]);
              $('#' + id_clave_subproceso).val(data[5]);
              $('#' + id_nombre_subproceso).val(data[6]);
              $('#' + id_ddl_categoriaSubproceso).val(data[7]);
              $('#' + id_alcance_subproceso).val(data[9]);
              $('#' + id_fecha_inicio_subproceso).val(data[10]);
              $('#' + id_fecha_final_subproceso).val(data[11]);
              $('#' + id_checkbox_supbroceso ).prop('checked', true);
              $('#' + id_seccion_subproceso ).removeClass('hidden');
            }
        } );
    });
}
