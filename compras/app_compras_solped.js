var id_obra_ddl_solped = "obraDdlSolped";
var id_contrato_ddl_solped = "contratoDdlSolped";
var id_subp_group_solped = "subpGroupSolped";
var id_subp_ddl_solped = "subpDdlSolped";
var id_clave_solped = "claveSolped";
var id_nombre_solped = "nombreSolped";
var id_fecha_solped = "fechaSolped";
var id_foto_label_solped = "fotoLabelSolped";

var id_foto_solped = "fotoFileSolped";

var id_actualizar_button_solped = "actualizarButtonSolped";
var id_reset_button_solped = "resetSolped";
var id_pdf_button_solped = "pdfButtonSolped";

var rama_bd_obras = "obras";
var rama_storage_obras = "obras";

var tab_solped = "tabSolped";

var solpedSnap;
var json_obras_solped;
var fotoSeleccionada = "";

$('#' + tab_solped).click(function(){
	resetTabSolped();
});

function resetTabSolped(){
	$('#' + id_obra_ddl_solped).empty();
    $('#' + id_contrato_ddl_solped).empty();
    $('#' + id_subp_ddl_solped).empty();
    $('#' + id_foto_label_solped).text("Archivo no seleccionado");
    $('#' + id_subp_group_solped).addClass('hidden');
    fotoSeleccionada = "";
	jQuery('#' + id_fecha_solped).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_obra_ddl_solped);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
		json_obras_solped = snapshot;
		snapshot.forEach(function(obraSnap){
			if(!obraSnap.child("terminada").val()){
		        var option2 = document.createElement('OPTION');
		        option2.text = obraSnap.child("nombre").val();
		        option2.value = obraSnap.child("nombre").val();
		        select.appendChild(option2);
			}
		});
    });
};

$('#' + id_obra_ddl_solped).change(function(){
	$('#' + id_contrato_ddl_solped).empty();
	$('#' + id_subp_ddl_solped).empty();
	$('#' + id_subp_group_solped).addClass('hidden');
	var select = document.getElementById(id_contrato_ddl_solped);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    json_obras_solped.child($('#' + id_obra_ddl_solped + " option:selected").val() + "/procesos").forEach(function(procSnap){
    	if(procSnap.child("num_subprocesos").val() == 0 || $('#' + id_obra_ddl_solped + " option:selected").val() == "IQONO MEXICO"){
    		if(procSnap.child("contrato_compras").exists()){
	            var option2 = document.createElement('option');
	            option2.text = procSnap.child("contrato_compras/clave").val();
	            option2.value = procSnap.key;
	            select.appendChild(option2);
        	}
    	} else {
    		procSnap.child("subprocesos").forEach(function(subpSnap){
    			if(subpSnap.child("contrato_compras").exists()){
        			var option3 = document.createElement('option');
		            option3.text = subpSnap.child("contrato_compras/clave").val();
		            option3.value = subpSnap.key;
		            select.appendChild(option3);
	        	}
    		});
    	}
    });
});

$('#' + id_contrato_ddl_solped).change(function(){
	if($('#' + id_obra_ddl_solped + " option:selected").val() == "IQONO MEXICO" && $('#' + id_contrato_ddl_solped + " option:selected").val() != "MISC"){
		$('#' + id_subp_group_solped).removeClass('hidden');
		$('#' + id_subp_ddl_solped).empty();
		var select = document.getElementById(id_subp_ddl_solped);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
		json_obras_solped.child($('#' + id_obra_ddl_solped + " option:selected").val() + "/procesos").forEach(function(procSnap){
			console.log(procSnap.key);
			console.log($('#' + id_contrato_ddl_solped + " option:selected").val());
			if(procSnap.key == $('#' + id_contrato_ddl_solped + " option:selected").val()){
				procSnap.child("subprocesos").forEach(function(subpSnap){
					var option2 = document.createElement('option');
		            option2.text = subpSnap.key;
		            option2.value = subpSnap.key;
		            select.appendChild(option2);
				});
			}
		});
	}
	$('#' + id_nombre_solped).val("");
	$('#' + id_clave_solped).val("");
});

$('#' + id_clave_solped).change(function(){
	var proc = $('#' + id_contrato_ddl_solped + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	solpedSnap = json_obras_solped.child($('#' + id_obra_ddl_solped + " option:selected").val() + "/procesos/" + query + "/contrato_compras/solpeds/" + $('#' + id_clave_solped).val());
	console.log(query);
	console.log(json_obras_solped.val());
	console.log(solpedSnap.val());
	if(solpedSnap.exists()){
		highLight(id_nombre_solped);
		$('#' + id_nombre_solped).val(solpedSnap.child("nombre").val());
        
        var fech = new Date(solpedSnap.child("fecha").val());
        var f_string = (fech.getMonth() + 1) + "." + fech.getDate() + "." + fech.getFullYear();
        $("#" + id_fecha_solped).val(f_string)

		$('#' + id_pdf_button_solped).removeClass('hidden');
	} else {
		$('#' + id_pdf_button_solped).addClass('hidden');
	}
});

$('#' + id_foto_solped).on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#' + id_foto_label_solped).text(fotoSeleccionada.name);
});

$('#' + id_actualizar_button_solped).click(function(){
	if($('#' + id_obra_ddl_solped + " option:selected").val() == "" || $('#' + id_contrato_ddl_solped + " option:selected").val() == "" || $('#' + id_clave_solped).val() == "" || (!$('#' + id_subp_ddl_solped).hasClass('hidden') && $('#' + id_subp_ddl_solped + " option:selected").val() == "")){
		alert("Llena todos los campos requeridos");
	} else {
		var proc = $('#' + id_contrato_ddl_solped + " option:selected").val();
		var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
		if(fotoSeleccionada == ""){
			if(solpedSnap.exists()){
				alert("No se ha seleccionado un archivo");
			} else {
				var solp = {
                    nombre: $('#' + id_nombre_solped).val(),
                    fecha: new Date($('#' + id_fecha_solped).val()).getTime(),
                    foto: "",
                    autorizacion: false,
                    odecs: "",
				}
				if(!$('#' + id_subp_ddl_solped).hasClass('hidden')){
					solp["subproceso"] = $('#' + id_subp_ddl_solped + " option:selected").val();
				}
				firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_solped + " option:selected").val() + "/procesos/" + query + "/contrato_compras/solpeds/" + $('#' + id_clave_solped).val()).update(solp);
				alert("Alta exitosa \n(solped en espera de autorización)");
				$('#' + id_reset_button_solped).click();
				resetTabSolped();
			}
		} else {
		    var storageRef = firebase.storage().ref(rama_storage_obras + "/contratos/" + $('#' + id_contrato_ddl_solped + " option:selected").text() + "/" + $('#' + id_clave_solped).val() + "/" + fotoSeleccionada.name);
		    var uploadTask = storageRef.put(fotoSeleccionada);
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
		            var solp = {
	                    nombre: $('#' + id_nombre_solped).val(),
	                    fecha: new Date($('#' + id_fecha_solped).val()).getTime(),
	                    foto: downloadURL,
	                    autorizacion: true,
					}

					firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_solped + " option:selected").val() + "/procesos/" + query + "/contrato_compras/solpeds/" + $('#' + id_clave_solped).val()).update(solp);
		            
		            alert("Actualización exitosa");
		            $('#' + id_reset_button_solped).click();
		            resetTabSolped();
		            /*setTimeout(() => {
		                location.reload();
		            }, 3000);*/
		        });
		    });
		}
	}

});

$('#' + id_pdf_button_solped).click(function(){
	var url = solpedSnap.child("foto").val();
 	window.open(url, '_blank');
});