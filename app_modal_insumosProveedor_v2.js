// ------------------ Campos Modal Suministros --------------------------------
var id_modalInsumosProveedor = "modalInsumosProveedor";
var id_dataTable_selectModalInsumosProveedor = "dataTableSeleccionadosModalInsumosProveedor";
var id_dataTable_busquedaModalInsumosProveedor = "dataTableBusquedaModalInsumosProveedor";

var id_ddl_buscaCategoriaModalInsumosProveedor = "ddl_buscaCategoriaModalInsumosProveedor";
var id_ddl_buscaFamiliaModalInsumosProveedor = "ddl_buscaFamiliaModalInsumosProveedor";
var id_ddl_buscaSubfamiliaModalInsumosProveedor = "ddl_buscaSubfamiliaModalInsumosProveedor";
var id_buscaCatalogoModalInsumosProveedor = "buscaCatalogoModalInsumosProveedor";
var id_boton_limpiarModalInsumosProveedor = "botonLimpiarFiltrosModalInsumosProveedor";

var id_catalogoModalInsumosProveedor = "catalogoModalInsumosProveedor";
var id_descripcionModalInsumosProveedor = "descripcionModalInsumosProveedor";
var id_precioModalInsumosProveedor = "precioModalInsumosProveedor";
var id_descuentoModalInsumosProveedor = "descuentoModalInsumosProveedor";
var id_precioFinalModalInsumosProveedor = "precioFinalModalInsumosProveedor";
var id_ddl_marcaModalInsumosProveedor = "ddl_marcaModalInsumosProveedor";
var id_catalogoProveedorModalInsumosProveedor = "catalogoProveedorModalInsumosProveedor";
var id_fecha_ingresoCotizacionModalInsumosProveedor = "fechaIngresoCotizacionModalInsumosProveedor";
var id_fecha_cotizacionModalInsumosProveedor = "fechaCotizacionModalInsumosProveedor";
var id_boton_agregarModalInsumosProveedor = "botonAgregarModalInsumosProveedor";

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
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaFamiliaModalInsumosProveedor).empty();
  $('#'+id_ddl_buscaSubfamiliaModalInsumosProveedor).empty();
  resetModalInsumosProveedor();
  uid_modalProveedor = clave_proveedor;
  uid_existente_insumo="";
  existe_insumo = false;
  registro_productos = {};
  base_insumos={};
  base_filtrados={};
  filtros={};

  jQuery('#' + id_fecha_ingresoCotizacionModalInsumosProveedor).datetimepicker(
      {timepicker:false, weeks:true,format:'Y.m.d'}
  );

  jQuery('#' + id_fecha_cotizacionModalInsumosProveedor).datetimepicker(
      {timepicker:false, weeks:true,format:'Y.m.d'}
  );
  $('#'+id_fecha_ingresoCotizacionModalInsumosProveedor).val("");
  $('#'+id_fecha_cotizacionModalInsumosProveedor).val("");

  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    json_marcas=marcas.val();
    llenaDdlGeneric(id_ddl_marcaModalInsumosProveedor , marcas, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    json_categorias=categorias.val();
    llenaDdlGeneric(id_ddl_buscaCategoriaModalInsumosProveedor, categorias, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
    json_unidades=unidades.val();
  });
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
    actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
    crearTablaSeleccionadosModalInsumosProveedor(uid_modalProveedor);
    $('#' + id_modalInsumosProveedor).modal('show');
  });
  // Funcion ejecutada cuando se muestra el modal
  $('#'+ id_modalInsumosProveedor).on('shown.bs.modal', function () {
    tabla_BusquedaModalInsumosProveedor.columns.adjust(); // ajustar columnas
    tabla_SelectModalInsumosProveedor.columns.adjust(); // ajustar columnas
  })
}

//----------------------------Botones -----------------------------------------
$('#' + id_boton_agregarModalInsumosProveedor).click(function() {
  if(validateagregarModalInsumosProveedor()){
    if(!existeInsumoModalInsumosProveedor(uid_existente_insumo, $('#'+id_ddl_marcaModalInsumosProveedor+' option:selected').val())){
      if(existe_insumo){
        tabla_SelectModalInsumosProveedor.row(existe_insumo_index).data(datosInsumoModalInsumosProveedor()).draw();
      }else{
        tabla_SelectModalInsumosProveedor.row.add(datosInsumoModalInsumosProveedor()).draw();
      }
      limpiaAgregarModalInsumosProveedor();
      existe_insumo= false;
    } else {
      alert("Este insumo ya tiene un registro para este proveedor con la misma marca");
    }
  }
});

$('#' + id_boton_limpiarModalInsumosProveedor).click(function() {
  limpiaFiltrosModalInsumosProveedor();
  actualizarTablaBusquedaModalInsumosProveedor(base_insumos);
});

$('#' + id_boton_guardarModalInsumosProveedor).click(function() {
  insumo_update = {};
  var insumos_json = recuperaDatosModalInsumosProveedor();
  insumo_update["listas/proveedores/" + uid_modalProveedor] = insumos_json;
  //console.log(insumos_json);
  // Eliminar los registros de las listas de cada marca
  for (key in registro_productos){
    if(insumos_json[key] == undefined){ //eliminar los existentes
      insumo_update["listas/productos/" + key + "/"+ uid_modalProveedor] = null;
      for (key2 in registro_productos[key]){
        insumo_update["listas/marcas/" + key2 +"/"+ key] = null;
      }
    } else {
      for(key2 in registro_productos[key]){// eliminar las marcas existentes de ese proveedor
        if(insumos_json[key][key2] == undefined){
          insumo_update["listas/marcas/" + key2 + "/"+ key] = null;
        }
      }
    }
  }
  // Agregar los registros a las listas de cada proveedor y marca
  for(key in insumos_json){
    insumo_update["listas/productos/" + key + "/"+ uid_modalProveedor] = insumos_json[key];
    for(key2 in insumos_json[key]){
      insumo_update["listas/marcas/" + key2 + "/"+ key] = true;
      insumo_update["historial/productos/" + key + "/" + uid_modalProveedor + "/" + key2 + "/" + insumos_json[key][key2]["fecha_ingreso"]] = insumos_json[key][key2];
      insumo_update["historial/proveedores/" + uid_modalProveedor + "/" + key + "/" + key2 + "/" + insumos_json[key][key2]["fecha_ingreso"]] = insumos_json[key][key2];
    }
  }

  console.log(insumo_update);
  firebase.database().ref(rama_bd_insumos).update(insumo_update);
  // PAD
  pda("modificacion", rama_bd_insumos + "/listas/proveedores/" + uid_modalProveedor, registro_productos);
  alert("¡Insumos registrados con éxito!");

  limpiaAgregarModalInsumosProveedor();
});

//------------------------------------------------------------------------------
//------------------------- Filtros y formulario -------------------------------
// Función para llenar el ddl familia y filtrar los productos disponibles por
// categoría
$('#' + id_ddl_buscaCategoriaModalInsumosProveedor ).change(function(){
  $('#'+id_ddl_buscaSubfamiliaModalInsumosProveedor ).empty();
  llenaDdlGeneric(id_ddl_buscaFamiliaModalInsumosProveedor, categorias.child($('#'+id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val()+'/familias'), "nombre");
  if($('#' + id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["categoria"];
  } else {
    filtros["categoria"]=$('#' + id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

// Función para llenar el ddl subfamilia y filtrar los productos disponibles por
// familia
$('#' + id_ddl_buscaFamiliaModalInsumosProveedor ).change(function(){
  llenaDdlGeneric(id_ddl_buscaSubfamiliaModalInsumosProveedor, categorias.child($('#'+id_ddl_buscaCategoriaModalInsumosProveedor+' option:selected').val()+'/familias/' + $('#'+id_ddl_buscaFamiliaModalInsumosProveedor+' option:selected').val()+'/subfamilias'), "nombre");
  if($('#' + id_ddl_buscaFamiliaModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["familia"];
  } else {
    filtros["familia"]=$('#' + id_ddl_buscaFamiliaModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

// Función para filtrar los productos disponibles por subfamilia
$('#' + id_ddl_buscaSubfamiliaModalInsumosProveedor).change(function(){
  if($('#' + id_ddl_buscaSubfamiliaModalInsumosProveedor+' option:selected').val() == ""){
    delete filtros["subfamilia"];
  } else {
    filtros["subfamilia"]=$('#' + id_ddl_buscaSubfamiliaModalInsumosProveedor+' option:selected').val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

// Función para filtrar los productos disponibles por catalogo
$('#' + id_buscaCatalogoModalInsumosProveedor).change(function(){
  if($('#' + id_buscaCatalogoModalInsumosProveedor).val() == ""){
    delete filtros["catalogo"];
  } else {
    filtros["catalogo"]= $('#' + id_buscaCatalogoModalInsumosProveedor).val();
  }
  base_filtrados = filtraGeneric(base_insumos, filtros);
  actualizarTablaBusquedaModalInsumosProveedor(base_filtrados);
});

$('#' + id_precioModalInsumosProveedor).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Función para actualizar el precio final cuando se cambia el monto en el campo
// precio
$('#' + id_precioModalInsumosProveedor).change(function(){
  if($('#'+id_descuentoModalInsumosProveedor).val() == ""){
		$('#' + id_descuentoModalInsumosProveedor).val(0);
	}
  $('#' + id_precioFinalModalInsumosProveedor).val(formatMoney($('#' + id_precioModalInsumosProveedor).val() * (1-$('#' + id_descuentoModalInsumosProveedor ).val()*0.01)));
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

// Funcion para actualizar el precio final cuando se cambia el monto en el campo
// descuento
$('#' + id_descuentoModalInsumosProveedor ).change(function(){
  if($('#'+id_descuentoModalInsumosProveedor ).val() == ""){
		$('#' + id_descuentoModalInsumosProveedor ).val(0);
	}else{
    $('#' + id_descuentoModalInsumosProveedor).val(parseFloat($('#' + id_descuentoModalInsumosProveedor).val()).toFixed(2));
  }
  $('#' + id_precioFinalModalInsumosProveedor ).val(formatMoney(deformatMoney($('#' + id_precioModalInsumosProveedor ).val()) * (1 - $('#' + id_descuentoModalInsumosProveedor ).val()*0.01)));
});

// ----------------------Funciones necesarias ----------------------------------
function resetModalInsumosProveedor(){
  limpiaFiltrosModalInsumosProveedor();
  limpiaAgregarModalInsumosProveedor();
}

function limpiaFiltrosModalInsumosProveedor(){
  $('#'+id_ddl_buscaCategoriaModalInsumosProveedor).val("");
  $('#'+id_ddl_buscaFamiliaModalInsumosProveedor ).val("");
  $('#'+id_ddl_buscaSubfamiliaModalInsumosProveedor ).val("");
  $('#'+id_buscaCatalogoModalInsumosProveedor).val("");
  filtros={};
}

function limpiaAgregarModalInsumosProveedor(){
  $('#'+id_catalogoModalInsumosProveedor).val("");
  $('#'+id_descripcionModalInsumosProveedor).val("");
  $('#'+id_precioModalInsumosProveedor).val("");
  $('#'+id_descuentoModalInsumosProveedor).val("");
  $('#'+id_precioFinalModalInsumosProveedor).val("");
  //$('#'+id_ddl_marcaModalInsumosProveedor).val("");
  $('#'+id_catalogoProveedorModalInsumosProveedor).val("");
  //$('#'+id_fecha_ingresoCotizacionModalInsumosProveedor).val("");
  //$('#'+id_fecha_cotizacionModalInsumosProveedor).val("");
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
  } else if($('#' + id_descuentoModalInsumosProveedor).val() == ""){
      alert("Ingresa un precio");
      highLightColor(id_descuentoModalInsumosProveedor,"#FF0000");
      return false;
  } else if($('#' + id_precioFinalModalInsumosProveedor).val() == ""){
      alert("Ingresa un precio");
      highLightColor(id_precioFinalModalInsumosProveedor,"#FF0000");
      return false;
  } else if($('#' + id_ddl_marcaModalInsumosProveedor + ' option:selected').val() == ""){
      alert("Selecciona una marca");
      highLightColor(id_ddl_marcaModalInsumosProveedor,"#FF0000");
      return false;
  } else if($('#' + id_fecha_ingresoCotizacionModalInsumosProveedor ).val() == ""){
      alert("Ingresa una fecha de ingreso de la cotizacion");
      highLightColor(id_fecha_ingresoCotizacionModalInsumosProveedor ,"#FF0000");
      return false;
  } else if($('#' + id_fecha_cotizacionModalInsumosProveedor).val() == ""){
      alert("Ingresa una fecha de vencimiento");
      highLightColor(id_fecha_cotizacionModalInsumosProveedor,"#FF0000");
      return false;
  } else {
      return true;
  }
}

function existeInsumoModalInsumosProveedor(clave, marca){
  var resp = false;
  tabla_SelectModalInsumosProveedor.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[0] == clave && data[3]==marca){ //checar si coinciden insumo y marca
      if(existe_insumo){ // checar si se está editando un registro
        if(index !== existe_insumo_index){ // si no corresponde al registro que se está editando
          resp=true; // si existe otro insumo con el mismo numero de catálogo
        }
      } else {
        resp = true;
      }
    }
  });
  return resp;
}

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

function datosInsumoModalInsumosProveedor(){
  var insumo=[];
  var insumo_reg = base_insumos[uid_existente_insumo];
  insumo=[
    uid_existente_insumo,
    insumo_reg["catalogo"],
    insumo_reg["descripcion"],
    $('#'+id_ddl_marcaModalInsumosProveedor + ' option:selected').val(),
    $('#'+id_ddl_marcaModalInsumosProveedor + ' option:selected').text(),
    $('#'+id_precioModalInsumosProveedor).val(),
    $('#'+id_descuentoModalInsumosProveedor).val(),
    $('#'+id_fecha_ingresoCotizacionModalInsumosProveedor).val(),
    $('#'+id_fecha_cotizacionModalInsumosProveedor).val(),
    $('#'+id_catalogoProveedorModalInsumosProveedor).val(),
    "<button type='button' class='editarModalInsumosProveedor btn btn-info'><i class='fas fa-edit'></i></button>",
    "<button type='button' class='eliminarModalInsumosProveedor btn btn-danger'><i class='fas fa-trash'></i></button>"
  ]
  return insumo;
}

function recuperaDatosModalInsumosProveedor(){
  var insumosProveedor = {};
  tabla_SelectModalInsumosProveedor.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    var f_ingreso = data[7].split('.');
    var f_cotizacion = data[8].split('.');
    if(insumosProveedor[data[0]] == undefined){
      insumosProveedor[data[0]] = {};
    }
    insumosProveedor[data[0]][data[3]]={
      precio: deformatMoney(data[5]),
      descuento: data[6],
      fecha_ingreso: new Date(f_ingreso[0], f_ingreso[1] - 1, f_ingreso[2]).getTime(),
      fecha_cotizacion: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime(),
      catalogo_proveedor: data[9]
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
            json_categorias[insumo["categoria"]]["nombre"],
            json_categorias[insumo["categoria"]]["familias"][insumo["familia"]]["nombre"],
            json_categorias[insumo["categoria"]]["familias"][insumo["familia"]]["subfamilias"][insumo["subfamilia"]]["nombre"],
            json_unidades[insumo["unidad"]]["nombre"],
            json_info[key]["sat"],
            "<button type='button' class='agregarModalInsumosProveedor btn btn-transparent'><i class='icono_verde fas fa-check-circle'></i></button>"
        ]);
    }
    tabla_BusquedaModalInsumosProveedor = $('#'+ id_dataTable_busquedaModalInsumosProveedor).DataTable({
        destroy: true,
        data: datos_busqueda,
        language: idioma_espanol,
        //autoWidth: false,
        order: [[1,"asc"]],
        columnDefs: [
            { width: "150px", targets: 2 },
            { visible: false, targets: 0 }, //campos auxiliares
            { targets: [7,8], className: 'dt-body-center'}
        ],
        scrollY:        "300px",
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,
        fixedColumns:   {
            rightColumns: 1
        }
    });
    //tabla_BusquedaModalInsumosProveedor.columns.adjust();
}

$(document).on('click','.agregarModalInsumosProveedor', function(){
  //console.log("Agregar");
    var data = tabla_BusquedaModalInsumosProveedor.row( $(this).parents('tr') ).data();
    existe_insumo = false;
    uid_existente_insumo = data[0];
    limpiaAgregarModalInsumosProveedor();
    $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
    $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
});

function crearTablaSeleccionadosModalInsumosProveedor(clave){
  firebase.database().ref(rama_bd_insumos + "/listas/proveedores/"+clave).on("value",function(snapshot){
    //console.log("Ejecutando firebase");
    var datos_seleccionados=[];
    if (snapshot.exists()){
      registro_productos = snapshot.val();
    } else {
      registro_productos = {};
    }
    snapshot.forEach(function(insumoSnap){
      var insumo = insumoSnap.val();
      var uid = insumoSnap.key;
      var insumo_reg = base_insumos[uid];
      for(key in insumo){

        var fecha_ingreso = new Date(insumo[key].fecha_ingreso);
        var fecha_vencimiento = new Date(insumo[key].fecha_cotizacion);
        datos_seleccionados.push([
            uid,
            insumo_reg["catalogo"],
            insumo_reg["descripcion"],
            key,
            json_marcas[key]["nombre"],
            formatMoney(insumo[key].precio),
            insumo[key].descuento,
            fecha_ingreso.getFullYear() +"."+ ("0" + (fecha_ingreso.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_ingreso.getDate()).slice(-2),
            fecha_vencimiento.getFullYear() +"."+ ("0" + (fecha_vencimiento.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_vencimiento.getDate()).slice(-2),
            insumo[key]["catalogo_proveedor"],
            "<button type='button' class='editarModalInsumosProveedor btn btn-info'><i class='fas fa-edit'></i></button>",
            "<button type='button' class='eliminarModalInsumosProveedor btn btn-danger'><i class='fas fa-trash'></i></button>"
        ]);
      };
      //tabla_SelectModalInsumosProveedor.columns.adjust();
    });

    tabla_SelectModalInsumosProveedor = $('#'+ id_dataTable_selectModalInsumosProveedor).DataTable({
        destroy: true,
        data: datos_seleccionados,
        language: idioma_espanol,
        //autoWidth: false,
        order: [[1,"asc"]],
        columnDefs: [
            { width: "150px", targets: 2 },
            { visible: false, targets: [0,3] }, //campos auxiliares
            { targets: [9,10,11], className: 'dt-body-center'}
        ],
        scrollY:        "300px",
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,
        fixedColumns:   {
            rightColumns: 2
        }
    });
  });
}

$(document).on('click','.eliminarModalInsumosProveedor', function(){
  //console.log("Eliminar");
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
  //console.log("Editar");
  var data = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).data();
  uid_existente_insumo = data[0];
  existe_insumo=true;
  existe_insumo_index = tabla_SelectModalInsumosProveedor.row( $(this).parents('tr') ).index();
  console.log(existe_insumo_index);
  $('#' + id_catalogoModalInsumosProveedor).val(data[1]);
  $('#' + id_descripcionModalInsumosProveedor).val(data[2]);
  $('#' + id_precioModalInsumosProveedor).val(data[5]);
  $('#'+id_descuentoModalInsumosProveedor).val(data[6]);
  $('#'+id_precioFinalModalInsumosProveedor).val(formatMoney(deformatMoney(data[5]) * (1 - data[6]*0.01)) );
  $('#'+id_ddl_marcaModalInsumosProveedor).val(data[3]);
  $('#'+id_catalogoProveedorModalInsumosProveedor).val(data[9]);
  $('#'+id_fecha_ingresoCotizacionModalInsumosProveedor).val(data[7]);
  $('#'+id_fecha_cotizacionModalInsumosProveedor).val(data[8]);
});

/*
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
*/
