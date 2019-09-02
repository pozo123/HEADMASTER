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
var id_profit_netoCalculadora = "profitNetoCalculadora";
var id_precio_ventaCalculadora = "precioVentaCalculadora";
var id_anticipoCalculadora = "anticipoCalculadora";
var id_estimacionesCalculadora = "estimacionesCalculadora";
var id_costo_horaScoreCalculadora = "costoHoraScoreCalculadora";
var id_indirectosCalculadora = "indirectosCalculadora";
var id_impuestosCalculadora = "impuestosCalculadora";
var id_costo_operacionesCalculadora = "costoOperacionesCalculadora";
var id_costos_indirectosCalculadora = "costosIndirectosCalculadora";
var id_costo_copeoCargaCalculadora = "costoCopeoCargaCalculadora";

var id_agregar_calculadora = "botonGuardarCalculadora";
var id_borrar_calculadora = "botonBorrarCalculadora";
var id_default_calculadora = "botonDefaultCalculadora";

var uid_obra;
var uid_proceso;
var uid_subproceso;
var cantProfitManda = true;
var horasScoreManda = true;

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
		var subproceso_update = {};
		//Actualizar los campos de la obra
		var path_subproceso = "procesos/" + uid_obra + "/procesos/" + uid_proceso + "/subprocesos/" + uid_subproceso;
		subproceso_update[path_subproceso + "/score/horas_programadas"] = "";
		subproceso_update[path_subproceso + "/score/costo_hora"] = "";
		subproceso_update[path_subproceso + "/costo_sumnistros"] = "";
		subproceso_update[path_subproceso + "/precopeo"] = "";
		subproceso_update[path_subproceso + "/porcentaje_anticipo"] = "";
		subproceso_update[path_subproceso + "/porcentaje_indirectos"] = "";
		subproceso_update[path_subproceso + "/porcentaje_impuestos"] = "";
		subproceso_update[path_subproceso + "/utilidad"] = "";
		subproceso_update[path_subproceso + "/precio_venta"] = "";
	}
});

$('#' + id_default_calculadora).click(function(){
  returnToDefaultCalculadora();
	if($('#'+id_costo_operacionesCalculadora).val() !== ""){
		calculaScore();
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
    if (subproceso.utilidad !== undefined){
      var costoScore = subproceso.score.horas_programadas*subproceso.score.costo_hora;
      var costoOperacion = (costoScore + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
      var costoUtilidad = costoOperacion + subproceso.utilidad;
      var utilidadPorcentaje = subproceso.utilidad / costoOperacion ;

      $('#' + id_horas_proyectoCalculadora ).val(subproceso.score.horas_programadas);
      $('#' + id_costo_suministrosCalculadora).val(formatMoney(subproceso.costo_suministros));
      $('#' + id_costo_copeoCalculadora).val(formatMoney(subproceso.precopeo));
      $('#' + id_profit_cantidadCalculadora).val(formatMoney(subproceso.utilidad));
      $('#' + id_precio_ventaCalculadora).val(formatMoney(subproceso.precio_venta));

      $('#' + id_anticipoCalculadora).val(subproceso.porcentaje_anticipo);
      $('#' + id_estimacionesCalculadora).val(100 - parseFloat(subproceso.porcentaje_anticipo));
      $('#' + id_costo_horaScoreCalculadora).val(formatMoney(subproceso.score.costo_hora));
      $('#' + id_indirectosCalculadora).val(subproceso.porcentaje_indirectos);
      $('#' + id_impuestosCalculadora).val(subproceso.porcentaje_impuestos);

			horasScoreManda = true;
			cantProfitManda = true;
			calculaScore();
			calculaCostoOperacional();
			actualizaProfit();

    } else {
			resetFormCalculadora_subproceso();
		}
  });
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
$('#'+id_horas_proyectoCalculadora).keypress(function(e){
    charactersAllowed("0123456789",e);
});

$('#'+id_horas_proyectoCalculadora).change(function (){
	if($('#'+id_horas_proyectoCalculadora).val() == ""){
		$('#'+id_horas_proyectoCalculadora).val(0);
	}else{
		$('#'+id_horas_proyectoCalculadora).val(parseFloat($('#'+id_horas_proyectoCalculadora).val()));
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
	calculaHorasScore();
	calculaCostoOperacional();
	actualizaProfit();
	actualizaPrecioVenta();
	horasScoreManda = false;
});

$('#'+id_costo_proyectoCalculadora).focus(function (){
	if($('#'+id_costo_proyectoCalculadora).val() !== ""){
		$('#'+id_costo_proyectoCalculadora).val(deformatMoney($('#'+id_costo_proyectoCalculadora).val()));
	}
});

$('#'+id_costo_proyectoCalculadora).focusout(function (){
	if($('#'+id_costo_proyectoCalculadora).val() !== ""){
		$('#'+id_costo_proyectoCalculadora).val(formatMoney($('#'+id_costo_proyectoCalculadora).val()));
	}
});

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

$('#'+id_costo_copeoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_copeoCalculadora).change(function (){
	if($('#'+id_costo_copeoCalculadora).val() == ""){
		$('#'+id_costo_copeoCalculadora).val(formatMoney(0));
	}
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

$('#'+id_profit_cantidadCalculadora ).keypress(function(e){
    charactersAllowed("0123456789.",e);
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
    charactersAllowed("0123456789.",e);
});

$('#'+id_profit_porcentajeCalculadora  ).change(function (){
	if($('#'+id_profit_porcentajeCalculadora).val() == ""){
		$('#'+id_profit_porcentajeCalculadora).val(0);
	}else{
		$('#'+id_profit_porcentajeCalculadora).val(parseFloat($('#'+id_profit_porcentajeCalculadora).val()));
	}
		cantProfitManda = false;
		actualizaCantidadProfit();
		actualizaPrecioVenta();
});

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

// ----------------------- FUNCIONES DE LOS CAMPOS REFERENCIA ------------------------
$('#'+id_anticipoCalculadora ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_anticipoCalculadora ).change(function (){
		var anticipoCal = parseFloat($('#'+id_anticipoCalculadora).val());
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
		var estimacionesCal = parseFloat($('#'+id_estimacionesCalculadora ).val());
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

$('#'+id_costo_horaScoreCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_horaScoreCalculadora).change(function (){
		if($('#'+id_costo_horaScoreCalculadora).val() == ""){
			$('#'+id_costo_horaScoreCalculadora).val(formatMoney(0));
		}
		calculaScore();
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

$('#'+id_indirectosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_indirectosCalculadora).change(function (){
		if($('#'+id_indirectosCalculadora).val() == ""){
			$('#'+id_indirectosCalculadora).val(0);
		}else{
			$('#'+id_indirectosCalculadora).val(parseFloat($('#'+id_indirectosCalculadora).val()));
		}
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
});

$('#'+id_impuestosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_impuestosCalculadora).change(function (){
		if($('#'+id_impuestosCalculadora).val() == ""){
			$('#'+id_impuestosCalculadora).val(0);
		}else{
			$('#'+id_impuestosCalculadora ).val(parseFloat($('#'+id_impuestosCalculadora).val()));
		}
		calculaCostoOperacional();
		actualizaProfit();
		actualizaPrecioVenta();
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
	} else if ($('#' + id_horas_proyectoCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_horas_proyectoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_proyectoCalculadora).val() == ""){
			alert("Ingresa las horas esperadas o el costo total para el área de proyectos");
			highLightColor(id_costo_proyectoCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_suministrosCalculadora).val() == ""){
			alert("Ingresa el costo de los suministros");
			highLightColor(id_costo_suministrosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_copeoCalculadora).val() == ""){
			alert("Ingresa el costo de mano de obra (precopeo)");
			highLightColor(id_costo_copeoCalculadora,"#FF0000");
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
	} else if ($('#' + id_indirectosCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_impuestosCalculadora).val() == ""){
			alert("Ingresa porcentaje de impuestos a la mano de obra");
			highLightColor(id_impuestosCalculadora,"#FF0000");
			return false;
	} else {
		return true;
	}
}
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
	$('#' + id_costo_operacionesCalculadora).val("");
	$('#' + id_profit_netoCalculadora).val("");
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
	var porcIndirectos = parseFloat($('#'+id_indirectosCalculadora ).val());
	var porcImpuestos = parseFloat($('#'+id_impuestosCalculadora ).val());
	var costoOperacion = (costoScore + costoSuministros + (costoPrecopeo*(1 + porcImpuestos*0.01)))*(1+ porcIndirectos*0.01);
	$('#' + id_costo_operacionesCalculadora).val(formatMoney(costoOperacion));
	highLight(id_costo_operacionesCalculadora);
}

function calculaScore(){
	if (horasScoreManda){
		calculaCostoScore();
	}else{
		calculaHorasScore();
	}
}

function calculaHorasScore(){
	var horasProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_horaScoreCalculadora).val()));
	$('#'+id_horas_proyectoCalculadora).val(horasProyecto);
	highLight(id_horas_proyectoCalculadora);
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
		var porcProfit = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val())) * 100;
		$('#'+id_profit_porcentajeCalculadora).val(porcProfit);
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
