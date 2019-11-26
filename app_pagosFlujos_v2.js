var id_tab_pagos_cliente = "tabPagosCliente";
var id_form_pagos_cliente = "formPagosCliente";

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

var existe_pago = false;
var id_pago_existente = "";

var file_selected_pagos_cliente = "";

$('#' + id_tab_pagos_cliente).click(function() {

    resetFormPagosCliente();

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
    $('#' + id_div_distribucion_pagos_cliente).empty();
    createRowDist();
    $('#' + id_span_monto_pagos_cliente).text("$0.00");
});


// Valid de formulario




// reset form.

// Sueldo

$('#' + id_monto_pagos_cliente).keypress(function(e){
    charactersAllowed("$1234567890,.",e);
});

$('#' + id_monto_pagos_cliente).change(function(){
    var deformat_sueldo = deformatMoney($('#' + id_monto_pagos_cliente).val());
    $('#' + id_monto_pagos_cliente).val(formatMoney(deformat_sueldo));
});

// Folio

$('#' + id_folio_pagos_cliente).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890´ _-",e);
});

$('#' + id_folio_pagos_cliente).change(function(){
    var folio = deleteBlankSpaces(id_folio_pagos_cliente).toUpperCase();
    $('#' + id_folio_pagos_cliente).val(folio);
});

// ------------------ 

$('#' + id_button_reset_pagos_cliente).click(function(){
    resetFormPagosCliente();
});



// funciones 

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
    console.log(row);

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

$(document).on('keypress','.montoParcialprocDist', function(e){
    charactersAllowed("$1234567890,.-",e);
});

$(document).on('change','.montoParcialprocDist', function(e){
    var deformat_monto = deformatMoney($(this).val());
    $(this).val(formatMoney(deformat_monto));
    getDistTotal();
});



function resetFormPagosCliente(){
    existe_pago = false;
    id_pago_existente = "";
    file_selected_pagos_cliente = "";
    
    $('#' + id_div_distribucion_pagos_cliente).html('');

    $('#' + id_form_pagos_cliente).trigger("reset");
    $('#' + id_file_label_pagos_cliente).text("Archivo no seleccionado");
    $('#' + id_file_label_pagos_cliente).attr("style", "color: black");
    $('#' + id_file_input_pagos_cliente).val("");
};

function getDistTotal(){
    // hacer la suma.
    var total = 0;
    $( ".montoParcialprocDist" ).each(function() {
        var parcial = deformatMoney($(this).val());
        total += parcial;
    });
    $('#' + id_span_monto_pagos_cliente).text(formatMoney(total));
}