var id_tab_pagos_cliente = "tabPagosCliente";
var id_form_pagos_cliente = "formPagosCliente";
var id_dataTable_pagos_cliente = "dataTablePagosCliente";

var id_div_resumen_pagos_cliente = "containerResumenPagosCliente";

var id_total_resumen_pagos_cliente= "totalResumenPagosCliente";
var id_est_resumen_pagos_cliente = "estResumenPagosCliente";
var id_ant_resumen_pagos_cliente = "antResumenPagosCliente";

var id_ddl_obra_pagos_cliente = "obraPagosCliente";
var id_monto_pagos_cliente = "montoPagosCliente";
var id_fecha_pagos_cliente = "fechaPagosCliente";
var id_folio_pagos_cliente = "folioPagosCliente";
var id_radio_recibo_pagos_cliente = "tipoReciboRBPagosCliente";
var id_radio_factura_pagos_cliente = "tipoFacturaRBPagosCliente";
var id_file_label_pagos_cliente = "fileLabelPagosCliente";
var id_file_input_pagos_cliente = "fileInputPagosCliente";
var id_concepto_pagos_cliente = "conceptoPagosCliente";
var id_span_monto_pagos_cliente = "montoSpanPagosCliente";

var id_div_distribucion_pagos_cliente = "distribucionPagosCliente"

var id_button_guardar_pagos_cliente = "guardarPagoButton";
var id_button_reset_pagos_cliente = "borrarPagoButton";

var existe_pago_pagos_cliente = false;
var id_pago_existente_pagos_cliente = "";

var file_selected_pagos_cliente = "";
var optionsPagoCliente =  {year: 'numeric', month: '2-digit', day: '2-digit'};

var procesos_pagos_flujo = {};

$('#' + id_tab_pagos_cliente).click(function() {
    resetFormPagosCliente(false);

    jQuery('#' + id_fecha_pagos_cliente).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );

    $('#' + id_ddl_obra_pagos_cliente).empty();
    $('#' + id_div_distribucion_pagos_cliente).empty();

    var obra_select = document.getElementById(id_ddl_obra_pagos_cliente);
    
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
});
$('#' + id_file_input_pagos_cliente).on("change", function(event){
    file_selected_pagos_cliente = event.target.files[0];
    $('#' + id_file_label_pagos_cliente).text(file_selected_pagos_cliente.name);
    $('#' + id_file_label_pagos_cliente).attr("style", "color: #A7C5A1");
});


$('#' + id_ddl_obra_pagos_cliente).change(function(){
    procesos_pagos_flujo = {};
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").val() + "/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
            if(procSnap.key != "PC00"){
                procSnap.child("subprocesos").forEach(function(subprocSnap){
                    procesos_pagos_flujo[subprocSnap.key] = subprocSnap.val().nombre;
                });
            };
        });  
        resetFormPagosCliente(true);
        tablaYResumenPagosCliente();
        $('#' + id_div_resumen_pagos_cliente).removeClass('hidden');
    });
});


// Validación de formulario. 

function validateFormPagosFlujos(flag){
    var valido = true;

    if($('#' + id_ddl_obra_pagos_cliente).val() == ""){
        valido = false;
        alert("Selecciona la obra correspondiente");
    } else if($('#' + id_monto_pagos_cliente).val() == "" || deformatMoney($('#' + id_monto_pagos_cliente).val()) == 0){
        valido = false;
        alert("Escribe el monto del pago correspondiente");
    } else if($('#' + id_folio_pagos_cliente).val() == ""){
        valido = false;
        alert("Escribe el folio correspondiente");
    } else if($('#' + id_fecha_pagos_cliente).val() == ""){
        valido = false;
        alert("Selecciona la fecha del pago");
    } else if($('#' + id_concepto_pagos_cliente).val() == ""){
        valido = false;
        alert("Escribe el concepto correspondiente");
    } else if(file_selected_pagos_cliente == "" && flag == false){
        valido = false;
        alert("Agrega un documento evidencia del pago");
    } else if(Math.abs(getDistTotal() - deformatMoney($('#' + id_monto_pagos_cliente).val())) > 0.01){
        valido = false;
        alert("La suma de montos distribuible no es igual que el monto total del pago");
    }
    // cambiar
    return true;
}

// Caracteres permitidos para el campo de monto

$('#' + id_monto_pagos_cliente).keypress(function(e){
    charactersAllowed("$1234567890,.",e);
});

// Se acciona al seleccionar el campo de Monto

$('#' + id_monto_pagos_cliente).change(function(){
    var deformat_sueldo = deformatMoney($('#' + id_monto_pagos_cliente).val());
    $('#' + id_monto_pagos_cliente).val(formatMoney(deformat_sueldo));
});

// Caracteres permitidos para el campo de  Folio

$('#' + id_folio_pagos_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890´ _-",e);
});


// Se acciona al seleccionar el campo de Folio

$('#' + id_folio_pagos_cliente).change(function(){
    var folio = deleteBlankSpaces(id_folio_pagos_cliente).toUpperCase();
    $('#' + id_folio_pagos_cliente).val(folio);
});

// ------------------ Funcionalidad con los botones de guardar y borrar todo ---------------------------------

$('#' + id_button_reset_pagos_cliente).click(function(){
    resetFormPagosCliente(false);
});

// funcionalidad que guarda en la base de datos la información de pagos
$('#' + id_button_guardar_pagos_cliente).click(function(){
    var pago = {};
    var listas = {};
    if(validateFormPagosFlujos(existe_pago_pagos_cliente)){
        if(existe_pago_pagos_cliente){
            // funcionalidad si es edicion
            // dos partes, si el usuario ingresa archivo evidencia
            // caso: no eligio archivo.

            if(file_selected_pagos_cliente == ""){
                firebase.database().ref(rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente).once("value").then(function(snapshot){
                    var registroPrevio = snapshot.val();
                    pago = getDatosPagosCliente(registroPrevio.comprobante_url);
                    firebase.database().ref(rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente).update(pago);

                    // listas
                    listas["listas/obras/" + registroPrevio.obra+ "/" +  id_pago_existente_pagos_cliente] = null;
                    listas["listas/fechas/" + aaaammdd(registroPrevio.fecha_pago) + "/" + id_pago_existente_pagos_cliente] = null;
                    listas["listas/folios/" + registroPrevio.folio + "/" + id_pago_existente_pagos_cliente] = null;

                    listas["listas/obras/" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").val() + "/" +  id_pago_existente_pagos_cliente] = true;
                    listas["listas/fechas/" + aaaammdd(pago.fecha_pago) + "/" + id_pago_existente_pagos_cliente] = true;
                    listas["listas/folios/" + pago.folio + "/" + id_pago_existente_pagos_cliente] = true;

                    firebase.database().ref(rama_bd_pagos).update(listas);
                    // pda
                    pda("modificacion", rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente, registroPrevio);
                    alert("Se realizó la edición de manera correcta (no se editó el documento evidencia).");
                    resetFormPagosCliente(true);
                });

            } else { // caso si eligió archivo
                var storageRef = firebase.storage().ref(rama_bd_pagos + "/" + id_pago_existente_pagos_cliente + "/" + file_selected_pagos_cliente.name);
                var uploadTask = storageRef.put(file_selected_pagos_cliente);

                uploadTask.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                }, function(error) {
                    // Handle unsuccessful uploads
                    console.log(error);
                }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        firebase.database().ref(rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente).once("value").then(function(snapshot){
                            var registroPrevio = snapshot.val();
                            pago = getDatosPagosCliente(downloadURL);
                            firebase.database().ref(rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente).update(pago);
        
                            // listas
                            listas["listas/obras/" + registroPrevio.obra+ "/" +  id_pago_existente_pagos_cliente] = null;
                            listas["listas/fechas/" + aaaammdd(registroPrevio.fecha_pago) + "/" + id_pago_existente_pagos_cliente] = null;
                            listas["listas/folios/" + registroPrevio.folio + "/" + id_pago_existente_pagos_cliente] = null;
        
                            listas["listas/obras/" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").val() + "/" +  id_pago_existente_pagos_cliente] = true;
                            listas["listas/fechas/" + aaaammdd(pago.fecha_pago) + "/" + id_pago_existente_pagos_cliente] = true;
                            listas["listas/folios/" + pago.folio + "/" + id_pago_existente_pagos_cliente] = true;
        
                            firebase.database().ref(rama_bd_pagos).update(listas);
                            // pda
                            pda("modificacion", rama_bd_pagos + "/pagos/" + id_pago_existente_pagos_cliente, registroPrevio);
                            alert("Se realizó la edición de manera correcta.");
                            resetFormPagosCliente(true);
                        });
                    });
                });
            }
        } else {
            // funcionalidad si es alta
            var key = firebase.database().ref("dummy").push().key

            // subir archivo evidencia a firebase storage
            var storageRef = firebase.storage().ref(rama_bd_pagos + "/" + key + "/" + file_selected_pagos_cliente.name);
            var uploadTask = storageRef.put(file_selected_pagos_cliente);
            uploadTask.on('state_changed', function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
            }, function(error) {
                // Handle unsuccessful uploads
                console.log(error);
            }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    
                    pago = getDatosPagosCliente(downloadURL);

                    // subir a firebase database el pago
                    firebase.database().ref(rama_bd_pagos + "/pagos/" + key).set(pago);

                    // listas
                    
                    listas["listas/obras/" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").val() + "/" +  key] = true;
                    listas["listas/fechas/" + aaaammdd(pago.fecha_pago) + "/" + key] = true;
                    listas["listas/folios/" + pago.folio + "/" + key] = true;

                    firebase.database().ref(rama_bd_pagos).update(listas);
                    // pda
                    pda("alta", rama_bd_pagos + "/pagos/" + key, "");
                    alert("El pago se dio de alta con éxito");
                    resetFormPagosCliente(true);
                });
            });
        };
    };
});

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// funciones que crea nuevo rengón en la sección de distribución

function createRowDist(key){
    if(key == null){
        var key = firebase.database().ref("dummy").push().key;
    };

    var proceso = document.createElement('select');
    proceso.className = "form-control procesoDistribuibleVacio";

    var option = document.createElement('option');
    option.text = option.value = "";
    proceso.appendChild(option);

    for(proc in procesos_pagos_flujo){
        option = document.createElement('option');
        option.value = proc;
        option.text = "(" + proc + ") " + procesos_pagos_flujo[proc];
        proceso.appendChild(option);
    };
    
    var col = document.createElement('div');
    col.className = "form-group col-4";
    col.appendChild(proceso);
    
    var row = document.createElement('div');
    row.className = "form-row";
    row.id = key;
    row.append(col);

    var div_distribuible = document.getElementById(id_div_distribucion_pagos_cliente);
    div_distribuible.appendChild(row);
    };

$(document).on('change','.procesoDistribuibleVacio', function(){
    var row = this.parentElement.parentElement;

    var ant_radio_input = document.createElement('input');
    var ant_radio_label = document.createElement('label');

    ant_radio_input.className = "form-check-input";
    ant_radio_input.type = "radio"
    ant_radio_input.value = "ANT";
    ant_radio_input.checked = true;
    ant_radio_input.name = row.id;

    ant_radio_label.className = "form-check-label";
    ant_radio_label.innerHTML = "Anticipo"

    var div_ant_inline = document.createElement('div');
    div_ant_inline.className = "form-check form-check-inline";
    div_ant_inline.appendChild(ant_radio_input);
    div_ant_inline.appendChild(ant_radio_label)

    var col_tipo = document.createElement('div');
    col_tipo.className = "form-group col-4 text-center";
    col_tipo.appendChild(div_ant_inline)

    // est

    var est_radio_input = document.createElement('input');
    var est_radio_label = document.createElement('label');

    est_radio_input.className = "form-check-input";
    est_radio_input.type = "radio"
    est_radio_input.value = "EST";
    est_radio_input.checked = false;
    est_radio_input.name = row.id;

    est_radio_label.className = "form-check-label";
    est_radio_label.innerHTML = "Estimación"

    var div_est_inline = document.createElement('div');
    div_est_inline.className = "form-check form-check-inline";
    div_est_inline.appendChild(est_radio_input);
    div_est_inline.appendChild(est_radio_label)

    var col_tipo = document.createElement('div');
    col_tipo.className = "form-group col-4 text-center";
    col_tipo.appendChild(div_ant_inline);
    col_tipo.appendChild(div_est_inline);

    var monto_parcial = document.createElement('input');
    monto_parcial.className = "form-control montoParcialprocDist";
    monto_parcial.type = "text";
    monto_parcial.placeholder = "Monto parcial";

    var col_monto = document.createElement('div');
    col_monto.className = "form-group col-4";
    col_monto.appendChild(monto_parcial);

    row.appendChild(col_tipo);
    row.appendChild(col_monto);

    $('.procesoDistribuibleVacio').addClass("procesoDistribuibleLleno");
    $('.procesoDistribuibleVacio').removeClass("procesoDistribuibleVacio");

    createRowDist();
});

$(document).on('change','.procesoDistribuibleLleno', function(){
    if($("option:selected", this).val() == ""){
        $('#' + this.parentElement.parentElement.id).remove();
        getDistTotal();
    }
});

// Caracteres permitidos para los campos de montos parciales

$(document).on('keypress','.montoParcialprocDist', function(e){
    charactersAllowed("$1234567890,.-",e);
});

$(document).on('change','.montoParcialprocDist', function(e){
    var deformat_monto = deformatMoney($(this).val());
    $(this).val(formatMoney(deformat_monto));
    getDistTotal();
});


// Función para resetear el formulario. En este caso depende de un flag si se desea borrar el campo de obra.

function resetFormPagosCliente(obra_change){
    $('#' + id_div_distribucion_pagos_cliente).empty();
    createRowDist();
    
    existe_pago_pagos_cliente = false;
    id_pago_existente_pagos_cliente = "";
    file_selected_pagos_cliente = "";
    $('#' + id_span_monto_pagos_cliente).text("$0.00");

    if(!obra_change){
        $('#' + id_ddl_obra_pagos_cliente).val("");
        $('#' + id_div_resumen_pagos_cliente).addClass('hidden');
    }
    $('#' + id_monto_pagos_cliente).val("");
    $('#' + id_fecha_pagos_cliente).val("");
    $('#' + id_concepto_pagos_cliente).val("");
    $('#' + id_folio_pagos_cliente).val("");

    $('#' + id_file_label_pagos_cliente).text("Archivo no seleccionado");
    $('#' + id_file_label_pagos_cliente).attr("style", "color: black");
    $('#' + id_file_input_pagos_cliente).val("");
};


// Método el cual obtiene la suma de los montos parciales

function getDistTotal(){
    // hacer la suma.
    var total = 0;
    $( ".montoParcialprocDist" ).each(function() {
        var parcial = deformatMoney($(this).val());
        total += parcial;
    });
    $('#' + id_span_monto_pagos_cliente).text(formatMoney(total));
    return total;
}

// Método que regresa json con los datos del pago actual

function getDatosPagosCliente(urlFile){
    var fecha_pago = $('#' + id_fecha_pagos_cliente).val().split('.');
    var is_factura = document.getElementById(id_radio_factura_pagos_cliente).checked == true;

    var tipo = "";
    if(is_factura) {
        tipo = "Factura";
    } else {
        tipo = "Recibo";
    };

    var json_datos = {
        obra: $('#' + id_ddl_obra_pagos_cliente + " option:selected").val(),
        concepto: $('#' + id_concepto_pagos_cliente).val(),
        fecha_pago: new Date(fecha_pago[0], fecha_pago[1] - 1, fecha_pago[2]).getTime(),
        comprobante_url: urlFile,
        folio: $('#' + id_folio_pagos_cliente).val(),
        tipo: tipo,  
        distribucion: {}

    };

    $( ".montoParcialprocDist" ).each(function() {
        var row = this.parentElement.parentElement;
        var key = row.id
        
        var proc = row.childNodes[0].childNodes[0];
        var anticipo = row.childNodes[1].childNodes[0].childNodes[0];
        var monto_parcial = row.childNodes[2].childNodes[0];

        var is_anticipo = $(anticipo).is(':checked');

        var formato = "";

        if(is_anticipo){
            formato = "ANT";
        } else {
            formato = "EST";
        }
        
        json_datos.distribucion[key] = {
            clave_subproc: $("option:selected", proc).val(),
            monto_parcial: deformatMoney($(monto_parcial).val()),
            formato: formato,
        }
    });
    return json_datos;
};

function tablaYResumenPagosCliente(){
    
    // necesito generar array con datos de firebase database para luego crear la tabla
    firebase.database().ref(rama_bd_pagos + "/pagos").on("value", function(snapshot){
        var datos = [];
        var total_pagado = 0;
        var total_est = 0;
        var total_ant = 0;


        snapshot.forEach(function(pagoSnap){
            var key = pagoSnap.key;
            var pago = pagoSnap.val();

            // si el pago se realizó a dicha obra.
            if(pago.obra == $('#' + id_ddl_obra_pagos_cliente + " option:selected").val()){
                var monto = 0;
                var formato = "";
                var is_ant = false;
                var is_est = false;
                pagoSnap.child("distribucion").forEach(function(distSnap){
                    monto += distSnap.val().monto_parcial;
                    total_pagado += distSnap.val().monto_parcial;

                    if(distSnap.val().formato == "ANT"){
                        total_ant += distSnap.val().monto_parcial;
                        is_ant = true;
                    } else {
                        total_est += distSnap.val().monto_parcial;
                        is_est = true;
                    };
                });

                if(is_ant && is_est){
                    formato = "Ambos"
                } else if(is_ant){
                    formato = "ANT";
                } else if(is_est){
                    formato = "EST";
                }
                // llenar array

                datos.push([
                    pago.fecha_pago + "_" + pago.folio,
                    new Date(pago.fecha_pago).toLocaleDateString("es-ES", optionsPagoCliente),
                    pago.concepto,
                    pago.folio,
                    pago.tipo,
                    formatMoney(monto),
                    formato,
                    "<button type='button' class='btn btn-dark' onclick='showFile(" + "\`" + pago.comprobante_url + "\`" + ")'><i class='fas fa-file'></i></button>",
                    "<button type='button' class='btn btn-info' onclick='fillData(" + "\`" + key + "\`" + ")'><i class='fas fa-edit'></i></button>",
                    "<button type='button' class='btn btn-danger' onclick='deletePago(" + "\`" + key + "\`" + ")'><i class='fas fa-trash'></i></button>",
                ]);
            };
        });

        // completar filas del resumen a falta de tener funcionalidad de pptos.

        $('#' + id_est_resumen_pagos_cliente).text(formatMoney(total_est));
        $('#' + id_ant_resumen_pagos_cliente).text(formatMoney(total_ant))
        $('#' + id_total_resumen_pagos_cliente).text(formatMoney(total_pagado));


        // generar tabla

        tabla_pagos = $('#'+ id_dataTable_pagos_cliente).DataTable({
            destroy: true,
            "order": [[ 0, "desc" ]],
            data: datos,
            language: idioma_espanol,
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
                { "visible": false, "targets": 0 },
              ],
              dom: 'Bfrtip',
              buttons: [
                {extend: 'excelHtml5',
                title: "Pagos_" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").text(),
                exportOptions: {
                    columns: [':visible']
                }},
              ],
              //"paging":false,
        });
    });
};


// función para obtener los datos del pago y colocarlos en el formulario. Necesito consultar la base de datos porque en la 
// tabla no cuento con los datos de distribucion

function fillData(key){
    resetFormPagosCliente(true);
    id_pago_existente_pagos_cliente = key;
    existe_pago_pagos_cliente = true;
    
    firebase.database().ref(rama_bd_pagos + "/pagos/" + key).once("value").then(function(snapshot){
        var pago = snapshot.val();
        var distribucion = pago.distribucion;

        $('#' + id_ddl_obra_pagos_cliente).val(pago.obra);
        $('#' + id_folio_pagos_cliente).val(pago.folio);
        $('#' + id_concepto_pagos_cliente).val(pago.concepto);

        // fecha
        var fecha_string = new Date(pago.fecha_pago);
        $('#' + id_fecha_pagos_cliente).val(fecha_string.getFullYear() + "." + ("0" + (fecha_string.getMonth() + 1)).slice(-2)  + "." + ("0" + fecha_string.getDate()).slice(-2));

        // tipo de pago
        pago.tipo == "Factura" ? $("#" + id_radio_factura_pagos_cliente).prop('checked', true) : $("#" + id_radio_recibo_pagos_cliente).prop('checked', true);
        // montos y distribucion
        var monto = 0;
        for(dist in distribucion){
            monto += distribucion[dist].monto_parcial;
            // eliminar anteriores
            $('.procesoDistribuibleVacio').parent().parent().remove();
            
            // fila en distribucion
            createRowDist(dist);
            var row = document.getElementById(dist);
            
            //
            var ant_radio_input = document.createElement('input');
            var ant_radio_label = document.createElement('label');
        
            ant_radio_input.className = "form-check-input";
            ant_radio_input.type = "radio"
            ant_radio_input.value = "ANT";
            ant_radio_input.name = row.id;
        
            ant_radio_label.className = "form-check-label";
            ant_radio_label.innerHTML = "Anticipo"
        
            var div_ant_inline = document.createElement('div');
            div_ant_inline.className = "form-check form-check-inline";
            div_ant_inline.appendChild(ant_radio_input);
            div_ant_inline.appendChild(ant_radio_label)
        
            var col_tipo = document.createElement('div');
            col_tipo.className = "form-group col-4 text-center";
            col_tipo.appendChild(div_ant_inline)
        
            // est
        
            var est_radio_input = document.createElement('input');
            var est_radio_label = document.createElement('label');
        
            est_radio_input.className = "form-check-input";
            est_radio_input.type = "radio"
            est_radio_input.value = "EST";
            est_radio_input.name = row.id;
        
            est_radio_label.className = "form-check-label";
            est_radio_label.innerHTML = "Estimación"
        
            var div_est_inline = document.createElement('div');
            div_est_inline.className = "form-check form-check-inline";
            div_est_inline.appendChild(est_radio_input);
            div_est_inline.appendChild(est_radio_label)
        
            var col_tipo = document.createElement('div');
            col_tipo.className = "form-group col-4 text-center";
            col_tipo.appendChild(div_ant_inline);
            col_tipo.appendChild(div_est_inline);
        
            var monto_parcial = document.createElement('input');
            monto_parcial.className = "form-control montoParcialprocDist";
            monto_parcial.type = "text";
            monto_parcial.placeholder = "Monto parcial";
        
            var col_monto = document.createElement('div');
            col_monto.className = "form-group col-4";
            col_monto.appendChild(monto_parcial);
        
            row.appendChild(col_tipo);
            row.appendChild(col_monto);

            $(row.childNodes[0].childNodes[0]).val(distribucion[dist].clave_subproc);
            $(monto_parcial).val(formatMoney(distribucion[dist].monto_parcial));

            distribucion[dist].formato == "ANT" ? $(ant_radio_input).prop('checked', true) : $(est_radio_input).prop('checked', true);

            $('.procesoDistribuibleVacio').addClass("procesoDistribuibleLleno");
            $('.procesoDistribuibleVacio').removeClass("procesoDistribuibleVacio");

            createRowDist();
        };

        $('#' + id_monto_pagos_cliente).val(formatMoney(monto));
        getDistTotal();
    });
};

function deletePago(key){
    var r = confirm("¿Estás seguro de eliminar el pago seleccionado?");
    if(r == true){
        // Delete the file
        // Create a reference to the file to delete
        firebase.database().ref(rama_bd_pagos + "/pagos/" + key).once("value").then(function(snapshot){
        // File deleted successfully
            var registroPrevio = snapshot.val();
            var listas = {};
            firebase.database().ref(rama_bd_pagos + "/pagos/" + key).set(null);

            // listas
            listas["listas/obras/" + registroPrevio.obra+ "/" +  key] = null;
            listas["listas/fechas/" + aaaammdd(registroPrevio.fecha_pago) + "/" + key] = null;
            listas["listas/folios/" + registroPrevio.folio + "/" + key] = null;

            firebase.database().ref(rama_bd_pagos).update(listas);
            // pda
            pda("eliminación", rama_bd_pagos + "/pagos/" + key, registroPrevio);
            alert("Pago eliminado correctamente");

        });
    }
}