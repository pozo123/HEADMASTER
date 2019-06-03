var id_tab_catalogo_diver = "tabCatalogoDiver";
var id_datatable_catalogo_diver =  "dataTableCatalogoDiver";

var id_dist_checkbox_editar_catalogo_diver = "distCbEditarCatalogoDiver";
var id_nombre_label_editar_catalogo_diver = "nombreLabelEditarDiver"

var id_button_editar_catalogo_diver = "buttonEditarCatalogoDiver";
var id_modal_catalogo_diver = "diverModalEditar";

var rama_bd_diversos = "rrhh/diversos";

$('#' + id_tab_catalogo_diver).click(function() {
    loadCatalogoDiver();
});

function loadCatalogoDiver(){
    var datos_diver = [];
    firebase.database().ref(rama_bd_diversos).once("value").then(function(snapshot){
        snapshot.forEach(function(diverSnap){
            var diver = diverSnap.val();
            datos_diver.push([diver.nombre, diver.distribuible ? "Sí" : "No"]);
        });
        var columnas = areas_usuario_global.administracion || areas_usuario_global.rrhh ? [
                {title: "Nombre",},
                {title: "Normalmente Distribuible",},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_diver + "'><i class='fas fa-edit'></i>"},
            ] : [
                {title: "Nombre",},
                {title: "Normalmente Distribuible",},
            ];
        var tabla_diver = $('#'+ id_datatable_catalogo_diver).DataTable({
            destroy: true,
            data: datos_diver,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: columnas,
            language: idioma_espanol,
        });
        editar_diver("#" + id_datatable_catalogo_diver + " tbody", tabla_diver);
    });
}

function editar_diver(tbody, table){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            //console.log(data);
            $('#' + id_nombre_label_editar_catalogo_diver).text(data[0]);
            $('#' + id_dist_checkbox_editar_catalogo_diver).prop('checked', data[1] != "No");
        }
    });
}

$('#' + id_button_editar_catalogo_diver).click(function(){
    var distribuible = $('#' + id_dist_checkbox_editar_catalogo_diver).prop('checked');
    firebase.database().ref(rama_bd_diversos + "/" + $('#' + id_nombre_label_editar_catalogo_diver).text() + "/distribuible").set(distribuible);
    loadCatalogoDiver();
    alert("Cambios registrados");
});