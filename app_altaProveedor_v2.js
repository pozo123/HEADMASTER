// id's de los elementos HTML
var id_tab_proveedor = "tabAltaProveedores";
var id_form_proveedor = "formProveedores";
var id_dataTable_proveedor = "dataTableProveedores";

//Definición de variables del formulario
var id_rfcProveedor = "rfcProveedores";
var id_razonSocialProveedor = "razonSocialProveedores";
var id_direccionProveedores = "direccionProveedores";
var id_contactoProveedores = "contactoProveedores";
var id_telefonoProveedores = "telefonoProveedores";
var id_correoProveedores = "correoProveedores";
var id_boton_AgregarContactoProveedores = "botonAgregarContactoProveedores";
var id_dataTableContactosProveedores = "dataTableContactosProveedores";

var id_boton_AgregarProveedoress = "botonAgregarProveedores";
var id_boton_BorrarProveedores = "botonBorrarProveedores";

//Variables globales para controlar edición
var existe_proveedor;
var uid_existente;

var existe_contacto;
var uid_existente_contacto;
var existe_contacto_index;

var registro_contactos;
var registro_antiguo;

var tabla_contactoProveedor;

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
$('#' + id_tab_insumo).click(function() {
    existe_proveedor=false;
    uid_existente="";
    existe_contacto=false;
    uid_existente_contacto="";
    existe_contacto_index=-1;
    registro_contactos={};
    registro_antiguo = {};
    resetFormInsumo();

    actualizarTablaProveedores();
    actualizarTablaContactosProveedor();
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_boton_AgregarProveedoress).click(function() {
  //Validar datos ingresados
  if (validateFormProveedor()){
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
$('#' + id_boton_BorrarProveedores).click(function() {
  resetFormProveedor();
  existe_proveedor=false;
});

$('#' + id_boton_AgregarContactoProveedores).click(function() {
  if(validateContactoProveedor()){
    if(existe_contacto){
      tabla_contactoProveedor.row(existe_contacto_index).data(altaContactoProveedor()).draw();
    }else{
      tabla_contactoProveedor.row.add(altaContactoProveedor()).draw();
    }
  }
  existe_contacto= false;
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_rfcProveedor ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e)
});

$('#' + id_rfcProveedor).change(function(){
    $('#' + id_rfcProveedor).val($('#' + id_rfcProveedor).val().toUpperCase());
});

$('#' + id_razonSocialProveedor ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.",e)
});

$('#' + id_razonSocialProveedor).change(function(){
    $('#' + id_razonSocialProveedor).val(deleteBlankSpaces(id_razonSocialProveedor));
});

$('#' + id_direccionProveedores).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.",e)
});

$('#' + id_direccionProveedores).change(function(){
  var direccion = deleteBlankSpaces(id_direccionProveedores);
  direccion = direccion.charAt(0).toUpperCase() + direccion.slice(1);
  $('#' + id_direccionProveedores).val(direccion);
});

$('#' + id_contactoProveedores ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.",e)
});

$('#' + id_contactoProveedores ).change(function(){
  $('#' + id_contactoProveedores).val(corrigeCampoComplejo(id_contactoProveedores));
});

$('#' + id_telefonoProveedores  ).keypress(function(e){
    charactersAllowed("extEXT.-0123456789",e)
});

$('#' + id_correoProveedores  ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_@.",e)
});

$('#' + id_correoProveedores).change(function(){
    $('#' + id_correoProveedores).val($('#' + id_correoProveedores).val().toLowerCase());
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
function resetFormProveedor(){
  $('#' + id_rfcProveedor ).val("");
  $('#' + id_razonSocialProveedor ).val("");
  $('#' + id_direccionProveedores ).val("");
  existe_proveedor=false;
}

function resetContactoProveedor(){
  $('#' + id_contactoProveedores).val("");
  $('#' + id_telefonoProveedores).val("");
  $('#' + id_correoProveedores).val("");
  existe_contacto=false;
}

//Validar que no esté vacío nungún campo
function validateFormProveedor(){
    if ($('#' + id_rfcProveedor ).val() == ""){
        alert("Escribe el RFC");
        highLightColor(id_rfcProveedor,"#FF0000");
        return false;
    } else if($('#' + id_razonSocialProveedor ).val() == ""){
        alert("Escribe la razón social o nombre del proveedor");
        highLightColor(id_razonSocialProveedor,"#FF0000");
        return false;
    } else if($('#' + id_direccionProveedores ).val() == ""){
        alert("Escribe la dirección del proveedor");
        highLightColor(id_direccionProveedores,"#FF0000");
        return false;
    } else {
        return true;
    }
}

function validateContactoProveedor(){
  if ($('#' + id_contactoProveedores).val() == ""){
    alert("Escribe el nombre del contacto.");
    highLightColor(id_contactoProveedores,"#FF0000");
    return false;
  } else if($('#' + id_telefonoProveedores ).val() == ""){
      alert("Escribe el teléfono de contacto");
      highLightColor(id_telefonoProveedores,"#FF0000");
      return false;
  } else if($('#' + id_correoProveedores ).val() == ""){
      alert("Escribe el correo de contacto");
      highLightColor(id_correoProveedores,"#FF0000");
      return false;
  } else {
      return true;
  }
}

//Construir el JSON de direccion para la obra
function altaProveedor(){
  var proveedor = {};
  proveedor = {
      rfc: $('#' + id_rfcProveedor).val(),
      razon_social: $('#' + id_razonSocialProveedor).val(),
      direccion: $('#' + id_direccionProveedores).val()
  };
  return proveedor;
};

function altaContactoProveedor(){
  var contacto = [];
  contacto = [
    $('#'+id_ddl_proveedorInsumos + ' option:selected').val(),
    deformatMoney($('#'+id_precioInsumos).val()),
    new Date(f_cotizacion[0], f_cotizacion[1] - 1, f_cotizacion[2]).getTime(),
    "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>",
    "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
  ];
  return proveedor;
}

//Llenar los campos en caso de existir la clave de la obra
function llenaCamposInsumo(clave){
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('clave_obra').equalTo(clave).limitToFirst(1).once("value").then(function(snapshot){
      snapshot.forEach(function(child_snap){
          var value = child_snap.val();
          if (value){
              existe_insumo = true;
              uid_existente = child_snap.key;
              $('#' + id_descripcionInsumos).val(value.descripcion),
              $('#' + id_catalogoInsumos).val(value.catalogo),
              $('#' + id_catfabricInsumos).val(value.catfabric),
              $('#' + id_ddl_marcaInsumos).val(value.marca),
              $('#' + id_ddl_unidadInsumos).val(value.unidad),
              $('#' + id_ddl_clasificacionInsumos).val(value.clasificacion),
              $('#' + id_ddl_categoriaInsumos).val(value.categoria)

              highLightProductoInsumo();
          } else {
              existe_insumo = false;
          }
      });
  });
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
  clasificaciones.forEach(function(snapChild){
      option = document.createElement('option');
      option.value = snapChild.key;
      option.text = snapChild.val().razon_social;
      select.appendChild(option);
  });
}
