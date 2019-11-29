var id_tab_pagos_cliente = "tabPagosCliente";
var id_form_pagos_cliente = "formPagosCliente";
var id_dataTable_pagos_cliente = "dataTablePagosCliente";

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

$('#' + id_tab_pagos_cliente).click(function() {
    resetFormPagosCliente(true);

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
    resetFormPagosCliente(true);
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
                    resetFormPagosCliente(false);
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

    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obra_pagos_cliente + " option:selected").val() + "/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
            if(procSnap.key != "PC00"){
                procSnap.child("subprocesos").forEach(function(subprocSnap){
                    option = document.createElement('option');
                    option.value = subprocSnap.key;
                    option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                    proceso.appendChild(option);
                });
            };
        });  
        
        var col = document.createElement('div');
        col.className = "form-group col-4";
        col.appendChild(proceso);
        
        var row = document.createElement('div');
        row.className = "form-row";
        row.id = key;
        row.append(col);

        var div_distribuible = document.getElementById(id_div_distribucion_pagos_cliente);
        div_distribuible.appendChild(row);
    });
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
        $('#' + this.parentElement.parentElement.id).empty();
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
