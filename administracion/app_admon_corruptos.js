var id_regs_div_corruptos = "regsDivCorruptos";
var id_inge_ddl_corruptos = "ingeDdlCorruptos";
var id_inge_group_corruptos = "ingeGroupCorruptos";
var id_actualizar_button_corruptos = "actualizarButtonCorruptos";
var id_cerrar_button_corruptos = "cerrarButtonCorruptos";
var id_datatable_corruptos = "dataTableCorruptos";

var id_tab_corruptos = "tabCorruptos";

var rama_bd_personal = "personal";
var rama_bd_registros = "proyectos/registros";

var regs = [];
var reg_corrupto_activo;

$('#' + id_tab_corruptos).click(function(){
	/*
        <div class='input-group date' id='datetimepicker3'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-time"></span>
            </span>
        </div>
    */
	if(areas_usuario_global.administracion){
    	loadTableCorruptos();
		$('#' + id_inge_group_corruptos).removeClass('hidden');
		$('#' + id_inge_ddl_corruptos).empty();

		var select = document.getElementById(id_inge_ddl_corruptos);
	    var option = document.createElement('option');
	    option.style = "display:none";
	    option.text = option.value = "";
	    select.appendChild(option);

    	for(key in json_personal){
    		if(json_personal[key].areas.proyectos && !json_personal[key].areas.administracion && json_personal[key].activo){
		        var option2 = document.createElement('OPTION');
		        option2.text = json_personal[key].nickname;
		        option2.value = key;
		        select.appendChild(option2);
    		}
    	}
	} else {
		$('#' + id_inge_group_corruptos).addClass('hidden');
		loadRegistrosCorruptos(uid_usuario_global);
	}
});

function loadTableCorruptos(){
    var datos_corruptos = [];
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
		snapshot.forEach(function(yearSnap){
			yearSnap.forEach(function(weekSnap){
				weekSnap.forEach(function(regSnap){
					var reg = regSnap.val();
					if(reg.horas == -1 || (!reg.status && new Date().getDay() != new Date(reg.checkin).getDay()) || (reg.horas == 0 && reg.status)){
						var fech = new Date(reg.checkin);
						var month = fech.getMonth() + 1;
						var day = fech.getDate();
						var year = fech.getFullYear();
						datos_corruptos.push([json_personal[reg.inge].nickname, reg.obra, reg.proceso, month + "/" + day + "/" + year, fech.getHours() + ":" + ("0" + fech.getMinutes()).slice(-2), reg.status ? "Terminado" : "Activo"]);
					}
				});
			});
		});
		var tabla_diver = $('#'+ id_datatable_corruptos).DataTable({
            destroy: true,
            data: datos_corruptos,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
            	{title: "Colaborador",},
            	{title: "Obra",},
            	{title: "Proceso",},
            	{title: "Fecha de inicio",},
            	{title: "Hora de inicio",},
            	{title: "Status",},
            ],
            language: idioma_espanol,
        });
	});
}

$('#' + id_inge_ddl_corruptos).change(function(){
	loadRegistrosCorruptos($('#' + id_inge_ddl_corruptos + " option:selected").val());
});

function loadRegistrosCorruptos(uid){
	regs = [];
	$('#' + id_regs_div_corruptos).empty();
	$('#' + id_actualizar_button_corruptos).removeClass('hidden');
	$('#' + id_cerrar_button_corruptos).addClass('hidden');
	firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
		snapshot.forEach(function(yearSnap){
			yearSnap.forEach(function(weekSnap){
				weekSnap.forEach(function(regSnap){
					var reg = regSnap.val();
					if(reg.inge == uid && (reg.horas == -1 || (!reg.status && new Date().getDay() != new Date(reg.checkin).getDay()) || (reg.horas == 0 && reg.status))){
						//console.log(reg);
						var status = reg.status ? "Terminado" : "Activo";//AQUI usarlo para eso
						var div_regs = document.getElementById(id_regs_div_corruptos);
					    
						var div = document.createElement('div');
						var row1 = document.createElement('div');
						row1.className = "form-row";
						var row2 = document.createElement('div');
						row2.className = "form-row";
						var row3 = document.createElement('div');
						row3.className = "form-row";
						var div1 = document.createElement('div');
						div1.className = "col-lg-6";
						var div2 = document.createElement('div');
						div2.className = "col-lg-6";
						var div3 = document.createElement('div');
						div3.className = "col-lg-6";
						var div4 = document.createElement('div');
						div4.className = "col-lg-6";
						var div5 = document.createElement('div');
						div5.className = "col-lg-6";
						var div6 = document.createElement('div');
						div6.className = "col-lg-6";
					    var fecha = document.createElement('label');
						var fech = new Date(reg.checkin);
						var month = fech.getMonth() + 1;
						var day = fech.getDate();
						var year = fech.getFullYear();
					    fecha.innerHTML =  month + "/" + day + "/" + year;
					    var checkin = document.createElement('label');
						var ci = fech.getHours() + ":" + ("0" + fech.getMinutes()).slice(-2);
					    checkin.innerHTML =  ci;
					    var obra = document.createElement('label');
					    obra.innerHTML = reg.obra;
					    var proceso = document.createElement('label');
					    proceso.innerHTML = reg.proceso;
					    var status_label = document.createElement('label');
					    status_label.innerHTML = status;

						var div_checkout = document.createElement('div');
						div_checkout.className = "input-group date";
					    var hora_salida = document.createElement('input');
						hora_salida.type = "text";
						hora_salida.className = "form-control"
						hora_salida.id = "hora_salida_" + regs.length;

						var button_cerrar;
						if(!reg.status){
							$('#' + id_cerrar_button_corruptos).removeClass('hidden');
							$('#' + id_actualizar_button_corruptos).addClass('hidden');
							reg_corrupto_activo = {
								regKey: regSnap.key,
								inge_uid: reg.inge,
								year: yearSnap.key,
								week: weekSnap.key,
							}
						}

						div_checkout.appendChild(hora_salida);

						regs[regs.length] = {inge: reg.inge, uid: regSnap.key, week: weekSnap.key, year: yearSnap.key, obra: reg.obra, proceso: reg.proceso, checkin_clock: ci, status: reg.status};
						div1.appendChild(obra);
						div2.appendChild(proceso);
						div3.appendChild(fecha);
						div4.appendChild(checkin);
						div5.appendChild(status_label);
						div6.appendChild(div_checkout);
						row1.appendChild(div1);
						row1.appendChild(div2);
						row2.appendChild(div3);
						row2.appendChild(div4);
						row3.appendChild(div5);
						row3.appendChild(div6);

						div.appendChild(row1);
						div.appendChild(row2);
						div.appendChild(row3);
						div.style.border = "solid #000000";
						div_regs.appendChild(div);
						if(reg.status){
							$('#hora_salida_' + (regs.length-1)).datetimepicker({
								datepicker:false,
								format: 'H:i',
								allowTimes:['12:00', '12:15', '12:30', '12:45','13:00', '13:15', '13:30', '13:45','14:00', '14:15', '14:30', '14:45','15:00', '15:15', '15:30', '15:45','16:00', '16:15', '16:30', '16:45','17:00', '17:15', '17:30', '17:45','18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00',
								]
			                });
			                $('#hora_salida_' + (regs.length-1)).val("17:00");
						} else {
							document.getElementById('hora_salida_' + (regs.length-1)).disabled = true
						}
					}
				});
			});
		});
		if(regs.length == 0){
			var label = document.createElement('label');
		    label.innerHTML = "No hay registros corruptos";
			document.getElementById(id_regs_div_corruptos).appendChild(label);
			$('#' + id_actualizar_button_corruptos).addClass('hidden');
		}
	});
}

$('#' + id_cerrar_button_corruptos).click(function(){
	var update_reg = {
		horas: -1,
		status: true,
	}
	console.log(rama_bd_registros + "/" + reg_corrupto_activo.year + "/" + reg_corrupto_activo.week + "/" + reg_corrupto_activo.regKey);
	firebase.database().ref(rama_bd_registros + "/" + reg_corrupto_activo.year + "/" + reg_corrupto_activo.week + "/" + reg_corrupto_activo.regKey).update(update_reg);
	var fal = false;
	console.log(rama_bd_personal + "/" + reg_corrupto_activo.inge_uid + "/status");
	firebase.database().ref(rama_bd_personal + "/" + reg_corrupto_activo.inge_uid + "/status").set(fal);
	alert("Cierre exitoso");
	loadRegistrosCorruptos(reg_corrupto_activo.inge_uid);
	loadTableCorruptos();
});

$('#' + id_actualizar_button_corruptos).click(function(){
	var horas_score = {};
	var flag = true;
	$('[id^=hora_salida_').each(function(){
		if($(this).val() == ""){
			flag = false;
		}
	});
	if(!flag){
		alert("Llena todos los campos antes de actualizar");
	} else {
		$('[id^=hora_salida_').each(function(){
			var count = this.id.substring(this.id.split("_")[0].length + this.id.split("_")[1].length + 2,this.id.length);
			var reg = regs[count];
			if(reg.status){
				var clock_in = reg.checkin_clock.split(":");
				var clock_out = $('#hora_salida_' + count).val().split(":");
				var horas = (parseInt(clock_out[0]) - parseInt(clock_in[0])) * 3600000 + (parseInt(clock_out[1]) - parseInt(clock_in[1])) * 60000;
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
		        horas_score[reg.inge][query] = horas_score[reg.inge][query] ? horas_score[reg.inge][query] + horas : horas;

				firebase.database().ref(rama_bd_registros + "/" + reg.year + "/" + reg.week + "/" + reg.uid + "/horas").set(horas);
			}
		});

		for(inge in horas_score){
			for(query in horas_score[inge]){
			    sumaEnFirebase(query + "/SCORE/total_trabajado", parseFloat(horas_score[inge][query])/3600000);
			    sumaEnFirebase(query + "/SCORE/inges/" + inge + "/horas_trabajadas", parseFloat(horas_score[inge][query])/3600000);
			}
		}

		alert("Horas actualizadas");
		loadRegistrosCorruptos();
		loadTableCorruptos();
	}
});