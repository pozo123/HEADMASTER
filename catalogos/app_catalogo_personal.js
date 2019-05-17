var id_tab_catalogo_personal = "tabCatalogoPersonal";
var id_datatable_catalogo_personal =  "dataTableCatalogoPersonal";

var rama_bd_personal = "personal";

$('#' + id_tab_catalogo_personal).click(function() {
    var datos_pers = [];

    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        snapshot.forEach(function(persSnap){
            var pers = persSnap.val();
            var creden;
            switch (pers.credenciales) {
                case 0:
                    creden = "Administrador del Sistema";
                break;
                case 1:
                    creden = "Directivo";
                break;
                case 2:
                    creden = "Líder de área";
                break;
                case 3:
                    creden = "Colaborador";
                break;
                case 4:
                    creden = "-";
            }
            datos_pers.push([
                pers.nombre,
                pers.nickname,
                pers.email,
                pers.uid,
                creden,
            ]);
        });

        tabla_personal = $('#'+ id_datatable_catalogo_personal).DataTable({
            destroy: true,
            data: datos_pers,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Nombre"},
                {title: "Nombre Corto"},
                {title: "Email"},
                {title: "UID"},              
                {title: "Credenciales"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
});