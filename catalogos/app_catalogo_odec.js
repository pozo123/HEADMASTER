var id_tab_catalogo_odec = "tabCatalogoOdeC";
var id_datatable_catalogo_odec =  "dataTableCatalogoOdeC";

var rama_bd_obras = "obras";

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

$('#' + id_tab_catalogo_odec).click(function() {
    var datos_odec = [];

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(procSnap){
                if(procSnap.child("num_subprocesos") == 0){
                    procSnap.child("OdeC").forEach(function(yearSnap){
                        yearSnap.forEach(function(weekSnap){
                            weekSnap.forEach(function(odecSnap){
                                var odec = odecSnap.val();
                                datos_odec.push([
                                    odec.clave,
                                    obraSnap.key,
                                    procSnap.key,
                                    odec.precio_ppto,
                                    odec.proveedor,
                                    odec.timestamps.OdeC,
                                    odec.timestamps.registro_OdeC,
                                ]);
                            });
                        });
                    });
                } else {
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        subpSnap.child("OdeC").forEach(function(yearSnap){
                            yearSnap.forEach(function(weekSnap){
                                weekSnap.forEach(function(odecSnap){
                                    var odec = odecSnap.val();
                                    datos_odec.push([
                                        odec.clave,
                                        obraSnap.key,
                                        subpSnap.key,
                                        formatMoney(odec.precio_ppto),
                                        odec.proveedor,
                                        new Date(odecSnap.child("timestamps/OdeC").val()).toLocaleDateString("es-ES", options),
                                        new Date(odec.timestamps.registro_OdeC).toLocaleDateString("es-ES", options),
                                    ]);
                                });
                            });
                        });
                    });
                }
            });
        });

        tabla_registros = $('#'+ id_datatable_catalogo_odec).DataTable({
            destroy: true,
            data: datos_odec,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Clave"},
                {title: "Obra"},
                {title: "Proceso"},
                {title: "Precio"},              
                {title: "Proveedor"},
                {title: "Fecha OdeC"},
                {title: "Fecha de Registro"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
});