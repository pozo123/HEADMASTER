// ------------------ Campos Modal Suministros --------------------------------
// elementos generales de la pagina
var id_modalSuministros = "modalSuministros";
var id_dataTable_selectModalSuministros = "dataTableSeleccionadosModalSuministros";
var id_dataTable_busquedaModalSuministros = "dataTableBusquedaModalSuministros";

// elementos del form
var id_ddl_entradaModalSuministros = "ddl_entradaModalSuministros";
var id_nombreModalSuministros = "nombreModalSuministros";
var id_ddl_buscaCategoriaModalSuministros = "ddl_buscaCategoriaModalSuministros";
var id_ddl_buscaFamiliaModalSuministros = "ddl_buscaFamiliaModalSuministros";
var id_ddl_buscaSubfamiliaModalSuministros = "ddl_buscaSubfamiliaModalSuministros";
var id_buscaCatalogoModalSuministros = "buscaCatalogoModalSuministros";
var id_catalogoModalSuministros = "catalogoModalSuministros";
var id_descripcionModalSuministros = "descripcionModalSuministros";
var id_cantidadModalSuministros = "cantidadModalSuministros";
var id_unidadModalSuministros = "unidadModalSuministros";
var id_div_preciosModalSuministros = "div_preciosModalSuministros";
var id_precioListaModalSuministros = "precioListaModalSuministros";
var id_lb_precioListaModalSuministros = "lb_precioListaModalSuministros";
var id_indirectosModalSuministros = "indirectosModalSuministros";
var id_precioClienteModalSuministros = "precioClienteModalSuministros";
var id_cb_sinRegistroModalSuministros = "cb_sinRegistroAdicionales";
var id_div_cb_ModalSuministros = "div_cb_ModalSuministros";
// botones del form
var id_boton_agregarModalSuministros = "botonAgregarModalSuministros";
var id_boton_limpiarModalSuministros = "botonLimpiarFiltrosModalSuministros";
var id_boton_guardarModalSuministros = "botonGuardarModalSuministros";
// variables globales auxiliares
var tabla_busquedaModalSuministros; // tabla donde aparecen todos los insumos disponibles
var tabla_selectosModalSuministros; // tabla donde aparecen los insumos seleccionados
var json_precios; // almacena el precio maximo de los insumos
var p_indirectos; // almacena el porcentaje de costos indirectos default
var supervisorFlag; // boolean que indica si el usuario es un supervisor, sirve para discriminar la vista del form
var json_modalSuministros; // almacenara los datos ingresados en el modal
var cont_nr;

// --------------------- Método de inicialización -----------------------------
// Metodo de inicializacion del modal
function modalSuministros(supervisor, json_actuales){
  //console.log("Desplegando modal");
  // Se inicializan las variables auxiliares
  json_precios = {};
  p_indirectos = 0;
  supervisorFlag = supervisor;
  base_insumos={};
  base_filtrados={};
  filtros={};
  cont_nr=0;
  num_entradas=0;
  json_modalSuministros=json_actuales;
  //json_modalSuministros={};
  // Se cargan los datos de las marcas para los filtros
  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    json_marcas=marcas.val();
    // llenaDdlGeneric(id_ddl_buscaMarcaModalSuministros, marcas, "nombre");
  });
  // Se cargan los datos de las categorias para los filtros
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    json_categorias=categorias.val();
    llenaDdlGeneric(id_ddl_buscaCategoriaModalSuministros, categorias, "nombre");
  });
  // Se cargan los datos de las unidades para los filtros
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
    json_unidades=unidades.val();
  });
  // Se cargan los datos de todos los insumos
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
  });
  // Se cargan los precios maximos de cada uno de los insumos
  firebase.database().ref(rama_bd_insumos + "/listas/productos").on('value',function(snapshot){
    var productos = {};
    var produc = {};
    var maximo = 0;
    if(snapshot.exists()){
      productos= snapshot.val();
      for(key in base_insumos){
        produc = productos[key];
        maximo = 0;
        for(key2 in produc){
          for(key3 in produc[key2]){
            if(produc[key2][key3]["precio"] > maximo){
              maximo = produc[key2][key3]["precio"];
            }
          }
        }
        json_precios[key] = maximo;
      }
      //console.log(json_precios);
    }
    // Se limpia el formulario
    limpiaAgregarModalSuministros();
    // Se crean las tablas
    actualizarTablaModalSuministros(base_insumos);
    creaTablaSelectosModalSuministros([]);
    llenaDdlEntradaModalSuministros(json_actuales);
  });
  // Se despliegan (o no) los campos de precios
  if(supervisorFlag){
    $('#' + id_precioListaModalSuministros).addClass("hidden");
    $('#' + id_lb_precioListaModalSuministros).addClass("hidden");
    $('#' + id_div_cb_ModalSuministros).addClass("hidden");
  }else{
    $('#' + id_precioListaModalSuministros).removeClass("hidden");
    $('#' + id_lb_precioListaModalSuministros).removeClass("hidden");
    $('#' + id_div_cb_ModalSuministros).removeClass("hidden");
    $('#' + id_indirectosModalSuministros).prop('disabled', true);
    $('#' + id_precioClienteModalSuministros).prop('disabled', true);
  }
  // Se despliega el modal
  $('#' + id_modalSuministros).modal('show');
}

// Función que se ejecuta cuando se cierra el modal suministros
$('#' + id_modalSuministros).on('hidden.bs.modal', function () {
  if(flagCalculadora){
    setSuministrosCalculadora();
  }
})

//------------------ FUNCIONES DEL FORMULARIO----------------------------------
// Metodo accionado al cambiar el estado del checkbox
$('#'+id_cb_sinRegistroModalSuministros ).change(function (){
  if($('#'+id_cb_sinRegistroModalSuministros ).prop('checked')){
    limpiaAgregarModalSuministros();
    $('#' + id_unidadModalSuministros).prop('disabled', false);
    $('#' + id_precioListaModalSuministros).prop('disabled', false);
    $('#' + id_descripcionModalSuministros).prop('disabled', false);
    $('#' + id_catalogoModalSuministros).val("NR");
    $('#' + id_indirectosModalSuministros).val(parseFloat(p_indirectos).toFixed(2));
    uid_existente_insumo = "NR-"+cont_nr;
  }else{
    limpiaAgregarModalSuministros();
    $('#' + id_unidadModalSuministros).prop('disabled', true);
    $('#' + id_precioListaModalSuministros).prop('disabled', true);
    $('#' + id_descripcionModalSuministros).prop('disabled', true);
    $('#' + id_indirectosModalSuministros).val("");
  }
});

// Metodo para el boton que limpia los filtros
$('#' + id_boton_limpiarModalSuministros).click(function() {
  limpiaFiltrosModalSuministros();
  actualizarTablaModalSuministros(base_insumos);
});

// Metodo para el boton que agrega un insumo a la tabla de seleccionados
$('#' + id_boton_agregarModalSuministros).click(function() {
  if(validateagregarModalSuministros()){
    if(!existeInsumoModalSuministros(uid_existente_insumo)){
      tabla_selectosModalSuministros.row.add(datosModalSuministros()).draw();
      limpiaAgregarModalSuministros();
      if($('#'+id_cb_sinRegistroModalSuministros ).prop('checked')){
        cont_nr+=1;
        $('#'+id_cb_sinRegistroModalSuministros ).prop('checked', false);
        $('#' + id_unidadModalSuministros).prop('disabled', true);
        $('#' + id_precioListaModalSuministros).prop('disabled', true);
        $('#' + id_descripcionModalSuministros).prop('disabled', true);
      }
    } else {
      alert("El insumo ya ha sido seleccionado antes");
    }
  }
});

// Metodo para el boton que guarda los los cambios registrados en el modal
$('#' + id_boton_guardarModalSuministros).click(function() {
  if(validateEntradaModalSuministros()){
    var uid_entrada;
    var nueva = false;
    //Determinar si es alta o modificación
    if($('#'+id_ddl_entradaModalSuministros+' option:selected').val() == "-NUEVA-"){
      num_entradas = num_entradas+1;
      json_modalSuministros["num_entradas"] = num_entradas;
      if(num_entradas<10){
        uid_entrada = "EN-0"+num_entradas;
      }else{
        uid_entrada = "EN-"+num_entradas;
      }
      nueva = true;
    } else {
      uid_entrada = $("#" + id_ddl_entradaModalSuministros + " option:selected").val();
    }
    //Generar el JSON de la entrada con los datos del formulario
    if(num_entradas == 1){
      json_modalSuministros["entradas"] = {};
    }
  	json_modalSuministros["entradas"][uid_entrada] = recuperaDatosModalSuministros();
    console.log(json_modalSuministros);
  	limpiaAgregarModalSuministros();
    $('#'+id_nombreModalSuministros).val("");
    llenaDdlEntradaModalSuministros(json_modalSuministros);
    alert("¡Insumos registrados!");
    creaTablaSelectosModalSuministros([]);
  }
});

// Metodo accionado cuando se selecciona una entrada
$("#" + id_ddl_entradaModalSuministros).change(function(){
  //uid_subproceso = $('#'+id_ddl_subprocesoModalCopeo+" option:selected").val()
  limpiaAgregarModalSuministros();
  $('#'+id_nombreModalSuministros).val("");
  if($("#" + id_ddl_entradaModalSuministros+' option:selected').val() == "-NUEVA-"){
    creaTablaSelectosModalSuministros(fitDatosTablaModalSuministros({}));
  } else {
    creaTablaSelectosModalSuministros(fitDatosTablaModalSuministros(json_modalSuministros["entradas"][$("#"+id_ddl_entradaModalSuministros+' option:selected').val()]));
    $('#'+id_nombreModalSuministros).val(json_modalSuministros["entradas"][$("#"+id_ddl_entradaModalSuministros+' option:selected').val()]["nombre"]);
  }
});

// Metodo para restringir los caracteres en el campo de indirectos
$('#'+id_indirectosModalSuministros ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Metodo accionado al cambiar el valor del campo indirectos
$('#'+id_indirectosModalSuministros ).change(function (){
		if($('#'+id_indirectosModalSuministros ).val() == ""){
			$('#'+id_indirectosModalSuministros ).val(formatMoney(0));
		}
    $('#'+id_precioClienteModalSuministros).val(formatMoney( deformatMoney( $('#'+id_precioListaModalSuministros).val()) * (1 + $('#'+id_indirectosModalSuministros ).val() *0.01) ));
});

// Metodo accionado cuando indirectos es seleccionado
$('#'+id_indirectosModalSuministros  ).focusout(function (){
	if($('#'+id_indirectosModalSuministros  ).val() !== ""){
		$('#'+id_indirectosModalSuministros  ).val(parseFloat($('#'+id_indirectosModalSuministros ).val()).toFixed(2));
	}
});

// Metodo para restringir los caracteres del campo precio cliente
$('#'+id_precioListaModalSuministros  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Metodo accionado cuando el precio cliente es modificado
$('#'+id_precioListaModalSuministros).change(function (){
		if($('#'+id_precioListaModalSuministros).val() == ""){
			$('#'+id_precioListaModalSuministros).val(formatMoney(0));
		}
    $('#'+id_precioClienteModalSuministros).val( formatMoney($('#'+id_precioListaModalSuministros).val() * (1 + $('#'+id_indirectosModalSuministros).val() * 0.01)));
});

// Metodo accionado cuando precio cliente es enfocado
$('#'+id_precioListaModalSuministros).focus(function (){
	if($('#'+id_precioListaModalSuministros).val() !== ""){
		$('#'+id_precioListaModalSuministros).val(deformatMoney($('#'+id_precioListaModalSuministros ).val()));
	}
});

// Metodo accionado cuando precio cliente pierde enfoque
$('#'+id_precioListaModalSuministros  ).focusout(function (){
	if($('#'+id_precioListaModalSuministros  ).val() !== ""){
		$('#'+id_precioListaModalSuministros  ).val(formatMoney($('#'+id_precioListaModalSuministros ).val()));
	}
});

// Metodo para restringir los caracteres del campo precio cliente
$('#'+id_precioClienteModalSuministros  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Metodo accionado cuando el precio cliente es modificado
$('#'+id_precioClienteModalSuministros).change(function (){
		if($('#'+id_precioClienteModalSuministros).val() == ""){
			$('#'+id_precioClienteModalSuministros).val(formatMoney(0));
		}
    $('#'+id_indirectosModalSuministros).val( parseFloat((deformatMoney($('#'+id_precioClienteModalSuministros).val()) / deformatMoney($('#'+id_precioListaModalSuministros).val()) - 1)*100).toFixed(2) );
});

// Metodo accionado cuando precio cliente es enfocado
$('#'+id_precioClienteModalSuministros).focus(function (){
	if($('#'+id_precioClienteModalSuministros).val() !== ""){
		$('#'+id_precioClienteModalSuministros).val(deformatMoney($('#'+id_precioClienteModalSuministros ).val()));
	}
});

// Metodo accionado cuando precio cliente pierde enfoque
$('#'+id_precioClienteModalSuministros  ).focusout(function (){
	if($('#'+id_precioClienteModalSuministros  ).val() !== ""){
		$('#'+id_precioClienteModalSuministros  ).val(formatMoney($('#'+id_precioClienteModalSuministros ).val()));
	}
});

//------------------------------- FILTROS -------------------------------------
// Metodo accionado cuando se filtra por categoria
$('#' + id_ddl_buscaCategoriaModalSuministros).change(function(){
  $('#'+id_ddl_buscaSubfamiliaModalSuministros).empty();
  llenaDdlGeneric(id_ddl_buscaFamiliaModalSuministros, categorias.child($('#'+id_ddl_buscaCategoriaModalSuministros+' option:selected').val()+'/familias'), "nombre");
  if($('#' + id_ddl_buscaCategoriaModalSuministros+' option:selected').val() == ""){
    delete filtros["categoria"];
  } else {
    filtros["categoria"]=$('#' + id_ddl_buscaCategoriaModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

// Metodo accionado cuando se filtra por marca
$('#' + id_ddl_buscaFamiliaModalSuministros).change(function(){
  llenaDdlGeneric(id_ddl_buscaSubfamiliaModalSuministros, categorias.child($('#'+id_ddl_buscaCategoriaModalSuministros+' option:selected').val()+'/familias/' + $('#'+id_ddl_buscaFamiliaModalSuministros+' option:selected').val()+'/subfamilias'), "nombre");
  if($('#' + id_ddl_buscaFamiliaModalSuministros+' option:selected').val() == ""){
    delete filtros["familia"];
  } else {
    filtros["familia"]= $('#' + id_ddl_buscaFamiliaModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

// Metodo accionado cuando se filtra por clasificacion
$('#' + id_ddl_buscaSubfamiliaModalSuministros).change(function(){
  if($('#' + id_ddl_buscaSubfamiliaModalSuministros +' option:selected').val() == ""){
    delete filtros["subfamilia"];
  } else {
    filtros["subfamilia"]=$('#' + id_ddl_buscaSubfamiliaModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

// Metodo accionado cuando se filtra por catalogo
$('#' + id_buscaCatalogoModalSuministros).change(function(){
  if($('#' + id_buscaCatalogoModalSuministros).val() == ""){
    delete filtros["catalogo"];
  } else {
    filtros["catalogo"]= $('#' + id_buscaCatalogoModalSuministros).val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

// ----------------------Funciones necesarias ----------------------------------
// Metodo para limpiar los filtros
function limpiaFiltrosModalSuministros(){
  $('#'+id_ddl_buscaCategoriaModalSuministros).val("");
  $('#'+id_ddl_buscaFamiliaModalSuministros).val("");
  $('#'+id_ddl_buscaSubfamiliaModalSuministros).val("");
  $('#'+id_buscaCatalogoModalSuministros).val("");
  filtros={};
}

// Metodo para limpiar los campos del pequeno form
function limpiaAgregarModalSuministros(){
  $('#'+id_catalogoModalSuministros ).val("");
  $('#'+id_descripcionModalSuministros ).val("");
  $('#'+id_cantidadModalSuministros ).val("");
  $('#'+id_precioListaModalSuministros ).val("");
  $('#'+id_indirectosModalSuministros  ).val("");
  $('#'+id_precioClienteModalSuministros  ).val("");
  $('#'+id_unidadModalSuministros  ).val("");
}

// Metodo para validar los datos del form
function validateagregarModalSuministros(){
  if($('#' + id_catalogoModalSuministros).val() === ""){
      alert("Ningún insumo fue seleccionado");
      return false;
  } else if($('#' + id_descripcionModalSuministros).val() == ""){
      alert("Ningún insumo fue seleccionado");
      return false;
  } else if($('#' + id_cantidadModalSuministros).val() == ""){
      alert("Ingresa una cantidad");
      highLightColor(id_cantidadModalSuministros,"#FF0000");
      return false;
  } else if(!supervisorFlag){
    if($('#' + id_precioListaModalSuministros).val() == ""){
        alert("Hay un problema con el precio de este insumo");
        highLightColor(id_precioListaModalSuministros,"#FF0000");
        return false;
    } else {
      return true;
    }
  } else {
      return true;
  }
}

function validateEntradaModalSuministros (){
  if($('#' + id_ddl_entradaModalSuministros+' option:selected').val() === ""){
      alert("Selecciona una entrada");
      return false;
  } else if($('#' + id_nombreModalSuministros).val() == ""){
      alert("Ingresa un nombre para la entrada");
      return false;
  } else {
      return true;
  }
}

// Metodo para crear un reglon para la tabla seleccionados con el nuevo insumo
function datosModalSuministros(){
  var insumo=[];
  var insumo_reg = $('#'+id_cb_sinRegistroModalSuministros).prop('checked')?{}:base_insumos[uid_existente_insumo];
  insumo=[
    uid_existente_insumo,
    //true,
    //"<button type='button' class='desplegarModalSuministros btn btn-transparente'><i class='icono_verde fas fa-check-circle'></i></button>",
    $('#'+id_catalogoModalSuministros).val(),//insumo_reg["catalogo"],
    //$('#'+id_cb_sinRegistroModalSuministros).prop('checked')?"NR":json_marcas[insumo_reg["marca"]]["nombre"],
    $('#'+id_descripcionModalSuministros).val(),//insumo_reg["descripcion"],
    $('#'+id_unidadModalSuministros).val(),//json_unidades[insumo_reg["unidad"]]["nombre"],
    $('#'+id_precioListaModalSuministros).val(),
    //$('#'+id_indirectosModalSuministros).val(),
    //$('#'+id_precioClienteModalSuministros).val(),
    "<input type='text' class='cantidadModalSuministros form-control' id=cantidad" + uid_existente_insumo + "ModalSuministros value=" + $('#'+id_cantidadModalSuministros).val() + ">",
    "<button type='button' class='eliminarModalSuministros btn btn-transparente'><i class='icono_rojo fas fa-times-circle'></i></button>"
  ]
  return insumo;
}

// Metodo para verificar si un insumo ya ha sido seleccionado
function existeInsumoModalSuministros(clave){
  console.log(clave);
  var resp = false;
  tabla_selectosModalSuministros.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[0] == clave){
      resp = true;
    }
  });
  return resp;
}

// Metodo para extraer los datos de la tabla seleccionados
function recuperaDatosModalSuministros(){
  var subtotal = 0;
  var insumosSuministros = {
    materiales: {},
    materiales_nr: {},
  };
  tabla_selectosModalSuministros.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    var opcion = "materiales";
    if (data[0].slice(0,3) == "NR-"){
      opcion = "materiales_nr";
    }
    insumosSuministros[opcion][data[0]]={
      catalogo: data[1],
      descripcion: data[2],
      unidad: data[3],
      precio_lista: deformatMoney(data[4]),
      // precio_cliente: deformatMoney(data[8]),
      cantidad: parseFloat($('#cantidad' + data[0] + 'ModalSuministros').val()),
      // desplegar: data[1],
    };
    subtotal += (parseFloat(insumosSuministros[opcion][data[0]].precio_lista) * parseFloat(insumosSuministros[opcion][data[0]].cantidad));
  });
  var entrada = {
    nombre: $('#'+id_nombreModalSuministros).val(),
    subtotal: subtotal.toFixed(2),
    materiales: insumosSuministros["materiales"],
    materiales_nr: insumosSuministros["materiales_nr"],
  };
  return entrada;
}

// Metodo para cargar los datos de las entradas disponibles
function llenaDdlEntradaModalSuministros(json_modalSuministros){
  //console.log("Llenando entradas");
	$('#' + id_ddl_entradaModalSuministros).empty();
  var select = document.getElementById(id_ddl_entradaModalSuministros);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  if(!jQuery.isEmptyObject(json_modalSuministros)){
    num_entradas=json_modalSuministros.num_entradas;
    for(key in json_modalSuministros.entradas){
      option = document.createElement('option');
      option.value = key;
      option.text = json_modalSuministros.entradas[key]["nombre"];
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

// Metodo para transformar los datos json a un formato adecuado
// para desplegarlos en la tabla seleccionados
function fitDatosTablaModalSuministros(json_entrada){
  //console.log(json_actuales);
  var json_actuales = json_entrada["materiales"];
  for(key in json_entrada["materiales_nr"]){
    json_actuales[key] = json_entrada["materiales_nr"][key]
  }
  var array_datos = [];
  var aux = [];
  var insumo_reg={};
  var icono="";
  //var aux_indirectos;
  for (key in json_actuales){
    insumo_reg=base_insumos[key];
    /*
    if(json_actuales[key]["desplegar"]){
      icono = "'icono_verde fas fa-check-circle'";
    }else{
      icono = "'icono_rojo fas fa-times-circle'"
    }
    */
    //aux_indirectos = json_actuales[key]["precio_lista"]!==0?parseFloat((json_actuales[key]["precio_cliente"]/json_actuales[key]["precio_lista"]-1)*100).toFixed(2):p_indirectos;
    if(key.slice(0,3)!=="NR-"){
      aux = [
        key,
        //json_actuales[key]["desplegar"],
        //"<button type='button' class='desplegarModalSuministros btn btn-transparente'><i class="+icono+"></i></button>",
        insumo_reg["catalogo"],
        insumo_reg["descripcion"],
        json_unidades[insumo_reg["unidad"]]["nombre"],
        //formatMoney(json_actuales[key]["precio_lista"]),
        formatMoney(json_precios[key]),
        //p_indirectos,
        //formatMoney(json_actuales[key]["precio_cliente"]),
        "<input type='number' class='cantidadModalSuministros form-control' id=cantidad"+ key +"ModalSuministros value=" + json_actuales[key]["cantidad"] + ">",
        "<button type='button' class='eliminarModalSuministros btn btn-transparente'><i class='icono_rojo fas fa-times-circle'></i></button>"
      ];
    }else{
      aux = [
        key,
        //json_actuales[key]["desplegar"],
        //"<button type='button' class='desplegarModalSuministros btn btn-transparente'><i class="+icono+"></i></button>",
        json_actuales[key]["catalogo"],
        json_actuales[key]["descripcion"],
        json_actuales[key]["unidad"],
        //formatMoney(json_actuales[key]["precio_lista"]),
        formatMoney(json_actuales[key]["precio_lista"]),
        //p_indirectos,
        //formatMoney(json_actuales[key]["precio_cliente"]),
        "<input type='number' class='cantidadModalSuministros form-control' id=cantidad"+ key +"ModalSuministros value=" + json_actuales[key]["cantidad"] + ">",
        "<button type='button' class='eliminarModalSuministros btn btn-transparente'><i class='icono_rojo fas fa-times-circle'></i></button>"
      ];
    }
    array_datos.push(aux);
  }
  return array_datos;
}
//------------------------------- DataTables -----------------------------------
// Metodo para ingresar los insumos que de desean desplegar en la tabla
function actualizarTablaModalSuministros(datos){
  var datos_suministros = [];
  for(key in datos){
    var insumo = datos[key];
    datos_suministros.push([
      key,
      datos[key]["catalogo"],
      datos[key]["descripcion"],
      json_categorias[insumo["categoria"]]["nombre"],
      json_categorias[insumo["categoria"]]["familias"][insumo["familia"]]["nombre"],
      json_categorias[insumo["categoria"]]["familias"][insumo["familia"]]["subfamilias"][insumo["subfamilia"]]["nombre"],
      json_unidades[insumo["unidad"]]["nombre"],
      formatMoney(json_precios[key]),
      "<button type='button' class='agregarModalSuministros btn btn-transparente'><i class='icono_verde fas fa-check-circle'></i></button>",
    ]);
  }
  tabla_busquedaModalSuministros = $('#'+ id_dataTable_busquedaModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      "scrollX":true,
      //"autoWidth": false,
      "columnDefs": [
          { targets: [-1,-3], className: 'dt-body-center'},
          { visible: false, targets: supervisorFlag?[0,7]:[0] }, //Campos auxiliares
        ],
      "order": [[1, "asc"]]
  });
}

// Metodo accionado cuando se hace clic en el icono de agregar en tabla busqueda
$(document).on('click','.agregarModalSuministros', function(){
  var data = tabla_busquedaModalSuministros.row( $(this).parents('tr') ).data();
  uid_existente_insumo = data[0];
  $('#' + id_catalogoModalSuministros).val(data[1]);
  $('#' + id_descripcionModalSuministros).val(data[2]);
  $('#' + id_cantidadModalSuministros).val(1);
  $('#' + id_precioListaModalSuministros).val(data[7]);
  $('#' + id_indirectosModalSuministros).val(parseFloat(p_indirectos).toFixed(2));
  //$('#' + id_precioClienteModalSuministros).val( formatMoney( deformatMoney(data[7]) * (1 + p_indirectos*0.01) ) );
  $('#' + id_unidadModalSuministros).val(data[6]);
  $('#' + id_cb_sinRegistroModalSuministros).prop('checked', false)
  $('#' + id_unidadModalSuministros).prop('disabled', true);
  $('#' + id_precioListaModalSuministros).prop('disabled', true);
  $('#' + id_descripcionModalSuministros).prop('disabled', true);
});

// Metodo para crear la tabla seleccionados
function creaTablaSelectosModalSuministros(datos){
  var datos_suministros = datos;
  tabla_selectosModalSuministros = $('#'+ id_dataTable_selectModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      columnDefs: [
          { targets: [-1,-2,-3,-4], className: 'dt-body-center'},
          { visible: false, targets: supervisorFlag?[0,4]:[0] }, //Campos auxiliares
        ]
  });
}

// Metodo accionado cuando se hace clic en el icono de editar en tabla seleccionados
$(document).on('click','.desplegarModalSuministros', function(){
  var data = tabla_selectosModalSuministros.row( $(this).parents('tr')).data();
  var icon_class = "";
  if(data[1]) {
      icon_class = "'icono_rojo fas fa-times-circle'"
      data[1]=false;
  } else {
    icon_class = "'icono_verde fas fa-check-circle'";
    data[1]=true;
  }
  data[2] = "<button type='button' class='desplegarModalSuministros btn btn-transparente'><i class=" + icon_class + "></i></button>";
  tabla_selectosModalSuministros.row( $(this).parents('tr')).data(data).draw();
});

// Metodo accionado cuando se hace clic en el icono de eliminar en tabla seleccionados
$(document).on('click','.eliminarModalSuministros', function(){
  tabla_selectosModalSuministros.row( $(this).parents('tr') ).remove().draw();
});

// Metodo accionado cuando se hace cambia el valor de alguna celda cantidad
$(document).on('change','.cantidadModalSuministros', function(){
  if(isNaN(parseFloat($(this).val()))){
    alert("Ingresa solo números en las cantidades");
    $(this).val(1);
  } else {
    $(this).val(parseFloat($(this).val()));
  }
});

//------------------------------ Cementerio -----------------------------------
/*
"<input type='number' class='indirectosModalSuministros form-control' id=indirectos"+ key +"ModalSuministros value=" + aux_indirectos + ">",
"<input type='text' class='precioClienteModalSuministros form-control' id=precioCliente"+ key +"ModalSuministros value=" + formatMoney(json_actuales[key]["precio_cliente"]) + ">",

// Metodo accionado cuando se hace cambia el valor de alguna celda indirectos
$(document).on('change','.indirectosModalSuministros', function(){
  if(isNaN(parseFloat($(this).val()))){
    alert("Ingresa números válidos y no dejes campos vacíos");
    $(this).val(p_indirectos);
  } else {
    $(this).val(parseFloat($(this).val()));
  }
  var key = this.id.slice(10,-16);
  $('#precioCliente'+ key + 'ModalSuministros').val( formatMoney( json_precios[key] * (1 + $(this).val() *0.01)));
});

// Metodo accionado cuando se hace cambia el valor de alguna celda indirectos
$(document).on('change','.precioClienteModalSuministros', function(){
  if($(this).val()==""){
    alert("Ingresa números válidos y no dejes campos vacíos");
    $(this).val(p_indirectos);
  }
  var key = this.id.slice(13,-16);
  if(json_precios[key] !== 0){
    $('#indirectos'+ key + 'ModalSuministros').val((deformatMoney($(this).val())/json_precios[key]-1)*100);
  } else {
    $('#indirectos'+ key + 'ModalSuministros').val(p_indirectos);
  }

});

// Metodo accionado cuando se hace cambia el valor de alguna celda indirectos
$(document).on('focus','.precioClienteModalSuministros', function(){
  if ($(this).val() !==""){
    $(this).val(deformatMoney($(this).val()));
  }
});

// Metodo accionado cuando se hace cambia el valor de alguna celda indirectos
$(document).on('focusout','.precioClienteModalSuministros', function(){
  if ($(this).val() !==""){
    $(this).val(formatMoney($(this).val()));
  }
});
*/
