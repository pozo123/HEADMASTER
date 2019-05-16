var id_tab_catalogo_categorias = "tabCatalogoCategorias";
var id_datatable_catalogo_categorias =  "dataTableCatalogoCategorias";

var id_clave_editar_catalogo_categorias = "claveEditarCatalogoCategorias";
var id_nombre_editar_catalogo_categorias = "nombreEditarCatalogoCategorias";
var id_button_editar_catalogo_categorias = "buttonEditarCatalogoCategorias";
var id_modal_catalogo_categorias = "categoriaModalEditar";

var rama_bd_categorias = "categorias";

var nombre_catalogo_categorias;

$('#' + id_tab_catalogo_categorias).click(function() {
    loadCatalogoCategoria();
});

function loadCatalogoCategoria(){
    var datos_cat = [];

    firebase.database().ref(rama_bd_categorias).once('value').then(function(snapshot){
        snapshot.forEach(function(catSnap){
            var cat = catSnap.val();
            datos_cat.push([
                catSnap.key,
                cat.clave,
            ]);
        });
        var columnas = areas_usuario_global.administracion ? [
                {title: "Nombre"},
                {title: "Clave"},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_categorias + "'><i class='fas fa-edit'></i></button>"},
            ] : [
                {title: "Nombre"},
                {title: "Clave"},
            ];
        tabla_categorias = $('#'+ id_datatable_catalogo_categorias).DataTable({
            destroy: true,
            data: datos_cat,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: columnas,
            language: idioma_espanol, // Esta en app_bibliotecas
        });
        editar_categoria("#" + id_datatable_catalogo_categorias + " tbody", tabla_categorias);
    });
};

function editar_categoria(tbody, table){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            $('#' + id_clave_editar_catalogo_categorias).val(data[0]);
            $('#' + id_nombre_editar_catalogo_categorias).val(data[1]);
            nombre_catalogo_categorias = data[1];
        }
    });
}

$('#' + id_button_editar_catalogo_categorias).click(function(){
    var nom = $('#' + id_nombre_editar_catalogo_categorias).val();
    var cat = {
        clave: $('#' + id_clave_editar_catalogo_categorias).val(),
        nombre: nom,
    }
    if(nombre_seleccionado == nom){
        firebase.database().ref(rama_bd_categorias + "/" + nom).update(cat);
    } else {
        var update = {};
        update[nombre_seleccionado] = null;
        update[nom] = cat;
        firebase.database().ref(rama_bd_categorias).update(update);
    }
    loadCatalogoCategoria();
    alert("Cambios registrados");
});