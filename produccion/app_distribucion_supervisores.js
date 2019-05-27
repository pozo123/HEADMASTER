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
	$('#' + id_year_ddl_distribucionSupervisores).empty();
	$('#' + id_week_ddl_distribucionSupervisores).empty();
	
	loadSupervisoresDistSup();

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

$('#' + id_year_ddl_distribucionSupervisores).change(function(){
    $('#' + id_week_ddl_distribucionSupervisores).empty();
    var select = document.getElementById(id_week_ddl_distribucionSupervisores);
    var year = $('#' + id_year_ddl_distribucionSupervisores + " option:selected").val();
    if(year < getWeek(new Date().getTime())[1]){
        var ult_sem = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ult_sem;i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    } else {
        for(i=getWeek(new Date().getTime())[0];i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    }
    loadSupervisoresDistSup();
});

$('#' + id_week_ddl_distribucionSupervisores).change(function(){
	loadSupervisoresDistSup();
});

function loadSupervisoresDistSup(){
	$('#' + id_supervisores_ddl_distribucionSupervisores).empty();

	var year = $('#' + id_year_ddl_distribucionSupervisores + " option:selected").val();
	var week = $('#' + id_week_ddl_distribucionSupervisores + " option:selected").val();

	var select3 = document.getElementById(id_supervisores_ddl_distribucionSupervisores);
	var option = document.createElement('option');
	option.style = "display:none";
	option.text = option.value = "";
	select3.appendChild(option);

	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(pnSnap){
		firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
			snapshot.forEach(function(perSnap){
				var sup = perSnap.val();
				if(perSnap.child("areas/produccion").val() && sup.activo && sup.credenciales == 3 && !perSnap.child("areas/administracion").val()){
					var existe = false;
					pnSnap.forEach(function(obraSnap){//Tambien entran totales, pero no hay bronca
						if(obraSnap.child("supervisores/" + perSnap.key).exists()){
							existe = true;
						}
					});
					if(!existe){
						var option2 = document.createElement('option');
						option2.text = sup.nombre;
						option2.value = sup.uid; 
						select3.appendChild(option2);
					}
				}
			});
		});  
	});
}

$('#' + id_supervisores_ddl_distribucionSupervisores).change(function(){
	$('#' + id_div_obras_distribucionSupervisores).empty();
	var div = document.getElementById(id_div_obras_distribucionSupervisores);
	//AQUI revisar si ya hay entrada de este sup en esta obra en esta semana
	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
		var obras = [];
		snapshot.forEach(function(childSnap){
			if(!childSnap.child("terminada").val()){
				childSnap.child("supervisor").forEach(function(supSnap){
					if(supSnap.key == $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val()){
						obras[obras.length] = childSnap.key;
					}
				});
			}
		});
		for(i=0; i<obras.length;i++){
			var row = document.createElement('div');
			row.class = 'row align-items-center';
			var col1 = document.createElement('div');
			col1.className = 'col-lg-3';
			var col2 = document.createElement('div');
			col2.className = 'col-lg-3';
			var label = document.createElement('label');
      		label.innerHTML = obras[i];
      		var textfield = document.createElement('input');
      		textfield.type = "text";
      		textfield.id = obras[i] + "_distSuper";
      		textfield.value = (100 / obras.length).toFixed(2);
      		col1.appendChild(label);
      		col2.appendChild(textfield);
      		row.appendChild(col1);
      		row.appendChild(col2);
      		div.appendChild(row);
      	}
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
	    if(Math.abs(sum - 100) > 0.05){
	    	alert("Los valores deben ser porcentajes y el total debe sumar 100");
	    } else {
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
	    		sumaEnFirebase(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obra + "/total");
	    		sumaEnFirebase(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total");
	    		//console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obra + "/total");
	    		//console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total");
	    		//console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obra + "/supervisores/" + $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val());
	    		//console.log(entrada);
				sumaEnFirebase(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/kaizen/PRODUCCION/COPEO/PAG", valor);
				//console.log(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/kaizen/PRODUCCION/COPEO/PAG");
				//console.log(valor);
	    	});
	    }
	    loadSupervisoresDistSup();
	}
});