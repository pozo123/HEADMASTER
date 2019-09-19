var id_obra_ddl_pago_kaizen = "obraDdlPagoKaizen";

var id_monto_pago_kaizen = "montoPagoKaizen";
var id_folio_pago_kaizen = "folioPagoKaizen";
var id_tipo_pago_rb_recibo_pago_kaizen = "tipoReciboRBPagoKaizen";//familia tipo_pago
var id_tipo_pago_rb_factura_pago_kaizen = "tipoFacturaRBPagoKaizen";//familia tipo_pago
var id_formato_rb_est_pago_kaizen = "formatoEstRBPagoKaizen";//familia formato
var id_formato_rb_ant_pago_kaizen = "formatoAntRBPagoKaizen";//familia formato
var id_formato_rb_ambas_pago_kaizen = "formatoAmbasRBPagoKaizen";
var id_concepto_pago_kaizen = "conceptoPagoKaizen";
var id_fecha_pago_kaizen = "fechaPagoKaizen";
var id_file_pago_kaizen = "filePagoKaizen";
var id_file_label_pago_kaizen = "fileLabelPagoKaizen";
var id_div_procesos_pago_kaizen = "divProcesosPagoKaizen";
var id_label_distribucion_pago_kaizen = "distribucionPagoKaizen";
var id_wrapper_distribucion_pago_kaizen = "distribucionWrapperPagoKaizen";
var id_wrapper1_distribucion_pago_kaizen = "distribucionWrapper1PagoKaizen";

var id_span_total_pagado = "totalPagadoPagoKaizen";
var id_span_ppto_instalaciones = "pptoInstalacionesPagoKaizen";
var id_span_saldo_total = "saldoTotalPagoKaizen";
var id_span_anticipo_pagado= "anticiposPagadosPagoKaizen";
var id_span_est_pagadas = "estimacionesPagadasPagoKaizen";

var id_div_resumen_pago_kaizen = "resumenPagoKaien";

var existenProcesos = false;

var id_guardar_button_pago_kaizen = "guardarButtonPagoKaizen";
var tab_pago_kaizen = "tabPagoKaizen";

var rama_bd_flujos = "administracion/flujos";
var rama_bd_obras_magico = "obras";
var rama_storage_flujos = "administracion/flujos";

var rb_form_est;
var rb_form_ant;
var rb_form_ambas;
var rb_tipo_rec;
var rb_tipo_fac;

var fileSelected = "";
var divProcesos = document.getElementById(id_div_procesos_pago_kaizen);

var id_dataTable_pago_kaizen = "dataTablePagoKaizen";
var optionsPagoKaizen =  {year: 'numeric', month: '2-digit', day: '2-digit'};

$('#' + tab_pago_kaizen).click(function(){
    existenProcesos = false
    // Cada vez que abro la página quiero que esté vacio todo el formulario.
    $('#' + id_obra_ddl_pago_kaizen).empty();
    $('#' + id_div_procesos_pago_kaizen).empty();
    $('#formPagoKaizen').trigger("reset");
    $('#' + id_dataTable_pago_kaizen).html('');
    $('#' + id_div_resumen_pago_kaizen).addClass("hidden");

    jQuery('#' + id_fecha_pago_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );

    var select = document.getElementById(id_obra_ddl_pago_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
  
    for(key in nombre_obras){
        var option2 = document.createElement('OPTION');
        option2.text = key;
        option2.value = key;
        select.appendChild(option2);
    }
});

$('#' + id_file_pago_kaizen).on("change", function(event){
    fileSelected = event.target.files[0];
    $('#' + id_file_label_pago_kaizen).text(fileSelected.name);
});

// ---------- radiobuttons funcionalidad -------------

$('input[type=radio][name=formato]').change(function() {

    if(existenProcesos){
        $('#' + id_wrapper_distribucion_pago_kaizen).removeClass('hidden');
        $('#' + id_wrapper1_distribucion_pago_kaizen).addClass('hidden');
    } else {
        $('#' + id_wrapper_distribucion_pago_kaizen).addClass('hidden');
        $('#' + id_wrapper1_distribucion_pago_kaizen).removeClass('hidden');
    }

    $('#' + id_label_distribucion_pago_kaizen).text(formatMoney(0));
    if (this.value == 'est') {
        $('.submontoClassPagoKaizen').each(function(){
            var id = $(this).attr('id');
            id_split = id.split("-");
            if(id_split[0] == "EST") {
                $(this).removeClass('hidden');
            } else {
                $(this).addClass('hidden')
                $(this).val("");
            }
        });
    }
    else if (this.value == 'ant') {
        $('.submontoClassPagoKaizen').each(function(){
            var id = $(this).attr('id');
            id_split = id.split("-");
            if(id_split[0] == "ANT") {
                $(this).removeClass('hidden');
            } else {
                $(this).addClass('hidden')
                $(this).val("");
            }
        });
    } else {
        $('.submontoClassPagoKaizen').each(function(){
            $(this).removeClass('hidden');
        });
    }
});

// ---------- formato correcto para montoTotal -------------

$('#' + id_monto_pago_kaizen).change(function(){
    var monto = $(this).val();
    $(this).val(formatMoney(monto));
    highLight($(this).attr('id'));
});
$('#' + id_monto_pago_kaizen).focus(function(){
    if($(this).val() != ""){
        $(this).val(deformatMoney($(this).val()));
    }
});
$('#' + id_monto_pago_kaizen).keypress(function(event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

function formato(){
    $('.submontoClassPagoKaizen').change(function(){
        var monto = $(this).val();
        $(this).val(formatMoney(monto));
        highLight($(this).attr('id'));

        var suma = 0;
        $('.submontoClassPagoKaizen').each(function(){
            suma += parseFloat(deformatMoney($(this).val()));  // Or this.innerHTML, this.innerText
        });
        $('#' + id_label_distribucion_pago_kaizen).text(formatMoney(suma));
    });

    $('.submontoClassPagoKaizen').focus(function(){
        if($(this).val() != ""){
            $(this).val(deformatMoney($(this).val()));
        }
    });
    $('.submontoClassPagoKaizen').keypress(function(event) {
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
}

// -------------------------------------------------------

$('#' + id_obra_ddl_pago_kaizen).change(function(){
    tablaResumen();

    $('#loader').removeClass("hidden");
    existenProcesos = false;
    $('#formPagoKaizen').trigger("reset");
    $('#' + id_div_procesos_pago_kaizen).empty();

    $('#' + id_wrapper_distribucion_pago_kaizen).addClass('hidden');
    $('#' + id_wrapper1_distribucion_pago_kaizen).addClass('hidden');
    
    $('#' + id_file_label_pago_kaizen).text("Archivo no seleccionado")
    fileSelected = "";

    
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val()).once('value').then(function(snapshot){
        var obra = snapshot.val();
        // la segunda parte del if controla una obra que no tenga procesos pero sí tenga adicionales o presupuestos
        if(obra.num_procesos > 0 || obra.procesos['ADIC'].num_subprocesos > 0 || obra.procesos['PC00'].num_subprocesos > 0){
            existenProcesos = true;
            snapshot.child('procesos').forEach(function(procSnap){
                var proceso = procSnap.val();
                if(proceso.num_subprocesos > 0){
                    crearFormGroupProc(proceso, true, false);
                    procSnap.child('subprocesos').forEach(function(subpSnap){
                        var subproceso = subpSnap.val();
                        crearFormGroupProc(subproceso, false, true);
                    });
                } else {
                    crearFormGroupProc(proceso,false, false);
                }
            });
        }
        formato();
        $('#loader').addClass("hidden");
    })
});

$('#' + id_guardar_button_pago_kaizen).click(function(){
    var diferencia = 0;
        // !validacionFormulario()
    if(!validacionFormulario()){
        return 
    } else {
        diferencia = parseFloat(deformatMoney($('#' + id_label_distribucion_pago_kaizen).text()))
        diferencia = diferencia - parseFloat(deformatMoney($('#' + id_monto_pago_kaizen).val()));

        if(Math.abs(diferencia) > 0.5 && existenProcesos){
            alert("Los montos no coinciden");
            return;
        }

        var query_storage = rama_storage_flujos + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val();
        var storageRef = firebase.storage().ref(query_storage + "/pagos/" + $('#' + id_folio_pago_kaizen).val() + "/" +  fileSelected.name);
        var uploadTask = storageRef.put(fileSelected);
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
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                realizarPago(downloadURL);
                existenProcesos = false;
                $('#formPagoKaizen').trigger("reset");
                $('#' + id_div_procesos_pago_kaizen).empty();
            
                $('#' + id_wrapper_distribucion_pago_kaizen).addClass('hidden');
                $('#' + id_wrapper1_distribucion_pago_kaizen).addClass('hidden');
                
                $('#' + id_file_label_pago_kaizen).text("Archivo no seleccionado")
                fileSelected = "";
                document.getElementById(id_obra_ddl_pago_kaizen).selectedIndex = 0
            });
        });
    }
});

function realizarPago(downloadURL){
    var json_distribucion = {};
    var json_pago = {};
    rb_form_ambas = document.getElementById(id_formato_rb_ambas_pago_kaizen).checked == true;
    rb_form_est = document.getElementById(id_formato_rb_est_pago_kaizen).checked == true;
    rb_form_ant = document.getElementById(id_formato_rb_ant_pago_kaizen).checked == true;
    rb_tipo_rec = document.getElementById(id_tipo_pago_rb_recibo_pago_kaizen).checked == true;
    rb_tipo_fac = document.getElementById(id_tipo_pago_rb_factura_pago_kaizen).checked == true;
    
    var formato = "";
    var tipo = "";

    if(!existenProcesos){
        if(!rb_form_ambas){
            if(rb_form_ant){
                formato = "ANTICIPOS";
            } else {
                formato = "ESTIMACIONES";
            }

            if(rb_tipo_rec){
                tipo = "RECIBO";
            } else {
                tipo = "FACTURA";
            }

            json_distribucion = {
                proceso:false,
                subproceso: false,
                monto_parcial: parseFloat(deformatMoney($('#' + id_monto_pago_kaizen).val())),
                formato: formato,
                clave_proc: "",
            }
            var fecha_pago = $('#' + id_fecha_pago_kaizen).val().split('.');
            
            json_pago = {
                fecha_pago: new Date(fecha_pago[2], fecha_pago[0] - 1, fecha_pago[1]).getTime(),
                folio: $('#' + id_folio_pago_kaizen).val(),
                concepto: $('#' + id_concepto_pago_kaizen).val(),
                formato: formato,
                monto: parseFloat(deformatMoney($('#' + id_monto_pago_kaizen).val())),
                tipo_pago: tipo,
                file:downloadURL,
                distribucion: json_distribucion,
            }

            firebase.database().ref(rama_bd_flujos + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val()).push(json_pago);
            sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() + "/kaizen/ADMINISTRACION/" + formato + "/PAG", parseFloat(deformatMoney($('#' + id_monto_pago_kaizen).val())));   
        } else {
            alert("En el caso de que el pago va directo a la obra, no se puede seleccionar 'ambos' en la celda 'Formato de Pago'");
        }
    } else {
        // Primero subir a rama flujos.
        if(rb_form_ant){
            formato = "ANTICIPOS";
        } else if(rb_form_est){
            formato = "ESTIMACIONES";
        } else {
            formato = "AMBAS";
        }

        if(rb_tipo_rec){
            tipo = "RECIBO";
        } else {
            tipo = "FACTURA";
        }

        $('.submontoClassPagoKaizen').each(function(){
            var formato_dist = "";
            var proc = "";
            var subproc = "";
            var json_dist_individual = {};
            var id = $(this).attr('id');
            id_split = id.split("-");
            proc = id_split[1];

            var monto = parseFloat(deformatMoney($(this).val()));

            if(id_split[0] == "EST") {
                formato_dist = "ESTIMACIONES";
            } else {
                formato_dist = "ANTICIPOS";
            }
            if(monto > 0){
                if(id_split.length == 2) {
                    // solo es proceso
                    json_dist_individual = {
                        proceso:true,
                        subproceso: false,
                        monto_parcial: monto,
                        formato: formato_dist,
                        clave_proc: proc,
                    }
                    // tiene que actualizar total en obra y total en proceso
                    
                    sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() + "/kaizen/ADMINISTRACION/" + formato_dist + "/PAG", monto);
                    sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() +"/procesos/" + proc + "/kaizen/ADMINISTRACION/" + formato_dist + "/PAG", monto);  
                } else {
                    // es subproceso
                    subproc = id_split[1] + "-" + id_split[2];

                    json_dist_individual = {
                        proceso:true,
                        subproceso: false,
                        monto_parcial: monto,
                        formato: formato_dist,
                        clave_proc: subproc,
                    }

                    sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() + "/kaizen/ADMINISTRACION/" + formato_dist + "/PAG", monto);
                    sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() +"/procesos/" + proc + "/kaizen/ADMINISTRACION/" + formato_dist + "/PAG", monto);  
                    sumaEnFirebase(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() +"/procesos/" + proc + "/subprocesos/"+ subproc +"/kaizen/ADMINISTRACION/" + formato_dist + "/PAG", monto);  
                }

                json_distribucion[id] = json_dist_individual;
            }
            
        });

        var fecha_pago = $('#' + id_fecha_pago_kaizen).val().split('.');

        json_pago = {
            fecha_pago: new Date(fecha_pago[2], fecha_pago[0] - 1, fecha_pago[1]).getTime(),
            folio: $('#' + id_folio_pago_kaizen).val(),
            concepto: $('#' + id_concepto_pago_kaizen).val(),
            formato: formato,
            monto: parseFloat(deformatMoney($('#' + id_monto_pago_kaizen).val())),
            tipo_pago: tipo,
            file:downloadURL,
            distribucion: json_distribucion,
        }

        firebase.database().ref(rama_bd_flujos + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val()).push(json_pago);
        alert("Pago exitoso!")
        tablaResumen();
    }
}

function crearFormGroupProc(hoja, hasChild, isSub){
    var formGroup = document.createElement('div');
    formGroup.className = "form-group row";
    var label = document.createElement('label');
    label.className = "col-sm-6 col-form-label";
    if(isSub){
        label.innerHTML = "\v" + hoja.clave + "-" + hoja.nombre;
    } else {
        label.innerHTML = hoja.clave + "-" + hoja.nombre;
        label.style ="font-weight:bold;";
    }
    
    formGroup.appendChild(label);
    if(!hasChild){      
        if((hoja.clave.split("-")[0] != "PC00" && hoja.clave.split("-")[0] != "ADIC"  && hoja.clave.split("-")[0] != "MISC") || hoja.clave.split("-").length > 1){
            var col = document.createElement('div');
            col.className = "col-sm-3"
    
            var input = document.createElement('input');
            input.type = "text";
            input.className = "form-control submontoClassPagoKaizen hidden";
            input.id = "EST-" + hoja.clave;
            input.placeholder = "Distribuir en EST";
    
            col.appendChild(input);
    
            var col1 = document.createElement('div');
            col1.className = "col-sm-3"
    
            var input1 = document.createElement('input');
            input1.type = "text";
            input1.className = "form-control submontoClassPagoKaizen hidden";
            input1.id = "ANT-" + hoja.clave;
            input1.placeholder = "Distribuir en ANT";
    
            col1.appendChild(input1);
            formGroup.appendChild(col1);
            formGroup.appendChild(col);
        }
    }

    divProcesos.appendChild(formGroup);
}

function validacionFormulario(){
    var valido = true;
    rb_form_est = document.getElementById(id_formato_rb_est_pago_kaizen).checked == true;
    rb_form_ant = document.getElementById(id_formato_rb_ant_pago_kaizen).checked == true;
    rb_form_ambas = document.getElementById(id_formato_rb_ambas_pago_kaizen).checked == true;
	rb_tipo_rec = document.getElementById(id_tipo_pago_rb_recibo_pago_kaizen).checked == true;
    rb_tipo_fac = document.getElementById(id_tipo_pago_rb_factura_pago_kaizen).checked == true;
    
    if($('#' + id_obra_ddl_pago_kaizen + " option:selected").val() == ""){
        valido = false;
        alert("Selecciona la obra correspondiente");
    } else if($('#' + id_monto_pago_kaizen).val() == ""){
        valido = false;
        alert("Escribe el monto del pago correspondiente");
    } else if($('#' + id_folio_pago_kaizen).val() == ""){
        valido = false;
        alert("Escribe el folio correspondiente");
    } else if($('#' + id_concepto_pago_kaizen).val() == ""){
        valido = false;
        alert("Escribe el concepto correspondiente");
    } else if($('#' + id_fecha_pago_kaizen).val() == ""){
        valido = false;
        alert("Selecciona la fecha del pago");
    } else if(!rb_form_ant && !rb_form_est && !rb_form_ambas){
        valido = false;
        alert("Selecciona el formato correspondiente (anticipo o estimación)");
    } else if(!rb_tipo_fac && !rb_tipo_rec){
        valido = false;
        alert("Selecciona el tipo correspondiente (recibo o factura)");
    }  else if(fileSelected == ""){
        valido = false;
        alert("Agrega un documento evidencia del pago")
    }
    return valido;

}

function tablaResumen(){
    var datos = [];
    var suma_ant = 0;
    var suma_est = 0;
    var ppto_inst = 0;

    $('#' + id_dataTable_pago_kaizen).html('');
    $('#' + id_div_resumen_pago_kaizen).removeClass("hidden");

    firebase.database().ref(rama_bd_flujos).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key == $('#' + id_obra_ddl_pago_kaizen + " option:selected").val()){
                obraSnap.forEach(function(pagoSnap){
                    var pago = pagoSnap.val();
                    datos.push([
                        pago.fecha_pago,
                        new Date(pago.fecha_pago).toLocaleDateString("es-ES", optionsPagoKaizen),
                        pago.concepto,
                        formatMoney(pago.monto),
                        pago.folio,
                        pago.tipo_pago,
                        pago.formato,
                        "<button type='button' class='editar btn btn-danger' onclick='showFactura(" + "\`" + pago.file + "\`" + ")'><i class='fas fa-file-pdf'></i></button>"
                    ]);

                    pagoSnap.child('distribucion').forEach(function(distSnap){
                        dist = distSnap.val();
                        if(dist.formato == "ANTICIPOS"){
                            suma_ant += dist.monto_parcial;
                        } else {
                            suma_est += dist.monto_parcial;
                        }
                    });
                });
            }
        });
        var tabla_pagos = $('#'+ id_dataTable_pago_kaizen).DataTable({
            destroy: true,
            data: datos,
            "order": [[ 0, "desc" ]],
            dom: 'Bfrtip',
            buttons: [
                {extend: 'excelHtml5',
                title: $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() + "_pagos_administrativos"}
            ],
            columns: [
                {title: "timestamps"},
                {title: "Fecha"},            
                {title: "Concepto"},
                {title: "Monto"},
                {title: "Folio"},
                {title: "Documento"},
                {title: "ANTICIPO/ESTIMACIÓN"},
                {title: "PDF"},
            ],
            "columnDefs": [ 
                { "visible": false, "targets": 0 },
                
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
        $('#' + id_span_anticipo_pagado).text(formatMoney(suma_ant));
        $('#' + id_span_est_pagadas).text(formatMoney(suma_est));
        $('#' + id_span_total_pagado).text(formatMoney(suma_est + suma_ant));

        firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() + "/kaizen/ADMINISTRACION").once("value").then(function(snapshot){
            snapshot.forEach(function(datosSnap){
                console.log(snapshot.key);
                var datos = datosSnap.val();
                ppto_inst += parseFloat(datos.PPTO);
            })

            $('#' + id_span_ppto_instalaciones).text(formatMoney(ppto_inst));
            $('#' + id_span_saldo_total).text(formatMoney(ppto_inst - (suma_est + suma_ant)));
        });
    });
}

function showFactura(link){
    window.open(link, '_blank');
};

