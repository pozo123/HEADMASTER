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
var id_fecha_cotizacionModalInsumosProveedor = "fechaCotizacionModalInsumosProveedor";
var id_boton_agregarModalInsumosProveedor = "botonAgregarModalInsumosProveedor";

var id_boton_limpiarModalInsumosProveedor = "botonLimpiarFiltrosModalInsumosProveedor";
var id_boton_guardarModalInsumosProveedor = "botonGuardarModalInsumosProveedor";

var uid_modalProveedor;
var existe_insumo;
var uid_existente_insumo;
var existe_insumo_index;
var registro_productos;

var base_insumos;
var base_filtrados;
var filtros;

var json_marcas;
var json_clasificaciones;
var json_categorias;
var json_unidades;

var tabla_BusquedaModalInsumosProveedor;
var tabla_SelectModalInsumosProveedor;

// --------------------- Método de inicialización -----------------------------
function modalInsumosProveedor(clave_proveedor){
  $('#'+id_ddl_buscaMarcaModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaClasificacionModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).empty();
  resetModalInsumosProveedor();
  limpiaFiltrosModalInsumosProveedor();
  uid_modalProveedor = clave_proveedor;
  uid_existente_insumo="";
  existe_insumo = false;
  registro_productos = {};

  jQuery('#' + id_fecha_cotizacionModalInsumosProveedor).datetimepicker(
      {timepicker:false, weeks:true,format:'Y.m.d'}
  );
  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    json_marcas=marcas.val();
    llenaDdlGeneric(id_ddl_buscaMarcaModalInsumosProveedor, marcas, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    json_categorias=categorias.val();
    llenaDdlGeneric(id_ddl_buscaCategoriaModalInsumosProveedor, categorias, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('value',function(snapshot){
    clasificaciones = snapshot;
    json_clasificaciones=clasificaciones.val();
    llenaDdlGeneric(id_ddl_buscaClasificacionModalInsumosProveedor, clasificaciones, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
    json_unidades=unidades.val();
  });
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
    actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
  });
  crearTablaSeleccionadosModalInsumosProveedor(uid_modalProveedor);
  $('#' + id_modalInsumosProveedor).modal('show');
}

//----------------------------Botones -----------------------------------------
$('#' + id_boton_agregarModalInsumosProveedor).click(function() {
  if(validateagregarModalInsumosProveedor()){
    if(existe_insumo){
      tabla_SelectModalInsumosProveedor.row(existe_insumo_index).data(datosInsumoModalInsumosProveedor()).draw();
    }else{
      tabla_SelectModalInsumosProveedor.row.add(datosInsumoModalInsumosProveedor()).draw();
    }
    limpiaAgregarModalInsumosProveedor();
    existe_insumo= false;
  }
  /*
  var insumo_update = {};
  var insumo_info = altaInsumoModalInsumosProveedor();
  if(validateagregarModalInsumosProveedor()){
      insumo_update["listas/proveedores/" + uid_modalProveedor + "/" + uid_existente_insumo] = insumo_info;
      insumo_update["listas/productos/" + uid_existente_insumo + "/"+ uid_modalProveedor] = insumo_info;

      console.log(insumo_update);
      firebase.database().ref(rama_bd_insumos).update(insumo_update);
      // PAD
      if(registro_productos[uid_existente_insumo] == undefined){
        pda("alta", rama_bd_insumos + "/listas/proveedores/" + uid_modalProveedor+ "/"+uid_existente_insumo,"");
        alert("¡Alta exitosa!");
      }else{
        pda("modificacion", rama_bd_insumos + "/listas/proveedores/" + uid_modalProveedor+ "/"+uid_existente_insumo, registro_productos[uid_existente_insumo]);
        alert("¡Edición exitosa!");
      }
      resetModalInsumosProveedor();
      limpiaAgregarModalInsumosProveedor();
  }
  */
});

$('#' + id_boton_limpiarModalInsumosProveedor).click(function() {
  limpiaFiltrosModalInsumosProveedor();
  actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
});

$('#' + id_boton_guardarModalInsumosProveedor).click(function() {
  insumo_update = {};
  var insumos_json = recuperaDatosModalInsumosProveedor();
  insumo_update["listas/proveedores/" + uid_modalProveedor] = insumos_json;
  console.log(insumos_json);
  for(key in insumos_json){
    insumo_update["listas/productos/" + key + "/"+ uid_modalProveedor] = insumos_json[key];
  }
  for (key in registro_productos){
    if(insumos_json[key] == undefined){
      console.log("Borrando");
      insumo_update["listas/productos/" + key + "/"+ uid_modalProveedor] = null;
    }
  }
  console.log(insumo_update);
  firebase.database().ref(rama_bd_insumos).update(insumo_update);
  // PAD
  pda("modificacion", rama_bd_insumos + "/listas/proveedores/" + uid_modalProveedor, registro_productos);
  alert("¡Insumos registrados con éxito!");

  resetModalInsumosProveedor();
  limpiaAgregarModalInsumosProveedor();
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
  $('#'+id_fecha_cotizacionModalInsumosProveedor).val("");
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
  } else if($('#' + id_fecha_cotizacionModalInsumosProveedor).val() == ""){
      alert("Ingresa una fecha de vencimiento");
      highLightColor(id_fecha_cotizacionModalInsumosProveedor,"#FF0000");
      return false;
  } else {
      return true;
  }
}

function existeInsumoModalInsumosProveedor(clave){
  var resp = false;
  tabla_SelectModalInsumosProveedor.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[0] == clave){
      resp = true;
    }
  });
  return resp;
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

function altaInsumoModalInsumosProveedor(){
  var insumo={};
  var f_cotizacion=$('#'+id_fecha_cotizacionModalInsumosProveedor).val().split('.');
  insumo={
    precio: deformatMoney($('#'+id_precioModalInsumosProveedor).val()),
    fecha: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime()
  };
  return insumo;
}

function datosInsumoModalInsumosProveedor(){
  var insumo=[];
  var insumo_reg = base_insumos[uid_existente_insumo];
  insumo=[
    uid_existente_insumo,
    insumo_reg["catalogo"],
    insumo_reg["descripcion"],
    json_marcas[insumo_reg["marca"]]["nombre"],
    $('#'+id_precioModalInsumosProveedor).val(),
    $('#'+id_fecha_cotizacionModalInsumosProveedor).val(),
    "<button type='button' class='editarModalInsumosProveedor btn btn-info'><i class='fas fa-edit'></i></button>",
    "<button type='button' class='eliminarModalInsumosProveedor btn btn-transparent'><i class='icono_rojo fas fa-times-circle'></i></button>"
  ]
  return insumo;
}

function recuperaDatosModalInsumosProveedor(){
  var insumosProveedor = {};
  tabla_SelectModalInsumosProveedor.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    var f_cotizacion = data[5].split('.');
    insumosProveedor[data[0]]={
      precio: deformatMoney(data[4]),
      fecha: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime()
    };
  });
  return insumosProveedor;
}

//------------------------------- DataTables -----------------------------------
function actualizarTablaBusquedaModalInsumosProveedor(json_info){
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
            "<button type='button' class='agregarModalInsumosProveedor btn btn-transparent'><i class='icono_verde fas fa-check-circle'></i></button>"
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
            { targets: [7,8], className: 'dt-body-center'}
          ]
    });
    //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
    /*
    $('#' + id_dataTable_busquedaModalInsumosProveedor + ' tbody').on( 'click', '.agregar', function () {
        var data = tabla_BusquedaModalInsumosProveedor.row( $(this).parents('tr') ).data();
        uid_existente_insumo = data[0];
        if(existeInsumoModalInsumosProveedor(uid_existente_insumo)){
          alert("Este producto ya está registrado");
        } else {
          $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
          $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
          $('#' + id_precioModalInsumosProveedor).val("");
          $('#' + id_fecha_cotizacionModalInsumosProveedor).val("");
        }
    } );
    */
}

function crearTablaSeleccionadosModalInsumosProveedor(clave){
  firebase.database().ref(rama_bd_insumos + "/listas/proveedores/"+clave).on("value",function(snapshot){
    console.log("Ejecutando firebase");
    var datos_seleccionados=[];
    if (snapshot.exists()){
      registro_productos = snapshot.val();
    } else {
      registro_productos = {};
    }
    snapshot.forEach(function(insumoSnap){
        var uid = insumoSnap.key;
        var insumo = insumoSnap.val();
        var insumo_reg = base_insumos[uid];
        var fecha = new Date(insumo.fecha);
        datos_seleccionados.push([
            uid,
            insumo_reg["catalogo"],
            insumo_reg["descripcion"],
            json_marcas[insumo_reg["marca"]]["nombre"],
            formatMoney(insumo.precio),
            fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2),
            "<button type='button' class='editarModalInsumosProveedor btn btn-info'><i class='fas fa-edit'></i></button>",
            "<button type='button' class='eliminarModalInsumosProveedor btn btn-transparent'><i class='icono_rojo fas fa-times-circle'></i></button>"
        ]);
    });

    tabla_SelectModalInsumosProveedor = $('#'+ id_dataTable_selectModalInsumosProveedor).DataTable({
        destroy: true,
        data: datos_seleccionados,
        language: idioma_espanol,
        "autoWidth": false,
        "scrollX":true,
        "columnDefs": [
            { "width": "150px", "targets": 2 },
            { "visible": false, "targets": 0 }, //campos auxiliares
            { targets: [6,7], className: 'dt-body-center'}
          ]
    });

    //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
    /*
    $('#' + id_dataTable_selectModalInsumosProveedor + ' tbody').on( 'click', '.editar', function () {
        var data = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).data();
        uid_existente_insumo = data[0];
        existe_insumo=true;
        existe_insumo_index = tabla_SelectModalInsumosProveedor.row(this).index();
        $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
        $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
        $('#' + id_precioModalInsumosProveedor).val(data[4]);
        $('#' + id_fecha_cotizacionModalInsumosProveedor).val(data[5]);
    });

    $('#' + id_dataTable_selectModalInsumosProveedor + ' tbody').on( 'click', '.eliminar', function () {
        console.log("Eliminar");
        var data = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).data();
        eliminarModalInsumosProveedor(data[0]);
    });
    */
  });
}

$(document).on('click','.agregarModalInsumosProveedor', function(){
  console.log("Agregar");
    var data = tabla_BusquedaModalInsumosProveedor.row( $(this).parents('tr') ).data();
    uid_existente_insumo = data[0];
    if(existeInsumoModalInsumosProveedor(uid_existente_insumo)){
      alert("Este producto ya está registrado");
    } else {
      $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
      $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
      $('#' + id_precioModalInsumosProveedor).val("");
      $('#' + id_fecha_cotizacionModalInsumosProveedor).val("");
    }
} );

$(document).on('click','.eliminarModalInsumosProveedor', function(){
  console.log("Eliminar");
  var data = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).data();
  // Elimina directamente de la base de datos
  //eliminarModalInsumosProveedor(data[0]);
  if(existe_insumo && data[0] == uid_existente_insumo){
    existe_insumo = false;
    uid_existente_insumo = "";
    existe_insumo_index = -1;
  }
  tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).remove().draw();
});

$(document).on('click','.editarModalInsumosProveedor', function(){
  console.log("Editar");
  var data = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).data();
  uid_existente_insumo = data[0];
  existe_insumo=true;
  existe_insumo_index = tabla_SelectModalInsumosProveedor.row(this).index();
  $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
  $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
  $('#' + id_precioModalInsumosProveedor).val(data[4]);
  $('#' + id_fecha_cotizacionModalInsumosProveedor).val(data[5]);
});

//Funcion para eliminar directamente un registro de la base de datos
function eliminarModalInsumosProveedor (clave){
  var insumo_update = {};
  var registro_antiguo = registro_productos[clave];
  insumo_update["listas/proveedores/" + uid_modalProveedor + "/" + clave] = null;
  insumo_update["listas/productos/" + clave + "/"+ uid_modalProveedor] = null;

  firebase.database().ref(rama_bd_insumos).update(insumo_update);
  // PAD
  pda("modificacion", rama_bd_insumos + "/listas/proveedores/" + uid_modalProveedor+ "/"+clave, registro_antiguo);
  alert("¡Eliminación exitosa!");
}
