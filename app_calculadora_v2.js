// id's de los elementos HTML
var id_tab_calculadora = "tabCalculadora";
var id_form_calculadora = "formCalculadora";
var id_dataTable_calculadora = "dataTableCalculadora";

var id_ddl_obraCalculadora = "obraDdlCalculadora";
var id_ddl_procesoCalculadora = "procesoDdlCalculadora";
var id_ddl_subprocesoCalculadora = "subprocesoDdlCalculadora";
var id_horas_proyectoCalculadora = "horasProyectoCalculadora";
var id_costo_proyectoCalculadora = "costoProyectoCalculadora";
var id_costo_suministrosCalculadora = "costoSuministrosCalculadora";
var id_costo_copeoCalculadora = "costoCopeoCalculadora";
var id_costo_copeoCargaCalculadora = "costoCopeoCargaCalculadora";
var id_profit_cantidadCalculadora = "profitCantidadCalculadora";
var id_profit_porcentajeCalculadora = "profitPorcentajeCalculadora";
var id_profit_netoCalculadora = "profitNetoCalculadora";
var id_precio_ventaCalculadora = "precioVentaCalculadora";
var id_anticipoCalculadora = "anticipoCalculadora";
var id_estimacionesCalculadora = "estimacionesCalculadora";
var id_costo_horaScoreCalculadora = "costoHoraScoreCalculadora";
var id_indirectosCalculadora = "indirectosCalculadora";
var id_impuestosCalculadora = "impuestosCalculadora";
var id_costo_operacionesCalculadora = "costoOperacionesCalculadora";
var id_costos_indirectosCalculadora = "costosIndirectosCalculadora";
var id_seccion_subprocesoCalculadora = "div_subprocesoCalculadora";


var id_agregar_calculadora = "botonGuardarCalculadora";
var id_borrar_calculadora = "botonBorrarCalculadora";
var id_default_calculadora = "botonDefaultCalculadora";

var uid_obra;
var uid_proceso;
var uid_subproceso;
var cantProfitManda = true;
var horasScoreManda = true;
var copeoManda = true
var horasActualizadas = false;
var registro_antiguo = {};

// esta madre solo es para poner el mensaje cuando pasas encima del boton

$('#' + id_tab_calculadora).click(function(){

	// pongo el texto para el on hover
	var texto_default = "Valores generalmente usados para el calculo de presupuestos como son: precio por hora del área de proyectos, porcentaje de anticipos y estimaciones, impuestos para la mano de obra y el porcentaje de costos indirectos."
	$('#' + id_default_calculadora).attr("data-content", texto_default);
	resetFormCalculadora();
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
  //returnToDefaultCalculadora();
});

$('#' + id_borrar_calculadora).click(function(){
	resetFormCalculadora();
});

$('#' + id_agregar_calculadora).click(function(){
	if(validateFormCalculadora()){
		uid_obra = $("#" + id_ddl_obraCalculadora + " option:selected").val();
		uid_proceso = $("#" + id_ddl_procesoCalculadora + " option:selected").val();
		uid_subproceso = $("#" + id_ddl_subprocesoCalculadora + " option:selected").val();
		var subproceso_update = {};
		//Actualizar los campos de la obra
		var path_subproceso = "procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_subproceso;
		subproceso_update[path_subproceso + "/score/horas_programadas"] = deformatMoney($('#'+id_horas_proyectoCalculadora).val());
		subproceso_update[path_subproceso + "/score/costo_hora"] = deformatMoney($('#'+id_costo_horaScoreCalculadora).val());
		subproceso_update[path_subproceso + "/costo_suministros"] = deformatMoney($('#'+id_costo_suministrosCalculadora).val());
		subproceso_update[path_subproceso + "/precopeo"] = deformatMoney($('#'+id_costo_copeoCalculadora).val());
		subproceso_update[path_subproceso + "/porcentaje_anticipo"] = deformatMoney($('#'+id_anticipoCalculadora).val());
		subproceso_update[path_subproceso + "/porcentaje_indirectos"] = deformatMoney($('#'+id_indirectosCalculadora).val());
		subproceso_update[path_subproceso + "/porcentaje_impuestos"] = deformatMoney($('#'+id_impuestosCalculadora).val());
		subproceso_update[path_subproceso + "/utilidad"] = deformatMoney($('#'+id_profit_cantidadCalculadora).val());
		subproceso_update[path_subproceso + "/precio_venta"] = deformatMoney($('#'+id_precio_ventaCalculadora).val());
		//Escribir los cambios en la base de datos
		console.log(subproceso_update);
		firebase.database().ref(rama_bd_obras).update(subproceso_update);
		// PAD
		pda("modificacion", rama_bd_obras + "/" +path_subproceso, registro_antiguo);
		alert("¡Edición exitosa!");
		resetFormCalculadora();
		actualizarTablaCalculadora();
	}
});

$('#' + id_default_calculadora).click(function(){
  returnToDefaultCalculadora();
	if($('#'+id_costo_operacionesCalculadora).val() !== ""){
		calculaCostoScore();
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
	}
});

// ----------------------- FUNCIONES DE LOS DDLS ------------------------
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
	actualizarTablaCalculadora();
});

$("#" + id_ddl_procesoCalculadora).change(function(){
  uid_proceso = $('#'+id_ddl_procesoCalculadora+" option:selected").val();
  llenaDdlSubprocesoCalculadora(uid_obra, uid_proceso);
});

$("#" + id_ddl_subprocesoCalculadora).change(function(){
  resetFormCalculadora_subproceso();
  uid_subproceso = $('#'+id_ddl_subprocesoCalculadora+" option:selected").val()
  cargaCamposCalculadora(uid_obra, uid_proceso, uid_subproceso);
});



// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// ----------------------------------- SCORE  ---------------------------------------
$('#'+id_costo_horaScoreCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_horaScoreCalculadora).change(function (){
		if($('#'+id_costo_horaScoreCalculadora).val() == ""){
			$('#'+id_costo_horaScoreCalculadora).val(formatMoney(0));
		}
		horasScoreManda = false;
		calculaCostoScore();
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
});

$('#'+id_costo_horaScoreCalculadora).focus(function (){
	if($('#'+id_costo_horaScoreCalculadora).val() !== ""){
		$('#'+id_costo_horaScoreCalculadora).val(deformatMoney($('#'+id_costo_horaScoreCalculadora).val()));
	}
});

$('#'+id_costo_horaScoreCalculadora).focusout(function (){
	if($('#'+id_costo_horaScoreCalculadora).val() !== ""){
		$('#'+id_costo_horaScoreCalculadora).val(formatMoney($('#'+id_costo_horaScoreCalculadora).val()));
	}
});

$('#'+id_horas_proyectoCalculadora).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#'+id_horas_proyectoCalculadora).change(function (){
	if($('#'+id_horas_proyectoCalculadora).val() == ""){
		$('#'+id_horas_proyectoCalculadora).val(0);
	}else{
		$('#'+id_horas_proyectoCalculadora).val(parseFloat($('#'+id_horas_proyectoCalculadora).val()).toFixed(2));
	}
	calculaCostoScore();
	calculaCostoOperacional();
	actualizaProfit();
	actualizaPrecioVenta();
	horasScoreManda = true;
});

$('#'+id_costo_proyectoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_proyectoCalculadora).change(function (){
	if($('#'+id_costo_proyectoCalculadora).val() == ""){
		$('#'+id_costo_proyectoCalculadora).val(formatMoney(0));
	}
	calculaScore();
	calculaCostoOperacional();
	actualizaProfit();
	actualizaPrecioVenta();
});

$('#'+id_costo_proyectoCalculadora).focus(function (){
	if($('#'+id_costo_proyectoCalculadora).val() !== ""){
		$('#'+id_costo_proyectoCalculadora).val(deformatMoney($('#'+id_costo_proyectoCalculadora).val()));
	}

});

$('#'+id_costo_proyectoCalculadora).focusout(function (){
	if($('#'+id_costo_proyectoCalculadora).val() !== "" && !horasActualizadas){
		$('#'+id_costo_proyectoCalculadora).val(formatMoney($('#'+id_costo_proyectoCalculadora).val()));
	}else{
		horasActualizadas = false;
	}
});

// ------------------------------ SUMINISTROS  ---------------------------------
$('#'+id_costo_suministrosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_suministrosCalculadora ).change(function (){
		if($('#'+id_costo_suministrosCalculadora).val() == ""){
			$('#'+id_costo_suministrosCalculadora).val(formatMoney(0));
		}
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
});

$('#'+id_costo_suministrosCalculadora ).focus(function (){
	if($('#'+id_costo_suministrosCalculadora ).val() !== ""){
		$('#'+id_costo_suministrosCalculadora ).val(deformatMoney($('#'+id_costo_suministrosCalculadora ).val()));
	}
});

$('#'+id_costo_suministrosCalculadora).focusout(function (){
	if($('#'+id_costo_suministrosCalculadora).val() !== ""){
		$('#'+id_costo_suministrosCalculadora).val(formatMoney($('#'+id_costo_suministrosCalculadora).val()));
	}
});

// ----------------------------------- COPEO  ---------------------------------------
$('#'+id_costo_copeoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_copeoCalculadora).change(function (){
	copeoManda = true;
	if($('#'+id_costo_copeoCalculadora).val() == ""){
		$('#'+id_costo_copeoCalculadora).val(formatMoney(0));
	}
	actualizaCopeo();
	calculaCostoOperacional();
	actualizaProfit();
	actualizaPrecioVenta();
});

$('#'+id_costo_copeoCalculadora).focus(function (){
	if($('#'+id_costo_copeoCalculadora).val() !== ""){
		$('#'+id_costo_copeoCalculadora).val(deformatMoney($('#'+id_costo_copeoCalculadora).val()));
	}
});

$('#'+id_costo_copeoCalculadora).focusout(function (){
	if($('#'+id_costo_copeoCalculadora).val() !== ""){
		$('#'+id_costo_copeoCalculadora).val(formatMoney($('#'+id_costo_copeoCalculadora).val()));
	}
});

$('#'+id_costo_copeoCargaCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_copeoCargaCalculadora).change(function (){
	copeoManda = false;
	if($('#'+id_costo_copeoCargaCalculadora).val() == ""){
		$('#'+id_costo_copeoCargaCalculadora).val(formatMoney(0));
	}
	actualizaCopeo();
	calculaCostoOperacional();
	actualizaProfit();
	actualizaPrecioVenta();
});

$('#'+id_costo_copeoCargaCalculadora).focus(function (){
	if($('#'+id_costo_copeoCargaCalculadora).val() !== ""){
		$('#'+id_costo_copeoCargaCalculadora).val(deformatMoney($('#'+id_costo_copeoCargaCalculadora).val()));
	}
});

$('#'+id_costo_copeoCargaCalculadora).focusout(function (){
	if($('#'+id_costo_copeoCargaCalculadora).val() !== ""){
		$('#'+id_costo_copeoCargaCalculadora).val(formatMoney($('#'+id_costo_copeoCargaCalculadora).val()));
	}
});

$('#'+id_impuestosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_impuestosCalculadora).change(function (){
		if($('#'+id_impuestosCalculadora).val() == ""){
			$('#'+id_impuestosCalculadora).val(0);
		}else{
			$('#'+id_impuestosCalculadora ).val(parseFloat($('#'+id_impuestosCalculadora).val()).toFixed(2));
		}
		actualizaCopeo();
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
});

// ----------------------------------- PROFIT  ---------------------------------------
$('#'+id_profit_cantidadCalculadora ).keypress(function(e){
    charactersAllowed("-0123456789.",e);
});

$('#'+id_profit_cantidadCalculadora ).change(function (){
		if($('#'+id_profit_cantidadCalculadora).val() == ""){
			$('#'+id_profit_cantidadCalculadora).val(formatMoney(0));
		}
		cantProfitManda = true;
		actualizaPorcentajeProfit();
		actualizaPrecioVenta();
		actualizaProfitNeto();
});

$('#'+id_profit_cantidadCalculadora ).focus(function (){
	if($('#'+id_profit_cantidadCalculadora ).val() !== ""){
		$('#'+id_profit_cantidadCalculadora ).val(deformatMoney($('#'+id_profit_cantidadCalculadora).val()));
	}
});

$('#'+id_profit_cantidadCalculadora).focusout(function (){
	if($('#'+id_profit_cantidadCalculadora).val() !== ""){
		$('#'+id_profit_cantidadCalculadora).val(formatMoney($('#'+id_profit_cantidadCalculadora).val()));
	}
});

$('#'+id_profit_porcentajeCalculadora  ).keypress(function(e){
    charactersAllowed("-0123456789.",e);
});

$('#'+id_profit_porcentajeCalculadora  ).change(function (){
	if($('#'+id_profit_porcentajeCalculadora).val() == ""){
		$('#'+id_profit_porcentajeCalculadora).val(0);
	}else{
		$('#'+id_profit_porcentajeCalculadora).val(parseFloat($('#'+id_profit_porcentajeCalculadora).val()).toFixed(2));
	}
		cantProfitManda = false;
		actualizaCantidadProfit();
		actualizaPrecioVenta();
});

// ------------------------------- PRECIO DE VENTA  -----------------------------------
$('#'+id_precio_ventaCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_precio_ventaCalculadora).change(function (){
	if($('#'+id_precio_ventaCalculadora).val() == ""){
		$('#'+id_precio_ventaCalculadora).val(formatMoney(0));
	}
	var cantProfit = parseFloat(deformatMoney($('#'+id_precio_ventaCalculadora).val())) - parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val()));
	$('#'+id_profit_cantidadCalculadora).val(formatMoney(cantProfit));
	highLight(id_profit_cantidadCalculadora);
	actualizaPorcentajeProfit();
	actualizaProfitNeto();
});

$('#'+id_precio_ventaCalculadora).focus(function (){
	if($('#'+id_precio_ventaCalculadora  ).val() !== ""){
		$('#'+id_precio_ventaCalculadora  ).val(deformatMoney($('#'+id_precio_ventaCalculadora ).val()));
	}
});

$('#'+id_precio_ventaCalculadora).focusout(function (){
	if($('#'+id_precio_ventaCalculadora).val() !== ""){
		$('#'+id_precio_ventaCalculadora).val(formatMoney($('#'+id_precio_ventaCalculadora).val()));
	}
});

// ---------------------------- COSTOS DE OPERACIONES  -------------------------------
$('#'+id_indirectosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_indirectosCalculadora).change(function (){
		if($('#'+id_indirectosCalculadora).val() == ""){
			$('#'+id_indirectosCalculadora).val(0);
		}else{
			$('#'+id_indirectosCalculadora).val(parseFloat($('#'+id_indirectosCalculadora).val()).toFixed(2));
		}
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
});

// ----------------------------------- EXTRAS  ---------------------------------------
$('#'+id_anticipoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_anticipoCalculadora).change(function (){
		var anticipoCal = parseFloat($('#'+id_anticipoCalculadora).val()).toFixed(2);
		if(anticipoCal<=100){
			$('#'+id_anticipoCalculadora).val(anticipoCal);
			$('#'+id_estimacionesCalculadora).val(100 - anticipoCal);
			highLight(id_estimacionesCalculadora);
		} else {
			$('#'+id_anticipoCalculadora).val(50);
			$('#'+id_estimacionesCalculadora).val(50);
			highLightColor(id_anticipoCalculadora, "#FF0000");
			highLightColor(id_estimacionesCalculadora, "#FF0000");
		}
});

$('#'+id_estimacionesCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_estimacionesCalculadora).change(function (){
		var estimacionesCal = parseFloat($('#'+id_estimacionesCalculadora ).val()).toFixed(2);
		if(estimacionesCal<=100){
			$('#'+id_estimacionesCalculadora).val(estimacionesCal);
			$('#'+id_anticipoCalculadora).val(100 - estimacionesCal);
			highLight(id_anticipoCalculadora);
		} else {
			$('#'+id_estimacionesCalculadora).val(50);
			$('#'+id_anticipoCalculadora).val(50);
			highLightColor(id_estimacionesCalculadora, "#FF0000");
			highLightColor(id_anticipoCalculadora,"#FF0000");
		}
});

// ----------------------- VALIDACIONES ------------------------------------
function validateFormCalculadora(){
	if ($('#' + id_ddl_obraCalculadora).val() == ""){
			alert("Selecciona la obra");
			highLightColor(id_ddl_obraCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_procesoCalculadora).val() == ""){
			alert("Selecciona un proceso");
			highLightColor(id_ddl_procesoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_subprocesoCalculadora).val() == ""){
			alert("Selecciona un subproceso");
			highLightColor(id_ddl_subprocesoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_indirectosCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_anticipoCalculadora).val() == ""){
			alert("Ingresa el porcentaje de anticipo o de estimaciones");
			highLightColor(id_anticipoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_estimacionesCalculadora).val() == ""){
			alert("Ingresa el porcentaje de anticipo o de estimaciones");
			highLightColor(id_estimacionesCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_horaScoreCalculadora).val() == ""){
			alert("Ingresa costo por hora de proyectos");
			highLightColor(id_costo_horaScoreCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_horas_proyectoCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_horas_proyectoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_proyectoCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_costo_proyectoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_copeoCalculadora).val() == ""){
			alert("Ingresa el costo de mano de obra (precopeo)");
			highLightColor(id_costo_copeoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_copeoCargaCalculadora ).val() == ""){
			alert("Ingresa el costo de mano de obra (precopeo)");
			highLightColor(id_costo_copeoCargaCalculadora ,"#FF0000");
			return false;
	} else if ($('#' + id_impuestosCalculadora).val() == ""){
			alert("Ingresa porcentaje de impuestos a la mano de obra");
			highLightColor(id_impuestosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_suministrosCalculadora).val() == ""){
			alert("Ingresa el costo de los suministros");
			highLightColor(id_costo_suministrosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_profit_cantidadCalculadora).val() == ""){
			alert("Ingresa la utilidad esperada en porcentaje o cantidad");
			highLightColor(id_profit_cantidadCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_profit_porcentajeCalculadora).val() == ""){
			alert("Ingresa la utilidad esperada en porcentaje o cantidad");
			highLightColor(id_profit_porcentajeCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_precio_ventaCalculadora).val() == ""){
			alert("Ingresa el precio de venta");
			highLightColor(id_precio_ventaCalculadora,"#FF0000");
			return false;
	} else {
		return true;
	}
}

// ----------------------- FUNCIONES NECESARIAS ----------------------------
function resetFormCalculadora(){
	uid_obra = "";
	uid_proceso = "";
	uid_subproceso = "";
  $('#' + id_ddl_obraCalculadora).val("");
  $('#' + id_ddl_procesoCalculadora).empty();
  $('#' + id_ddl_subprocesoCalculadora).empty();
  resetFormCalculadora_subproceso();
	$('#' + id_seccion_subprocesoCalculadora).addClass('hidden');
}

function resetFormCalculadora_subproceso(){
  $('#' + id_horas_proyectoCalculadora ).val("");
  $('#' + id_costo_proyectoCalculadora ).val("");
  $('#' + id_costo_suministrosCalculadora).val("");
  $('#' + id_costo_copeoCalculadora).val("");
  $('#' + id_profit_cantidadCalculadora).val("");
  $('#' + id_profit_porcentajeCalculadora).val("");
  $('#' + id_precio_ventaCalculadora).val("");
	$('#' + id_costo_operacionesCalculadora).val("");
	$('#' + id_profit_netoCalculadora).val("");
	$('#' + id_costo_copeoCargaCalculadora).val("");

	$('#' + id_anticipoCalculadora).val("");
  $('#' + id_estimacionesCalculadora).val("");
  $('#' + id_costo_horaScoreCalculadora).val("");
  $('#' + id_indirectosCalculadora).val("");
  $('#' + id_impuestosCalculadora).val("");
}

function returnToDefaultCalculadora(){
  $('#' + id_anticipoCalculadora).val(50);
  $('#' + id_estimacionesCalculadora).val(50);
  $('#' + id_costo_horaScoreCalculadora).val(formatMoney(1300));
  $('#' + id_indirectosCalculadora).val(20);
  $('#' + id_impuestosCalculadora).val(54);
	highLight(id_anticipoCalculadora);
	highLight(id_estimacionesCalculadora);
	highLight(id_costo_horaScoreCalculadora);
	highLight(id_indirectosCalculadora);
	highLight(id_impuestosCalculadora);
}

function calculaCostoOperacional(){
	var costoScore = parseFloat(deformatMoney($('#'+id_costo_proyectoCalculadora).val()));
	var costoSuministros = parseFloat(deformatMoney($('#'+id_costo_suministrosCalculadora).val()));
	var costoPrecopeo = parseFloat(deformatMoney($('#'+id_costo_copeoCalculadora).val()));
	var porcIndirectos = parseFloat(deformatMoney($('#'+id_indirectosCalculadora ).val()));
	var porcImpuestos = parseFloat(deformatMoney($('#'+id_impuestosCalculadora ).val()));
	var costoOperacion = (costoScore + costoSuministros + (costoPrecopeo*(1 + porcImpuestos*0.01)))*(1 + porcIndirectos*0.01);
	var costosIndirectos = (costoScore + costoSuministros + (costoPrecopeo*(1 + porcImpuestos*0.01)))*(porcIndirectos*0.01);
	$('#' + id_costo_operacionesCalculadora).val(formatMoney(costoOperacion));
	$('#' + id_costos_indirectosCalculadora).val(formatMoney(costosIndirectos));
	highLight(id_costo_operacionesCalculadora);
	highLight(id_costos_indirectosCalculadora);
}

function calculaScore(){
	if (horasScoreManda){
		calculaCostoXHoraScore();
	}else{
		calculaHorasScore();
	}
}

function calculaHorasScore(){
	var horasProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_horaScoreCalculadora).val()));
	var horasFixed = horasProyecto.toFixed(2);
	$('#'+id_horas_proyectoCalculadora).val(horasFixed);
	highLight(id_horas_proyectoCalculadora);
	if (horasProyecto-horasFixed !== 0){
		horasActualizadas=true;
		var costoProyecto = horasFixed * parseFloat(deformatMoney($('#'+id_costo_horaScoreCalculadora).val()));
		$('#'+id_costo_proyectoCalculadora).val(formatMoney(costoProyecto));
		highLight(id_costo_proyectoCalculadora);
	}
}

function calculaCostoXHoraScore(){
	var costoHora = parseFloat($('#'+id_costo_proyectoCalculadora).val()) / parseFloat(deformatMoney($('#'+id_horas_proyectoCalculadora).val()));
	$('#'+id_costo_horaScoreCalculadora).val(formatMoney(costoHora));
	highLight(id_costo_horaScoreCalculadora);
}

function calculaCostoScore(){
	var costoProyecto = parseFloat($('#'+id_horas_proyectoCalculadora).val()) * parseFloat(deformatMoney($('#'+id_costo_horaScoreCalculadora).val()));
	$('#'+id_costo_proyectoCalculadora).val(formatMoney(costoProyecto));
	highLight(id_costo_proyectoCalculadora);
}

function actualizaProfit(){
	if (cantProfitManda){
		actualizaPorcentajeProfit();
	}else{
		actualizaCantidadProfit();
	}
}

function actualizaCantidadProfit(){
	if($('#'+id_profit_porcentajeCalculadora).val() !== "" ){
		var cantProfit = parseFloat(deformatMoney($('#'+id_profit_porcentajeCalculadora).val())) * parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val())) * 0.01;
		$('#'+id_profit_cantidadCalculadora).val(formatMoney(cantProfit));
		highLight(id_profit_cantidadCalculadora);
		actualizaProfitNeto();
	}
}

function actualizaPorcentajeProfit(){
	if($('#'+id_profit_cantidadCalculadora).val() !== "" ){
		if (deformatMoney($('#'+id_profit_cantidadCalculadora).val()) == 0 && deformatMoney($('#'+id_costo_operacionesCalculadora).val()) == 0){
			var porcProfit = 0;
		}else {
			var porcProfit = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val())) * 100;
		}
		$('#'+id_profit_porcentajeCalculadora).val(porcProfit.toFixed(2));
		highLight(id_profit_porcentajeCalculadora);
	}
}

function actualizaPrecioVenta(){
	if($('#' + id_costo_operacionesCalculadora).val() !== "" && $('#' + id_profit_cantidadCalculadora).val() !== ""){
		var precioTotal = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) + parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val()));
		$('#'+id_precio_ventaCalculadora ).val(formatMoney(precioTotal));
		highLight(id_precio_ventaCalculadora);
	}
}

function actualizaProfitNeto(){
	var netoProfit = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) * 0.6;
	$('#'+id_profit_netoCalculadora).val(formatMoney(netoProfit));
	highLight(id_profit_netoCalculadora);
}

function actualizaCopeo(){
	if(copeoManda){
		actualizaCopeoCargaSocial();
	}else {
		actualizaCopeoBruto();
	}
}

function actualizaCopeoBruto(){
	if($('#'+id_costo_copeoCargaCalculadora).val() !== "" ){
		var copeoBruto = parseFloat(deformatMoney($('#'+id_costo_copeoCargaCalculadora).val())) / (1 + (parseFloat(deformatMoney($('#'+id_impuestosCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoCalculadora).val(formatMoney(copeoBruto));
		highLight(id_costo_copeoCalculadora);
	}
}

function actualizaCopeoCargaSocial(){
	if($('#'+id_costo_copeoCalculadora).val() !== "" ){
		var copeoCarga = parseFloat(deformatMoney($('#'+id_costo_copeoCalculadora).val())) * (1 + (parseFloat(deformatMoney($('#'+id_impuestosCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoCargaCalculadora).val(formatMoney(copeoCarga));
		highLight(id_costo_copeoCargaCalculadora);
	}
}

function cargaCamposCalculadora(claveObra, claveProceso, claveSubproceso){
	firebase.database().ref(rama_bd_obras + "/procesos/" + claveObra + "/procesos/" + claveProceso + "/subprocesos/" + claveSubproceso).once('value',function(snapshot){
    var subproceso = snapshot.val();
    if (!(subproceso.precio_venta == 0 && subproceso.costo_suministros ==0 && subproceso.utilidad ==0 && subproceso.precopeo == 0 && subproceso.score.horas_programadas == 0)){
			registro_antiguo = subproceso;
      var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
      var costoOperacion = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
			var costoOperacionIndirectos = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(subproceso.porcentaje_indirectos*0.01);
      var utilidadPorcentaje = subproceso.utilidad / costoOperacion * 100 ;
			var copeoConCarga = subproceso.precopeo * (1+subproceso.porcentaje_impuestos*0.01);
			var utilidadNeta = subproceso.utilidad * 0.6;

      $('#' + id_horas_proyectoCalculadora ).val(subproceso.score.horas_programadas);
			$('#' + id_costo_horaScoreCalculadora).val(formatMoney(subproceso.score.costo_hora));
			$('#' + id_costo_proyectoCalculadora).val(formatMoney(costoScore));
      $('#' + id_costo_suministrosCalculadora).val(formatMoney(subproceso.costo_suministros));
      $('#' + id_costo_copeoCalculadora).val(formatMoney(subproceso.precopeo));
			$('#' + id_costo_copeoCargaCalculadora).val(formatMoney(copeoConCarga));
      $('#' + id_profit_cantidadCalculadora).val(formatMoney(subproceso.utilidad));
			$('#' + id_profit_porcentajeCalculadora).val(utilidadPorcentaje.toFixed(2));
      $('#' + id_precio_ventaCalculadora).val(formatMoney(subproceso.precio_venta));
			$('#' + id_costo_operacionesCalculadora).val(formatMoney(costoOperacion));
			$('#' + id_costos_indirectosCalculadora).val(formatMoney(costoOperacionIndirectos));

      $('#' + id_anticipoCalculadora).val(subproceso.porcentaje_anticipo);
      $('#' + id_estimacionesCalculadora).val(100 - parseFloat(subproceso.porcentaje_anticipo));
      $('#' + id_indirectosCalculadora).val(subproceso.porcentaje_indirectos);
      $('#' + id_impuestosCalculadora).val(subproceso.porcentaje_impuestos);
			$('#' + id_profit_netoCalculadora).val(formatMoney(utilidadNeta));

			horasScoreManda = true;
			cantProfitManda = true;
    } else {
			resetFormCalculadora_subproceso();
		}
  });
}

function llenaDdlSubprocesoCalculadora(clave_obra, clave_proceso){
	$('#' + id_ddl_subprocesoCalculadora).empty();
  var select = document.getElementById(id_ddl_subprocesoCalculadora);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var proceso;
	var subproceso;
	console.log(clave_obra);
	console.log(clave_proceso);
  firebase.database().ref(rama_bd_obras + "/procesos/" + clave_obra + "/procesos/" + clave_proceso).on('value',function(snapshot){
			proceso = snapshot.val();
			console.log(proceso);
			snapshot.child("subprocesos").forEach(function(snapchild){
				subproceso = snapchild.val();
	      if (snapchild.exists()){
	        if ($('#'+id_ddl_procesoCalculadora+" option:selected").val() == snapchild.key){
						if(proceso.num_subprocesos == 0 || subproceso.costo_suministros !== 0 || subproceso.precopeo !== 0 || subproceso.score.horas_programadas !== 0 || subproceso.utilidad !== 0 || subproceso.precio_venta !== 0){
							option = document.createElement('option');
			        option.value = snapchild.key;
		          option.text = "-CORRUPTO-";
							select.appendChild(option);
						}
	        } else {
						option = document.createElement('option');
		        option.value = snapchild.key;
	          option.text = snapchild.key + " " + subproceso.nombre;
						select.appendChild(option);
	        }
	        if (proceso.num_subprocesos == 0 ){
						$('#' + id_seccion_subprocesoCalculadora).addClass('hidden');
						$('#' + id_ddl_subprocesoCalculadora).val(snapshot.key);
					} else {
						$('#' + id_seccion_subprocesoCalculadora).removeClass('hidden');
					}
	      }
			});
  });
}

// ----------------------------- DATATABLE ----------------------------------
function actualizarTablaCalculadora(){
    firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra + "/procesos").on("value",function(snapshot){
			//console.log(snapshot.val());
        var datos_obra = [];
				var procesoIndex_array = [];
				var index = 0;
        snapshot.forEach(function(procesoSnap){
            var clave_proceso = procesoSnap.key;
            var proceso = procesoSnap.val();
            var nombre_proceso = proceso.nombre;
						var num_subp = proceso.num_subprocesos;
						var cont=1;
						var costoScore_proceso=0;
						var precopeoCarga_proceso=0;
						var suministros_proceso=0;
						var indirectos_proceso=0;
						var operacion_proceso=0;
						var utilidad_proceso=0;
						var venta_proceso=0;
						var anticipo_proceso=0;
						var estimacion_proceso=0;
						var validacion_corrupto = false;
            if(clave_proceso !== "ADIC" && clave_proceso !== "MISC" && clave_proceso !== "PC00"){
                procesoSnap.child("subprocesos").forEach(function(subprocesoSnap){
									console.log(subprocesoSnap.val());
									var clave_sub = subprocesoSnap.key;
	                var subproceso = subprocesoSnap.val();
									var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
						      var costoOperacion = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
									var costoOperacionIndirectos = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(subproceso.porcentaje_indirectos*0.01);
									var precopeoCarga = subproceso.precopeo * (1+subproceso.porcentaje_impuestos*0.01);
									var utilidad_porcentaje = (subproceso.utilidad / costoOperacion * 100).toFixed(2);
									if(subproceso.utilidad==0 && costoOperacion == 0){
										utilidad_porcentaje = 0;
									} else {
										utilidad_porcentaje = (subproceso.utilidad / costoOperacion * 100).toFixed(2);
									}
									var porcentajeEstimacion;
									if (subproceso.precio_venta == 0){
										porcentajeEstimacion = 0;
									}else{
										porcentajeEstimacion = 100 - subproceso.porcentaje_anticipo;
									}
									costoScore_proceso=costoScore_proceso+costoScore;
									precopeoCarga_proceso=precopeoCarga_proceso+precopeoCarga;
									suministros_proceso=suministros_proceso+subproceso.costo_suministros;
									indirectos_proceso=indirectos_proceso+costoOperacionIndirectos;
									operacion_proceso=operacion_proceso+costoOperacion;
									utilidad_proceso=utilidad_proceso+subproceso.utilidad;
									venta_proceso=venta_proceso+subproceso.precio_venta;
									anticipo_proceso=anticipo_proceso+subproceso.porcentaje_anticipo*subproceso.precio_venta*0.01;
									estimacion_proceso=estimacion_proceso+porcentajeEstimacion*subproceso.precio_venta*0.01;

									if (clave_sub !== clave_proceso){
										datos_obra[index+cont]=[
											uid_obra,
											clave_proceso,
											clave_sub,
											subproceso.score.horas_programadas,
											formatMoney(subproceso.score.costo_hora),
											formatMoney(costoScore),
											formatMoney(subproceso.precopeo),
											formatMoney(precopeoCarga),
											subproceso.porcentaje_impuestos,
											formatMoney(subproceso.costo_suministros),
											formatMoney(costoOperacionIndirectos),
											subproceso.porcentaje_indirectos,
											formatMoney(costoOperacion),
											formatMoney(subproceso.utilidad),
											utilidad_porcentaje,
											formatMoney(subproceso.precio_venta),
											subproceso.porcentaje_anticipo+"%",
											porcentajeEstimacion+"%",
											"<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
										];
										cont++;
									} else {
										if( num_subp == 0 || subproceso.costo_suministros !== 0 || subproceso.precopeo !== 0 || subproceso.score.horas_programadas !== 0 || subproceso.utilidad !== 0 || subproceso.precio_venta !== 0){
											validacion_corrupto = true;
										}
									}
									if (num_subp+1 == cont){
										procesoIndex_array.push(index);
										if(validacion_corrupto){
											datos_obra[index]=[
												uid_obra,
												clave_proceso,
												clave_proceso,
												"",
												"",
												formatMoney(costoScore_proceso),
												"",
												formatMoney(precopeoCarga_proceso),
												"",
												formatMoney(suministros_proceso),
												formatMoney(indirectos_proceso),
												"",
												formatMoney(operacion_proceso),
												formatMoney(utilidad_proceso),
												"",
												formatMoney(venta_proceso),
												formatMoney(anticipo_proceso),
												formatMoney(estimacion_proceso),
												"<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
											];
										} else {
											datos_obra[index]=[
												uid_obra,
												clave_proceso,
												clave_proceso,
												"",
												"",
												formatMoney(costoScore_proceso),
												"",
												formatMoney(precopeoCarga_proceso),
												"",
												formatMoney(suministros_proceso),
												formatMoney(indirectos_proceso),
												"",
												formatMoney(operacion_proceso),
												formatMoney(utilidad_proceso),
												"",
												formatMoney(venta_proceso),
												formatMoney(anticipo_proceso),
												formatMoney(estimacion_proceso),
												""
											];
										}
									}
              });
							index=index + cont;
            }
        });
				console.log(procesoIndex_array);
        tabla_calculadora = $('#'+ id_dataTable_calculadora).DataTable({
						"fnRowCallback": function (row, data, index_table) {
									if ( procesoIndex_array.includes(index_table)) {
											$(row).css('font-weight', 'bold');;
									}
						},
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
								{ "visible": false, "targets": 3 },
								{ "visible": false, "targets": 4 },
								{ "visible": false, "targets": 6 },
								{ "visible": false, "targets": 8 },
								{ "visible": false, "targets": 11 },
								{ "visible": false, "targets": 14 },
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_calculadora + ' tbody').on( 'click', '.editar', function () {
            var data = tabla_calculadora.row( $(this).parents('tr') ).data();
            resetFormCalculadora_subproceso();
						if (data[1] == data[2]){
							cargaCamposCalculadora(data[0], data[1], data[2]);
						}else{
							$('#' + id_horas_proyectoCalculadora ).val(data[3]);
							$('#' + id_costo_horaScoreCalculadora).val(data[4]);
							$('#' + id_costo_proyectoCalculadora).val(data[5]);
				      $('#' + id_costo_suministrosCalculadora).val(data[9]);
				      $('#' + id_costo_copeoCalculadora).val(data[6]);
							$('#' + id_costo_copeoCargaCalculadora).val(data[7]);
				      $('#' + id_profit_cantidadCalculadora).val(data[13]);
							$('#' + id_profit_porcentajeCalculadora).val(data[14]);
				      $('#' + id_precio_ventaCalculadora).val(data[15]);
							$('#' + id_costo_operacionesCalculadora).val(data[12]);
							$('#' + id_costos_indirectosCalculadora).val(data[10]);

				      $('#' + id_anticipoCalculadora).val(data[16].replace("%",""));
				      $('#' + id_estimacionesCalculadora).val(data[17].replace("%",""));
				      $('#' + id_indirectosCalculadora).val(data[11]);
				      $('#' + id_impuestosCalculadora).val(data[8]);
							if(deformatMoney(data[13])<0){
								$('#' + id_profit_netoCalculadora).val(formatMoney(deformatMoney(data[13])));
							}else{
								$('#' + id_profit_netoCalculadora).val(formatMoney(deformatMoney(data[13])*0.6));
							}
						}
						uid_obra = data[0];
						uid_proceso = data[1];
						uid_subproceso = data[2];
						$("#" + id_ddl_obraCalculadora).val(uid_obra);
						$("#" + id_ddl_procesoCalculadora).val(uid_proceso);
						llenaDdlSubprocesoCalculadora(uid_obra, uid_proceso);
						$("#" + id_ddl_subprocesoCalculadora).val(uid_subproceso);
						horasScoreManda = true;
						cantProfitManda = true;
						copeoManda = true;
        } );
    });
}
