var id_regs_div_corruptos = "regsDivCorruptos";
var id_inge_ddl_corruptos = "ingeDdlCorruptos";
var id_inge_group_corruptos = "ingeGroupCorruptos";
var id_actualizar_button_corruptos = "actualizarButtonCorruptos";

var id_tab_corruptos = "tabCorruptos";

var rama_bd_personal = "personal";
var rama_bd_registros = "proyectos/registros";

var regs = [];

$('#' + id_tab_corruptos).click(function(){
	if(areas_usuario_global.administracion){
		$('#' + id_inge_group_corruptos).removeClass('hidden');
		$('#' + id_inge_ddl_corruptos).empty();

		var select = document.getElementById(id_inge_ddl_corruptos);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);

	    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
	        snapshot.forEach(function(persSnap){
	        	if(persSnap.child("areas/proyectos").val() && !persSnap.child("areas/administracion").val() && persSnap.child("activo").val()){
			        var option2 = document.createElement('OPTION');
			        option2.text = persSnap.child("nickname").val();
			        option2.value = persSnap.key;
			        select.appendChild(option2);
	        	}
	        });
	    });
	} else {
		$('#' + id_inge_group_corruptos).addClass('hidden');
		loadRegistrosCorruptos(uid_usuario_global);
	}
});

$('#' + id_inge_ddl_corruptos).change(function(){
	loadRegistrosCorruptos($('#' + id_inge_ddl_corruptos + " option:selected").val());
});

function loadRegistrosCorruptos(uid){
	regs = [];
	$('#' + id_regs_div_corruptos).empty();
	$('#' + id_actualizar_button_corruptos).removeClass('hidden');
	var div = document.createElement('div');
	firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
		snapshot.forEach(function(yearSnap){
			yearSnap.forEach(function(weekSnap){
				weekSnap.forEach(function(regSnap){
					var reg = regSnap.val();
					if(reg.inge == uid && (reg.horas == -1 || reg.horas == 0)){
						//console.log(reg);
						var row1 = document.createElement('div');
						row1.className = "row"
						var row2 = document.createElement('div');
						row2.className = "form-row"
						var div1 = document.createElement('div');
						div1.className = "col-lg-6";
						var div2 = document.createElement('div');
						div2.className = "col-lg-6";
						var div3 = document.createElement('div');
						div3.className = "col-lg-6";
						var div4 = document.createElement('div');
						div4.className = "col-lg-6";
					    var fecha = document.createElement('label');
						var fech = new Date(reg.checkin);
						var month = fech.getMonth() + 1;
						var day = fech.getDate();
						var year = fech.getFullYear();
					    fecha.innerHTML =  month + "/" + day + "/" + year;
					    var obra = document.createElement('label');
					    obra.innerHTML = reg.obra;
					    var proceso = document.createElement('label');
					    proceso.innerHTML = reg.proceso;
					    var textField = document.createElement('input');
						textField.type = "text";
						textField.id = "horas_corr_" + regs.length;
						textField.value = 0;
						textField.style = "width: 90%";
						regs[regs.length] = {inge: reg.inge, uid: regSnap.key, week: weekSnap.key, year: yearSnap.key, obra: reg.obra, proceso: reg.proceso};
						div1.appendChild(obra);
						div2.appendChild(proceso);
						div3.appendChild(fecha);
						div4.appendChild(textField);
						row1.appendChild(div1);
						row1.appendChild(div2);
						row2.appendChild(div3);
						row2.appendChild(div4);
						div.appendChild(row1);
						div.appendChild(row2);
						div.style.border = "solid #000000";
						document.getElementById(id_regs_div_corruptos).appendChild(div);
					}
				});
			});
		});
		if(regs.length == 0){
			var label = document.createElement('label');
		    label.innerHTML = "No hay registros corruptos";
			div.appendChild(label);
			document.getElementById(id_regs_div_corruptos).appendChild(div);
			$('#' + id_actualizar_button_corruptos).addClass('hidden');
		}
	});
}

$('#' + id_actualizar_button_corruptos).click(function(){
	var horas_score = {};
	$('[id^=horas_corr_').each(function(){
		var reg = regs[this.id.substring(this.id.split("_")[0].length + this.id.split("_")[1].length + 2,this.id.length)];
		var horas = parseFloat($('#' + this.id).val()) * 3600000;
		console.log(rama_bd_registros + "/" + reg.year + "/" + reg.week + "/" + reg.uid);
		console.log(horas);
		var proc_path = reg.proceso.split("-");
		var query;
        if(proc_path.length > 1){
            //sumaScoreKaizen(reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso, cant);
            query = rama_bd_obras + "/" + reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso;//+1 ms para compensar el -1 sumado al corromper
        } else {
            query = rama_bd_obras + "/" + reg.obra + "/procesos/" + reg.proceso;//+1 ms para compensar el -1 sumado al corromper
        }
        if(!horas_score[reg.inge]){
        	horas_score[reg.inge] = {};
        }
        horas_score[reg.inge][query] = horas_score[reg.inge][query] ? horas_score[reg.inge][query] + parseFloat($('#' + this.id).val()) : parseFloat($('#' + this.id).val());

        
		firebase.database().ref(rama_bd_registros + "/" + reg.year + "/" + reg.week + "/" + reg.uid + "/horas").set(horas);
	});

	for(inge in horas_score){
		for(query in horas_score[inge]){
		    sumaEnFirebase(query + "/SCORE/total_trabajado", horas_score[inge][query]);
		    sumaEnFirebase(query + "/SCORE/inges/" + inge + "/horas_trabajadas", horas_score[inge][query]);
		}
	}

	alert("Horas actualizadas");
	loadRegistrosCorruptos();
});