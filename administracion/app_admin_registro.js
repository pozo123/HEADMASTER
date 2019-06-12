var id_entrada_button_registroAdmin = "entradaButtonRegistroAdmin";
var id_salida_button_registroAdmin = "salidaButtonRegistroAdmin";
var id_familia_ddl_registroAdmin = "familiaDdlRegistroAdmin";
var id_subfamilia_ddl_registroAdmin = "subfamiliaDdlRegistroAdmin";
var id_actividad_ddl_registroAdmin = "actividadDdlRegistroAdmin";
var id_actividad_otros_registroAdmin = "actividadOtrosRegistroAdmin";
var id_status_obra_ddl_registroAdmin = "statusObraDdlRegistroAdmin";

var id_group_status_obra_registroAdmin = "statusObraGroupRegistroAdmin";
var id_group_entrada_registroAdmin = "entradaGroupRegistroAdmin";
var id_group_otros_registroAdmin = "otrosGroupRegistroAdmin";
var id_group_actividad_registroAdmin = "actividadGroupRegistroAdmin";

var rama_bd_familias_registros_admin = "administracion/investime/familias";
var rama_bd_registros_registros_admin = "administracion/investime/registros";
var rama_bd_obras_magico = "obras";
var rama_bd_personal = "personal";

var familias;

//DESCOMENTAR el remove hidden en app_principal

$(document).ready(function(){
	setTimeout(() => {
		modoRegistrosAdmin();
    }, 1000);
    $('#' + id_familia_ddl_registroAdmin).empty();
    $('#' + id_subfamilia_ddl_registroAdmin).empty();
    var select = document.getElementById(id_familia_ddl_registroAdmin);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_familias_registros_admin).once('value').then(function(snapshot){
    	familias = snapshot;
    	snapshot.forEach(function(childSnap){
			var familia = childSnap.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = familia; 
            select.appendChild(option2);
    	});
    });
});

function modoRegistrosAdmin(){
    firebase.database().ref(rama_bd_personal).orderByKey().equalTo(uid_usuario_global).on('child_added', function(snapshot){
        if(snapshot.child("status").val() == true){
            firebase.database().ref(rama_bd_registros_registros_admin).orderByKey().limitToLast(1).once('child_added').then(function(snapshot){
                snapshot.forEach(function(weekSnap){
                    weekSnap.forEach(function(regSnap){
                        if(regSnap.val().activo == true){
                            var reg = regSnap.val();
                            $('#id_label_familia_reg_investime').removeClass('hidden');
                            $('#id_label_subfamilia_reg_investime').removeClass('hidden');
                            $('#id_label_actividad_reg_investime').removeClass('hidden');

                            $('#id_label_familia_reg_investime').text(reg.familia);
                            $('#id_label_subfamilia_reg_investime').text(reg.subfamilia);
                            $('#id_label_actividad_reg_investime').text(reg.actividad);
                        }
                    });
                });
            });
			$('#' + id_group_entrada_registroAdmin).addClass("hidden");
			$('#' + id_salida_button_registroAdmin).removeClass("hidden");
        } else {
            $('#id_label_familia_reg_investime').addClass('hidden');
            $('#id_label_subfamilia_reg_investime').addClass('hidden');
            $('#id_label_actividad_reg_investime').addClass('hidden');
            $('#' + id_group_entrada_registroAdmin).removeClass("hidden");
            $('#' + id_salida_button_registroAdmin).addClass("hidden");
        }
    });
}

$("#" + id_familia_ddl_registroAdmin).change(function(){
	document.getElementById(id_status_obra_ddl_registroAdmin).selectedIndex = 0;
	$('#' + id_group_otros_registroAdmin).addClass('hidden');
	$('#' + id_group_actividad_registroAdmin).removeClass('hidden');
	$('#' + id_subfamilia_ddl_registroAdmin).empty();
	if($('#' + id_familia_ddl_registroAdmin + " option:selected").val() == "Rutinarios"){
		$('#' + id_actividad_ddl_registroAdmin).addClass('hidden');
	}
    var select = document.getElementById(id_subfamilia_ddl_registroAdmin);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
	var query;
	var fam = $('#' + id_familia_ddl_registroAdmin + " option:selected").val();
    if(fam == "Especificos"){
    	$('#' + id_group_status_obra_registroAdmin).removeClass('hidden');
    		for(key in nombre_obras){
    			var subfam = key;
	            var option2 = document.createElement('option');
	            option2.text = option2.value = subfam; 
	            select.appendChild(option2);
    		};
            var option3 = document.createElement('option');
            option3.text = option3.value = "Otros"; 
            select.appendChild(option3);
    } else {
    	$('#' + id_group_status_obra_registroAdmin).addClass('hidden');
    	familias.child(fam).forEach(function(childSnap){//Si no jala hacerlo con snapshot
			var subfam = fam == "Globales" ? childSnap.key : childSnap.val();
            var option2 = document.createElement('option');
            option2.text = option2.value = subfam; 
            select.appendChild(option2);
		});
        var option3 = document.createElement('option');
        option3.text = option3.value = "Otros"; 
        select.appendChild(option3);
    }
});

$("#" + id_subfamilia_ddl_registroAdmin).change(function(){
	$('#' + id_actividad_ddl_registroAdmin).removeClass('hidden');
	$('#' + id_actividad_ddl_registroAdmin).empty();
	var fam = $('#' + id_familia_ddl_registroAdmin + " option:selected").val();
	var subfam = $('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val();
	if(subfam == "Otros"){
		$('#' + id_group_otros_registroAdmin).removeClass('hidden');
		$('#' + id_group_actividad_registroAdmin).addClass('hidden');
	} else {
		$('#' + id_group_otros_registroAdmin).addClass('hidden');
		$('#' + id_group_actividad_registroAdmin).removeClass('hidden');
		var select = document.getElementById(id_actividad_ddl_registroAdmin);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);
	    var acts;
	    if(fam == "Globales"){
			acts = familias.child($('#' + id_familia_ddl_registroAdmin + " option:selected").val() + "/" + subfam);
	    } else if(fam == "Especificos"){
	    	acts = familias.child($('#' + id_familia_ddl_registroAdmin + " option:selected").val());
	    } else {
			$('#' + id_actividad_ddl_registroAdmin).addClass('hidden');
	    }
	    if(fam != "Rutinarios"){
		    acts.forEach(function(childSnap){
				var act = childSnap.val();
	            var option2 = document.createElement('option');
	            option2.text = option2.value = act; 
	            select.appendChild(option2);
			});
		}
	}
});

$('#' + id_entrada_button_registroAdmin).click(function(){
	var actividad;
	if($('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val() == "Otros"){
		actividad = $('#' + id_actividad_otros_registroAdmin).val();
	} else if($('#' + id_familia_ddl_registroAdmin + " option:selected").val() == "Rutinarios"){
		actividad = $('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val();
	} else {
		actividad = $('#' + id_actividad_ddl_registroAdmin + " option:selected").val();
	}
	var now = new Date().getTime();
	var status_obra = -1;
	if($('#' + id_familia_ddl_registroAdmin + " option:selected").val() == "Especificos"){
		//status_obra = $("input[name='status_obra']:checked").val();
		status_obra = $('#' + id_status_obra_ddl_registroAdmin + " option:selected").val();
	}
	var reg = {
		familia: $('#' + id_familia_ddl_registroAdmin + " option:selected").val(),
		subfamilia: $('#' + id_subfamilia_ddl_registroAdmin + " option:selected").val(),
		actividad: actividad,
		activo: true,
		checkin: now,
		checkout: 0,
		colaborador: firebase.auth().currentUser.uid,
		status_obra: status_obra,
	}
	var dates = getWeek(now);
	var reg_uid = firebase.database().ref(rama_bd_registros_registros_admin + "/" + dates[1] + "/" + dates[0]).push(reg);
	var tru = true;
	firebase.database().ref(rama_bd_personal + "/" + uid_usuario_global + "/status").set(tru).then(() => {
        modoRegistrosAdmin();
    });
});

$('#' + id_salida_button_registroAdmin).click(function(){
	firebase.database().ref(rama_bd_registros_registros_admin).orderByKey().limitToLast(1).once('child_added').then(function(snapshot){
		snapshot.forEach(function(weekSnap){
			weekSnap.forEach(function(regSnap){
				if(regSnap.val().activo == true){
					var fals = false;
					var now = new Date().getTime();
					firebase.database().ref(rama_bd_registros_registros_admin + "/" + snapshot.key + "/" + weekSnap.key + "/" + regSnap.key + "/activo").set(fals);
					firebase.database().ref(rama_bd_registros_registros_admin + "/" + snapshot.key + "/" + weekSnap.key + "/" + regSnap.key + "/checkout").set(now);
					var fal = false;
					firebase.database().ref(rama_bd_personal + "/" + uid_usuario_global + "/status").set(fal).then(() => {
	                    modoRegistrosAdmin();
	                });	
				}
			});
		});
	});
});