var id_tab_dash_prod = "tabPagosCliente";
var id_form_dash_prod = "tabDashProd";

var id_ddl_obra_dash_prod = "obraDashProd";
var id_ddl_prod_dash_prod = "procesoDashProd";


var id_div_resumen_general = "divReporteDashProd";
var id_circle_pagado_dash_prod = "pagadoDashProd";
var id_circle_copeo_dash_prod = "copeoDashProd";
var id_circle_porcentaje_dash_prod = "porcentajePagadoDashProd";

var json_procesos = {};
var json_datos_semana = {};

var nomina = 0;
var horas_extra = 0;
var diversos = 0;
var carga_social = 0;
var copeo = 0;
var total_pagado = 0;

// Aquí se va a necesitar llenar por permisos y credenciales.

$('#' + id_ddl_obra_dash_prod).empty();
var obra_select = document.getElementById(id_ddl_obra_dash_prod);

var option1 = document.createElement('option');
option1.style = "display:none";
option1.text = option1.value = "";
obra_select.appendChild(option1);

firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
    obra = snapshot.val();
    option_asignada = document.createElement('option');
    option_asignada.value = snapshot.key;
    option_asignada.text = obra.nombre;
    obra_select.appendChild(option_asignada);
});

var select = document.getElementById(id_ddl_prod_dash_prod);
var option = document.createElement('option');
option.text = option.value = "TODOS";
select.appendChild(option);

// -------------

$('#' + id_ddl_obra_dash_prod).change(function(){
    json_procesos = {};
    json_datos_semana = {};
    nomina = 0;
    horas_extra = 0;
    diversos = 0;
    carga_social = 0;
    copeo = 0;

    $('#' + id_ddl_prod_dash_prod).empty();
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(snapshot){
        var obra_selected = $('#' + id_ddl_obra_dash_prod + " option:selected").val()
        firebase.database().ref(rama_bd_obras + "/procesos/" + obra_selected + "/procesos").once("value").then(function(procesoSnapshot){
            firebase.database().ref(rama_bd_obras + "/copeo/" + obra_selected).once("value").then(function(copeoSnapshot){
                // llenado del DDL de procesos y definir json de procesos.
                var select = document.getElementById(id_ddl_prod_dash_prod);
                var option = document.createElement('option');
                option.text = option.value = "TODOS";
                select.appendChild(option);
                var proceso;
                procesoSnapshot.forEach(function(procesoSnap){
                    if(procesoSnap.key != "PC00"){
                        json_procesos[procesoSnap.key] = {
                            nomina:0,
                            horas_extra:0,
                            diversos:0,
                            carga_social:0,
                            iva:0,
                            total:0,
                            copeo:0,
                        }
    
                        proceso = procesoSnap.val();
                        if (procesoSnap.exists()){
                            if (snapshot.key !== "PC00"){ //descartamos los procesos default
                                option = document.createElement('option');
                                option.value = procesoSnap.key;
                                option.text = procesoSnap.key + " " + proceso.nombre;
                                select.appendChild(option);
                            };
                        };
                    };
                });
    
                // -------------------------------
    
                snapshot.forEach(function(regSnap){
                    var registro = regSnap.val();
                    var pago = 0;
    
                    if(registro.pagos_nomina){
                        pago = registro.pagos_nomina.monto;
                        var aux_proporcion = 0;
                        var aux = 0;
               
                        for(asistKey in registro.asistencias){
                            if(registro.asistencias[asistKey].actividad != "Falta"){
                                aux_proporcion += 0.2;
                                aux += (0.2 * registro.sueldo_semanal) * 1.16;
                            }
                        };
    
                        // calcular horas_extra
        
                        for(heKey in registro.horas_extra){
                            aux += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24) * 1.16;
                            if(registro.horas_extra[heKey].obra == obra_selected){
                                horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                                var proceso = registro.horas_extra[heKey].subproceso.split("-");
                                proceso = proceso[0];
                                json_procesos[proceso].horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                            }
                        }
                        for(divKey in registro.diversos){
                            aux += registro.diversos[divKey].cantidad * 1.16;
                            if(registro.diversos[divKey].obra == obra_selected){
                                diversos += registro.diversos[divKey].cantidad;
                                var proceso = registro.diversos[divKey].subproceso.split("-");
                                proceso = proceso[0];
                                json_procesos[proceso].diversos += registro.diversos[divKey].cantidad;
                            };
                        };
                        // calcular nomina
                        for(asistKey in registro.asistencias){
                            if(registro.asistencias[asistKey].actividad != "Falta" && registro.asistencias[asistKey].obra == obra_selected){
                                nomina += registro.sueldo_semanal * 0.2;
                                var proceso = registro.asistencias[asistKey].subproceso.split("-");
                                proceso = proceso[0];
                                json_procesos[proceso].nomina += registro.sueldo_semanal * 0.2;
                                if(aux_proporcion > 0 && pago - aux > 0) {
                                    carga_social += (pago - aux) * (0.2 / aux_proporcion);
                                    json_procesos[proceso].carga_social += (pago - aux) * (0.2 / aux_proporcion);
                                } 
                            }
                        };
    
                        if(json_datos_semana[registro.year_head + "_" + registro.week_head] == undefined){
                            json_datos_semana[registro.year_head + "_" + registro.week_head] = {
                                nomina: nomina,
                                horas_extra: horas_extra,
                                diversos: diversos,
                                iva: (nomina + horas_extra + diversos) * 0.16,
                                carga_social: carga_social,
                                total: (nomina + horas_extra + diversos) * 1.16 + carga_social
                            }
                        } else {
                            json_datos_semana[registro.year_head + "_" + registro.week_head].nomina += nomina;
                            json_datos_semana[registro.year_head + "_" + registro.week_head].horas_extra += horas_extra;
                            json_datos_semana[registro.year_head + "_" + registro.week_head].diversos += diversos;
                            json_datos_semana[registro.year_head + "_" + registro.week_head].iva += (nomina + horas_extra + diversos) * 0.16;
                            json_datos_semana[registro.year_head + "_" + registro.week_head].carga_social += carga_social
                            json_datos_semana[registro.year_head + "_" + registro.week_head].total += (nomina + horas_extra + diversos) * 1.16 + carga_social;
                        }
                    }
                });
    
                for(key in json_procesos){
                    json_procesos[key].iva = (json_procesos[key].nomina + json_procesos[key].horas_extra + json_procesos[key].diversos) * 0.16;
                    json_procesos[key].total = (json_procesos[key].nomina + json_procesos[key].horas_extra + json_procesos[key].diversos) * 1.16 + json_procesos[key].carga_social;
                }
    
                total_pagado = (nomina + horas_extra + diversos) * 1.16 + carga_social;
                $('#' + id_circle_pagado_dash_prod).text(formatMoney(total_pagado));

                if(copeoSnapshot.exists()){
                    copeoSnapshot.forEach(function(procCopeoSnap){
                        var proc = procCopeoSnap.key;
                        procCopeoSnap.forEach(function(subCopeoSnap){
                            var impuestos = (subCopeoSnap.val().impuestos) / 100;
                            subCopeoSnap.child("entradas").forEach(function(entradaSnap){
                                json_procesos[proc].copeo +=  (entradaSnap.val().subtotal)*(1+impuestos);
                                copeo += (entradaSnap.val().subtotal)*(1+impuestos);
                            });
                        })
                    });
                    $('#' + id_circle_porcentaje_dash_prod).text(((total_pagado/copeo)*100).toFixed(2) + "%");
                } else {
                    $('#' + id_circle_porcentaje_dash_prod).text("N/A");
                }
                
                $('#' + id_circle_copeo_dash_prod).text(formatMoney(copeo));
                // quito el hidden una vez cargado el resumen general.
                $('#' + id_div_resumen_general).removeClass('hidden');

            });

            
        });
    });
});

$('#' + id_ddl_prod_dash_prod).change(function(){
    var proceso = $('#' + id_ddl_prod_dash_prod + " option:selected").val();
    if(proceso == "TODOS"){
        $('#' + id_circle_pagado_dash_prod).text(formatMoney(total_pagado));
        $('#' + id_circle_copeo_dash_prod).text(formatMoney(copeo))
        if(copeo == 0){
            $('#' + id_circle_porcentaje_dash_prod).text("N/A");
        } else {
            $('#' + id_circle_porcentaje_dash_prod).text(((total_pagado/copeo)*100).toFixed(2) + "%");
        };
    } else {
        $('#' + id_circle_pagado_dash_prod).text(formatMoney(json_procesos[proceso].total));
        $('#' + id_circle_copeo_dash_prod).text(formatMoney(json_procesos[proceso].copeo))
        if(json_procesos[proceso].copeo == 0){
            $('#' + id_circle_porcentaje_dash_prod).text("N/A");
        } else {
            $('#' + id_circle_porcentaje_dash_prod).text(((json_procesos[proceso].total/json_procesos[proceso].copeo)*100).toFixed(2) + "%")
        };
    }
});