var id_obra_ddl_odec = "obraDdlOdeC";
var id_group_proc_odec = "groupProcOdeC"
var id_proc_ddl_odec = "procDdlOdeC";
var id_subp_ddl_odec = "subpDdlOdeC";
var id_solped_ddl_odec = "solpedDdlOdeC";
var id_fecha_odec = "fechaOdeC";
var id_clave_odec = "claveOdeC";
var id_cantidad_odec = "cantidadOdeC";
var id_proveedor_odec = "proveedorOdeC";
var id_proveedor_nom_odec = "proveedorNomOdeC";
var id_notas_odec = "notasOdeC";
var id_actualizar_valor_odec = "actualizarOdeC";

var id_modal_pdf_odec = "pdfModalOdeC"
var id_pdf_file_odec = "pdfFileOdeC";
var id_pdf_label_odec = "pdfLabelOdeC";
var id_agregar_pdf_button_odec = "agregarPdfButtonOdeC";
var id_cerrar_modal_button_odec = "cerrarModalButtonOdeC";
var id_datatable_catalogo_odec =  "dataTableCatalogoOdeC";
var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

var tab_odec = "tabOdeC";
var rama_bd_obras = "obras";
var rama_bd_proveedores = "compras/proveedores";
var rama_storage_obras = "obras";
var caso;
var subprocs = [];
var pdfSeleccionado;


$('#' + tab_odec).click(function(){
	$('#' + id_obra_ddl_odec).empty();
    $('#' + id_proc_ddl_odec).empty();
    $('#' + id_solped_ddl_odec).empty();
    $('#' + id_group_proc_odec).addClass('hidden');
	jQuery('#' + id_fecha_odec).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_obra_ddl_odec);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
	        var option2 = document.createElement('OPTION');
	        option2.text = obra.nombre;
	        option2.value = obra.nombre;
	        select.appendChild(option2);
	    }
    });

    loadDataTableOdeC();
});

$("#" + id_obra_ddl_odec).change(function(){
	$('#' + id_proc_ddl_odec).empty();
    $('#' + id_solped_ddl_odec).empty();

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_odec + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    if(obra.num_procesos == 0 && obra.procesos.ADIC.num_subprocesos == 0){
	    	$('#' + id_group_proc_odec).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_odec).removeClass('hidden');
	    	caso = "proc";

		    var select = document.getElementById(id_proc_ddl_odec);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);

		    snapshot.child('procesos').forEach(function(childSnap){
		    	var proc = childSnap.val();
		    	if(!proc.terminado){
			    	if(proc.num_subprocesos == 0 || obra.nombre == "IQONO MEXICO"){
				    	if(childSnap.child("contrato_compras/solpeds").val() != "" && childSnap.child("contrato_compras/solpeds").val() != undefined){
					    	var option2 = document.createElement('OPTION');
					        option2.text = proc.clave + " (" + childSnap.child("contrato_compras/clave").val() + ")";
					        option2.value = proc.clave;
					        select.appendChild(option2);
					    }
				    } else {
				    	childSnap.child('subprocesos').forEach(function(subpSnap){
				    		var subp = subpSnap.val();
				    		if(!subp.terminado){
				    			if(subpSnap.child("contrato_compras/solpeds").val() != "" && subpSnap.child("contrato_compras/solpeds").val() != undefined){
							    	var option2 = document.createElement('OPTION');
							        option2.text = subp.clave + " (" + subpSnap.child("contrato_compras/clave").val() + ")";
							        option2.value = subp.clave;
							        select.appendChild(option2);
				    			}
				    		}
				    	});
		    		}
			    }
		    });
	    }
    });
});

$("#" + id_proc_ddl_odec).change(function(){
	$('#' + id_solped_ddl_odec).empty();
	subprocs = [];
	var proc = $('#' + id_proc_ddl_odec + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_odec + " option:selected").val() + "/procesos/" + query + "/contrato_compras/solpeds").once('value').then(function(snapshot){
		$('#' + id_solped_ddl_odec).empty();
	    var select = document.getElementById(id_solped_ddl_odec);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
	    snapshot.forEach(function(solpedSnap){
			var solped = solpedSnap.val();
	    	var option2 = document.createElement('OPTION');
	        option2.text = solpedSnap.key + " (" + solped.nombre + ")";
	        option2.value = solpedSnap.key;
	        select.appendChild(option2);
	        if($('#' + id_obra_ddl_odec + " option:selected").val() == "IQONO MEXICO"){
	        	subprocs[solpedSnap.key] = solpedSnap.child("subproceso").val();
	        }
		});
	});
});

$('#' + id_proveedor_odec).change(function(){
	firebase.database().ref(rama_bd_proveedores + "/" + $('#' + id_proveedor_odec).val()).once('value').then(function(snapshot){
		if(snapshot.exists()){
			$('#' + id_proveedor_nom_odec).val(snapshot.child("razonSocial").val());
			highLight(id_proveedor_nom_odec);
		} else {
			alert("No existe ningún proveedor con ese ID");
			$('#' + id_proveedor_odec).val("");
			highLight(id_proveedor_odec);
		}
	});
});

$('#' + id_proveedor_nom_odec).change(function(){
	firebase.database().ref(rama_bd_proveedores).orderByChild("razonSocial").equalTo($('#' + id_proveedor_nom_odec).val()).once('value').then(function(snapshot){
		if(snapshot.exists()){
			snapshot.forEach(function(childSnap){
				$('#' + id_proveedor_odec).val(childSnap.key);
				highLight(id_proveedor_odec);
			});
		} else {
			alert("No existe ningún proveedor con ese nombre");
			$('#' + id_proveedor_nom_odec).val("");
			highLight(id_proveedor_nom_odec);
		}
	});
});

$('#' + id_actualizar_valor_odec).click(function(){
	if($('#' + id_clave_odec).val() == "" || $('#' + id_cantidad_odec).val() == "" || $('#' + id_proveedor_odec).val() == "" || $('#' + id_proveedor_nom_odec).val() == "" || $('#' + id_fecha_odec).val() == "" || $('#' + id_obra_ddl_odec + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_odec + " option:selected").val() == "") || $('#' + id_solped_ddl_odec + " option:selected").val() == ""){
		alert("Llena todos los campos requeridos");
	} else {
		if($('#' + id_obra_ddl_odec + " option:selected").val() == "IQONO MEXICO" && $('#' + id_proc_ddl_odec + " option:selected").val() != "MISC"){
			caso = "IQONO MEXICO";
		}
		var odec = {
			proveedor: $('#' + id_proveedor_odec).val(),
			costo: $('#' + id_cantidad_odec).val(),
			pad: pistaDeAuditoria(),
			fecha: new Date($('#' + id_fecha_odec).val()).getTime(),
			notas: $('#' + id_notas_odec).val(),
		}

		var query;
		var query_o = $('#' + id_obra_ddl_odec + " option:selected").val();
		var path = ($('#' + id_proc_ddl_odec + " option:selected").val()).split("-");
		var query_p = $('#' + id_obra_ddl_odec + " option:selected").val() + "/procesos/" + path[0];
		sumaOdeCKaizen(query_o, $('#' + id_cantidad_odec).val());
		if(caso == "obra"){
			query = query_o + "/procesos/" + MISC;
			sumaOdeCKaizen(query, $('#' + id_cantidad_odec).val());
		} else if(caso == "proc"){
			if(path.length > 1){
				query = query_o + "/procesos/" + path[0] + "/subprocesos/" + $('#' + id_proc_ddl_odec + " option:selected").val();
				sumaOdeCKaizen(query, $('#' + id_cantidad_odec).val());
			} else {
				query = query_p;
			}
			sumaOdeCKaizen(query_p, $('#' + id_cantidad_odec).val());
		} else if(caso == "IQONO MEXICO"){
			query = query_o + "/procesos/" + $('#' + id_proc_ddl_odec + " option:selected").val();
			var query_s = query + "/subprocesos/" + subprocs[$('#' + id_solped_ddl_odec + " option:selected").val()];
			sumaOdeCKaizen(query_p, $('#' + id_cantidad_odec).val());
			sumaOdeCKaizen(query_s, $('#' + id_cantidad_odec).val());	
		}
		firebase.database().ref(rama_bd_obras + "/" + query + "/contrato_compras/solpeds/" + $('#' + id_solped_ddl_odec + " option:selected").val() + "/odecs/" + $('#' + id_clave_odec).val()).set(odec);
		alert("Actualizado");
		loadDataTableOdeC();
		$('#' + id_proc_ddl_odec).empty();
	    $('#' + id_group_proc_odec).addClass('hidden');
	    $('#' + id_clave_odec).val("");
	    $('#' + id_proveedor_odec).val("");
	    $('#' + id_cantidad_odec).val("");
	    $('#' + id_fecha_odec).val("");
	}
});

function sumaOdeCKaizen(query, cant){
	firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").once('value').then(function(snapshot){
		var anterior = snapshot.val();
		var nuevo = parseFloat(anterior) + parseFloat(cant);
		firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").set(nuevo);
	});
}

function loadDataTableOdeC(){
	var datos_odec = [];

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(procSnap){
                if(procSnap.child("num_subprocesos") == 0 || obraSnap.key == "IQONO MEXICO"){
                    procSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                    	solpedSnap.child("odecs").forEach(function(odecSnap){
                            var odec = odecSnap.val();
                            var not = odec.notas ? odec.notas : "-";
                            var pdf_link = "";
                            var pdf_consec = -1;
                            odecSnap.child("pdfs").forEach(function(pdfSnap){
                            	pdf_consec = pdfSnap.key;
                            	pdf_link = pdfSnap.child("pdf").val();
                            });
                            pdf_consec++;
                            datos_odec.push([
                                obraSnap.key,
                                procSnap.child("contrato_compras/clave").val(),
                                solpedSnap.key,
                                procSnap.key,
                                odecSnap.key,
                                odec.proveedor,
                                formatMoney(odec.costo),
                                not,
                                new Date(odec.fecha).toLocaleDateString("es-ES",options),
                                "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_pdf_odec + "'><i class='fas fa-file-pdf'>",
                                "<button type='button' class='editar btn btn-warning' onclick='showPdfOdec(\"" + pdf_link + "\")'><i class='fas fa-eye'></i></button>",
                                pdf_consec,
                            ]);
                        });
                    });
                } else {
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        subpSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                            solpedSnap.child("odecs").forEach(function(odecSnap){
                                var odec = odecSnap.val();
                                var not = odec.notas ? odec.notas : "-";
                                var pdf_link = "";
                                var pdf_consec = -1;
                                odecSnap.child("pdfs").forEach(function(pdfSnap){
                                	pdf_consec = pdfSnap.key;
                                	pdf_link = pdfSnap.child("pdf").val();
                                });
                                pdf_consec++;
                                datos_odec.push([
                                	obraSnap.key,
	                                subpSnap.child("contrato_compras/clave").val(),
	                                solpedSnap.key,
	                                subpSnap.key,
	                                odecSnap.key,
	                                odec.proveedor,
	                                formatMoney(odec.costo),
	                                not,
	                                new Date(odec.fecha).toLocaleDateString("es-ES",options),
	                                "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#" + id_modal_pdf_odec + "'><i class='fas fa-file-pdf'>",
	                                "<button type='button' class='editar btn btn-warning' onclick='showPdfOdec(\"" + pdf_link + "\")'><i class='fas fa-eye'></i></button>",
	                                pdf_consec,
                                ]);
                            });
                        });
                    });
                }
            });
        });

        tabla_odec = $('#'+ id_datatable_catalogo_odec).DataTable({
            destroy: true,
            data: datos_odec,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Obra"},
                {title: "Contrato"},
                {title: "Solped"},
                {title: "Proceso"},
                {title: "Clave"},
                {title: "Proveedor"},
                {title: "Precio"},              
                {title: "Notas"},
                {title: "Fecha"},
                {title: "Agregar pdf"},
                {title: "Imprimir pdf"},
                {title: "Num pdfs"},
            ],
            "columnDefs": [ 
                { "visible": false, "targets": [11] },
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
        agregarPdfOdeC("#" + id_datatable_catalogo_odec + " tbody", tabla_odec);
    });
}

function showPdfOdec(link){
	if(link == ""){
		alert("No hay documento para esta OdeC");
	} else {
		window.open(link, '_blank');
	}
}

function agregarPdfOdeC(tbody, table){
    $(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
        	$('#' + id_pdf_label_odec).text("Archivo no seleccionado");
			pdfSeleccionado = "";
            $('#' + id_agregar_pdf_button_odec).click(function(){
			    console.log("contrato: " + data[1]);
			    console.log("solped: " + data[2]);
			    console.log("odec: " + data[4]);
			    console.log("nombre: " + pdfSeleccionado.name);
				var storageRef = firebase.storage().ref(rama_storage_obras + "/contratos/" + data[1] + "/" + data[2] + "/odecs/" + data[4] + "/" + pdfSeleccionado.name);
			    var uploadTask = storageRef.put(pdfSeleccionado);
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
			            var pdf = {
			            	proveedor: data[3],
			            	pdf: downloadURL,   
						}
						var query;
						if(data[0] == "IQONO MEXICO"){
							query = data[3].split("-")[0];
						} else {
							query = data[3].split("-").length > 1 ? data[3].split("-")[0] + "/subprocesos/" + data[3] : data[3];
						}
						firebase.database().ref(rama_bd_obras + "/" + data[0] + "/procesos/" + query + "/contrato_compras/solpeds/" + data[2] + "/odecs/" + data[4] + "/pdfs/" + data[11]).update(pdf);
			            
			            alert("Actualización exitosa");
			            loadDataTableOdeC();
			            $('#' + id_cerrar_modal_button_odec).click();
			        });
			    });
			});
        }
    });
}

$('#' + id_pdf_file_odec).on("change", function(event){
    pdfSeleccionado = event.target.files[0];
    $('#' + id_pdf_label_odec).text(pdfSeleccionado.name);
});

