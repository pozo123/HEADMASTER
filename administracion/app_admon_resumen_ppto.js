var id_obra_ddl_resumen_pptos = "obraDdlResumenPptos";
var id_proc_ddl_resumen_pptos = "procDdlResumenPptos";

var id_file_resumen_pptos = "fileResumenPptos";
var id_file_label_resumen_pptos = "fileLabelResumenPptos";

var id_monto_aprobado_resumen_pptos = "precioNegociadoResumenPptos";

var id_guardar_button_resumen_pptos = "aprobarButtonResumenPptos";
var id_borrar_button_resumen_pptos = "borrarButtonResumenPptos";


var tab_resumen_pptos = "tabResumenPptos";
var id_dataTable_resumen_pptos = "dataTableResumenPptos";
var id_loader_resumen_pptos = "loader"

var rama_bd_obras_magico = "obras";
var rama_storage_presupuestos = "presupuestos";

var fileSelected = "";
var precio_aprobado;
var pptos = [];

$('#' + tab_resumen_pptos).click(function(){
    pptos = [];
	$('#' + id_obra_ddl_resumen_pptos).empty();
    $('#' + id_proc_ddl_resumen_pptos).empty();

    $('#' + id_file_label_resumen_pptos).text("Archivo no seleccionado");
    fileSelected = "";
    precio_aprobado = 0;

    var select = document.getElementById(id_obra_ddl_resumen_pptos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    var obra_bool = false;
    for(key in nombre_obras){
        var obra = nombre_obras[key];
        $('#' + id_loader_resumen_pptos).removeClass("hidden");
        obra_bool = false;
        if(!obra.terminada){
            for(keyProc in obra["procesos"]){
                var proc = obra["procesos"][keyProc];
                if(keyProc == "ADIC" || keyProc == "PC00"){
                    for(keySubp in keyProc["subprocesos"]){
                        if(keySubp != "PC00-MISC"){
                            obra_bool = true;
                        }
                    };
                }
            };
            if(obra_bool){
                var option2 = document.createElement('OPTION');
                option2.text = key;
                option2.value = key;
                select.appendChild(option2);
            }
    	}
    };
    actualizarTable();
});

function actualizarTable(){
    pptos = [];
    var datos = [];
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){

        $('#' + id_dataTable_resumen_pptos).html('');

        snapshot.forEach(function(obraSnap){
            obraSnap.child('procesos').forEach(function(childSnap){
                console.log(obraSnap.val().nombre);
                var proc = childSnap.val();
                if(proc.clave == "ADIC" || proc.clave == "PC00"){
                    childSnap.child('subprocesos').forEach(function(subpSnap){
                        var ppto = subpSnap.val();
                        var iter = -1;
                        var url = "";

                        var url_evidencia = "";
                        var aprobado = "No";
                        var precio_negociado = 0;
                        

                        var anticipo_prog = 0;
                        var anticipo_pag = 0;
                        var est_prog = 0;
                        var est_pag = 0;
                        var est_est = 0;
                        var terminado = "";

                        if(ppto.clave && ppto.clave != "PC00-MISC"){

                            if(ppto.terminado){
                                terminado = "Sí";
                            } else {
                                terminado = "No";
                            };
                            
                            if(ppto.presupuesto){
                                subpSnap.child("presupuesto/archivos").forEach(function(){
                                    iter++;
                                });
                                url = subpSnap.child("presupuesto/archivos/" + iter + "/pdf").val();
                                url = "<button type='button' class='editar btn btn-warning' onclick='showPdfGenerado(pptos[" + pptos.length + "])'><i class='fas fa-eye'></i></button>";
                                pptos[pptos.length] = [subpSnap.child("presupuesto").val(), obraSnap.val(), obraSnap.child("cliente").val(), + subpSnap.key];
                            }

                            anticipo_prog = parseFloat(subpSnap.child("kaizen/ADMINISTRACION/ANTICIPOS/PPTO").val()).toFixed(2);
                            est_prog = parseFloat(subpSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/PPTO").val()).toFixed(2);
                            
                            anticipo_pag = parseFloat(subpSnap.child("kaizen/ADMINISTRACION/ANTICIPOS/PAG").val()).toFixed(2);
                            est_pag = parseFloat(subpSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/PAG").val()).toFixed(2);
                            

                            if(ppto.validacion_ppto && ppto.validacion_ppto.aprobado){
                                aprobado = "Sí"
                                url_evidencia = ppto.validacion_ppto.file;
                                url_evidencia = "<button type='button' class='editar btn btn-info' onclick='showPdfAprobado(\"" + url_evidencia + "\")'><i class='fas fa-eye'></i></button>",
                                precio_negociado = ppto.validacion_ppto.precio_negociado;
                            }

                            datos.push([
                                url,
                                obraSnap.key,
                                ppto.clave,
                                aprobado,
                                url_evidencia,
                                terminado,
                                formatMoney(parseFloat(anticipo_prog)),
                                formatMoney(parseFloat(est_prog)),
                                formatMoney(parseFloat(anticipo_prog) + parseFloat(est_prog)),
                                formatMoney(parseFloat(precio_negociado)),
                                formatMoney(parseFloat(anticipo_pag)),
                                formatMoney(parseFloat(est_pag)),
                            ])

                            $('#' + id_loader_resumen_pptos).addClass("hidden");

                        };
                    });
                };
            });
        });
        tabla_odec = $('#'+ id_dataTable_resumen_pptos).DataTable({
            destroy: true,
            data: datos,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "PDF ppto"},
                {title: "Obra"},
                {title: "Clave"},
                {title: "¿Aprobado?"},
                {title: "Evidencia"},
                {title: "¿Terminado?"},
                {title: "Anticipo Programado"},
                {title: "Estimación Programada"},              
                {title: "Total Presupuestado"},
                {title: "Precio Negociado"},
                {title: "Anticipo Pagado"},
                {title: "Estimaciones pagadas"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
}

function showPdfGenerado(array){
    console.log(array);
    var ppto = array[0];
    var obra_ppto = array[1];
    var cliente = array[2];
    var clave_presu = array[3];
    var ppto_especial;
    firebase.database().ref(rama_bd_clientes + "/" + cliente).once('value').then(function(clienSnap){
        ppto_especial = clienSnap.child("ppto_especial").exists() ? clienSnap.child("ppto_especial").val() : false;
    });
    var calculos = calculaAlcance(ppto.json_excel);

    var imagen_anexo = '';//AQUI cargar fotos del storage 
    //imagen_anexo es ARRAY de json= {url: data_as_url, file: foto}, file puede estar vacio
    
    var ppto = generaPptoAdic(false, obra_ppto, ppto.fisc_bool, ppto.banc_bool, imagen_anexo, new Date(ppto.fecha_ppto), calculos[2],calculos[1], calculos[3], ppto_especial, ppto.titulo_ppto, ppto.nombre, ppto.tiempoEntrega, calculos[0], clave_presu, ppto.anticipo, ppto.exc_lista, ppto.reqs_lista, ppto.atn_lista);
    var pdfPresupuesto = ppto[0];
    const pdfDocGenerator = pdfMake.createPdf(pdfPresupuesto);
    pdfDocGenerator.open();
}

function showPdfAprobado(link){
	if(link == ""){
		alert("No hay documento para esta OdeC");
	} else {
		window.open(link, '_blank');
	}
}


$("#" + id_obra_ddl_resumen_pptos).change(function(){

    $('#' + id_proc_ddl_resumen_pptos).empty();
    var select = document.getElementById(id_proc_ddl_resumen_pptos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    for(key in nombre_obras[$('#' + id_obra_ddl_resumen_pptos + " option:selected").val()]["procesos"]){
        if(key == "ADIC" || key == "PC00"){
            for(keySubp in nombre_obras[$('#' + id_obra_ddl_resumen_pptos + " option:selected").val()]["procesos"][key]["subprocesos"]){
                if(keySubp != "PC00-MISC"){
                    var option2 = document.createElement('OPTION');
                    option2.text = keySubp + " (" + nombre_obras[$('#' + id_obra_ddl_resumen_pptos + " option:selected").val()]["procesos"][key]["subprocesos"].nombre + ")";
                    option2.value = keySubp;
                    select.appendChild(option2);
                }
            }
        }
    }
});

// funciones para el monto aprobado

$('#' + id_monto_aprobado_resumen_pptos).on("change", function(){
    precio_aprobado = deformatMoney($('#' + id_monto_aprobado_resumen_pptos).val());
    highLight(id_monto_aprobado_resumen_pptos);
    console.log(precio_aprobado)
});


$("#" + id_monto_aprobado_resumen_pptos).focus(function(){
	if($("#" + id_monto_aprobado_resumen_pptos).val() == ""){
		$("#" + id_monto_aprobado_resumen_pptos).val(0);
	} else {
		$("#" + id_monto_aprobado_resumen_pptos).val(deformatMoney($("#" + id_monto_aprobado_resumen_pptos).val()) == 0 ? "" : deformatMoney($("#" + id_monto_aprobado_resumen_pptos).val()));
	}
});

$("#" + id_monto_aprobado_resumen_pptos).focusout(function(){
	$("#" + id_monto_aprobado_resumen_pptos).val(formatMoney($("#" + id_monto_aprobado_resumen_pptos).val()));
});

// --------------------------------------------------

$('#' + id_file_resumen_pptos).on("change", function(event){
    fileSelected = event.target.files[0];
    $('#' + id_file_label_resumen_pptos).text(fileSelected.name);
});

// -----------------------------------

$('#' + id_borrar_button_resumen_pptos).click(function(){
    fileSelected = "";
    $('#' + id_file_label_resumen_pptos).text("Archivo no seleccionado");
});

$('#' + id_guardar_button_resumen_pptos).click(function(){
    if( fileSelected == "" || $("#" + id_monto_aprobado_resumen_pptos).val() == "" || $('#' + id_obra_ddl_resumen_pptos + " option:selected").val() == "" || $('#' + id_proc_ddl_resumen_pptos + " option:selected").val() == ""){
        alert("Lena todos los cambios necesarios"); 
    } else {
        var query_storage = rama_storage_presupuestos + "/" + $('#' + id_obra_ddl_resumen_pptos + " option:selected").val() + "/presupuestos/" + $('#' + id_proc_ddl_resumen_pptos + " option:selected").val() + "/" + fileSelected.name;
        var storageRef = firebase.storage().ref(query_storage);
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
            console.log("Pasó algún error. Contacta al administrador del sistema")
        }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                realizarAprobacion(downloadURL);
            });
            actualizarTable();
        });
    }
});

function realizarAprobacion(url){
    console.log('File available at', url);
    var aprobado = {
        precio_negociado: precio_aprobado,
        aprobado: true,
		pad: pistaDeAuditoria(),
		file: url,
    }
    var split = $('#' + id_proc_ddl_resumen_pptos + " option:selected").val().split("-");
    var query = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_resumen_pptos + " option:selected").val() + "/procesos/" + split[0] + "/subprocesos/" + $('#' + id_proc_ddl_resumen_pptos + " option:selected").val() + "/validacion_ppto"
    firebase.database().ref(query).set(aprobado);
    alert("Presupuesto aprobado!")
}