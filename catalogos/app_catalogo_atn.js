var id_tab_catalogo_atn = "tabCatalogoAtn";
var id_datatable_catalogo_atn =  "dataTableCatalogoAtn";

var id_area_editar_catalogo_atn = "areaEditarCatalogoAtn";
var id_celular_editar_catalogo_atn = "celularEditarCatalogoAtn";
var id_email_editar_catalogo_atn = "emailEditarCatalogoAtn";
var id_extension_editar_catalogo_atn = "extensionEditarCatalogoAtn";
var id_nombre_editar_catalogo_atn = "nombreEditarCatalogoAtn";

var id_button_editar_catalogo_atn = "buttonEditarCatalogoAtn";
var id_modal_catalogo_atn = "atnModalEditar";

var id_modal_eliminar_catalogo_atn = "atnModalEliminar";
var id_nombre_eliminar_catalogo_atn = "nombreEliminarCatalogoAtn";
var id_button_eliminar_catalogo_atn = "buttonEliminarCatalogoAtn";

var rama_bd_clientes = "clientes";

var numero_catalogo_atn;
var cliente_seleccionado_atn;

$('#' + id_tab_catalogo_atn).click(function() {
    loadCatalogoAtn();
});

function loadCatalogoAtn(){
    var datos_atn = [];
    firebase.database().ref(rama_bd_clientes).once("value").then(function(snapshot){
        snapshot.forEach(function(clienSnap){
            clienSnap.child("atencion").forEach(function(atnSnap){
                var atn = atnSnap.val();
                datos_atn.push([clienSnap.key, atn.nombre, atn.area, atn.celular, atn.email, atn.extension, atnSnap.key]);
            });
        });
        var columnas = areas_usuario_global.administracion ? [
                {title: "Cliente",},
                {title: "Nombre",},
                {title: "Área",},
                {title: "Celular",},
                {title: "Email",},
                {title: "Extensión",},
                {title: "key"},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_atn + "'><i class='fas fa-edit'></i></button><button type='button' class='eliminar btn btn-danger' data-toggle='modal' data-target='#" + id_modal_eliminar_catalogo_atn + "'><i class='fas fa-trash'></i></button>"},
            ] : [
                {title: "Cliente",},
                {title: "Nombre",},
                {title: "Área",},
                {title: "Celular",},
                {title: "Email",},
                {title: "Extensión",},
                {title: "key"},
            ];
        var tabla_atn = $('#'+ id_datatable_catalogo_atn).DataTable({
            destroy: true,
            data: datos_atn,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: columnas,
            "columnDefs": [ 
                { "visible": false, "targets": [6] },
                {orderable:false, targets: [0,1,2]},
                {targets: 2, className: 'dt-body-justify'},
            ],
            language: idioma_espanol,
        });
        editar_atn("#" + id_datatable_catalogo_atn + " tbody", tabla_atn);
        eliminar_atn("#" + id_datatable_catalogo_atn + " tbody", tabla_atn);
    });
}

function editar_atn(tbody, table){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            //console.log(data);
            $('#' + id_nombre_editar_catalogo_atn).val(data[1]);
            $('#' + id_area_editar_catalogo_atn).val(data[2]);
            $('#' + id_celular_editar_catalogo_atn).val(data[3]);
            $('#' + id_email_editar_catalogo_atn).val(data[4]);
            $('#' + id_extension_editar_catalogo_atn).val(data[5]);
            numero_catalogo_atn = data[6];
            cliente_seleccionado_atn = data[0];
        }
    });
}

function eliminar_atn(tbody, table){
    $(tbody).on("click", "button.eliminar",function(){//button.eliminar? Aqui
        var data = table.row($(this).parents("tr")).data();
        if(data){
            console.log(data[1]);
            document.getElementById(id_nombre_eliminar_catalogo_atn).innerHTML = data[1];
            numero_catalogo_atn = data[6];
            cliente_seleccionado_atn = data[0];
            console.log(numero_catalogo_atn);
        }
    });
}
$('#' + id_button_editar_catalogo_atn).click(function(){
    var atn = {
        nombre: $('#' + id_nombre_editar_catalogo_atn).val(),
        area: $('#' + id_area_editar_catalogo_atn).val(),
        celular: $('#' + id_celular_editar_catalogo_atn).val(),
        email: $('#' + id_email_editar_catalogo_atn).val(),
        extension: $('#' + id_extension_editar_catalogo_atn).val(),
    }
    firebase.database().ref(rama_bd_clientes + "/" + cliente_seleccionado_atn + "/atencion/" + numero_catalogo_atn).update(atn);
    loadCatalogoAtn();
    alert("Cambios registrados");
});

$('#' + id_button_eliminar_catalogo_atn).click(function(){
    firebase.database().ref(rama_bd_clientes + "/" + cliente_seleccionado_atn + "/atencion").once('value').then(function(snapshot){
        var update = snapshot.val();
        for(key in update){
            if(key >= numero_catalogo_atn){
                if(snapshot.child(parseInt(key) + 1).exists()){
                    update[key] = snapshot.child(parseInt(key) + 1).val();
                } else {
                    update[key] = null;
                }
            }
        }
        console.log(update);
        firebase.database().ref(rama_bd_clientes + "/" + cliente_seleccionado_atn + "/atencion").update(update);
        loadCatalogoAtn();
        alert("Atn eliminado");
    });
});