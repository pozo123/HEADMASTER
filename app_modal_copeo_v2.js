// ------------------ Campos Modal Suministros --------------------------------
var id_modalcopeo = "modalCopeo";

var id_ddl_obraModalCopeo = "ddl_obraModalCopeo";
var id_ddl_procesoModalCopeo = "ddl_procesoModalCopeo";
var id_ddl_subprocesoModalCopeo = "ddl_subprocesoModalCopeo";
var id_ddl_entradaModalCopeo = "ddl_entradaModalCopeo";
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
var id_seccion_subprocesoModalCopeo = "div_subprocesoModalCopeo";

var id_agregar_modalCopeo = "botonAceptarModalCopeo";
var id_borrar_modalCopeo = "botonResetModalCopeo";
var id_sueldos_modalCopeo = "botonSueldosModalCopeo";

var selectTrabajadores;
var puestos_array;
var puestos_json;
var registro_antiguo;
var num_entradas;

var ruta_modalCopeo;
var return_modalCopeo;

// --------------------- Método de inicialización -----------------------------
function modalCopeo(ruta){
  puestos_array = [];
  ruta_modalCopeo = ruta;
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
        agregaCamposPuesto(snapChild.key);
        puestos_array.push(snapChild.key);
      })
      //Llenado de la lista de puestos
      selectTrabajadores = new SlimSelect({
          select: '#' + id_lista_trabajadoresModalCopeo,
          placeholder: 'Elige los puestos necesarios',
      });
      resetFormModalCopeo();
  });
  $('#' + id_modalCopeo).modal('show');
}

// ----------------------Funciones necesarias ----------------------------------
//Funcionalidad del boton 'Aceptar'
$('#' + id_agregar_modalCopeo).click(function() {
  if(validateFormModalCopeo()){
    var uid_entrada;
		var entrada_update = {};
    var path_subproceso = ruta_modalCopeo;
    var nueva = false;
    var uid_entrada;
    //Determinar si es alta o modificación
    if($('#'+id_ddl_entradaModalCopeo+' option:selected').val() == "-NUEVA-"){
      num_entradas = num_entradas+1;
      entrada_update[path_subproceso + "/num_entradas"] = num_entradas;
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
      entrada_update[path_subproceso + "/impuestos"] = parseFloat($('#'+id_carga_socialModalCopeo).val());
    }
    //Generar el JSON de la entrada con los datos del formulario
		entrada_update[path_subproceso + "/entradas/" + uid_entrada] = datosEntradaModalCopeo();
    console.log(datosEntradaModalCopeo());
		//Escribir los cambios en la base de datos
		console.log(entrada_update);
		//firebase.database().ref(rama_bd_obras).update(entrada_update);
		// PAD
    if (nueva){
      //pda("alta", rama_bd_obras + "/" + path_subproceso + "/entradas/" + uid_entrada, "");
      alert("¡Alta exitosa!");
    }else {
      //pda("modificacion", rama_bd_obras + "/" +path_subproceso +"/entradas/" + uid_entrada, registro_antiguo);
      alert("¡Edición exitosa!");
      //console.log(registro_antiguo);
    }
		resetFormModalCopeo();
		//actualizarTablaCalculadora();
	}
});

//Funcionalidad del boton 'Borrar'
$('#' + id_borrar_modalCopeo).click(function() {
  resetFormModalCopeo();
});

//Funcionalidad del boton 'Sueldos default'
$('#' + id_sueldos_modalCopeo).click(function() {
  for(key in puestos_json){
    $('#'+"sueldo_"+key).val(formatMoney(puestos_json[key]["sueldo"]));
  }
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// -----------------------------------  DDLS  ---------------------------------------
$("#" + id_ddl_entradaModalCopeo).change(function(){
  resetFormModalCopeo();
  cargaCamposModalCopeo(uid_obra, uid_proceso, uid_subproceso, $("#" + id_ddl_entradaModalCopeo+" option:selected").val() );
});

// -------------------- FUNCIONES DE LOS CAMPOS DE PUESTOS----------------------

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
    calculaCostoUnitarioModalCopeo();
    calculaCostoTotalModalCopeo();
});

// ----------------------- INFORMACION DE LA ENTRADA ---------------------------

$('#'+id_nombreModalCopeo).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.",e);
});

$('#'+id_nombreModalCopeo).change(function (){
  var nombre = deleteBlankSpaces(id_nombreModalCopeo);
  nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  $('#' + id_nombreModalCopeo).val(nombre);
});

$('#'+id_alcanceModalCopeo ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.()",e);
});

$('#'+id_alcanceModalCopeo ).change(function (){
  var alcance = deleteBlankSpaces(id_alcanceModalCopeo );
  alcance = alcance.charAt(0).toUpperCase() + alcance.slice(1);
  $('#' + id_alcanceModalCopeo ).val(alcance);
});

$('#'+id_carga_socialModalCopeo  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_carga_socialModalCopeo  ).change(function (){
  if($('#'+id_carga_socialModalCopeo).val() == ""){
    $('#'+id_carga_socialModalCopeo).val(0);
  }else{
    $('#'+id_carga_socialModalCopeo).val(parseFloat($('#'+id_carga_socialModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
});

$('#'+id_diasModalCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_diasModalCopeo).change(function (){
  if($('#'+id_diasModalCopeo).val() == ""){
    $('#'+id_diasModalCopeo).val(0);
  }else{
    $('#'+id_diasModalCopeo).val(parseFloat($('#'+id_diasModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
});

$('#'+id_multModalCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_multModalCopeo).change(function (){
  if($('#'+id_multModalCopeo).val() == ""){
    $('#'+id_multModalCopeo).val(0);
  }else{
    $('#'+id_multModalCopeo).val(parseFloat($('#'+id_multModalCopeo).val()).toFixed(2));
  }
  calculaCostoTotalModalCopeo();
});

// --------------- FUNCIONES PARA CAMPOS CREADOS DINAMICAMENTE -----------------
$(document).on('keypress','.puestosCopeo', function(e){
    charactersAllowed("0123456789",e);
});

$(document).on('change','.puestosCopeo', function(e){
		if(this.value == ""){
			this.value = 0;
		}
    calculaCostoUnitarioModalCopeo();
    calculaCostoTotalModalCopeo();
});

// ------------------------------ VALIDACIONES ---------------------------------
function validateFormModalCopeo(){
  if ($('#' + id_ddl_entradaModalCopeo).val() == ""){
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
    console.log(aux);
    if(aux && aux.length>0){
      for(i=0;i<aux.length; i++){
        if ($('#' + aux[i]).val() == ""){
          alert("Ingresa los integrantes de la cuadrilla");
    			//highLightColor(aux[i],"#FF0000");
          return false
        }
      }
    } else {
      alert("Selecciona los puestos necesarios para el trabajo");
			highLightColor(id_lista_trabajadoresModalCopeo,"#FF0000");
      return false;
    }
		return true;
	}
}

// --------------------------- FUNCIONES NECESARIAS ----------------------------
function resetFormModalCopeo(){
  $('#'+id_ddl_entradaModalCopeo).empty();
  $('#'+id_carga_socialModalCopeo).val("");
  $('#'+id_carga_socialModalCopeo).prop("disabled", true);
  $('#'+id_diasModalCopeo).val("");
  $('#'+id_multModalCopeo).val("");
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
}

function llenaDdlEntradaModalCopeo(){
	$('#' + id_ddl_entradaModalCopeo).empty();
  var select = document.getElementById(id_ddl_entradaModalCopeo);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var subproceso;
  firebase.database().ref(ruta_modalCopeo).on('value',function(snapshot){
    if(snapshot.exists()){
      subproceso = snapshot.val();
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
  });
}

function agregaCamposPuesto(puesto){
  var id_puesto = puesto;
  var cantidad = document.createElement('input');
  cantidad.className = "form-control puestosCopeo";
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
  cantidad2.className = "form-control sueldosCopeo";
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

function cargaCamposModalCopeo(){
  if( claveEntrada == "-NUEVA-"){
    console.log("Sin registro de entrada");
    resetFormModalCopeo();
    if(num_entradas==0){
      $('#'+id_carga_socialModalCopeo).prop("disabled", false);
    } else{
      firebase.database().ref(ruta_modalCopeo).once('value',function(snapshot){
        var subproceso = snapshot.val();
        $('#' + id_carga_socialModalCopeo).val(subproceso.impuestos);
      });
    }
  }else{
    firebase.database().ref(ruta_modalCopeo).once('value',function(snapshot){
      var subproceso = snapshot.val();
      //console.log(subproceso);
      var entrada = subproceso["entradas"][claveEntrada];
      registro_antiguo = entrada;
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
        $('#'+"sueldo_"+key).val(cuadrilla[key]["sueldo_diario"]);
        i++;
      }
      selectTrabajadores.set(aux_array);
			calculaCostoUnitarioModalCopeo();
      calculaCostoTotalModalCopeo();
      if(parseFloat(claveEntrada.slice(3)) == 1){
        $('#'+id_carga_socialModalCopeo).prop("disabled", false);
      } else {
        $('#' + id_carga_socialModalCopeo).val(subproceso.impuestos);
      }
    });
  }

}

function calculaCostoUnitarioModalCopeo(){
  var aux = selectTrabajadores.selected();
  var suma = 0;
  var total = 0;
  var totalCS = 0;
  for (i=0; i<aux.length; i++){
    if($('#'+aux[i]).val() !== ""){
      suma = suma + parseFloat($('#'+aux[i]).val()) * deformatMoney($('#'+"sueldo_"+aux[i]).val());
    }
  }
  $('#'+ id_costo_unitarioModalCopeo).val(formatMoney(suma));
}

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
  $('#'+ id_costo_CopeoModalCopeo).val(formatMoney(total));
  $('#'+ id_costo_Copeo_CSModalCopeo).val(formatMoney(totalCS));
}

function datosEntradaModalCopeo(){
  var entradaModalCopeo = {};
  var cuadrilla={};
  var aux = selectTrabajadores.selected();
  var cuadrillaPuesto;
  for (i=0; i<aux.length; i++){
    cuadrilla[aux[i]] = {
    cantidad: parseFloat($('#'+aux[i]).val()),
    sueldo_diario: deformatMoney($('#'+"sueldo_"+aux[i]).val())
    };
  }
  entradaModalCopeo = {
    nombre: $('#'+id_nombreModalCopeo).val(),
    alcance: $('#'+id_alcanceModalCopeo).val(),
    subtotal: deformatMoney($('#'+id_costo_CopeoModalCopeo).val()),
    cuadrilla: cuadrilla,
    multiplicadores:{
      dias: parseFloat($('#'+id_diasModalCopeo).val()),
      unidades: parseFloat($('#'+id_multModalCopeo).val())
    }
  }
  return entradaModalCopeo;
}

function verificaEntradas(json_subproceso){
  var suma = 0;
  for (key in json_subproceso.entradas){
      suma = suma + json_subproceso.entradas[key]["subtotal"];
  }
  if (suma !== 0){
    return true;
  } else {
    return false;
  }
}
