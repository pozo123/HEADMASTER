// id's de los elementos HTML
var id_tab_insumo = "tabAltaInsumos";
var id_form_insumo = "formInsumos";
var id_dataTable_insumo = "dataTableInsumos";

//Definición de variables del formulario
var id_catalogoInsumos = "catalogoInsumos";
var id_descripcionInsumos = "descripcionInsumos";
var id_catfabricInsumos = "catfabricInsumos";
var id_ddl_marcaInsumos = "ddl_marcaInsumos";
var id_ddl_unidadInsumos = "ddl_unidadInsumos";
var id_ddl_clasificacionInsumos = "ddl_clasificacionInsumos";
var id_ddl_categoriaInsumos = "ddl_categoriaInsumos";
var id_ddl_proveedorInsumos = "ddl_proveedorInsumos";
var id_precioInsumos = "precioInsumos";
var id_fecha_cotizacionInsumos = "fechaCotizacionInsumos";
var id_botonAgregarProveedorInsumos = "botonAgregarProveedorInsumos";
var id_dataTableProveedoresInsumos = "dataTableProveedoresInsumos";

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
var clasificaciones;
var unidades;
var proveedores;

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
$('#' + id_tab_insumo).click(function() {
    uid_existente="";
    existe_insumo=false;
    existe_proveedor=false;
    uid_existente_proveedor="";
    existe_proveedor_index=-1;
    registro_proveedores={};
    registro_antiguo = {};
    resetFormInsumo();
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fecha_cotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
      marcas = snapshot;
      llenaDdlMarcaInsumo();
    });
    firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
      unidades = snapshot;
      llenaDdlUnidadInsumo();
    });
    firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
      categorias = snapshot;
      llenaDdlCategoriaInsumo();
    });
    firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('value',function(snapshot){
      clasificaciones = snapshot;
      llenaDdlClasificacionInsumo();
    });
    firebase.database().ref(rama_bd_insumos + "/proveedores").orderByChild('razon_social').on('value',function(snapshot){
      proveedores = snapshot;
      llenaDdlProveedorInsumo();
    });
    actualizarTablaInsumos();
    actualizarTablaProveedoresInsumo();
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_boton_AgregarInsumos).click(function() {
  //Validar datos ingresados
  if (validateFormInsumo()){
    var datos_insumo = altaProductoInsumo();
    var proveedores = recuperaDatosProveedoresInsumo();
    console.log(datos_insumo);
    console.log(proveedores);
    //Decidir si editar o dar de alta
    if (existe_insumo){ //editar
      console.log("Editar");
        firebase.database().ref(rama_bd_insumos + "/productos/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var insumo_update = {};
            //Actualizar los campos de la obra
            var path_insumo = "productos/" + uid_existente;
            insumo_update[path_insumo] = datos_insumo;

            if(registro_antiguo.marca !== datos_insumo.marca){
              insumo_update["listas/marcas/" + registro_antiguo.marca +"/"+ uid_existente] = null;
              insumo_update["listas/marcas/" + datos_insumo.marca +"/"+ uid_existente] = true;
            }
            if(registro_antiguo.unidad !== datos_insumo.unidad){
              insumo_update["listas/unidades/" + registro_antiguo.unidad +"/"+ uid_existente] = null;
              insumo_update["listas/unidades/" + datos_insumo.unidad +"/"+ uid_existente] = true;
            }
            if(registro_antiguo.clasificacion !== datos_insumo.clasificacion){
              insumo_update["listas/clasificaciones/" + registro_antiguo.clasificacion +"/"+ uid_existente] = null;
              insumo_update["listas/clasificaciones/" + datos_insumo.clasificacion +"/"+ uid_existente] = true;
            }
            if(registro_antiguo.categoria !== datos_insumo.categoria){
              insumo_update["listas/categorias/" + registro_antiguo.categoria +"/"+ uid_existente] = null;
              insumo_update["listas/categorias/" + datos_insumo.categoria +"/"+ uid_existente] = true;
            }
            insumo_update["listas/productos/" + uid_existente] = proveedores;
            for(key in proveedores){
              insumo_update["listas/proveedores/" + key + "/"+ uid_existente ] = proveedores[key];
            }
            console.log(registro_proveedores);
            for (key in registro_proveedores){
              if(proveedores[key] == undefined){
                insumo_update["listas/proveedores/" + key + "/"+ uid_existente ] = null;
              }
            }

            console.log(insumo_update);
            firebase.database().ref(rama_bd_insumos).update(insumo_update);

            // PAD
            pda("modificacion", rama_bd_insumos + "/" + path_insumo, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormInsumo();
        });
    } else { //dar de alta
      console.log("Dar de alta");
        firebase.database().ref(rama_bd_insumos + "/productos").push(datos_insumo).then(function(snapshot){
            var regKey = snapshot.key;
            var insumo_update = {};
            var marca = $('#' + id_ddl_marcaInsumos + ' option:selected').val();
            var unidad = $('#' + id_ddl_unidadInsumos + ' option:selected').val();
            var clasificacion = $('#' + id_ddl_clasificacionInsumos + ' option:selected').val();
            var categoria = $('#' + id_ddl_categoriaInsumos + ' option:selected').val();
            // Actualizar listas
            insumo_update["listas/unidades/" + unidad +"/"+ regKey] = true;
            insumo_update["listas/marcas/" + marca +"/"+ regKey] = true;
            insumo_update["listas/clasificaciones/" + clasificacion +"/"+ regKey] = true;
            insumo_update["listas/categorias/" + categoria +"/"+ regKey] = true;
            insumo_update["listas/productos/" + regKey ] = proveedores;
            for(key in proveedores){
              insumo_update["listas/proveedores/" + key + "/"+ regKey ] = proveedores[key];
            }

            console.log(insumo_update);
            firebase.database().ref(rama_bd_insumos).update(insumo_update);

            // PAD
            pda("alta", rama_bd_insumos + "/productos/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormInsumo();
        });
    };
  };
});
//Funcionalidad del boton 'Borrar todo'
$('#' + id_boton_BorrarInsumos).click(function() {
  resetFormInsumo();
  existe_insumo=false;
  existe_proveedor=false;
});

$('#' + id_botonAgregarProveedorInsumos).click(function() {
  if(validateProveedorInsumo()){
    if(existe_proveedor){
      tabla_proveedorInsumo.row(existe_proveedor_index).data(altaProveedorInsumo()).draw();
    }else{
      tabla_proveedorInsumo.row.add(altaProveedorInsumo()).draw();
    }
  }
  resetFormProveedorInsumo();
  existe_proveedor= false;
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_catalogoInsumos).keypress(function(e){
    charactersAllowed(" 0123456789",e)
});

$('#' + id_descripcionInsumos).change(function(){
    $('#' + id_descripcionInsumos).val($('#' + id_descripcionInsumos).val().toUpperCase());
});

$('#' + id_descripcionInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/",e)
});

$('#' + id_catfabricInsumos).change(function(){
    $('#' + id_catfabricInsumos).val($('#' + id_catfabricInsumos).val().toUpperCase());
});

$('#' + id_catfabricInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-/0123456789",e)
});

$('#' + id_precioInsumos).keypress(function(e){
    charactersAllowed("0123456789.",e);
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

// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
function resetFormInsumo(){
  $('#' + id_catalogoInsumos).val("");
  $('#' + id_descripcionInsumos).val("");
  $('#' + id_catfabricInsumos).val("");
  $('#' + id_ddl_marcaInsumos).val("");
  $('#' + id_ddl_unidadInsumos).val("");
  $('#' + id_ddl_clasificacionInsumos).val("");
  $('#' + id_ddl_categoriaInsumos).val("");
  $('#' + id_ddl_proveedorInsumos).val("");
  $('#' + id_precioInsumos).val("");
  $('#' + id_fecha_cotizacionInsumos).val("")
  existe_insumo=false;
}

//Validar que no esté vacío nungún campo
function validateFormInsumo(){
    if ($('#' + id_catalogoInsumos).val() == ""){
        alert("Escribe el número de catálogo");
        highLightColor(id_catalogoInsumos,"#FF0000");
        return false;
    } else if($('#' + id_descripcionInsumos).val() == ""){
        alert("Escribe la descripcion del producto");
        highLightColor(id_descripcionInsumos,"#FF0000");
        return false;
    } else if($('#' + id_catfabricInsumos).val() == ""){
        alert("Escribe el catfabric del producto");
        highLightColor(id_catfabricInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_marcaInsumos + 'option:selected').val() == ""){
        alert("Selecciona una marca para el producto.");
        highLightColor(id_ddl_marcaInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_unidadInsumos + 'option:selected').val() == ""){
        alert("Selecciona una unidad para el producto.");
        highLightColor(id_ddl_unidadInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_clasificacionInsumos + 'option:selected').val() == ""){
        alert("Selecciona una clasificacion para el producto.");
        highLightColor(id_ddl_clasificacionInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_categoriaInsumos + 'option:selected').val() == ""){
        alert("Selecciona una categoría para el producto.");
        highLightColor(id_ddl_categoriaInsumos,"#FF0000");
        return false;
    } else {
        return true;
    }
}

function validateProveedorInsumo(){
  if ($('#' + id_ddl_proveedorInsumos + 'option:selected').val() == ""){
    alert("Selecciona un proveedor.");
    highLightColor(id_ddl_proveedorInsumos,"#FF0000");
    return false;
  } else if($('#' + id_precioInsumos).val() == ""){
      alert("Escribe el precio del proveedor para este producto");
      highLightColor(id_precioInsumos,"#FF0000");
      return false;
  } else if($('#' + id_fecha_cotizacionInsumos).val() == ""){
      alert("Escribe una fecha de vigencia para el precio");
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
      catfabric: $('#' + id_catfabricInsumos).val(),
      marca: $('#' + id_ddl_marcaInsumos + ' option:selected').val(),
      unidad: $('#' + id_ddl_unidadInsumos + ' option:selected').val(),
      clasificacion: $('#' + id_ddl_clasificacionInsumos + ' option:selected').val(),
      categoria: $('#' + id_ddl_categoriaInsumos + ' option:selected').val()
  };
  return insumo;
};

function altaProveedorInsumo(){
  var proveedor = [];
  var f_cotizacion = $('#' + id_fecha_cotizacionInsumos).val().split('.');
  var icon_class = "'icono_rojo fas fa-times-circle'";
  proveedor = [
    $('#'+id_ddl_proveedorInsumos + ' option:selected').val(),
    deformatMoney($('#'+id_precioInsumos).val()),
    new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime(),
    "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>",
    "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>"
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
                insumo.catfabric,
                insumo.marca,
                marcas.val()[insumo.marca]["nombre"],
                insumo.unidad,
                unidades.val()[insumo.unidad]["nombre"],
                insumo.clasificacion,
                clasificaciones.val()[insumo.clasificacion]["nombre"],
                insumo.categoria,
                categorias.val()[insumo.categoria]["nombre"]
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
                { "visible": false, "targets": 0 }, //campos auxiliares
                { "visible": false, "targets": 4 },
                { "visible": false, "targets": 6 },
                { "visible": false, "targets": 8 },
                { "visible": false, "targets": 10 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_insumo + ' tbody').on( 'click', '.editar', function () {
            highLightProductoInsumo();
            var data = tabla_insumo.row( $(this).parents('tr') ).data();
            resetFormInsumo();
            existe_insumo = true;
            uid_existente = data[0];
            $('#' + id_catalogoInsumos ).val(data[1]);
            $('#' + id_descripcionInsumos ).val(data[2]);
            $('#' + id_catfabricInsumos ).val(data[3]);
            $('#' + id_ddl_marcaInsumos ).val(data[4]);
            $('#' + id_ddl_unidadInsumos ).val(data[6]);
            $('#' + id_ddl_clasificacionInsumos ).val(data[8]);
            $('#' + id_ddl_categoriaInsumos ).val(data[10]);
            actualizarTablaProveedoresInsumo();
        } );
    });
}

function actualizarTablaProveedoresInsumo(){
    firebase.database().ref(rama_bd_insumos + "/listas/productos/"+uid_existente).on("value",function(snapshot){
        if (snapshot.exists()){
          registro_proveedores = snapshot.val();
        } else {
          registro_proveedores = {};
        }
        var datos_proveedores = [];
        icon = "'icono_verde fas fa-check-circle'";
        snapshot.forEach(function(proveedorSnap){
            var uid = proveedorSnap.key;
            var proveedor = proveedorSnap.val();
            datos_proveedores.push([
                uid,
                proveedores[uid]["razon_social"],
                proveedor.precio,
                proveedor.fecha,
                "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>",
                "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
            ]);
        });

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
                { "visible": false, "targets": 0 } //campos auxiliares
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTableProveedoresInsumos + ' tbody').on( 'click', '.editar', function () {
            highLightProveedorInsumo();
            var data = tabla_proveedorInsumo.row( $(this).parents('tr') ).data();
            resetFormProveedorInsumo();
            existe_proveedor = true;
            uid_existente_proveedor = data[0];
            existe_proveedor_index = tabla_proveedorInsumo.row(this).index();
            $('#' + id_ddl_proveedorInsumos).val(data[0]);
            $('#' + id_precioInsumos).val(data[2]);
            $('#' + id_fecha_cotizacionInsumos).val(data[3]);
        } );
    });
}

function recuperaDatosProveedoresInsumo(){
  var proveedoresInsumo = {};
  $('#' + id_dataTableProveedoresInsumos).DataTable().rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    console.log(data);
    var f_cotizacion = data[3].split('.');
    proveedoresInsumo[data[0]]={
      precio: deformatMoney(data[2]),
      fecha: new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime()
    };
  });
  return proveedoresInsumo;
}

function highLightProductoInsumo(){
  highLight(id_catalogoInsumos);
  highLight(id_descripcionInsumos);
  highLight(id_catfabricInsumos);
  highLight(id_ddl_marcaInsumos);
  highLight(id_ddl_unidadInsumos);
  highLight(id_ddl_clasificacionInsumos);
  highLight(id_ddl_categoriaInsumos);
}

function llenaDdlMarcaInsumo(){
  // Llenado del ddl de marca
  $('#' + id_ddl_marcaInsumos).empty();
  var select = document.getElementById(id_ddl_marcaInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var marca;
  marcas.forEach(function(snapChild){
    option = document.createElement('option');
    option.value = snapChild.key;
    option.text = snapChild.val().nombre;
    select.appendChild(option);
  });
}

function llenaDdlUnidadInsumo(){
  // Llenado del ddl de unidad
  $('#' + id_ddl_unidadInsumos).empty();
  var select = document.getElementById(id_ddl_unidadInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var unidad;
  unidades.forEach(function(snapChild){
      option = document.createElement('option');
      option.value = snapChild.key;
      option.text = snapChild.val().nombre;
      select.appendChild(option);
  });
}

function llenaDdlCategoriaInsumo(){
  // Llenado del ddl de categoria
  $('#' + id_ddl_categoriaInsumos).empty();
  var select = document.getElementById(id_ddl_categoriaInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var categoria;
  categorias.forEach(function(snapChild){
      option = document.createElement('option');
      option.value = snapChild.key;
      option.text = snapChild.val().nombre;
      select.appendChild(option);
  });
}

function llenaDdlClasificacionInsumo(){
  // Llenado del ddl de proveedor
  $('#' + id_ddl_clasificacionInsumos).empty();
  var select = document.getElementById(id_ddl_clasificacionInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var clasificacion;
  clasificaciones.forEach(function(snapChild){
      option = document.createElement('option');
      option.value = snapChild.key;
      option.text = snapChild.val().nombre;
      select.appendChild(option);
  });
}

function llenaDdlProveedorInsumo(){
  // Llenado del ddl de proveedor
  $('#' + id_ddl_proveedorInsumos).empty();
  var select = document.getElementById(id_ddl_proveedorInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var proveedor;
  proveedores.forEach(function(snapChild){
      option = document.createElement('option');
      option.value = snapChild.key;
      option.text = snapChild.val().razon_social;
      select.appendChild(option);
  });
}
