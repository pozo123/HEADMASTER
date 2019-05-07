var id_obra_ddl_asigna_contrato = "obraDdlAsignaContrato";
var id_group_proc_asigna_contrato = "procGroupAsignaContrato";
var id_proc_ddl_asigna_contrato = "procDdlAsignaContrato";
var id_contrato_asigna_contrato = "contratoAsignaContrato";

var id_guardar_button_asigna_contrato = "guardarButtonAsignaContrato";

var rama_bd_obras_magico = "obras";
var tab_asigna_contrato = "tabAsignaContrato";

var caso;

$('#' + tab_asigna_contrato).click(function(){
	$('#' + id_obra_ddl_asigna_contrato).empty();
    $('#' + id_proc_ddl_asigna_contrato).empty();
    $('#' + id_group_proc_asigna_contrato).addClass('hidden');

    var select = document.getElementById(id_obra_ddl_asigna_contrato);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.nombre;
        select.appendChild(option2);
    });
});

$("#" + id_obra_ddl_asigna_contrato).change(function(){
	$('#' + id_proc_ddl_asigna_contrato).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_asigna_contrato + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    if(!obra.terminada){
		    if(obra.num_procesos == 0){
		    	$('#' + id_group_proc_asigna_contrato).addClass('hidden');
		    	caso = "obra";
		    } else {
				caso = "proc";
		    	$('#' + id_group_proc_asigna_contrato).removeClass('hidden');

			    var select = document.getElementById(id_proc_ddl_asigna_contrato);
			    var option = document.createElement('option');
			    option.style = "display:none";
			    option.text = option.value = "";
			    select.appendChild(option);

			    snapshot.child('procesos').forEach(function(childSnap){
					var proc = childSnap.val();
			    	if(proc.num_subprocesos == 0 || obra.nombre == "IQONO MEXICO"){
				    	var option2 = document.createElement('OPTION');
				        option2.text = proc.clave + " (" + proc.nombre + ")";
				        option2.value = proc.clave;
				        select.appendChild(option2);
			    	} else {
			    		childSnap.child('subprocesos').forEach(function(subpSnap){
			    			var subp = subpSnap.val();
			    			var option2 = document.createElement('OPTION');
					        option2.text = subp.clave + " (" + subp.nombre + ")";
					        option2.value = subp.clave;
					        select.appendChild(option2);
			    		});
			    	}
			    });
		    }
		}
    });
});

$("#" + id_proc_ddl_asigna_contrato).change(function(){
	if(caso != "obra"){
		var path = $('#' + id_proc_ddl_asigna_contrato + " option:selected").val().split("-");
		if(path.length > 1){
			caso = "subp";
		} else {
			caso = "proc";
		}
		console.log(path)
		console.log(caso)
	}
});

$('#' + id_guardar_button_asigna_contrato).click(function(){
	if($('#' + id_contrato_asigna_contrato).val() == "" || $('#' + id_obra_ddl_asigna_contrato + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_asigna_contrato + " option:selected").val() == "")){
		alert("Llena todos los campos");
	} else {
		console.log(caso);
		var contrato = $('#' + id_contrato_asigna_contrato).val();
		if(caso == "obra"){
			firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_asigna_contrato + " option:selected").val() + "/procesos/MISC/contrato").set(contrato);
		} else if(caso == "proc"){
			firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_asigna_contrato + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_asigna_contrato + " option:selected").val() + "/contrato").set(contrato);
		} else if(caso == "subp"){
			firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_asigna_contrato + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_asigna_contrato + " option:selected").val().split("-")[0] + "/subprocesos/" + $('#' + id_proc_ddl_asigna_contrato + " option:selected").val() + "/contrato").set(contrato);
		}
		alert("Numero de contrato asignado con éxito");
	}
});