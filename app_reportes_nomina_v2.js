var id_tab_reporte_nomina = "tabReporteNomina";

var id_dataTable_reporte_global_reporte_nomina = "dataTableGlobalReporteNomina";
var id_dataTable_reporte_semanal_reporte_nomina = "dataTableSemanalReporteNomina";
var id_dataTable_reporte_obra_reporte_nomina = "dataTableObraReporteNomina"
var id_pie_chart_semanal_reporte_nomina = "pieSemanalReporteNomina";

var id_ddl_year_reporte_nomina = "yearDdlReporteNomina";
var id_ddl_week_reporte_nomina = "weekDdlReporteNomina";
var id_ddl_obra_reporte_nomina = "obraDdlReporteNomina";

$('#' + id_tab_reporte_nomina).click(function(){
    firebase.database().ref("version2/info_web").set({
        info_web: 4.01,
        formatos: "dummy",
    });
    // construir el canvas desde el js y así lo puedo destruir
    var select_year = document.getElementById(id_ddl_year_reporte_nomina);
    for(i=actual_year;i>=starting_year;i--){
        var option_year = document.createElement('option');
        option_year.text = option_year.value = i;
        select_year.appendChild(option_year);
    };

    $('#' + id_ddl_week_reporte_nomina).empty();
    var select_week = document.getElementById(id_ddl_week_reporte_nomina);
    for(i=actual_week;i>0;i--){
        var ju_mi = getDaysWeek(i,actual_year);
        var jueves = ju_mi[0];
        var miercoles = ju_mi[1];
        var week = ("0" + i).slice(-2)

        jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
        miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);

        var option_week = document.createElement('option');
        option_week.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
        option_week.value = week;
        select_week.appendChild(option_week);
    }

    $('#' + id_ddl_obra_reporte_nomina).empty();
    var select_asignada = document.getElementById(id_ddl_obra_reporte_nomina);
    var option_asignada = document.createElement('option');
    option_asignada.text = option_asignada.value = "TODAS";
    select_asignada.appendChild(option_asignada);
    var obra;
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra = snapshot.val();
        option_asignada = document.createElement('option');
        option_asignada.value = snapshot.key;
        option_asignada.text = obra.nombre;
        select_asignada.appendChild(option_asignada);
    });

    tableReporteGlobalReporteNomina();
    reporteSemanalReporteNomina();
    reporteObraReporteNomina();
});

$('#' + id_ddl_year_reporte_nomina).change(function(){
    $('#' + id_ddl_week_reporte_nomina).empty();
    $('#' + id_fecha_pagos_nomina).val("");

    var select = document.getElementById(id_ddl_week_reporte_nomina);
    var year = $('#' + id_ddl_year_reporte_nomina + " option:selected").val();
    if(year < new Date().getFullYear()){
        var ultima_semana = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ultima_semana;i>0;i--){

            var ju_mi = getDaysWeek(i,year);
            var jueves = ju_mi[0];
            var miercoles = ju_mi[1];
            var week = ("0" + i).slice(-2)
    
            jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
            miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);

            var option = document.createElement('option');
            option.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
            option.value = week;
            select.appendChild(option);
        }
    } else {
        for(i=getWeek(new Date().getTime())[0];i>0;i--){
            var ju_mi = getDaysWeek(i,year);
            var jueves = ju_mi[0];
            var miercoles = ju_mi[1];
            var week = ("0" + i).slice(-2)
    
            jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
            miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);
            
            var option = document.createElement('option');
            option.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
            option.value = week;
            select.appendChild(option);
        };
    };
    reporteSemanalReporteNomina();
});

$('#' + id_ddl_week_reporte_nomina).change(function(){
    reporteSemanalReporteNomina();
});
// tabla para el reporte más general.

function tableReporteGlobalReporteNomina(){
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(regSnap){
        firebase.database().ref(rama_bd_obras + "/listas/obras_activas").once("value").then(function(obraSnap){
            firebase.database().ref(rama_bd_nomina + "/listas/obras").once("value").then(function(listaSnap){
                var datos = [];
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
                    var nomina = 0;
                    var horas_extra = 0;
                    var diversos = 0;
                    // de los 3 de arriba sale el subtotal y del de abajo - subtotal salen impuestos
                    var carga_social = 0;
                    var pagado = 0;
                    var iva = 0;

                    for(key in registros_obra){ 
                        var nomina_reg = 0;
                        var pago_reg = 0; 
                        var proporcion_reg = 0;
                        var carga_social_reg = 0;
                        var diverso_reg = 0;
                        var he_reg = 0;
                        var iva_reg = 0;

                        // aux es el total de NOM + DIV + HE + IVA de todo el registro, servirá para obtener la carga social
                        // ya que CS = (Pago_Total - aux )
                        // y CS_reg = CS * proporcion
                        var aux = 0;
                        
                        // el caso donde hay faltas, no solo es sumar de 0.2 en 0.2 para obtener la prop;
                        var aux_proporcion = 0;

                        if(regSnap.val()[key].pagos_nomina != null){
                            pago_reg = regSnap.val()[key].pagos_nomina.monto;
                       
                            for(heKey in regSnap.val()[key].horas_extra){
                                if(regSnap.val()[key].horas_extra[heKey].obra == obra_key){
                                    he_reg += regSnap.val()[key].horas_extra[heKey].cantidad * (regSnap.val()[key].sueldo_semanal / 24);
                                    iva_reg += regSnap.val()[key].horas_extra[heKey].cantidad * (regSnap.val()[key].sueldo_semanal / 24) * 0.16;
                                };
                                aux += regSnap.val()[key].horas_extra[heKey].cantidad * (regSnap.val()[key].sueldo_semanal / 24) * 1.16;
                            };
                            horas_extra += parseFloat(he_reg.toFixed(2));
                            
                            for(divKey in regSnap.val()[key].diversos){
                                if(regSnap.val()[key].diversos[divKey].obra == obra_key){
                                    diverso_reg += regSnap.val()[key].diversos[divKey].cantidad;
                                    iva_reg += regSnap.val()[key].diversos[divKey].cantidad * 0.16;
                                };
                                aux += regSnap.val()[key].diversos[divKey].cantidad * 1.16;
                            };
                            diversos += parseFloat(diverso_reg.toFixed(2));

                            for( asistKey in regSnap.val()[key].asistencias){
                                if(regSnap.val()[key].asistencias[asistKey].obra == obra_key && regSnap.val()[key].asistencias[asistKey].actividad != "Falta"){
                                    nomina_reg += regSnap.val()[key].sueldo_semanal * 0.2;
                                    iva_reg += (regSnap.val()[key].sueldo_semanal*0.2) * 0.16;
                                    proporcion_reg += 0.2;
                                };
                                if(regSnap.val()[key].asistencias[asistKey].actividad != "Falta"){
                                    aux += (regSnap.val()[key].sueldo_semanal*0.2) * 1.16;
                                    aux_proporcion += 0.2;
                                }  
                            };

                            carga_social_reg = (pago_reg - aux) * (proporcion_reg / aux_proporcion);
                            


                            nomina += parseFloat(nomina_reg.toFixed(2));
                            iva += parseFloat(iva_reg.toFixed(2));
                            carga_social += parseFloat(carga_social_reg.toFixed(2));
                        };                   
                    };
                    
                    if(nomina + horas_extra + diversos > 0){
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
                            formatMoney(carga_social),
                            formatMoney(nomina + horas_extra + diversos + iva + carga_social),
                        ]);
                    };
                });

                tabla_reporte_global_nomina = $('#'+ id_dataTable_reporte_global_reporte_nomina).DataTable({
                    destroy: true,
                    data: datos,
                    language: idioma_espanol,                    
                    "autoWidth": false,
                    dom: 'Bfrtip',
                    "columnDefs": [
                        {
                            targets: [-1],
                            className: 'bolded'
                        },
                        { targets: "_all", className: 'dt-body-center'},
                    ],
                    buttons: [
                        {extend: 'excelHtml5',
                        title: "Reporte_global_nomina",
                        exportOptions: {
                            columns: [':visible']
                        }},
                    ],
                });
            });
        });
    });
};

function reporteSemanalReporteNomina(){
    $('#' + id_pie_chart_semanal_reporte_nomina).empty();
   //$('#' + id_dataTable_reporte_semanal_reporte_nomina).empty();
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(regSnap){
        firebase.database().ref(rama_bd_obras + "/listas/obras_activas").once("value").then(function(obraSnap){
            firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/" + $('#' + id_ddl_year_reporte_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_reporte_nomina + " option:selected").val()).once("value").then(function(listaSnap){
                console.log(1);
                var datos = [];
                obraSnap.forEach(function(obraSubSnap){
                    obra_nombre = obraSubSnap.val().nombre;
                    var nomina = 0;
                    var horas_extra = 0;
                    var diversos = 0;
                    // de los 3 de arriba sale el subtotal y del de abajo - subtotal salen impuestos
                    var carga_social = 0;
                    var pagado = 0;
                    var iva = 0;

                    // aux es el total de NOM + DIV + HE + IVA de todo el registro, servirá para obtener la carga social
                    // ya que CS = (Pago_Total - aux )
                    // y CS_reg = CS * proporcion
                    
                    // el caso donde hay faltas, no solo es sumar de 0.2 en 0.2 para obtener la prop;
                    
                    listaSnap.forEach(function(subSnap){
                        console.log(subSnap.key);
                        var aux = 0;
                        var aux_proporcion = 0;


                        var reg_key = Object.keys(subSnap.val())[0];
                        var nomina_reg = 0;
                        var pago_reg = 0; 
                        var proporcion_reg = 0;
                        var carga_social_reg = 0;
                        var diverso_reg = 0;
                        var he_reg = 0;
                        var iva_reg = 0;
                        if(regSnap.val()[reg_key].pagos_nomina != null){
                            pago_reg = regSnap.val()[reg_key].pagos_nomina.monto;
                       
                            for(heKey in regSnap.val()[reg_key].horas_extra){
                                if(regSnap.val()[reg_key].horas_extra[heKey].obra == obraSubSnap.key){
                                    he_reg += regSnap.val()[reg_key].horas_extra[heKey].cantidad * (regSnap.val()[reg_key].sueldo_semanal / 24);
                                    iva_reg += regSnap.val()[reg_key].horas_extra[heKey].cantidad * (regSnap.val()[reg_key].sueldo_semanal / 24) * 0.16;
                                };
                                aux += regSnap.val()[reg_key].horas_extra[heKey].cantidad * (regSnap.val()[reg_key].sueldo_semanal / 24) * 1.16;
                            };
                            horas_extra += parseFloat(he_reg.toFixed(2));
                            
                            for(divKey in regSnap.val()[reg_key].diversos){
                                if(regSnap.val()[reg_key].diversos[divKey].obra == obraSubSnap.key){
                                    diverso_reg += regSnap.val()[reg_key].diversos[divKey].cantidad;
                                    iva_reg += regSnap.val()[reg_key].diversos[divKey].cantidad * 0.16;
                                };
                                aux += regSnap.val()[reg_key].diversos[divKey].cantidad * 1.16;
                            };
                            diversos += parseFloat(diverso_reg.toFixed(2));

                            for( asistKey in regSnap.val()[reg_key].asistencias){
                                if(regSnap.val()[reg_key].asistencias[asistKey].obra == obraSubSnap.key && regSnap.val()[reg_key].asistencias[asistKey].actividad != "Falta"){
                                    nomina_reg += regSnap.val()[reg_key].sueldo_semanal * 0.2;
                                    iva_reg += (regSnap.val()[reg_key].sueldo_semanal*0.2) * 0.16;
                                    proporcion_reg += 0.2;
                                };
                                if(regSnap.val()[reg_key].asistencias[asistKey].actividad != "Falta"){
                                    aux += (regSnap.val()[reg_key].sueldo_semanal*0.2) * 1.16;
                                    aux_proporcion += 0.2;
                                }  
                            };
                            carga_social_reg = (pago_reg - aux) * (proporcion_reg / aux_proporcion);
                            
                            nomina += parseFloat(nomina_reg.toFixed(2));
                            iva += parseFloat(iva_reg.toFixed(2));
                            carga_social += parseFloat(carga_social_reg.toFixed(2));
                        };     
                    });

                    if(nomina + horas_extra + diversos > 0){
                        datos.push([
                            obra_nombre,
                            formatMoney(nomina),
                            formatMoney(horas_extra),
                            formatMoney(diversos),
                            formatMoney(nomina + horas_extra + diversos),
                            formatMoney(iva + carga_social),
                            formatMoney(nomina + horas_extra + diversos + iva + carga_social),
                        ]);
                    };
                });

                tabla_reporte_semanal_nomina = $('#'+ id_dataTable_reporte_semanal_reporte_nomina).DataTable({
                    destroy: true,
                    data: datos,
                    language: idioma_espanol,                    
                    "autoWidth": false,
                    dom: 'Bfrtip',
                    "columnDefs": [
                        {
                            targets: [-1],
                            className: 'bolded'
                        },
                        { targets: "_all", className: 'dt-body-center'},
                    ],
                    buttons: [
                        {extend: 'excelHtml5',
                        title: "Reporte_global_nomina",
                        exportOptions: {
                            columns: [':visible']
                        }},
                    ],
                });
                var nombres_obras = [];
                var total_obras = [];
                for(var i=0; i<datos.length;i++){
                    nombres_obras[i] = datos[i][0];
                    total_obras[i] = deformatMoney(datos[i][6]);
                };

                console.log(2);
                // pie
                var canvas = document.createElement('canvas');
                canvas.style = "min-height: 350px; min-width: 350;"
                canvas.id = "canvasPie"

                var canvas_container = document.getElementById(id_pie_chart_semanal_reporte_nomina);
                canvas_container.appendChild(canvas);
                var config = {
                    type: 'pie',
                    data: {
                        datasets: [{
                            data: total_obras,
                            backgroundColor: [
                                window.chartColors.red,
                                window.chartColors.orange,
                                window.chartColors.yellow,
                                window.chartColors.green,
                                window.chartColors.blue,
                            ],
                        }],
                        labels: nombres_obras
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Resumen Semanal'
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                };
                var ctx = document.getElementById(canvas.id).getContext('2d');
                window.myPie = new Chart(ctx, config);
            });
        });
    });
};

function reporteObraReporteNomina(){
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(snapshot){
        var json_datos = {};
        var obra_selected = $('#' + id_ddl_obra_reporte_nomina + " option:selected").val()
        if(obra_selected == "TODAS"){
            snapshot.forEach(function(regSnap){
                var registro = regSnap.val();
                var nomina = 0;
                var horas_extra = 0;
                var diversos = 0;
                var iva = 0;
                var pago = 0;

                if(registro.pagos_nomina){
                    pago = registro.pagos_nomina.monto;
                    for(asistKey in registro.asistencias){
                        if(registro.asistencias[asistKey].actividad != "Falta"){
                            nomina += registro.sueldo_semanal * 0.2;
                        }
                    }
    
                    for(heKey in registro.horas_extra){
                        horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                    }
                    for(divKey in registro.diversos){
                        diversos += registro.diversos[divKey].cantidad;
                    };
    
                    iva = (nomina + horas_extra + diversos)*0.16
    
                    if(json_datos[registro.year_head + "_" + registro.week_head] == undefined){
                        json_datos[registro.year_head + "_" + registro.week_head] = {
                            nomina: nomina,
                            horas_extra: horas_extra,
                            diversos: diversos,
                            iva: iva,
                            carga_social: pago - nomina - horas_extra - diversos - iva,
                            total: pago
                        }
                    } else {
                        json_datos[registro.year_head + "_" + registro.week_head].nomina += nomina;
                        json_datos[registro.year_head + "_" + registro.week_head].horas_extra += horas_extra;
                        json_datos[registro.year_head + "_" + registro.week_head].diversos += diversos;
                        json_datos[registro.year_head + "_" + registro.week_head].iva += iva;
                        json_datos[registro.year_head + "_" + registro.week_head].carga_social += pago - nomina - horas_extra - diversos - iva;
                        json_datos[registro.year_head + "_" + registro.week_head].total += pago;
                    }
                }
            });
        } else {

        };

        var datos = [];
        for(key in json_datos){
            datos.push([
                key.split("_")[0],
                key.split("_")[1],
                formatMoney(json_datos[key].nomina),
                "" + ((json_datos[key].nomina / (json_datos[key].nomina + json_datos[key].horas_extra + json_datos[key].diversos)) * 100).toFixed(2) +"%", 
                formatMoney(json_datos[key].horas_extra),
                "" + ((json_datos[key].horas_extra / (json_datos[key].nomina + json_datos[key].horas_extra + json_datos[key].diversos)) * 100).toFixed(2) +"%", 
                formatMoney(json_datos[key].diversos),
                "" + ((json_datos[key].diversos / (json_datos[key].nomina + json_datos[key].horas_extra + json_datos[key].diversos)) * 100).toFixed(2) +"%", 
                formatMoney(json_datos[key].nomina + json_datos[key].horas_extra + json_datos[key].diversos),
                formatMoney(json_datos[key].iva),
                formatMoney(json_datos[key].carga_social),
                formatMoney(json_datos[key].total),
            ]);
        };
        tabla_reporte_obra_nomina = $('#'+ id_dataTable_reporte_obra_reporte_nomina).DataTable({
            destroy: true,
            data: datos,
            language: idioma_espanol,                    
            "autoWidth": false,
            dom: 'Bfrtip',
            "order": [[ 0, "desc" ]],
            "columnDefs": [
                { "width": "20%", "targets": 3 },
                {
                    targets: [-1],
                    className: 'bolded'
                },
                { targets: "_all", className: 'dt-body-center'},
            ],
            buttons: [
                {extend: 'excelHtml5',
                title: "Reporte_global_nomina",
                exportOptions: {
                    columns: [':visible']
                }},
            ],
        });
    });
}