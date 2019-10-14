// id's de los elementos HTML
var id_tab_proveedor = "tabAltaProveedores";
var id_form_proveedor = "formProveedores";
var id_dataTable_proveedor = "dataTableProveedores";

//Definición de variables del formulario
var id_rfcProveedores = "rfcProveedores";
var id_razonSocialProveedores = "razonSocialProveedores";
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

//Dar formato a los elementos existentes
$('#' + id_tab_insumo).click(function() {
    existe_proveedor=false;
    uid_existente="";
    existe_contacto=false;
    uid_existente_contacto="";
    existe_contacto_index=-1;
    registro_contactos={};
    registro_antiguo = {};
    resetFormProveedor();

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
  existe_contacto=false;
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
$('#' + id_rfcProveedores ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e)
});

$('#' + id_rfcProveedores).change(function(){
    $('#' + id_rfcProveedores).val($('#' + id_rfcProveedores).val().toUpperCase());
});

$('#' + id_razonSocialProveedores ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.",e)
});

$('#' + id_razonSocialProveedores).change(function(){
    $('#' + id_razonSocialProveedores).val(deleteBlankSpaces(id_razonSocialProveedores));
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
  $('#' + id_rfcProveedores ).val("");
  $('#' + id_razonSocialProveedores ).val("");
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
    if ($('#' + id_rfcProveedores ).val() == ""){
        alert("Escribe el RFC");
        highLightColor(id_rfcProveedores,"#FF0000");
        return false;
    } else if($('#' + id_razonSocialProveedores ).val() == ""){
        alert("Escribe la razón social o nombre del proveedor");
        highLightColor(id_razonSocialProveedores,"#FF0000");
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
      rfc: $('#' + id_rfcProveedores).val(),
      razon_social: $('#' + id_razonSocialProveedores).val(),
      direccion: $('#' + id_direccionProveedores).val()
  };
  return proveedor;
};

function altaContactoProveedor(){
  var contacto = [];
  var icon_class = "'icono_rojo fas fa-times-circle'";
  var uid_contacto;
  if(existe_contacto){
    uid_contacto = uid_existente_contacto;
  }else{
    uid_contacto = "";
  }
  contacto = [
    uid_contacto,
    $('#'+id_contactoProveedores).val(),
    $('#'+id_telefonoProveedores).val(),
    $('#'+id_correoProveedores).val(),
    "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>",
    "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>"
  ];
  return proveedor;
}

// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaProveedores(){
    firebase.database().ref(rama_bd_insumos + "/proveedores").on("value",function(snapshot){
        var datos_proveedores = [];
        snapshot.forEach(function(proveedoresnap){
            var uid = proveedoresnap.key;
            var proveedor = proveedoresnap.val();
            datos_proveedores.push([
                proveedoresnap.key,
                proveedor.rfc,
                proveedor.razon_social,
                proveedor.direccion,
                "<button type='button' class='btn btn-dark'><span class='fas fa-address-book'></span></button>",
                "<button type='button' class='btn btn-dark'><span class='fas fa-hammer'></span></button>"
            ]);
        });

        tabla_proveedor = $('#'+ id_dataTable_proveedor).DataTable({
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
                { "visible": false, "targets": 0 }, //campos auxiliares
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_proveedor + ' tbody').on( 'click', '.editar', function () {
            highLightProveedor();
            var data = tabla_proveedor.row( $(this).parents('tr') ).data();
            resetFormProveedor();
            existe_proveedor = true;
            uid_existente = data[0];
            $('#' + id_rfcProveedores).val(data[1]);
            $('#' + id_razonSocialProveedores).val(data[2]);
            $('#' + id_direccionProveedores).val(data[3]);
            actualizarTablaContactosProveedor();
        } );
    });
}

function actualizarTablaContactosProveedor(){
    firebase.database().ref(rama_bd_insumos + "/proveedores/"+ uid_existente +"/contacto").on("value",function(snapshot){
        if (snapshot.exists()){
          registro_contactos = snapshot.val();
        } else {
          registro_contactos = {};
        }
        var datos_contactos = [];
        var icon_class = "'icono_rojo fas fa-times-circle'";
        snapshot.forEach(function(contactoSnap){
            var uid = contactoSnap.key;
            var contacto = contactoSnap.val();
            datos_contactos.push([
                uid,
                contacto.nombre,
                contacto.telefono,
                contacto.correo,
                "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>",
                "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>",
            ]);
        });

        tabla_contactoProveedor = $('#'+ id_dataTableContactosProveedores).DataTable({
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
        $('#' + id_dataTableContactosProveedores + ' tbody').on( 'click', '.editar', function () {
            highLightContactoProveedor();
            var data = tabla_contactoProveedor.row( $(this).parents('tr') ).data();
            resetFormContactoProveedor();
            existe_contacto = true;
            uid_existente_contacto = data[0];
            existe_contacto_index = tabla_contactoProveedor.row(this).index();
            $('#' + id_contactoProveedores).val(data[1]);
            $('#' + id_telefonoProveedores).val(data[2]);
            $('#' + id_correoProveedores).val(data[3]);
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

function highLightContactoProveedor(){
  highLight(id_contactoProveedores);
  highLight(id_telefonoProveedores);
  highLight(id_correoProveedores);
}

function highLightProveedor(){
  highLight(id_rfcProveedores);
  highLight(id_razonSocialProveedores);
  highLight(id_direccionProveedores);
}
