var id_tab_resumen_nomina = "tabResumenNomina";

var id_week_ddl_resumen_nomina = "semanaResumenNomina";
var id_year_ddl_resumen_nomina = "yearResumenNomina";

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
var rama_bd_trabajadores = "rrhh/trabajadores";

//aqui hidden a todos los botones y reset tabla en tab.click, year.change y week.change

$('#' + id_tab_resumen_nomina).click(function() {
    $('#' + id_week_ddl_resumen_nomina).empty();
    $('#' + id_year_ddl_resumen_nomina).empty();

	var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_week_ddl_resumen_nomina);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_resumen_nomina);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }
});

$('#' + id_year_ddl_resumen_nomina).change(function(){
    $('#' + id_semana_ddl_asistencia).empty();
    var select = document.getElementById(id_week_ddl_resumen_nomina);
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
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
    loadResumenNomina();
});

$('#' + id_week_ddl_resumen_nomina).change(function(){
	loadResumenNomina();
});

function loadResumenNomina(){
	var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
	var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
		var semana = snapshot.val();
		//AQUI Despliega la datatable En todo caso
		if(semana.terminada){
			if(semana.asistencias_terminadas){
				$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).removeClass('hidden');
			}
			if(semana.horas_extra_terminadas){
				$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).removeClass('hidden');
			}
			if(semana.diversos_terminados){
				$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).removeClass('hidden');
			}
		} 
	});
};

$('#' + id_terminar_asistencias_button_resumen_nomina).click(function(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        var semana = snapshot.val();
        var tru = true;
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/asistencias_terminadas").set(tru);
        //guardarAsistencias();
        asignarObras(year,week);
        alert("Datos de la semana guardados y bloqueados");
    });
});

$('#' + id_revertir_asistencias_button_resumen_nomina).click(function(){
	var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        var semana = snapshot.val();
        if(semana.diversos_terminados){
        	alert("Revierte los diversos primero");
        } else {
	        var fal = false;
	        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/asistencias_terminadas").set(fal);
	        alert("Datos de la semana revertidos y desbloqueados");
	    }
    });
});

$('#' + id_terminar_horas_extra_button_resumen_nomina).click(function(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        var semana = snapshot.val();
        if(!terminada.horas_extra_terminadas){
            //guardarHorasExtra();
            firebase.database().ref(rama_bd_obras_magico).once('value').then(function(obrasSnapshot){//AQUI solo para kaizen ? borrar : dejar;
                var obras_json = obrasSnapshot.val();//AQUI solo para kaizen ? borrar : dejar;
                //Repito para volver a cargar las horas guardadas... creo
                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){    
                    snapshot.forEach(function(obraSnap){
                        if(obraSnap.key != "total" && obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados"){
                            obraSnap.child("trabajadores").forEach(function(trabSnap){
                                trabSnap.child("horas_extra").forEach(function(heSnap){
                                    var horas_extra = heSnap.val();
                                    var proc = horas_extra.proceso;
                                    var cantidad = horas_extra.horas;
                                    //console.log("cantidad :" + cantidad)
                                    var obra = obraSnap.key;
                                    if(obra != "Atencion a Clientes" && obra != "Vacaciones"){
                                        obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                        //sumaMOKaizenHE(obra,cantidad);
                                        if(proc != obra){
                                            var path = proc.split("-");
                                            if(path.length > 1){
                                                obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                                //sumaMOKaizenHE(obra + "/procesos/" + path[0] + "/subprocesos/" + proc,cantidad);
                                            }
                                            obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                            //sumaMOKaizenHE(obra + "/procesos/" + path[0],cantidad);
                                        }
                                    }
                                });
                            });
                        }
                    });
                    //console.log(obras_json);
                    firebase.database().ref(rama_bd_obras_magico).update(obras_json);
                });
            });
            var tru = true;
            firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_horasExtra + " option:selected").val() + "/" + $('#' + id_semana_ddl_horasExtra + " option:selected").val() + "/horas_extra_terminadas").set(tru);
            alert("Registro de horas extra de esta semana terminado");
        }
    });
});

$('#' + id_revertir_horas_extra_button_resumen_nomina).click(function(){

});

$('#' + id_terminar_diversos_button_resumen_nomina).click(function(){

});

$('#' + id_revertir_diversos_button_resumen_nomina).click(function(){

});

function asignarObras(year, week){
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        snapshot.forEach(function(trabSnap){
            var obra_asignada = {};
            var count = 0;
            trabSnap.child("nomina/" + year + "/" + week).forEach(function(daySnap){
                var flag = false;
                var i = 0;
                while(i<count && !flag){
                    if(obra_asignada[i] == daySnap.val().obra){
                        flag = true;
                    }
                    i++;
                }
                if(!flag){
                    obra_asignada[count] = daySnap.val().obra;
                    count++;
                }
            });
            firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key + "/obra_asignada").set(obra_asignada);
        });
    });
}
//Jalar los terminar aquí.
// Checar que no usen ningun dato que este en su app original y no aqui.
// Quitarle los kaizens a los terminar y meterlos en el terminar pago nomina.
//Programar los revertir
