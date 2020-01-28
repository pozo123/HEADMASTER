// ------------------ Campos Modal Suministros --------------------------------
// elementos generales de la pagina
var id_modalCopeo = "modalCopeo";

// elementos del form
var id_ddl_obraModalCopeo = "ddl_obraModalCopeo";
var id_ddl_procesoModalCopeo = "ddl_procesoModalCopeo";
var id_ddl_subprocesoModalCopeo = "ddl_subprocesoModalCopeo";
var id_ddl_entradaModalCopeo = "ddl_entradaModalCopeo";
var id_label_cargaSocialModalCopeo = "labelCargaSocialModalCopeo";
var id_carga_socialModalCopeo = "cargaSocialModalCopeo";
var id_diasModalCopeo = "diasModalCopeo";
var id_multModalCopeo = "multModalCopeo";
var id_nombreModalCopeo = "nombreModalCopeo";
var id_alcanceModalCopeo = "alcanceModalCopeo";
var id_lista_trabajadoresModalCopeo = "listaTrabajadoresModalCopeo";
var id_div_trabajadoresModalCopeo = "divTrabajadoresModalCopeo";
var id_costo_unitarioModalCopeo = "costoUnitarioModalCopeo";
var id_costo_copeoModalCopeo = "costoModalCopeo";
var id_costo_copeo_CSModalCopeo = "costoCSModalCopeo";
var id_div_totalCSModalCopeo = "divTotalCSModalCopeo";
var id_seccion_subprocesoModalCopeo = "div_subprocesoModalCopeo";
var id_extrasModalCopeo = "extrasModalCopeo";
var id_costoExtrasModalCopeo = "costoExtrasModalCopeo";
var id_multExtrasModalCopeo = "multExtrasModalCopeo";
var id_subtotalExtrasModalCopeo = "subtotalExtrasModalCopeo";
var id_totalExtrasModalCopeo = "totalExtrasModalCopeo";
var id_div_totalExtrasModalCopeo = "div_totalExtrasModalCopeo";

// botones del form
var id_agregar_modalCopeo = "botonAceptarModalCopeo";
var id_borrar_modalCopeo = "botonResetModalCopeo";
var id_sueldos_modalCopeo = "botonSueldosModalCopeo";

// variables auxiliares
var adicionalFlag; // determina si el el copeo de un adicional, para desplegar o no algunos elementos
var json_modalCopeo;

// --------------------- Método de inicialización -----------------------------
// Metodo de inicializacion del modal
function modalCopeo(json_modalCopeoRegistrado, adicional){
  adicionalFlag=adicional;
  puestos_array = [];
  json_modalCopeo = json_modalCopeoRegistrado;
  cargaListaTrabajadoresModalCopeo();
  llenaDdlEntradaModalCopeo();
  $('#' + id_modalCopeo).modal('show');
}

// Función que se ejecuta cuando se cierra el modal copeo
$('#' + id_modalCopeo).on('hidden.bs.modal', function () {
  if(flagCalculadora){
    setCopeoCalculadora();
  }
})

// Funcionalidad del boton 'Guardar'
$('#' + id_agregar_modalCopeo).click(function() {
  // Validar la informacion del formulario
  if(validateFormModalCopeo()){
    var uid_entrada;
    var nueva = false;
    //Determinar si es alta o modificación
    if($('#'+id_ddl_entradaModalCopeo+' option:selected').val() == "-NUEVA-"){
      num_entradas = num_entradas+1;
      json_modalCopeo["num_entradas"] = num_entradas;
      if(num_entradas<10){
        uid_entrada = "EN-0"+num_entradas;
      }else{
        uid_entrada = "EN-"+num_entradas;
      }
      nueva = true;
    } else {
      uid_entrada = $("#" + id_ddl_entradaModalCopeo + " option:selected").val();
    }
		//Actualizar los campos de la entrada
    if(parseFloat(uid_entrada.slice(3)) == 1){
      json_modalCopeo["impuestos"] = parseFloat($('#'+id_carga_socialModalCopeo).val());
    }
    //Generar el JSON de la entrada con los datos del formulario
    if(num_entradas == 1){
      json_modalCopeo["entradas"] = {};
    }
		json_modalCopeo["entradas"][uid_entrada] = datosEntradaModalCopeo();
    //console.log(json_modalCopeo);
		resetFormModalCopeo();
    llenaDdlEntradaModalCopeo();
    alert("¡Entrada registrada!");
	}
});

// Funcionalidad del boton 'Borrar'
$('#' + id_borrar_modalCopeo).click(function() {
  resetFormModalCopeo();
});

// Funcionalidad del boton 'Sueldos default'
$('#' + id_sueldos_modalCopeo).click(function() {
  for(key in puestos_json){
    $('#'+"sueldo_"+key).val(formatMoney(puestos_json[key]["sueldo"]));
  }
  calculaCostoDiarioModalCopeo();
  calculaCostoTotalModalCopeo();
  calculaCostosExtrasModalCopeo();
});

//------------------ FUNCIONES DEL FORMULARIO----------------------------------
// Metodo accionado cuando se selecciona una entrada
$("#" + id_ddl_entradaModalCopeo).change(function(){
  //uid_subproceso = $('#'+id_ddl_subprocesoModalCopeo+" option:selected").val()
  resetFormModalCopeo_entrada();
  cargaCamposModalCopeo($("#" + id_ddl_entradaModalCopeo+" option:selected").val() );
});

// Metodo accionado cuando se hace altera la seleccion de trabajadores
$('#' + id_lista_trabajadoresModalCopeo).change(function(){
    var array_html = selectTrabajadores.selected();
    var item;
    for (i = 0; i < puestos_array.length; i++) {
      item = puestos_array[i];
      if(array_html.includes(item)){
        $('#' + "row-"+item).removeClass('hidden');
      } else {
        $('#' + "row-"+item).addClass('hidden');
      }
    }
    calculaCostoDiarioModalCopeo();
    calculaCostoTotalModalCopeo();
    calculaCostosExtrasModalCopeo();
});

// Metodo para restringir los caracteres del campo nombre
$('#'+id_nombreModalCopeo).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.",e);
});

// Metodo accionado cuando se altera el campo nombre
$('#'+id_nombreModalCopeo).change(function (){
  var nombre = deleteBlankSpaces(id_nombreModalCopeo);
  nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  $('#' + id_nombreModalCopeo).val(nombre);
});

// Metodo para restringir los caracteres del campo alcance
$('#'+id_alcanceModalCopeo ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.()",e);
});

// Metodo accionado cuando se altera el campo alcance
$('#'+id_alcanceModalCopeo ).change(function (){
  var alcance = deleteBlankSpaces(id_alcanceModalCopeo );
  alcance = alcance.charAt(0).toUpperCase() + alcance.slice(1);
  $('#' + id_alcanceModalCopeo ).val(alcance);
});

// Metodo para restringir los caracteres del campo carga social
$('#'+id_carga_socialModalCopeo  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// // Metodo accionado cuando se altera el campo carga social
$('#'+id_carga_socialModalCopeo  ).change(function (){
  if($('#'+id_carga_socialModalCopeo).val() == ""){
    $('#'+id_carga_socialModalCopeo).val(0);
  }else{
    $('#'+id_carga_socialModalCopeo).val(parseFloat($('#'+id_carga_socialModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
  calculaCostosExtrasModalCopeo();
});

// Metodo para restringir los caracteres del campo dias
$('#'+id_diasModalCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Metodo accionado cuando se altera el campo dias
$('#'+id_diasModalCopeo).change(function (){
  if($('#'+id_diasModalCopeo).val() == ""){
    $('#'+id_diasModalCopeo).val(0);
  }else{
    $('#'+id_diasModalCopeo).val(parseFloat($('#'+id_diasModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
  calculaCostosExtrasModalCopeo();
});

// Metodo para restringir los caracteres del campo multiplicaador
$('#'+id_multModalCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Metodo accionado cuando se altera el campo multiplicador
$('#'+id_multModalCopeo).change(function (){
  if($('#'+id_multModalCopeo).val() == ""){
    $('#'+id_multModalCopeo).val(0);
  }else{
    $('#'+id_multModalCopeo).val(parseFloat($('#'+id_multModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
  calculaCostosExtrasModalCopeo();
});

$('#'+id_extrasModalCopeo ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.(),",e);
});

$('#'+id_costoExtrasModalCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_costoExtrasModalCopeo).change(function (){
  if($('#'+id_costoExtrasModalCopeo).val() == ""){
    $('#'+id_costoExtrasModalCopeo).val(0);
  }else{
    $('#'+id_costoExtrasModalCopeo).val(parseFloat($('#'+id_costoExtrasModalCopeo).val()).toFixed(2));
  }
  calculaCostosExtrasModalCopeo();
});

$('#'+id_costoExtrasModalCopeo).focus(function (){
	if($('#'+id_costoExtrasModalCopeo).val() !== ""){
		$('#'+id_costoExtrasModalCopeo).val(deformatMoney($('#'+id_costoExtrasModalCopeo).val()));
	}
});

$('#'+id_costoExtrasModalCopeo).focusout(function (){
	if($('#'+id_costoExtrasModalCopeo).val() !== ""){
		$('#'+id_costoExtrasModalCopeo).val(formatMoney($('#'+id_costoExtrasModalCopeo).val()));
	}
});

$('#'+id_multExtrasModalCopeo).change(function (){
  if($('#'+id_multExtrasModalCopeo).val() == ""){
    $('#'+id_multExtrasModalCopeo).val(0);
  }else{
    $('#'+id_multExtrasModalCopeo).val(parseFloat($('#'+id_multExtrasModalCopeo).val()).toFixed(0));
  }
  calculaCostosExtrasModalCopeo()
});

$('#'+id_totalExtrasModalCopeo).focus(function (){
	if($('#'+id_totalExtrasModalCopeo).val() !== ""){
		$('#'+id_totalExtrasModalCopeo).val(deformatMoney($('#'+id_totalExtrasModalCopeo).val()));
	}
});

$('#'+id_totalExtrasModalCopeo).focusout(function (){
	if($('#'+id_totalExtrasModalCopeo).val() !== ""){
		$('#'+id_totalExtrasModalCopeo).val(formatMoney($('#'+id_totalExtrasModalCopeo).val()));
	}
});

$("input[name=tiempoExtrasModalCopeo]").change(function (){
  calculaCostosExtrasModalCopeo();
});

// --------------- FUNCIONES PARA CAMPOS CREADOS DINAMICAMENTE -----------------
// Metodo para restringir los caracteres de los campos puesto-cantidad
$(document).on('keypress','.puestosModalCopeo', function(e){
    charactersAllowed("0123456789",e);
});

// Metodo accionado cuando se alteran los campos de puesto-cantidad
$(document).on('change','.puestosModalCopeo', function(e){
		if(this.value == ""){
			this.value = 0;
		}
    calculaCostoDiarioModalCopeo();
    calculaCostoTotalModalCopeo();
    calculaCostosExtrasModalCopeo();
});

// ------------------------------ VALIDACIONES ---------------------------------
//  Metodo para validar los datos del form
function validateFormModalCopeo(){
  if ($('#' + id_ddl_obraModalCopeo).val() == ""){
			alert("Selecciona la obra");
			highLightColor(id_ddl_obraModalCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_procesoModalCopeo).val() == ""){
			alert("Selecciona un proceso");
			highLightColor(id_ddl_procesoModalCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_subprocesoModalCopeo).val() == ""){
			alert("Selecciona un subproceso");
			highLightColor(id_ddl_subprocesoModalCopeo,"#FF0000");
			return false;
  } else if ($('#' + id_ddl_entradaModalCopeo).val() == ""){
			alert("Selecciona una entrada");
			highLightColor(id_ddl_entradaModalCopeo,"#FF0000");
			return false;
  } else if ($('#' + id_nombreModalCopeo).val() == ""){
			alert("Ingresa el nombre de la entrada");
			highLightColor(id_nombreModalCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_alcanceModalCopeo).val() == ""){
			alert("Ingresa el alcance de la entrada");
			highLightColor(id_alcanceModalCopeo,"#FF0000");
			return false;
  } else if ($('#' + id_diasModalCopeo).val() == ""){
			alert("Ingresa los días que tarda la cuadrilla");
			highLightColor(id_diasModalCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_multModalCopeo).val() == ""){
			alert("Ingresa un multiplicador");
			highLightColor(id_multModalCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_carga_socialModalCopeo).val() == ""){
			alert("Ingresa porcentaje de carga social");
			highLightColor(id_carga_socialModalCopeo,"#FF0000");
			return false;
	} else {
    var aux = selectTrabajadores.selected();
    //console.log(aux);
    if(aux && aux.length>0){
      /*
      for(i=0;i<aux.length; i++){
        if ($('#' + aux[i]).val() == ""){
          alert("Ingresa los integrantes de la cuadrilla");
    			//highLightColor(aux[i],"#FF0000");
          return false
        }
      }
      */
    } else {
      alert("Selecciona los puestos necesarios para el trabajo");
			highLightColor(id_lista_trabajadoresModalCopeo,"#FF0000");
      return false;
    }
		return true;
	}
}

// --------------------------- FUNCIONES NECESARIAS ----------------------------
// Metodo para resetear el formulario
function resetFormModalCopeo (){
  //$('#'+id_ddl_obraCopeo).val("");
  if(!adicionalFlag){
    $('#'+id_ddl_procesoModalCopeo).val("");
    $('#'+id_ddl_subprocesoModalCopeo).empty();
    $('#'+id_ddl_entradaModalCopeo).empty();
    $('#' + id_seccion_subprocesoModalCopeo).addClass('hidden');
  }
  $('#'+id_ddl_entradaModalCopeo).val("");
  resetFormModalCopeo_entrada();
}

// Metodo para limpiar los datos del formulario
function resetFormModalCopeo_entrada(){
  $('#'+id_carga_socialModalCopeo).val(34); // no se muestra la carga social a los supervisores
  $('#'+id_carga_socialModalCopeo).prop("disabled", true);
  $('#'+id_diasModalCopeo).val("5");
  $('#'+id_multModalCopeo).val("1");
  $('#'+id_nombreModalCopeo).val("");
  $('#'+id_alcanceModalCopeo).val("");
  selectTrabajadores.set(puestos_array);
  $('#'+id_costo_unitarioModalCopeo).val("");
  $('#'+id_costo_copeoModalCopeo).val("");
  $('#'+id_costo_copeo_CSModalCopeo).val("");
  for(i = 0; i < puestos_array.length; i++){
    $('#'+"row-"+puestos_array[i]).removeClass("hidden");
    $('#'+puestos_array[i]).val("");
  }
  $('#'+id_costoExtrasModalCopeo).val("$0.00");
  $('#'+id_multExtrasModalCopeo).val(0);
  $('#'+id_subtotalExtrasModalCopeo).val("$0.00");
  $('#'+id_totalExtrasModalCopeo).val("$0.00");
}
// Metodo para cargar los trabajadores en el ddl
function cargaListaTrabajadoresModalCopeo(){
  $('#' + id_lista_trabajadoresModalCopeo).empty();
  var puesto;
  var select2 = document.getElementById(id_lista_trabajadoresModalCopeo);
  firebase.database().ref(rama_bd_datos_referencia + "/puestos").on('value',function(snapshot){
      puestos_json = snapshot.val();
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        puesto = snapChild.val();
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = puesto.puesto;
        select2.appendChild(option);
        agregaCamposPuestoModalCopeo(snapChild.key);
        puestos_array.push(snapChild.key);
      })
      //Llenado de la lista de puestos
      selectTrabajadores = new SlimSelect({
          select: '#' + id_lista_trabajadoresModalCopeo,
          placeholder: 'Elige los puestos necesarios',
      });
      resetFormModalCopeo();
      $('#'+id_carga_socialModalCopeo).prop("disabled", false);
  });
}

// Metodo para cargar los datos de las entradas disponibles
function llenaDdlEntradaModalCopeo(){
  //console.log("Llenando entradas");
	$('#' + id_ddl_entradaModalCopeo).empty();
  var select = document.getElementById(id_ddl_entradaModalCopeo);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var subproceso;
  if(!jQuery.isEmptyObject(json_modalCopeo)){
    subproceso = json_modalCopeo;
    num_entradas=subproceso.num_entradas;
    for(key in subproceso.entradas){
      option = document.createElement('option');
      option.value = key;
      option.text = subproceso.entradas[key]["nombre"];
      select.appendChild(option);
    }
  }else{
    num_entradas=0;
  }
  option = document.createElement('option');
  option.value = "-NUEVA-";
  option.text = "-NUEVA-";
  select.appendChild(option);
}

// Metodo para crear los campos de los trabajadores dinamicamente
function agregaCamposPuestoModalCopeo(puesto){
  var id_puesto = puesto;
  var cantidad = document.createElement('input');
  cantidad.className = "form-control puestosModalCopeo";
  cantidad.type = "text";
  cantidad.placeholder = "Cantidad";
  cantidad.id = id_puesto;

  var col1 = document.createElement('div');
  col1.className = "col-md-2";
  col1.appendChild(cantidad);

  var label = document.createElement('label');
  label.innerHTML = puestos_json[puesto]["puesto"]
  label.for = id_puesto;
  label.id = "label_"+id_puesto;

  var col2 = document.createElement('div');
  col2.className = "col-md-3";
  col2.appendChild(label);

  var cantidad2 = document.createElement('input');
  cantidad2.className = "form-control sueldosModalCopeo";
  cantidad2.type = "text";
  cantidad2.disabled = "true";
  cantidad2.value = formatMoney(puestos_json[puesto]["sueldo"]);
  cantidad2.id = "sueldo_"+id_puesto;

  var col3 = document.createElement('div');
  col3.className = "col-md-3";
  col3.appendChild(cantidad2);

  var col0= document.createElement('div');
  col0.className = "col-md-2";

  var col4= document.createElement('div');
  col4.className = "col-md-2";

  var row = document.createElement('div');
  row.className = "form-row hidden";
  row.id = "row-"+puesto;
  row.append(col0);
  row.append(col2);
  row.append(col1);
  row.append(col3);
  row.append(col4);
  var div_trabajadores = document.getElementById(id_div_trabajadoresModalCopeo);
  div_trabajadores.appendChild(row);
}

// Metodo para llenar el formulario con los datos de una entrada
function cargaCamposModalCopeo(claveEntrada){
  if( claveEntrada == "-NUEVA-"){
    //console.log("Sin registro de entrada");
    resetFormModalCopeo_entrada();
    if(num_entradas==0){
      $('#'+id_carga_socialModalCopeo).prop("disabled", false);
    } else{
      $('#' + id_carga_socialModalCopeo).val(json_modalCopeo.impuestos);
    }
  }else{
    var subproceso = json_modalCopeo;
    //console.log(subproceso);
    var entrada = subproceso["entradas"][claveEntrada];
    var cuadrilla = entrada.cuadrilla;
    var aux_array = [];
    var i=0;
    $('#' + id_carga_socialModalCopeo  ).val(subproceso.impuestos);
		$('#' + id_diasModalCopeo ).val(entrada.multiplicadores.dias);
		$('#' + id_multModalCopeo ).val(entrada.multiplicadores.unidades);
    $('#' + id_nombreModalCopeo ).val(entrada.nombre);
    $('#' + id_alcanceModalCopeo ).val(entrada.alcance);
    for(key in cuadrilla){
      aux_array[i] = key;
      $('#'+key).val(cuadrilla[key]["cantidad"]);
      $('#'+"sueldo_"+key).val(formatMoney(cuadrilla[key]["sueldo_diario"]));
      i++;
    }
    if(entrada.extras !== undefined){
      $('#' + id_multExtrasModalCopeo).val(entrada.extras.multiplicador);
      $('#' + id_extrasModalCopeo ).val(entrada.extras.descripcion);
      $('#' + id_costoExtrasModalCopeo ).val(entrada.extras.costo);
      $("input[name=tiempoExtrasModalCopeo]").filter("[value=" + (entrada.extras.semanal?"semanal":"diario") + "]").prop('checked', true);
    } else{
      $('#' + id_multExtrasModalCopeo).val(0);
      $('#' + id_extrasModalCopeo ).val("");
      $('#' + id_costoExtrasModalCopeo ).val("$0.00");
      $("input[name=tiempoExtrasModalCopeo]").filter("[value=semanal]").prop('checked', true);
    }

    selectTrabajadores.set(aux_array);
		calculaCostoDiarioModalCopeo();
    calculaCostoTotalModalCopeo();
    calculaCostosExtrasModalCopeo();
    if(parseFloat(claveEntrada.slice(3)) == 1){
      $('#' + id_carga_socialModalCopeo).prop("disabled", false);
    } else {
      $('#' + id_carga_socialModalCopeo).val(subproceso.impuestos);
    }
  }
}

// Metodo para calcular el costo diario de la cuadrilla
function calculaCostoDiarioModalCopeo(){
  var aux = selectTrabajadores.selected();
  var suma = 0;
  var total = 0;
  var totalCS = 0;
  for (i=0; i<aux.length; i++){
    if($('#'+aux[i]).val() !== ""){
      suma = suma + parseFloat($('#'+aux[i]).val()) * deformatMoney($('#'+"sueldo_"+aux[i]).val());
    }
  }
  suma = suma /5;
  $('#'+ id_costo_unitarioModalCopeo).val(formatMoney(suma));
}

// Metodo para calcular el costo total de la entrada (con y sin carga social)
function calculaCostoTotalModalCopeo(){
  var aux = selectTrabajadores.selected();
  var suma = deformatMoney($('#'+ id_costo_unitarioModalCopeo).val());
  var total = 0;
  var totalCS = 0;
  if ($('#'+id_diasModalCopeo).val() !== "" && $('#'+id_multModalCopeo).val() !== ""){
    //console.log("calculando total");
    total = suma * parseFloat($('#'+id_diasModalCopeo).val()) * parseFloat($('#'+id_multModalCopeo).val());
    if($('#'+id_carga_socialModalCopeo).val() !== ""){
      totalCS = total * (1 + parseFloat($('#'+id_carga_socialModalCopeo).val())*0.01)
      //console.log(totalCS);
    }
  } else {
    total = 0;
    totalCS =0;
  }
  $('#'+ id_costo_copeoModalCopeo).val(formatMoney(total));
  $('#'+ id_costo_copeo_CSModalCopeo).val(formatMoney(totalCS));
}

function calculaCostosExtrasModalCopeo(){
  var subtotal = deformatMoney($('#'+id_costoExtrasModalCopeo).val()) * ($('#'+id_multExtrasModalCopeo).val()==""?0:$('#'+id_multExtrasModalCopeo).val());
  console.log(subtotal);
  subtotal = subtotal * $('#'+id_multModalCopeo).val() * $('#'+id_diasModalCopeo).val();
  console.log(subtotal);
  if($("input[name=tiempoExtrasModalCopeo]:checked").val() == "semanal"){
    subtotal = subtotal * 0.2;
    console.log(subtotal);
  }
  console.log(subtotal);
  $('#'+id_subtotalExtrasModalCopeo).val(formatMoney(subtotal));
  $('#'+id_totalExtrasModalCopeo).val(formatMoney(subtotal + deformatMoney($('#'+id_costo_copeo_CSModalCopeo).val())));
}

// Metodo para construir un json de la entrada con los datos del formulario
function datosEntradaModalCopeo(){
  var entradaCopeo = {};
  var cuadrilla={};
  var aux = selectTrabajadores.selected();
  var cuadrillaPuesto;
  for (i=0; i<aux.length; i++){
    if($('#'+aux[i]).val()!==""){
      cuadrilla[aux[i]] = {
        cantidad: parseFloat($('#'+aux[i]).val()),
        sueldo_diario: deformatMoney($('#'+"sueldo_"+aux[i]).val())
      };
    }
  }
  entradaCopeo = {
    nombre: $('#'+id_nombreModalCopeo).val(),
    alcance: $('#'+id_alcanceModalCopeo).val(),
    subtotal: deformatMoney($('#'+id_costo_copeoModalCopeo).val()),
    cuadrilla: cuadrilla,
    multiplicadores:{
      dias: parseFloat($('#'+id_diasModalCopeo).val()),
      unidades: parseFloat($('#'+id_multModalCopeo).val())
    },
    extras:{
      descripcion: $('#'+id_extrasModalCopeo).val(),
      costo: deformatMoney($('#'+id_costoExtrasModalCopeo).val()),
      multiplicador: parseFloat($('#'+id_multExtrasModalCopeo).val()),
      semanal: $("input[name=tiempoExtrasModalCopeo]:checked").val()=="semanal"?true:false,
      subtotal: deformatMoney($('#'+id_subtotalExtrasModalCopeo).val()),
    }
  }
  return entradaCopeo;
}
