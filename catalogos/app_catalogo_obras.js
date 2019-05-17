var id_tab_catalogo_obras = "tabCatalogoObras";
var id_datatable_catalogo_obras =  "dataTableCatalogoObras";

var id_clave_editar_catalogo_obras = "claveEditarCatalogoObras";
var id_cliente_ddl_editar_catalogo_obras = "clienteDdlEditarCatalogoObras";
var id_direccion_calle_editar_catalogo_obras = "calleEditarCatalogoObras";
var id_direccion_numero_editar_catalogo_obras = "numeroEditarCatalogoObras";
var id_direccion_colonia_editar_catalogo_obras = "coloniaEditarCatalogoObras";
var id_direccion_delegacion_editar_catalogo_obras = "delegacionEditarCatalogoObras";
var id_direccion_ciudad_editar_catalogo_obras = "ciudadEditarCatalogoObras";
var id_direccion_cp_editar_catalogo_obras = "cpEditarCatalogoObras";
var id_button_editar_catalogo_obras = "buttonEditarCatalogoObras";
var id_modal_catalogo_obras = "obraModalEditar";

var rama_bd_obras = "obras";
var rama_bd_clientes = "clientes";

var nombre_catalogo_obras;

$('#' + id_tab_catalogo_obras).click(function() {
    loadCatalogoObra();
});

function loadCatalogoObra(){
    var datos_obras = [];
    firebase.database().ref(rama_bd_obras).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            console.log("2");
            var obra = obraSnap.val();
            var term = obra.terminada ? "Terminada" : "Activa";
            datos_obras.push([obra.nombre, obra.clave, obra.cliente, obra.direccion.calle + ", No. " + obra.direccion.numero + " Col. " + obra.direccion.colonia + ", " + obra.direccion.delegacion + ", " + obra.direccion.ciudad + " CP " + obra.direccion.cp, term]);
        console.log(obraSnap.key)
        });
        var columnas = areas_usuario_global.administracion ? [
                {title: "Nombre",},
                {title: "Clave",},
                {title: "Cliente",},
                {title: "Direccion",},
                {title: "Estado",},
                {defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_catalogo_obras + "'><i class='fas fa-edit'></i></button>"},
            ] : [
                {title: "Nombre",},
                {title: "Clave",},
                {title: "Cliente",},
                {title: "Direccion",},
                {title: "Estado",}
            ];
        var tabla_obras = $('#'+ id_datatable_catalogo_obras).DataTable({
            destroy: true,
            data: datos_obras,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: columnas,
            language: idioma_espanol,
        });
        editar_obra("#" + id_datatable_catalogo_obras + " tbody", tabla_obras,snapshot);
    });
}

function editar_obra(tbody, table,obraSnap){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
            var obra = obraSnap.child(data[0]).val();
            firebase.database().ref(rama_bd_clientes).once('value').then(function(snapshot){
                var selected_index = 0;
                var found = false;
                var select = document.getElementById(id_cliente_ddl_editar_catalogo_obras);
                snapshot.forEach(function(clienSnap){
                    var option = document.createElement('OPTION');
                    option.text = option.value = clienSnap.key;
                    select.appendChild(option);
                    if(clienSnap.key != obra.cliente){
                        if(!found){
                            selected_index++;
                        }
                    } else {
                        found = true;
                    }
                });
                select.selectedIndex = selected_index;
                //console.log(data);
                $('#' + id_clave_editar_catalogo_obras).val(obra.clave);
                $('#' + id_direccion_calle_editar_catalogo_obras).val(obra.direccion.calle);
                $('#' + id_direccion_numero_editar_catalogo_obras).val(obra.direccion.numero);
                $('#' + id_direccion_colonia_editar_catalogo_obras).val(obra.direccion.colonia);
                $('#' + id_direccion_delegacion_editar_catalogo_obras).val(obra.direccion.delegacion);
                $('#' + id_direccion_ciudad_editar_catalogo_obras).val(obra.direccion.ciudad);
                $('#' + id_direccion_cp_editar_catalogo_obras).val(obra.direccion.cp);
                nombre_catalogo_obras = data[0];
            });
        }
    });
}

$('#' + id_button_editar_catalogo_obras).click(function(){
    var obra = {
        clave: $('#' + id_clave_editar_catalogo_obras).val(),
        cliente: $('#' + id_cliente_ddl_editar_catalogo_obras + " option:selected").val(),
        direccion: {
            calle: $('#' + id_direccion_calle_editar_catalogo_obras).val(),
            numero: $('#' + id_direccion_numero_editar_catalogo_obras).val(),
            colonia: $('#' + id_direccion_colonia_editar_catalogo_obras).val(),
            delegacion: $('#' + id_direccion_delegacion_editar_catalogo_obras).val(),
            ciudad: $('#' + id_direccion_ciudad_editar_catalogo_obras).val(),
            cp: $('#' + id_direccion_cp_editar_catalogo_obras).val(),
        }
    }
    firebase.database().ref(rama_bd_obras + "/" + nombre_catalogo_obras).update(obra);
    loadCatalogoObra();
    alert("Cambios registrados");
});