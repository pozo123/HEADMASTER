var id_tab_catalogo_atn = "tabCatalogoAtn";
var id_datatable_catalogo_atn =  "dataTableCatalogoAtn";

var id_area_editar_catalogo_atn = "claveEditarCatalogoAtn";
var id_celular_editar_catalogo_atn = "clienteDdlEditarCatalogoAtn";
var id_email_editar_catalogo_atn = "calleEditarCatalogoAtn";
var id_extension_editar_catalogo_atn = "numeroEditarCatalogoAtn";
var id_nombre_editar_catalogo_atn = "coloniaEditarCatalogoAtn";

var id_button_editar_catalogo_atn = "buttonEditarCatalogoAtn";
var id_modal_catalogo_atn = "obraModalEditar";

var rama_bd_clientes = "clientes";

var numero_catalogo_atn;

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
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_atn + "'><i class='fas fa-edit'></i></button>"},
            ] : [
                {title: "Cliente",},
                {title: "Nombre",},
                {title: "Área",},
                {title: "Celular",},
                {title: "Email",},
                {title: "Extensión",},
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
        editar_obra("#" + id_datatable_catalogo_atn + " tbody", tabla_atn);
    });
}

function editar_obra(tbody, table){
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
    }//AQUI FALTA hacer el update, el eliminar y toooooodos los htmls
    firebase.database().ref(rama_bd_atn + "/" + numero_catalogo_atn).update(atn);
    loadCatalogoAtn();
    alert("Cambios registrados");
});