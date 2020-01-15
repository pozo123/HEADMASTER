// ------------------ Campos Modal Calculadora --------------------------------
var id_modalCalculadora = "modalCalculadora";

var id_ddl_obraModalCalculadora = "obraDdlModalCalculadora";
var id_ddl_procesoModalCalculadora = "procesoDdlModalCalculadora";
var id_ddl_subprocesoModalCalculadora = "subprocesoDdlModalCalculadora";

var id_indirectosModalCalculadora = "indirectosModalCalculadora";

var id_costo_horaScoreModalCalculadora = "costoHoraScoreModalCalculadora";
var id_horas_proyectoModalCalculadora = "horasProyectoModalCalculadora";
var id_costo_proyectoModalCalculadora = "costoProyectoModalCalculadora";

var id_costo_copeoModalCalculadora = "costoCopeoModalCalculadora";
var id_costo_copeoCargaModalCalculadora = "costoCopeoCargaModalCalculadora";
var id_impuestosModalCalculadora = "impuestosModalCalculadora";
var id_costo_extraCopeoModalCalculadora = "costoExtraCopeoModalCalculadora";

var id_costo_suministrosModalCalculadora = "costoSuministrosModalCalculadora";

var id_profit_cantidadModalCalculadora = "profitCantidadModalCalculadora";
var id_profit_porcentajeModalCalculadora = "profitPorcentajeModalCalculadora";
var id_precio_ventaModalCalculadora = "precioVentaModalCalculadora";

var id_utilidad_suministrosModalCalculadora = "utilidadSuministrosModalCalculadora";
var id_utilidad_copeoModalCalculadora = "utilidadCopeoModalCalculadora";
var id_utilidad_proyectosModalCalculadora = "utilidadProyectosModalCalculadora";
var id_utilidad_desplegadaModalCalculadora = "utilidadDesplegadaModalCalculadora"

var id_costo_operacionesModalCalculadora = "costoOperacionesModalCalculadora";
var id_costos_indirectosModalCalculadora = "costosIndirectosModalCalculadora";
var id_seccion_subprocesoModalCalculadora = "div_subprocesoModalCalculadora";

var id_reporte_modalCalculadora = "botonpdfModalCalculadora";
var id_agregar_modalCalculadora = "botonGuardarModalCalculadora";
var id_borrar_modalCalculadora = "botonBorrarModalCalculadora";
var id_default_modalCalculadora = "botonDefaultModalCalculadora";

var cantProfitManda;
var horasScoreManda;
var copeoManda;
var horasActualizadas;
var json_modalCalculadora;
var todosDefaultCalculadora;
var info_calculadora;


// --------------------- Método de inicialización -----------------------------
function modalCalculadora(json_actuales, camposHabilitados, flagPrecioVenta, info_obra){
  cantProfitManda = true;
  horasScoreManda = true;
  copeoManda = true
  horasActualizadas = false;
  todosDefaultCalculadora = camposHabilitados;
  info_calculadora = info_obra;
  // pongo el texto para el on hover
	var texto_default = "Valores generalmente usados para el calculo de presupuestos como son: precio por hora del área de proyectos, impuestos para la mano de obra y el porcentaje de costos indirectos."
	$('#' + id_default_modalCalculadora).attr("data-content", texto_default);
	resetFormModalCalculadora();
  cargaCamposModalCalculadora(json_actuales, flagPrecioVenta);

  $('#' + id_costo_copeoModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_suministrosModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_copeoCargaModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_impuestosModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_extraCopeoModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_profit_cantidadModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_profit_porcentajeModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_precio_ventaModalCalculadora).prop('disabled', !camposHabilitados);
  //returnToDefaultModalCalculadora();
  $('#' + id_modalCalculadora).modal('show');
}

$('#' + id_borrar_modalCalculadora).click(function(){
	resetFormModalCalculadora();
});

$('#' + id_agregar_modalCalculadora).click(function(){
	if(validateFormModalCalculadora()){
		//Actualizar los campos de la obra
    json_modalCalculadora["score"]={};
		json_modalCalculadora["score"]["horas_programadas"] = deformatMoney($('#'+id_horas_proyectoModalCalculadora).val());
		json_modalCalculadora["score"]["costo_hora"] = deformatMoney($('#'+id_costo_horaScoreModalCalculadora).val());
		json_modalCalculadora["costo_suministros"] = deformatMoney($('#'+id_costo_suministrosModalCalculadora).val());
		json_modalCalculadora["precopeo"] = deformatMoney($('#'+id_costo_copeoModalCalculadora).val());
    json_modalCalculadora["extras_copeo"] = deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val());
		json_modalCalculadora["porcentaje_indirectos"] = deformatMoney($('#'+id_indirectosModalCalculadora).val());
		json_modalCalculadora["porcentaje_impuestos"] = deformatMoney($('#'+id_impuestosModalCalculadora).val());
		json_modalCalculadora["utilidad"] = deformatMoney($('#'+id_profit_cantidadModalCalculadora).val());
		json_modalCalculadora["precio_venta"] = deformatMoney($('#'+id_precio_ventaModalCalculadora).val());
    json_modalCalculadora["utilidad_suministros"] = parseFloat($('#'+ id_utilidad_suministrosModalCalculadora).val()).toFixed(2);
    json_modalCalculadora["utilidad_copeo"] = parseFloat($('#'+ id_utilidad_copeoModalCalculadora).val()).toFixed(2);
    json_modalCalculadora["utilidad_proyecto"] = parseFloat($('#'+ id_utilidad_proyectosModalCalculadora).val()).toFixed(2);
    json_modalCalculadora["utilidad_global"] = parseFloat($('#'+ id_utilidad_desplegadaModalCalculadora).val()).toFixed(2);
		//Escribir los cambios en la base de datos
		console.log(json_modalCalculadora);
		alert("¡Calculos registrados!");
    $('#' + id_modalCalculadora).modal('toggle');
		//resetFormModalCalculadora();
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

$('#' + id_reporte_modalCalculadora).click(function(){
  // var obra ={nombre:"NOMBRE OBRA", proceso:"NOMBRE PROCESO", subproceso: "NOMBRE SUBPROCESO"};
  var score={horas: $('#'+id_horas_proyectoModalCalculadora).val(), precio:$('#'+id_costo_horaScoreModalCalculadora).val(), costo:$('#'+id_costo_proyectoModalCalculadora).val(), utilidad: $('#'+id_utilidad_proyectosModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()) * (1 + $('#'+id_utilidad_proyectosModalCalculadora).val() * 0.01))};
  var copeo={copeo: formatMoney(deformatMoney($('#'+id_costo_copeoModalCalculadora).val())+deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val())), cargaSocial:$('#'+id_impuestosModalCalculadora).val(), costo:$('#'+id_costo_copeoCargaModalCalculadora).val(), utilidad: $('#'+id_utilidad_copeoModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()) * (1 + $('#'+id_utilidad_copeoModalCalculadora).val() * 0.01))};
  var suministros={costo:$('#'+id_costo_suministrosModalCalculadora).val(), utilidad: $('#'+id_utilidad_suministrosModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()) * (1 + $('#'+id_utilidad_suministrosModalCalculadora).val() * 0.01))};
  var totales={costo:formatMoney(deformatMoney(score.costo) + deformatMoney(copeo.costo) + deformatMoney(suministros.costo)), cliente:formatMoney(deformatMoney(score.cliente) + deformatMoney(copeo.cliente) + deformatMoney(suministros.cliente))};
  totales["utilidad"] = formatMoney(deformatMoney(totales.cliente)-deformatMoney(totales.costo));
  var indirectos={porcentaje: $('#'+id_indirectosModalCalculadora).val(), costo:formatMoney(deformatMoney(totales.costo)*$('#'+id_indirectosModalCalculadora).val()*0.01)};
  var operaciones={utilidad: formatMoney(deformatMoney(totales.utilidad) - deformatMoney(indirectos.costo)), costo:formatMoney(deformatMoney(totales.costo) + deformatMoney(indirectos.costo))};
  var utilidad={porcentaje:$('#'+id_utilidad_desplegadaModalCalculadora).val(), cantidad: $('#'+id_profit_cantidadModalCalculadora).val(), cliente: $('#'+id_precio_ventaModalCalculadora).val()};
  var docDescription = generaReporteCalculadora(info_calculadora, score, copeo, suministros, totales, indirectos, operaciones, utilidad);
  var pdfDocGenerator = pdfMake.createPdf(docDescription);
  pdfDocGenerator.open();
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
$('#'+id_utilidad_suministrosModalCalculadora).change(function (){
		if($('#'+id_utilidad_suministrosModalCalculadora).val() == ""){
			$('#'+id_utilidad_suministrosModalCalculadora).val(formatMoney(0));
		}
		actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidad_copeoModalCalculadora).change(function (){
		if($('#'+id_utilidad_copeoModalCalculadora).val() == ""){
			$('#'+id_utilidad_copeoModalCalculadora).val(formatMoney(0));
		}
		actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidad_proyectosModalCalculadora).change(function (){
		if($('#'+id_utilidad_proyectosModalCalculadora).val() == ""){
			$('#'+id_utilidad_proyectosModalCalculadora).val(formatMoney(0));
		}
    actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidad_desplegadaModalCalculadora).change(function (){
		if($('#'+id_utilidad_desplegadaModalCalculadora).val() == ""){
			$('#'+id_utilidad_desplegadaModalCalculadora).val(formatMoney(0));
		}
    actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

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

// ----------------------- VALIDACIONES ------------------------------------
function validateFormModalCalculadora(){
	if ($('#' + id_indirectosModalCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosModalCalculadora,"#FF0000");
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
  } else if ($('#' + id_utilidad_copeoModalCalculadora).val() == ""){
			alert("Ingresa la utilidad del copeo en porcentaje");
			highLightColor(id_utilidad_copeoModalCalculadora,"#FF0000");
			return false;
  } else if ($('#' + id_utilidad_proyectosModalCalculadora).val() == ""){
			alert("Ingresa la utilidad de proyectos en porcentaje");
			highLightColor(id_utilidad_proyectosModalCalculadora,"#FF0000");
			return false;
  } else if ($('#' + id_utilidad_suministrosModalCalculadora).val() == ""){
      alert("Ingresa la utilidad de suministros en porcentaje");
      highLightColor(id_utilidad_suministrosModalCalculadora,"#FF0000");
      return false;
  } else if ($('#' + id_utilidad_desplegadaModalCalculadora).val() == ""){
      alert("Ingresa la utilidad desplegable en porcentaje");
      highLightColor(id_utilidad_desplegadaModalCalculadora,"#FF0000");
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

  $('#' + id_costo_horaScoreModalCalculadora).val("");
  $('#' + id_indirectosModalCalculadora).val("");
  $('#' + id_impuestosModalCalculadora).val("");
}

function returnToDefaultModalCalculadora(){
  $('#' + id_costo_horaScoreModalCalculadora).val(formatMoney(1300));
  $('#' + id_indirectosModalCalculadora).val(20);
  if(todosDefaultCalculadora){
    $('#' + id_impuestosModalCalculadora).val(54);
    highLight(id_impuestosModalCalculadora);
  }
	highLight(id_costo_horaScoreModalCalculadora);
	highLight(id_indirectosModalCalculadora);
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
	//highLight(id_costo_operacionesModalCalculadora);
	//highLight(id_costos_indirectosModalCalculadora);
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
  actualizaProfitUtilidadModalCalculadora();
  /*
	if (cantProfitManda){
		actualizaPorcentajeProfitModalCalculadora();
	}else{
		actualizaCantidadProfitModalCalculadora();
	}
  */
}

function actualizaCantidadProfitModalCalculadora(){
	if($('#'+id_profit_porcentajeModalCalculadora).val() !== "" ){
		var cantProfit = parseFloat(deformatMoney($('#'+id_profit_porcentajeModalCalculadora).val())) * parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val())) * 0.01;
		$('#'+id_profit_cantidadModalCalculadora).val(formatMoney(cantProfit));
		//highLight(id_profit_cantidadModalCalculadora);
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
		//highLight(id_profit_porcentajeModalCalculadora);
	}
}

function actualizaProfitUtilidadModalCalculadora(){
  var costoSuministros = $('#'+id_costo_suministrosModalCalculadora).val()==""?0:deformatMoney($('#'+id_costo_suministrosModalCalculadora).val());
  var costoCopeo = $('#'+id_costo_copeoCargaModalCalculadora).val()==""?0:deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val());
  var costoProyecto = $('#'+id_costo_proyectoModalCalculadora).val()==""?0:deformatMoney($('#'+id_costo_proyectoModalCalculadora).val());
  var utilidadSuministros = $('#'+id_utilidad_suministrosModalCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_suministrosModalCalculadora).val());
  var utilidadCopeo = $('#'+id_utilidad_copeoModalCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_copeoModalCalculadora).val());
  var utilidadProyecto = $('#'+id_utilidad_proyectosModalCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_proyectosModalCalculadora).val());
  var utilidadGlobal = $('#'+id_utilidad_desplegadaModalCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_desplegadaModalCalculadora).val());
  var ingresoSuministros = costoSuministros * (1 + utilidadSuministros * 0.01);
  var ingresoCopeo = costoCopeo * (1 + utilidadCopeo * 0.01);
  var ingresoProyecto = costoProyecto * (1 + utilidadProyecto * 0.01);
  var cantProfit = (ingresoSuministros + ingresoCopeo + ingresoProyecto)*(1 + utilidadGlobal * 0.01) - deformatMoney($('#'+id_costo_operacionesModalCalculadora).val());
  $('#'+id_profit_cantidadModalCalculadora).val(formatMoney(cantProfit));
  actualizaPorcentajeProfitModalCalculadora();
  // actualizaPrecioVentaModalCalculadora();
}

function actualizaPrecioVentaModalCalculadora(){
	if($('#' + id_costo_operacionesModalCalculadora).val() !== "" && $('#' + id_profit_cantidadModalCalculadora).val() !== ""){
		var precioTotal = parseFloat(deformatMoney($('#'+id_profit_cantidadModalCalculadora).val())) + parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val()));
		$('#'+id_precio_ventaModalCalculadora ).val(formatMoney(precioTotal));
		// highLight(id_precio_ventaModalCalculadora);
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

function cargaCamposModalCalculadora(subproceso, flag){
  if (!jQuery.isEmptyObject(subproceso)){
    var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
    var costoOperacion = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
		var costoOperacionIndirectos = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(subproceso.porcentaje_indirectos*0.01);
    var utilidad = subproceso.utilidad;
    var precio_venta = subproceso.precio_venta;
    if(flag){
      utilidad = precio_venta - costoOperacion;
    } else {
      precio_venta = costoOperacion + utilidad;
    }
    if(subproceso.utilidad_copeo !== undefined){
      precio_venta = (costoScore * (1+subproceso.utilidad_proyecto*0.01) + subproceso.costo_suministros * (1+subproceso.utilidad_suministros*0.01) + subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01) * (1+subproceso.utilidad_copeo*0.01))*(1 + subproceso.utilidad_global*0.01);
      utilidad = precio_venta - costoOperacion;
    }
    var utilidadPorcentaje = utilidad / costoOperacion * 100 ;
		var copeoConCarga = subproceso.precopeo * (1+subproceso.porcentaje_impuestos*0.01);

    $('#' + id_horas_proyectoModalCalculadora ).val(subproceso.score.horas_programadas);
		$('#' + id_costo_horaScoreModalCalculadora).val(formatMoney(subproceso.score.costo_hora));
		$('#' + id_costo_proyectoModalCalculadora).val(formatMoney(costoScore));
    $('#' + id_costo_suministrosModalCalculadora).val(formatMoney(subproceso.costo_suministros));
    $('#' + id_costo_copeoModalCalculadora).val(formatMoney(subproceso.precopeo));
		$('#' + id_costo_copeoCargaModalCalculadora).val(formatMoney(copeoConCarga));
    $('#' + id_utilidad_copeoModalCalculadora).val(subproceso.utilidad_copeo);
    $('#' + id_utilidad_proyectosModalCalculadora).val(subproceso.utilidad_proyecto);
    $('#' + id_utilidad_suministrosModalCalculadora).val(subproceso.utilidad_suministros);
    $('#' + id_utilidad_desplegadaModalCalculadora).val(subproceso.utilidad_global);
    $('#' + id_profit_cantidadModalCalculadora).val(formatMoney(utilidad));
		$('#' + id_profit_porcentajeModalCalculadora).val(utilidadPorcentaje.toFixed(2));
    $('#' + id_precio_ventaModalCalculadora).val(formatMoney(precio_venta));
		$('#' + id_costo_operacionesModalCalculadora).val(formatMoney(costoOperacion));
		$('#' + id_costos_indirectosModalCalculadora).val(formatMoney(costoOperacionIndirectos));

    $('#' + id_indirectosModalCalculadora).val(subproceso.porcentaje_indirectos);
    $('#' + id_impuestosModalCalculadora).val(subproceso.porcentaje_impuestos);

		horasScoreManda = true;
		cantProfitManda = true;
  } else {
		resetFormModalCalculadora();
	}
}
