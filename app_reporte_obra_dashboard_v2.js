var id_tab_dash_prod = "tabPagosCliente";
var id_form_dash_prod = "tabDashProd";

var id_ddl_obra_dash_prod = "obraDashProd";
var id_ddl_prod_dash_prod = "procesoDashProd";


var id_div_resumen_general = "divReporteDashProd";
var id_div_analisis_personal = "divAnalisisPersonalDashProd";
var id_div_analisis_semanal = "analisisSemanalDashProd";
var id_div_total_semanal = "divTotalPagadoSemanal";

var id_div_acumulado = "lineChartDashBoard";
var id_div_pie_procesos_semanal = "procesosSemanalChartDashBoard";
var id_div_pie_tipo_semanal = "tiposSemanalChartDashBoard";
var id_div_pie_div_semanal = "diversosSemanalChartDashboard"
var id_div_bar_dest_semanal = "destajoSemanalChartDashboard";
var id_div_dona_esp_semanal = "especialidadSemanalChartDashboard";


var id_circle_pagado_dash_prod = "pagadoDashProd";
var id_circle_copeo_dash_prod = "copeoDashProd";
var id_circle_porcentaje_dash_prod = "porcentajePagadoDashProd";
var id_circle_total_semanal_dash_prod = "totalSemanalDashProd";

var id_ddl_year_dash_prod = "yearDashProd";
var id_ddl_week_dash_prod = "weekDashProd";


var json_procesos = {};
var json_datos_semana = {};
var json_registros_obra = {};

// voy a necesitar un json de trabajadores.

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


var select_year = document.getElementById(id_ddl_year_dash_prod);
for(i=actual_year;i>=starting_year;i--){
    var option_year = document.createElement('option');
    option_year.text = option_year.value = i;
    select_year.appendChild(option_year);
};

$('#' + id_ddl_week_dash_prod).empty();
var select_week = document.getElementById(id_ddl_week_dash_prod);

// Aquí insertar una empty que diga "SELECCIONA SEMANA"
var option = document.createElement('option');
option.style = "display:none";
option.text = option.value = "SELECCIONA SEMANA";
select_week.appendChild(option);

var option1 = document.createElement('option');
option1.text = option1.value = "TODAS LAS SEMANAS";
select_week.appendChild(option1);

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

// -------------

$('#' + id_ddl_obra_dash_prod).change(function(){
    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(snapshot){
        $('#' + id_ddl_week_dash_prod).val("SELECCIONA SEMANA");
        console.log("entro 1");
        json_procesos = {};
        json_datos_semana = {};
        json_registros_obra = {};
        nomina = 0;
        horas_extra = 0;
        diversos = 0;
        carga_social = 0;
        copeo = 0;
    
        $('#' + id_ddl_prod_dash_prod).empty();
        $('#' + id_div_acumulado).empty();
    
        $('#' + id_div_analisis_semanal).addClass('hidden');
        $('#' + id_div_analisis_personal).addClass('hidden');
        $('#' + id_div_total_semanal).addClass('hidden');
        var obra_selected = $('#' + id_ddl_obra_dash_prod + " option:selected").val()
        firebase.database().ref(rama_bd_obras + "/procesos/" + obra_selected + "/procesos").once("value").then(function(procesoSnapshot){
            firebase.database().ref(rama_bd_obras + "/copeo/" + obra_selected).once("value").then(function(copeoSnapshot){
                console.log("entro 2");
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
                            semanas:{}
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
                        var boolean_reg = false;
                        pago = registro.pagos_nomina.monto;
                        var aux_proporcion = 0;
                        var aux = 0;
               
                        for(asistKey in registro.asistencias){
                            if(registro.asistencias[asistKey].actividad != "Falta"){
                                aux_proporcion += 0.2;
                                aux += (0.2 * registro.sueldo_semanal);
                            }
                        };
    
                        // calcular horas_extra
                        for(heKey in registro.horas_extra){
                            aux += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                            if(registro.horas_extra[heKey].obra == obra_selected){
                                boolean_reg = true;
                                horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                                var proceso = registro.horas_extra[heKey].subproceso.split("-");
                                proceso = proceso[0];
                                json_procesos[proceso].horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);

                                if(json_datos_semana[registro.year_head + "_" + registro.week_head] == undefined){
                                    json_datos_semana[registro.year_head + "_" + registro.week_head] = {
                                        nomina: 0,
                                        horas_extra: registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24),
                                        diversos:0,
                                        carga_social:0,
                                    };
                                } else {
                                    json_datos_semana[registro.year_head + "_" + registro.week_head].horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                                };

                                // semanas por proceso 

                                if(json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] == undefined){
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] = {
                                        nomina: 0,
                                        horas_extra: registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24),
                                        diversos:0,
                                        carga_social:0,
                                    };
                                } else {
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head].horas_extra += registro.horas_extra[heKey].cantidad * (registro.sueldo_semanal / 24);
                                };
                            }
                        }

                        // calcular diversos
                        for(divKey in registro.diversos){
                            aux += registro.diversos[divKey].cantidad;
                            if(registro.diversos[divKey].obra == obra_selected){
                                boolean_reg = true;
                                diversos += registro.diversos[divKey].cantidad;
                                var proceso = registro.diversos[divKey].subproceso.split("-");
                                proceso = proceso[0];
                                json_procesos[proceso].diversos += registro.diversos[divKey].cantidad;

                                if(json_datos_semana[registro.year_head + "_" + registro.week_head] == undefined){
                                    json_datos_semana[registro.year_head + "_" + registro.week_head] = {
                                        nomina: 0,
                                        horas_extra: 0,
                                        diversos:registro.diversos[divKey].cantidad,
                                        carga_social:0,
                                    };
                                } else {
                                    json_datos_semana[registro.year_head + "_" + registro.week_head].diversos += registro.diversos[divKey].cantidad;
                                };

                                // procesos

                                if(json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] == undefined){
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] = {
                                        nomina: 0,
                                        horas_extra: 0,
                                        diversos:registro.diversos[divKey].cantidad,
                                        carga_social:0,
                                    };
                                } else {
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head].diversos += registro.diversos[divKey].cantidad;
                                };

                            };
                        };

                        // calcular nomina
                        for(asistKey in registro.asistencias){

                            if(registro.asistencias[asistKey].obra == obra_selected){
                                boolean_reg = true;
                            };

                            if(registro.asistencias[asistKey].actividad != "Falta" && registro.asistencias[asistKey].obra == obra_selected){                                
                                nomina += registro.sueldo_semanal * 0.2;
                                var proceso = registro.asistencias[asistKey].subproceso.split("-");

                                proceso = proceso[0];
                                json_procesos[proceso].nomina += registro.sueldo_semanal * 0.2;

                                if(json_datos_semana[registro.year_head + "_" + registro.week_head] == undefined){
                                    json_datos_semana[registro.year_head + "_" + registro.week_head] = {
                                        nomina: registro.sueldo_semanal * 0.2,
                                        horas_extra: 0,
                                        diversos:0,
                                        carga_social:0,
                                    };
                                } else {
                                    json_datos_semana[registro.year_head + "_" + registro.week_head].nomina += registro.sueldo_semanal * 0.2;
                                };

                                // procesos

                                if(json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] == undefined){
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head] = {
                                        nomina: registro.sueldo_semanal * 0.2,
                                        horas_extra: 0,
                                        diversos:0,
                                        carga_social:0,
                                    };
                                } else {
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head].nomina += registro.sueldo_semanal * 0.2;
                                };

                                if(aux_proporcion > 0 && pago - aux > 0) {
                                    carga_social += ((pago/1.16) - aux) * (0.2 / aux_proporcion);
                                    json_procesos[proceso].carga_social += ((pago/1.16) - aux) * (0.2 / aux_proporcion);
                                    json_procesos[proceso]["semanas"][registro.year_head + "_" + registro.week_head].carga_social +=  ((pago/1.16) - aux) * (0.2 / aux_proporcion);
                                    json_datos_semana[registro.year_head + "_" + registro.week_head].carga_social +=  ((pago/1.16) - aux) * (0.2 / aux_proporcion);
                                } 
                            }
                        };

                        if(boolean_reg){
                            json_registros_obra[regSnap.key] = registro;
                        }
                    };


                });
    
                for(key in json_procesos){
                    json_procesos[key].total = (json_procesos[key].nomina + json_procesos[key].horas_extra + json_procesos[key].diversos + json_procesos[key].carga_social) * 1.16;
                    json_procesos[key].iva = (json_procesos[key].nomina + json_procesos[key].horas_extra + json_procesos[key].diversos+ json_procesos[key].carga_social) * 0.16;
                }

                total_pagado = (nomina + horas_extra + diversos + carga_social) * 1.16;
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
                $('#' + id_div_resumen_general).removeClass('hidden')

                // Generar graf de total acumulado.

                var semanas = [];
                var montos_acumulados = [];
                var monto_acumulado = 0;

                for(key in json_datos_semana){
                    semanas.push(key);
                }
                
                semanas.sort();
                for(var i=0;i<semanas.length;i++){
                    monto_acumulado += (json_datos_semana[semanas[i]].nomina + json_datos_semana[semanas[i]].horas_extra + json_datos_semana[semanas[i]].diversos + json_datos_semana[semanas[i]].carga_social) * 1.16 
                    montos_acumulados.push(monto_acumulado.toFixed(2))
                };

                if(semanas.length >= 10){
                    semanas = semanas.slice(Math.max(semanas.length - 10, 0));
                    montos_acumulados = montos_acumulados.slice(Math.max(montos_acumulados.length - 10, 0));
                };

                var copeo_array = [];

                for(var j=0;j<semanas.length;j++){
                    copeo_array.push(copeo);
                };

                var canvas_line_total = document.createElement('canvas');
                canvas_line_total.id = "canvasMontoTotal"
                //canvas_line_total.style = "min-height: 350px; min-width: 350;"

                var canvas_container = document.getElementById(id_div_acumulado);
                canvas_container.appendChild(canvas_line_total);

                var config = {
                    type: 'line',
                    data: {
                        labels: semanas,
                        datasets: [{
                            label: 'COPEO',
                            backgroundColor: window.chartColors.red,
                            borderColor: window.chartColors.red,
                            data: copeo_array,
                            fill: false,
                        }, {
                            label: 'Monto acumulado',
                            fill: false,
                            backgroundColor: window.chartColors.blue,
                            borderColor: window.chartColors.blue,
                            data: montos_acumulados,
                        }]
                    },
                        options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Total acumulado'
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                },
                            },
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Semanas'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Monto Acumulado'
                                }
                            }]
                        }
                    } 
                };

                var ctx = document.getElementById(canvas_line_total.id).getContext('2d');
                window.myLine = new Chart(ctx, config); 
                // aquí terminan los firebase
            }); 
        });
    });
});

$('#' + id_ddl_prod_dash_prod).change(function(){

    $('#' + id_div_acumulado).empty();

    var semanas = [];
    var montos_acumulados = [];
    var copeo_array = [];

    var monto_acumulado = 0;

    var proceso = $('#' + id_ddl_prod_dash_prod + " option:selected").val();
    if(proceso == "TODOS"){
        $('#' + id_circle_pagado_dash_prod).text(formatMoney(total_pagado));
        $('#' + id_circle_copeo_dash_prod).text(formatMoney(copeo))
        if(copeo == 0){
            $('#' + id_circle_porcentaje_dash_prod).text("N/A");
        } else {
            $('#' + id_circle_porcentaje_dash_prod).text(((total_pagado/copeo)*100).toFixed(2) + "%");
        };

        for(key in json_datos_semana){
            semanas.push(key);
        }
        
        semanas.sort();
        for(var i=0;i<semanas.length;i++){
            monto_acumulado += (json_datos_semana[semanas[i]].nomina + json_datos_semana[semanas[i]].horas_extra + json_datos_semana[semanas[i]].diversos + json_datos_semana[semanas[i]].carga_social) * 1.16
            montos_acumulados.push(monto_acumulado.toFixed(2));
        };

        if(semanas.length >= 10){
            semanas = semanas.slice(Math.max(semanas.length - 10, 0));
            montos_acumulados = montos_acumulados.slice(Math.max(montos_acumulados.length - 10, 0));
        };

        for(var j=0;j<semanas.length;j++){
            copeo_array.push(copeo);
        };


    } else {
        $('#' + id_circle_pagado_dash_prod).text(formatMoney(json_procesos[proceso].total));
        $('#' + id_circle_copeo_dash_prod).text(formatMoney(json_procesos[proceso].copeo))
        if(json_procesos[proceso].copeo == 0){
            $('#' + id_circle_porcentaje_dash_prod).text("N/A");
        } else {
            $('#' + id_circle_porcentaje_dash_prod).text(((json_procesos[proceso].total/json_procesos[proceso].copeo)*100).toFixed(2) + "%")
        };

        for(key in json_procesos[proceso]["semanas"]){
            semanas.push(key);
        }
        semanas.sort();

        for(var i=0;i<semanas.length;i++){
            monto_acumulado += (json_procesos[proceso]["semanas"][semanas[i]].nomina + json_procesos[proceso]["semanas"][semanas[i]].horas_extra + json_procesos[proceso]["semanas"][semanas[i]].diversos + json_procesos[proceso]["semanas"][semanas[i]].carga_social) * 1.16
            montos_acumulados.push(monto_acumulado.toFixed(2))
        };
      
        if(semanas.length >= 10){
            semanas = semanas.slice(Math.max(semanas.length - 10, 0));
            montos_acumulados = montos_acumulados.slice(Math.max(montos_acumulados.length - 10, 0));
        };

        for(var j=0;j<semanas.length;j++){
            copeo_array.push(json_procesos[proceso].copeo);
        };
    };


    var canvas_line_total = document.createElement('canvas');
    canvas_line_total.id = "canvasMontoTotal"
    //canvas_line_total.style = "min-height: 350px; min-width: 350;"

    var canvas_container = document.getElementById(id_div_acumulado);
    canvas_container.appendChild(canvas_line_total);

    var config = {
        type: 'line',
        data: {
            labels: semanas,
            datasets: [{
                label: 'COPEO',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: copeo_array,
                fill: false,
            }, {
                label: 'Monto acumulado',
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: montos_acumulados,
            }]
        },
            options: {
            responsive: true,
            title: {
                display: true,
                text: 'Total acumulado'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(tooltipItem, data) {
                        return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    },
                },  
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Semanas'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Monto Acumulado'
                    }
                }]
            }
        } 
    };

    var ctx = document.getElementById(canvas_line_total.id).getContext('2d');
    window.myLine = new Chart(ctx, config); 

});

// analisis semanal

$('#' + id_ddl_year_dash_prod).change(function(){
    $('#' + id_ddl_week_dash_prod).empty();
    $('#' + id_div_analisis_semanal).addClass('hidden');
    $('#' + id_div_total_semanal).addClass('hidden');

    var select = document.getElementById(id_ddl_week_dash_prod);
    var year = $('#' + id_ddl_year_dash_prod + " option:selected").val();

    // Aquí hacer lo mismo de insertar "Selecciona semana"

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "SELECCIONA SEMANA";
    select.appendChild(option);

    var option1 = document.createElement('option');
    option1.text = option1.value = "TODAS LAS SEMANAS";
    select.appendChild(option1);

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
});

$('#' + id_ddl_week_dash_prod).change(function(){

    $('#' + id_div_analisis_personal).addClass('hidden');
    var diversos_json = {};
    var esp_json = {};
    var monto_destajo = 0;
    var monto_admon = 0;

    $('#' + id_div_pie_procesos_semanal).empty();
    $('#' + id_div_pie_tipo_semanal).empty();
    $('#' + id_div_pie_div_semanal).empty();
    $('#' + id_div_bar_dest_semanal).empty();
    $('#' + id_div_dona_esp_semanal).empty();
    
    $('#' + id_div_analisis_semanal).addClass('hidden');
    $('#' + id_div_total_semanal).addClass('hidden');
    var week_selected = $('#' + id_ddl_week_dash_prod + " option:selected").val();
    var year_selected = $('#' + id_ddl_year_dash_prod + " option:selected").val();  

    // 
    if(week_selected != "TODAS LAS SEMANAS"){
        var key = year_selected + "_" + week_selected;
        if(!json_datos_semana[key]){
            alert("No hay datos de la semana seleccionada");
            $('#' + id_ddl_week_dash_prod).val("SELECCIONA SEMANA");
            return;
        };

        $('#' + id_div_analisis_personal).removeClass('hidden');
        $('#' + id_div_analisis_semanal).removeClass('hidden');
        $('#' + id_div_total_semanal).removeClass('hidden');
        
        firebase.database().ref(rama_bd_datos_referencia).on("value", function(snapshot){
            snapshot.child("diversos").forEach(function(divSnap){
                diversos_json[divSnap.key] = {
                    nombre: divSnap.val(),
                    monto:0
                };
            });

            snapshot.child("especialidades").forEach(function(espSnap){
                esp_json[espSnap.key] = {
                    nombre: espSnap.val().clave,
                    monto:0
                };
            });

            $('#' + id_circle_total_semanal_dash_prod).text(formatMoney((json_datos_semana[key].nomina + json_datos_semana[key].horas_extra + json_datos_semana[key].diversos + json_datos_semana[key].carga_social) *1.16));
            // si selecciona todas las semanas, queremos totales.
            // Pie por procesos
    
            var procesos_datos = [];
            var total_procesos_datos = [];
    
            for(proc in json_procesos){
                if(json_procesos[proc].total > 0){
                    if(json_procesos[proc]["semanas"][key]){
                        procesos_datos.push(proc);
                        var monto = (json_procesos[proc]["semanas"][key].nomina + json_procesos[proc]["semanas"][key].horas_extra + json_procesos[proc]["semanas"][key].diversos + json_procesos[proc]["semanas"][key].carga_social) * 1.16;
                        monto = monto.toFixed(2);
                        total_procesos_datos.push(monto);
                    };
                };
            };
    
            var canvas_procesos = document.createElement('canvas');
            canvas_procesos.id = "canvasPieProc";
    
            var canvas_container = document.getElementById(id_div_pie_procesos_semanal);
    
            canvas_container.appendChild(canvas_procesos);
            
            var config = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: total_procesos_datos,
                        backgroundColor: palette('tol-sq', total_procesos_datos.length).map(function(hex) {
                            return '#' + hex;
                          })
                    }],
                    labels: procesos_datos
                },
                options: {
                    title: {
                        display: true,
                        text: 'Pie - Procesos'
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            };
    
            var ctx = document.getElementById(canvas_procesos.id).getContext('2d');
            window.myPie = new Chart(ctx, config);
    
            // pie por tipo
            var tipo_datos = ["Nómina", "Horas Extra", "Diversos"];
            var total_tipo_datos = [];
    
            var canvas_tipo = document.createElement('canvas');
            canvas_tipo.id = "canvasPieTipo";
    
            var canvas_container = document.getElementById(id_div_pie_tipo_semanal);
    
            canvas_container.appendChild(canvas_tipo);
            
            total_tipo_datos[0] = ((json_datos_semana[key].nomina + json_datos_semana[key].carga_social) * 1.16).toFixed(2);
            total_tipo_datos[1] = (json_datos_semana[key].horas_extra * 1.16).toFixed(2);
            total_tipo_datos[2] = (json_datos_semana[key].diversos * 1.16).toFixed(2);
    
             var config1 = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: total_tipo_datos,
                        backgroundColor: [
                            window.chartColors.orange,
                            window.chartColors.yellow,
                            window.chartColors.red,
                        ]
                    }],
                    labels: tipo_datos
                },
                options: {
                    title: {
                        display: true,
                        text: 'Pie - Tipo'
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            };
    
            var ctx1 = document.getElementById(canvas_tipo.id).getContext('2d');
            window.myPie = new Chart(ctx1, config1); 


            //.--------------------DATOS DE LOS REGISTROS DE LA OBRA --------------------

            var obra_selected = $('#' + id_ddl_obra_dash_prod + " option:selected").val();

            for(reg in json_registros_obra){
                var year_week = json_registros_obra[reg].year_head + "_" + json_registros_obra[reg].week_head;
                if(year_week == key){

                    var pago = json_registros_obra[reg].pagos_nomina.monto;
                    var aux_proporcion = 0;
                    var aux = 0;
           
                    if(json_registros_obra[reg].asistencias){
                        for(asistKey in json_registros_obra[reg].asistencias){
                            if(json_registros_obra[reg].asistencias[asistKey].actividad != "Falta"){
                                aux_proporcion += 0.2;
                                aux += (0.2 * json_registros_obra[reg].sueldo_semanal);
                            }
                        };
                    }

                    // horas_extra
                    if(json_registros_obra[reg].horas_extra){
                        for(heKey in json_registros_obra[reg].horas_extra){
                            aux += json_registros_obra[reg].horas_extra[heKey].cantidad * (json_registros_obra[reg].sueldo_semanal / 24);
                            if(json_registros_obra[reg].horas_extra[heKey].obra == obra_selected){
                                esp_json[json_registros_obra[reg].trabajador_esp].monto += (json_registros_obra[reg].horas_extra[heKey].cantidad * (json_registros_obra[reg].sueldo_semanal / 24))*1.16;

                                if(json_registros_obra[reg].trabajador_jefe == "HEAD"){
                                    monto_admon += (json_registros_obra[reg].horas_extra[heKey].cantidad * (json_registros_obra[reg].sueldo_semanal / 24))*1.16;
                                } else {
                                    monto_destajo += (json_registros_obra[reg].horas_extra[heKey].cantidad * (json_registros_obra[reg].sueldo_semanal / 24))*1.16;
                                }
                            };
                        };
                    }
                    // diversos
                    if(json_registros_obra[reg].diversos){   
                        for(div in json_registros_obra[reg].diversos){
                            aux += json_registros_obra[reg].diversos[div].cantidad;
                            if(json_registros_obra[reg].diversos[div].obra == obra_selected){
                                esp_json[json_registros_obra[reg].trabajador_esp].monto += json_registros_obra[reg].diversos[div].cantidad * 1.16;
                                diversos_json[json_registros_obra[reg].diversos[div].tipo].monto += json_registros_obra[reg].diversos[div].cantidad * 1.16;

                                if(json_registros_obra[reg].trabajador_jefe == "HEAD"){
                                    monto_admon += json_registros_obra[reg].diversos[div].cantidad * 1.16;
                                } else {
                                    monto_destajo += json_registros_obra[reg].diversos[div].cantidad * 1.16;
                                }
                            }
                        }
                    };

                    if(json_registros_obra[reg].asistencias){
                        for(asistKey in json_registros_obra[reg].asistencias){
                            if(json_registros_obra[reg].obra == obra_selected){
                                // necesito un contador ??? para sacar %s de asistencia
                            };
                            if(json_registros_obra[reg].asistencias[asistKey].actividad != "Falta" && json_registros_obra[reg].asistencias[asistKey].obra == obra_selected){                                
                                esp_json[json_registros_obra[reg].trabajador_esp].monto += (json_registros_obra[reg].sueldo_semanal * 0.2) * 1.16;

                                if(json_registros_obra[reg].trabajador_jefe == "HEAD"){
                                    monto_admon += (json_registros_obra[reg].sueldo_semanal * 0.2) * 1.16;
                                } else {
                                    monto_destajo += (json_registros_obra[reg].sueldo_semanal * 0.2) * 1.16;
                                }

                                if(aux_proporcion > 0 && pago - aux > 0) {
                                    // carga social
                                    esp_json[json_registros_obra[reg].trabajador_esp].monto += ((pago/1.16) - aux) * (0.2 / aux_proporcion) * 1.16;

                                    if(json_registros_obra[reg].trabajador_jefe == "HEAD"){
                                        monto_admon += ((pago/1.16) - aux) * (0.2 / aux_proporcion) * 1.16;
                                    } else {
                                        monto_destajo += ((pago/1.16) - aux) * (0.2 / aux_proporcion) * 1.16;
                                    };
                                };
                            };

                        };
                    };
                };
            };
            // --------------------------------------
            var diversos_nombres = [];
            var diversos_datos = [];

            for(div in diversos_json){
                if(diversos_json[div].monto > 0){
                    diversos_nombres.push(diversos_json[div].nombre)
                    diversos_datos.push(diversos_json[div].monto.toFixed(2));
                }
            }

            var barChartData = {
                labels: diversos_nombres,
                datasets: [{
                    label: 'Diversos',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: diversos_datos
                }]
            };

            var canvas_div = document.createElement('canvas');
            canvas_div.id = "canvasPieDiv";
    
            var canvas_container_div = document.getElementById(id_div_pie_div_semanal);
    
            canvas_container_div.appendChild(canvas_div);

            var ctx3 = document.getElementById(canvas_div.id).getContext('2d');
			window.myBar = new Chart(ctx3, {
				type: 'bar',
				data: barChartData,
				options: {
					responsive: true,
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Desgloce de pagos diversos'
					},
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
				}
            });
            

            // analisis por destajo

            var barChartData1 = {
                labels: ["HEAD", "Destajos"],
                datasets: [{
                    label: 'Nómina',
                    backgroundColor: window.chartColors.orange,
                    borderColor: window.chartColors.orange,
                    borderWidth: 1,
                    data: [monto_admon.toFixed(2), monto_destajo.toFixed(2)]
                }]
            };

            var canvas_dest = document.createElement('canvas');
            canvas_dest.id = "canvasPieDest";
    
            var canvas_container_dest = document.getElementById(id_div_bar_dest_semanal);
    
            canvas_container_dest.appendChild(canvas_dest);

            var ctx4 = document.getElementById(canvas_dest.id).getContext('2d');
			window.myBar = new Chart(ctx4, {
				type: 'bar',
				data: barChartData1,
				options: {
					responsive: true,
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Nómina administrativa por destajo o administración'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
				}
            });

            //  Análisis por puesto

            var especialidad_nombres = [];
            var especialidad_datos = [];

            for(esp in esp_json){
                if(esp_json[esp].monto > 0){
                    especialidad_nombres.push(esp_json[esp].nombre)
                    especialidad_datos.push(esp_json[esp].monto.toFixed(2));
                }
            }

            var configDoug = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: especialidad_datos,
                        backgroundColor: [
                            window.chartColors.red,
                            window.chartColors.orange,
                            window.chartColors.yellow,
                            window.chartColors.green,
                            window.chartColors.blue,
                        ],
                        label: 'Distribución por especialidad'
                    }],
                    labels: especialidad_nombres
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribución por especialidad'
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            };

            var canvas_esp = document.createElement('canvas');
            canvas_esp.id = "canvasPieEsp";
    
            var canvas_container_esp = document.getElementById(id_div_dona_esp_semanal);
    
            canvas_container_esp.appendChild(canvas_esp);

            var ctx5 = document.getElementById(canvas_esp.id).getContext('2d');
            window.myPie = new Chart(ctx5, configDoug); 

            // aquí termina firebase
        });
    } else {

    }

    
});