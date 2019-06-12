var id_obra_ddl_pag_suministros_kaizen = "obraDdlPagSum";
var id_group_subp_pag_suministros_kaizen = "groupSubpPagSum"
var id_subp_ddl_pag_suministros_kaizen = "subpDdlPagSum";
var id_group_proc_pag_suministros_kaizen = "groupProcPagSum"
var id_proc_ddl_pag_suministros_kaizen = "procDdlPagSum";
var id_fecha_pag_suministros_kaizen = "fechaPagSum";
var id_odec_ddl_pag_suministros_kaizen = "clavePagSum";
var id_cantidad_pag_suministros_kaizen = "cantidadPagSum";
var id_actualizar_valor_pag_suministros_kaizen = "actualizarPagSum";

var tab_pag_suministros_kaizen = "tabPagSum";
var rama_bd_obras_magico = "obras";
var caso;
var obra_global;

$('#' + tab_pag_suministros_kaizen).click(function(){
	$('#' + id_obra_ddl_pag_suministros_kaizen).empty();
    $('#' + id_proc_ddl_pag_suministros_kaizen).empty();
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    $('#' + id_group_proc_pag_suministros_kaizen).addClass('hidden');
    $('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
	jQuery('#' + id_fecha_pag_suministros_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
	$('#' + id_obra_ddl_pag_suministros_kaizen).empty();
    var select = document.getElementById(id_obra_ddl_pag_suministros_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    for(key in nombre_obras){
    	if(!nombre_obras[key].terminada){
	        var option2 = document.createElement('OPTION');
	        option2.text = key;
	        option2.value = key;
	        select.appendChild(option2);
	    }
    };
});

$("#" + id_obra_ddl_pag_suministros_kaizen).change(function(){
    $('#' + id_proc_ddl_pag_suministros_kaizen).empty();
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    $('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
	$('#' + id_odec_ddl_pag_suministros_kaizen).empty();
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    obra_global = snapshot;
	    if(obra.num_procesos == 0 && obra.procesos.ADIC.num_subprocesos == 0){
	    	$('#' + id_group_proc_pag_suministros_kaizen).addClass('hidden');
	    	caso = "obra";
	    	
			var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
			var option3 = document.createElement('option');
			option3.style = "display:none";
			option3.text = option3.value = "";
			select2.appendChild(option3);

			snapshot.child('procesos/MISC/OdeC').forEach(function(yearSnap){
				yearSnap.forEach(function(weekSnap){
					weekSnap.forEach(function(odecSnap){
						if(!odec.Snap.child("pagada").val()){
							var option4 = document.createElement('OPTION');
					        option4.text = odecSnap.key;
					        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
					        select.appendChild(option4);
					    }
					});
				});
			});

	    } else {
	    	$('#' + id_group_proc_pag_suministros_kaizen).removeClass('hidden');
	    	caso = "proc";
		    var select = document.getElementById(id_proc_ddl_pag_suministros_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);

		    snapshot.child('procesos').forEach(function(childSnap){
		    	var proc = childSnap.val();
		    	if((proc.clave != "ADIC" || proc.num_subprocesos != 0) && !proc.terminado){
		    		if(proc.num_subprocesos == 0 || snapshot.key == "IQONO MEXICO"){
				    	var option2 = document.createElement('OPTION');
				    	var contrato = proc.contrato ? proc.contrato : proc.nombre;
				        option2.text = proc.clave + " (" + contrato + ")";
				        option2.value = proc.clave;
				        select.appendChild(option2);
				    } else {
				    	childSnap.child("subprocesos").forEach(function(subpSnap){
				    		var subp = subpSnap.val();
				    		if(!subp.terminado){
				    			var option2 = document.createElement('OPTION');
						    	var contrato = subp.contrato ? subp.contrato : subp.nombre;
						        option2.text = subp.clave + " (" + contrato + ")";
						        option2.value = subp.clave;
						        select.appendChild(option2);
				    		}
				    	});
				    }
		    	}
		    });
	    }
    });
});

$("#" + id_proc_ddl_pag_suministros_kaizen).change(function(){
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    if($('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() == "IQONO MEXICO"){
    	caso = "IQONO MEXICO";
        var proc = obra_global.child("procesos/" + $("#" + id_proc_ddl_pag_suministros_kaizen + " option:selected").val());
    	$('#' + id_group_subp_pag_suministros_kaizen).removeClass('hidden');
    	$('#' + id_subp_ddl_pag_suministros_kaizen).empty();
	    var select = document.getElementById(id_subp_ddl_pag_suministros_kaizen);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
	    proc.child('subprocesos').forEach(function(childSnap){
	    	var subp = childSnap.val();
	    	var option2 = document.createElement('OPTION');
	        option2.text = subp.key;
	        option2.value = subp.key;
	        select.appendChild(option2);

	    }); 
	} else {
		$('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
		$('#' + id_group_subp_pag_suministros_kaizen).empty();
		//Carga OdeCs
		var proc = $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val();
		var path = proc.split("-");
		var query = path.length > 1 ?  "procesos/" + path[0] + "/subprocesos/" + proc : "procesos/" + path[0];

		$('#' + id_odec_ddl_pag_suministros_kaizen).empty();
		var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
		var option3 = document.createElement('option');
		option3.style = "display:none";
		option3.text = option3.value = "";
		select2.appendChild(option3);

		obra_global.child(query + "/OdeC").forEach(function(yearSnap){
			yearSnap.forEach(function(weekSnap){
				weekSnap.forEach(function(odecSnap){
					if(!odecSnap.child("pagada").val()){
						var option4 = document.createElement('OPTION');
				        option4.text = odecSnap.key;
				        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
				        select2.appendChild(option4);
				    }
				});
			});
		});
	}
});

$('#' + id_group_subp_pag_suministros_kaizen).click(function(){
	$('#' + id_odec_ddl_pag_suministros_kaizen).empty();
	var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
	var option3 = document.createElement('option');
	option3.style = "display:none";
	option3.text = option3.value = "";
	select2.appendChild(option);

	obra_global.child('procesos/' + $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val() + '/subprocesos/' + $('#' + id_subp_ddl_pag_suministros_kaizen + " option:selected").val() + '/OdeC').forEach(function(yearSnap){
		yearSnap.forEach(function(weekSnap){
			weekSnap.forEach(function(odecSnap){
				if(!odecSnap.child("pagada").val()){
					var option4 = document.createElement('OPTION');
			        option4.text = odecSnap.key;
			        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
			        select2.appendChild(option4);
			    }
			});
		});
	});
});

$('#' + id_actualizar_valor_pag_suministros_kaizen).click(function(){
	if($('#' + id_odec_ddl_pag_suministros_kaizen + " option:selected").val() == "" || $('#' + id_cantidad_pag_suministros_kaizen).val() == "" || $('#' + id_fecha_pag_suministros_kaizen).val() == "" || $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val() == "") || (caso == "IQONO MEXICO" && $('#' + id_subp_ddl_pag_suministros_kaizen + " option:selected").val() == "")){
		alert("Llena todos los campos requeridos");
	} else {
		var hoy = getWeek(new Date().getTime()); //hoy[0] = week, hoy[1] = year
		var pag_suministros = {
			precio_pag: $('#' + id_cantidad_pag_suministros_kaizen).val(),
			pad: pistaDeAuditoria(),
			timestamps: {
				pago: new Date($('#' + id_fecha_pag_suministros_kaizen).val()).getTime(),
				registro_pago: new Date().getTime(),
			},
		}

		var query;
		var query_o = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val();
		var proc = $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val();
		var path = proc.split("-");
		var query_p = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() + "/procesos/" + path[0];
		var cant = $('#' + id_cantidad_pag_suministros_kaizen).val();
		sumaSumPagKaizen(query_o, cant);
		if(caso == "obra"){
			query = query_o + "/procesos/MISC";
		} else if(caso == "proc"){
			//CHecar si subp
			query = path.length > 1 ? query_o + "/procesos/" + path[0] + "/subprocesos/" + proc : query_p;
			sumaSumPagKaizen(query_p, cant);
		} else if(caso == "IQONO MEXICO"){
			var query_s = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_pag_suministros_kaizen + " option:selected").val();
			query = query_s;
			sumaSumPagKaizen(query_p, cant);
			sumaSumPagKaizen(query_s, cant);
		}
		var odec = $('#' + id_odec_ddl_pag_suministros_kaizen + " option:selected").val();
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/OdeC/" + odec + "/pagos").push(pag_suministros);
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/OdeC/" + odec).once('value').then(function(snapshot){
			var odec_snap = snapshot.val();
			var valor_nuevo = parseFloat(odec_snap.precio_pag) + parseFloat(cant);
			firebase.database().ref(rama_bd_obras_magico + "/" + query + "/OdeC/" + odec + "/precio_pag").set(valor_nuevo);
		});
		alert("Actualizado");
	    $('#' + id_proc_ddl_pag_suministros_kaizen).empty();
	    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
	    $('#' + id_odec_ddl_pag_suministros_kaizen).empty();
	    $('#' + id_group_proc_pag_suministros_kaizen).addClass('hidden');
	    $('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
		$('#' + id_cantidad_pag_suministros_kaizen).val("");
		$('#' + id_fecha_pag_suministros_kaizen).val("");
	}
});

function sumaSumPagKaizen(query, cant){
	firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/PAG").once('value').then(function(snapshot){
		var anterior = snapshot.val();
		var nuevo = parseFloat(anterior) + parseFloat(cant);
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/PAG").set(nuevo);
	});
}