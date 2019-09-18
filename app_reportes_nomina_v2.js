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
                    console.log(listaSubsnap.key);
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
                    var nomina = 0;
                    var horas_extra = 0;
                    var diversos = 0;
                    // de los 3 de arriba sale el subtotal y del de abajo - subtotal salen impuestos
                    var pagado = 0;
                    var iva = 0;
                    var carga_social = 0;
                    var proporcion = 0;

                    for(key in registros_obra){ 
                        var pago = 0; 
                        if(regSnap.val()[key].pagos_nomina != null){
                            pago = regSnap.val()[key].pagos_nomina.monto;
                       
                            for(heKey in regSnap.val()[key].horas_extra){
                                if(regSnap.val()[key].horas_extra[heKey].obra == obra_key){
                                    horas_extra += regSnap.val()[key].horas_extra[heKey].cantidad * (regSnap.val()[key].sueldo_semanal / 24);
                                    iva += regSnap.val()[key].horas_extra[heKey].cantidad * (regSnap.val()[key].sueldo_semanal / 24) * 0.16;
                                };
                            };
                            horas_extra = parseFloat(horas_extra.toFixed(2));
                            
                            for(divKey in regSnap.val()[key].diversos){
                                if(regSnap.val()[key].diversos[divKey].obra == obra_key){
                                    diversos += regSnap.val()[key].diversos[divKey].cantidad;
                                    iva += regSnap.val()[key].diversos[divKey].cantidad * 0.16;
                                };
                            };
                            diversos = parseFloat(diversos.toFixed(2));

                            for( asistKey in regSnap.val()[key].asistencias){
                                if(regSnap.val()[key].asistencias[asistKey].obra == obra_key && regSnap.val()[key].asistencias[asistKey].actividad != "Falta"){
                                    nomina += regSnap.val()[key].sueldo_semanal*0.2;
                                    iva += (regSnap.val()[key].sueldo_semanal*0.2) * 0.16;
                                    proporcion += 0.2;
                                };
                            };
                            nomina = parseFloat(nomina.toFixed(2));
                            iva = parseFloat(iva.toFixed(2));
                                                
                            carga_social += (pago - (nomina + horas_extra + diversos + iva)) * proporcion;
                        }                   
                    };
                    pagado = nomina + horas_extra + diversos + carga_social + iva ;
                    
                    datos.push([
                        obra_nombre,
                        formatMoney(nomina),
                        "" + ((nomina / (nomina + horas_extra + diversos)) * 100).toFixed(2) +"%", 
                        formatMoney(horas_extra),
                        "" + ((horas_extra / (nomina + horas_extra + diversos)) * 100).toFixed(2) +"%", 
                        formatMoney(diversos),
                        "" + ((diversos / (nomina + horas_extra + diversos)) * 100).toFixed(2) +"%", 
                        formatMoney(nomina + horas_extra + diversos),
                        formatMoney(iva),
                        carga_social,
                        formatMoney(pagado),
                    ]);
                });
            });
        });
    });
};