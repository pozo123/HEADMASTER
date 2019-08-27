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
var id_precio_ventaCalculadora = "precioVentaCalculadora";
var id_anticipoCalculadora = "anticipoCalculadora";
var id_estimacionesCalculadora = "estimacionesCalculadora";
var id_costo_horasScoreCalculadora = "costoHoraScoreCalculadora";
var id_indirectosCalculadora = "indirectosCalculadora";
var id_impuestosCalculadora = "impuestosCalculadora";

var id_agregar_calculadora = "botonGuardarCalculadora";
var id_borrar_calculadora = "botonBorrarCalculadora";

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
});

$('#' + id_borrar_calculadora).click(function(){
	refreshKaizenPpto();
});

$('#' + id_agregar_calculadora).click(function(){

});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$("#" + id_ddl_obraCalculadora ).change(function(){
  resetFormCalculadora(true);
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

  });
});

$('#' + id_impuestos_kaizen_ppto).change(function(){
	var costos_copeo = subtotal * (1 + parseFloat($('#' + id_impuestos_kaizen_ppto).val())/100);
	$('#' + id_copeo_kaizen_ppto).val(formatMoney(costos_copeo));
	loadProfitsKaizenPpto();
});

$("#" + id_porcentaje_indirecto_kaizen_ppto).focusout(function(){
	if($("#" + id_porcentaje_indirecto_kaizen_ppto).val() < 0 || $("#" + id_porcentaje_indirecto_kaizen_ppto).val() > 100){
		$("#" + id_porcentaje_indirecto_kaizen_ppto).val(20);
		alert("El porcentaje de indirectos debe ser un valor mayor a 0 y menor a 100");
	}
});

$("#" + id_copeo_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_suministros_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_proyectos_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_precio_venta_kaizen_ppto).change(function(){
	$("#" + id_precio_venta_kaizen_ppto).val(formatMoney(eval($("#" + id_precio_venta_kaizen_ppto).val())));
	loadProfitsKaizenPpto();
});

$("#" + id_profit_porcentaje_kaizen_ppto).change(function(){
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	var ut_p = parseFloat($("#" + id_profit_porcentaje_kaizen_ppto).val())/100;
	var p_ind = parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100;
	var pv = (costos * (1 + ut_p))/(1 - (p_ind));
	$('#' + id_precio_venta_kaizen_ppto).val(formatMoney(pv));
	$('#' + id_profit_cantidad_kaizen_ppto).val(formatMoney(pv*(1 - p_ind) - costos));
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())*0.6));
	highLight(id_precio_venta_kaizen_ppto);
	highLight(id_profit_cantidad_kaizen_ppto);
});

$("#" + id_profit_cantidad_kaizen_ppto).change(function(){
	var u = eval($("#" + id_profit_cantidad_kaizen_ppto).val());
	$("#" + id_profit_cantidad_kaizen_ppto).val(formatMoney(u));
	var p_ind = parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100;
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	$('#' + id_precio_venta_kaizen_ppto).val(formatMoney((u + costos)/(1-p_ind)));
	$('#' + id_profit_porcentaje_kaizen_ppto).val((100*u/costos).toFixed(2));
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())*0.6));
	highLight(id_precio_venta_kaizen_ppto);
	highLight(id_profit_porcentaje_kaizen_ppto);
});

$("#" + id_precio_venta_kaizen_ppto).focus(function(){
	if($("#" + id_precio_venta_kaizen_ppto).val() == ""){
		$("#" + id_precio_venta_kaizen_ppto).val(0);
	} else {
		$("#" + id_precio_venta_kaizen_ppto).val(deformatMoney($("#" + id_precio_venta_kaizen_ppto).val()) == 0 ? "" : deformatMoney($("#" + id_precio_venta_kaizen_ppto).val()));
	}
});

$("#" + id_precio_venta_kaizen_ppto).focusout(function(){
	$("#" + id_precio_venta_kaizen_ppto).val(formatMoney(eval($("#" + id_precio_venta_kaizen_ppto).val())));
});

$("#" + id_suministros_kaizen_ppto).focus(function(){
	if($("#" + id_suministros_kaizen_ppto).val() == ""){
		$("#" + id_suministros_kaizen_ppto).val(0);
	} else {
		$("#" + id_suministros_kaizen_ppto).val(deformatMoney($("#" + id_suministros_kaizen_ppto).val()) == 0 ? "" : deformatMoney($("#" + id_suministros_kaizen_ppto).val()));
	}
});

$("#" + id_suministros_kaizen_ppto).focusout(function(){
	$("#" + id_suministros_kaizen_ppto).val(formatMoney(eval($("#" + id_suministros_kaizen_ppto).val())));
});

$("#" + id_proyectos_kaizen_ppto).focus(function(){
    if(!isNaN(parseFloat(deformatMoney($("#" + id_proyectos_kaizen_ppto).val())))){
    	var horas = parseFloat(deformatMoney($("#" + id_proyectos_kaizen_ppto).val())) / parseFloat($("#" + id_costo_score_kaizen_ppto).val());
        $("#" + id_proyectos_kaizen_ppto).val(horas == 0 ? "" : horas);
    }
});

$("#" + id_proyectos_kaizen_ppto).focusout(function(){
    if($("#" + id_proyectos_kaizen_ppto).val() != ""){
        $("#" + id_proyectos_kaizen_ppto).val(formatMoney(parseFloat(eval($("#" + id_proyectos_kaizen_ppto).val())) * parseFloat($("#" + id_costo_score_kaizen_ppto).val())));
    } else {
    	$('#' + id_proyectos_kaizen_ppto).val(formatMoney(0));
    }
});

$('#' + id_anticipo_kaizen_ppto).change(function(){
	if($(this).val() < 0 || $(this).val() > 100){
		alert("El valor debe ser mayor o igual a 0 y menor o igual a 100");
		$(this).val(50);
		$('#' + id_estimaciones_kaizen_ppto).val(50);
	} else {
		$('#' + id_estimaciones_kaizen_ppto).val(100 - parseFloat($(this).val()));
	}

});

$('#' + id_estimaciones_kaizen_ppto).change(function(){
	if($(this).val() < 0 || $(this).val() > 100){
		alert("El valor debe ser mayor o igual a 0 y menor o igual a 100");
		$(this).val(50);
		$('#' + id_anticipo_kaizen_ppto).val(50);
	} else {
		$('#' + id_anticipo_kaizen_ppto).val(100 - parseFloat($(this).val()));
	}

});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
function loadProfitsKaizenPpto(){
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	var precio = deformatMoney($('#' + id_precio_venta_kaizen_ppto).val());
	var p_ind = parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100;
	var u = precio*(1-p_ind)-costos;//Si hay utlidad en Costo indirecto: IGUAL
	$('#' + id_profit_cantidad_kaizen_ppto).val(formatMoney(u));
	$('#' + id_profit_porcentaje_kaizen_ppto).val((100*u/costos).toFixed(2));//Si hay utlidad en Costo indirecto: (100*u/(c+p_ind*precio))
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(u*0.6));
	highLight(id_profit_porcentaje_kaizen_ppto);
	highLight(id_profit_cantidad_kaizen_ppto);
}

function refreshKaizenPpto(){
	if($("#" + id_proceso_ddl_kaizen_ppto + " option:selected").val() == "Global"){
		$('#' + id_button_guardar_kaizen_ppto).addClass('hidden');
		loadValuesKaizenPpto(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val());
	} else {
		$('#' + id_button_guardar_kaizen_ppto).removeClass('hidden');
		var proc = $('#' + id_proceso_ddl_kaizen_ppto + " option:selected").val();
		var query = proc.split("-").length > 1 ? proc.split('-')[0] + "/subprocesos/" + proc : proc;
		loadValuesKaizenPpto(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() + "/procesos/" + query);
	}
};

function loadValuesKaizenPpto(query){
	resetKaizPpto();
    firebase.database().ref(query).once('value').then(function(kaizSnap){
		var kaiz = kaizSnap.val();
		var costos_suministros = kaizSnap.child("kaizen/PRODUCCION/SUMINISTROS/CUANT").val();
		subtotal = kaizSnap.child("copeo/subtotal").exists() ? kaizSnap.child("copeo/subtotal").val() : 0;
		var costos_copeo = subtotal * (1 + parseFloat($('#' + id_impuestos_kaizen_ppto).val())/100);
		console.log(costos_copeo);
		console.log(formatMoney(costos_copeo));
		var costos_proyectos = kaiz.kaizen.PROYECTOS.PPTO;
		var costos = costos_proyectos + costos_copeo + costos_suministros;
		$('#' + id_suministros_kaizen_ppto).val(formatMoney(costos_suministros));
		$('#' + id_copeo_kaizen_ppto).val(formatMoney(costos_copeo));
		$('#' + id_proyectos_kaizen_ppto).val(formatMoney(costos_proyectos));

		var precio = kaiz.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO + kaiz.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
		$('#' + id_precio_venta_kaizen_ppto).val(formatMoney(precio));
		var prof = $('#' + id_proceso_ddl_kaizen_ppto + " option:selected").val() == "Global" ? kaizSnap.child("kaizen/PROFIT/PROG/BRUTO").val() : formatMoney(precio*(1-parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100)-costos);
		$('#' + id_profit_cantidad_kaizen_ppto).val();
		$('#' + id_profit_porcentaje_kaizen_ppto).val((100*deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())/(precio*parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100 + costos)).toFixed(2));

		kaiz_ppto.proy = costos_proyectos;
		kaiz_ppto.sum = costos_suministros;
		kaiz_ppto.cop = costos_copeo;
		kaiz_ppto.ant = parseFloat(kaizSnap.child("kaizen/ADMINISTRACION/ANTICIPOS/PPTO").val());
		kaiz_ppto.est = parseFloat(kaizSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/PPTO").val());

		var porc_ant = 100 * kaiz_ppto.ant / (kaiz_ppto.ant + kaiz_ppto.est);
		porc_ant = isNaN(porc_ant) ? 50 : porc_ant;
		var porc_est = 100 - porc_ant;
		$('#' + id_anticipo_kaizen_ppto).val(porc_ant.toFixed(2));
		$('#' + id_estimaciones_kaizen_ppto).val(porc_est.toFixed(2));

		loadProfitsKaizenPpto();
    });
};

function resetFormCalculadora (){
  $('#' + id_ddl_obraCalculadora).val("");
  $('#' + id_ddl_procesoCalculadora).empty();
  $('#' + id_ddl_subprocesoCalculadora).empty();
  resetFormCalculadora_subproceso();
  resetFormCalculadora_extra();
}

function resetFormCalculadora_subproceso(){
  $('#' + id_costo_proyectoCalculadora ).val("");
  $('#' + id_costo_suministrosCalculadora).val("");
  $('#' + id_costo_copeoCalculadora).val("");
  $('#' + id_profit_cantidadCalculadora).val("");
  $('#' + id_profit_porcentajeCalculadora).val("");
  $('#' + id_precio_ventaCalculadora).val("");
}

function resetFormCalculadora_extra(){
  $('#' + id_anticipoCalculadora).val("");
  $('#' + id_estimacionesCalculadora).val("");
  $('#' + id_costo_horasScoreCalculadora).val("");
  $('#' + id_indirectosCalculadora).val("");
  $('#' + id_impuestosCalculadora).val("");
}
