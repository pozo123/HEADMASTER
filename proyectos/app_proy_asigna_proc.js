var id_obra_ddl_asignaProc = "obraDdlAsignaProc";
var id_ppto_ddl_asignaProc = "pptoDdlAsignaProc";
var id_proc_ddl_asignaProc = "procDdlAsignaProc";
var id_asignar_button_asignaProc = "asignarButtonAsignaProc";

var rama_bd_obras_magico = "obras";
var rama_bd_obras_proy = "proyectos/obras";

var id_tab_asignaProc = "tabAsignaProc";

$('#' + id_tab_asignaProc).click(function(){
	$('#' + id_obra_ddl_asignaProc).empty();
    var select = document.getElementById(id_obra_ddl_asignaProc);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
    	snapshot.forEach(function(childSnap){
			var obra = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = obra; 
            select.appendChild(option2);
    	});
    });
});

$("#" + id_obra_ddl_asignaProc).change(function(){
	$('#' + id_ppto_ddl_asignaProc).empty();
    var select = document.getElementById(id_ppto_ddl_asignaProc);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_asignaProc + " option:selected").val()).once('value').then(function(snapshot){
    	snapshot.child("presupuestos").forEach(function(childSnap){
			var ppto = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = ppto; 
            select.appendChild(option2);
    	});
    });

    $('#' + id_proc_ddl_asignaProc).empty();
    var select2 = document.getElementById(id_proc_ddl_asignaProc);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select2.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" +  $('#' + id_obra_ddl_asignaProc + " option:selected").val()).once('value').then(function(snapshot){
        snapshot.child("procesos").forEach(function(childSnap){
    		if(childSnap.val().num_subprocesos == 0){
                var proc = childSnap.key;
	            var option2 = document.createElement('option');
	            option2.text = proc + " (" + childSnap.val().nombre + ")";
	            option2.value = proc; 
	            select2.appendChild(option2);
    		} else {
    			childSnap.child("subprocesos").forEach(function(grandChildSnap){
                    var subp = grandChildSnap.key;
		            var option2 = document.createElement('option');
		            option2.text = subp + " (" + grandChildSnap.val().nombre + ")";
		            option2.value = subp; 
		            select2.appendChild(option2);
    			});
    		}
    	});
    });
});

$("#" + id_ppto_ddl_asignaProc).change(function(){
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_asignaProc + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_asignaProc + " option:selected").val() + "/proceso").once('value').then(function(snapshot){
		var proc = snapshot.val();
		if(proc != null){
			document.getElementById(id_proc_ddl_asignaProc).value = proc;
		}
	});
});

$('#' + id_asignar_button_asignaProc).on('click', function(){
	var proc = $('#' + id_proc_ddl_asignaProc + " option:selected").val();
	firebase.database().ref(rama_bd_obras_proy + "/" + $('#' + id_obra_ddl_asignaProc + " option:selected").val() + "/presupuestos/" + $('#' + id_ppto_ddl_asignaProc + " option:selected").val() + "/proceso").set(proc);
	alert("Asignación exitosa");
});