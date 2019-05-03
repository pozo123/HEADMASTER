var id_obra_ddl_odec_kaizen = "obraDdlOdeC";
var id_group_proc_odec_kaizen = "groupProcOdec"
var id_proc_ddl_odec_kaizen = "procDdlOdeC";
var id_group_subp_odec_kaizen = "groupSubpOdec"
var id_subp_ddl_odec_kaizen = "subpDdlOdeC";
var id_fecha_odec_kaizen = "fechaOdeC";
var id_clave_odec_kaizen = "claveOdeC";
var id_cantidad_odec_kaizen = "cantidadOdeC";
var id_proveedor_odec_kaizen = "proveedorOdeC";
var id_actualizar_valor_odec_kaizen = "actualizarOdeC";

var tab_odec_kaizen = "tabOdeC";
var rama_bd_obras_magico = "test/obras";
var caso;

$('#' + tab_odec_kaizen).click(function(){
	$('#' + id_obra_ddl_odec_kaizen).empty();
    $('#' + id_proc_ddl_odec_kaizen).empty();
    $('#' + id_subp_ddl_odec_kaizen).empty();
    $('#' + id_group_proc_odec_kaizen).addClass('hidden');
    $('#' + id_group_subp_odec_kaizen).addClass('hidden');
	jQuery('#' + id_fecha_odec_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_obra_ddl_odec_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
	        var option2 = document.createElement('OPTION');
	        option2.text = obra.nombre;
	        option2.value = obra.nombre;
	        select.appendChild(option2);
	    }
    });
});

$("#" + id_obra_ddl_odec_kaizen).change(function(){
	$('#' + id_proc_ddl_odec_kaizen).empty();
    $('#' + id_subp_ddl_odec_kaizen).empty();
    $('#' + id_group_subp_odec_kaizen).addClass('hidden');

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_odec_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    if(obra.num_procesos == 0 && obra.procesos.ADIC.num_subprocesos == 0){
	    	$('#' + id_group_proc_odec_kaizen).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_odec_kaizen).removeClass('hidden');
	    	caso = "proc";

		    var select = document.getElementById(id_proc_ddl_odec_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);

		    snapshot.child('procesos').forEach(function(childSnap){
		    	var proc = childSnap.val();
		    	if(!proc.terminado){
			    	if(proc.num_subprocesos == 0 || obra.nombre == "IQONO MEXICO"){
				    	var contrato = proc.contrato ? proc.contrato : proc.nombre;
				    	var option2 = document.createElement('OPTION');
				        option2.text = proc.clave + " (" + contrato + ")";
				        option2.value = proc.clave;
				        select.appendChild(option2);
				    } else {
				    	childSnap.child('subprocesos').forEach(function(subpSnap){
				    		var subp = subpSnap.val();
				    		if(!subp.terminado){
				    			var contrato = subp.contrato ? subp.contrato : subp.nombre;
						    	var option2 = document.createElement('OPTION');
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

$("#" + id_proc_ddl_odec_kaizen).change(function(){
	$('#' + id_subp_ddl_odec_kaizen).empty();
	if($('#' + id_obra_ddl_odec_kaizen + " option:selected").val() == "IQONO MEXICO"){
		caso = "IQONO MEXICO";
	    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val()).once('value').then(function(snapshot){
		    var proc = snapshot.val();
	    	$('#' + id_group_subp_odec_kaizen).removeClass('hidden');
	    	$('#' + id_subp_ddl_odec_kaizen).empty();
		    var select = document.getElementById(id_subp_ddl_odec_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);
		    snapshot.child('subprocesos').forEach(function(childSnap){
		    	var subp = childSnap.val();
		    	var option2 = document.createElement('OPTION');
		        option2.text = subp.clave + " (" + subp.nombre + ")";
		        option2.value = subp.clave;
		        select.appendChild(option2);
		    });
	    });
	} else {
		$('#' + id_group_subp_odec_kaizen).addClass('hidden');
		$('#' + id_subp_ddl_odec_kaizen).empty();
	}
});

$('#' + id_actualizar_valor_odec_kaizen).click(function(){
	if($('#' + id_clave_odec_kaizen).val() == "" || $('#' + id_cantidad_odec_kaizen).val() == "" || $('#' + id_proveedor_odec_kaizen).val() == "" || $('#' + id_fecha_odec_kaizen).val() == "" || $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_odec_kaizen + " option:selected").val() == "") || (caso == "IQONO MEXICO" && $('#' + id_subp_ddl_odec_kaizen + " option:selected").val() == "")){
		alert("Llena todos los campos requeridos");
	} else {
		var hoy = getWeek(new Date($('#' + id_fecha_odec_kaizen).val()).getTime()); //hoy[0] = week, hoy[1] = year
		var odec = {
			precio_ppto: $('#' + id_cantidad_odec_kaizen).val(),
			clave: $('#' + id_clave_odec_kaizen).val(),
			pad: pistaDeAuditoria(),
			precio_pag: 0,
			pagada: false,
			proveedor: $('#' + id_proveedor_odec_kaizen).val(),
			timestamps: {
				OdeC: new Date($('#' + id_fecha_odec_kaizen).val()).getTime(),
				registro_OdeC: new Date().getTime(),
				pago: "",
				registro_pago: "",
			},
		}
		var query;
		var query_o = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val();
		var path = ($('#' + id_proc_ddl_odec_kaizen + " option:selected").val()).split("-");
		var query_p = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + path[0];
		sumaOdeCKaizen(query_o, $('#' + id_cantidad_odec_kaizen).val());
		if(caso == "obra"){
			query = query_o + "/procesos/" + MISC;
			sumaOdeCKaizen(query, $('#' + id_cantidad_odec_kaizen).val());
		} else if(caso == "proc"){
			if(path.length > 1){
				query = query_o + "/procesos/" + path[0] + "/subprocesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val();
			} else {
				query = query_p;
			}
			sumaOdeCKaizen(query_p, $('#' + id_cantidad_odec_kaizen).val());
		} else if(caso == "IQONO MEXICO"){
			var query_s = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_odec_kaizen + " option:selected").val();
			query = query_s;
			sumaOdeCKaizen(query_p, $('#' + id_cantidad_odec_kaizen).val());
			sumaOdeCKaizen(query_s, $('#' + id_cantidad_odec_kaizen).val());	
		}
		console.log(query);
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/OdeC/" + hoy[1] + "/" + hoy[0] + "/" + $('#' + id_clave_odec_kaizen).val()).set(odec);
		console.log(rama_bd_obras_magico + "/" + query + "/OdeC/" + hoy[1] + "/" + hoy[0] + "/" + $('#' + id_clave_odec_kaizen).val())
		alert("Actualizado");
		$('#' + id_proc_ddl_odec_kaizen).empty();
	    $('#' + id_subp_ddl_odec_kaizen).empty();
	    $('#' + id_group_proc_odec_kaizen).addClass('hidden');
	    $('#' + id_group_subp_odec_kaizen).addClass('hidden');
	    $('#' + id_clave_odec_kaizen).val("");
	    $('#' + id_proveedor_odec_kaizen).val("");
	    $('#' + id_cantidad_odec_kaizen).val("");
	    $('#' + id_fecha_odec_kaizen).val("");
	}
});

function sumaOdeCKaizen(query, cant){
	firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").once('value').then(function(snapshot){
		var anterior = snapshot.val();
		var nuevo = parseFloat(anterior) + parseFloat(cant);
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").set(nuevo);
		
	});
}