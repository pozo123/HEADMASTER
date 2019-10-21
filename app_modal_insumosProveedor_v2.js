// ------------------ Campos Modal Suministros --------------------------------
var id_modalInsumosProveedor = "modalInsumosProveedor";
var id_dataTable_selectModalInsumosProveedor = "dataTableSeleccionadosModalInsumosProveedor";
var id_dataTable_busquedaModalInsumosProveedor = "dataTableBusquedaModalInsumosProveedor";

var id_ddl_buscaMarcaModalInsumosProveedor = "ddl_buscaMarcaModalInsumosProveedor";
var id_ddl_buscaClasificacionModalInsumosProveedor = "ddl_buscaClasificacionModalInsumosProveedor";
var id_ddl_buscaCategoriaModalInsumosProveedor = "ddl_buscaCategoriaModalInsumosProveedor";
var id_buscaCatalogoModalInsumosProveedor = "buscaCatalogoModalInsumosProveedor";

var id_catalogoModalInsumosProveedor = "catalogoModalInsumosProveedor";
var id_descripcionModalInsumosProveedor = "descripcionModalInsumosProveedor";
var id_precioModalInsumosProveedor = "precioModalInsumosProveedor";
var id_boton_agregarModalInsumosProveedor = "botonAgregarModalInsumosProveedor";

var id_boton_limpiarModalInsumosProveedor = "botonLimpiarFiltrosModalInsumosProveedor";
var id_boton_guardarModalInsumosProveedor = "botonGuardarModalInsumosProveedor";

var tabla_busqueda;
var tabla_selectos;
var uid_modalProveedor;
var uid_existente_insumo;

var base_insumos;
var base_filtrados;
var filtros;

// --------------------- Método de inicialización -----------------------------
function modalInsumosProveedor(clave_proveedor){
  $('#'+id_ddl_buscaMarcaModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaClasificacionModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).empty();
  resetModalInsumosProveedor();
  limpiaFiltrosModalInsumosProveedor();
  uid_modalProveedor = clave_proveedor;

  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    llenaDdlGeneric(id_ddl_buscaMarcaModalInsumosProveedor, marcas, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    llenaDdlGeneric(id_ddl_buscaCategoriaModalInsumosProveedor, categorias, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('value',function(snapshot){
    clasificaciones = snapshot;
    llenaDdlGeneric(id_ddl_buscaClasificacionModalInsumosProveedor, clasificaciones, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
  });
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
    actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
  });

  $('#' + id_modalInsumosProveedor).modal('show');
}

//----------------------------Botones -----------------------------------------
$('#' + id_boton_agregarModalInsumosProveedor).click(function() {
  if(validateagregarModalInsumosProveedor()){

  }
});

$('#' + id_boton_limpiarModalInsumosProveedor).click(function() {
  limpiaFiltrosModalInsumosProveedor();
  actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
});

//------------------------------------------------------------------------------
$('#' + id_precioModalInsumosProveedor).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#' + id_precioModalInsumosProveedor).focus(function(){
  if($('#'+id_precioModalInsumosProveedor).val() !== ""){
		$('#' + id_precioModalInsumosProveedor).val(deformatMoney($('#' + id_precioModalInsumosProveedor).val()));
	}

});

$('#' + id_precioModalInsumosProveedor).focusout(function(){
  if($('#'+id_precioModalInsumosProveedor).val() !== ""){
		$('#' + id_precioModalInsumosProveedor).val(formatMoney($('#' + id_precioModalInsumosProveedor).val()));
	}
});

// ----------------------Funciones necesarias ----------------------------------
function resetModalInsumosProveedor(){
  limpiaFiltrosModalInsumosProveedor();
  limpiaAgregarModalInsumosProveedor();
}

function limpiaFiltrosModalInsumosProveedor(){
  $('#'+id_ddl_buscaMarcaModalInsumosProveedor).val("");
  $('#'+id_ddl_buscaClasificacionModalInsumosProveedor).val("");
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).val("");
  $('#'+id_buscaCatalogoModalInsumosProveedor).val("");
  filtros={};
}

function limpiaAgregarModalInsumosProveedor(){
  $('#'+id_catalogoModalInsumosProveedor).val("");
  $('#'+id_descripcionModalInsumosProveedor).val("");
  $('#'+id_precioModalInsumosProveedor).val("");
}

function validateagregarModalInsumosProveedor(){
  if($('#' + id_catalogoModalInsumosProveedor).val() === ""){
      alert("Ningún insumo fue seleccionado");
      return false;
  } else if($('#' + id_descripcionModalInsumosProveedor).val() == ""){
      alert("Ningún insumo fue seleccionado");
      return false;
  } else if($('#' + id_precioModalInsumosProveedor).val() == ""){
      alert("Ingresa un precio");
      highLightColor(id_precioModalInsumosProveedor,"#FF0000");
      return false;
  } else {
      return true;
  }
}

//------------------------------- Filtros -------------------------------------
$('#' + id_ddl_buscaMarcaModalInsumosProveedor).change(function(){
  if($('#' + id_ddl_buscaMarcaModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["marca"];
  } else {
    filtros["marca"]= $('#' + id_ddl_buscaMarcaModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

$('#' + id_ddl_buscaCategoriaModalInsumosProveedor).change(function(){
  if($('#' + id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["categoria"];
  } else {
    filtros["categoria"]=$('#' + id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

$('#' + id_ddl_buscaClasificacionModalInsumosProveedor).change(function(){
  if($('#' + id_ddl_buscaClasificacionModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["clasificacion"];
  } else {
    filtros["clasificacion"]=$('#' + id_ddl_buscaClasificacionModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

$('#' + id_buscaCatalogoModalInsumosProveedor).change(function(){
  if($('#' + id_buscaCatalogoModalInsumosProveedor).val() == ""){
    delete filtros["catalogo"];
  } else {
    filtros["catalogo"]= $('#' + id_buscaCatalogoModalInsumosProveedor).val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

//-------------------------Funciones necesarias -------------------------------
function filtraGeneric (json_base, json_filtros){
  var json_return={};
  var filtro;
  for (key in json_base){
    filtro = true;
    for (key_f in json_filtros){
      if(json_base[key][key_f] !== json_filtros[key_f]){
        filtro = false;
      }
    }
    if (filtro){
      json_return[key]=json_base[key];
    }
  }
  return json_return;
}

//------------------------------- DataTables -----------------------------------
function actualizarTablaBusquedaModalInsumosProveedor(json_info){
  var json_marcas=marcas.val();
  var json_clasificaciones=clasificaciones.val();
  var json_categorias=categorias.val();
  var json_unidades=unidades.val();

  var datos_busqueda=[];
    for(key in json_info){
        var uid = key;
        var insumo = json_info[key];
        datos_busqueda.push([
            uid,
            json_info[key]["catalogo"],
            json_info[key]["descripcion"],
            json_info[key]["catfabric"],
            json_marcas[insumo["marca"]]["nombre"],
            json_clasificaciones[insumo["clasificacion"]]["nombre"],
            json_categorias[insumo["categoria"]]["nombre"],
            json_unidades[insumo["unidad"]]["nombre"],
            "<button type='button' class='agregar btn btn-transparent'><i class='icono_verde fas fa-check-circle'></i></button>"
        ]);
    }
    tabla_BusquedaModalInsumosProveedor = $('#'+ id_dataTable_busquedaModalInsumosProveedor).DataTable({
        destroy: true,
        data: datos_busqueda,
        language: idioma_espanol,
        "autoWidth": false,
        "scrollX":true,
        "columnDefs": [
            { "width": "150px", "targets": 2 },
            { "visible": false, "targets": 0 }, //campos auxiliares
            { targets: [8], className: 'dt-body-center'}
          ]
    });
    //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
    $('#' + id_dataTable_busquedaModalInsumosProveedor + ' tbody').on( 'click', '.agregar', function () {
        var data = tabla_BusquedaModalInsumosProveedor.row( $(this).parents('tr') ).data();
        uid_existente_insumo = data[0];
        $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
        $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
        $('#' + id_precioModalInsumosProveedor).val("");
    } );
}
