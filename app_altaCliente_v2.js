// id's de los elementos HTML
var id_tab_cliente = "tabAltaCliente";
var id_form_cliente = "formCliente";
var id_dataTable_cliente = "dataTableCliente";

// la clave es letras y números (Todo en mayúscula) OBL
// Nombre: Sólo la primera letra mayúscula es obligatorio OBL
// Teléfono: Caractéres permitidos sólo números y se formatea en pares 10 digitos máx
// Estado: Se trata como apellido (Ciudad de México va aquí)
// ciudad: idem a Estado (ciudades o alcaldías en caso de la cdmx)
// Colonia: primera letra en mayuscula
// Codigo Postal: Solo Números (string por el 0) solo son 5 números
// num_ext: num y letras caracterés permitidos: ("- .")
// num_int idem a num_ext

var id_clave_cliente = "claveCliente";
var id_nombre_cliente = "nombreCliente";
var id_telefono_cliente = "telCliente";
var id_estado_cliente = "estadoCliente";
var id_ciudad_cliente = "ciudadCliente";
var id_colonia_cliente = "coloniaCliente";
var id_calle_cliente = "calleCliente";
var id_codigo_postal_cliente = "cpCliente";
var id_num_exterior_cliente = "exteriorCliente";
var id_num_interior_cliente = "interiorCliente";

var id_agregar_cliente = "agregarButtonCliente";
var id_reset_form_cliente = "borrarButtonCliente";

// Variables globales

var existe_cliente = false;
var id_cliente_existente = "";


// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los clientes

$('#' + id_tab_cliente).click(function() {
    resetFormCliente();
    actualizarTablaCliente();   
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_form_cliente).click(function(){
    resetFormCliente();
});


$('#' + id_agregar_cliente).click(function(){
    if(!validateCliente()){
        return;
    } 
    if (existe_cliente){
        firebase.database().ref(rama_bd_clientes + "/despachos/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var cliente_update = {};
            cliente_update["despachos/" + uid_existente + "/clave_cliente"] = $('#' + id_clave_cliente).val();
            cliente_update["despachos/" + uid_existente + "/nombre"] = $('#' + id_nombre_cliente).val();
            cliente_update["despachos/" + uid_existente + "/telefono"] = $('#' + id_telefono_cliente).val();
            cliente_update["despachos/" + uid_existente + "/direccion"] = datosAltaCliente().direccion;
            firebase.database().ref(rama_bd_clientes).update(cliente_update);
            // pad
            pda("modificacion", rama_bd_clientes + "/despachos/" + uid_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormCliente();
        });
    } else {     
        firebase.database().ref(rama_bd_clientes + "/despachos").push(datosAltaCliente()).then(function(snapshot){
            var regKey = snapshot.key
            
            // actualizar listas
            var listas_path = {}
            listas_path["listas/habilitado/" + regKey] = true;
            firebase.database().ref(rama_bd_clientes).update(listas_path);

            // pista de auditoría
            pda("alta", rama_bd_clientes + "/despachos/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormCliente();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_clave_cliente).change(function(){
    $('#' + id_clave_cliente).val(deleteBlankSpaces(id_clave_cliente).toUpperCase());
});

$('#' + id_nombre_cliente).change(function(){
    var nombre_array = deleteBlankSpaces(id_nombre_cliente).split(" ");
    var nombre = "";
    for(var i=0; i<nombre_array.length; i++){
        if(i>0){
            nombre += " ";
        }
        nombre += nombre_array[i].charAt(0).toUpperCase() + nombre_array[i].slice(1);
    }
    $('#' + id_nombre_cliente).val(nombre);
});

$('#' + id_telefono_cliente).keypress(function(e){
    charactersAllowed("1234567890",e);
});
$('#' + id_telefono_cliente).change(function(){
    var telefono = "" + $('#' + id_telefono_cliente).val()
    if(telefono.length > 0){
        var aux = "";
        for(i=0;i<telefono.length;i++){
            if(i%2 == 0 && i > 0){
                aux+= " ";
            }
            aux += telefono.charAt(i);
        }
        $('#' + id_telefono_cliente).val(aux);
    }
});

$('#' + id_telefono_cliente).focus(function(){
    var aux_array = $('#' + id_telefono_cliente).val().split(" ");
    var aux = "";
    for(var i=0;i< aux_array.length;i++){
        aux += aux_array[i];
    }
    $('#' + id_telefono_cliente).val(aux);
});

$('#' + id_estado_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú´",e);
});
$('#' + id_estado_cliente).change(function(){
    var estado_array = deleteBlankSpaces(id_estado_cliente).split(" ");
    var estado = "";
    for(var i=0; i<estado_array.length; i++){
        if(i>0){
            estado += " ";
        }
        if(isPrepOrArt(estado_array[i].toLowerCase())){
            estado += estado_array[i].toLowerCase();
        } else {
            estado += estado_array[i].charAt(0).toUpperCase() + estado_array[i].slice(1).toLowerCase();
        }
    }
    $('#' + id_estado_cliente).val(estado);
});

$('#' + id_ciudad_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});

$('#' + id_ciudad_cliente).change(function(){
    var ciudad_array = deleteBlankSpaces(id_ciudad_cliente).split(" ");
    var ciudad = "";
    for(var i=0; i<ciudad_array.length; i++){
        if(i>0){
            ciudad += " ";
        }
        if(isPrepOrArt(ciudad_array[i].toLowerCase())){
            ciudad += ciudad_array[i].toLowerCase();
        } else {
            ciudad += ciudad_array[i].charAt(0).toUpperCase() + ciudad_array[i].slice(1).toLowerCase();
        }
    }
    $('#' + id_ciudad_cliente).val(ciudad);
});

$('#' + id_colonia_cliente).change(function(){
    var colonia = deleteBlankSpaces(id_colonia_cliente);
    colonia = colonia.charAt(0).toUpperCase() + colonia.slice(1);
    $('#' + id_colonia_cliente).val(colonia);
});

$('#' + id_calle_cliente).change(function(){
    var calle = deleteBlankSpaces(id_calle_cliente);
    calle = calle.charAt(0).toUpperCase() + calle.slice(1);
    $('#' + id_calle_cliente).val(calle);
});


$('#' + id_codigo_postal_cliente).keypress(function(e){
    charactersAllowed("1234567890",e);
});

$('#' + id_codigo_postal_cliente).change(function(){
    $('#' + id_codigo_postal_cliente).val("" + $('#' + id_codigo_postal_cliente).val());
});

$('#' + id_num_exterior_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ._-1234567890",e);
});

$('#' + id_num_exterior_cliente).change(function(){
    $('#' + id_num_exterior_cliente).val("" + $('#' + id_num_exterior_cliente).val());
});

$('#' + id_num_interior_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ._-1234567890",e);
});

$('#' + id_num_interior_cliente).change(function(){
    $('#' + id_num_interior_cliente).val("" + $('#' + id_num_interior_cliente).val());
});

$('#' + id_clave_cliente).on("cut copy paste",function(e) {
   e.preventDefault();
});
$('#' + id_nombre_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_telefono_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_estado_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_ciudad_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 $('#' + id_codigo_postal_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_num_exterior_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_num_interior_cliente).on("cut copy paste",function(e) {
    e.preventDefault();
 });
// ----------------------- FUNCIONES NECESARIAS ----------------------------

// función para resetear el formulario
// el parametro es boolean, true si quieres resetear el campo de correo. Esto es ya que cada vez que cambie el 
// valor del campo del correo, el formulario se tiene que resetear.

function resetFormCliente(){
    $('#' + id_form_cliente).trigger("reset");
    existe_cliente = false;
};

function validateCliente(){
    if ($('#' + id_clave_cliente).val() == ""){
        alert("Escribe la clave que se usará en el sistema para el despacho (cliente) en cuestión.");
        return false;
    } else if($('#' + id_nombre_cliente).val() == ""){
        alert("Escribe el nombre del despacho (cliente) en cuestión.");
        return false;
    } else if($('#' + id_telefono_cliente).val() != "" && $('#' + id_telefono_cliente).val().length < 14){
        alert("El número de teléfono tiene que ser de 10 dígitos.")
        $('#' + id_telefono_cliente).val("");
        return false;
    } else if($('#' + id_codigo_postal_cliente).val() != "" && $('#' + id_codigo_postal_cliente).val().length < 5){
        alert("El código postal tiene que ser de 5 dígitos.")
        return false;
    }else {
        return true;
    };
};

function actualizarTablaCliente(){
    firebase.database().ref(rama_bd_clientes+ "/despachos").on("value", function(snapshot){
        var datosCliente = [];
        snapshot.forEach(function(clienteSnap){
            var cliente = clienteSnap.val();
            var cliente_id = clienteSnap.key;

            var clave_cliente = cliente.clave_cliente;
            var nombre_cliente = cliente.nombre;
            var telefono_cliente = cliente.telefono;
            var habilitado = cliente.habilitado;

            var icon_class = "";
            if(habilitado) {
                icon_class = "'icono_verde fas fa-check-circle'";
            } else {
                icon_class = "'icono_rojo fas fa-times-circle'"
            }

            var estado = clienteSnap.child("direccion").val().estado;
            var ciudad = clienteSnap.child("direccion").val().ciudad;
            var colonia = clienteSnap.child("direccion").val().colonia;
            var codigo_postal = clienteSnap.child("direccion").val().codigo_postal;
            var calle = clienteSnap.child("direccion").val().calle;
            var numero_exterior = clienteSnap.child("direccion").val().numero_exterior;
            var numero_interior = clienteSnap.child("direccion").val().numero_interior;
            
            var direccion_text = calle + " " + numero_exterior + " " + numero_interior + ", " + colonia + ", " + ciudad + ", " + estado + ". " + codigo_postal;
            var direccion = estado + "/" + ciudad + "/" + colonia + "/" + codigo_postal + "/" + calle + "/" + numero_exterior + "/" + numero_interior;

            datosCliente.push([
                "",
                cliente_id,
                direccion,
                clave_cliente,
                nombre_cliente,
                direccion_text,
                telefono_cliente,
                "<button type='button' class='btn btn-dark'><span class='fas fa-address-book'></span></button>", 
                "<button type='button' class='btn btn-transparente' onclick='habilitarCliente(" + habilitado + "," + "\`"  + cliente_id  + "\`" + ")'><span class=" + icon_class + "></span></button>",
            ])  ;        
        });
        tabla_cliente = $('#'+ id_dataTable_cliente).DataTable({
            destroy: true,
            data: datosCliente,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                { "width": "225px", "targets": 5 },
                { "width": "100px", "targets": 3 },
                { "width": "50px", "targets": - 2},
                {
                    targets: -1,
                    className: 'dt-body-center'
                },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                {
                    targets: 0,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 2 },
              ]
        });

        $('#' + id_dataTable_cliente + ' tbody').on( 'click', '.editar', function () {
            highLightAllCliente();
            var data = tabla_cliente.row( $(this).parents('tr') ).data();
            resetFormCliente();
            existe_cliente = true;
            uid_existente = data[1];
            var direccion = data[2].split("/");
            
        
            $('#' + id_estado_cliente).val(direccion[0]);
            $('#' + id_ciudad_cliente).val(direccion[1]);
            $('#' + id_colonia_cliente).val(direccion[2]);
            $('#' + id_codigo_postal_cliente).val(direccion[3]);
            $('#' + id_calle_cliente).val(direccion[4]);
            $('#' + id_num_exterior_cliente).val(direccion[5]);
            $('#' + id_num_interior_cliente).val(direccion[6]);
            $('#' + id_clave_cliente).val(data[3]);
            $('#' + id_nombre_cliente).val(data[4]);
            $('#' + id_telefono_cliente).val(data[6]);
        } );
    });
};

function datosAltaCliente(){
    var cliente = {};
    var direccion = {};
    var 
    direccion = {
        estado: $('#' + id_estado_cliente).val(),
        ciudad: $('#' + id_ciudad_cliente).val(),
        colonia: $('#' + id_colonia_cliente).val(),
        codigo_postal: $('#' + id_codigo_postal_cliente).val(),
        calle: $('#' + id_calle_cliente).val(),
        numero_exterior: $('#' + id_num_exterior_cliente).val(),
        numero_interior: $('#' + id_num_interior_cliente).val()
    }
    cliente = {
        clave_cliente: $('#' + id_clave_cliente).val(),
        nombre: $('#' + id_nombre_cliente).val(),
        telefono: $('#' + id_telefono_cliente).val(),
        direccion: direccion,
        num_contactos: 0,
        habilitado: true
    }

    return cliente;
};

//función estética que hace uso de la función highLight
function highLightAllCliente(){
    highLight(id_clave_cliente);
    highLight(id_nombre_cliente);
    highLight(id_telefono_cliente);
    highLight(id_estado_cliente);
    highLight(id_ciudad_cliente);
    highLight(id_colonia_cliente);
    highLight(id_calle_cliente);
    highLight(id_codigo_postal_cliente);
    highLight(id_num_exterior_cliente);
    highLight(id_num_interior_cliente);
}


// función para actualizar el valor "habilitado:boolean" en la database. 
function  habilitarCliente(habilitado, id){
    var aux = {"habilitado": !habilitado};

    firebase.database().ref(rama_bd_clientes + "/despachos/" + id).once("value").then(function(snapshot){
        var registro_antiguo = snapshot.val();

        // actualizar registro
        firebase.database().ref(rama_bd_clientes + "/despachos/" + id).update(aux);

        // actualizar listas
        if(habilitado){
            firebase.database().ref(rama_bd_clientes + "/listas/habilitado/" + id).remove();
            firebase.database().ref(rama_bd_clientes + "/listas/deshabilitado/" + id).set(true);
        } else {
            firebase.database().ref(rama_bd_clientes + "/listas/habilitado/" + id).set(true)
            firebase.database().ref(rama_bd_clientes + "/listas/deshabilitado/" + id).remove();
        }
        // pda
        pda("modificacion", rama_bd_clientes + "/despachos/" + id, registro_antiguo)
    });
}