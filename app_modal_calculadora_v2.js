// ------------------ Campos Modal Calculadora --------------------------------
var id_modalCalculadora = "modalCalculadora";

// id's de los elementos HTML
var id_dataTable_modalCalculadora = "dataTableModalCalculadora";

var id_ddl_obraModalCalculadora = "obraDdlModalCalculadora";
var id_ddl_procesoModalCalculadora = "procesoDdlModalCalculadora";
var id_ddl_subprocesoModalCalculadora = "subprocesoDdlModalCalculadora";
var id_horas_proyectoModalCalculadora = "horasProyectoModalCalculadora";
var id_costo_proyectoModalCalculadora = "costoProyectoModalCalculadora";
var id_costo_suministrosModalCalculadora = "costoSuministrosModalCalculadora";
var id_costo_copeoModalCalculadora = "costoCopeoModalCalculadora";
var id_costo_copeoCargaModalCalculadora = "costoCopeoCargaModalCalculadora";
var id_profit_cantidadModalCalculadora = "profitCantidadModalCalculadora";
var id_profit_porcentajeModalCalculadora = "profitPorcentajeModalCalculadora";
var id_precio_ventaModalCalculadora = "precioVentaModalCalculadora";
var id_anticipoModalCalculadora = "anticipoModalCalculadora";
var id_estimacionesModalCalculadora = "estimacionesModalCalculadora";
var id_costo_horaScoreModalCalculadora = "costoHoraScoreModalCalculadora";
var id_indirectosModalCalculadora = "indirectosModalCalculadora";
var id_impuestosModalCalculadora = "impuestosModalCalculadora";
var id_costo_operacionesModalCalculadora = "costoOperacionesModalCalculadora";
var id_costos_indirectosModalCalculadora = "costosIndirectosModalCalculadora";
var id_seccion_subprocesoModalCalculadora = "div_subprocesoModalCalculadora";

var id_agregar_modalCalculadora = "botonGuardarModalCalculadora";
var id_borrar_modalCalculadora = "botonBorrarModalCalculadora";
var id_default_modalCalculadora = "botonDefaultModalCalculadora";

var cantProfitManda;
var horasScoreManda;
var copeoManda;
var horasActualizadas;
var registro_antiguo;
var ruta_modalCalculadora;
var return_modalCalculadora;


// --------------------- Método de inicialización -----------------------------
function modalCalculadora(ruta){
  ruta_modalCalculadora = ruta; //ruta hasta el subproceso
  cantProfitManda = true;
  horasScoreManda = true;
  copeoManda = true
  horasActualizadas = false;
  registro_antiguo = {};
  // pongo el texto para el on hover
	var texto_default = "Valores generalmente usados para el calculo de presupuestos como son: precio por hora del área de proyectos, porcentaje de anticipos y estimaciones, impuestos para la mano de obra y el porcentaje de costos indirectos."
	$('#' + id_default_modalCalculadora).attr("data-content", texto_default);
	resetFormModalCalculadora();
  cargaCamposModalCalculadora();
  //returnToDefaultModalCalculadora();
  $('#' + id_modalCalculadora).modal('show');
}

$('#' + id_borrar_modalCalculadora).click(function(){
	resetFormModalCalculadora();
});

$('#' + id_agregar_modalCalculadora).click(function(){
	if(validateFormModalCalculadora()){
		var return_modalCalculadora = {};
		//Actualizar los campos de la obra
		var path_subproceso = ruta_modalCalculadora;
		return_modalCalculadora[path_subproceso + "/score/horas_programadas"] = deformatMoney($('#'+id_horas_proyectoModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/score/costo_hora"] = deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/costo_suministros"] = deformatMoney($('#'+id_costo_suministrosModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/precopeo"] = deformatMoney($('#'+id_costo_copeoModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/porcentaje_anticipo"] = deformatMoney($('#'+id_anticipoModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/porcentaje_indirectos"] = deformatMoney($('#'+id_indirectosModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/porcentaje_impuestos"] = deformatMoney($('#'+id_impuestosModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/utilidad"] = deformatMoney($('#'+id_profit_cantidadModalCalculadora).val());
		return_modalCalculadora[path_subproceso + "/precio_venta"] = deformatMoney($('#'+id_precio_ventaModalCalculadora).val());
		//Escribir los cambios en la base de datos
		console.log(return_modalCalculadora);
		//firebase.database().ref(rama_bd_obras).update(return_modalCalculadora);
		// PAD
		//pda("modificacion", rama_bd_obras + "/" +path_subproceso, registro_antiguo);
		alert("¡Edición exitosa!");
		//resetFormModalCalculadora();
		//actualizarTablaModalCalculadora();
	}
});

$('#' + id_default_modalCalculadora).click(function(){
  returnToDefaultModalCalculadora();
	if($('#'+id_costo_operacionesModalCalculadora).val() !== ""){
		calculaCostoScoreModalCalculadora();
		calculaCostoOperacionalModalCalculadora();
		actualizaProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
	}
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// ----------------------------------- SCORE  ---------------------------------------
$('#'+id_costo_horaScoreModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_horaScoreModalCalculadora).change(function (){
		if($('#'+id_costo_horaScoreModalCalculadora).val() == ""){
			$('#'+id_costo_horaScoreModalCalculadora).val(formatMoney(0));
		}
		horasScoreManda = false;
		calculaCostoScoreModalCalculadora();
		calculaCostoOperacionalModalCalculadora();
		actualizaProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

$('#'+id_costo_horaScoreModalCalculadora).focus(function (){
	if($('#'+id_costo_horaScoreModalCalculadora).val() !== ""){
		$('#'+id_costo_horaScoreModalCalculadora).val(deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val()));
	}
});

$('#'+id_costo_horaScoreModalCalculadora).focusout(function (){
	if($('#'+id_costo_horaScoreModalCalculadora).val() !== ""){
		$('#'+id_costo_horaScoreModalCalculadora).val(formatMoney($('#'+id_costo_horaScoreModalCalculadora).val()));
	}
});

$('#'+id_horas_proyectoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#'+id_horas_proyectoModalCalculadora).change(function (){
	if($('#'+id_horas_proyectoModalCalculadora).val() == ""){
		$('#'+id_horas_proyectoModalCalculadora).val(0);
	}else{
		$('#'+id_horas_proyectoModalCalculadora).val(parseFloat($('#'+id_horas_proyectoModalCalculadora).val()).toFixed(2));
	}
	calculaCostoScoreModalCalculadora();
	calculaCostoOperacionalModalCalculadora();
	actualizaProfitModalCalculadora();
	actualizaPrecioVentaModalCalculadora();
	horasScoreManda = true;
});

$('#'+id_costo_proyectoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_proyectoModalCalculadora).change(function (){
	if($('#'+id_costo_proyectoModalCalculadora).val() == ""){
		$('#'+id_costo_proyectoModalCalculadora).val(formatMoney(0));
	}
	calculaScoreModalCalculadora();
	calculaCostoOperacionalModalCalculadora();
	actualizaProfitModalCalculadora();
	actualizaPrecioVentaModalCalculadora();
});

$('#'+id_costo_proyectoModalCalculadora).focus(function (){
	if($('#'+id_costo_proyectoModalCalculadora).val() !== ""){
		$('#'+id_costo_proyectoModalCalculadora).val(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()));
	}

});

$('#'+id_costo_proyectoModalCalculadora).focusout(function (){
	if($('#'+id_costo_proyectoModalCalculadora).val() !== "" && !horasActualizadas){
		$('#'+id_costo_proyectoModalCalculadora).val(formatMoney($('#'+id_costo_proyectoModalCalculadora).val()));
	}else{
		horasActualizadas = false;
	}
});

// ------------------------------ SUMINISTROS  ---------------------------------
$('#'+id_costo_suministrosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_suministrosModalCalculadora ).change(function (){
		if($('#'+id_costo_suministrosModalCalculadora).val() == ""){
			$('#'+id_costo_suministrosModalCalculadora).val(formatMoney(0));
		}
		calculaCostoOperacionalModalCalculadora();
		actualizaProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

$('#'+id_costo_suministrosModalCalculadora ).focus(function (){
	if($('#'+id_costo_suministrosModalCalculadora ).val() !== ""){
		$('#'+id_costo_suministrosModalCalculadora ).val(deformatMoney($('#'+id_costo_suministrosModalCalculadora ).val()));
	}
});

$('#'+id_costo_suministrosModalCalculadora).focusout(function (){
	if($('#'+id_costo_suministrosModalCalculadora).val() !== ""){
		$('#'+id_costo_suministrosModalCalculadora).val(formatMoney($('#'+id_costo_suministrosModalCalculadora).val()));
	}
});

// ----------------------------------- COPEO  ---------------------------------------
$('#'+id_costo_copeoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_copeoModalCalculadora).change(function (){
	copeoManda = true;
	if($('#'+id_costo_copeoModalCalculadora).val() == ""){
		$('#'+id_costo_copeoModalCalculadora).val(formatMoney(0));
	}
	actualizaCopeoModalCalculadora();
	calculaCostoOperacionalModalCalculadora();
	actualizaProfitModalCalculadora();
	actualizaPrecioVentaModalCalculadora();
});

$('#'+id_costo_copeoModalCalculadora).focus(function (){
	if($('#'+id_costo_copeoModalCalculadora).val() !== ""){
		$('#'+id_costo_copeoModalCalculadora).val(deformatMoney($('#'+id_costo_copeoModalCalculadora).val()));
	}
});

$('#'+id_costo_copeoModalCalculadora).focusout(function (){
	if($('#'+id_costo_copeoModalCalculadora).val() !== ""){
		$('#'+id_costo_copeoModalCalculadora).val(formatMoney($('#'+id_costo_copeoModalCalculadora).val()));
	}
});

$('#'+id_costo_copeoCargaModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_copeoCargaModalCalculadora).change(function (){
	copeoManda = false;
	if($('#'+id_costo_copeoCargaModalCalculadora).val() == ""){
		$('#'+id_costo_copeoCargaModalCalculadora).val(formatMoney(0));
	}
	actualizaCopeoModalCalculadora();
	calculaCostoOperacionalModalCalculadora();
	actualizaProfitModalCalculadora();
	actualizaPrecioVentaModalCalculadora();
});

$('#'+id_costo_copeoCargaModalCalculadora).focus(function (){
	if($('#'+id_costo_copeoCargaModalCalculadora).val() !== ""){
		$('#'+id_costo_copeoCargaModalCalculadora).val(deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()));
	}
});

$('#'+id_costo_copeoCargaModalCalculadora).focusout(function (){
	if($('#'+id_costo_copeoCargaModalCalculadora).val() !== ""){
		$('#'+id_costo_copeoCargaModalCalculadora).val(formatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()));
	}
});

$('#'+id_impuestosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_impuestosModalCalculadora).change(function (){
		if($('#'+id_impuestosModalCalculadora).val() == ""){
			$('#'+id_impuestosModalCalculadora).val(0);
		}else{
			$('#'+id_impuestosModalCalculadora ).val(parseFloat($('#'+id_impuestosModalCalculadora).val()).toFixed(2));
		}
		actualizaCopeoModalCalculadora();
		calculaCostoOperacionalModalCalculadora();
		actualizaProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

// ----------------------------------- PROFIT  ---------------------------------------
$('#'+id_profit_cantidadModalCalculadora ).keypress(function(e){
    charactersAllowed("-0123456789.",e);
});

$('#'+id_profit_cantidadModalCalculadora ).change(function (){
		if($('#'+id_profit_cantidadModalCalculadora).val() == ""){
			$('#'+id_profit_cantidadModalCalculadora).val(formatMoney(0));
		}
		cantProfitManda = true;
		actualizaPorcentajeProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

$('#'+id_profit_cantidadModalCalculadora ).focus(function (){
	if($('#'+id_profit_cantidadModalCalculadora ).val() !== ""){
		$('#'+id_profit_cantidadModalCalculadora ).val(deformatMoney($('#'+id_profit_cantidadModalCalculadora).val()));
	}
});

$('#'+id_profit_cantidadModalCalculadora).focusout(function (){
	if($('#'+id_profit_cantidadModalCalculadora).val() !== ""){
		$('#'+id_profit_cantidadModalCalculadora).val(formatMoney($('#'+id_profit_cantidadModalCalculadora).val()));
	}
});

$('#'+id_profit_porcentajeModalCalculadora  ).keypress(function(e){
    charactersAllowed("-0123456789.",e);
});

$('#'+id_profit_porcentajeModalCalculadora  ).change(function (){
	if($('#'+id_profit_porcentajeModalCalculadora).val() == ""){
		$('#'+id_profit_porcentajeModalCalculadora).val(0);
	}else{
		$('#'+id_profit_porcentajeModalCalculadora).val(parseFloat($('#'+id_profit_porcentajeModalCalculadora).val()).toFixed(2));
	}
		cantProfitManda = false;
		actualizaCantidadProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

// ------------------------------- PRECIO DE VENTA  -----------------------------------
$('#'+id_precio_ventaModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_precio_ventaModalCalculadora).change(function (){
	if($('#'+id_precio_ventaModalCalculadora).val() == ""){
		$('#'+id_precio_ventaModalCalculadora).val(formatMoney(0));
	}
	var cantProfit = parseFloat(deformatMoney($('#'+id_precio_ventaModalCalculadora).val())) - parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val()));
	$('#'+id_profit_cantidadModalCalculadora).val(formatMoney(cantProfit));
	highLight(id_profit_cantidadModalCalculadora);
	actualizaPorcentajeProfitModalCalculadora();
});

$('#'+id_precio_ventaModalCalculadora).focus(function (){
	if($('#'+id_precio_ventaModalCalculadora  ).val() !== ""){
		$('#'+id_precio_ventaModalCalculadora  ).val(deformatMoney($('#'+id_precio_ventaModalCalculadora ).val()));
	}
});

$('#'+id_precio_ventaModalCalculadora).focusout(function (){
	if($('#'+id_precio_ventaModalCalculadora).val() !== ""){
		$('#'+id_precio_ventaModalCalculadora).val(formatMoney($('#'+id_precio_ventaModalCalculadora).val()));
	}
});

// ---------------------------- COSTOS DE OPERACIONES  -------------------------------
$('#'+id_indirectosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_indirectosModalCalculadora).change(function (){
		if($('#'+id_indirectosModalCalculadora).val() == ""){
			$('#'+id_indirectosModalCalculadora).val(0);
		}else{
			$('#'+id_indirectosModalCalculadora).val(parseFloat($('#'+id_indirectosModalCalculadora).val()).toFixed(2));
		}
		calculaCostoOperacionalModalCalculadora();
		actualizaProfitModalCalculadora();
		actualizaPrecioVentaModalCalculadora();
});

// ----------------------------------- EXTRAS  ---------------------------------------
$('#'+id_anticipoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_anticipoModalCalculadora).change(function (){
		var anticipoCal = parseFloat($('#'+id_anticipoModalCalculadora).val()).toFixed(2);
		if(anticipoCal<=100){
			$('#'+id_anticipoModalCalculadora).val(anticipoCal);
			$('#'+id_estimacionesModalCalculadora).val(100 - anticipoCal);
			highLight(id_estimacionesModalCalculadora);
		} else {
			$('#'+id_anticipoModalCalculadora).val(50);
			$('#'+id_estimacionesModalCalculadora).val(50);
			highLightColor(id_anticipoModalCalculadora, "#FF0000");
			highLightColor(id_estimacionesModalCalculadora, "#FF0000");
		}
});

$('#'+id_estimacionesModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_estimacionesModalCalculadora).change(function (){
		var estimacionesCal = parseFloat($('#'+id_estimacionesModalCalculadora ).val()).toFixed(2);
		if(estimacionesCal<=100){
			$('#'+id_estimacionesModalCalculadora).val(estimacionesCal);
			$('#'+id_anticipoModalCalculadora).val(100 - estimacionesCal);
			highLight(id_anticipoModalCalculadora);
		} else {
			$('#'+id_estimacionesModalCalculadora).val(50);
			$('#'+id_anticipoModalCalculadora).val(50);
			highLightColor(id_estimacionesModalCalculadora, "#FF0000");
			highLightColor(id_anticipoModalCalculadora,"#FF0000");
		}
});

// ----------------------- VALIDACIONES ------------------------------------
function validateFormModalCalculadora(){
	if ($('#' + id_indirectosModalCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_anticipoModalCalculadora).val() == ""){
			alert("Ingresa el porcentaje de anticipo o de estimaciones");
			highLightColor(id_anticipoModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_estimacionesModalCalculadora).val() == ""){
			alert("Ingresa el porcentaje de anticipo o de estimaciones");
			highLightColor(id_estimacionesModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_horaScoreModalCalculadora).val() == ""){
			alert("Ingresa costo por hora de proyectos");
			highLightColor(id_costo_horaScoreModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_horas_proyectoModalCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_horas_proyectoModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_proyectoModalCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_costo_proyectoModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_copeoModalCalculadora).val() == ""){
			alert("Ingresa el costo de mano de obra (precopeo)");
			highLightColor(id_costo_copeoModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_copeoCargaModalCalculadora ).val() == ""){
			alert("Ingresa el costo de mano de obra (precopeo)");
			highLightColor(id_costo_copeoCargaModalCalculadora ,"#FF0000");
			return false;
	} else if ($('#' + id_impuestosModalCalculadora).val() == ""){
			alert("Ingresa porcentaje de impuestos a la mano de obra");
			highLightColor(id_impuestosModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_suministrosModalCalculadora).val() == ""){
			alert("Ingresa el costo de los suministros");
			highLightColor(id_costo_suministrosModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_profit_cantidadModalCalculadora).val() == ""){
			alert("Ingresa la utilidad esperada en porcentaje o cantidad");
			highLightColor(id_profit_cantidadModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_profit_porcentajeModalCalculadora).val() == ""){
			alert("Ingresa la utilidad esperada en porcentaje o cantidad");
			highLightColor(id_profit_porcentajeModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_precio_ventaModalCalculadora).val() == ""){
			alert("Ingresa el precio de venta");
			highLightColor(id_precio_ventaModalCalculadora,"#FF0000");
			return false;
	} else {
		return true;
	}
}

// ----------------------- FUNCIONES NECESARIAS ----------------------------
function resetFormModalCalculadora(){
  $('#' + id_horas_proyectoModalCalculadora ).val("");
  $('#' + id_costo_proyectoModalCalculadora ).val("");
  $('#' + id_costo_suministrosModalCalculadora).val("");
  $('#' + id_costo_copeoModalCalculadora).val("");
  $('#' + id_profit_cantidadModalCalculadora).val("");
  $('#' + id_profit_porcentajeModalCalculadora).val("");
  $('#' + id_precio_ventaModalCalculadora).val("");
	$('#' + id_costo_operacionesModalCalculadora).val("");
	$('#' + id_costo_copeoCargaModalCalculadora).val("");

	$('#' + id_anticipoModalCalculadora).val("");
  $('#' + id_estimacionesModalCalculadora).val("");
  $('#' + id_costo_horaScoreModalCalculadora).val("");
  $('#' + id_indirectosModalCalculadora).val("");
  $('#' + id_impuestosModalCalculadora).val("");
}

function returnToDefaultModalCalculadora(){
  $('#' + id_anticipoModalCalculadora).val(50);
  $('#' + id_estimacionesModalCalculadora).val(50);
  $('#' + id_costo_horaScoreModalCalculadora).val(formatMoney(1300));
  $('#' + id_indirectosModalCalculadora).val(20);
  $('#' + id_impuestosModalCalculadora).val(54);
	highLight(id_anticipoModalCalculadora);
	highLight(id_estimacionesModalCalculadora);
	highLight(id_costo_horaScoreModalCalculadora);
	highLight(id_indirectosModalCalculadora);
	highLight(id_impuestosModalCalculadora);
}

function calculaCostoOperacionalModalCalculadora(){
	var costoScore = parseFloat(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()));
	var costoSuministros = parseFloat(deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()));
	var costoPrecopeo = parseFloat(deformatMoney($('#'+id_costo_copeoModalCalculadora).val()));
	var porcIndirectos = parseFloat(deformatMoney($('#'+id_indirectosModalCalculadora ).val()));
	var porcImpuestos = parseFloat(deformatMoney($('#'+id_impuestosModalCalculadora ).val()));
	var costoOperacion = (costoScore + costoSuministros + (costoPrecopeo*(1 + porcImpuestos*0.01)))*(1 + porcIndirectos*0.01);
	var costosIndirectos = (costoScore + costoSuministros + (costoPrecopeo*(1 + porcImpuestos*0.01)))*(porcIndirectos*0.01);
	$('#' + id_costo_operacionesModalCalculadora).val(formatMoney(costoOperacion));
	$('#' + id_costos_indirectosModalCalculadora).val(formatMoney(costosIndirectos));
	highLight(id_costo_operacionesModalCalculadora);
	highLight(id_costos_indirectosModalCalculadora);
}

function calculaScoreModalCalculadora(){
	if (horasScoreManda){
		calculaCostoXHoraScoreModalCalculadora();
	}else{
		calculaHorasScoreModalCalculadora();
	}
}

function calculaHorasScoreModalCalculadora(){
	var horasProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val()));
	var horasFixed = horasProyecto.toFixed(2);
	$('#'+id_horas_proyectoModalCalculadora).val(horasFixed);
	highLight(id_horas_proyectoModalCalculadora);
	if (horasProyecto-horasFixed !== 0){
		horasActualizadas=true;
		var costoProyecto = horasFixed * parseFloat(deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val()));
		$('#'+id_costo_proyectoModalCalculadora).val(formatMoney(costoProyecto));
		highLight(id_costo_proyectoModalCalculadora);
	}
}

function calculaCostoXHoraScoreModalCalculadora(){
	var costoHora = parseFloat($('#'+id_costo_proyectoModalCalculadora).val()) / parseFloat(deformatMoney($('#'+id_horas_proyectoModalCalculadora).val()));
	$('#'+id_costo_horaScoreModalCalculadora).val(formatMoney(costoHora));
	highLight(id_costo_horaScoreModalCalculadora);
}

function calculaCostoScoreModalCalculadora(){
	var costoProyecto = parseFloat($('#'+id_horas_proyectoModalCalculadora).val()) * parseFloat(deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val()));
	$('#'+id_costo_proyectoModalCalculadora).val(formatMoney(costoProyecto));
	highLight(id_costo_proyectoModalCalculadora);
}

function actualizaProfitModalCalculadora(){
	if (cantProfitManda){
		actualizaPorcentajeProfitModalCalculadora();
	}else{
		actualizaCantidadProfitModalCalculadora();
	}
}

function actualizaCantidadProfitModalCalculadora(){
	if($('#'+id_profit_porcentajeModalCalculadora).val() !== "" ){
		var cantProfit = parseFloat(deformatMoney($('#'+id_profit_porcentajeModalCalculadora).val())) * parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val())) * 0.01;
		$('#'+id_profit_cantidadModalCalculadora).val(formatMoney(cantProfit));
		highLight(id_profit_cantidadModalCalculadora);
	}
}

function actualizaPorcentajeProfitModalCalculadora(){
	if($('#'+id_profit_cantidadModalCalculadora).val() !== "" ){
		if (deformatMoney($('#'+id_profit_cantidadModalCalculadora).val()) == 0 && deformatMoney($('#'+id_costo_operacionesModalCalculadora).val()) == 0){
			var porcProfit = 0;
		}else {
			var porcProfit = parseFloat(deformatMoney($('#'+id_profit_cantidadModalCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val())) * 100;
		}
		$('#'+id_profit_porcentajeModalCalculadora).val(porcProfit.toFixed(2));
		highLight(id_profit_porcentajeModalCalculadora);
	}
}

function actualizaPrecioVentaModalCalculadora(){
	if($('#' + id_costo_operacionesModalCalculadora).val() !== "" && $('#' + id_profit_cantidadModalCalculadora).val() !== ""){
		var precioTotal = parseFloat(deformatMoney($('#'+id_profit_cantidadModalCalculadora).val())) + parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val()));
		$('#'+id_precio_ventaModalCalculadora ).val(formatMoney(precioTotal));
		highLight(id_precio_ventaModalCalculadora);
	}
}

function actualizaCopeoModalCalculadora(){
	if(copeoManda){
		actualizaCopeoCargaSocialModalCalculadora();
	}else {
		actualizaCopeoBrutoModalCalculadora();
	}
}

function actualizaCopeoBrutoModalCalculadora(){
	if($('#'+id_costo_copeoCargaModalCalculadora).val() !== "" ){
		var copeoBruto = parseFloat(deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val())) / (1 + (parseFloat(deformatMoney($('#'+id_impuestosModalCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoModalCalculadora).val(formatMoney(copeoBruto));
		highLight(id_costo_copeoModalCalculadora);
	}
}

function actualizaCopeoCargaSocialModalCalculadora(){
	if($('#'+id_costo_copeoModalCalculadora).val() !== "" ){
		var copeoCarga = parseFloat(deformatMoney($('#'+id_costo_copeoModalCalculadora).val())) * (1 + (parseFloat(deformatMoney($('#'+id_impuestosModalCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoCargaModalCalculadora).val(formatMoney(copeoCarga));
		highLight(id_costo_copeoCargaModalCalculadora);
	}
}

function cargaCamposModalCalculadora(){
	firebase.database().ref(ruta_modalCalculadora).once('value',function(snapshot){
    var subproceso = snapshot.val();
    if (snapshot.exists() && !(subproceso.precio_venta == 0 && subproceso.costo_suministros ==0 && subproceso.utilidad ==0 && subproceso.precopeo == 0 && subproceso.score.horas_programadas == 0)){
			registro_antiguo = subproceso;
      var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
      var costoOperacion = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
			var costoOperacionIndirectos = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(subproceso.porcentaje_indirectos*0.01);
      var utilidadPorcentaje = subproceso.utilidad / costoOperacion * 100 ;
			var copeoConCarga = subproceso.precopeo * (1+subproceso.porcentaje_impuestos*0.01);

      $('#' + id_horas_proyectoModalCalculadora ).val(subproceso.score.horas_programadas);
			$('#' + id_costo_horaScoreModalCalculadora).val(formatMoney(subproceso.score.costo_hora));
			$('#' + id_costo_proyectoModalCalculadora).val(formatMoney(costoScore));
      $('#' + id_costo_suministrosModalCalculadora).val(formatMoney(subproceso.costo_suministros));
      $('#' + id_costo_copeoModalCalculadora).val(formatMoney(subproceso.precopeo));
			$('#' + id_costo_copeoCargaModalCalculadora).val(formatMoney(copeoConCarga));
      $('#' + id_profit_cantidadModalCalculadora).val(formatMoney(subproceso.utilidad));
			$('#' + id_profit_porcentajeModalCalculadora).val(utilidadPorcentaje.toFixed(2));
      $('#' + id_precio_ventaModalCalculadora).val(formatMoney(subproceso.precio_venta));
			$('#' + id_costo_operacionesModalCalculadora).val(formatMoney(costoOperacion));
			$('#' + id_costos_indirectosModalCalculadora).val(formatMoney(costoOperacionIndirectos));

      $('#' + id_anticipoModalCalculadora).val(subproceso.porcentaje_anticipo);
      $('#' + id_estimacionesModalCalculadora).val(100 - parseFloat(subproceso.porcentaje_anticipo));
      $('#' + id_indirectosModalCalculadora).val(subproceso.porcentaje_indirectos);
      $('#' + id_impuestosModalCalculadora).val(subproceso.porcentaje_impuestos);

			horasScoreManda = true;
			cantProfitManda = true;
    } else {
			resetFormModalCalculadora();
		}
  });
}
