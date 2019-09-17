var id_tab_reporte_nomina = "tabReporteNomina";
var id_dataTable_reporte_global_reporte_nomina = "dataTableGlobalReporteNomina";


$('#' + id_tab_reporte_nomina).click(function(){
    tableReporteGlobalReporteNomina();
});

// tabla para el reporte más general.

function tableReporteGlobalReporteNomina(){
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(regSnap){
        firebase.database().ref(rama_bd_obras + "/listas/obras_activas").once("value").then(function(obraSnap){
            firebase.database().ref(rama_bd_nomina + "/listas/obras").once("value").then(function(listaSnap){
                var datos = [];
                console.log(listaSnap.val());
                listaSnap.forEach(function(listaSubsnap){
                    // obtengo el id de la obra que irá en cada renglón ya que listaSnap es todas las obras donde hay registros
                    var obra_key = listaSubsnap.key;
                    var obra_nombre = obraSnap.val()[obra_key].nombre;
                    
                    var registros_obra = {};
                    for(key in listaSubsnap.val()){
                        // aquí recorro los procesos de cada una de las obras que hay;
                        for(var i=0;i < Object.keys(listaSubsnap.val()[key]).length;i++){
                            registros_obra[Object.keys(listaSubsnap.val()[key])[i]] = true;
                        }
                    }
                    console.log(registros_obra);

                    var nomina = 0;
                    var horas_extra = 0;
                    var diversos = 0;
                    // de los 3 de arriba sale el subtotal y del de abajo - subtotal salen impuestos
                    var pagado = 0;
                    
                    for(key in registros_obra){
                        for( asistKey in regSnap.val()[key].asistencias){
                            
                        };
                    };
                });
            });
        });
    });
};