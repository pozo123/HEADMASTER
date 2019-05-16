var id_tab_catalogo_clientes = "tabCatalogoClientes";
var id_datatable_catalogo_clientes =  "dataTableCatalogoClientes";

var id_clave_editar_catalogo_clientes = "claveEditarCatalogoClientes";
var id_nombre_editar_catalogo_clientes = "nombreEditarCatalogoClientes";
var id_telefono_editar_catalogo_clientes = "telefonoEditarCatalogoClientes";
var id_ppto_esp_editar_catalogo_clientes = "pptoEspEditarCatalogoClientes";
var id_direccion_calle_editar_catalogo_clientes = "calleEditarCatalogoClientes";
var id_direccion_numero_editar_catalogo_clientes = "numeroEditarCatalogoClientes";
var id_direccion_colonia_editar_catalogo_clientes = "coloniaEditarCatalogoClientes";
var id_direccion_delegacion_editar_catalogo_clientes = "delegacionEditarCatalogoClientes";
var id_direccion_ciudad_editar_catalogo_clientes = "ciudadEditarCatalogoClientes";
var id_direccion_cp_editar_catalogo_clientes = "cpEditarCatalogoClientes";
var id_button_editar_catalogo_clientes = "buttonEditarCatalogoClientes";
var id_modal_catalogo_clientes = "clienteModalEditar";

var rama_bd_clientes = "clientes";

var nombre_catalogo_clientes;

$('#' + id_tab_catalogo_clientes).click(function() {
    loadCatalogoCliente();
});

function loadCatalogoCliente(){
    var datos_clientes = [];
    firebase.database().ref(rama_bd_clientes).once("value").then(function(snapshot){
        snapshot.forEach(function(clienSnap){
            var cliente = clienSnap.val();
            var ppto_esp = cliente.ppto_especial ? "Especial" : "Normal";
            datos_clientes.push([cliente.nombre, cliente.clave, cliente.telefono, cliente.direccion.calle + ", No. " + cliente.direccion.numero + " Col. " + cliente.direccion.colonia + ", " + cliente.direccion.delegacion + ", " + cliente.direccion.ciudad + " CP " + cliente.direccion.cp, ppto_esp]);
        });
        var tabla_clientes = $('#'+ id_datatable_catalogo_clientes).DataTable({
            destroy: true,
            data: datos_clientes,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Nombre",width: 150},
                {title: "Clave",width: 70},
                {title: "Telefono",width: 70},
                {title: "Direccion"},
                {title: "Formato Ppto"},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_clientes + "'><i class='fas fa-edit'></i></button>"},
            ],
            language: idioma_espanol,
        });
        editar_cliente("#" + id_datatable_catalogo_clientes + " tbody", tabla_clientes,snapshot);
    });
}

function editar_cliente(tbody, table,clienSnap){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            var clien = clienSnap.child(data[0]).val();
            //console.log(data);
            $('#' + id_clave_editar_catalogo_clientes).val(clien.clave);
            $('#' + id_nombre_editar_catalogo_clientes).val(clien.nombre);
            $('#' + id_telefono_editar_catalogo_clientes).val(clien.telefono);
            document.getElementById(id_ppto_esp_editar_catalogo_clientes).checked = clien.ppto_especial;
            $('#' + id_direccion_calle_editar_catalogo_clientes).val(clien.direccion.calle);
            $('#' + id_direccion_numero_editar_catalogo_clientes).val(clien.direccion.numero);
            $('#' + id_direccion_colonia_editar_catalogo_clientes).val(clien.direccion.colonia);
            $('#' + id_direccion_delegacion_editar_catalogo_clientes).val(clien.direccion.delegacion);
            $('#' + id_direccion_ciudad_editar_catalogo_clientes).val(clien.direccion.ciudad);
            $('#' + id_direccion_cp_editar_catalogo_clientes).val(clien.direccion.cp);
            nombre_catalogo_clientes = data[0];
        }
    });
}

$('#' + id_button_editar_catalogo_clientes).click(function(){
    var nom = $('#' + id_nombre_editar_catalogo_clientes).val();
    var cliente = {
        clave: $('#' + id_clave_editar_catalogo_clientes).val(),
        nombre: nom,
        ppto_especial: $('#' + id_ppto_esp_editar_catalogo_clientes).prop('checked'),
        telefono: $('#' + id_telefono_editar_catalogo_clientes).val(),
        direccion: {
            calle: $('#' + id_direccion_calle_editar_catalogo_clientes).val(),
            numero: $('#' + id_direccion_numero_editar_catalogo_clientes).val(),
            colonia: $('#' + id_direccion_colonia_editar_catalogo_clientes).val(),
            delegacion: $('#' + id_direccion_delegacion_editar_catalogo_clientes).val(),
            ciudad: $('#' + id_direccion_ciudad_editar_catalogo_clientes).val(),
            cp: $('#' + id_direccion_cp_editar_catalogo_clientes).val(),
        }
    }
    if(nombre_catalogo_clientes == nom){
        firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
    } else {
        firebase.database().ref(rama_bd_obras).orderByChild("cliente").equalTo(nombre_seleccionado).on('child_added',function(snapshot){
            var obra = snapshot.val()
            firebase.database().ref(rama_bd_obras + "/" + obra.nombre + "/cliente").set(nom);
        });
        firebase.database().ref(rama_bd_clientes).child(nombre_seleccionado).once('value').then(function(snapshot){
            var data = snapshot.val();
            data.nombre = nom;
            var update = {};
            update[nombre_seleccionado] = null;
            update[nom] = data;
            firebase.database().ref(rama_bd_clientes).update(update);
            firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
        });
    }
    loadCatalogoCliente();
    alert("Cambios registrados");
});