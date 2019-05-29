var id_obra_ddl_contrato = "obraDdlContrato";
var id_proc_ddl_contrato = "procDdlContrato";
var id_clave_contrato = "claveContrato";
var id_guardar_button_contrato = "guardarButtonContrato";

var id_datatable_catalogo_contrato =  "dataTableCatalogoContrato";

var id_tab_contrato = "tabContrato";

var rama_bd_obras = "obras";

$('#' + id_tab_contrato).click(function(){
	$('#' + id_obra_ddl_contrato).empty();
	$('#' + id_proc_ddl_contrato).empty();
	var select = document.getElementById(id_obra_ddl_contrato);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){   
            var option2 = document.createElement('option');
            option2.text = obra.nombre;
            option2.value = obra.nombre; 
            select.appendChild(option2);
        }
    });
    loadTablaContrato();
});

function loadTablaContrato(){
	var datos_cont = [];
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(procSnap){
                if(procSnap.child("num_subprocesos") == 0 || obraSnap.key == "IQONO MEXICO"){
                	if(procSnap.child("contrato_compras").exists()){
	                	var cont = procSnap.child("contrato_compras").val();
	                    datos_cont.push([
	                        obraSnap.key,
	                        procSnap.key,
	                        cont.clave,
	                    ]);
	                }
                } else {
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        if(subpSnap.child("contrato_compras").exists()){
	                        var cont = subpSnap.child("contrato_compras").val();
		                    datos_cont.push([
		                        obraSnap.key,
		                        procSnap.key,
		                        cont.clave,
		                    ]);
		                }
                    });
                }
            });
        });

        tabla_cont = $('#'+ id_datatable_catalogo_contrato).DataTable({
            destroy: true,
            data: datos_cont,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Obra"},
                {title: "Proceso"},
                {title: "Contrato"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
}

$('#' + id_obra_ddl_contrato).change(function(){
	$('#' + id_proc_ddl_contrato).empty();
	var select = document.getElementById(id_proc_ddl_contrato);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_contrato + " option:selected").val()).once('value').then(function(snapshot){
        var obra = snapshot.val();
        snapshot.child("procesos").forEach(function(procSnap){
        	if(procSnap.child("num_subprocesos").val() == 0 || $('#' + id_obra_ddl_contrato + " option:selected").val() == "IQONO MEXICO"){
        		if(!procSnap.child("contrato_compras").exists()){
		            var option2 = document.createElement('option');
		            option2.text = procSnap.key;
		            option2.value = procSnap.key; 
		            select.appendChild(option2);
	        	}
        	} else {
        		procSnap.child("subprocesos").forEach(function(subpSnap){
        			if(!subpSnap.child("contrato_compras").exists()){
	        			var option3 = document.createElement('option');
			            option3.text = subpSnap.key;
			            option3.value = subpSnap.key; 
			            select.appendChild(option3);
		        	}
        		});
        	}
        });
    });
});

$('#' + id_guardar_button_contrato).click(function(){
	if($('#' + id_obra_ddl_contrato + " option:selected").val() == "" || $('#' + id_proc_ddl_contrato + " option:selected").val() == ""||!$('#' + id_clave_contrato).val()){
		alert("Llena todos los campos");
	} else {
		var cont = {
			clave: $('#' + id_clave_contrato).val(),
			solpeds: "",
		}
		var proc = $('#' + id_proc_ddl_contrato + " option:selected").val();
		var proc_split = proc.split("-");
		var query = proc_split.length == 1 ? proc : proc_split[0] + "/subprocesos/" + proc;
		if(query == "PC00"){
			query == "PC00/subprocesos/PC00-MISC";
		}
		firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_contrato + " option:selected").val() + "/procesos/" + query + "/contrato_compras").set(cont);
		alert("Contrato asignado con éxito");
		document.getElementById(id_proc_ddl_contrato).selectedIndex = 0;
		$('#' + id_clave_contrato).val("");
		loadTablaContrato();
	}
});