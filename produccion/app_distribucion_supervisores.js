//Descomentar firebase AQUI
var id_supervisores_ddl_distribucionSupervisores = "supervisoresDdlDistSuper";
var id_cantidad_pagadora_distribucionSupervisores = "cantidadPagadoraDistSuper";
var id_div_obras_distribucionSupervisores = "divObrasDistSuper";
var id_registrar_button_distribucionSupervisores = "buttonDistSuper";

var tab_distribucionSupervisores = "tabDistSuper";

var rama_bd_obras_magico = "obras";
var rama_bd_colaboradores_prod = "produccion/colaboradores";

$('#' + tab_distribucionSupervisores).click(function(){
  $('#' + id_supervisores_ddl_distribucionSupervisores).empty();
  var select = document.getElementById(id_supervisores_ddl_distribucionSupervisores);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);

  firebase.database().ref(rama_bd_colaboradores_prod).orderByChild('tipo').equalTo("supervisor").on('child_added',function(snapshot){
      var sup = snapshot.val();
      var option2 = document.createElement('option');
      option2.text = sup.nickname;
      option2.value = sup.uid; 
      select.appendChild(option2);
  });  
});

$('#' + id_supervisores_ddl_distribucionSupervisores).change(function(){
	$('#' + id_div_obras_distribucionSupervisores).empty();
	var div = document.getElementById(id_div_obras_distribucionSupervisores);
	firebase.database().ref(rama_bd_colaboradores_prod + "/" + $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.child("obras").forEach(function(childSnap){
			var obra = childSnap.val();
			if(obra.activa){
				var row = document.createElement('div');
				var label = document.createElement('label');
          		label.innerHTML = obra.nombre;
          		var textfield = document.createElement('input');
          		textfield.type = "text";
          		textfield.id = obra.nombre + "_distSuper";
          		row.appendChild(label);
          		row.appendChild(textfield);
          		div.appendChild(row);
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
	    		dist[obra] = parseFloat($(this).val());
	    		var valor = parseFloat($('#' + id_cantidad_pagadora_distribucionSupervisores).val()) * parseFloat($(this).val())/100;
	    		firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
	    			var viejo = parseFloat(snapshot.val());
	    			var nuevo = viejo + valor;
	    			console.log(nuevo);
	    			//firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
	    		});
	    	});
    		var pago = {
    			cantidad: $('#' + id_cantidad_pagadora_distribucionSupervisores).val(),
    			distribucion: dist,
    			pda: pistaDeAuditoria(),
    		}
    		var dia = getWeek(new Date().getTime());
    		firebase.database().ref(rama_bd_colaboradores_prod + "/" + $('#' + id_supervisores_ddl_distribucionSupervisores + " option:selected").val() + "/nomina/" + dia[1] + "/" + dia[0]).set(pago);
	    }
	}
});