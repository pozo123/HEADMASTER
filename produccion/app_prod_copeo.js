var id_form_copeo = "formCopeo";
var id_form_ddl_copeo = "formDdlsCopeo";
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
var existente = false;
var tot_anterior = 0;

$('#' + id_tab_copeo).click(function(){
	$('#' + id_form_copeo).trigger('reset');
	$('#' + id_form_ddl_copeo).trigger('reset');
	$('#' + id_impuestos_button_copeo).attr('disabled',false);
	$('.' + id_class_entrada_copeo).attr('disabled', true);

	firebase.database().ref(rama_bd_cuadrillas).once('value').then(function(snapshot){
		var costos = snapshot.val();
		sueldos["ofi"] = isNaN(parseFloat(costos.ofi)) ? 0 : parseFloat(costos.ofi);
		sueldos["mof"] = isNaN(parseFloat(costos.mof)) ? 0 : parseFloat(costos.mof);
		sueldos["ayu"] = isNaN(parseFloat(costos.ayu)) ? 0 : parseFloat(costos.ayu);
		sueldos["enc"] = isNaN(parseFloat(costos.enc)) ? 0 : parseFloat(costos.enc);
		sueldos["sup"] = isNaN(parseFloat(costos.sup)) ? 0 : parseFloat(costos.sup);
	});

	var select = document.getElementById(id_obra_ddl_copeo);
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

$('#' + id_obra_ddl_copeo).change(function(){
	$('#' + id_proc_ddl_copeo).empty();

	var select = document.getElementById(id_proc_ddl_copeo);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

	for(key in nombre_obras[$('#' + id_obra_ddl_copeo + " option:selected").val()]["hojas"]){
    	var option2 = document.createElement('OPTION');
        option2.text = key + " (" + nombre_obras[$('#' + id_obra_ddl_copeo + " option:selected").val()]["hojas"][key].nombre + ")";
        option2.value = key;
        select.appendChild(option2);
    }
});

$('#' + id_proc_ddl_copeo).change(function(){
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
		if(snapshot.child("copeo/impuestos").exists()){
			$('#' + id_impuestos_copeo).attr('disabled',true);
			$('#' + id_impuestos_button_copeo).attr('disabled',true);
			$('#' + id_impuestos_copeo).val(snapshot.child("copeo/impuestos").val());
			loadDataTableCopeo();
			loadEntradaCopeo();
		} else {
			console.log("no hay");
			$('#' + id_impuestos_button_copeo).attr('disabled',false);
			$('#' + id_impuestos_copeo).attr('disabled',false);
			$('.' + id_class_entrada_copeo).attr('disabled', true);
			$('#' + id_datatable_copeo).html('');//aqui checar si jala
		}
	});
});

$('#' + id_reset_button_copeo).click(function(){
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
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
	existente = false;
	tot_anterior = 0;
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	$('.' + id_class_entrada_copeo).val('');
	$('.' + id_class_entrada_copeo).attr('disabled', false);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
		var consec = snapshot.child("copeo/num_entradas");
		consec = consec.exists() ? consec.val() : 0;
		consec++;
		console.log(consec);
		$('#' + id_entrada_label_copeo).html("Entrada " + consec);
	});
};

$('#' + id_entrada_button_copeo).click(function(){
	var consec = $('#' + id_entrada_label_copeo).html().split(" ")[1];
	var cant_ofi = isNaN(parseFloat($('#' + id_ofi_copeo).val())) ? 0 : parseFloat($('#' + id_ofi_copeo).val());
	var cant_mof = isNaN(parseFloat($('#' + id_mof_copeo).val())) ? 0 : parseFloat($('#' + id_mof_copeo).val());
	var cant_ayu = isNaN(parseFloat($('#' + id_ayu_copeo).val())) ? 0 : parseFloat($('#' + id_ayu_copeo).val());
	var cant_enc = isNaN(parseFloat($('#' + id_enc_copeo).val())) ? 0 : parseFloat($('#' + id_enc_copeo).val());
	var cant_sup = isNaN(parseFloat($('#' + id_sup_copeo).val())) ? 0 : parseFloat($('#' + id_sup_copeo).val());
	var costo_cuad = sueldos["ofi"] * cant_ofi + sueldos["mof"] * cant_mof + sueldos["ayu"] * cant_ayu + sueldos["enc"] * cant_enc + sueldos["sup"] * cant_sup;
	var tot = costo_cuad * parseFloat($('#' + id_dias_copeo).val()) * parseFloat($('#' + id_unidades_copeo).val());

	var entrada = {
		nombre: $('#' + id_nombre_copeo).val(),
        alcance: $('#' + id_alcance_copeo).val(),
        pad: pistaDeAuditoria(),
        total: tot,
        cuadrilla: {
           ofi: cant_ofi,
           mof: cant_mof,
           ayu: cant_ayu,
           enc: cant_enc,
           sup: cant_sup,
       },
        multiplicadores: {
           dias: $('#' + id_dias_copeo).val(),
           unidades: $('#' + id_unidades_copeo).val(),
       },
	};

	var imp = parseFloat($('#' + id_impuestos_copeo).val());
	tot = existente ? tot - tot_anterior : tot;
	var total = tot * (1 + imp / 100);
	//total = existente ? total - tot_anterior * (1 + imp/100) : total;
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
	sumaEnFirebase(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/total", total);
	sumaEnFirebase(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/subtotal", tot);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/impuestos").set(imp);
	if(!existente){
		firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/num_entradas").set(consec);
	}
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query + "/copeo/entradas/" + consec).set(entrada);
	//Agregar variable global existente. Resetearla como false en donde sea necesario, true cuando haces click en el editar del datatable
	if(!existente){
		trickleDownKaizen($('#' + id_obra_ddl_copeo + " option:selected").val(), proc, "PRODUCCION/COPEO/PREC", total, true);
	}
	trickleDownKaizen($('#' + id_obra_ddl_copeo + " option:selected").val(), proc, "PRODUCCION/COPEO/COPEO", total, true);
	alert("Entrada registrada");
	loadDataTableCopeo();
	loadEntradaCopeo();
});

function loadDataTableCopeo(){
	var datos_copeo = [];
	var proc = $('#' + id_proc_ddl_copeo + " option:selected").val();
	var query = proc.split("-").length > 1 ? proc.split("-")[0] + "/subprocesos/" + proc : proc;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_copeo + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){
    	snapshot.child("copeo/entradas").forEach(function(childSnap){
    		var entrada = childSnap.val();
            datos_copeo.push([
            	childSnap.key,
            	entrada.nombre,
            	entrada.alcance,
            	entrada.cuadrilla.ofi,
            	entrada.cuadrilla.mof,
            	entrada.cuadrilla.ayu,
            	entrada.cuadrilla.enc,
            	entrada.cuadrilla.sup,
            	entrada.multiplicadores.dias,
            	entrada.multiplicadores.unidades,
            	formatMoney(entrada.total),
            	formatMoney(parseFloat(entrada.total) * (1 + parseFloat(snapshot.child("copeo/impuestos").val())/100)),
            	"<button type='button' class='editar btn btn-info' onclick='loadExistenteCopeo()'><i class='fas fa-edit'></i></button>",
            	"<button type='button' class='btn btn-warning' onclick='alert(\"" + entrada.alcance + "\")'><i class='fas fa-info-circle'></i></button>",
            ]);
    	});

        tabla_copeo = $('#'+ id_datatable_copeo).DataTable({
            destroy: true,
            data: datos_copeo,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Entrada"},
                {title: "Nombre"},
                {title: "Alcance"},
                {title: "#Of"},
                {title: "#MO"},
                {title: "#AYU"},
                {title: "#ENC"},
                {title: "#SUP"},
                {title: "Días"},
                {title: "Mult"},
                {title: "Subtotal"},
                {title: "Total"},
                {title: "Editar"},
                {title: "Info"},
            ],
            "columnDefs": [ 
            	{ "visible": false, "targets": [2] },
        	],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
        loadExistenteCopeo("#" + id_datatable_copeo + " tbody", tabla_copeo);
    });
}

function loadExistenteCopeo(tbody, table){
	$(tbody).on("click", "button.editar",function(){
        var data = table.row($(this).parents("tr")).data();
        if(data){
			console.log(data[1]);
			console.log(data);
			existente = true;
			tot_anterior = data[10];
			$('#' + id_entrada_label_copeo).html("Entrada " + data[0]);
			$('#' + id_nombre_copeo).val(data[1]);
			$('#' + id_alcance_copeo).val(data[2]);
			$('#' + id_ofi_copeo).val(data[3]);
			$('#' + id_mof_copeo).val(data[4]);
			$('#' + id_ayu_copeo).val(data[5]);
			$('#' + id_enc_copeo).val(data[6]);
			$('#' + id_sup_copeo).val(data[7]);
			$('#' + id_dias_copeo).val(data[8]);
			$('#' + id_unidades_copeo).val(data[9]);
		}
	});
}