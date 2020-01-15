var id_tab_reporte_pagos = "tabReportePagos";
var id_form_reporte_pagos = "formReportePagos";
var id_container_reporte_pagos = "containerReportePagos";
var id_dataTable_global_reporte_pagos = "dataTableResumenGeneralReportePagos";
var id_dataTable_proc_reporte_pagos = "dataTableResumenProcReportePagos";

var id_div_resumen_reporte_pagos = "containerResumenReportePagos";
var id_div_table_global_reporte_pagos = "divTableResumenGeneralReportePagos";
var id_div_table_proc_reporte_pagos = "divTableResumenProcReportePagos";


// variables 

var id_fecha_inicio_reporte_pagos = "fechaInicioReportePagos";
var id_fecha_fin_reporte_pagos = "fechaFinReportePagos";
var id_ddl_obra_reporte_pagos = "obraReportePagos";
var id_ddl_cliente_reporte_pagos = "clienteReportePagos";

var id_total_resumen_reporte_pagos = "totalResumenReportePagos";
var id_est_resumen_reporte_pagos = "estResumenReportePagos";
var id_ant_resumen_reporte_pagos = "antResumenReportePagos";

// botones

var id_button_generar_reporte_pagos = "generarButtonReportePagos";
var id_button_reset_reporte_pagos = "resetButtonReportePagos";

// JSONs

var pagos = {};
var obras = {};
var clientes = {};

// fechas_timestamp

var fecha_inicio = 0;
var fecha_final = 3000000000000; // esto genera en timestamp enero 24 del 2065

// valores

var total_pagado = 0;
var total_est = 0;
var total_ant = 0;  

$('#' + id_tab_reporte_pagos).click(function() {
    
    resetFormPagosFlujos();
    $('#' + id_container_reporte_pagos).addClass('hidden');
    $('#' + id_ddl_cliente_reporte_pagos).empty();
    $('#' + id_ddl_obra_reporte_pagos).empty();
    
    // Inicialización de campos de fecha
    jQuery('#' + id_fecha_inicio_reporte_pagos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    jQuery('#' + id_fecha_fin_reporte_pagos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );

    // necesito obtener lista de obras, clientes y el json de pagos
    firebase.database().ref(rama_bd_pagos + "/pagos").on("value", function(snapshot){
        pagos = snapshot.val();
        firebase.database().ref(rama_bd_obras + "/listas").once("value").then(function(obrasSnap){         
            obras = obrasSnap.child("obras_activas").val();
            clientes = obrasSnap.child("clientes").val();
            firebase.database().ref(rama_bd_clientes + "/despachos"). once("value").then(function(clienteSnap){
                var clientes_snap = clienteSnap.val();

                 // llenado del ddl obra
                 var obra_select = document.getElementById(id_ddl_obra_reporte_pagos);
                 for(key in obras){
                    var option_aux = document.createElement('option')
                    option_aux.value = key;
                    option_aux.text = obras[key].nombre;
                    obra_select.appendChild(option_aux);
                 }

                 orderDdl(id_ddl_obra_reporte_pagos);

                 var option_obra = document.createElement('option');
                 option_obra.text = option_obra.value = "TODAS";
                 obra_select.appendChild(option_obra);
     
                 $('#' + id_ddl_obra_reporte_pagos).val('TODAS');

                 // llenado del ddl cliente
                 var cliente_select = document.getElementById(id_ddl_cliente_reporte_pagos);
     

                for(key in clientes_snap){
                    var option_aux = document.createElement('option')
                    option_aux.value = key;
                    option_aux.text = clientes_snap[key].nombre;
                    cliente_select.appendChild(option_aux);
                }
                orderDdl(id_ddl_cliente_reporte_pagos);

                var option_cliente = document.createElement('option');
                option_cliente.text = option_cliente.value = "TODOS";
                cliente_select.appendChild(option_cliente);

                $('#' + id_ddl_cliente_reporte_pagos).val('TODOS');
                // una vez cargada la información, abro pestaña

                $('#' + id_container_reporte_pagos).removeClass('hidden');
            });
        });
    });
});

// funcionalidad de cambios en los parámetros de busqueda

$('#' + id_ddl_cliente_reporte_pagos).change(function(){
    $('#' + id_ddl_obra_reporte_pagos).empty();
    
    var cliente = $('#' + id_ddl_cliente_reporte_pagos + " option:selected").val();
    var obra_select = document.getElementById(id_ddl_obra_reporte_pagos);
    
    if(cliente == "TODOS"){
        for(key in obras){
            var option_aux = document.createElement('option')
            option_aux.value = key;
            option_aux.text = obras[key].nombre;
            obra_select.appendChild(option_aux);
        };

    } else {
        for(key in obras){
            if(clientes[cliente][key]){
                var option_aux = document.createElement('option')
                option_aux.value = key;
                option_aux.text = obras[key].nombre;
                obra_select.appendChild(option_aux);
            };
        };
        
    };
    
    orderDdl(id_ddl_obra_reporte_pagos);
    var option_obra = document.createElement('option');
    option_obra.text = option_obra.value = "TODAS";
    obra_select.appendChild(option_obra);

    $('#' + id_ddl_obra_reporte_pagos).val('TODAS');
});

$('#' + id_fecha_inicio_reporte_pagos).change(function(){
    // convertimos la fecha a timestamps y actualizamos fecha inicio
    var fecha = $('#' + id_fecha_inicio_reporte_pagos).val().split('.');    
    fecha_inicio = new Date(fecha[0], fecha[1] - 1, fecha[2]).getTime()
});

$('#' + id_fecha_fin_reporte_pagos).change(function(){
    // convertimos la fecha a timestamps y actualizamos fecha final
    var fecha = $('#' + id_fecha_fin_reporte_pagos).val().split('.');
    fecha_final = new Date(fecha[0], fecha[1] - 1, fecha[2]).getTime()
});

// funcionalidad general al apretar boton de generar reporte

$('#' + id_button_generar_reporte_pagos).click(function(){

    total_pagado = 0;
    total_est = 0;
    total_ant = 0;  

    // necesito generar los array de datos
    var datos_pagos = [];
    var datos_pagos_proc = [];

    var cliente_selected = $('#' + id_ddl_cliente_reporte_pagos + " option:selected").val();
    var obra_selected = $('#' + id_ddl_obra_reporte_pagos + " option:selected").val();

        // 3 casos
        // 1.- Se seleccionan TODOS los clientes y TODAS las obras
        // 2.- Se selecciona uno de los clientes y TODAS las obras
        // 3.- Se selecciona una de las obras

    if(obra_selected == "TODAS"){
        if(cliente_selected == "TODOS"){
            // 1er caso
            for(key in pagos){
                if(fecha_inicio <= pagos[key].fecha_pago && pagos[key].fecha_pago <= fecha_final){
                    datos_pagos.push(dataPago(pagos[key]));
                };
            };
        } else {
            // 2do caso
            for(key in pagos){
                if(clientes[cliente_selected][pagos[key].obra] && fecha_inicio <= pagos[key].fecha_pago && pagos[key].fecha_pago <= fecha_final){
                    datos_pagos.push(dataPago(pagos[key]));
                };
            };
        };
    } else {
        // 3er caso
        var json_proc = {};
        for(key in pagos){
            if(obra_selected == pagos[key].obra && fecha_inicio <= pagos[key].fecha_pago && pagos[key].fecha_pago <= fecha_final){                
                for(subkey in pagos[key].distribucion){
                    var entrada = pagos[key].distribucion[subkey];
                    var proc = entrada.clave_subproc.split("-");

                    if(json_proc[proc[0]] == undefined){
                        json_proc[proc[0]] = {
                            monto_total:0,
                            fecha_pago: 0,
                            entradas: {}
                        };
                    } 

                    json_proc[proc[0]].monto_total += entrada.monto_parcial
                    json_proc[proc[0]].entradas[subkey] = {
                        entrada: entrada.clave_subproc,
                        folio: pagos[key].folio,
                        formato: entrada.formato,
                        monto_parcial: entrada.monto_parcial
                    };
                };
                datos_pagos.push(dataPago(pagos[key]));
            };
        };
        // aqui construir la tabla por procesos
        // la primera entrada del array sera 0 si es proc y 1 si es entrada
        console.log(json_proc);
        for(key in json_proc){
            datos_pagos_proc.push([
                0,
                key,
                "",
                "",
                "",
                "",
                formatMoney(json_proc[key].monto_total)
            ]);

            for(subkey in json_proc[key].entradas){
                var entrada = json_proc[key].entradas[subkey];
                datos_pagos_proc.push([
                    1,
                    "",
                    entrada.entrada,
                    entrada.folio,
                    entrada.formato,
                    formatMoney(entrada.monto_parcial),
                    ""
                ]);
            };
        };

    };


    if(datos_pagos.length > 0){
        $('#' + id_div_resumen_reporte_pagos).removeClass("hidden");
        $('#' + id_div_table_global_reporte_pagos).removeClass("hidden");

        $('#' + id_est_resumen_reporte_pagos).text(formatMoney(total_est));
        $('#' + id_ant_resumen_reporte_pagos).text(formatMoney(total_ant))
        $('#' + id_total_resumen_reporte_pagos).text(formatMoney(total_pagado));

        // valores 

        table_reporte_pagos = $('#'+ id_dataTable_global_reporte_pagos).DataTable({
            destroy: true,
            "order": [
                [ 0, "asc" ],
                [1, "desc"]
            ],
            data: datos_pagos,
            language: idioma_espanol,
            "ordering": false,
            "columnDefs": [
                {
                    targets: 3,
                    className: 'dt-body-center'
                },
                {
                    targets: 4,
                    className: 'dt-body-center'
                },
                {
                    targets: 5,
                    className: 'dt-body-center'
                },
                {
                    targets: -3,
                    className: 'dt-body-center'
                },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                {
                    targets: -1,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 1 },
              ],
              dom: 'Bfrtip',
              buttons: [
                {extend: 'excelHtml5',
                title: "Pagos_recibidos",
                exportOptions: {
                    columns: [':visible']
                }},
              ],
              //"paging":false,
        });

        if(obra_selected != "TODAS"){
            $('#' + id_div_table_proc_reporte_pagos).removeClass("hidden");
            table_proc_reporte_pagos = $('#'+ id_dataTable_proc_reporte_pagos).DataTable({
                "fnRowCallback": function (row, data, index_table) {
                    if(data[0] == 0){
                        $(row).css('font-weight', 'bold');
                    } else {
                        $(row).css('font-style', 'italic');
                    }
                },
                "ordering": false,
                destroy: true,
                data: datos_pagos_proc,
                language: idioma_espanol,
                "columnDefs": [
                    {
                        targets: 1,
                        className: 'dt-body-center'
                    },
                    {
                        targets: 2,
                        className: 'dt-body-center'
                    },
                    {
                        targets: 3,
                        className: 'dt-body-center'
                    },
                    {
                        targets: 4,
                        className: 'dt-body-center'
                    },
                    {
                        targets: 5,
                        className: 'dt-body-center'
                    },
                    { "visible": false, "targets": 0 },
                  ],
                  dom: 'Bfrtip',
                  buttons: [
                    {extend: 'excelHtml5',
                    title: "Pagos_recibidos_por_proceso",
                    exportOptions: {
                        columns: [':visible']
                    }},
                  ],
                  "paging":false,
            });
        } else {
            console.log(1);
            $('#' + id_div_table_proc_reporte_pagos).addClass("hidden");
        }

    } else {
        alert("No se han recibido pagos con los filtros seleccionados");
    }
});

$('#' + id_button_reset_reporte_pagos).click(function(){
    resetFormPagosFlujos();
});

// funciones necesarias

function resetFormPagosFlujos(){
    // funcion para resetear todo y dejarlo como de inicio.
    fecha_inicio = 0;
    fecha_final = 3000000000000; // 
    total_pagado = 0;
    total_est = 0;
    total_ant = 0;  

    $('#' + id_ddl_obra_reporte_pagos).val("TODAS");
    $('#' + id_ddl_cliente_reporte_pagos).val("TODOS");
    $('#' + id_fecha_inicio_reporte_pagos).val("");
    $('#' + id_fecha_fin_reporte_pagos).val("");

    $('#' + id_div_table_global_reporte_pagos).addClass("hidden");
    $('#' + id_div_table_proc_reporte_pagos).addClass("hidden");
    $('#' + id_div_resumen_reporte_pagos).addClass("hidden");
};

// funcion para generar el array con los datos para la primera tabla y al mismo tiempo
// obtiene datos para la tabla resumen.

function dataPago(pago){
    var datos = [];
    var monto = 0;
    var formato = "";
    var is_ant = false;
    var is_est = false;

    for(key in pago.distribucion){
        monto += pago.distribucion[key].monto_parcial;
        total_pagado += pago.distribucion[key].monto_parcial;
        // aqui agregar al total_pagado

        if( pago.distribucion[key].formato == "ANT"){
            // agregar el monto parcial a total_ant
            total_ant += pago.distribucion[key].monto_parcial;
            is_ant = true;
        } else {
            // agregar el monto parcial a total_est
            total_est += pago.distribucion[key].monto_parcial;
            is_est = true;
        };
    };
    if(is_ant && is_est){
        formato = "Ambos"
    } else if(is_ant){
        formato = "ANT";
    } else if(is_est){
        formato = "EST";
    }
    // llenar array
    datos = [
        obras[pago.obra].nombre,
        pago.fecha_pago + "_" + pago.folio,
        new Date(pago.fecha_pago).toLocaleDateString("es-ES", optionsPagoCliente),
        pago.concepto,
        pago.folio,
        pago.tipo,
        formatMoney(monto),
        formato,
        "<button type='button' class='btn btn-dark' onclick='showFile(" + "\`" + pago.comprobante_url + "\`" + ")'><i class='fas fa-file'></i></button>",
    ];
    return datos;
};