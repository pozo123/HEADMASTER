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
    uid_existente="NOHAY";
    existe_insumo=false;
    existe_proveedor=false;
    uid_existente_proveedor="";
    existe_proveedor_index=-1;
    registro_proveedores={};
    registro_antiguo = {};
    resetFormInsumo();
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_ingresoCotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_cotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
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

$('#' + id_botonAgregarProveedorInsumos).click(function() {
  if(validateProveedorInsumo()){
    if(!existeProveedorInsumos($('#'+id_ddl_proveedorInsumos+' option:selected').val(), $('#'+id_ddl_marcaProveedorInsumos+' option:selected').val())){
      if(existe_proveedor){
        tabla_proveedorInsumo.row(existe_proveedor_index).data(altaProveedorInsumo()).draw();
      }else{
        tabla_proveedorInsumo.row.add(altaProveedorInsumo()).draw();
      }
      resetProveedorInsumo();
      existe_proveedor= false;
    } else {
      alert("Este producto ya tiene un registro para este proveedor con la misma marca");
    }
  }
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_boton_AgregarInsumos).click(function() {
  //Validar datos ingresados
  if (validateFormInsumo()){
    var datos_insumo = altaProductoInsumo();
    var proveedores_json = recuperaDatosProveedoresInsumo();
    //console.log(datos_insumo);
    //console.log(proveedores_json);
    //Decidir si editar o dar de alta
    existeInsumo($('#'+id_catalogoInsumos).val()).then(function(catalogoExistente){
      if(!catalogoExistente){
        if (existe_insumo){ //editar
          //console.log("Editar");
          firebase.database().ref(rama_bd_insumos + "/productos/" + uid_existente).once("value").then(function(snapshot){
              var registro_antiguo = snapshot.val();
              var insumo_update = {};
              //Actualizar los campos de la obra
              var path_insumo = "productos/" + uid_existente;
              insumo_update[path_insumo] = datos_insumo;

              if(registro_antiguo.unidad !== datos_insumo.unidad){
                insumo_update["listas/unidades/" + registro_antiguo.unidad +"/"+ uid_existente] = null;
                insumo_update["listas/unidades/" + datos_insumo.unidad +"/"+ uid_existente] = true;
              }
              if(registro_antiguo.categoria !== datos_insumo.categoria || registro_antiguo.familia !== datos_insumo.familia || registro_antiguo.subfamilia !== datos_insumo.subfamilia){
                insumo_update["listas/categorias/" + registro_antiguo.categoria +"/"+ registro_antiguo.familia +"/"+ registro_antiguo.subfamilia +"/"+ uid_existente] = null;
                insumo_update["listas/categorias/" + datos_insumo.categoria +"/"+ datos_insumo.familia +"/"+ datos_insumo.subfamilia +"/"+ uid_existente] = true;
              }

              insumo_update["listas/productos/" + uid_existente] = proveedores_json;

              //console.log(registro_proveedores);
              for (key in registro_proveedores){
                if(proveedores_json[key] == undefined){
                  insumo_update["listas/proveedores/" + key + "/"+ uid_existente ] = null;
                  for (key2 in registro_proveedores[key]){
                    insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = null;
                  }
                } else {
                  for (key2 in registro_proveedores[key]){
                    if(proveedores_json[key][key2] == undefined){
                      insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = null;
                    }
                  }
                }
              }

              for(key in proveedores_json){
                for (key2 in proveedores_json[key]){
                  insumo_update["listas/proveedores/" + key + "/"+ uid_existente + "/"+ key2 ] = proveedores_json[key][key2];
                  insumo_update["listas/marcas/" + key2 +"/"+ uid_existente] = true;
                }
              }
              console.log(insumo_update);
              firebase.database().ref(rama_bd_insumos).update(insumo_update);

              // PAD
              pda("modificacion", rama_bd_insumos + "/" + path_insumo, registro_antiguo);
              alert("¡Edición exitosa!");
              resetFormInsumo();
              actualizarTablaProveedoresInsumo();
          });
        } else { //dar de alta
          //console.log("Dar de alta");
          firebase.database().ref(rama_bd_insumos + "/productos").push(datos_insumo).then(function(snapshot){
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
                }
              }

              console.log(insumo_update);
              firebase.database().ref(rama_bd_insumos).update(insumo_update);

              // PAD
              pda("alta", rama_bd_insumos + "/productos/" + regKey, "");
              alert("¡Alta exitosa!");
              resetFormInsumo();
              actualizarTablaProveedoresInsumo();
          });
        };
      } else {
          alert("Ya existe un producto registrado con ese número de catálogo");
      }
    });
  };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ----------------------------
$('#' + id_ddl_categoriaInsumos).change(function(){
  $('#'+id_ddl_subfamiliaInsumos).empty();
  llenaDdlGeneric(id_ddl_familiaInsumos, categorias.child($('#'+id_ddl_categoriaInsumos+' option:selected').val()+'/familias'), "nombre");
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos());
});

$('#' + id_ddl_familiaInsumos).change(function(){
  llenaDdlGeneric(id_ddl_subfamiliaInsumos, categorias.child($('#'+id_ddl_categoriaInsumos+' option:selected').val()+'/familias/' + $('#'+id_ddl_familiaInsumos+' option:selected').val()+'/subfamilias'), "nombre");
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos());
});

$('#' + id_ddl_subfamiliaInsumos).change(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos());
});

$('#' + id_libreInsumos).keypress(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos());
});

$('#' + id_libreInsumos).change(function(){
  $('#'+id_catalogoInsumos).val(generaCodigoCatalogoInsumos());
});

$('#' + id_descripcionInsumos).change(function(){
  $('#' + id_descripcionInsumos).val($('#' + id_descripcionInsumos).val().toUpperCase());
});

$('#' + id_descripcionInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/",e)
});

$('#' + id_satInsumos).change(function(){
    $('#' + id_satInsumos).val($('#' + id_satInsumos).val().toUpperCase());
});

$('#' + id_satInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-/0123456789",e)
});

$('#' + id_precioInsumos).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#' + id_precioInsumos).change(function(){
  if($('#'+id_descuentoInsumos).val() == ""){
		$('#' + id_descuentoInsumos).val(0);
	}
  $('#' + id_precioFinalInsumos).val(formatMoney($('#' + id_precioInsumos).val() * (1-$('#' + id_descuentoInsumos).val()*0.01)));
});

$('#' + id_precioInsumos).focus(function(){
  if($('#'+id_precioInsumos).val() !== ""){
		$('#' + id_precioInsumos).val(deformatMoney($('#' + id_precioInsumos).val()));
	}
});

$('#' + id_precioInsumos).focusout(function(){
  if($('#'+id_precioInsumos).val() !== ""){
		$('#' + id_precioInsumos).val(formatMoney($('#' + id_precioInsumos).val()));
	}
});

$('#' + id_descuentoInsumos).change(function(){
  if($('#'+id_descuentoInsumos).val() == ""){
		$('#' + id_descuentoInsumos).val(0);
	}
  $('#' + id_precioFinalInsumos).val(formatMoney(deformatMoney($('#' + id_precioInsumos).val()) * (1 - $('#' + id_descuentoInsumos).val()*0.01)));
});

$('#' + id_libreInsumos).keypress(function(e){
    charactersAllowed(" 0123456789",e)
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
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
  // actualizarTablaProveedoresInsumo();
}

function resetProveedorInsumo(){
  $('#' + id_ddl_proveedorInsumos).val("");
  $('#' + id_ddl_marcaProveedorInsumos).val("");
  $('#' + id_precioInsumos).val("");
  $('#' + id_descuentoInsumos).val("");
  $('#' + id_precioFinalInsumos).val("");
  $('#' + id_catalogoProveedorInsumos).val("");
  $('#' + id_fecha_cotizacionInsumos).val("");
  $('#' + id_fecha_ingresoCotizacionInsumos).val("")
}

//Validar que no esté vacío nungún campo
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

//Construir el JSON de direccion para la obra
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

// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
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
});

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
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": [0,2] } //campos auxiliares
              ]
        });
    });
}

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
    $('#' + id_fecha_cotizacionInsumos).val(data[6]);
    $('#' + id_fecha_ingresoCotizacionInsumos).val(data[7]);
});

$(document).on('click','.eliminarProveedoresInsumos', function(){
    //console.log("Eliminar");
    var data = tabla_proveedorInsumo.row( $(this).parents('tr') ).data();
    if(existe_proveedor && data[0] == uid_existente_proveedor){
      existe_proveedor = false;
      uid_existente_proveedor = "";
      existe_proveedor_index = -1;
    }
    tabla_proveedorInsumo.row( $(this).parents('tr') ).remove().draw();
});

function recuperaDatosProveedoresInsumo(){
  var proveedoresInsumo = {};
  var marcaInsumo = {};
  $('#' + id_dataTableProveedoresInsumos).DataTable().rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    //console.log(data);
    var f_ingreso = data[6].split('.');
    var f_cotizacion = data[7].split('.');
    marcaInsumo = {
      precio: deformatMoney(data[4]),
      descuento: data[5],
      fecha_ingreso: new Date(f_ingreso[0], f_ingreso[1] - 1, f_ingreso[2]).getTime(),
      fecha_cotizacion: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime(),
      catalogo_proveedor: data[8]
    };
    if(proveedoresInsumo[data[0]] == undefined){
      proveedoresInsumo[data[0]]={};
      proveedoresInsumo[data[0]][data[2]] = marcaInsumo;
    }else{
      proveedoresInsumo[data[0]][data[2]] = marcaInsumo;
    }
  });
  return proveedoresInsumo;
}

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

function highLightProveedorInsumo(){
  highLight(id_ddl_proveedorInsumos);
  highLight(id_precioInsumos);
  highLight(id_descuentoInsumos);
  highLight(id_precioFinalInsumos);
  highLight(id_ddl_marcaProveedorInsumos);
  highLight(id_catalogoProveedorInsumos);
}

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

function generaCodigoCatalogoInsumos(){
  var codigo = "";
  cat = $('#'+id_ddl_categoriaInsumos+' option:selected').val();
  fam = $('#'+id_ddl_familiaInsumos+' option:selected').val();
  sub = $('#'+id_ddl_subfamiliaInsumos+' option:selected').val();
  libre = $('#'+id_libreInsumos).val()
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

function existeInsumo(catalogo){
  var promise = new Promise(function(resolve, reject) {
    firebase.database().ref(rama_bd_insumos + "/productos").orderByChild("catalogo").equalTo(catalogo).once("value",function(snapshot){
      var respuesta;
      if(snapshot.exists()){
        if(existe_insumo){
          var aux = snapshot.val();
          var cont = 0;
          for (key in aux){
            if(key !== uid_existente){
              respuesta=true;
            } else {
              respuesta=false;
            }
            cont += 1;
          }
          if(cont >1){
            respuesta=true;
          }
        } else {
          respuesta=true;
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

function existeProveedorInsumos(proveedor, marca){
  var respuesta = false;
  $('#' + id_dataTableProveedoresInsumos).DataTable().rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[0] == proveedor && data[2] == marca){
      if(existe_proveedor){
        if(index !== existe_proveedor_index){
          respuesta=true;
        }
      }else{
        respuesta=true;
      }
    }
  });
  return respuesta;
}
