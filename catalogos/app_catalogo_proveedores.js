var id_tab_catalogo_proveedores = "tabCatalogoProveedores";
var id_datatable_catalogo_proveedores =  "dataTableCatalogoProveedores";

var rama_bd_proveedores = "compras/proveedores";

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

$('#' + id_tab_catalogo_proveedores).click(function() {
    var datos_prov = [];

    firebase.database().ref(rama_bd_proveedores).once('value').then(function(snapshot){
        snapshot.forEach(function(provSnap){
            var prov = provSnap.val();
            datos_prov.push([
                provSnap.key,
                prov.razonSocial,
                prov.direccion,
                prov.telefono,
                prov.atiende,
                prov.RFC,
            ]);
        });

        tabla_registros = $('#'+ id_datatable_catalogo_proveedores).DataTable({
            destroy: true,
            data: datos_prov,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Referencia"},
                {title: "Razón Social"},
                {title: "RFC"},
                {title: "Direccion"},              
                {title: "Teléfono"},
                {title: "Atiende"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
});