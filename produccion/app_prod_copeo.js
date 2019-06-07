var id_form_copeo = "formCopeo";
var id_obra_ddl_copeo = "obraDdlCopeo";
var id_proc_ddl_copeo = "procDdlCopeo";
var id_impuestos_copeo = "impuestoCopeo";
var id_impuestos_button_copeo = "buttonImpuestoCopeo";
var id_ayu_copeo = "ayuCopeo";
var id_mof_copeo = "mofCopeo";
var id_ofi_copeo = "ofiCopeo";
var id_enc_copeo = "encCopeo";
var id_sup_copeo = "supCopeo";
var id_class_entrada_copeo = "calcCopeoClass";
var id_dias_copeo = "diasCopeo";
var id_unidades_copeo = "multCopeo";
var id_nombre_copeo = "nombreCopeo";
var id_alcance_copeo = "alcanceCopeo";
var id_entrada_label_copeo = "numEntradaCopeo";
var id_entrada_button_copeo = "buttonAceptarCopeo";
var id_reset_button_copeo = "buttonResetCopeo";
var id_datatable_copeo = "dataTableCopeo";

var id_tab_copeo = "tabCopeo";

var rama_bd_obras = "obras";

var rama_bd_cuadrillas = "produccion/costos_cuadrilla";

var sueldos = {
	ofi: "",
	mof: "",
	ayu: "",
	enc: "",
	sup: "",
}

$('#' + id_tab_copeo).click(function(){
	$('#' + id_form_copeo).trigger('reset');
	$('#' + id_impuestos_button_copeo).attr('disabled',false);
	$('.' + id_class_entrada_copeo).attr('disabled', true);

	firebase.database().ref(rama_bd_cuadrillas).once('value').then(function(snapshot){
		var costos = snapshot.val();
		suedos["ofi"] = isNaN(parseFloat(costos.ofi)) ? 0 : parseFloat(costos.ofi);
		suedos["mof"] = isNaN(parseFloat(costos.mof)) ? 0 : parseFloat(costos.mof);
		suedos["ayu"] = isNaN(parseFloat(costos.ayu)) ? 0 : parseFloat(costos.ayu);
		suedos["enc"] = isNaN(parseFloat(costos.enc)) ? 0 : parseFloat(costos.enc);
		suedos["sup"] = isNaN(parseFloat(costos.sup)) ? 0 : parseFloat(costos.sup);
	});

	var select = document.getElementById(id_obra_ddl_copeo);
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
});

$('#' + id_obra_ddl_copeo).change(function(){
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();

	    var select = document.getElementById(id_proc_ddl_copeo);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);

	    snapshot.child('procesos').forEach(function(childSnap){
	    	var proc = childSnap.val();
	    	if(!proc.terminado){
		    	if(proc.num_subprocesos == 0 && childSnap.key != "ADIC" && childSnap.key != "PC00"){
			    	var option2 = document.createElement('OPTION');
			        option2.text = proc.clave + " (" + proc.nombre + ")";
			        option2.value = proc.clave;
			        select.appendChild(option2);
			    } else {
			    	childSnap.child('subprocesos').forEach(function(subpSnap){
			    		var subp = subpSnap.val();
			    		if(!subp.terminado){
					    	var option2 = document.createElement('OPTION');
					        option2.text = subp.clave + " (" + subp.nombre + ")";
					        option2.value = subp.clave;
					        select.appendChild(option2);
			    		}
			    	});
	    		}
		    }
	    });
    });
});

$('#' + id_proc_ddl_copeo).change(function(){
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
		if(snapshot.child("copeo/impuestos").exists()){
			$('#' + id_impuestos_copeo).val(snapshot.child("copeo/impuestos").val());
			loadDataTableCopeo();
			loadEntradaCopeo();
		} else {
			$('#' + id_datatable_copeo).html('');//aqui checar si jala
			$('#' + id_class_entrada_copeo).attr('disabled', true);
		}
	});
});

$('#' + id_reset_button_copeo).change(function(){
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
		if(snapshot.child("copeo/impuestos").exists()){
			$('#' + id_impuestos_copeo).val(snapshot.child("copeo/impuestos").val());
			loadEntradaCopeo();
		} else {
			$('#' + id_class_entrada_copeo).attr('disabled', true);
		}
	});
});

$('#' + id_impuestos_button_copeo).click(function(){
	if($('#' + id_impuestos_copeo).val() > 0){
		$('#' + id_impuestos_button_copeo).attr('disabled',true);
		$('#' + id_impuestos_copeo).attr('disabled',true);
		loadEntradaCopeo();
	} else {
		alert("El numero debe ser un porcentaje mayor a 0");
	}
});

function loadEntradaCopeo(){
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	$('.' + id_class_entrada_copeo).val('');
	$('.' + id_class_entrada_copeo).attr('disabled', false);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
		var consec = snapshot.child("copeo/num_entradas");
		consec = consec.exists() ? consec.val() : 0;
		$('#' + id_entrada_label_copeo).html("Entrada " + consec);
	});
};

$('#' + id_entrada_button_copeo).click(function(){
	var consec = $('#' + id_entrada_label_copeo).html().split(" ")[1];
	var costo_cuad = sueldos["ofi"] * parseFloat($('#' + id_ofi_copeo).val()) +
		sueldos["mof"] * parseFloat($('#' + id_mof_copeo).val()) +
		sueldos["ayu"] * parseFloat($('#' + id_ayu_copeo).val()) +
		sueldos["enc"] * parseFloat($('#' + id_enc_copeo).val()) +
		sueldos["sup"] * parseFloat($('#' + id_sup_copeo).val());
	var tot = costo_cuad * parseFloat($('#' + id_dias_copeo).val()) * parseFloat($('#' + id_unidades_copeo).val());

	var entrada = {
		nombre: $('#' + id_nombre_copeo).val(),
        alcance: $('#' + id_alcance_copeo).val(),
        pad: pistaDeAuditoria(),
        total: tot,
        cuadrilla: {
           ofi: $('#' + id_ofi_copeo).val(),
           mof: $('#' + id_mof_copeo).val(),
           ayu: $('#' + id_ayu_copeo).val(),
           enc: $('#' + id_enc_copeo).val(),
           sup: $('#' + id_sup_copeo).val(),
       },
        multiplicadores: {
           dias: $('#' + id_dias_copeo).val(),
           unidades: $('#' + id_unidades_copeo).val(),
       },
	};

	var imp = parseFloat($('#' + id_impuestos_copeo).val());
	var total = tot * imp /100;
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;

	sumaEnFirebase(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/total", total);
	sumaEnFirebase(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/subtotal", tot);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/impuestos").set(imp);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/num_entradas").set(consec);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/entradas/" + consec).set(entrada);
	//Agregar variable global existente. Resetearla como false en donde sea necesario, true cuando haces click en el editar del datatable
	/*if(!existente){
		trickleDownKaizen($('#' + id_obra_ddl_copeo + " option:selected").val(), proc, "PRODUCCION/COPEO/PREC", total, true);
	}
	trickleDownKaizen($('#' + id_obra_ddl_copeo + " option:selected").val(), proc, "PRODUCCION/COPEO/COPEO", total, true);*/
});

function loadDataTableCopeo(){

}