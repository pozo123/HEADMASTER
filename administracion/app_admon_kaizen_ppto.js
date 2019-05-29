var id_obra_ddl_kaizen_ppto = "obraDdlKaizenPpto";
var id_proceso_ddl_kaizen_ppto = "procDdlKaizenPpto";

var id_costo_score_kaizen_ppto = "costoHoraScoreKaizenPpto";
var id_porcentaje_indirecto_kaizen_ppto = "indirectosKaizenPpto";
var id_anticipo_kaizen_ppto = "anticipoKaizenPpto";
var id_estimaciones_kaizen_ppto = "estimacionesKaizenPpto";

var id_proyectos_kaizen_ppto = "proyectosKaizenPpto";
var id_suministros_kaizen_ppto = "suministrosKaizenPpto";
var id_copeo_kaizen_ppto = "copeoKaizenPpto";

var id_precio_venta_kaizen_ppto = "precioVentaKaizenPpto";

var id_profit_cantidad_kaizen_ppto = "profitCantidadKaizenPpto";
var id_profit_porcentaje_kaizen_ppto = "profitPorcentajeKaizenPpto";
var id_profit_neto_kaizen_ppto = "labelProfitNetoKaizenPpto";

var id_button_load_kaizen_ppto = "loadButtonKaizenPpto";
var id_button_guardar_kaizen_ppto = "guardarButtonKaizenPpto";

var tab_kaizen_ppto = "tabKaizenPpto";

var rama_bd_personal = "personal";
var rama_bd_obras = "obras";

var kaiz_ppto = {};

$('#' + tab_kaizen_ppto).click(function(){
	$('#' + id_obra_ddl_kaizen_ppto).empty();
    var select = document.getElementById(id_obra_ddl_kaizen_ppto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

	var aut = (areas_usuario_global.administracion || creden_usuario_globalfalse < 3);

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnap){
        	var obra = childSnap.val();
        	var aut_local = false;
        	if(!obra.terminada){
	        	if(!aut){
	        		childSnap.child("supervisor").forEach(function(supSnap){
	        			if(supSnap.key == uid_usuario_global && supSnap.child("activo").val()){
	        				aut_local = true;
	        			}
	        		});
	        	}
	        	if(aut || aut_local){
			        var option2 = document.createElement('OPTION');
			        option2.text = obra.nombre;
			        option2.value = obra.nombre;
			        select.appendChild(option2);
			    }
        	}
        });
    });
});

function resetKaizPpto(){
	kaiz_ppto = {
		proy: 0,
		sum: 0,
		cop:0,
		ant: 0,
		est: 0,
	}
}

$("#" + id_obra_ddl_kaizen_ppto).change(function(){
	$('#' + id_proceso_ddl_kaizen_ppto).empty();
    var select = document.getElementById(id_proceso_ddl_kaizen_ppto);
    var option = document.createElement('option');
    option.text = option.value = "Global";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() +"/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
        	if(procSnap.key != "PC00" && procSnap.key != "ADIC" && procSnap.child("num_subprocesos").val() == 0){
		        var option2 = document.createElement('OPTION');
		        option2.text = option2.value = procSnap.key;
		        select.appendChild(option2);
        	} else {
        		procSnap.child("subprocesos").forEach(function(subpSnap){
			        var option2 = document.createElement('OPTION');
			        option2.text = option2.value = subpSnap.key;
			        select.appendChild(option2);
        		});
        	}
        });
		refreshKaizenPpto();
    });
});

$("#" + id_proceso_ddl_kaizen_ppto).change(function(){
	refreshKaizenPpto();
});

function refreshKaizenPpto(){
	if($("#" + id_proceso_ddl_kaizen_ppto + " option:selected").val() == "Global"){
		$('#' + id_button_guardar_kaizen_ppto).addClass('hidden');
		loadValuesKaizenPpto(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val());
	} else {
		$('#' + id_button_guardar_kaizen_ppto).removeClass('hidden');
		var proc = $('#' + id_proceso_ddl_kaizen_ppto + " option:selected").val();
		var query = proc.split("-").length > 1 ? proc.split('-')[0] + "/subprocesos/" + proc : proc;
		loadValuesKaizenPpto(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() + "/procesos/" + query);
	}
};

function loadValuesKaizenPpto(query){
	resetKaizPpto();
    firebase.database().ref(query).once('value').then(function(kaizSnap){
		var kaiz = kaizSnap.val();
		var costos_suministros = kaizSnap.child("kaizen/PRODUCCION/SUMINISTROS/OdeC").val();
		if(costos_suministros == 0)
			costos_suministros = kaiz.kaizen.PRODUCCION.SUMINISTROS.CUANT;
		var costos_copeo = kaiz.kaizen.PRODUCCION.COPEO.COPEO;
		if(costos_copeo == 0)
			costos_copeo = kaiz.kaizen.PRODUCCION.COPEO.PREC;
		var costos_proyectos = kaiz.kaizen.PROYECTOS.PPTO;
		var costos = costos_proyectos + costos_copeo + costos_suministros;
		$('#' + id_suministros_kaizen_ppto).val(formatMoney(costos_suministros));
		$('#' + id_copeo_kaizen_ppto).val(formatMoney(costos_copeo));
		$('#' + id_proyectos_kaizen_ppto).val(formatMoney(costos_proyectos));

		var precio = kaiz.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO + kaiz.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
		$('#' + id_precio_venta_kaizen_ppto).val(formatMoney(precio));
		var prof = $('#' + id_proceso_ddl_kaizen_ppto + " option:selected").val() == "Global" ? kaizSnap.child("kaizen/PROFIT/PROG/BRUTO").val() : formatMoney(precio*(1-parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100)-costos);
		$('#' + id_profit_cantidad_kaizen_ppto).val();
		$('#' + id_profit_porcentaje_kaizen_ppto).val((100*deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())/(precio*parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100 + costos)).toFixed(2));
	
		kaiz_ppto.proy = costos_proyectos;
		kaiz_ppto.sum = costos_suministros;
		kaiz_ppto.cop = costos_copeo;
		kaiz_ppto.ant = parseFloat(kaizSnap.child("kaizen/ADMINISTRACION/ANTICIPOS/PPTO").val());
		kaiz_ppto.est = parseFloat(kaizSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/PPTO").val());

		var porc_ant = 100 * kaiz_ppto.ant / (kaiz_ppto.ant + kaiz_ppto.est);
		porc_ant = isNaN(porc_ant) ? 50 : porc_ant;
		var porc_est = 100 - porc_ant;
		$('#' + id_anticipo_kaizen_ppto).val(porc_ant.toFixed(2));
		$('#' + id_estimaciones_kaizen_ppto).val(porc_est.toFixed(2));

		loadProfitsKaizenPpto();
    });
};

$("#" + id_porcentaje_indirecto_kaizen_ppto).focusout(function(){
	if($("#" + id_porcentaje_indirecto_kaizen_ppto).val() < 0 || $("#" + id_porcentaje_indirecto_kaizen_ppto).val() > 100){
		$("#" + id_porcentaje_indirecto_kaizen_ppto).val(20);
		alert("El porcentaje de indirectos debe ser un valor mayor a 0 y menor a 100");
	}
});

$('#' + id_button_load_kaizen_ppto).click(function(){
	refreshKaizenPpto();
});

function loadProfitsKaizenPpto(){
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	var precio = deformatMoney($('#' + id_precio_venta_kaizen_ppto).val());

	$('#' + id_profit_cantidad_kaizen_ppto).val(formatMoney(precio*(1-parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100)-costos));
	$('#' + id_profit_porcentaje_kaizen_ppto).val((100*deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())/(parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())*precio/100 + costos)).toFixed(2));
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())*0.6));
	highLight(id_profit_porcentaje_kaizen_ppto);
	highLight(id_profit_cantidad_kaizen_ppto);
}

$("#" + id_copeo_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_suministros_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_proyectos_kaizen_ppto).change(function(){
	loadProfitsKaizenPpto();
});

$("#" + id_precio_venta_kaizen_ppto).change(function(){
	$("#" + id_precio_venta_kaizen_ppto).val(formatMoney(eval($("#" + id_precio_venta_kaizen_ppto).val())));
	loadProfitsKaizenPpto();
});

$("#" + id_profit_porcentaje_kaizen_ppto).change(function(){
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	$('#' + id_precio_venta_kaizen_ppto).val(formatMoney((costos * (1 + parseFloat($("#" + id_profit_porcentaje_kaizen_ppto).val())/100))/(1 - (parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100) * (1 + parseFloat($("#" + id_profit_porcentaje_kaizen_ppto).val())/100))));
	$('#' + id_profit_cantidad_kaizen_ppto).val(formatMoney(deformatMoney($('#' + id_precio_venta_kaizen_ppto).val())*(1 - parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100) - costos));
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())*0.6));
	highLight(id_precio_venta_kaizen_ppto);
	highLight(id_profit_cantidad_kaizen_ppto);
});

$("#" + id_profit_cantidad_kaizen_ppto).change(function(){
	$("#" + id_profit_cantidad_kaizen_ppto).val(formatMoney(eval($("#" + id_profit_cantidad_kaizen_ppto).val())));
	var costos = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) + deformatMoney($('#' + id_copeo_kaizen_ppto).val()) + deformatMoney($('#' + id_suministros_kaizen_ppto).val());
	$('#' + id_precio_venta_kaizen_ppto).val(formatMoney((deformatMoney($("#" + id_profit_cantidad_kaizen_ppto).val()) + costos)/(1-parseFloat($('#' + id_porcentaje_indirecto_kaizen_ppto).val())/100)));
	$('#' + id_profit_porcentaje_kaizen_ppto).val((100*deformatMoney($("#" + id_profit_cantidad_kaizen_ppto).val())/(deformatMoney($('#' + id_precio_venta_kaizen_ppto).val()) - deformatMoney($("#" + id_profit_cantidad_kaizen_ppto).val()))).toFixed(2));
	$('#' + id_profit_neto_kaizen_ppto).text("Profit Neto: " + formatMoney(deformatMoney($('#' + id_profit_cantidad_kaizen_ppto).val())*0.6));
	highLight(id_precio_venta_kaizen_ppto);
	highLight(id_profit_porcentaje_kaizen_ppto);
});


$("#" + id_suministros_kaizen_ppto).focus(function(){
	if($("#" + id_suministros_kaizen_ppto).val() == ""){
		$("#" + id_suministros_kaizen_ppto).val(0);
	} else {
		$("#" + id_suministros_kaizen_ppto).val(deformatMoney($("#" + id_suministros_kaizen_ppto).val()) == 0 ? "" : deformatMoney($("#" + id_suministros_kaizen_ppto).val()));
	}
});

$("#" + id_suministros_kaizen_ppto).focusout(function(){
	$("#" + id_suministros_kaizen_ppto).val(formatMoney(eval($("#" + id_suministros_kaizen_ppto).val())));
});

$("#" + id_copeo_kaizen_ppto).focus(function(){
	if($("#" + id_copeo_kaizen_ppto).val() == ""){
		$("#" + id_copeo_kaizen_ppto).val(0);
	} else {
		$("#" + id_copeo_kaizen_ppto).val(deformatMoney($("#" + id_copeo_kaizen_ppto).val()) == 0 ? "" : deformatMoney($("#" + id_copeo_kaizen_ppto).val()));
	}
});

$("#" + id_copeo_kaizen_ppto).focusout(function(){
	$("#" + id_copeo_kaizen_ppto).val(formatMoney(eval($("#" + id_copeo_kaizen_ppto).val())));
});

$("#" + id_proyectos_kaizen_ppto).focus(function(){
    if(!isNaN(parseFloat(deformatMoney($("#" + id_proyectos_kaizen_ppto).val())))){
    	var horas = parseFloat(deformatMoney($("#" + id_proyectos_kaizen_ppto).val())) / parseFloat($("#" + id_costo_score_kaizen_ppto).val());
        $("#" + id_proyectos_kaizen_ppto).val(horas == 0 ? "" : horas);
    }
});

$("#" + id_proyectos_kaizen_ppto).focusout(function(){
    if($("#" + id_proyectos_kaizen_ppto).val() != ""){
        $("#" + id_proyectos_kaizen_ppto).val(formatMoney(parseFloat(eval($("#" + id_proyectos_kaizen_ppto).val())) * parseFloat($("#" + id_costo_score_kaizen_ppto).val())));
    } else {
    	$('#' + id_proyectos_kaizen_ppto).val(formatMoney(0));
    }
});

$('#' + id_anticipo_kaizen_ppto).change(function(){
	if($(this).val() < 0 || $(this).val() > 100){
		alert("El valor debe ser mayor o igual a 0 y menor o igual a 100");
		$(this).val(50);
		$('#' + id_estimaciones_kaizen_ppto).val(50);
	} else {
		$('#' + id_estimaciones_kaizen_ppto).val(100 - parseFloat($(this).val()));
	}

});

$('#' + id_estimaciones_kaizen_ppto).change(function(){
	if($(this).val() < 0 || $(this).val() > 100){
		alert("El valor debe ser mayor o igual a 0 y menor o igual a 100");
		$(this).val(50);
		$('#' + id_anticipo_kaizen_ppto).val(50);
	} else {
		$('#' + id_anticipo_kaizen_ppto).val(100 - parseFloat($(this).val()));
	}

});

$('#' + id_button_guardar_kaizen_ppto).click(function(){
	var proc = $('#' + id_proceso_ddl_kaizen_ppto + " option:selected").val();
	if($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() == "" || proc == ""){
		alert("Selecciona todos los campos deseados");
	} else {
		var split = proc.split("-");
		var query = "procesos/" + split[0];
		if(split.length > 1){
			query = query + "/subprocesos/" + proc;
		}
		var horas_score = deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) / parseFloat($('#' + id_costo_score_kaizen_ppto).val());
		var tru = true;
		firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() + "/" + query + "/SCORE/total_prog").set(horas_score);
		firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_kaizen_ppto + " option:selected").val() + "/" + query + "/SCORE/programado").set(tru);
		var difs = {
			proy: deformatMoney($('#' + id_proyectos_kaizen_ppto).val()) - parseFloat(kaiz_ppto.proy),
			sum: deformatMoney($('#' + id_suministros_kaizen_ppto).val()) - parseFloat(kaiz_ppto.sum),
			cop: deformatMoney($('#' + id_copeo_kaizen_ppto).val()) - parseFloat(kaiz_ppto.cop),
			ant: deformatMoney($('#' + id_precio_venta_kaizen_ppto).val()) * parseFloat($('#' + id_anticipo_kaizen_ppto).val())/100 - parseFloat(kaiz_ppto.ant),//AQUI define como balancear
			est: deformatMoney($('#' + id_precio_venta_kaizen_ppto).val()) * parseFloat($('#' + id_estimaciones_kaizen_ppto).val())/100 - parseFloat(kaiz_ppto.est),//AQUI define como balancear
		}
		trickleDownKaizen($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val(), proc, "PROYECTOS/PPTO", difs.proy, false);
		trickleDownKaizen($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val(), proc, "PRODUCCION/SUMINISTROS/CUANT", difs.sum, false);
		trickleDownKaizen($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val(), proc, "PRODUCCION/COPEO/PREC", difs.cop, false);
		trickleDownKaizen($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val(), proc, "ADMINISTRACION/ANTICIPOS/PPTO", difs.ant, true);
		trickleDownKaizen($('#' + id_obra_ddl_kaizen_ppto + " option:selected").val(), proc, "ADMINISTRACION/ESTIMACIONES/PPTO", difs.est, false);
		alert("Actualización exitosa");
	}
});