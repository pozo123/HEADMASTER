var id_tab_catalogo_dest = "tabCatalogoDest";
var id_datatable_catalogo_dest =  "dataTableCatalogoDest";

var id_nombre_editar_catalogo_dest = "nombreEditarCatalogoDest";
var id_tel_editar_catalogo_dest = "telEditarCatalogoDest";
var id_cuenta_editar_catalogo_dest = "cuentaEditarCatalogoDest";
var id_ie_checkbox_editar_catalogo_dest = "espIeCbEditarCatalogoDest";
var id_ihs_checkbox_editar_catalogo_dest = "espIhsCbEditarCatalogoDest";

var id_button_editar_catalogo_dest = "buttonEditarCatalogoDest";
var id_modal_catalogo_dest = "destModalEditar";

var rama_bd_destajistas = "produccion/destajistas";
var rama_bd_trabajadores = "rrhh/trabajadores";

var nombre_cat_dest;

$('#' + id_tab_catalogo_dest).click(function() {
    loadCatalogoDest();
});

function loadCatalogoDest(){
    var datos_dest = [];
    firebase.database().ref(rama_bd_destajistas).once("value").then(function(snapshot){
        snapshot.forEach(function(destSnap){
            var dest = destSnap.val();
            datos_dest.push([dest.nombre, dest.telefono, dest.cuenta_bancaria, dest.especialidad]);
        });
        var columnas = areas_usuario_global.administracion || areas_usuario_global.rrhh ? [
                {title: "Nombre",},
                {title: "Teléfono",},
                {title: "Cuenta Bancaria",},
                {title: "Especialidad",},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_dest + "'><i class='fas fa-edit'></i>"},
            ] : [
                {title: "Nombre",},
                {title: "Teléfono",},
                {title: "Cuenta Bancaria",},
                {title: "Especialidad",},
            ];
        var tabla_dest = $('#'+ id_datatable_catalogo_dest).DataTable({
            destroy: true,
            data: datos_dest,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: columnas,
            language: idioma_espanol,
        });
        editar_dest("#" + id_datatable_catalogo_dest + " tbody", tabla_dest);
    });
}

function editar_dest(tbody, table){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            //console.log(data);
            $('#' + id_nombre_editar_catalogo_dest).val(data[0]);
            $('#' + id_tel_editar_catalogo_dest).val(data[1]);
            $('#' + id_cuenta_editar_catalogo_dest).val(data[2]);
            $('#' + id_ie_checkbox_editar_catalogo_dest).prop('checked', data[3] == "IE" || data[3] == "Ambas");
            $('#' + id_ihs_checkbox_editar_catalogo_dest).prop('checked', data[3] == "IHS" || data[3] == "Ambas");
            nombre_cat_dest = data[0];
        }
    });
}


$('#' + id_button_editar_catalogo_dest).click(function(){
    var esp;
    if($('#' + id_ie_checkbox_editar_catalogo_dest).prop('checked')){
        if($('#' + id_ihs_checkbox_editar_catalogo_dest).prop('checked')){
            esp = "Ambas";
        } else {
            esp = "IE";
        }
    } else if($('#' + id_ihs_checkbox_editar_catalogo_dest).prop('checked')){
        esp = "IHS";
    } else {
        esp = "-";
    }
    var nom = $('#' + id_nombre_editar_catalogo_dest).val();
    var dest = {
        nombre: nom,
        telefono: $('#' + id_area_editar_catalogo_atn).val(),
        cuenta_bancaria: $('#' + id_celular_editar_catalogo_atn).val(),
        especialidad: esp,
    }
    if(nom != nombre_cat_dest){
        var update = {};
        update[nombre_cat_dest] = null;
        update[nom] = dest;
        firebase.database().ref(rama_bd_tipos_presupuesto).update(update);
        firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
            snapshot.forEach(function(trabSnap){
                if(trabSnap.child("jefe").val() == nombre_cat_dest){
                    firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key + "/jefe").set(nom);
                }
            });
        });
    } else {
        firebase.database().ref(rama_bd_destajistas + "/" + nom).update(dest);
    }
    loadCatalogoAtn();
    alert("Cambios registrados");
});