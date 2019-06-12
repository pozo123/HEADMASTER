var id_obra_ddl_pago_kaizen = "obraDdlPagoKaizen";
var id_group_proc_pago_kaizen = "procGroupPagoKaizen"
var id_proc_ddl_pago_kaizen = "procDdlPagoKaizen";
var id_group_subp_pago_kaizen = "subpGroupPagoKaizen"
var id_subp_ddl_pago_kaizen = "subpDdlPagoKaizen";
var id_monto_pago_kaizen = "montoPagoKaizen";
var id_folio_pago_kaizen = "folioPagoKaizen";
var id_tipo_pago_rb_recibo_pago_kaizen = "tipoReciboRBPagoKaizen";//familia tipo_pago
var id_tipo_pago_rb_factura_pago_kaizen = "tipoFacturaRBPagoKaizen";//familia tipo_pago
var id_formato_rb_est_pago_kaizen = "formatoEstRBPagoKaizen";//familia formato
var id_formato_rb_ant_pago_kaizen = "formatoAntRBPagoKaizen";//familia formato
var id_fecha_pago_kaizen = "fechaPagoKaizen";
var id_file_pago_kaizen = "filePagoKaizen";
var id_file_label_pago_kaizen = "fileLabelPagoKaizen";

var id_guardar_button_pago_kaizen = "guardarButtonPagoKaizen";

var tab_pago_kaizen = "tabPagoKaizen";

var rama_bd_flujos = "administracion/flujos";
var rama_bd_obras_magico = "obras";
var rama_storage_obras = "obras";

var caso;
var fileSelected;

$('#' + tab_pago_kaizen).click(function(){
	$('#' + id_obra_ddl_pago_kaizen).empty();
    $('#' + id_proc_ddl_pago_kaizen).empty();
    $('#' + id_subp_ddl_pago_kaizen).empty();
    $('#' + id_group_proc_pago_kaizen).addClass('hidden');
    $('#' + id_group_subp_pago_kaizen).addClass('hidden');

	jQuery('#' + id_fecha_pago_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );

    var select = document.getElementById(id_obra_ddl_pago_kaizen);
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
    }
});

$("#" + id_obra_ddl_pago_kaizen).change(function(){
    $('#' + id_proc_ddl_pago_kaizen).empty();
    $('#' + id_subp_ddl_pago_kaizen).empty();
    $('#' + id_group_subp_pago_kaizen).addClass('hidden');
    if(nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()].num_procesos == 0){
    	caso = "obra";
    } else {
    	$('#' + id_group_proc_pago_kaizen).removeClass('hidden');
    	var select = document.getElementById(id_proc_ddl_pago_kaizen);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
	    for(key in nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()]["procesos"]){
	    	var option2 = document.createElement('OPTION');
	        option2.text = key + " (" + nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()]["procesos"][key].nombre + ")";
	        option2.value = key;
	        select.appendChild(option2);
	    }
	}
});

$('#' + id_file_pago_kaizen).on("change", function(event){
    fileSelected = event.target.files[0];
    $('#' + id_file_label_pago_kaizen).text(fileSelected.name);
});

$("#" + id_proc_ddl_pago_kaizen).change(function(){
    $('#' + id_subp_ddl_pago_kaizen).empty();
    if(nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()]["procesos"][$('#' + id_proc_ddl_pago_kaizen + " option:selected").val()].num_subprocesos == 0){
    	$('#' + id_group_subp_pago_kaizen).addClass('hidden');
	    caso = "proc";
    } else {
    	$('#' + id_group_subp_pago_kaizen).removeClass('hidden');
    	caso = "subp";

	    var select = document.getElementById(id_subp_ddl_pago_kaizen);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);

	    for(key in nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()]["procesos"][$('#' + id_proc_ddl_pago_kaizen + " option:selected").val()]["subprocesos"]){
	    	var option2 = document.createElement('OPTION');
	        option2.text = key + " (" + nombre_obras[$('#' + id_obra_ddl_pago_kaizen + " option:selected").val()]["procesos"][$('#' + id_proc_ddl_pago_kaizen + " option:selected").val()]["subprocesos"][key].nombre + ")";
	        option2.value = key;
	        select.appendChild(option2);
	    };
    }
});

$('#' + id_guardar_button_pago_kaizen).click(function(){
	var rb_form_est = document.getElementById(id_formato_rb_est_pago_kaizen).checked == true;
	var rb_form_ant = document.getElementById(id_formato_rb_ant_pago_kaizen).checked == true;
	var rb_tipo_rec = document.getElementById(id_tipo_pago_rb_recibo_pago_kaizen).checked == true;
	var rb_tipo_fac = document.getElementById(id_tipo_pago_rb_factura_pago_kaizen).checked == true;
	if((!rb_form_ant && !rb_form_est) || (!rb_tipo_fac && !rb_tipo_rec) || $('#' + id_monto_pago_kaizen).val() == "" || $('#' + id_fecha_pago_kaizen).val() == "" || $('#' + id_obra_ddl_pago_kaizen + " option:selected").val() == "" || (caso == "proc" && $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() == "") || (caso == "subp" && $('#' + id_subp_ddl_pago_kaizen + " option:selected").val() == "")){
		alert("Llena todos los campos necesarios");
	} else {
		//AQUI query
		if(fileSelected != ""){
			var query_storage = $('#' + id_obra_ddl_pago_kaizen + " option:selected").val();
			query_storage = caso != "obra" ? query_storage + "/procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() : query_storage;
			query_storage = caso == "subp" ? query_storage + "/subprocesos/" + $('#' + id_subp_ddl_pago_kaizen + " option:selected").val() : query_storage;
			var storageRef = firebase.storage().ref(rama_storage_obras + "/" + query_storage + "/pagos/" + fileSelected.name);
		    var uploadTask = storageRef.put(fileSelected);
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
		        	realizarPago(downloadURL);
		        });
		    });
		} else {
			realizarPago("");
		}
	}
});

function realizarPago(downloadURL){
	console.log('File available at', downloadURL);
	var monto = parseFloat($('#' + id_monto_pago_kaizen).val());
	var form = rb_form_ant ? "anticipo" : "estimacion";
	var formKaizen = rb_form_ant ? "ANTICIPOS" : "ESTIMACIONES";
	var tipo = rb_tipo_rec ? "recibo" : "factura";
	var pago = {
		fecha_pago: new Date($('#' + id_fecha_pago_kaizen).val()).getTime(),
		fecha_registro: new Date().getTime(),
		folio: $('#' + id_folio_pago_kaizen).val(),
		formato: form,
		monto: monto,
		pad: pistaDeAuditoria(),
		tipo_pago: tipo,
		file: downloadURL,
	}
	var query = $('#' + id_obra_ddl_pago_kaizen + " option:selected").val();
	firebase.database().ref(rama_bd_flujos + "/" + query).once('value').then(function(snapshot){
		/*var nuevo_total_obra = monto;
		if(snapshot.child("total").exists()){
			nuevo_total_obra += snapshot.child("total").val();
		}
		firebase.database().ref(rama_bd_flujos + "/" + query + "/total").set(nuevo_total_obra);
		sumaPagoKaizenAdmon(query,nuevo_total_obra,formKaizen);*/
		sumaPagoKaizenAdmon(query,monto,formKaizen);
		if(caso != "obra"){
			query = query + "/procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val();
			/*var nuevo_total_proc = monto;
			if(snapshot.child("procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() + "/total").exists()){
				nuevo_total_proc += snapshot.child("procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() + "/total").val();
			}
			firebase.database().ref(rama_bd_flujos + "/" + query + "/total").set(nuevo_total_proc);
			sumaPagoKaizenAdmon(query,nuevo_total_proc,formKaizen);*/
			sumaPagoKaizenAdmon(query,monto,formKaizen);
			if(caso == "subp"){
				query = query + "/subprocesos/" + $('#' + id_subp_ddl_pago_kaizen + " option:selected").val();
				/*var nuevo_total_subp = monto;
				if(snapshot.child("procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_pago_kaizen + " option:selected").val() + "/total").exists()){
					nuevo_total_subp += snapshot.child("procesos/" + $('#' + id_proc_ddl_pago_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_pago_kaizen + " option:selected").val() + "/total").val();
				}
				firebase.database().ref(rama_bd_flujos + "/" + query + "/total").set(nuevo_total_subp);
				sumaPagoKaizenAdmon(query,nuevo_total_subp,formKaizen);*/
				sumaPagoKaizenAdmon(query,monto,formKaizen);
			}
		}
		query = query + "/ingresos";
		firebase.database().ref(rama_bd_flujos + "/" + query).push(pago);
		alert("Pago registrado con éxito");
	});
}

function sumaPagoKaizenAdmon(query,monto,formKaizen){
	sumaEnFirebase(rama_bd_flujos + "/" + query + "/total", monto);
	sumaEnFirebase(rama_bd_obras_magico + "/" + query + "/kaizen/ADMINISTRACION/" + formKaizen + "/PAG", monto);
	//firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/ADMINISTRACION/" + formKaizen + "/PAG").set(monto);
}