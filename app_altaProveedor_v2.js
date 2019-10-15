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
$('#' + id_tab_proveedor).click(function() {
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
    var datos_proveedor = altaProveedor();
    var contactos = recuperaDatosContactosProveedor();
    console.log(datos_proveedor);
    console.log(contactos);
    datos_proveedor["contacto"] = contactos;
    console.log(datos_proveedor);
    //Decidir si editar o dar de alta
    if (existe_proveedor){ //editar
      console.log("Editar");
        firebase.database().ref(rama_bd_insumos + "/proveedores/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var proveedor_update = {};
            //Actualizar los campos de la obra
            var path_proveedor = "proveedores/" + uid_existente;
            proveedor_update[path_proveedor] = datos_proveedor;

            console.log(proveedor_update);
            firebase.database().ref(rama_bd_insumos).update(proveedor_update);

            // PAD
            pda("modificacion", rama_bd_insumos + "/" + path_proveedor, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormProveedor();
        });
    } else { //dar de alta
      console.log("Dar de alta");
        firebase.database().ref(rama_bd_insumos + "/proveedores").push(datos_proveedor).then(function(snapshot){
            var regKey = snapshot.key;

            // PAD
            pda("alta", rama_bd_insumos + "/proveedores/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormProveedor();
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
    resetContactoProveedor();
    existe_contacto= false;
  }
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_rfcProveedores ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e)
});

$('#' + id_rfcProveedores).change(function(){
    $('#' + id_rfcProveedores).val($('#' + id_rfcProveedores).val().toUpperCase());
});

$('#' + id_razonSocialProveedores ).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.,",e)
});

$('#' + id_razonSocialProveedores).change(function(){
    $('#' + id_razonSocialProveedores).val(deleteBlankSpaces(id_razonSocialProveedores));
});

$('#' + id_direccionProveedores).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/.,#",e)
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
  uid_existente = "";
  resetContactoProveedor();
  actualizarTablaContactosProveedor();
}

function resetContactoProveedor(){
  $('#' + id_contactoProveedores).val("");
  $('#' + id_telefonoProveedores).val("");
  $('#' + id_correoProveedores).val("");
  existe_contacto=false;
  uid_existente_contacto = "";
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
    "<button type='button' class='eliminar btn btn-transparente'><i class='icono_rojo fas fa-times-circle'></i></button>"
  ];
  return contacto;
}

// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaProveedores(){
  console.log("Actualizando tabla proveedores");
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
                "<button type='button' class='toolbox_insumos btn btn-dark'><i class='fas fa-toolbox'></i></button>"
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
                },
                { targets: [4,5], className: 'dt-body-center'}
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
         });

         $('#' + id_dataTable_proveedor + ' tbody').on( 'click', '.toolbox_insumos', function () {
             var data = tabla_proveedor.row( $(this).parents('tr') ).data();
             modalInsumosProveedor(data[0]);
          });
    });
}

function actualizarTablaContactosProveedor(){
    console.log("Actualizando tabla contactos");
    firebase.database().ref(rama_bd_insumos + "/proveedores/"+ uid_existente +"/contacto").on("value",function(snapshot){
        if (snapshot.exists()){
          registro_contactos = snapshot.val();
        } else {
          registro_contactos = {};
        }
        var datos_contactos = [];
        snapshot.forEach(function(contactoSnap){
            var uid = contactoSnap.key;
            var contacto = contactoSnap.val();
            datos_contactos.push([
                uid,
                contacto.nombre,
                contacto.telefono,
                contacto.correo,
                "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>",
                "<button type='button' class='eliminar btn btn-transparent'><i class='icono_rojo fas fa-times-circle'></i></button>"
            ]);
        });

        tabla_contactoProveedor = $('#'+ id_dataTableContactosProveedores).DataTable({
            destroy: true,
            data: datos_contactos,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 2 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 }, //campos auxiliares
                { targets: [4,5], className: 'dt-body-center'}
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTableContactosProveedores + ' tbody').on( 'click', '.editar', function () {
            highLightContactoProveedor();
            var data = tabla_contactoProveedor.row( $(this).parents('tr') ).data();
            resetContactoProveedor();
            existe_contacto = true;
            uid_existente_contacto = data[0];
            existe_contacto_index = tabla_contactoProveedor.row(this).index();
            $('#' + id_contactoProveedores).val(data[1]);
            $('#' + id_telefonoProveedores).val(data[2]);
            $('#' + id_correoProveedores).val(data[3]);
        } );

        $('#' + id_dataTableContactosProveedores + ' tbody').on( 'click', '.eliminar', function () {
            var data = tabla_contactoProveedor.row( $(this).parents('tr') ).data();
            if(existe_contacto && data[0] == uid_existente_contacto){
              existe_contacto = false;
              uid_existente_contacto = "";
              existe_contacto_index = -1;
            }
            tabla_contactoProveedor.row( $(this).parents('tr') ).remove().draw();
        } );
    });
}

function recuperaDatosContactosProveedor(){
  var contactosProveedor = {};
  var cont = 0;
  $('#' + id_dataTableContactosProveedores).DataTable().rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    console.log(data);
    contactosProveedor["CONT-"+cont]={
      nombre: data[1],
      telefono: data[2],
      correo: data[3]
    };
    cont++;
  });
  return contactosProveedor;
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
