// ------------------ Campos Modal Suministros --------------------------------
var id_modalSuministros = "modalSuministros";
var id_dataTable_selectModalSuministros = "dataTableSeleccionadosModalSuministros";
var id_dataTable_busquedaModalSuministros = "dataTableBusquedaModalSuministros";

var id_ddl_buscaMarcaModalSuministros = "ddl_buscaMarcaModalSuministros";
var id_ddl_buscaClasificacionModalSuministros = "ddl_buscaClasificacionModalSuministros";
var id_ddl_buscaCategoriaModalSuministros = "ddl_buscaCategoriaModalSuministros";
var id_buscaCatalogoModalSuministros = "buscaCatalogoModalSuministros";
var id_catalogoModalSuministros = "catalogoModalSuministros";
var id_descripcionModalSuministros = "descripcionModalSuministros";
var id_cantidadModalSuministros = "cantidadModalSuministros";
var id_div_preciosModalSuministros = "div_preciosModalSuministros";
var id_precioListaModalSuministros = "precioListaModalSuministros";
var id_indirectosModalSuministros = "indirectosModalSuministros";
var id_precioClienteModalSuministros = "precioClienteModalSuministros";

var id_boton_agregarModalSuministros = "botonAgregarModalSuministros";
var id_boton_limpiarModalSuministros = "botonLimpiarFiltrosModalSuministros";
var id_boton_guardarModalSuministros = "botonGuardarModalSuministros";

var tabla_busquedaModalSuministros;
var tabla_selectosModalSuministros;

var json_precios;
var p_indirectos;
var supervisorFlag;

var json_modalSuministros;

// --------------------- Método de inicialización -----------------------------
function modalSuministros(indirectos, supervisor){
  resetModalSuministros();
  json_precios = {};
  p_indirectos = indirectos;
  supervisorFlag = supervisor;
  base_insumos={};
  base_filtrados={};
  filtros={};
  json_modalSuministros={};
  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    json_marcas=marcas.val();
    llenaDdlGeneric(id_ddl_buscaMarcaModalSuministros, marcas, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    json_categorias=categorias.val();
    llenaDdlGeneric(id_ddl_buscaCategoriaModalSuministros, categorias, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('value',function(snapshot){
    clasificaciones = snapshot;
    json_clasificaciones=clasificaciones.val();
    llenaDdlGeneric(id_ddl_buscaClasificacionModalSuministros, clasificaciones, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
    json_unidades=unidades.val();
  });
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
  });
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
          if(produc[key2]["precio"] > maximo){
            maximo = produc[key2]["precio"];
          }
        }
        json_precios[key] = maximo;
      }
      console.log(json_precios);
    }
    limpiaAgregarModalSuministros();
    actualizarTablaModalSuministros(base_insumos);
  });
  creaTablaSelectosModalSuministros();
  $('#' + id_div_preciosModalSuministros).prop('disabled', supervisorFlag?true:false)
  $('#' + id_modalSuministros).modal('show');
}

//------------------ Funciones del formulario ----------------------------------
$('#' + id_boton_limpiarModalSuministros).click(function() {
  limpiaFiltrosModalSuministros();
  actualizarTablaModalSuministros(base_insumos);
});

$('#' + id_boton_agregarModalSuministros).click(function() {
  if(validateagregarModalSuministros()){
    if(!existeInsumoModalSuministros(uid_existente_insumo)){
      tabla_selectosModalSuministros.row.add(datosModalSuministros()).draw();
      limpiaAgregarModalSuministros();
    } else {
      alert("El insumo ya ha sido seleccionado antes");
    }
  }
});

$('#' + id_boton_guardarModalSuministros).click(function() {
  json_modalSuministros = recuperaDatosModalSuministros();
  console.log(json_modalSuministros);
});

$('#'+id_indirectosModalSuministros ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_indirectosModalSuministros ).change(function (){
		if($('#'+id_indirectosModalSuministros ).val() == ""){
			$('#'+id_indirectosModalSuministros ).val(formatMoney(0));
		}
    $('#'+id_precioClienteModalSuministros).val(formatMoney( deformatMoney( $('#'+id_precioListaModalSuministros).val()) * (1 + $('#'+id_indirectosModalSuministros ).val() *0.01) ));
});

$('#'+id_precioClienteModalSuministros  ).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#'+id_precioClienteModalSuministros).change(function (){
		if($('#'+id_precioClienteModalSuministros).val() == ""){
			$('#'+id_precioClienteModalSuministros).val(formatMoney(0));
		}
    $('#'+id_indirectosModalSuministros).val( parseFloat((deformatMoney($('#'+id_precioClienteModalSuministros).val()) / deformatMoney($('#'+id_precioListaModalSuministros).val()) - 1)*100).toFixed(2) );
});

$('#'+id_precioClienteModalSuministros).focus(function (){
	if($('#'+id_precioClienteModalSuministros).val() !== ""){
		$('#'+id_precioClienteModalSuministros).val(deformatMoney($('#'+id_precioClienteModalSuministros ).val()));
	}
});

$('#'+id_precioClienteModalSuministros  ).focusout(function (){
	if($('#'+id_precioClienteModalSuministros  ).val() !== ""){
		$('#'+id_precioClienteModalSuministros  ).val(formatMoney($('#'+id_precioClienteModalSuministros ).val()));
	}
});

//------------------------------- Filtros -------------------------------------
$('#' + id_ddl_buscaMarcaModalSuministros).change(function(){
  if($('#' + id_ddl_buscaMarcaModalSuministros+' option:selected').val() == ""){
    delete filtros["marca"];
  } else {
    filtros["marca"]= $('#' + id_ddl_buscaMarcaModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

$('#' + id_ddl_buscaCategoriaModalSuministros).change(function(){
  if($('#' + id_ddl_buscaCategoriaModalSuministros+' option:selected').val() == ""){
    delete filtros["categoria"];
  } else {
    filtros["categoria"]=$('#' + id_ddl_buscaCategoriaModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

$('#' + id_ddl_buscaClasificacionModalSuministros).change(function(){
  if($('#' + id_ddl_buscaClasificacionModalSuministros +' option:selected').val() == ""){
    delete filtros["clasificacion"];
  } else {
    filtros["clasificacion"]=$('#' + id_ddl_buscaClasificacionModalSuministros+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaModalSuministros(base_filtrados);
});

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
function resetModalSuministros(){
  $('#'+id_ddl_buscaMarcaModalSuministros).empty();
  $('#'+id_ddl_buscaClasificacionModalSuministros).empty();
  $('#'+id_ddl_buscaCategoriaModalSuministros).empty();

}

function limpiaFiltrosModalSuministros(){
  $('#'+id_ddl_buscaMarcaModalSuministros).val("");
  $('#'+id_ddl_buscaClasificacionModalSuministros).val("");
  $('#'+id_ddl_buscaCategoriaModalSuministros).val("");
  $('#'+id_buscaCatalogoModalSuministros).val("");
  filtros={};
}

function limpiaAgregarModalSuministros(){
  $('#'+id_catalogoModalSuministros ).val("");
  $('#'+id_descripcionModalSuministros ).val("");
  $('#'+id_cantidadModalSuministros ).val("");
  $('#'+id_precioListaModalSuministros ).val("");
  $('#'+id_indirectosModalSuministros  ).val("");
  $('#'+id_precioClienteModalSuministros  ).val("");
}

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
    } else if($('#' + id_indirectosModalSuministros).val() == ""){
        alert("Ingresa un porcentaje de costos indirectos");
        highLightColor(id_indirectosModalSuministros,"#FF0000");
        return false;
    } else if($('#' + id_precioClienteModalSuministros).val() == ""){
        alert("Ingresa el precio final para el cliente");
        highLightColor(id_precioClienteModalSuministros,"#FF0000");
        return false;
    } else {
      return true;
    }
  } else {
      return true;
  }
}

function datosModalSuministros(){
  var insumo=[];
  var insumo_reg = base_insumos[uid_existente_insumo];
  insumo=[
    uid_existente_insumo,
    true,
    "<button type='button' class='desplegarModalSuministros btn btn-transparente'><i class='icono_verde fas fa-check-circle'></i></button>",
    insumo_reg["catalogo"],
    json_marcas[insumo_reg["marca"]]["nombre"],
    insumo_reg["descripcion"],
    json_unidades[insumo_reg["unidad"]]["nombre"],
    $('#'+id_precioListaModalSuministros).val(),
    $('#'+id_indirectosModalSuministros).val(),
    $('#'+id_precioClienteModalSuministros).val(),
    $('#'+id_cantidadModalSuministros).val(),
    "<button type='button' class='eliminarModalSuministros btn btn-transparente'><i class='icono_rojo fas fa-times-circle'></i></button>"
  ]
  return insumo;
}

function existeInsumoModalSuministros(clave){
  var resp = false;
  tabla_selectosModalSuministros.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[0] == clave){
      resp = true;
    }
  });
  return resp;
}

function recuperaDatosModalSuministros(){
  var insumosSuministros = {};
  tabla_selectosModalSuministros.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    insumosSuministros[data[0]]={
      descripcion: data[5],
      unidad: data[6],
      precio_lista: deformatMoney(data[7]),
      precio_cliente: deformatMoney(data[9]),
      cantidad: data[10],
      desplegar: data[1],
    };
  });
  return insumosSuministros;
}
//------------------------------- DataTables -----------------------------------
function actualizarTablaModalSuministros(datos){
  var datos_suministros = [];
  for(key in datos){
    var insumo = datos[key];
    datos_suministros.push([
      key,
      datos[key]["catalogo"],
      json_marcas[insumo["marca"]]["nombre"],
      json_clasificaciones[insumo["clasificacion"]]["nombre"],
      datos[key]["descripcion"],
      json_unidades[insumo["unidad"]]["nombre"],
      formatMoney(json_precios[key]),
      "<button type='button' class='agregarModalSuministros btn btn-transparente'><i class='icono_verde fas fa-check-circle'></i></button>",
    ]);
  }
  tabla_busquedaModalSuministros = $('#'+ id_dataTable_busquedaModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      //"autoWidth": false,
      "columnDefs": [
          { "width": "120px", "targets": 4 },
          { targets: [-1,-3], className: 'dt-body-center'},
          { "visible": false, "targets": supervisorFlag?[0,6]:[0] }, //Campos auxiliares
        ]
  });
}

$(document).on('click','.agregarModalSuministros', function(){
  var data = tabla_busquedaModalSuministros.row( $(this).parents('tr') ).data();
  uid_existente_insumo = data[0];
  $('#' + id_catalogoModalSuministros).val(data[1]);
  $('#' + id_descripcionModalSuministros).val(data[4]);
  $('#' + id_cantidadModalSuministros).val(1);
  $('#' + id_precioListaModalSuministros).val(data[6]);
  $('#' + id_indirectosModalSuministros).val(p_indirectos);
  $('#' + id_precioClienteModalSuministros).val( formatMoney( deformatMoney(data[6]) * (1 + p_indirectos*0.01) ) );
});

function creaTablaSelectosModalSuministros(){
  var datos_suministros = [];
  tabla_selectosModalSuministros = $('#'+ id_dataTable_selectModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      "columnDefs": [
          { "width": "120px", "targets": 4 },
          { targets: [-1,-2,-3], className: 'dt-body-center'},
          { "visible": false, "targets": supervisorFlag?[0,1,2,7,8,9]:[0,1,9] }, //Campos auxiliares
        ]
  });
}

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

$(document).on('click','.eliminarModalSuministros', function(){
  tabla_selectosModalSuministros.row( $(this).parents('tr') ).remove().draw();
});
