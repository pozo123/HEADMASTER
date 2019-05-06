var id_obra_ddl_cuant_kaizen = "obraDdlCuant";

var id_group_proc_cuant_kaizen = "groupProcCuant"
var id_proc_ddl_cuant_kaizen = "procDdlCuant";

var id_group_subp_cuant_kaizen = "groupSubpCuant"
var id_subp_ddl_cuant_kaizen = "subpDdlCuant";

var id_valor_anterior_cuant_kaizen = "anteriorCuant";
var id_cantidad_cuant_kaizen = "cantidadCuant";
var id_valor_nuevo_cuant_kaizen = "nuevoCuant";
var id_descripcion_cuant_kaizen = "descripcionCuant";//NUEVO
var id_actualizar_valor_cuant_kaizen = "actualizarCuant";

var tab_cuant_kaizen = "tabCuant";
var rama_bd_obras_magico = "obras";
var rama_bd_cuantificaciones = "proyectos/cuantificaciones";
var caso;

$('#' + tab_cuant_kaizen).click(function(){
	$('#' + id_obra_ddl_cuant_kaizen).empty();
    var select = document.getElementById(id_obra_ddl_cuant_kaizen);
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

$("#" + id_obra_ddl_cuant_kaizen).change(function(){
	$('#' + id_proc_ddl_cuant_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text(formatMoney(obra.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(formatMoney(obra.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    if(obra.num_procesos == 0){
	    	$('#' + id_group_proc_cuant_kaizen).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_cuant_kaizen).removeClass('hidden');

		    var select = document.getElementById(id_proc_ddl_cuant_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);

		    snapshot.child('procesos').forEach(function(childSnap){
		    	var proc = childSnap.val();
		    	if(!proc.terminado){
			    	var option2 = document.createElement('OPTION');
			        option2.text = proc.clave + " (" + proc.nombre + ")";
			        option2.value = proc.clave;
			        select.appendChild(option2);
			    }
		    });
	    }
    });
});

$("#" + id_proc_ddl_cuant_kaizen).change(function(){
	$('#' + id_subp_ddl_cuant_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var proc = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text(formatMoney(proc.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(formatMoney(proc.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    if(proc.num_subprocesos == 0){
	    	$('#' + id_group_subp_cuant_kaizen).addClass('hidden');
	    	caso = "proc";
	    } else {
	    	caso = "subp";
	    	$('#' + id_group_subp_cuant_kaizen).removeClass('hidden');
	    	$('#' + id_subp_ddl_cuant_kaizen).empty();
		    var select = document.getElementById(id_subp_ddl_cuant_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);
		    snapshot.child('subprocesos').forEach(function(childSnap){
		    	var subp = childSnap.val();
		    	if(!subp.terminado){
			    	var option2 = document.createElement('OPTION');
			        option2.text = subp.clave + " (" + subp.nombre + ")";
			        option2.value = subp.clave;
			        select.appendChild(option2);
			    }
		    });
	    }
    });
});

$("#" + id_subp_ddl_cuant_kaizen).change(function(){
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
        var subp = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text(formatMoney(subp.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(formatMoney(subp.kaizen.PRODUCCION.SUMINISTROS.CUANT));
    });
});

$('#' + id_cantidad_cuant_kaizen).change(function(){
	nuevo = deformatMoney($('#' + id_valor_anterior_cuant_kaizen).text()) + parseFloat($('#' + id_cantidad_cuant_kaizen).val());
	$('#' + id_valor_nuevo_cuant_kaizen).text(formatMoney(nuevo));
});

$('#' + id_actualizar_valor_cuant_kaizen).click(function(){
	if($('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() == ""){
		alert("Selecciona una obra");
	} else if(caso != "obra" && $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val() == ""){
		alert("Selecciona un proceso");
	} else if(caso == "subp" && $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val() == ""){
		alert("Selecciona un subproceso");
	} else {
		var query_o = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val();
		var query_p = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val();
		var query_s = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val();
		sumaCuantKaizen(query_o);
		var proc = "MISC";
		if(caso != "obra"){
			proc = $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val();
			sumaCuantKaizen(query_p);
			if(caso == "subp"){
				proc = $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val();
				sumaCuantKaizen(query_s);
			}
		} else {
			sumaCuantKaizen(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/MISC");
		}
		var desc = $('#' + id_descripcion_cuant_kaizen).val() ? $('#' + id_descripcion_cuant_kaizen).val() : "";
		var cuant = {
			monto: $('#' + id_cantidad_cuant_kaizen).val(),
			pad: pistaDeAuditoria(),
			proceso: proc,
			descripcion: desc,
		}
		var hoy = getWeek(new Date().getTime());
		firebase.database().ref(rama_bd_cuantificaciones + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/" + hoy[0] + "/" + hoy[1]).push(cuant);
		$('#' + id_valor_anterior_cuant_kaizen).text(formatMoney($('#' + id_valor_nuevo_cuant_kaizen).text());
		$('#' + id_cantidad_cuant_kaizen).val("");
		alert("Actualizado");
	}
});

function sumaCuantKaizen(query){
	firebase.database().ref(query + "/kaizen/PRODUCCION/SUMINISTROS/CUANT").once('value').then(function(snapshot){
		var anterior = snapshot.val();
		var nuevo = parseFloat(anterior) + parseFloat($('#' + id_cantidad_cuant_kaizen).val());
		firebase.database().ref(query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").set(nuevo);
	});
}