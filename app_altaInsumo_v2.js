// id's de los elementos HTML
var id_tab_insumo = "tabAltaInsumos";
var id_form_insumo = "formInsumos";
var id_dataTable_insumo = "dataTableInsumos";
var id_dataTableProveedoresInsumos = "dataTableProveedoresInsumos";

//Definición de variables del formulario

var id_descripcionInsumos = "descripcionInsumos";
var id_ddl_categoriaInsumos = "ddl_categoriaInsumos";
var id_ddl_familiaInsumos = "ddl_familiaInsumos";
var id_ddl_subfamiliaInsumos = "ddl_subfamiliaInsumos";
var id_ddl_unidadInsumos = "ddl_unidadInsumos";
var id_libreInsumos = "libreInsumos";
var id_catalogoInsumos = "catalogoInsumos";
var id_satInsumos = "satInsumos";
var id_cb_editarInsumos = "cb_editarInsumos";
var id_div_cb_editarInsumos = "div_cb_editarInsumos";

var id_ddl_proveedorInsumos = "ddl_proveedorInsumos";
var id_precioInsumos = "precioInsumos";
var id_descuentoInsumos = "descuentoInsumos";
var id_precioFinalInsumos = "precioFinalInsumos";
var id_ddl_marcaProveedorInsumos = "ddl_marcaProveedorInsumos";
var id_catalogoProveedorInsumos = "catalogoProveedorInsumos";
var id_fecha_ingresoCotizacionInsumos = "fechaIngresoCotizacionInsumos";
var id_fecha_cotizacionInsumos = "fechaCotizacionInsumos";
var id_botonAgregarProveedorInsumos = "botonAgregarProveedorInsumos";

var id_boton_AgregarInsumos = "botonAgregarInsumos";
var id_boton_BorrarInsumos = "botonBorrarInsumos";

//Variables globales para controlar edición
var existe_insumo;
var uid_existente;

var existe_proveedor;
var uid_existente_proveedor;
var existe_proveedor_index;

var registro_proveedores;
var registro_antiguo;

var tabla_proveedorInsumo;

var marcas;
var categorias;
var unidades;
var proveedores;

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
$('#' + id_tab_insumo).click(function() {
    // inicializar variables
    uid_existente="NOHAY"; // se eligió este valor para evitar problemas con la consulta firebase
    existe_insumo=false;
    existe_proveedor=false;
    uid_existente_proveedor="";
    existe_proveedor_index=-1;
    registro_proveedores={};
    registro_antiguo = {};
    resetFormInsumo(); // limpiar formulario
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_ingresoCotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_cotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    // Recuperar la información necesaria de la base de datos
    firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
      marcas = snapshot;
      llenaDdlGeneric(id_ddl_marcaProveedorInsumos, marcas, "nombre");
    });
    firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
      unidades = snapshot;
      llenaDdlGeneric(id_ddl_unidadInsumos, unidades, "nombre");
    });
    firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
      categorias = snapshot;
      llenaDdlGeneric(id_ddl_categoriaInsumos, categorias, "nombre");
    });
    firebase.database().ref(rama_bd_insumos + "/proveedores").orderByChild('razon_social').on('value',function(snapshot){
      proveedores = snapshot;
      llenaDdlGeneric(id_ddl_proveedorInsumos, proveedores, "razon_social");
    });
    // Inicializar las tablas
    actualizarTablaInsumos();
    actualizarTablaProveedoresInsumo();
});

//Funcionalidad del boton 'Borrar todo'
$('#' + id_boton_BorrarInsumos).click(function() {
  resetFormInsumo();
  existe_insumo=false;
  existe_proveedor=false;
  actualizarTablaProveedoresInsumo();
});

// Funcionalidad del boton 'Registrar proveedor'
$('#' + id_botonAgregarProveedorInsumos).click(function() {
  if(validateProveedorInsumo()){ // validar la información del formulario
    if(!existeProveedorInsumos($('#'+id_ddl_proveedorInsumos+' option:selected').val(), $('#'+id_ddl_marcaProveedorInsumos+' option:selected').val())){ // validar que no exista dubla proveedor-marca
      if(existe_proveedor){ // editar
        tabla_proveedorInsumo.row(existe_proveedor_index).data(altaProveedorInsumo()).draw();
      }else{ // agregar renglon
        tabla_proveedorInsumo.row.add(altaProveedorInsumo()).draw();
      }
      resetProveedorInsumo(); // limpiar formulario
      existe_proveedor= false;
    } else {
      alert("Este producto ya tiene un registro para este proveedor con la misma marca");
    }
  }
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_boton_AgregarInsumos).click(function() {
  if (validateFormInsumo()){ // validar datos ingresados
    var datos_insumo = altaProductoInsumo();
    var proveedores_json = recuperaDatosProveedoresInsumo();
    //console.log(datos_insumo);
    //console.log(proveedores_json);
    existeInsumo($('#'+id_catalogoInsumos).val()).then(function(catalogoExistente){ // validar que no exista otro insumo con el mismo número de catálogo
      if(!catalogoExistente){ // número de catálogo disponible
        if (existe_insumo){ // editar insumo
          firebase.database().ref(rama_bd_insumos + "/productos/" + uid_existente).once("value").then(function(snapshot){ // recuperar registro antiguo
              var registro_antiguo = snapshot.val();
              var insumo_update = {};
              // Actualizar los campos del insumo
              var path_insumo = "productos/" + uid_existente;
              insumo_update[path_insumo] = datos_insumo;
              // Actualizar las listas
              if(registro_antiguo.unidad !== datos_insumo.unidad){
                insumo_update["listas/unidades/" + registro_antiguo.unidad +"/"+ uid_existente] = null;
                insumo_update["listas/unidades/" + datos_insumo.unidad +"/"+ uid_existente] = true;
              }
              if(registro_antiguo.categoria !== datos_insumo.categoria || registro_antiguo.familia !== datos_insumo.familia || registro_antiguo.subfamilia !== datos_insumo.subfamilia){
                insumo_update["listas/categorias/" + registro_antiguo.categoria +"/"+ registro_antiguo.familia +"/"+ registro_antiguo.subfamilia +"/"+ uid_existente] = null;
                insumo_update["listas/categorias/" + datos_insumo.categoria +"/"+ datos_insumo.familia +"/"+ datos_insumo.subfamilia +"/"+ uid_existente] = true;
              }

              insumo_update["listas/productos/" + uid_existente] = proveedores_json;

              // Eliminar los registros de las listas de cada proveedor y marca
              for (key in registro_proveedores){
                if(proveedores_json[key] == undefined){ // eliminar los existentes
                  insumo_update["listas/proveedores/" + key + "/"+ uid_existente ] = null;
                  for (key2 in registro_proveedores[key]){
                    insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = null;
                  }
                } else {
                  for (key2 in registro_proveedores[key]){ // eliminar las marcas existentes de ese proveedor
                    if(proveedores_json[key][key2] == undefined){
                      insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = null;
                    }
                  }
                }
              }
              // Agregar los registros a las listas de cada proveedor y marca
              for(key in proveedores_json){
                for (key2 in proveedores_json[key]){
                  insumo_update["listas/proveedores/" + key + "/"+ uid_existente + "/"+ key2 ] = proveedores_json[key][key2];
                  insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = true;
                  insumo_update["historial/productos/" + uid_existente + "/" + key + "/" + key2 + "/" + proveedores_json[key][key2]["fecha_ingreso"]] = proveedores_json[key][key2];
                  insumo_update["historial/proveedores/" + key + "/" + uid_existente + "/" + key2 + "/" + proveedores_json[key][key2]["fecha_ingreso"]] = proveedores_json[key][key2];
                }
              }
              console.log(insumo_update);
              firebase.database().ref(rama_bd_insumos).update(insumo_update); // guardar los cambios en la base de datos

              // PAD
              pda("modificacion", rama_bd_insumos + "/" + path_insumo, registro_antiguo); // crear una pista de auditoria
              alert("¡Edición exitosa!");
              resetFormInsumo(); // limpiar formulario
              actualizarTablaProveedoresInsumo(); // limpiar tabla de proveedores
          });
        } else { // dar de alta insumo
          firebase.database().ref(rama_bd_insumos + "/productos").push(datos_insumo).then(function(snapshot){ // agregar el insumo a la base de datos
              var regKey = snapshot.key;
              var insumo_update = {};
              var unidad = $('#' + id_ddl_unidadInsumos + ' option:selected').val();
              var categoria = $('#' + id_ddl_categoriaInsumos + ' option:selected').val();
              var familia = $('#' + id_ddl_familiaInsumos + ' option:selected').val();
              var subfamilia = $('#' + id_ddl_subfamiliaInsumos + ' option:selected').val();
              // Actualizar listas
              insumo_update["listas/unidades/" + unidad +"/"+ regKey] = true;
              insumo_update["listas/categorias/" + categoria +"/"+ familia +"/"+ subfamilia +"/"+ regKey] = true;
              insumo_update["listas/productos/" + regKey ] = proveedores_json;
              for(key in proveedores_json){
                for (key2 in proveedores_json[key]){
                  insumo_update["listas/proveedores/" + key + "/"+ regKey + "/"+ key2 ] = proveedores_json[key][key2];
                  insumo_update["listas/marcas/" + key2 +"/"+ regKey] = true;
                  insumo_update["historial/productos/" + regKey + "/" + key + "/" + key2 + "/" + proveedores_json[key][key2]["fecha_ingreso"]] = proveedores_json[key][key2];
                  insumo_update["historial/proveedores/" + key + "/" + regKey + "/" + key2 + "/" + proveedores_json[key][key2]["fecha_ingreso"]] = proveedores_json[key][key2];
                }
              }

              console.log(insumo_update);
              firebase.database().ref(rama_bd_insumos).update(insumo_update); // guardar las listas en la base de datos

              // PAD
              pda("alta", rama_bd_insumos + "/productos/" + regKey, ""); // crear una pista de auditoria
              alert("¡Alta exitosa!");
              resetFormInsumo(); // limpiar el formulario
              actualizarTablaProveedoresInsumo(); // limpiar la tabla de proveedores
          });
        };
      } else {
          alert("Ya existe un producto registrado con ese número de catálogo");
      }
    });
  };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ----------------------------
// Función para llenar el ddl familia y actualizar el número de catálogo cuando
// se selecciona una categoría
$('#' + id_ddl_categoriaInsumos).change(function(){
  $('#'+id_ddl_subfamiliaInsumos).empty();
  llenaDdlGeneric(id_ddl_familiaInsumos, categorias.child($('#'+id_ddl_categoriaInsumos+' option:selected').val()+'/familias'), "nombre");
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos(id_ddl_categoriaInsumos, id_ddl_familiaInsumos, id_ddl_subfamiliaInsumos, id_libreInsumos));
});

// Función para llenar el ddl subfamilia y actualizar el número de catálogo
// cuando se selecciona una subfamilia
$('#' + id_ddl_familiaInsumos).change(function(){
  llenaDdlGeneric(id_ddl_subfamiliaInsumos, categorias.child($('#'+id_ddl_categoriaInsumos+' option:selected').val()+'/familias/' + $('#'+id_ddl_familiaInsumos+' option:selected').val()+'/subfamilias'), "nombre");
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos(id_ddl_categoriaInsumos, id_ddl_familiaInsumos, id_ddl_subfamiliaInsumos, id_libreInsumos));
});

// Función para actualizar el número de catálogo cuando se selecciona una
// subfamilia
$('#' + id_ddl_subfamiliaInsumos).change(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos(id_ddl_categoriaInsumos, id_ddl_familiaInsumos, id_ddl_subfamiliaInsumos, id_libreInsumos));
});

// Función para actualizar el número de catálogo cuando se presiona una tecla en
// el campo libre
$('#' + id_libreInsumos).keypress(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos(id_ddl_categoriaInsumos, id_ddl_familiaInsumos, id_ddl_subfamiliaInsumos, id_libreInsumos));
});

// Funcion para actualizar el número de catálogo cuando cambia el valor del
// campo libre
$('#' + id_libreInsumos).change(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos(id_ddl_categoriaInsumos, id_ddl_familiaInsumos, id_ddl_subfamiliaInsumos, id_libreInsumos));
});

// Función para homologar todas los caracteres del campo descripción a mayúsculas
$('#' + id_descripcionInsumos).change(function(){
  $('#' + id_descripcionInsumos).val($('#' + id_descripcionInsumos).val().toUpperCase());
});

// Función para delimitar los caracteres permitidos en el campo descripción
$('#' + id_descripcionInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/",e)
});

// Función para homologar todas los caracteres del campo numero SAT a mayúsculas
$('#' + id_satInsumos).change(function(){
    $('#' + id_satInsumos).val($('#' + id_satInsumos).val().toUpperCase());
});

// Función para delimitar los caracteres permitidos en el campo numero SAT
$('#' + id_satInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-/0123456789",e)
});

$('#' + id_cb_editarInsumos).change(function(){
  if($('#' + id_cb_editarInsumos).prop('checked')){
    enableAllInsumos();
  } else {
    disableAllInsumos();
  }
});

// Función para delimitar los caracteres permitidos en el campo precio
$('#' + id_precioInsumos).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

// Función para actualizar el precio final cuando se cambia el monto en el campo
// precio
$('#' + id_precioInsumos).change(function(){
  if($('#'+id_descuentoInsumos).val() == ""){
		$('#' + id_descuentoInsumos).val(0);
	}
  $('#' + id_precioFinalInsumos).val(formatMoney($('#' + id_precioInsumos).val() * (1-$('#' + id_descuentoInsumos).val()*0.01)));
});

// Función para quitar el signo de pesos cuando se selecciona el campo precio
$('#' + id_precioInsumos).focus(function(){
  if($('#'+id_precioInsumos).val() !== ""){
		$('#' + id_precioInsumos).val(deformatMoney($('#' + id_precioInsumos).val()));
	}
});

// Función para agregar el signo de pesos cuando se deselecciona el campo precio
$('#' + id_precioInsumos).focusout(function(){
  if($('#'+id_precioInsumos).val() !== ""){
		$('#' + id_precioInsumos).val(formatMoney($('#' + id_precioInsumos).val()));
	}
});

// Funcion para actualizar el precio final cuando se cambia el monto en el campo
// descuento
$('#' + id_descuentoInsumos).change(function(){
  if($('#'+id_descuentoInsumos).val() == ""){
		$('#' + id_descuentoInsumos).val(0);
	} else {
    $('#' + id_descuentoInsumos).val(parseFloat($('#' + id_descuentoInsumos).val()).toFixed(2));
  }
  $('#' + id_precioFinalInsumos).val(formatMoney(deformatMoney($('#' + id_precioInsumos).val()) * (1 - $('#' + id_descuentoInsumos).val()*0.01)));
});

// Función para delimitar los caracteres permitidos en el campo libre
$('#' + id_libreInsumos).keypress(function(e){
    charactersAllowed(" 0123456789",e)
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
// Función para borrar la información de los campos del formulario del insumo
// y reiniciar variables auxiliares
function resetFormInsumo(){
  $('#' + id_descripcionInsumos).val("");
  $('#' + id_ddl_categoriaInsumos).val("");
  $('#' + id_ddl_familiaInsumos).val("");
  $('#' + id_ddl_subfamiliaInsumos).val("");
  $('#' + id_ddl_unidadInsumos).val("");
  $('#' + id_libreInsumos).val("");
  $('#' + id_catalogoInsumos).val("");
  $('#' + id_satInsumos).val("");
  existe_insumo=false;
  uid_existente="NOHAY";
  resetProveedorInsumo();
  $('#' + id_div_cb_editarInsumos).addClass('hidden');
  $('#' + id_div_cb_editarInsumos).prop('checked', true);
  enableAllInsumos();
  // actualizarTablaProveedoresInsumo();
}

// Función para borrar la información de los campos del formulario del proveedor
// y reiniciar variables auxiliares
function resetProveedorInsumo(){
  $('#' + id_ddl_proveedorInsumos).val("");
  $('#' + id_ddl_marcaProveedorInsumos).val("");
  $('#' + id_precioInsumos).val("");
  $('#' + id_descuentoInsumos).val("");
  $('#' + id_precioFinalInsumos).val("");
  $('#' + id_catalogoProveedorInsumos).val("");
  $('#' + id_fecha_cotizacionInsumos).val("");
  $('#' + id_fecha_ingresoCotizacionInsumos).val("")
  existe_proveedor=false;
  existe_proveedor_index = -1;
  uid_existente_proveedor = "";
}

// Función para verificar que la información del insumo está completa
function validateFormInsumo(){
    if($('#' + id_descripcionInsumos).val() == ""){
        alert("Escribe la descripcion del producto");
        highLightColor(id_descripcionInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_categoriaInsumos + ' option:selected').val() == ""){
        alert("Selecciona una categoría para el producto.");
        highLightColor(id_ddl_categoriaInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_familiaInsumos + ' option:selected').val() == ""){
        alert("Selecciona una familias para el producto.");
        highLightColor(id_ddl_familiaInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_subfamiliaInsumos + ' option:selected').val() == ""){
        alert("Selecciona una subfamilia para el producto.");
        highLightColor(id_ddl_subfamiliaInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_unidadInsumos + ' option:selected').val() == ""){
        alert("Selecciona una unidad para el producto.");
        highLightColor(id_ddl_unidadInsumos,"#FF0000");
        return false;
    } else if ($('#' + id_libreInsumos).val() == ""){
          alert("Escribe el número libre para el producto");
          highLightColor(id_catalogoInsumos,"#FF0000");
          return false;
    } else if ($('#' + id_catalogoInsumos).val() == ""){
          alert("Escribe el número de catálogo");
          highLightColor(id_catalogoInsumos,"#FF0000");
          return false;
    } else {
        return true;
    }
}

// Función para verificar que la información del proveedor está completa
function validateProveedorInsumo(){
  if ($('#' + id_ddl_proveedorInsumos + ' option:selected').val() == ""){
    alert("Selecciona un proveedor.");
    highLightColor(id_ddl_proveedorInsumos,"#FF0000");
    return false;
  } else if($('#' + id_ddl_marcaProveedorInsumos+' option:selected').val() == ""){
      alert("Selecciona una marca");
      highLightColor(id_ddl_marcaProveedorInsumos,"#FF0000");
      return false;
  } else if($('#' + id_precioInsumos).val() == ""){
      alert("Escribe el precio del proveedor para este producto");
      highLightColor(id_precioInsumos,"#FF0000");
      return false;
  } else if($('#' + id_descuentoInsumos).val() == ""){
      alert("Escribe el descuento del proveedor para este producto");
      highLightColor(id_precioInsumos,"#FF0000");
      return false;
  } else if($('#' + id_precioFinalInsumos).val() == ""){
      alert("Escribe el precio final para este producto");
      highLightColor(id_precioInsumos,"#FF0000");
      return false;
  } else if($('#' + id_fecha_ingresoCotizacionInsumos).val() == ""){
      alert("Escribe una fecha de ingreso para el precio");
      highLightColor(fechaIngresoCotizacionInsumos,"#FF0000");
      return false;
  } else if($('#' + id_fecha_cotizacionInsumos).val() == ""){
      alert("Escribe una fecha de vigencia de la cotizacion");
      highLightColor(id_fecha_cotizacionInsumos,"#FF0000");
      return false;
  } else {
      return true;
  }
}

// Función para generar el json para un insumo con la información del formulario
function altaProductoInsumo(){
  var insumo = {};
  insumo = {
      descripcion: $('#' + id_descripcionInsumos).val(),
      catalogo: $('#' + id_catalogoInsumos).val(),
      sat: $('#' + id_satInsumos).val(),
      unidad: $('#' + id_ddl_unidadInsumos + ' option:selected').val(),
      categoria: $('#' + id_ddl_categoriaInsumos + ' option:selected').val(),
      familia: $('#' + id_ddl_familiaInsumos + ' option:selected').val(),
      subfamilia: $('#' + id_ddl_subfamiliaInsumos + ' option:selected').val(),
  };
  return insumo;
};

// Función para generar el array con la información del formulario para agregar un
// proveedor a la tabla
function altaProveedorInsumo(){
  var proveedor = [];
  proveedor = [
    $('#'+id_ddl_proveedorInsumos + ' option:selected').val(),
    $('#'+id_ddl_proveedorInsumos + ' option:selected').text(),
    $('#'+id_ddl_marcaProveedorInsumos + ' option:selected').val(),
    $('#'+id_ddl_marcaProveedorInsumos + ' option:selected').text(),
    $('#'+id_precioInsumos).val(),
    $('#'+id_descuentoInsumos).val(),
    // $('#'+id_precioFinalInsumos).val(),
    $('#' + id_fecha_ingresoCotizacionInsumos).val(),
    $('#' + id_fecha_cotizacionInsumos).val(),
    $('#'+id_catalogoProveedorInsumos).val(),
    "<button type='button' class='editarProveedoresInsumos btn btn-info'><i class='fas fa-edit'></i></button>",
    "<button type='button' class='eliminarProveedoresInsumos btn btn-transparent'><i class='icono_rojo fas fa-times-circle'></i></button>"
  ];
  return proveedor;
}

// Función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaInsumos(){
    firebase.database().ref(rama_bd_insumos + "/productos").on("value",function(snapshot){
        var datos_insumos = [];
        snapshot.forEach(function(insumoSnap){
            var uid = insumoSnap.key;
            var insumo = insumoSnap.val();
            datos_insumos.push([
                insumoSnap.key,
                insumo.catalogo,
                insumo.descripcion,
                insumo.categoria,
                categorias.val()[insumo.categoria]["nombre"],
                insumo.familia,
                categorias.val()[insumo.categoria]["familias"][insumo.familia]["nombre"],
                insumo.subfamilia,
                categorias.val()[insumo.categoria]["familias"][insumo.familia]["subfamilias"][insumo.subfamilia]["nombre"],
                insumo.unidad,
                unidades.val()[insumo.unidad]["nombre"],
                insumo.sat,
            ]);
        });

        tabla_insumo = $('#'+ id_dataTable_insumo).DataTable({
            destroy: true,
            data: datos_insumos,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 2 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": [0,3,5,7,9] }, //campos auxiliares
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editarInsumo btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });
    });
}

// Funcion para editar un registro de insumo
// Llena todos los campos del formulario con los datos de la tabla
$(document).on('click','.editarInsumo', function(){
    highLightProductoInsumo();
    var data = tabla_insumo.row( $(this).parents('tr') ).data();
    resetFormInsumo();
    existe_insumo = true;
    uid_existente = data[0];
    llenaDdlGeneric(id_ddl_familiaInsumos, categorias.child(data[3]+'/familias'), "nombre");
    llenaDdlGeneric(id_ddl_subfamiliaInsumos, categorias.child(data[3]+'/familias/' + data[5] +'/subfamilias'), "nombre");
    $('#' + id_descripcionInsumos ).val(data[2]);
    $('#' + id_ddl_categoriaInsumos ).val(data[3]);
    $('#' + id_ddl_familiaInsumos ).val(data[5]);
    $('#' + id_ddl_subfamiliaInsumos ).val(data[7]);
    $('#' + id_ddl_unidadInsumos ).val(data[9]);
    $('#' + id_catalogoInsumos ).val(data[1]);
    $('#' + id_satInsumos ).val(data[11]);
    $('#' + id_libreInsumos ).val(data[1].slice(-2));
    actualizarTablaProveedoresInsumo();
    $('#' + id_div_cb_editarInsumos).removeClass('hidden');
    $('#' + id_div_cb_editarInsumos).prop('checked', false);
    disableAllInsumos();
});

// Función para actualizar y configurar la tabla de proveedores
function actualizarTablaProveedoresInsumo(){
    firebase.database().ref(rama_bd_insumos + "/listas/productos/"+uid_existente).once("value",function(snapshot){
        if (snapshot.exists()){
          registro_proveedores = snapshot.val();
        } else {
          registro_proveedores = {};
        }
        var datos_proveedores = [];
        var fecha_in;
        var fecha_cot;
        snapshot.forEach(function(proveedorSnap){
            var uid = proveedorSnap.key;
            var proveedor = proveedorSnap.val();
            for(key in proveedor){
              fecha_in = new Date(proveedor[key].fecha_ingreso);
              fecha_cot = new Date(proveedor[key].fecha_cotizacion);
              datos_proveedores.push([
                  uid,
                  proveedores.val()[uid]["razon_social"],
                  key,
                  marcas.val()[key]["nombre"],
                  formatMoney(proveedor[key].precio),
                  proveedor[key].descuento,
                  fecha_in.getFullYear() +"."+ ("0" + (fecha_in.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_in.getDate()).slice(-2),
                  fecha_cot.getFullYear() +"."+ ("0" + (fecha_cot.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha_cot.getDate()).slice(-2),
                  proveedor[key].catalogo_proveedor,
                  "<button type='button' class='editarProveedoresInsumos btn btn-info'><i class='fas fa-edit'></i></button>",
                  "<button type='button' class='eliminarProveedoresInsumos btn btn-transparent'><i class='icono_rojo fas fa-times-circle'></i></button>"
              ]);
            }
        });
        // console.log(datos_proveedores);
        tabla_proveedorInsumo = $('#'+ id_dataTableProveedoresInsumos).DataTable({
            destroy: true,
            data: datos_proveedores,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 2 },
                {
                    targets: [-1,-2],
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": [0,2] } //campos auxiliares
              ]
        });
    });
}

// Función para editar un registro proveedor-marca
// Llena todos los campos del formulario con los datos de la tabla
$(document).on('click','.editarProveedoresInsumos', function(){
    highLightProveedorInsumo();
    var data = tabla_proveedorInsumo.row( $(this).parents('tr') ).data();
    resetProveedorInsumo();
    existe_proveedor = true;
    uid_existente_proveedor = data[0];
    existe_proveedor_index = tabla_proveedorInsumo.row( $(this).parents('tr') ).index();
    $('#' + id_ddl_proveedorInsumos).val(data[0]);
    $('#' + id_precioInsumos).val(data[4]);
    $('#' + id_descuentoInsumos).val(data[5]);
    $('#' + id_precioFinalInsumos).val(formatMoney(deformatMoney(data[4])*(1- data[5]*0.01)) );
    $('#' + id_ddl_marcaProveedorInsumos).val(data[2]);
    $('#' + id_catalogoProveedorInsumos).val(data[8]);
    $('#' + id_fecha_ingresoCotizacionInsumos).val(data[6]);
    $('#' + id_fecha_cotizacionInsumos).val(data[7]);
});

// Función para eliminar un renglón de tabla al hacer clic en el icono rojo
$(document).on('click','.eliminarProveedoresInsumos', function(){
    //console.log("Eliminar");
    var data = tabla_proveedorInsumo.row( $(this).parents('tr') ).data();
    if(existe_proveedor && data[0] == uid_existente_proveedor){ // revisar si se estaba editando
      existe_proveedor = false;
      uid_existente_proveedor = "";
      existe_proveedor_index = -1;
    }
    tabla_proveedorInsumo.row( $(this).parents('tr') ).remove().draw(); // eliminar renglón
});

// Funcion para extraer todos los datos de la tabla proveedores
function recuperaDatosProveedoresInsumo(){
  var proveedoresInsumo = {};
  var marcaInsumo = {};
  $('#' + id_dataTableProveedoresInsumos).DataTable().rows().iterator('row', function(context, index){ // recorrer todos los renglones
    var data = this.row(index).data();
    //console.log(data);
    var f_ingreso = data[6].split('.');
    var f_cotizacion = data[7].split('.');
    marcaInsumo = { // generar el json con los campos correspondientes
      precio: deformatMoney(data[4]),
      descuento: parseFloat(data[5]),
      fecha_ingreso: new Date(f_ingreso[0], f_ingreso[1] - 1, f_ingreso[2]).getTime(),
      fecha_cotizacion: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime(),
      catalogo_proveedor: data[8]
    };
    if(proveedoresInsumo[data[0]] == undefined){ // crear el json para el proveedor si está vacío
      proveedoresInsumo[data[0]]={};
      proveedoresInsumo[data[0]][data[2]] = marcaInsumo;
    }else{
      proveedoresInsumo[data[0]][data[2]] = marcaInsumo;
    }
  });
  return proveedoresInsumo;
}

// Funcion para resaltar los campos del formulario correspondientes solo al insumo
function highLightProductoInsumo(){
  highLight(id_descripcionInsumos);
  highLight(id_ddl_categoriaInsumos);
  highLight(id_ddl_familiaInsumos);
  highLight(id_ddl_subfamiliaInsumos);
  highLight(id_ddl_unidadInsumos);
  highLight(id_catalogoInsumos);
  highLight(id_libreInsumos);
  highLight(id_satInsumos);
}

// Funcion para resaltar los campos del formulario correspondientes al proveedor
function highLightProveedorInsumo(){
  highLight(id_ddl_proveedorInsumos);
  highLight(id_precioInsumos);
  highLight(id_descuentoInsumos);
  highLight(id_precioFinalInsumos);
  highLight(id_ddl_marcaProveedorInsumos);
  highLight(id_catalogoProveedorInsumos);
}

// Funcion generica para llenar un ddl con un snap y el nombre del campo deseado
function llenaDdlGeneric(item_id, snap, nombre){
  // Llenado del ddl de marca
  $('#' + item_id).empty();
  var select = document.getElementById(item_id);
  var option = document.createElement('option');
  //option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  snap.forEach(function(snapChild){
    option = document.createElement('option');
    option.value = snapChild.key;
    option.text = snapChild.val()[nombre];
    select.appendChild(option);
  });
}

// Funcion para generar el numero de catalogo con los campos del formulario
function generaCodigoCatalogoInsumos(item_cat, item_fam, item_sub, item_libre){
  var codigo = "";
  cat = $('#'+item_cat+' option:selected').val();
  fam = $('#'+item_fam+' option:selected').val();
  sub = $('#'+item_sub+' option:selected').val();
  libre = $('#'+item_libre).val()
  if(cat !== ""){
    codigo = codigo + categorias.val()[cat]["codigo"];
    if(fam !== "" && fam !== undefined){
      codigo = codigo + categorias.val()[cat]["familias"][fam]["codigo"];
      if(sub !== "" && sub !== undefined){
        codigo = codigo + categorias.val()[cat]["familias"][fam]["subfamilias"][sub]["codigo"]+libre;
      }
    }
  }
  return codigo;
}

// Función para verificar si ya existe un insumo con el mismo número de catálogo
function existeInsumo(catalogo){
  var promise = new Promise(function(resolve, reject) {
    firebase.database().ref(rama_bd_insumos + "/productos").orderByChild("catalogo").equalTo(catalogo).once("value",function(snapshot){ // extraer todos los insumos con ese catalogo
      var respuesta;
      if(snapshot.exists()){ // si existen insumos con ese catalogo
        if(existe_insumo){ // si se esta editando un registro
          var aux = snapshot.val();
          var cont = 0;
          for (key in aux){
            if(key !== uid_existente){ // si el insumo no corresponde al que se esta editando
              respuesta=true; // existe otro insumo con ese numero de catalogo
            } else {
              respuesta=false; // el insumo es el mismo al que se está editando
            }
            cont += 1;
          }
          if(cont >1){ // si más de un insumo con ese numero de catalogo
            respuesta=true;
          }
        } else {
          respuesta=true; // existe otro insumo con ese numero de catalogo
        }
      }else{
        respuesta=false;
      }
      resolve(respuesta);
    }).catch(function(error){
      reject(Error("No se pudo acceder a la base de datos"));
    });;
  });
  return promise;
}

// Funcion para verificar si ya existe una dubla proveedor-marca en la tabla
function existeProveedorInsumos(proveedor, marca){
  var respuesta = false;
  $('#' + id_dataTableProveedoresInsumos).DataTable().rows().iterator('row', function(context, index){ //recorrer todos los renglones
    var data = this.row(index).data();
    if(data[0] == proveedor && data[2] == marca){ // checar si coinciden proveedor y marca
      if(existe_proveedor){ // checar si se está editando un registro
        if(index !== existe_proveedor_index){ // si no corresponde al registro que se está editando
          respuesta=true; // si existe otro insumo con el mismo numero de catálogo
        }
      }else{
        respuesta=true; // el catalogo encontrado es de un insumo existente
      }
    }
  });
  return respuesta;
}

function disableAllInsumos(){
  $('#' + id_descripcionInsumos).prop('disabled',true);
  $('#' + id_ddl_categoriaInsumos).prop('disabled',true);
  $('#' + id_ddl_familiaInsumos).prop('disabled',true);
  $('#' + id_ddl_subfamiliaInsumos).prop('disabled',true);
  $('#' + id_ddl_unidadInsumos).prop('disabled',true);
  $('#' + id_libreInsumos).prop('disabled',true);
  $('#' + id_satInsumos).prop('disabled',true);
}

function enableAllInsumos(){
  $('#' + id_descripcionInsumos).prop('disabled', false);
  $('#' + id_ddl_categoriaInsumos).prop('disabled', false);
  $('#' + id_ddl_familiaInsumos).prop('disabled', false);
  $('#' + id_ddl_subfamiliaInsumos).prop('disabled', false);
  $('#' + id_ddl_unidadInsumos).prop('disabled', false);
  $('#' + id_libreInsumos).prop('disabled', false);
  $('#' + id_satInsumos).prop('disabled', false);
}
