//Descomentar firebase AQUI
var id_supervisores_ddl_distribucionSupervisores = "supervisoresDdlDistSuper";
var id_cantidad_pagadora_distribucionSupervisores = "cantidadPagadoraDistSuper";
var id_div_obras_distribucionSupervisores = "divObrasDistSuper";
var id_year_ddl_distribucionSupervisores = "yearDdlDistSuper";
var id_week_ddl_distribucionSupervisores = "weekDdlDistSuper";
var id_registrar_button_distribucionSupervisores = "buttonDistSuper";

var tab_distribucionSupervisores = "tabDistSuper";

var rama_bd_obras_magico = "obras";
var rama_bd_personal = "personal";
var rama_bd_pagos_nomina = "rrhh/pagos_nomina"

$('#' + tab_distribucionSupervisores).click(function(){
	$('#' + id_supervisores_ddl_distribucionSupervisores).empty();
	var select3 = document.getElementById(id_supervisores_ddl_distribucionSupervisores);
	var option = document.createElement('option');
	option.style = "display:none";
	option.text = option.value = "";
	select3.appendChild(option);

	firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
		snapshot.forEach(function(perSnap){
			var sup = perSnap.val();
			if(perSnap.child("areas/produccion").val() && sup.activo){
				var option2 = document.createElement('option');
				option2.text = sup.nickname;
				option2.value = sup.uid; 
				select3.appendChild(option2);
			}
		});
	});  

	var semana_actual = getWeek(new Date().getTime())[0];
	var year_actual = getWeek(new Date().getTime())[1];

	var select = document.getElementById(id_week_ddl_distribucionSupervisores);
	for(i=semana_actual;i>0;i--){
	    var option3 = document.createElement('option');
	    option3.text = option3.value = i;
	    select.appendChild(option3);
	}

	var select2 = document.getElementById(id_year_ddl_distribucionSupervisores);
	for(i=year_actual;i>2017;i--){
	    var option4 = document.createElement('option');
	    option4.text = option4.value = i;
	    select2.appendChild(option4);
	}
});

$('#' + id_supervisores_ddl_distribucionSupervisores).change(function(){
	$('#' + id_div_obras_distribucionSupervisores).empty();
	var div = document.getElementById(id_div_obras_distribucionSupervisores);
	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnap){
			if(!childSnap.child("terminada").val()){
				console.log(childSnap.key);
				var act = false;
				childSnap.child("supervisor").forEach(function(supSnap){
					//console.log(supSnap.key);
					if(supSnap.key == $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val()){
						act = true;
						console.log(childSnap.key)
					}
				});
				var obra = childSnap.val();
				if(act){
					var row = document.createElement('div');
					row.class = 'row align-items-center';
					var col1 = document.createElement('div');
					col1.className = 'col-lg-3';
					var col2 = document.createElement('div');
					col2.className = 'col-lg-3';
					var label = document.createElement('label');
	          		label.innerHTML = obra.nombre;
	          		var textfield = document.createElement('input');
	          		textfield.type = "text";
	          		textfield.id = obra.nombre + "_distSuper";
	          		col1.appendChild(label);
	          		col2.appendChild(textfield);
	          		row.appendChild(col1);
	          		row.appendChild(col2);
	          		div.appendChild(row);
				}
			}
		});
	});
});

$('#' + id_registrar_button_distribucionSupervisores).click(function(){
	if($('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val() == "" || $('#' + id_cantidad_pagadora_distribucionSupervisores).val() == ""){
		alert("Selecciona todos los campos requeridos");
	} else {
		var sum = 0;
	  	$('[id$=_distSuper]').each(function(){
	    	sum += parseFloat($(this).val());
	    });
	    if(sum != 100){
	    	alert("Los valores deben ser porcentajes y el total debe sumar 100");
	    } else {
	    	var dist = {};
	    	$('[id$=_distSuper]').each(function(){
	    		var text_id = this.id.split("_");
	    		text_id = text_id[text_id.length - 1];
	    		var obra = this.id.substring(0,this.id.length - (text_id.length + 1));
	    		var valor = parseFloat($('#' + id_cantidad_pagadora_distribucionSupervisores).val()) * parseFloat($(this).val())/100;
	    		var entrada = {
	    			porcentaje: parseFloat($(this).val()),
	    			cantidad: valor, 
	    		}
	    		var year = $('#' + id_year_ddl_distribucionSupervisores + " option:selected").val();
	    		var week = $('#' + id_week_ddl_distribucionSupervisores + " option:selected").val();
	    		firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obra + "/supervisores/" + $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val()).set(entrada);
	    		dist[obra] = parseFloat($(this).val());
				sumaEnFirebase(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/kaizen/PRODUCCION/COPEO/PAG", valor);
	    	});
    		//var pago = {
    		//	cantidad: $('#' + id_cantidad_pagadora_distribucionSupervisores).val(),
    		//	distribucion: dist,
    		//	pda: pistaDeAuditoria(),
    		//}
    		//var dia = getWeek(new Date().getTime());
    		//firebase.database().ref(rama_bd_colaboradores_prod + "/" + $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val() + "/nomina/" + dia[1] + "/" + dia[0]).set(pago);
	    }
	}
});