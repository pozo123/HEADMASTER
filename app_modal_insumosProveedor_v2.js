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

var datos_insumos;
var tabla_busqueda;
var tabla_selectos;
var uid_modalProveedor;

// --------------------- Método de inicialización -----------------------------
function modalInsumosProveedor(clave_proveedor){
  resetModalInsumosProveedor();
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

  $('#' + id_modalInsumosProveedor).modal('show');
}

// ----------------------Funciones necesarias ----------------------------------
function resetModalInsumosProveedor(){
  $('#'+id_ddl_buscaMarcaModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaClasificacionModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).empty();
}

function limpiaBusquedaModalInsumosProveedor(){
  $('#'+id_ddl_buscaMarcaModalInsumosProveedor).val("");
  $('#'+id_ddl_buscaClasificacionModalInsumosProveedor).val("");
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).val("");
  $('#'+id_buscaCatalogoModalInsumosProveedor).val("");
  $('#'+id_catalogoModalInsumosProveedor).val("");
  $('#'+id_descripcionModalInsumosProveedor).val("");
  $('#'+id_precioModalInsumosProveedor).val("");
}

//------------------------------- DataTables -----------------------------------
