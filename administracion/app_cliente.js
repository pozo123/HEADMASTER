var id_nombre_cliente = "clienteNombre";
var id_direccion_calle_cliente = "calleCliente"; //Campo nuevo
var id_direccion_num_cliente = "numCliente"; //Campo nuevo
var id_direccion_colonia_cliente = "coloniaCliente"; //Campo nuevo
var id_direccion_delegacion_cliente = "delegacionCliente"; //Campo nuevo
var id_direccion_ciudad_cliente = "ciudadCliente"; //Campo nuevo
var id_direccion_cp_cliente = "cpCliente"; //Campo nuevo
var id_tel_cliente = "clienteTelefono";
var id_registrar_button_cliente = "registrarCliente";
var id_borrar_todo_cliente = "borrarTodoCliente";
var id_clave_cliente = "claveCliente";

var id_nombre_atencion_cliente = "nombreAtencion";
var id_area_atencion_cliente = "areaAtencion";
var id_celular_atencion_cliente = "celAtencion";
var id_email_atencion_cliente = "emailAtencion";
var id_extension_atencion_cliente = "extAtencion";
var id_add_atencion_button_cliente = "addAtencion";
var id_del_atencion_button_cliente = "delAtencion";
var lista_atencion_cliente = "ListaClientes";


var rama_bd_clientes = "clientes";

var atencion = [];

$('#' + id_add_atencion_button_cliente).click(function () {
    var node = document.createElement("LI");
    node.classList.add("list-group-item");               // Create a <li> node
    var textnode = document.createTextNode($('#' + id_nombre_atencion_cliente).val());        // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById(lista_atencion_cliente).appendChild(node);  
    atencion.push({
        nombre: "" + $('#' + id_nombre_atencion_cliente).val(),
        area: "" + $('#' + id_area_atencion_cliente).val(), 
        celular: "" + $('#' + id_celular_atencion_cliente).val(),
        email: "" + $('#' + id_email_atencion_cliente).val(),
        extension: "" + $('#' + id_extension_atencion_cliente).val(),
    });
    //alert(JSON.stringify(atencion));
});

 //Metodo para borrar el ultimo requisito asignado
 $('#' + id_del_atencion_button_cliente).click(function () {
     var list = document.getElementById(lista_atencion_cliente);   // Get the <ul> element with id="myList"
     list.removeChild(list.lastChild);
     atencion.pop(); 
 });
 $('#' + id_borrar_todo_cliente).click(function () {
    var list = document.getElementById(lista_atencion_cliente);   // Get the <ul> element with id="myList"
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    atencion = [];
});

$('#' + id_registrar_button_cliente).click(function () {
    firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_nombre_cliente).val()).once('value').then(function(snapshot){
        var c = snapshot.val();
        if(c !== null){
            alert("Cliente ya existente");
        } else {
            if(!$('#' + id_nombre_cliente).val() || !$('#' + id_clave_cliente).val() || !(typeof atencion != "undefined" && atencion != null && atencion.length != null && atencion.length > 0)){
                alert("Llena todos los campos requeridos");
            }else{
                atencion.push({
                    nombre: "Producción HEAD",
                    area: "Gerente de Producción", 
                    celular: "5530405202",
                    email: "vgarcia@headingenieria.mx",
                    extension: ".",
                });
                var cliente = {      
                    nombre: $('#' + id_nombre_cliente).val(),
                    clave: $('#' + id_clave_cliente).val(),
                    atencion: atencion,
                    direccion: {
                        calle: $('#' + id_direccion_calle_cliente).val(),
                        numero: $('#' + id_direccion_num_cliente).val(),
                        colonia: $('#' + id_direccion_colonia_cliente).val(),
                        delegacion: $('#' + id_direccion_delegacion_cliente).val(),
                        ciudad: $('#' + id_direccion_ciudad_cliente).val(),
                        cp: $('#' + id_direccion_cp_cliente).val()
                    },
                    telefono: $('#' + id_tel_cliente).val(),
                }
                firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_nombre_cliente).val()).set(cliente)
                alert("¡Alta exitosa!");
                atencion = [];
            }       
        }
    });
 });