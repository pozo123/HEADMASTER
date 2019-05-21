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
var id_actualizar_valor_odec = "actualizarOdeC";

var id_datatable_catalogo_odec =  "dataTableCatalogoOdeC";
var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

var tab_odec = "tabOdeC";
var rama_bd_obras = "obras";
var rama_bd_proveedores = "compras/proveedores";
var caso;
var subprocs = [];

//falta: 
//Mover html
//datatable (jalar de catalogo_odec)
//field prvee nombre
//funcionalidad autollenado nombre / clave y alert (proveedor)
//En tabla 3 botones
//Revisar toda la app :/ porque cambió el formato de contrato y así

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
	        	subprocs[solpedSnap.key] = solpedSnap.child("subproceso");
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
			$('#' + id_proveedor_odec).val(snapshot.key);
			highLight(id_proveedor_odec);
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
       /*AQUI- cotizaciones(DEFINIR)
       - notas
       - pdfs
          - pdf(consecutivo)
             - proveedor
             - pdf (link)
       - remisiones (DEFINIR)
       - pagos*/
		var odec = {
			proveedor: $('#' + id_proveedor_odec).val(),
			costo: $('#' + id_cantidad_odec).val(),
			pad: pistaDeAuditoria(),
			fecha: new Date($('#' + id_fecha_odec).val()).getTime(),
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

//AQUI añadir botones subir pdf, bajar pdf, aprovar (como checkbox)
function loadDataTableOdeC(){
	var datos_odec = [];

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(procSnap){
                if(procSnap.child("num_subprocesos") == 0 || obraSnap.key == "IQONO MEXICO"){
                    procSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                    	solpedSnap.child("odecs").forEach(function(odecSnap){
                            var odec = odecSnap.val();
                            datos_odec.push([
                                obraSnap.key,
                                procSnap.contrato_compras.clave,
                                procSnap.key,
                                odecSnap.key,
                                odec.proveedor,
                                formatMoney(odec.costo),
                                odec.notas,
                                new Date(odec.fecha).toLocaleDateString("es-ES",options),
                                odec.timestamps.registro_OdeC,
                            ]);
                        });
                    });
                } else {
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        subpSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
                            solpedSnap.child("odecs").forEach(function(odecSnap){
                                var odec = odecSnap.val();
                                datos_odec.push([
                                	obraSnap.key,
	                                subpSnap.contrato_compras.clave,
	                                subpSnap.key,
	                                odecSnap.key,
	                                odec.proveedor,
	                                formatMoney(odec.costo),
	                                odec.notas,
	                                new Date(odec.fecha).toLocaleDateString("es-ES",options),
                                ]);
                            });
                        });
                    });
                }
            });
        });

        tabla_registros = $('#'+ id_datatable_catalogo_odec).DataTable({
            destroy: true,
            data: datos_odec,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Obra"},
                {title: "Contrato"},
                {title: "Proceso"},
                {title: "Clave"},
                {title: "Proveedor"},
                {title: "Precio"},              
                {title: "Notas"},
                {title: "Fecha"},
                //AQUI Añadir los botones
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
}