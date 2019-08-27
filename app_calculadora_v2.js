// id's de los elementos HTML
var id_tab_calculadora = "tabCalculadora";
var id_form_calculadora = "formCalculadora";

var id_ddl_obraCalculadora = "obraDdlCalculadora";
var id_ddl_procesoCalculadora = "procesoDdlCalculadora";
var id_ddl_subprocesoCalculadora = "subprocesoDdlCalculadora";
var id_horas_proyectoCalculadora = "horasProyectoCalculadora";
var id_costo_proyectoCalculadora = "costoProyectoCalculadora";
var id_costo_suministrosCalculadora = "costoSuministrosCalculadora";
var id_costo_copeoCalculadora = "costoCopeoCalculadora";
var id_profit_cantidadCalculadora = "profitCantidadCalculadora";
var id_profit_porcentajeCalculadora = "profitPorcentajeCalculadora";
var id_profit_netoCalculadora = "profitPorcentajeCalculadora";
var id_precio_ventaCalculadora = "precioVentaCalculadora";
var id_anticipoCalculadora = "anticipoCalculadora";
var id_estimacionesCalculadora = "estimacionesCalculadora";
var id_costo_horaScoreCalculadora = "costoHoraScoreCalculadora";
var id_indirectosCalculadora = "indirectosCalculadora";
var id_impuestosCalculadora = "impuestosCalculadora";
var id_costo_operacionesCalculadora = "costoOperacionesCalculadora";

var id_agregar_calculadora = "botonGuardarCalculadora";
var id_borrar_calculadora = "botonBorrarCalculadora";
var id_default_calculadora = "botonDefaultCalculadora";

var uid_obra;
var uid_proceso;
var uid_subproceso;

$('#' + id_tab_calculadora).click(function(){
	$('#' + id_form_calculadora).trigger("reset");
	$('#' + id_ddl_obraCalculadora).empty();
  var select = document.getElementById(id_ddl_obraCalculadora);
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
  returnToDefaultCalculadora();
});

$('#' + id_borrar_calculadora).click(function(){

});

$('#' + id_agregar_calculadora).click(function(){

});

$('#' + id_default_calculadora).click(function(){
  returnToDefaultCalculadora();
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$("#" + id_ddl_obraCalculadora ).change(function(){
  $('#' + id_ddl_procesoCalculadora).empty();
  $('#' + id_ddl_subprocesoCalculadora).empty();
  resetFormCalculadora_subproceso();
  uid_obra = $('#' + id_ddl_obraCalculadora + " option:selected").val();
  $('#' + id_ddl_procesoCalculadora).empty();
  var select = document.getElementById(id_ddl_procesoCalculadora );
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var proceso;
  firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra + "/procesos").orderByKey().on('child_added',function(snapshot){
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
});

$("#" + id_ddl_procesoCalculadora).change(function(){
  uid_proceso = $('#'+id_ddl_procesoCalculadora+" option:selected").val();
  $('#' + id_ddl_subprocesoCalculadora).empty();
  var select = document.getElementById(id_ddl_subprocesoCalculadora);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var subproceso;
  firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos").orderByKey().on('child_added',function(snapshot){
      subproceso = snapshot.val();
      if (snapshot.exists()){
        option = document.createElement('option');
        option.value = snapshot.key;
        if ($('#'+id_ddl_procesoCalculadora+" option:selected").val() == snapshot.key){
          option.text = "-MISMO PROCESO-";
        } else {
          option.text = snapshot.key + " " + subproceso.nombre;
        }
        select.appendChild(option);
      }
  });
});

$("#" + id_ddl_subprocesoCalculadora).change(function(){
  resetFormCalculadora_subproceso();
  uid_subproceso = $('#'+id_ddl_subprocesoCalculadora+" option:selected").val()
  firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_subproceso).on('value',function(snapshot){
    var subproceso = snapshot.val();
    if (subproceso.precio_venta == 0 && subproceso.costo_suministros == 0 && subproceso.precopeo == 0 && subproceso.score.costo_hora== 0 && subproceso.score.horas_programadas == 0){

    } else {
      var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
      var costoOperacion = costoScore + subproceso.costo_suministros + subproceso.precopeo;

      $('#' + id_horas_proyectoCalculadora ).val(subproceso.score.horas_programadas);
      $('#' + id_costo_proyectoCalculadora ).val(costoScore);
      $('#' + id_costo_suministrosCalculadora).val(subproceso.costo_suministros);
      $('#' + id_costo_copeoCalculadora).val(subproceso.precopeo);
      $('#' + id_profit_cantidadCalculadora).val(subproceso);
      $('#' + id_profit_porcentajeCalculadora).val("");
      $('#' + id_precio_ventaCalculadora).val("");

      $('#' + id_anticipoCalculadora).val();
      $('#' + id_estimacionesCalculadora).val();
      $('#' + id_costo_horaScoreCalculadora).val();
      $('#' + id_indirectosCalculadora).val();
      $('#' + id_impuestosCalculadora).val();
    }
  });
});



// ----------------------- FUNCIONES NECESARIAS ----------------------------

function resetFormCalculadora (){
  $('#' + id_ddl_obraCalculadora).val("");
  $('#' + id_ddl_procesoCalculadora).empty();
  $('#' + id_ddl_subprocesoCalculadora).empty();
  resetFormCalculadora_subproceso();
}

function resetFormCalculadora_subproceso(){
  $('#' + id_horas_proyectoCalculadora ).val("");
  $('#' + id_costo_proyectoCalculadora ).val("");
  $('#' + id_costo_suministrosCalculadora).val("");
  $('#' + id_costo_copeoCalculadora).val("");
  $('#' + id_profit_cantidadCalculadora).val("");
  $('#' + id_profit_porcentajeCalculadora).val("");
  $('#' + id_precio_ventaCalculadora).val("");
}

function returnToDefaultCalculadora(){
  $('#' + id_anticipoCalculadora).val("50");
  $('#' + id_estimacionesCalculadora).val("50");
  $('#' + id_costo_horaScoreCalculadora).val("1300");
  $('#' + id_indirectosCalculadora).val("20");
  $('#' + id_impuestosCalculadora).val("54");
}
