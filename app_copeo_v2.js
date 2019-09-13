// id's de los elementos HTML
var id_tab_copeo = "tabCopeo";
var id_form_copeo = "formCopeo";
//var id_dataTable_copeo = "dataTableProcesos";

var id_ddl_obraCopeo = "ddl_obraCopeo";
var id_ddl_procesoCopeo = "ddl_procesoCopeo";
var id_ddl_subprocesoCopeo = "ddl_subprocesoCopeo";
var id_ddl_entradaCopeo = "ddl_entradaCopeo";
var id_carga_socialCopeo = "cargaSocialCopeo";
var id_diasCopeo = "diasCopeo";
var id_multCopeo = "multCopeo";
var id_nombreCopeo = "nombreCopeo";
var id_alcanceCopeo = "alcanceCopeo";
var id_lista_trabajadoresCopeo = "listaTrabajadoresCopeo";
var id_div_trabajadoresCopeo = "divTrabajadoresCopeo";
var id_costo_unitarioCopeo = "costoUnitarioCopeo";
var id_costo_CopeoCopeo = "costoCopeo";
var id_costo_Copeo_CSCopeo = "costoCSCopeo";
var id_seccion_subprocesoCopeo = "div_subprocesoCopeo";

var id_agregar_copeo = "botonAceptarCopeo";
var id_borrar_copeo = "botonResetCopeo";
var id_sueldos_copeo = "botonSueldosCopeo";

var selectTrabajadores;
var puestos_array;
var puestos_json;
var uid_obra;
var uid_proceso;
var uid_subproceso;
var registro_antiguo;
var num_entradas;


//Variables globales para controlar edición

//Dar formato a los elementos existentes
$('#' + id_tab_copeo).click(function() {
  puestos_array = [];
  // Llenado del ddl de obra.
  $('#' + id_ddl_obraCopeo).empty();
  var select = document.getElementById(id_ddl_obraCopeo);
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

  $('#' + id_lista_trabajadoresCopeo).empty();
  var puesto;
  var select2 = document.getElementById(id_lista_trabajadoresCopeo);
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
          select: '#' + id_lista_trabajadoresCopeo,
          placeholder: 'Elige los puestos necesarios',
      });
      resetFormCopeo();
  });
});

//Funcionalidad del boton 'Aceptar'
$('#' + id_agregar_copeo).click(function() {
  if(validateFormCopeo()){
		uid_obra = $("#" + id_ddl_obraCopeo + " option:selected").val();
		uid_proceso = $("#" + id_ddl_procesoCopeo + " option:selected").val();
		uid_subproceso = $("#" + id_ddl_subprocesoCopeo + " option:selected").val();
    var uid_entrada;
		var entrada_update = {};
    var path_subproceso = "copeo/" + uid_obra + "/" + uid_proceso + "/" + uid_subproceso;
    var nueva = false;
    var uid_entrada;
    //Determinar si es alta o modificación
    if($('#'+id_ddl_entradaCopeo+' option:selected').val() == "-NUEVA-"){
      num_entradas = num_entradas+1;
      entrada_update[path_subproceso + "/num_entradas"] = num_entradas;
      if(num_entradas<10){
        uid_entrada = "EN-0"+num_entradas;
      }else{
        uid_entrada = "EN-"+num_entradas;
      }
      nueva = true;
    } else {
      uid_entrada = $("#" + id_ddl_entradaCopeo + " option:selected").val();
    }
		//Actualizar los campos de la entrada
    if(parseFloat(uid_entrada.slice(3)) == 1){
      entrada_update[path_subproceso + "/impuestos"] = parseFloat($('#'+id_carga_socialCopeo).val());
    }
    //Generar el JSON de la entrada con los datos del formulario
		entrada_update[path_subproceso + "/entradas/" + uid_entrada] = datosEntradaCopeo();
    console.log(datosEntradaCopeo());
		//Escribir los cambios en la base de datos
		console.log(entrada_update);
		firebase.database().ref(rama_bd_obras).update(entrada_update);
		// PAD
    if (nueva){
      pda("alta", rama_bd_obras + "/" + path_subproceso + "/entradas/" + uid_entrada, "");
      alert("¡Alta exitosa!");
    }else {
      pda("modificacion", rama_bd_obras + "/" +path_subproceso +"/entradas/" + uid_entrada, registro_antiguo);
      alert("¡Edición exitosa!");
      console.log(registro_antiguo);
    }
		resetFormCopeo();
		//actualizarTablaCalculadora();
	}
});

//Funcionalidad del boton 'Borrar'
$('#' + id_borrar_copeo).click(function() {
  resetFormCopeo();
});

//Funcionalidad del boton 'Sueldos default'
$('#' + id_sueldos_copeo).click(function() {

});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// -----------------------------------  DDLS  ---------------------------------------

$("#" + id_ddl_obraCopeo ).change(function(){
  uid_obra=$('#' + id_ddl_obraCopeo + " option:selected").val();
  $('#' + id_ddl_procesoCopeo).empty();
  $('#' + id_ddl_subprocesoCopeo).empty();
  resetFormCopeo_subproceso();
  var select = document.getElementById(id_ddl_procesoCopeo);
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

$("#" + id_ddl_procesoCopeo).change(function(){
  uid_proceso = $('#' + id_ddl_procesoCopeo + " option:selected").val();
  llenaDdlSubprocesoCopeo(uid_obra, uid_proceso);
});

$("#" + id_ddl_subprocesoCopeo).change(function(){
  uid_subproceso = $('#'+id_ddl_subprocesoCopeo+" option:selected").val()
  $('.sueldosCopeo').prop('disabled',true);
  llenaDdlEntradaCopeo(uid_obra, uid_proceso,uid_subproceso);
});

$("#" + id_ddl_entradaCopeo).change(function(){
  resetFormCopeo_subproceso();
  cargaCamposCopeo(uid_obra, uid_proceso, uid_subproceso, $("#" + id_ddl_entradaCopeo+" option:selected").val() );
});

// -------------------- FUNCIONES DE LOS CAMPOS DE PUESTOS----------------------

$('#' + id_lista_trabajadoresCopeo).change(function(){
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
    calculaCostoUnitarioCopeo();
    calculaCostoTotalCopeo();
});

// ----------------------- INFORMACION DE LA ENTRADA ---------------------------

$('#'+id_nombreCopeo).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.",e);
});

$('#'+id_nombreCopeo).change(function (){
  var nombre = deleteBlankSpaces(id_nombreCopeo);
  nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  $('#' + id_nombreCopeo).val(nombre);
});

$('#'+id_alcanceCopeo ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_-.()",e);
});

$('#'+id_alcanceCopeo ).change(function (){
  var alcance = deleteBlankSpaces(id_alcanceCopeo );
  alcance = alcance.charAt(0).toUpperCase() + alcance.slice(1);
  $('#' + id_alcanceCopeo ).val(alcance);
});

$('#'+id_carga_socialCopeo  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_carga_socialCopeo  ).change(function (){
  if($('#'+id_carga_socialCopeo).val() == ""){
    $('#'+id_carga_socialCopeo).val(0);
  }else{
    $('#'+id_carga_socialCopeo).val(parseFloat($('#'+id_carga_socialCopeo).val()).toFixed(2));
  }
  calculaCostoTotalCopeo();
});

$('#'+id_diasCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_diasCopeo).change(function (){
  if($('#'+id_diasCopeo).val() == ""){
    $('#'+id_diasCopeo).val(0);
  }else{
    $('#'+id_diasCopeo).val(parseFloat($('#'+id_diasCopeo).val()).toFixed(2));
  }
  calculaCostoTotalCopeo();
});

$('#'+id_multCopeo).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_multCopeo).change(function (){
  if($('#'+id_multCopeo).val() == ""){
    $('#'+id_multCopeo).val(0);
  }else{
    $('#'+id_multCopeo).val(parseFloat($('#'+id_multCopeo).val()).toFixed(2));
  }
  calculaCostoTotalCopeo();
});

// --------------- FUNCIONES PARA CAMPOS CREADOS DINAMICAMENTE -----------------
$(document).on('keypress','.puestosCopeo', function(e){
    charactersAllowed("0123456789",e);
});

$(document).on('change','.puestosCopeo', function(e){
		if(this.value == ""){
			this.value = 0;
		}
    calculaCostoUnitarioCopeo();
    calculaCostoTotalCopeo();
});

// ------------------------------ VALIDACIONES ---------------------------------
function validateFormCopeo(){
  if ($('#' + id_ddl_obraCopeo).val() == ""){
			alert("Selecciona la obra");
			highLightColor(id_ddl_obraCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_procesoCopeo).val() == ""){
			alert("Selecciona un proceso");
			highLightColor(id_ddl_procesoCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_ddl_subprocesoCopeo).val() == ""){
			alert("Selecciona un subproceso");
			highLightColor(id_ddl_subprocesoCopeo,"#FF0000");
			return false;
  } else if ($('#' + id_nombreCopeo).val() == ""){
			alert("Ingresa el nombre de la entrada");
			highLightColor(id_nombreCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_alcanceCopeo).val() == ""){
			alert("Ingresa el alcance de la entrada");
			highLightColor(id_alcanceCopeo,"#FF0000");
			return false;
  } else if ($('#' + id_diasCopeo).val() == ""){
			alert("Ingresa los días que tarda la cuadrilla");
			highLightColor(id_diasCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_multCopeo).val() == ""){
			alert("Ingresa un multiplicador");
			highLightColor(id_multCopeo,"#FF0000");
			return false;
	} else if ($('#' + id_carga_socialCopeo).val() == ""){
			alert("Ingresa porcentaje de carga social");
			highLightColor(id_carga_socialCopeo,"#FF0000");
			return false;
	} else {
    console.log("hasta aqui llego");
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
			highLightColor(id_lista_trabajadoresCopeo,"#FF0000");
      return false;
    }
		return true;
	}
}

// --------------------------- FUNCIONES NECESARIAS ----------------------------

function resetFormCopeo (){
  $('#'+id_ddl_obraCopeo).val("");
  $('#'+id_ddl_procesoCopeo).empty();
  $('#'+id_ddl_subprocesoCopeo).empty();
  resetFormCopeo_subproceso();
  $('#' + id_seccion_subprocesoCopeo).addClass('hidden');
  registro_antiguo="";
}

function resetFormCopeo_subproceso(){
  $('#'+id_carga_socialCopeo).val("");
  $('#'+id_carga_socialCopeo).prop("disabled", true);
  $('#'+id_diasCopeo).val("");
  $('#'+id_multCopeo).val("");
  $('#'+id_nombreCopeo).val("");
  $('#'+id_alcanceCopeo).val("");
  selectTrabajadores.set(puestos_array);
  $('#'+id_costo_unitarioCopeo).val("");
  $('#'+id_costo_CopeoCopeo).val("");
  $('#'+id_costo_Copeo_CSCopeo).val("");
  for(i = 0; i < puestos_array.length; i++){
    $('#'+"row-"+puestos_array[i]).removeClass("hidden");
    $('#'+puestos_array[i]).val("");
  }
}

function llenaDdlSubprocesoCopeo(clave_obra, clave_proceso){
	$('#' + id_ddl_subprocesoCopeo).empty();
  var select = document.getElementById(id_ddl_subprocesoCopeo);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var proceso;
  var procesoCopeo;
	var subproceso;
  firebase.database().ref(rama_bd_obras + "/procesos/" + clave_obra + "/procesos/" + clave_proceso).on('value',function(snapshotProcesos){
    firebase.database().ref(rama_bd_obras + "/copeo/" + clave_obra +"/"+ clave_proceso).on('value',function(snapshotCopeo){
      proceso = snapshotProcesos.val();
      procesoCopeo = snapshotCopeo.val();
      snapshotProcesos.child("subprocesos").forEach(function(snapchild){
        subproceso = snapchild.val();
        if (snapchild.exists()){
          if ($('#'+id_ddl_procesoCopeo+" option:selected").val() == snapchild.key){
            if(snapshotCopeo.exists() && procesoCopeo[snapchild.key] !== undefined){
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
            $('#' + id_seccion_subprocesoCopeo).addClass('hidden');
            $('#' + id_ddl_subprocesoCopeo).val(snapshotProcesos.key);
          } else {
            $('#' + id_seccion_subprocesoCopeo).removeClass('hidden');
          }
        }
      });
    });
  });
}

function llenaDdlEntradaCopeo(clave_obra, clave_proceso, clave_subproceso){
	$('#' + id_ddl_entradaCopeo).empty();
  var select = document.getElementById(id_ddl_entradaCopeo);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
	var subproceso;
  firebase.database().ref(rama_bd_obras + "/copeo/" + clave_obra +"/"+ clave_proceso+"/"+clave_subproceso).on('value',function(snapshot){
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
  var div_trabajadores = document.getElementById(id_div_trabajadoresCopeo);
  div_trabajadores.appendChild(row);
}

function cargaCamposCopeo(claveObra, claveProceso, claveSubproceso, claveEntrada){
  if( claveEntrada == "-NUEVA-"){
    console.log("Sin registro de entrada");
    resetFormCalculadora_subproceso();
    if(num_entradas==0){
      $('#'+id_carga_socialCopeo).prop("disabled", false);
    } else{
      firebase.database().ref(rama_bd_obras + "/copeo/" + claveObra + "/" + claveProceso + "/" + claveSubproceso).once('value',function(snapshot){
        var subproceso = snapshot.val();
        $('#' + id_carga_socialCopeo).val(subproceso.impuestos);
      });
    }
  }else{
    firebase.database().ref(rama_bd_obras + "/copeo/" + claveObra + "/" + claveProceso + "/" + claveSubproceso).once('value',function(snapshot){
      var subproceso = snapshot.val();
      console.log(subproceso);
      var entrada = subproceso["entradas"][claveEntrada];
      registro_antiguo = entrada;
      var cuadrilla = entrada.cuadrilla;
      var aux_array = [];
      var i=0;
      $('#' + id_carga_socialCopeo  ).val(subproceso.impuestos);
			$('#' + id_diasCopeo ).val(entrada.multiplicadores.dias);
			$('#' + id_multCopeo ).val(entrada.multiplicadores.unidades);
      $('#' + id_nombreCopeo ).val(entrada.nombre);
      $('#' + id_alcanceCopeo ).val(entrada.alcance);
      for(key in cuadrilla){
        aux_array[i] = key;
        $('#'+key).val(cuadrilla[key]["cantidad"]);
        $('#'+"sueldo_"+key).val(cuadrilla[key]["sueldo_diario"]);
        i++;
      }
      selectTrabajadores.set(aux_array);
			calculaCostoUnitarioCopeo();
      calculaCostoTotalCopeo();
      if(parseFloat(claveEntrada.slice(3)) == 1){
        $('#'+id_carga_socialCopeo).prop("disabled", false);
      } else {
        $('#' + id_carga_socialCopeo).val(subproceso.impuestos);
      }
    });
  }

}

function calculaCostoUnitarioCopeo(){
  var aux = selectTrabajadores.selected();
  var suma = 0;
  var total = 0;
  var totalCS = 0;
  for (i=0; i<aux.length; i++){
    if($('#'+aux[i]).val() !== ""){
      suma = suma + parseFloat($('#'+aux[i]).val()) * deformatMoney($('#'+"sueldo_"+aux[i]).val());
    }
  }
  $('#'+ id_costo_unitarioCopeo).val(formatMoney(suma));
}

function calculaCostoTotalCopeo(){
  var aux = selectTrabajadores.selected();
  var suma = deformatMoney($('#'+ id_costo_unitarioCopeo).val());
  var total = 0;
  var totalCS = 0;
  if ($('#'+id_diasCopeo).val() !== "" && $('#'+id_multCopeo).val() !== ""){
    console.log("calculando total");
    total = suma * parseFloat($('#'+id_diasCopeo).val()) * parseFloat($('#'+id_multCopeo).val());
    if($('#'+id_carga_socialCopeo).val() !== ""){
      totalCS = total * (1 + parseFloat($('#'+id_carga_socialCopeo).val())*0.01)
      console.log(totalCS);
    }
  } else {
    total = 0;
    totalCS =0;
  }
  $('#'+ id_costo_CopeoCopeo).val(formatMoney(total));
  $('#'+ id_costo_Copeo_CSCopeo).val(formatMoney(totalCS));
}

function datosEntradaCopeo(){
  var entradaCopeo = {};
  var cuadrilla={};
  var aux = selectTrabajadores.selected();
  var cuadrillaPuesto;
  for (i=0; i<aux.length; i++){
    cuadrilla[aux[i]] = {
    cantidad: parseFloat($('#'+aux[i]).val()),
    sueldo_diario: deformatMoney($('#'+"sueldo_"+aux[i]).val())
    };
  }
  entradaCopeo = {
    nombre: $('#'+id_nombreCopeo).val(),
    alcance: $('#'+id_alcanceCopeo).val(),
    subtotal: deformatMoney($('#'+id_costo_CopeoCopeo).val()),
    cuadrilla: cuadrilla,
    multiplicadores:{
      dias: parseFloat($('#'+id_diasCopeo).val()),
      unidades: parseFloat($('#'+id_multCopeo).val())
    }
  }
  return entradaCopeo;
}
