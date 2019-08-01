var id_obra_ddl_pag_compras = "obraDdlPagCompras"
var id_solped_ddl_pag_compras = "solpedDdlPagCompras"
var id_odec_ddl_pag_compras = "odecDdlPagCompras"
var id_tipo_ddl_pag_compras = "tipoDdlPagCompras"

var id_cantidad_pag_compras = "cantidadPagCompras";
var id_num_factura_pag_compras = "numFacturaPagCompras";
var id_notas_pag_compras = "notasPagCompras";

var id_fecha_pag_compras = "fechaPagCompras";
var id_comprobante_file_pag_compras = "comprobanteFilePagCompras";
var id_comprobante_label_pag_compras = "comprobanteLabelPagCompras";
var id_acutalizar_button_pag_compras = "actualizarPagCompras";

var id_datatable_catalogo_pag_compras =  "dataTableCatalogoPagCompras";
var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

var rama_bd_obras = "obras";
var rama_storage_obras = "obras";

var id_tab_pag_compras = "tabPagosCompras";

//var query;
var fileSeleccionado = "";
var tipos_pago_compras = [
	{text: "Efectivo", value: "EF"},
	{text: "Credito", value: "CR"},
	{text: "Contado", value: "CO"},
	{text: "Cheque", value: "CH"},
	{text: "Devolucion", value: "DE"},
	{text: "Nota de Credito", value: "NC"},
];

var solpeds = {};

$('#' + id_tab_pag_compras).click(function(){
	$('#' + id_obra_ddl_pag_compras).empty();
	$('#' + id_solped_ddl_pag_compras).empty();
	$('#' + id_odec_ddl_pag_compras).empty();
	$('#' + id_tipo_ddl_pag_compras).empty();
	document.getElementById(id_num_factura_pag_compras).disabled = true;
	fileSeleccionado = "";
	solpeds = {};

	jQuery('#' + id_fecha_pag_compras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_tipo_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    for(i=0;i<tipos_pago_compras.length;i++){
		var option2 = document.createElement('option');
	    option2.text = tipos_pago_compras[i]["text"];
	    option2.value = tipos_pago_compras[i]["value"];
	    select.appendChild(option2);
    }

    var select2 = document.getElementById(id_obra_ddl_pag_compras);
    var option4 = document.createElement('option');
    option4.style = "display:none";
    option4.text = option.value = "";
    select2.appendChild(option4);
	console.log(nombre_obras);
	for(key in nombre_obras){
    	if(!nombre_obras[key].terminada){
	        var option2 = document.createElement('OPTION');
	        option2.text = key;
	        option2.value = key;
	        select2.appendChild(option2);
	    }
    };
});

$("#" + id_obra_ddl_pag_compras).change(function(){
	$('#' + id_solped_ddl_pag_compras).empty();
	solpeds = {};
    var select = document.getElementById(id_solped_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.child("procesos").forEach(function(procSnap){
			if(procSnap.child("num_subprocesos").val() == 0 || $('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
				procSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
					var solped = solpedSnap.val();
			    	var option2 = document.createElement('OPTION');
			        option2.text = solpedSnap.key;
			        option2.value = solpedSnap.key;
			        select.appendChild(option2);
			        solpeds[solpedSnap.key] = {solped: solpedSnap.key, path: procSnap.key, contrato: procSnap.child("contrato_compras/clave").val()};
			        if($('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
			        	solpeds[solpedSnap.key]["subproceso"] = solpedSnap.child("subproceso").val();
			        }
				});
			} else {
				procSnap.child("subprocesos").forEach(function(subpSnap){
					subpSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
						var solped = solpedSnap.val();
				    	var option2 = document.createElement('OPTION');
				        option2.text = solpedSnap.key;
				        option2.value = solpedSnap.key;
				        select.appendChild(option2);
						solpeds[solpedSnap.key] = {solped: solpedSnap.key, path: procSnap.key + "/subprocesos/" + subpSnap.key, contrato: subpSnap.child("contrato_compras/clave").val()};
					});
				});
			}
		});
	});
	loadDataTablePagosCompras();
});

$('#' + id_tipo_ddl_pag_compras).change(function(){
	if($('#' + id_tipo_ddl_pag_compras).val() == "CR"){
		document.getElementById(id_num_factura_pag_compras).disabled = false;
	} else {
		$('#' + id_num_factura_pag_compras).val("");
		document.getElementById(id_num_factura_pag_compras).disabled = true;
	}
});

$('#' + id_solped_ddl_pag_compras).change(function(){
	$('#' + id_odec_ddl_pag_compras).empty();
    var select = document.getElementById(id_odec_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var solp = solpeds[$('#' + id_solped_ddl_pag_compras + " option:selected").val()];
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val() + "/procesos/" + solp.path + "/contrato_compras/solpeds/" + solp.solped + "/odecs").once('value').then(function(snapshot){
    	snapshot.forEach(function(odecSnap){
    		var odec = odecSnap.val();
	    	var option2 = document.createElement('OPTION');
	        option2.text = odecSnap.key;
	        option2.value = odecSnap.key;
	        select.appendChild(option2);
    	});
    });
});

$('#' + id_comprobante_file_pag_compras).on("change", function(event){
    fileSeleccionado = event.target.files[0];
    $('#' + id_comprobante_label_pag_compras).text(fileSeleccionado.name);
});

function loadDataTablePagosCompras(){
	var datos_pagos_compras = [];

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val()).once('value').then(function(obraSnap){
        obraSnap.child("procesos").forEach(function(procSnap){
            if(procSnap.child("num_subprocesos") == 0 || obraSnap.key == "IQONO MEXICO"){
                procSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                	solpedSnap.child("odecs").forEach(function(odecSnap){
                		odecSnap.child("pagos").forEach(function(pagoSnap){
                			var pago = pagoSnap.val();
	                        datos_pagos_compras.push([
	                            obraSnap.key == "IQONO MEXICO" ? solpedSnap.child("subproceso").val() : procSnap.key,
	                            procSnap.child("contrato_compras/clave").val(),
	                            solpedSnap.key,
	                            odecSnap.key,
	                            pagoSnap.key,
	                            pago.cantidad,
	                            pago.tipo,
	                            pago.no_factura ? pago.no_factura : "-",
	                            pago.notas,
	                            new Date(pago.fecha).toLocaleDateString("es-ES",options),
	                            "<button type='button' class='editar btn btn-warning' onclick='showPdfPagoCompras(\"" + pago.pdf + "\")'><i class='fas fa-eye'></i></button>",
	                        ]);
                		});
                    });
                });
            } else {
                procSnap.child("subprocesos").forEach(function(subpSnap){
                    subpSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                        solpedSnap.child("odecs").forEach(function(odecSnap){
                        	odecSnap.child("pagos").forEach(function(pagoSnap){
                        		var pago = pagoSnap.val();
	                            datos_pagos_compras.push([
	                            	subpSnap.key,
	                                subpSnap.child("contrato_compras/clave").val(),
	                                solpedSnap.key,
		                            odecSnap.key,
		                            pagoSnap.key,
		                            pago.cantidad,
		                            pago.tipo,
		                            pago.no_factura ? pago.no_factura : "-",
		                            pago.notas,
		                            new Date(pago.fecha).toLocaleDateString("es-ES",options),
		                            "<button type='button' class='editar btn btn-warning' onclick='showPdfPagoCompras(\"" + pago.pdf + "\")'><i class='fas fa-eye'></i></button>",
		                        ]);
                        	});
                        });
                    });
                });
            }
        });

        tabla_odec = $('#'+ id_datatable_catalogo_pag_compras).DataTable({
            destroy: true,
            data: datos_pagos_compras,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Proceso"},
                {title: "Contrato"},
                {title: "Solped"},
                {title: "OdeC"},
                {title: "Clave"},
                {title: "Cantidad"},
                {title: "Tipo"},              
                {title: "No. Factura"},
                {title: "Notas"},
                {title: "Fecha"},
                {title: "Imprimir pdf"},
            ],/*
            "columnDefs": [ 
                { "visible": false, "targets": [4] },
            ],*/
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
}

function showPdfPagoCompras(link){
	if(link == ""){
		alert("No hay documento para esta OdeC");
	} else {
		window.open(link, '_blank');
	}
}

$('#' + id_acutalizar_button_pag_compras).click(function(){
	if(fileSeleccionado == "" || (document.getElementById(id_num_factura_pag_compras).disabled == false && $('#' + id_num_factura_pag_compras).val() == "") || $('#' + id_cantidad_pag_compras).val() == "" || $('#' + id_tipo_ddl_pag_compras + " option:selected").val() == ""){
		alert("Llena todos los campos requeridos");
	} else {
		var solp = solpeds[$('#' + id_solped_ddl_pag_compras + " option:selected").val()];
		var storageRef = firebase.storage().ref(rama_storage_obras + "/contratos/" + solp.contrato + "/" + solp.solped + "/odecs/" + $('#' + id_odec_ddl_pag_compras + " option:selected").val() + "/pagos/" + fileSeleccionado.name);
	    var uploadTask = storageRef.put(fileSeleccionado);
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
	            console.log('File available at', downloadURL);
				var pago = {
			        cantidad: $('#' + id_cantidad_pag_compras).val(),
			        tipo: $('#' + id_tipo_ddl_pag_compras + " option:selected").val(),
			        no_factura: $('#' + id_num_factura_pag_compras).val(),
			        notas: $('#' + id_notas_pag_compras).val(),
			        fecha: new Date($('#' + id_fecha_pag_compras).val()).getTime(),
			        pdf: downloadURL,
				}
				/*var query;
				if($('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
					query = data[3].split("-")[0];
				} else {
					query = data[3].split("-").length > 1 ? data[3].split("-")[0] + "/subprocesos/" + data[3] : data[3];
				}*/
				firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val() + "/procesos/" + solp.path + "/contrato_compras/solpeds/" + solp.solped + "/odecs/" + $('#' + id_odec_ddl_pag_compras + " option:selected").val() + "/pagos").push(pago);
	            var negativo = 1;
	            if(pago.tipo == "DE" || pago.tipo == "NC"){
	            	negativo = -1;
	            	//Restar a costo de odec
	            }

	            var cant = parseFloat($('#' + id_cantidad_pag_compras).val()) * negativo;
	            var query_kaiz = "/kaizen/PRODUCCION/SUMINISTROS/PAG";
	            var query_kaiz_odec = "/kaizen/PRODUCCION/SUMINISTROS/OdeC";
	            var query_o = rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val();
	            sumaEnFirebase(query_o + query_kaiz, cant);
	            if(negativo == -1){
	            	sumaEnFirebase(query_o + query_kaiz_odec, cant);
	            	sumaEnFirebase(query_o + "/procesos/" + solp.path + "/contrato_compras/solpeds/" + solp.solped + "/odecs/" + $('#' + id_odec_ddl_pag_compras + " option:selected").val() + "/costo", cant);
	            }
	            var split = solp.path.split("-");
	            var query_p;
	            var query_s = "";
	            if(split.length > 1){
	            	query_p = query_o + "/procesos/" + solp.path.split("/")[0];
	            	query_s = query_o + "/procesos/" + solp.path;
	            } else {
	            	query_p = query_o + "/procesos/" + solp.path;
	            	if($('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
	            		query_s = query_p + "/subprocesos/" + solp.subproceso;
	            	}
	            }
	            if(query_s != ""){
	            	sumaEnFirebase(query_s + query_kaiz, cant);
	            	if(negativo == -1){
	            		sumaEnFirebase(query_s + query_kaiz_odec, cant);
	            	}
	            }
	            sumaEnFirebase(query_p + query_kaiz, cant);
	            if(negativo == -1){
	            	sumaEnFirebase(query_p + query_kaiz_odec, cant);
	            }

	            alert("Actualización exitosa");
	            loadDataTablePagosCompras();
	            calculaKaizen($('#' + id_obra_ddl_pag_compras + " option:selected").val(),"global");
	        });
	    });
	}
});