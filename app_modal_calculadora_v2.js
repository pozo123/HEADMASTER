// ------------------ Campos Modal Calculadora --------------------------------
var id_modalCalculadora = "modalCalculadora";

var id_ddl_obraModalCalculadora = "obraDdlModalCalculadora";
var id_ddl_procesoModalCalculadora = "procesoDdlModalCalculadora";
var id_ddl_subprocesoModalCalculadora = "subprocesoDdlModalCalculadora";

var id_costo_horaProyectoModalCalculadora = "costoHoraScoreModalCalculadora";
var id_horas_proyectoModalCalculadora = "horasProyectoModalCalculadora";
var id_costo_proyectoModalCalculadora = "costoProyectoModalCalculadora";

var id_costo_copeoModalCalculadora = "costoCopeoModalCalculadora";
var id_costo_copeoCargaModalCalculadora = "costoCopeoCargaModalCalculadora";
var id_cargaSocialModalCalculadora = "impuestosModalCalculadora";
var id_costo_extraCopeoModalCalculadora = "costoExtraCopeoModalCalculadora";

var id_costo_suministrosModalCalculadora = "costoSuministrosModalCalculadora";

var id_costos_produccionModalCalculadora = "costosProduccionModalCalculadora";
var id_costo_operacionesModalCalculadora = "costoOperacionesModalCalculadora";
var id_costos_indirectosModalCalculadora = "costosIndirectosModalCalculadora";
var id_seccion_subprocesoModalCalculadora = "div_subprocesoModalCalculadora";
var id_indirectosModalCalculadora = "indirectosModalCalculadora";

var id_utilidad_suministrosModalCalculadora = "utilidadSuministrosModalCalculadora";
var id_utilidad_copeoModalCalculadora = "utilidadCopeoModalCalculadora";
var id_utilidad_proyectosModalCalculadora = "utilidadProyectosModalCalculadora";
var id_utilidad_desplegadaModalCalculadora = "utilidadDesplegadaModalCalculadora"

var id_utilidadCantidad_suministrosModalCalculadora = "utilidadCantidadSuministrosModalCalculadora";
var id_utilidadCantidad_copeoModalCalculadora = "utilidadCantidadCopeoModalCalculadora";
var id_utilidadCantidad_proyectosModalCalculadora = "utilidadCantidadProyectosModalCalculadora";
var id_utilidadCantidad_desplegadaModalCalculadora = "utilidadCantidadDesplegadaModalCalculadora"


var id_profit_cantidadModalCalculadora = "profitCantidadModalCalculadora";
var id_profit_porcentajeModalCalculadora = "profitPorcentajeModalCalculadora";
var id_precio_ventaModalCalculadora = "precioVentaModalCalculadora";

var id_reporte_modalCalculadora = "botonpdfModalCalculadora";
var id_agregar_modalCalculadora = "botonGuardarModalCalculadora";
var id_borrar_modalCalculadora = "botonBorrarModalCalculadora";
var id_default_modalCalculadora = "botonDefaultModalCalculadora";

var cantProfitManda;
var horasProyectoManda;
var copeoManda;
var horasActualizadas;
var json_modalCalculadora;
var todosDefaultCalculadora;
var info_calculadora;


// --------------------- Método de inicialización -----------------------------
function modalCalculadora(json_actuales, camposHabilitados, info_obra){
  cantProfitManda = true;
  horasProyectoManda = true;
  copeoManda = true
  porcentajeIndirectosManda = true;
  horasActualizadas = false;
  todosDefaultCalculadora = camposHabilitados;
  info_calculadora = info_obra;
  // pongo el texto para el on hover
	var texto_default = "Valores generalmente usados para el calculo de presupuestos: precio por hora del área de proyectos, impuestos para la mano de obra y el porcentaje de costos indirectos."
	$('#' + id_default_modalCalculadora).attr("data-content", texto_default);
	resetFormModalCalculadora();
  cargaCamposModalCalculadora(json_actuales);

  $('#' + id_costo_copeoModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_suministrosModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_copeoCargaModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_cargaSocialModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_costo_extraCopeoModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_profit_cantidadModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_profit_porcentajeModalCalculadora).prop('disabled', !camposHabilitados);
  $('#' + id_precio_ventaModalCalculadora).prop('disabled', !camposHabilitados);
  //returnToDefaultModalCalculadora();
  $('#' + id_modalCalculadora).modal('show');
}

// Función que se ejecuta cuando se cierra el modal calculadora
$('#' + id_modalCalculadora).on('hidden.bs.modal', function () {

})

$('#' + id_borrar_modalCalculadora).click(function(){
	resetFormModalCalculadora();
});

$('#' + id_agregar_modalCalculadora).click(function(){
	if(validateFormModalCalculadora()){
		//Actualizar los campos de la obra
    json_modalCalculadora = datosModalCalculadora();
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
		calculaCostoProyectoModalCalculadora();
		actualizaResultadosModalCalculadora();
	}
});

$('#' + id_reporte_modalCalculadora).click(function(){
  // var obra ={nombre:"NOMBRE OBRA", proceso:"NOMBRE PROCESO", subproceso: "NOMBRE SUBPROCESO"};
  var proyectos={horas: $('#'+id_horas_proyectoModalCalculadora).val(), precio:$('#'+id_costo_horaProyectoModalCalculadora).val(), costo:$('#'+id_costo_proyectoModalCalculadora).val(), utilidad: $('#'+id_utilidad_proyectosModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()) * (1 + $('#'+id_utilidad_proyectosModalCalculadora).val() * 0.01))};
  var copeo={copeo: formatMoney(deformatMoney($('#'+id_costo_copeoModalCalculadora).val())+deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val())), cargaSocial:$('#'+id_cargaSocialModalCalculadora).val(), costo:$('#'+id_costo_copeoCargaModalCalculadora).val(), utilidad: $('#'+id_utilidad_copeoModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()) * (1 + $('#'+id_utilidad_copeoModalCalculadora).val() * 0.01))};
  var suministros={costo:$('#'+id_costo_suministrosModalCalculadora).val(), utilidad: $('#'+id_utilidad_suministrosModalCalculadora).val(), cliente:formatMoney(deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()) * (1 + $('#'+id_utilidad_suministrosModalCalculadora).val() * 0.01))};
  var totales={costo:formatMoney(deformatMoney(proyectos.costo) + deformatMoney(copeo.costo) + deformatMoney(suministros.costo)), cliente:formatMoney(deformatMoney(proyectos.cliente) + deformatMoney(copeo.cliente) + deformatMoney(suministros.cliente))};
  totales["utilidad"] = formatMoney(deformatMoney(totales.cliente)-deformatMoney(totales.costo));
  var indirectos={porcentaje: $('#'+id_indirectosModalCalculadora).val(), costo:$('#'+id_costos_indirectosModalCalculadora).val()};
  var operaciones={utilidad: formatMoney(deformatMoney(totales.utilidad) - deformatMoney(indirectos.costo)), costo:$('#'+id_costo_operacionesModalCalculadora).val()};
  var utilidad={porcentaje:$('#'+id_utilidad_desplegadaModalCalculadora).val(), cantidad: $('#'+id_profit_cantidadModalCalculadora).val(), cliente: $('#'+id_precio_ventaModalCalculadora).val()};
  var docDescription = generaReporteCalculadora(info_calculadora, proyectos, copeo, suministros, totales, indirectos, operaciones, utilidad);
  var pdfDocGenerator = pdfMake.createPdf(docDescription);
  pdfDocGenerator.open();
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// ----------------------------------- SCORE  ---------------------------------------
$('#'+id_costo_horaProyectoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_horaProyectoModalCalculadora).change(function (){
		if($('#'+id_costo_horaProyectoModalCalculadora).val() == ""){
			$('#'+id_costo_horaProyectoModalCalculadora).val(formatMoney(0));
		}
		horasProyectoManda = false;
		calculaCostoProyectoModalCalculadora();
		actualizaResultadosModalCalculadora();
});

$('#'+id_costo_horaProyectoModalCalculadora).focus(function (){
	if($('#'+id_costo_horaProyectoModalCalculadora).val() !== ""){
		$('#'+id_costo_horaProyectoModalCalculadora).val(deformatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()));
	}
});

$('#'+id_costo_horaProyectoModalCalculadora).focusout(function (){
	if($('#'+id_costo_horaProyectoModalCalculadora).val() !== ""){
		$('#'+id_costo_horaProyectoModalCalculadora).val(formatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()));
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
	calculaCostoProyectoModalCalculadora();
	actualizaResultadosModalCalculadora();
	horasProyectoManda = true;
});

$('#'+id_costo_proyectoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_proyectoModalCalculadora).change(function (){
	if($('#'+id_costo_proyectoModalCalculadora).val() == ""){
		$('#'+id_costo_proyectoModalCalculadora).val(formatMoney(0));
	}
	calculaProyectoModalCalculadora();
	actualizaResultadosModalCalculadora();
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
		actualizaResultadosModalCalculadora();
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
	actualizaResultadosModalCalculadora();
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
	actualizaResultadosModalCalculadora();
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

$('#'+id_cargaSocialModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_cargaSocialModalCalculadora).change(function (){
		if($('#'+id_cargaSocialModalCalculadora).val() == ""){
			$('#'+id_cargaSocialModalCalculadora).val(0);
		}else{
			$('#'+id_cargaSocialModalCalculadora ).val(parseFloat($('#'+id_cargaSocialModalCalculadora).val()).toFixed(2));
		}
		actualizaCopeoModalCalculadora();
		actualizaResultadosModalCalculadora();
});

$('#'+id_costo_extraCopeoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costo_extraCopeoModalCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_costo_extraCopeoModalCalculadora).val() == ""){
		$('#'+id_costo_extraCopeoModalCalculadora).val(formatMoney(0));
	}
	actualizaCopeoModalCalculadora();
	actualizaResultadosModalCalculadora();
});

$('#'+id_costo_extraCopeoModalCalculadora).focus(function (){
	if($('#'+id_costo_extraCopeoModalCalculadora).val() !== ""){
		$('#'+id_costo_extraCopeoModalCalculadora).val(deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val()));
	}
});

$('#'+id_costo_extraCopeoModalCalculadora).focusout(function (){
	if($('#'+id_costo_extraCopeoModalCalculadora).val() !== ""){
		$('#'+id_costo_extraCopeoModalCalculadora).val(formatMoney($('#'+id_costo_extraCopeoModalCalculadora).val()));
	}
});

// ----------------------------------- PROFIT  ---------------------------------------
$('#'+id_utilidad_suministrosModalCalculadora).change(function (){
		if($('#'+id_utilidad_suministrosModalCalculadora).val() == ""){
			$('#'+id_utilidad_suministrosModalCalculadora).val(formatMoney(0));
		}
    var cantidad = deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_suministrosModalCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_suministrosModalCalculadora).val(formatMoney(cantidad));
		actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidadCantidad_suministrosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_suministrosModalCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_suministrosModalCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_suministrosModalCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_suministrosModalCalculadora).val()) / deformatMoney($('#'+id_costo_suministrosCalculadora).val());
	$('#'+id_utilidad_suministrosCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_suministrosModalCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_suministrosModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_suministrosModalCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_suministrosModalCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_suministrosModalCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_suministrosModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_suministrosModalCalculadora).val(formatMoney($('#'+id_utilidadCantidad_suministrosModalCalculadora).val()));
	}
});

$('#'+id_utilidad_copeoModalCalculadora).change(function (){
		if($('#'+id_utilidad_copeoModalCalculadora).val() == ""){
			$('#'+id_utilidad_copeoModalCalculadora).val(formatMoney(0));
		}
    var cantidad = deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_copeoModalCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_copeoModalCalculadora).val(formatMoney(cantidad));
		actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidadCantidad_copeoModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_copeoModalCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_copeoModalCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_copeoModalCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_copeoModalCalculadora).val()) / deformatMoney($('#'+id_costo_copeoCargaCalculadora).val());
	$('#'+id_utilidad_copeoModalCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_copeoModalCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_copeoModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_copeoModalCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_copeoModalCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_copeoModalCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_copeoModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_copeoModalCalculadora).val(formatMoney($('#'+id_utilidadCantidad_copeoModalCalculadora).val()));
	}
});

$('#'+id_utilidad_proyectosModalCalculadora).change(function (){
		if($('#'+id_utilidad_proyectosModalCalculadora).val() == ""){
			$('#'+id_utilidad_proyectosModalCalculadora).val(formatMoney(0));
		}
    var cantidad = deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_proyectosModalCalculadora).val()) * 0.01;
		$('#'+id_utilidadCantidad_proyectosModalCalculadora).val(formatMoney(cantidad));
    actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
});

$('#'+id_utilidadCantidad_proyectosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_proyectosModalCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_proyectosModalCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_proyectosModalCalculadora).val(formatMoney(0));
	}
	var porcentaje = 100 * deformatMoney($('#'+id_utilidadCantidad_proyectosModalCalculadora).val()) / deformatMoney($('#'+id_costo_proyectoModalCalculadora).val());
	$('#'+id_utilidad_proyectosModalCalculadora).val(porcentaje);
	actualizaProfitUtilidadCalculadora();
	actualizaPrecioVentaCalculadora();
});

$('#'+id_utilidadCantidad_proyectosModalCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_proyectosModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_proyectosModalCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_proyectosModalCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_proyectosModalCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_proyectosModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_proyectosModalCalculadora).val(formatMoney($('#'+id_utilidadCantidad_proyectosModalCalculadora).val()));
	}
});

$('#'+id_utilidad_desplegadaModalCalculadora).change(function (){
		if($('#'+id_utilidad_desplegadaModalCalculadora).val() == ""){
			$('#'+id_utilidad_desplegadaModalCalculadora).val(formatMoney(0));
		}
    actualizaProfitUtilidadModalCalculadora();
    actualizaPrecioVentaModalCalculadora();
    actualizaUtilidadDesplegadaCantidadModalCalculadora();
});

$('#'+id_utilidadCantidad_desplegadaModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_utilidadCantidad_desplegadaModalCalculadora).change(function (){
	//copeoManda = true;
	if($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val() == ""){
		$('#'+id_utilidadCantidad_desplegadaModalCalculadora).val(formatMoney(0));
	}
	var precio = deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()) + deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()) + deformatMoney($('#'+id_costo_proyectoModalCalculadora).val());
	precio = precio + deformatMoney($('#'+id_utilidadCantidad_copeoModalCalculadora).val()) + deformatMoney($('#'+id_utilidadCantidad_suministrosModalCalculadora).val()) + deformatMoney($('#'+id_utilidadCantidad_proyectosModalCalculadora).val());
	precio = precio + deformatMoney($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val());
	var cantidad = precio - deformatMoney($('#'+id_costo_operacionesModalCalculadora).val());
	$('#' + id_profit_cantidadModalCalculadora).val(formatMoney(cantidad));
	actualizaPrecioVentaModalCalculadora();
	actualizaPorcentajeProfitModalCalculadora();
	actualizaUtilidadDesplegadaModalCalculadora();
});

$('#'+id_utilidadCantidad_desplegadaModalCalculadora).focus(function (){
	if($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_desplegadaModalCalculadora).val(deformatMoney($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val()));
	}
});

$('#'+id_utilidadCantidad_desplegadaModalCalculadora).focusout(function (){
	if($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val() !== ""){
		$('#'+id_utilidadCantidad_desplegadaModalCalculadora).val(formatMoney($('#'+id_utilidadCantidad_desplegadaModalCalculadora).val()));
	}
});

 // ------------------------------- PROFIT ------------------------------------

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
    actualizaUtilidadDesplegadaModalCalculadora();
		actualizaUtilidadDesplegadaCantidadModalCalculadora();
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
    actualizaUtilidadDesplegadaModalCalculadora();
		actualizaUtilidadDesplegadaCantidadModalCalculadora();
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
  actualizaUtilidadDesplegadaModalCalculadora();
  actualizaUtilidadDesplegadaCantidadModalCalculadora();
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
    porcentajeIndirectosManda = true;
		actualizaResultadosModalCalculadora();
});

$('#'+id_costos_indirectosModalCalculadora).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costos_indirectosModalCalculadora).change(function (){
	if($('#'+id_costos_indirectosModalCalculadora).val() == ""){
		$('#'+id_costos_indirectosModalCalculadora).val(formatMoney(0));
	}
	porcentajeIndirectosManda = false;
	actualizaResultadosModalCalculadora();
});

$('#'+id_costos_indirectosModalCalculadora).focus(function (){
	if($('#'+id_costos_indirectosModalCalculadora  ).val() !== ""){
		$('#'+id_costos_indirectosModalCalculadora  ).val(deformatMoney($('#'+id_costos_indirectosModalCalculadora ).val()));
	}
});

$('#'+id_costos_indirectosModalCalculadora).focusout(function (){
	if($('#'+id_costos_indirectosModalCalculadora).val() !== ""){
		$('#'+id_costos_indirectosModalCalculadora).val(formatMoney($('#'+id_costos_indirectosModalCalculadora).val()));
	}
});


// ----------------------- VALIDACIONES ------------------------------------
function validateFormModalCalculadora(){
	if ($('#' + id_indirectosModalCalculadora).val() == ""){
			alert("Ingresa porcentaje de costos indirectos");
			highLightColor(id_indirectosModalCalculadora,"#FF0000");
			return false;
	} else if ($('#' + id_costo_horaProyectoModalCalculadora).val() == ""){
			alert("Ingresa costo por hora de proyectos");
			highLightColor(id_costo_horaProyectoModalCalculadora,"#FF0000");
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
	} else if ($('#' + id_cargaSocialModalCalculadora).val() == ""){
			alert("Ingresa porcentaje de impuestos a la mano de obra");
			highLightColor(id_cargaSocialModalCalculadora,"#FF0000");
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
  $('#' + id_costo_horaProyectoModalCalculadora).val("");
  $('#' + id_costo_proyectoModalCalculadora ).val("");
  $('#' + id_costo_suministrosModalCalculadora).val("");
  $('#' + id_costo_copeoModalCalculadora).val("");
  $('#' + id_cargaSocialModalCalculadora).val("");
  $('#' + id_costo_copeoCargaModalCalculadora).val("");
  $('#' + id_costo_extraCopeoModalCalculadora).val("");
  $('#' + id_costos_produccionModalCalculadora).val("");
  $('#' + id_costos_indirectosModalCalculadora).val("");
	$('#' + id_costo_operacionesModalCalculadora).val("");
  $('#' + id_indirectosModalCalculadora).val("");
  $('#' + id_utilidad_copeoModalCalculadora).val("");
  $('#' + id_utilidad_proyectosModalCalculadora).val("");
  $('#' + id_utilidad_desplegadaModalCalculadora).val("");
  $('#' + id_utilidad_suministrosModalCalculadora).val("");
  $('#' + id_utilidadCantidad_copeoModalCalculadora).val("");
  $('#' + id_utilidadCantidad_proyectosModalCalculadora).val("");
  $('#' + id_utilidadCantidad_desplegadaModalCalculadora).val("");
  $('#' + id_utilidadCantidad_suministrosModalCalculadora).val("");
  $('#' + id_profit_cantidadModalCalculadora).val("");
  $('#' + id_profit_porcentajeModalCalculadora).val("");
  $('#' + id_precio_ventaModalCalculadora).val("");
}

function returnToDefaultModalCalculadora(){
  $('#' + id_costo_horaProyectoModalCalculadora).val(formatMoney(1300));
  $('#' + id_indirectosModalCalculadora).val(20);
  if(todosDefaultCalculadora){
    $('#' + id_cargaSocialModalCalculadora).val(34);
    highLight(id_cargaSocialModalCalculadora);
  }
	highLight(id_costo_horaProyectoModalCalculadora);
	highLight(id_indirectosModalCalculadora);
}

function calculaCostoOperacionalModalCalculadora(){
	var costoProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()));
	var costoSuministros = parseFloat(deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()));
	var costoPrecopeo = parseFloat(deformatMoney($('#'+id_costo_copeoModalCalculadora).val()));
  var costoPrecopeoExtra = parseFloat(deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val()));
	var porcIndirectos = parseFloat(deformatMoney($('#'+id_indirectosModalCalculadora ).val()));
	var porcCargaSocial = parseFloat(deformatMoney($('#'+id_cargaSocialModalCalculadora ).val()));
  var costosIndirectos = parseFloat(deformatMoney($('#'+id_costos_indirectosModalCalculadora).val()));
  var costoProduccion = costoProyecto + costoSuministros + (costoPrecopeo*(1 + porcCargaSocial*0.01)+costoPrecopeoExtra);
  if(porcentajeIndirectosManda){
		costosIndirectos = costoProduccion*(porcIndirectos*0.01);
		$('#' + id_costos_indirectosModalCalculadora).val(formatMoney(costosIndirectos));
	} else {
		if(costoProduccion == 0){
			$('#' + id_indirectosModalCalculadora).val("");
		}else{
			porcIndirectos = 100 * costosIndirectos / costoProduccion;
			$('#' + id_indirectosModalCalculadora).val(parseFloat(porcIndirectos).toFixed(2));
		}
	}
	var costoOperacion = costoProduccion + costosIndirectos;
  $('#' + id_costos_produccionModalCalculadora).val(formatMoney(costoProduccion));
	$('#' + id_costo_operacionesModalCalculadora).val(formatMoney(costoOperacion));
	//highLight(id_costo_operacionesModalCalculadora);
	//highLight(id_costos_indirectosModalCalculadora);
}

function calculaProyectoModalCalculadora(){
	if (horasProyectoManda){
		calculaCostoXHoraProyectoModalCalculadora();
	}else{
		calculaHorasProyectoModalCalculadora();
	}
}

function calculaHorasProyectoModalCalculadora(){
	var horasProyecto = parseFloat(deformatMoney($('#'+id_costo_proyectoModalCalculadora).val())) / parseFloat(deformatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()));
	var horasFixed = horasProyecto.toFixed(2);
	$('#'+id_horas_proyectoModalCalculadora).val(horasFixed);
	highLight(id_horas_proyectoModalCalculadora);
	if (horasProyecto-horasFixed !== 0){
		horasActualizadas=true;
		var costoProyecto = horasFixed * parseFloat(deformatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()));
		$('#'+id_costo_proyectoModalCalculadora).val(formatMoney(costoProyecto));
		highLight(id_costo_proyectoModalCalculadora);
	}
}

function calculaCostoXHoraProyectoModalCalculadora(){
	var costoHora = parseFloat($('#'+id_costo_proyectoModalCalculadora).val()) / parseFloat(deformatMoney($('#'+id_horas_proyectoModalCalculadora).val()));
	$('#'+id_costo_horaProyectoModalCalculadora).val(formatMoney(costoHora));
	highLight(id_costo_horaProyectoModalCalculadora);
}

function calculaCostoProyectoModalCalculadora(){
	var costoProyecto = parseFloat($('#'+id_horas_proyectoModalCalculadora).val()) * parseFloat(deformatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()));
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

function actualizaUtilidadDesplegadaModalCalculadora(){
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
	var desplegada = 100*((deformatMoney($('#'+id_precio_ventaModalCalculadora).val())/(ingresoSuministros + ingresoCopeo + ingresoProyecto))-1);
	$('#'+id_utilidad_desplegadaModalCalculadora).val(parseFloat(desplegada).toFixed(2));
}

function actualizaUtilidadDesplegadaCantidadModalCalculadora(){
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
	var cantidad = deformatMoney($('#'+id_precio_ventaModalCalculadora).val())-(ingresoSuministros + ingresoCopeo + ingresoProyecto);
	$('#'+id_utilidadCantidad_desplegadaModalCalculadora).val(formatMoney(cantidad));
}

function actualizaPrecioVentaModalCalculadora(){
	if($('#' + id_costo_operacionesModalCalculadora).val() !== "" && $('#' + id_profit_cantidadModalCalculadora).val() !== ""){
		var precioTotal = parseFloat(deformatMoney($('#'+id_profit_cantidadModalCalculadora).val())) + parseFloat(deformatMoney($('#'+id_costo_operacionesModalCalculadora).val()));
		$('#'+id_precio_ventaModalCalculadora ).val(formatMoney(precioTotal));
		// highLight(id_precio_ventaModalCalculadora);
	}
}

function actualizaUtilidadesModalCalculadora(){
  var cantidad = deformatMoney($('#'+id_costo_proyectoModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_proyectosModalCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_proyectosModalCalculadora).val(formatMoney(cantidad));
  cantidad = deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_copeoModalCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_copeoModalCalculadora).val(formatMoney(cantidad));
  cantidad = deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()) * deformatMoney($('#'+id_utilidad_suministrosModalCalculadora).val()) * 0.01;
  $('#'+id_utilidadCantidad_suministrosModalCalculadora).val(formatMoney(cantidad));
}

function actualizaResultadosModalCalculadora(){
  calculaCostoOperacionalModalCalculadora();
  actualizaUtilidadesModalCalculadora();
  actualizaProfitUtilidadModalCalculadora();
  actualizaPrecioVentaModalCalculadora();
  actualizaUtilidadDesplegadaCantidadModalCalculadora();
}

// Costo extra nunca se actualiza automaticamente, siempre queda fijo.
function actualizaCopeoModalCalculadora(){
	if(copeoManda){
		actualizaCopeoCargaSocialModalCalculadora();
	}else {
		actualizaCopeoBrutoModalCalculadora();
	}
}

function actualizaCopeoBrutoModalCalculadora(){
	if($('#'+id_costo_copeoCargaModalCalculadora).val() !== "" ){
		var copeoBruto = parseFloat(deformatMoney($('#'+id_costo_copeoCargaModalCalculadora).val())-deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val())) / (1 + (parseFloat(deformatMoney($('#'+id_cargaSocialModalCalculadora).val())) * 0.01));
		$('#'+ id_costo_copeoModalCalculadora).val(formatMoney(copeoBruto));
		highLight(id_costo_copeoModalCalculadora);
	}
}

function actualizaCopeoCargaSocialModalCalculadora(){
  if($('#'+id_costo_copeoModalCalculadora).val() !== "" ){
		var copeoCarga = deformatMoney($('#'+id_costo_copeoModalCalculadora).val()) * (1 + (deformatMoney($('#'+id_cargaSocialModalCalculadora).val()) * 0.01)) + deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val());
		$('#'+ id_costo_copeoCargaModalCalculadora).val(formatMoney(copeoCarga));
		highLight(id_costo_copeoCargaModalCalculadora);
	}
}

function cargaCamposModalCalculadora(subproceso){
  if (!jQuery.isEmptyObject(subproceso)){
    var costoProyecto = parseFloat(subproceso.proyecto.horas)*parseFloat(subproceso.proyecto.costo_hora);
    var costoCopeo = parseFloat(subproceso.copeo.costo)*(1 + parseFloat(subproceso.copeo.carga_social)*0.01) + parseFloat(subproceso.copeo.extras);
    var costoProduccion = costoProyecto + parseFloat(subproceso.suministros.costo) + costoCopeo;
    var costoOperacion = costoProduccion + parseFloat(subproceso.costos_indirectos);
    var utilidadPorcentaje = 100 * parseFloat(subproceso.utilidad_cantidad) / costoOperacion;
    var indirectosPorcentaje = 100 * parseFloat(subproceso.costos_indirectos) / costoProduccion;
    var uProyectos = parseFloat(subproceso.proyecto.utilidad) * costoProyecto * 0.01;
    var uSuministros = parseFloat(subproceso.suministros.costo) * parseFloat(subproceso.suministros.utilidad) * 0.01;
    var uCopeo =  costoCopeo * parseFloat(subproceso.copeo.utilidad) * 0.01;
    var precio_venta = (costoProduccion + uProyectos + uSuministros + uCopeo)*(1 + parseFloat(subproceso.utilidad_global)*0.01);
    var utilidad = precio_venta - costoOperacion;

    $('#' + id_horas_proyectoModalCalculadora ).val(subproceso.proyecto.horas);
		$('#' + id_costo_horaProyectoModalCalculadora).val(formatMoney(subproceso.proyecto.costo_hora));
		$('#' + id_costo_proyectoModalCalculadora).val(formatMoney(costoProyecto));
    $('#' + id_costo_suministrosModalCalculadora).val(formatMoney(subproceso.suministros.costo));
    $('#' + id_costo_copeoModalCalculadora).val(formatMoney(subproceso.copeo.costo));
    $('#' + id_cargaSocialModalCalculadora).val(subproceso.copeo.carga_social);
    $('#' + id_costo_extraCopeoModalCalculadora).val(formatMoney(subproceso.copeo.extras));
		$('#' + id_costo_copeoCargaModalCalculadora).val(formatMoney(costoCopeo));
    $('#' + id_utilidad_copeoModalCalculadora).val(subproceso.copeo.utilidad);
    $('#' + id_utilidad_proyectosModalCalculadora).val(subproceso.proyecto.utilidad);
    $('#' + id_utilidad_suministrosModalCalculadora).val(subproceso.suministros.utilidad);
    $('#' + id_utilidad_desplegadaModalCalculadora).val(subproceso.utilidad_global);
    $('#' + id_utilidadCantidad_copeoModalCalculadora).val(formatMoney(uCopeo));
    $('#' + id_utilidadCantidad_proyectosModalCalculadora).val(formatMoney(uProyectos));
    $('#' + id_utilidadCantidad_suministrosModalCalculadora).val(formatMoney(uSuministros));
    $('#' + id_profit_cantidadModalCalculadora).val(formatMoney(utilidad));
		$('#' + id_profit_porcentajeModalCalculadora).val(utilidadPorcentaje.toFixed(2));
    $('#' + id_precio_ventaModalCalculadora).val(formatMoney(precio_venta));
    $('#' + id_costos_produccionModalCalculadora).val(formatMoney(costoProduccion));
		$('#' + id_costo_operacionesModalCalculadora).val(formatMoney(costoOperacion));
		$('#' + id_costos_indirectosModalCalculadora).val(formatMoney(subproceso.costos_indirectos));
    $('#' + id_indirectosModalCalculadora).val(indirectosPorcentaje);
    actualizaUtilidadDesplegadaCantidadModalCalculadora();

    cantProfitManda = true;
    horasProyectoManda = true;
    copeoManda = true
    porcentajeIndirectosManda = false;
    horasActualizadas = false;
  } else {
		resetFormModalCalculadora();
	}
}

function datosModalCalculadora (){
	var datos = {
		suministros: {
			costo: deformatMoney($('#'+id_costo_suministrosModalCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_suministrosModalCalculadora).val()),
		},
		proyecto:{
			horas: $('#'+id_horas_proyectoModalCalculadora).val(),
			costo_hora: deformatMoney($('#'+id_costo_horaProyectoModalCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_proyectosModalCalculadora).val()),
		},
		copeo:{
			costo: deformatMoney($('#'+id_costo_copeoModalCalculadora).val()),
			carga_social: $('#'+id_cargaSocialModalCalculadora).val(),
			extras: deformatMoney($('#'+id_costo_extraCopeoModalCalculadora).val()),
			utilidad: deformatMoney($('#'+id_utilidad_copeoModalCalculadora).val()),
		},
		costos_indirectos: deformatMoney($('#'+id_costos_indirectosModalCalculadora).val()),
		utilidad_global: deformatMoney($('#'+id_utilidad_desplegadaModalCalculadora).val()),
		utilidad_cantidad: deformatMoney($('#'+id_profit_cantidadModalCalculadora).val()),
		precio_venta: deformatMoney($('#'+id_precio_ventaModalCalculadora).val()),
	};
	return datos;
}
