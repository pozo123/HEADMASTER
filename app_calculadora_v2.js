// id's de los elementos HTML
var id_tab_calculadora = "tabCalculadora";
var id_form_calculadora = "formCalculadora";
var id_dataTable_calculadora = "dataTableCalculadora";

var id_ddl_obraCalculadora = "obraDdlCalculadora";
var id_ddl_procesoCalculadora = "procesoDdlCalculadora";
var id_ddl_subprocesoCalculadora = "subprocesoDdlCalculadora";

var id_indirectosCalculadora = "indirectosCalculadora";

var id_horas_proyectoCalculadora = "horasProyectoCalculadora";
var id_costo_proyectoCalculadora = "costoProyectoCalculadora";
var id_costo_horaProyectoCalculadora = "costoHoraScoreCalculadora";
var id_costo_extraCopeoCalculadora = "costoExtraCopeoCalculadora";

var id_costo_copeoCalculadora = "costoCopeoCalculadora";
var id_cargaSocialCalculadora = "impuestosCalculadora";
var id_costo_copeoCargaCalculadora = "costoCopeoCargaCalculadora";

var id_costo_suministrosCalculadora = "costoSuministrosCalculadora";

var id_utilidad_suministrosCalculadora = "utilidadSuministrosCalculadora";
var id_utilidad_copeoCalculadora = "utilidadCopeoCalculadora";
var id_utilidad_proyectosCalculadora = "utilidadProyectosCalculadora";
var id_utilidad_desplegadaCalculadora = "utilidadDesplegadaCalculadora"

var id_utilidadCantidad_suministrosCalculadora = "utilidadCantidadSuministrosCalculadora";
var id_utilidadCantidad_copeoCalculadora = "utilidadCantidadCopeoCalculadora";
var id_utilidadCantidad_proyectosCalculadora = "utilidadCantidadProyectosCalculadora";
var id_utilidadCantidad_desplegadaCalculadora = "utilidadCantidadDesplegadaCalculadora"

var id_profit_cantidadCalculadora = "profitCantidadCalculadora";
var id_profit_porcentajeCalculadora = "profitPorcentajeCalculadora";
var id_precio_ventaCalculadora = "precioVentaCalculadora";

var id_costos_produccionCalculadora = "costosProduccionCalculadora";
var id_costo_operacionesCalculadora = "costoOperacionesCalculadora";
var id_costos_indirectosCalculadora = "costosIndirectosCalculadora";
var id_seccion_subprocesoCalculadora = "div_subprocesoCalculadora";

var id_reporte_calculadora = "botonpdfCalculadora";
var id_agregar_calculadora = "botonGuardarCalculadora";
var id_borrar_calculadora = "botonBorrarCalculadora";
var id_default_calculadora = "botonDefaultCalculadora";

var cantProfitManda;
var horasProyectoManda;
var copeoManda;
var porcentajeIndirectosManda;
var horasActualizadas;
var registro_antiguo = '';

$('#' + id_tab_calculadora).click(function(){
	cantProfitManda = true;
  horasProyectoManda = true;
  copeoManda = true
	porcentajeIndirectosManda = true;
  horasActualizadas = false;
	// pongo el texto para el on hover
	var texto_default = "Valores generalmente usados para el calculo de presupuestos: precio por hora del área de proyectos, impuestos para la mano de obra y el porcentaje de costos indirectos."
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
		var obra = $("#" + id_ddl_obraCalculadora + " option:selected").val();
		var subproceso_update = {};
		//Actualizar los campos de la obra
		var path_subproceso = "presupuesto/" + obra + "/general";
		subproceso_update[path_subproceso] = datosCalculadora();
		//Escribir los cambios en la base de datos
		console.log(subproceso_update);
		firebase.database().ref(rama_bd_obras).update(subproceso_update);
		// PAD
		if(registro_antiguo == ''){
			pda("alta", rama_bd_obras + "/" +path_subproceso, registro_antiguo);
			alert("¡Registro exitoso!");
		} else {
			pda("modificacion", rama_bd_obras + "/" +path_subproceso, registro_antiguo);
			alert("¡Edición exitosa!");
		}
		resetFormCalculadora();
	}
});

$('#' + id_default_calculadora).click(function(){
  returnToDefaultCalculadora();
	if($('#'+id_costo_operacionesCalculadora).val() !== ""){
		calculaCostoProyectoCalculadora();
		actualizaResultadosCalculadora();
	}
});

$('#' + id_reporte_calculadora).click(function(){
  var obra ={nombre:$('#'+id_ddl_obraCalculadora+' option:selected').text(), proceso:"GENERAL", subproceso: "TODOS"};
  var proyectos={horas: $('#'+id_horas_proyectoCalculadora).val(), precio:$('#'+id_costo_horaProyectoCalculadora).val(), costo:$('#'+id_costo_proyectoCalculadora).val(), utilidad: $('#'+id_utilidad_proyectosCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_proyectoCalculadora).val()) * (1 + $('#'+id_utilidad_proyectosCalculadora).val() * 0.01))};
  var copeo={copeo: formatMoney(deformatMoney($('#'+id_costo_copeoCalculadora).val())+deformatMoney($('#'+id_costo_extraCopeoCalculadora).val())), cargaSocial:$('#'+id_cargaSocialCalculadora).val(), costo:$('#'+id_costo_copeoCargaCalculadora).val(), utilidad: $('#'+id_utilidad_copeoCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_copeoCargaCalculadora).val()) * (1 + $('#'+id_utilidad_copeoCalculadora).val() * 0.01))};
  var suministros={costo:$('#'+id_costo_suministrosCalculadora).val(), utilidad: $('#'+id_utilidad_suministrosCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_suministrosCalculadora).val()) * (1 + $('#'+id_utilidad_suministrosCalculadora).val() * 0.01))};
  var totales={costo:formatMoney(deformatMoney(proyectos.costo) + deformatMoney(copeo.costo) + deformatMoney(suministros.costo)), cliente:formatMoney(deformatMoney(proyectos.cliente) + deformatMoney(copeo.cliente) + deformatMoney(suministros.cliente))};
  totales["utilidad"] = formatMoney(deformatMoney(totales.cliente)-deformatMoney(totales.costo));
  var indirectos={porcentaje: $('#'+id_indirectosCalculadora).val(), costo:$('#'+id_costos_indirectosCalculadora).val()};
  var operaciones={utilidad: formatMoney(deformatMoney(totales.utilidad) - deformatMoney(indirectos.costo)), costo:$('#'+id_costo_operacionesCalculadora).val()};
  var utilidad={porcentaje:$('#'+id_utilidad_desplegadaCalculadora).val(), cantidad: $('#'+id_profit_cantidadCalculadora).val(), cliente: $('#'+id_precio_ventaCalculadora).val()};
  var docDescription = generaReporteCalculadora(obra, proyectos, copeo, suministros, totales, indirectos, operaciones, utilidad);
  var pdfDocGenerator = pdfMake.createPdf(docDescription);
  pdfDocGenerator.open();
});

// ----------------------- FUNCIONES DE LOS DDLS ------------------------
$("#" + id_ddl_obraCalculadora ).change(function(){
	resetFormCalculadora_subproceso();
	cargaCamposCalculadora($("#" + id_ddl_obraCalculadora ).val());
	/*
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
	*/
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// ----------------------------------- SCORE  ---------------------------------------
$('#'+id_costo_horaProyectoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_horaProyectoCalculadora).change(function (){
		if($('#'+id_costo_horaProyectoCalculadora).val() == ""){
			$('#'+id_costo_horaProyectoCalculadora).val(formatMoney(0));
		}
		horasProyectoManda = false;
		calculaCostoProyectoCalculadora();
		actualizaResultadosCalculadora();
});

$('#'+id_costo_horaProyectoCalculadora).focus(function (){
	if($('#'+id_costo_horaProyectoCalculadora).val() !== ""){
		$('#'+id_costo_horaProyectoCalculadora).val(deformatMoney($('#'+id_costo_horaProyectoCalculadora).val()));
	}
});

$('#'+id_costo_horaProyectoCalculadora).focusout(function (){
	if($('#'+id_costo_horaProyectoCalculadora).val() !== ""){
		$('#'+id_costo_horaProyectoCalculadora).val(formatMoney($('#'+id_costo_horaProyectoCalculadora).val()));
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
	calculaCostoProyectoCalculadora();
	actualizaResultadosCalculadora();
	horasProyectoManda = true;
});

$('#'+id_costo_proyectoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_proyectoCalculadora).change(function (){
	if($('#'+id_costo_proyectoCalculadora).val() == ""){
		$('#'+id_costo_proyectoCalculadora).val(formatMoney(0));
	}
	calculaProyecto();
	actualizaResultadosCalculadora();
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
		actualizaResultadosCalculadora();
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
	actualizaCopeoCalculadora();
	actualizaResultadosCalculadora();
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
	actualizaCopeoCalculadora();
	actualizaResultadosCalculadora();
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

$('#'+id_cargaSocialCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_cargaSocialCalculadora).change(function (){
		if($('#'+id_cargaSocialCalculadora).val() == ""){
			$('#'+id_cargaSocialCalculadora).val(0);
		}else{
			$('#'+id_cargaSocialCalculadora ).val(parseFloat($('#'+id_cargaSocialCalculadora).val()).toFixed(2));
		}
		actualizaCopeoCalculadora();
		actualizaResultadosCalculadora();
});

$('#'+id_costo_extraCopeoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_extraCopeoCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_costo_extraCopeoCalculadora).val() == ""){
		$('#'+id_costo_extraCopeoCalculadora).val(formatMoney(0));
	}
	actualizaCopeoCalculadora();
	actualizaResultadosCalculadora();
});

$('#'+id_costo_extraCopeoCalculadora).focus(function (){
	if($('#'+id_costo_extraCopeoCalculadora).val() !== ""){
		$('#'+id_costo_extraCopeoCalculadora).val(deformatMoney($('#'+id_costo_extraCopeoCalculadora).val()));
	}
});

$('#'+id_costo_extraCopeoCalculadora).focusout(function (){
	if($('#'+id_costo_extraCopeoCalculadora).val() !== ""){
		$('#'+id_costo_extraCopeoCalculadora).val(formatMoney($('#'+id_costo_extraCopeoCalculadora).val()));
	}
});

// ------------------------------- PROFIT  -------------------------------------
$('#'+id_utilidad_suministrosCalculadora).change(function (){
		if($('#'+id_utilidad_suministrosCalculadora).val() == ""){
			$('#'+id_utilidad_suministrosCalculadora).val(formatMoney(0));
		}
		var cantidad = deformatMoney($('#'+id_costo_suministrosCalculadora).val()) * deformatMoney($('#'+id_utilidad_suministrosCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_suministrosCalculadora).val(formatMoney(cantidad));
		actualizaProfitUtilidadCalculadora();
    actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_suministrosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_suministrosCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_suministrosCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_suministrosCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_suministrosCalculadora).val()) / deformatMoney($('#'+id_costo_suministrosCalculadora).val());
	$('#'+id_utilidad_suministrosCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_suministrosCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_suministrosCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_suministrosCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_suministrosCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_suministrosCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_suministrosCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_suministrosCalculadora).val(formatMoney($('#'+id_utilidadCantidad_suministrosCalculadora).val()));
	}
});

$('#'+id_utilidad_copeoCalculadora).change(function (){
		if($('#'+id_utilidad_copeoCalculadora).val() == ""){
			$('#'+id_utilidad_copeoCalculadora).val(formatMoney(0));
		}
		var cantidad = deformatMoney($('#'+id_costo_copeoCargaCalculadora).val()) * deformatMoney($('#'+id_utilidad_copeoCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_copeoCalculadora).val(formatMoney(cantidad));
		actualizaProfitUtilidadCalculadora();
    actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_copeoCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_copeoCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_copeoCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_copeoCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_copeoCalculadora).val()) / deformatMoney($('#'+id_costo_copeoCargaCalculadora).val());
	$('#'+id_utilidad_copeoCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_copeoCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_copeoCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_copeoCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_copeoCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_copeoCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_copeoCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_copeoCalculadora).val(formatMoney($('#'+id_utilidadCantidad_copeoCalculadora).val()));
	}
});

$('#'+id_utilidad_proyectosCalculadora).change(function (){
		if($('#'+id_utilidad_proyectosCalculadora).val() == ""){
			$('#'+id_utilidad_proyectosCalculadora).val(formatMoney(0));
		}
		var cantidad = deformatMoney($('#'+id_costo_proyectoCalculadora).val()) * deformatMoney($('#'+id_utilidad_proyectosCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_proyectosCalculadora).val(formatMoney(cantidad));
		actualizaProfitUtilidadCalculadora();
    actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_proyectosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_proyectosCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_proyectosCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_proyectosCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_proyectosCalculadora).val()) / deformatMoney($('#'+id_costo_proyectoCalculadora).val());
	$('#'+id_utilidad_proyectosCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_proyectosCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_proyectosCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_proyectosCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_proyectosCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_proyectosCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_proyectosCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_proyectosCalculadora).val(formatMoney($('#'+id_utilidadCantidad_proyectosCalculadora).val()));
	}
});

$('#'+id_utilidad_desplegadaCalculadora).change(function (){
		if($('#'+id_utilidad_desplegadaCalculadora).val() == ""){
			$('#'+id_utilidad_desplegadaCalculadora).val(formatMoney(0));
		}
		actualizaProfitUtilidadCalculadora();
    actualizaPrecioVentaCalculadora();
		actualizaUtilidadDesplegadaCantidadCalculadora();
});

$('#'+id_utilidadCantidad_desplegadaCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_desplegadaCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_desplegadaCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_desplegadaCalculadora).val(formatMoney(0));
	}
	var precio = deformatMoney($('#'+id_costo_copeoCargaCalculadora).val()) + deformatMoney($('#'+id_costo_suministrosCalculadora).val()) + deformatMoney($('#'+id_costo_proyectoCalculadora).val());
	precio = precio + deformatMoney($('#'+id_utilidadCantidad_copeoCalculadora).val()) + deformatMoney($('#'+id_utilidadCantidad_suministrosCalculadora).val()) + deformatMoney($('#'+id_utilidadCantidad_proyectosCalculadora).val());
	precio = precio + deformatMoney($('#'+id_utilidadCantidad_desplegadaCalculadora).val());
	var cantidad = precio - deformatMoney($('#'+id_costo_operacionesCalculadora).val());
	$('#' + id_profit_cantidadCalculadora).val(formatMoney(cantidad));
	actualizaPrecioVentaCalculadora();
	actualizaPorcentajeProfitCalculadora();
	actualizaUtilidadDesplegadaCalculadora();
});

$('#'+id_utilidadCantidad_desplegadaCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_desplegadaCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_desplegadaCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_desplegadaCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_desplegadaCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_desplegadaCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_desplegadaCalculadora).val(formatMoney($('#'+id_utilidadCantidad_desplegadaCalculadora).val()));
	}
});

// -------------------------------- PROFIT  ------------------------------------

$('#'+id_profit_cantidadCalculadora ).keypress(function(e){
    charactersAllowed("-0123456789.",e);
});

$('#'+id_profit_cantidadCalculadora ).change(function (){
		if($('#'+id_profit_cantidadCalculadora).val() == ""){
			$('#'+id_profit_cantidadCalculadora).val(formatMoney(0));
		}
		cantProfitManda = true;
		actualizaPorcentajeProfitCalculadora();
		actualizaPrecioVentaCalculadora();
		actualizaUtilidadDesplegadaCalculadora();
		actualizaUtilidadDesplegadaCantidadCalculadora();
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
		actualizaCantidadProfitCalculadora();
		actualizaPrecioVentaCalculadora();
		actualizaUtilidadDesplegadaCalculadora();
		actualizaUtilidadDesplegadaCantidadCalculadora();
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
	//highLight(id_profit_cantidadCalculadora);
	actualizaPorcentajeProfitCalculadora();
	actualizaUtilidadDesplegadaCalculadora();
	actualizaUtilidadDesplegadaCantidadCalculadora();
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
		porcentajeIndirectosManda = true;
		actualizaResultadosCalculadora();
});

$('#'+id_costos_indirectosCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costos_indirectosCalculadora).change(function (){
	if($('#'+id_costos_indirectosCalculadora).val() == ""){
		$('#'+id_costos_indirectosCalculadora).val(formatMoney(0));
	}
	porcentajeIndirectosManda = false;
	actualizaResultadosCalculadora();
});

$('#'+id_costos_indirectosCalculadora).focus(function (){
	if($('#'+id_costos_indirectosCalculadora  ).val() !== ""){
		$('#'+id_costos_indirectosCalculadora  ).val(deformatMoney($('#'+id_costos_indirectosCalculadora ).val()));
	}
});

$('#'+id_costos_indirectosCalculadora).focusout(function (){
	if($('#'+id_costos_indirectosCalculadora).val() !== ""){
		$('#'+id_costos_indirectosCalculadora).val(formatMoney($('#'+id_costos_indirectosCalculadora).val()));
	}
});

// ----------------------- VALIDACIONES ------------------------------------
function validateFormCalculadora(){
	if ($('#' + id_ddl_obraCalculadora).val() == ""){
			alert("Selecciona la obra");
			highLightColor(id_ddl_obraCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_indirectosCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_horaProyectoCalculadora).val() == ""){
			alert("Ingresa costo por hora de proyectos");
			highLightColor(id_costo_horaProyectoCalculadora,"#FF0000");
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
	} else if ($('#' + id_cargaSocialCalculadora).val() == ""){
			alert("Ingresa porcentaje de impuestos a la mano de obra");
			highLightColor(id_cargaSocialCalculadora,"#FF0000");
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
  $('#' + id_ddl_obraCalculadora).val("");
  resetFormCalculadora_subproceso();
}

function resetFormCalculadora_subproceso(){
  $('#' + id_horas_proyectoCalculadora ).val("");
  $('#' + id_costo_horaProyectoCalculadora).val("");
  $('#' + id_costo_proyectoCalculadora ).val("");
  $('#' + id_costo_copeoCalculadora).val("");
  $('#' + id_cargaSocialCalculadora).val("");
  $('#' + id_costo_copeoCargaCalculadora).val("");
  $('#' + id_costo_extraCopeoCalculadora).val("");
	$('#' + id_costo_suministrosCalculadora).val("");
	$('#' + id_costos_produccionCalculadora).val("");
  $('#' + id_costos_indirectosCalculadora).val("");
	$('#' + id_costo_operacionesCalculadora).val("");
	$('#' + id_indirectosCalculadora).val("");
	$('#' + id_utilidad_copeoCalculadora).val("");
  $('#' + id_utilidad_proyectosCalculadora).val("");
  $('#' + id_utilidad_desplegadaCalculadora).val("");
  $('#' + id_utilidad_suministrosCalculadora).val("");
	$('#' + id_utilidadCantidad_copeoCalculadora).val("");
  $('#' + id_utilidadCantidad_proyectosCalculadora).val("");
  $('#' + id_utilidadCantidad_desplegadaCalculadora).val("");
  $('#' + id_utilidadCantidad_suministrosCalculadora).val("");
  $('#' + id_profit_cantidadCalculadora).val("");
  $('#' + id_profit_porcentajeCalculadora).val("");
  $('#' + id_precio_ventaCalculadora).val("");
}

function returnToDefaultCalculadora(){
  $('#' + id_costo_horaProyectoCalculadora).val(formatMoney(1300));
  $('#' + id_indirectosCalculadora).val(20);
  $('#' + id_cargaSocialCalculadora).val(54);
	highLight(id_costo_horaProyectoCalculadora);
	highLight(id_indirectosCalculadora);
	highLight(id_cargaSocialCalculadora);
}

function calculaCostoOperacionalCalculadora(){
	var costoProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoCalculadora).val()));
	var costoSuministros = parseFloat(deformatMoney($('#'+id_costo_suministrosCalculadora).val()));
	var costoPrecopeo = parseFloat(deformatMoney($('#'+id_costo_copeoCalculadora).val()));
	var costoPrecopeoExtra = parseFloat(deformatMoney($('#'+id_costo_extraCopeoCalculadora).val()));
	var porcIndirectos = parseFloat(deformatMoney($('#'+id_indirectosCalculadora).val()));
	var porcCargaSocial = parseFloat(deformatMoney($('#'+id_cargaSocialCalculadora).val()));
	var costosIndirectos = parseFloat(deformatMoney($('#'+id_costos_indirectosCalculadora).val()));
	var costoProduccion = costoProyecto + costoSuministros + (costoPrecopeo*(1 + porcCargaSocial*0.01)+costoPrecopeoExtra);
	if(porcentajeIndirectosManda){
		costosIndirectos = costoProduccion*(porcIndirectos*0.01);
		$('#' + id_costos_indirectosCalculadora).val(formatMoney(costosIndirectos));
	} else {
		if(costoProduccion == 0){
			$('#' + id_indirectosCalculadora).val("");
		}else{
			porcIndirectos = 100 * costosIndirectos / costoProduccion;
			$('#' + id_indirectosCalculadora).val(parseFloat(porcIndirectos).toFixed(2));
		}
	}
	var costoOperacion = costoProduccion + costosIndirectos;
	$('#' + id_costos_produccionCalculadora).val(formatMoney(costoProduccion));
	$('#' + id_costo_operacionesCalculadora).val(formatMoney(costoOperacion));
	//highLight(id_costo_operacionesCalculadora);
	//highLight(id_costos_indirectosCalculadora);
}

function calculaProyecto(){
	if (horasProyectoManda){
		calculaCostoXHoraProyectoCalculadora();
	}else{
		calculaHorasProyectoCalculadora();
	}
}

function calculaHorasProyectoCalculadora(){
	var horasProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_horaProyectoCalculadora).val()));
	var horasFixed = horasProyecto.toFixed(2);
	$('#'+id_horas_proyectoCalculadora).val(horasFixed);
	highLight(id_horas_proyectoCalculadora);
	if (horasProyecto-horasFixed !== 0){
		horasActualizadas=true;
		var costoProyecto = horasFixed * parseFloat(deformatMoney($('#'+id_costo_horaProyectoCalculadora).val()));
		$('#'+id_costo_proyectoCalculadora).val(formatMoney(costoProyecto));
		highLight(id_costo_proyectoCalculadora);
	}
}

function calculaCostoXHoraProyectoCalculadora(){
	var costoHora = parseFloat($('#'+id_costo_proyectoCalculadora).val()) / parseFloat(deformatMoney($('#'+id_horas_proyectoCalculadora).val()));
	$('#'+id_costo_horaProyectoCalculadora).val(formatMoney(costoHora));
	highLight(id_costo_horaProyectoCalculadora);
}

function calculaCostoProyectoCalculadora(){
	var costoProyecto = parseFloat($('#'+id_horas_proyectoCalculadora).val()) * parseFloat(deformatMoney($('#'+id_costo_horaProyectoCalculadora).val()));
	$('#'+id_costo_proyectoCalculadora).val(formatMoney(costoProyecto));
	highLight(id_costo_proyectoCalculadora);
}

function actualizaProfit(){
	actualizaProfitUtilidadCalculadora();
	/*
	if (cantProfitManda){
		actualizaPorcentajeProfitCalculadora();
	}else{
		actualizaCantidadProfitCalculadora();
	}
	*/
}

function actualizaCantidadProfitCalculadora(){
	if($('#'+id_profit_porcentajeCalculadora).val() !== "" ){
		var cantProfit = parseFloat(deformatMoney($('#'+id_profit_porcentajeCalculadora).val())) * parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val())) * 0.01;
		$('#'+id_profit_cantidadCalculadora).val(formatMoney(cantProfit));
		//highLight(id_profit_cantidadCalculadora);
	}
}

function actualizaPorcentajeProfitCalculadora(){
	if($('#'+id_profit_cantidadCalculadora).val() !== "" ){
		if (deformatMoney($('#'+id_profit_cantidadCalculadora).val()) == 0 && deformatMoney($('#'+id_costo_operacionesCalculadora).val()) == 0){
			var porcProfit = 0;
		}else {
			var porcProfit = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val())) * 100;
		}
		$('#'+id_profit_porcentajeCalculadora).val(porcProfit.toFixed(2));
		//highLight(id_profit_porcentajeCalculadora);
	}
}

function actualizaProfitUtilidadCalculadora(){
  var costoSuministros = $('#'+id_costo_suministrosCalculadora).val()==""?0:deformatMoney($('#'+id_costo_suministrosCalculadora).val());
  var costoCopeo = $('#'+id_costo_copeoCargaCalculadora).val()==""?0:deformatMoney($('#'+id_costo_copeoCargaCalculadora).val());
  var costoProyecto = $('#'+id_costo_proyectoCalculadora).val()==""?0:deformatMoney($('#'+id_costo_proyectoCalculadora).val());
  var utilidadSuministros = $('#'+id_utilidad_suministrosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_suministrosCalculadora).val());
  var utilidadCopeo = $('#'+id_utilidad_copeoCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_copeoCalculadora).val());
  var utilidadProyecto = $('#'+id_utilidad_proyectosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_proyectosCalculadora).val());
  var utilidadGlobal = $('#'+id_utilidad_desplegadaCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_desplegadaCalculadora).val());
  var ingresoSuministros = costoSuministros * (1 + utilidadSuministros * 0.01);
  var ingresoCopeo = costoCopeo * (1 + utilidadCopeo * 0.01);
  var ingresoProyecto = costoProyecto * (1 + utilidadProyecto * 0.01);
  var cantProfit = (ingresoSuministros + ingresoCopeo + ingresoProyecto)*(1 + utilidadGlobal * 0.01) - deformatMoney($('#'+id_costo_operacionesCalculadora).val());
  $('#'+id_profit_cantidadCalculadora).val(formatMoney(cantProfit));
  actualizaPorcentajeProfitCalculadora();
  // actualizaPrecioVentaCalculadora();
}

function actualizaUtilidadDesplegadaCalculadora(){
	var costoSuministros = $('#'+id_costo_suministrosCalculadora).val()==""?0:deformatMoney($('#'+id_costo_suministrosCalculadora).val());
  var costoCopeo = $('#'+id_costo_copeoCargaCalculadora).val()==""?0:deformatMoney($('#'+id_costo_copeoCargaCalculadora).val());
  var costoProyecto = $('#'+id_costo_proyectoCalculadora).val()==""?0:deformatMoney($('#'+id_costo_proyectoCalculadora).val());
  var utilidadSuministros = $('#'+id_utilidad_suministrosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_suministrosCalculadora).val());
  var utilidadCopeo = $('#'+id_utilidad_copeoCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_copeoCalculadora).val());
  var utilidadProyecto = $('#'+id_utilidad_proyectosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_proyectosCalculadora).val());
  var utilidadGlobal = $('#'+id_utilidad_desplegadaCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_desplegadaCalculadora).val());
  var ingresoSuministros = costoSuministros * (1 + utilidadSuministros * 0.01);
  var ingresoCopeo = costoCopeo * (1 + utilidadCopeo * 0.01);
  var ingresoProyecto = costoProyecto * (1 + utilidadProyecto * 0.01);
	var desplegada = 100*((deformatMoney($('#'+id_precio_ventaCalculadora).val())/(ingresoSuministros + ingresoCopeo + ingresoProyecto))-1);
	$('#'+id_utilidad_desplegadaCalculadora).val(parseFloat(desplegada).toFixed(2));
}

function actualizaUtilidadDesplegadaCantidadCalculadora(){
	var costoSuministros = $('#'+id_costo_suministrosCalculadora).val()==""?0:deformatMoney($('#'+id_costo_suministrosCalculadora).val());
  var costoCopeo = $('#'+id_costo_copeoCargaCalculadora).val()==""?0:deformatMoney($('#'+id_costo_copeoCargaCalculadora).val());
  var costoProyecto = $('#'+id_costo_proyectoCalculadora).val()==""?0:deformatMoney($('#'+id_costo_proyectoCalculadora).val());
  var utilidadSuministros = $('#'+id_utilidad_suministrosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_suministrosCalculadora).val());
  var utilidadCopeo = $('#'+id_utilidad_copeoCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_copeoCalculadora).val());
  var utilidadProyecto = $('#'+id_utilidad_proyectosCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_proyectosCalculadora).val());
  var utilidadGlobal = $('#'+id_utilidad_desplegadaCalculadora).val()==""?0:parseFloat($('#'+id_utilidad_desplegadaCalculadora).val());
  var ingresoSuministros = costoSuministros * (1 + utilidadSuministros * 0.01);
  var ingresoCopeo = costoCopeo * (1 + utilidadCopeo * 0.01);
  var ingresoProyecto = costoProyecto * (1 + utilidadProyecto * 0.01);
	var cantidad = deformatMoney($('#'+id_precio_ventaCalculadora).val())-(ingresoSuministros + ingresoCopeo + ingresoProyecto);
	$('#'+id_utilidadCantidad_desplegadaCalculadora).val(formatMoney(cantidad));
}

function actualizaPrecioVentaCalculadora(){
	if($('#' + id_costo_operacionesCalculadora).val() !== "" && $('#' + id_profit_cantidadCalculadora).val() !== ""){
		var precioTotal = parseFloat(deformatMoney($('#'+id_profit_cantidadCalculadora).val())) + parseFloat(deformatMoney($('#'+id_costo_operacionesCalculadora).val()));
		$('#'+id_precio_ventaCalculadora ).val(formatMoney(precioTotal));
		//highLight(id_precio_ventaCalculadora);
	}
}

function actualizaUtilidadesCalculadora(){
  var cantidad = deformatMoney($('#'+id_costo_proyectoCalculadora).val()) * deformatMoney($('#'+id_utilidad_proyectosCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_proyectosCalculadora).val(formatMoney(cantidad));
  cantidad = deformatMoney($('#'+id_costo_copeoCargaCalculadora).val()) * deformatMoney($('#'+id_utilidad_copeoCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_copeoCalculadora).val(formatMoney(cantidad));
  cantidad = deformatMoney($('#'+id_costo_suministrosCalculadora).val()) * deformatMoney($('#'+id_utilidad_suministrosCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_suministrosCalculadora).val(formatMoney(cantidad));
}

function actualizaResultadosCalculadora(){
  calculaCostoOperacionalCalculadora();
  actualizaUtilidadesCalculadora();
  actualizaProfitUtilidadCalculadora();
  actualizaPrecioVentaCalculadora();
  actualizaUtilidadDesplegadaCantidadCalculadora();
}

function actualizaCopeoCalculadora(){
	if(copeoManda){
		actualizaCopeoCargaSocial();
	}else {
		actualizaCopeoBrutoCalculadora();
	}
}

function actualizaCopeoBrutoCalculadora(){
	if($('#'+id_costo_copeoCargaCalculadora).val() !== "" ){
		var copeoBruto = parseFloat(deformatMoney($('#'+id_costo_copeoCargaCalculadora).val())-deformatMoney($('#'+id_costo_extraCopeoCalculadora).val())) / (1 + (parseFloat(deformatMoney($('#'+id_cargaSocialCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoCalculadora).val(formatMoney(copeoBruto));
		highLight(id_costo_copeoCalculadora);
	}
}

function actualizaCopeoCargaSocial(){
	if($('#'+id_costo_copeoCalculadora).val() !== "" ){
		var copeoCarga = deformatMoney($('#'+id_costo_copeoCalculadora).val()) * (1 + (deformatMoney($('#'+id_cargaSocialCalculadora).val()) * 0.01)) + deformatMoney($('#'+id_costo_extraCopeoCalculadora).val());
		$('#'+ id_costo_copeoCargaCalculadora).val(formatMoney(copeoCarga));
		highLight(id_costo_copeoCargaCalculadora);
	}
}

function cargaCamposCalculadora(claveObra){
	firebase.database().ref(rama_bd_obras + "/presupuesto/" + claveObra + "/general").once('value',function(snapshot){
    if (snapshot.exists()){
			var obra = snapshot.val();
			registro_antiguo = obra;
      var costoProyecto = obra.proyecto.horas*obra.proyecto.costo_hora;
			var costoCopeo = obra.copeo.costo*(1 + obra.copeo.carga_social*0.01) + obra.copeo.extras;
			var costoProduccion = costoProyecto + obra.suministros.costo + costoCopeo;
      var costoOperacion = costoProduccion + obra.costos_indirectos;
      var utilidadPorcentaje = 100 * obra.utilidad_cantidad / costoOperacion ;
			var copeoConCarga = obra.copeo.costo * (1+obra.copeo.carga_social*0.01) + obra.copeo.extras;
			var indirectosPorcentaje = 100 * obra.costos_indirectos / costoProduccion;
			var uProyectos = obra.proyecto.utilidad * costoProyecto * 0.01;
			var uSuministros = obra.suministros.costo * obra.suministros.utilidad * 0.01;
			var uCopeo =  costoCopeo * obra.copeo.utilidad * 0.01;

			$('#' + id_horas_proyectoCalculadora ).val(obra.proyecto.horas);
			$('#' + id_costo_horaProyectoCalculadora).val(formatMoney(obra.proyecto.costo_hora));
			$('#' + id_costo_proyectoCalculadora).val(formatMoney(costoProyecto));
	    $('#' + id_costo_suministrosCalculadora).val(formatMoney(obra.suministros.costo));
	    $('#' + id_costo_copeoCalculadora).val(formatMoney(obra.copeo.costo));
			$('#' + id_cargaSocialCalculadora).val(obra.copeo.carga_social);
	    $('#' + id_costo_extraCopeoCalculadora).val(formatMoney(obra.copeo.extras));
			$('#' + id_costo_copeoCargaCalculadora).val(formatMoney(copeoConCarga));
	    $('#' + id_utilidad_copeoCalculadora).val(obra.copeo.utilidad);
	    $('#' + id_utilidad_proyectosCalculadora).val(obra.proyecto.utilidad);
	    $('#' + id_utilidad_suministrosCalculadora).val(obra.suministros.utilidad);
	    $('#' + id_utilidad_desplegadaCalculadora).val(obra.utilidad_global);
			$('#' + id_utilidadCantidad_copeoCalculadora).val(formatMoney(uCopeo));
	    $('#' + id_utilidadCantidad_proyectosCalculadora).val(formatMoney(uProyectos));
	    $('#' + id_utilidadCantidad_suministrosCalculadora).val(formatMoney(uSuministros));
	    $('#' + id_profit_cantidadCalculadora).val(formatMoney(obra.utilidad_cantidad));
			$('#' + id_profit_porcentajeCalculadora).val(parseFloat(utilidadPorcentaje).toFixed(2));
	    $('#' + id_precio_ventaCalculadora).val(formatMoney(obra.precio_venta));
	    $('#' + id_costos_produccionCalculadora).val(formatMoney(costoProduccion));
			$('#' + id_costo_operacionesCalculadora).val(formatMoney(costoOperacion));
			$('#' + id_costos_indirectosCalculadora).val(formatMoney(obra.costos_indirectos));
			$('#' + id_indirectosCalculadora).val(indirectosPorcentaje);
			actualizaUtilidadDesplegadaCantidadCalculadora();

			cantProfitManda = true;
		  horasProyectoManda = true;
		  copeoManda = true
			porcentajeIndirectosManda = false;
		  horasActualizadas = false;
    } else {
			resetFormCalculadora_subproceso();
			registro_antiguo = '';
		}
  });
}

function datosCalculadora (){
	var datos = {
		suministros: {
			costo: deformatMoney($('#'+id_costo_suministrosCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_suministrosCalculadora).val()),
		},
		proyecto:{
			horas: $('#'+id_horas_proyectoCalculadora).val(),
			costo_hora: deformatMoney($('#'+id_costo_horaProyectoCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_proyectosCalculadora).val()),
		},
		copeo:{
			costo: deformatMoney($('#'+id_costo_copeoCalculadora).val()),
			carga_social: $('#'+id_cargaSocialCalculadora).val(),
			extras: deformatMoney($('#'+id_costo_extraCopeoCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_copeoCalculadora).val()),
		},
		costos_indirectos: deformatMoney($('#'+id_costos_indirectosCalculadora).val()),
		utilidad_global: deformatMoney($('#'+id_utilidad_desplegadaCalculadora).val()),
		utilidad_cantidad: deformatMoney($('#'+id_profit_cantidadCalculadora).val()),
		precio_venta: deformatMoney($('#'+id_precio_ventaCalculadora).val()),
	};
	return datos;
}

/*
$("#" + id_ddl_procesoCalculadora).change(function(){
  uid_proceso = $('#'+id_ddl_procesoCalculadora+" option:selected").val();
  llenaDdlSubprocesoCalculadora(uid_obra, uid_proceso);
});

$("#" + id_ddl_subprocesoCalculadora).change(function(){
  resetFormCalculadora_subproceso();
  uid_subproceso = $('#'+id_ddl_subprocesoCalculadora+" option:selected").val()
  cargaCamposCalculadora(uid_obra, uid_proceso, uid_subproceso);
});

function llenaDdlSubprocesoCalculadora(clave_obra, clave_proceso){
	console.log("Llenando ddl subproceso");
	$('#' + id_ddl_subprocesoCalculadora).empty();
  var select = document.getElementById(id_ddl_subprocesoCalculadora);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var proceso;
	var subproceso;
	//console.log(clave_obra);
	//console.log(clave_proceso);
  firebase.database().ref(rama_bd_obras + "/procesos/" + clave_obra + "/procesos/" + clave_proceso).once('value',function(snapshot){
			proceso = snapshot.val();
			//console.log(proceso);
			snapshot.child("subprocesos").forEach(function(snapchild){
				subproceso = snapchild.val();
	      if (snapchild.exists()){
	        if ($('#'+id_ddl_procesoCalculadora+" option:selected").val() == snapchild.key){
						if(proceso.num_subprocesos == 0 || subproceso.costo_suministros !== 0 || subproceso.precopeo !== 0 || subproceso.proyectos.horas_programadas !== 0 || subproceso.utilidad !== 0 || subproceso.precio_venta !== 0){
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
    firebase.database().ref(rama_bd_obras + "/procesos/" + uid_obra + "/procesos").once("value",function(snapshot){
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
						var validacion_corrupto = false;
            if(clave_proceso !== "ADIC" && clave_proceso !== "MISC" && clave_proceso !== "PC00"){
                procesoSnap.child("subprocesos").forEach(function(subprocesoSnap){
									//console.log(subprocesoSnap.val());
									var clave_sub = subprocesoSnap.key;
	                var subproceso = subprocesoSnap.val();
									var costoProyecto = subproceso.proyectos.horas_programadas*subproceso.proyectos.costo_hora;
						      var costoOperacion = (costoProyecto + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(1+ subproceso.porcentaje_indirectos*0.01);
									var costoOperacionIndirectos = (costoProyecto + subproceso.costo_suministros + (subproceso.precopeo*(1 + subproceso.porcentaje_impuestos*0.01)))*(subproceso.porcentaje_indirectos*0.01);
									var precopeoCarga = subproceso.precopeo * (1+subproceso.porcentaje_impuestos*0.01);
									var utilidad_porcentaje = (subproceso.utilidad / costoOperacion * 100).toFixed(2);
									if(subproceso.utilidad==0 && costoOperacion == 0){
										utilidad_porcentaje = 0;
									} else {
										utilidad_porcentaje = (subproceso.utilidad / costoOperacion * 100).toFixed(2);
									}

									costoScore_proceso=costoScore_proceso+costoProyecto;
									precopeoCarga_proceso=precopeoCarga_proceso+precopeoCarga;
									suministros_proceso=suministros_proceso+subproceso.costo_suministros;
									indirectos_proceso=indirectos_proceso+costoOperacionIndirectos;
									operacion_proceso=operacion_proceso+costoOperacion;
									utilidad_proceso=utilidad_proceso+subproceso.utilidad;
									venta_proceso=venta_proceso+subproceso.precio_venta;

									if (clave_sub !== clave_proceso){
										datos_obra[index+cont]=[
											uid_obra,
											clave_proceso,
											clave_sub,
											subproceso.proyectos.horas_programadas,
											formatMoney(subproceso.proyectos.costo_hora),
											formatMoney(costoProyecto),
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
											"<button type='button' class='editarCalculadora btn btn-info'><i class='fas fa-edit'></i></button>"
										];
										cont++;
									} else {
										if( num_subp == 0 || subproceso.costo_suministros !== 0 || subproceso.precopeo !== 0 || subproceso.proyectos.horas_programadas !== 0 || subproceso.utilidad !== 0 || subproceso.precio_venta !== 0){
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
												"<button type='button' class='editarCalculadora btn btn-info'><i class='fas fa-edit'></i></button>"
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
												""
											];
										}
									}
              });
							index=index + cont;
            }
        });
				//console.log(procesoIndex_array);
        tabla_calculadora = $('#'+ id_dataTable_calculadora).DataTable({
						"fnRowCallback": function (row, data, index_table) {
									if ( procesoIndex_array.includes(index_table)) {
											$(row).css('font-weight', 'bold');;
									}
						},
            destroy: true,
            data: datos_obra,
            language: idioma_espanol,
						"paging":false,
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
    });
}

$(document).on('click','.editarCalculadora', function(){
  //console.log("Editar");
	var data = tabla_calculadora.row( $(this).parents('tr') ).data();
	resetFormCalculadora_subproceso();
	if (data[1] == data[2]){
		cargaCamposCalculadora(data[0], data[1], data[2]);
	}else{
		$('#' + id_horas_proyectoCalculadora ).val(data[3]);
		$('#' + id_costo_horaProyectoCalculadora).val(data[4]);
		$('#' + id_costo_proyectoCalculadora).val(data[5]);
		$('#' + id_costo_suministrosCalculadora).val(data[9]);
		$('#' + id_costo_copeoCalculadora).val(data[6]);
		$('#' + id_costo_copeoCargaCalculadora).val(data[7]);
		$('#' + id_profit_cantidadCalculadora).val(data[13]);
		$('#' + id_profit_porcentajeCalculadora).val(data[14]);
		$('#' + id_precio_ventaCalculadora).val(data[15]);
		$('#' + id_costo_operacionesCalculadora).val(data[12]);
		$('#' + id_costos_indirectosCalculadora).val(data[10]);

		$('#' + id_indirectosCalculadora).val(data[11]);
		$('#' + id_cargaSocialCalculadora).val(data[8]);
	}
	uid_obra = data[0];
	uid_proceso = data[1];
	uid_subproceso = data[2];
	$("#" + id_ddl_obraCalculadora).val(uid_obra);
	$("#" + id_ddl_procesoCalculadora).val(uid_proceso);
	llenaDdlSubprocesoCalculadora(uid_obra, uid_proceso);
	$("#" + id_ddl_subprocesoCalculadora).val(uid_subproceso);
	horasProyectoManda = true;
	cantProfitManda = true;
	copeoManda = true;
});
*/
