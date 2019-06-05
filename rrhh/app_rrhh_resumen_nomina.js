var id_tab_resumen_nomina = "tabResumenNomina";

var id_week_ddl_resumen_nomina = "semanaResumenNomina";
var id_year_ddl_resumen_nomina = "yearResumenNomina";

var id_terminar_asistencias_button_resumen_nomina = "terminarAsistenciasResumenNomina";
var id_revertir_asistencias_button_resumen_nomina = "revertirAsistenciasResumenNomina";
var id_terminar_horas_extra_button_resumen_nomina = "terminarHorasExtraResumenNomina";
var id_revertir_horas_extra_button_resumen_nomina = "revertirHorasExtraResumenNomina";
var id_terminar_diversos_button_resumen_nomina = "terminarDiversosResumenNomina";
var id_revertir_diversos_button_resumen_nomina = "revertirDiversosResumenNomina";
var id_datatable_resumen_nomina =  "dataTableResumenNomina";

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
var rama_bd_trabajadores = "rrhh/trabajadores";

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
    loadResumenNomina();
});

$('#' + id_year_ddl_resumen_nomina).change(function(){
    $('#' + id_week_ddl_resumen_nomina).empty();
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
    var datos_resumen_nomina = [];
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        snapshot.forEach(function(trabSnap){
            if(trabSnap.child("nomina/" + year + "/" + week).exists()){
                var trab = trabSnap.val();
                var obras_semana = {};
                var lunes = trabSnap.child("nomina/" + year + "/" + week + "/lunes");
                lunes = lunes.exists() ? lunes.child("obra").val() : "";
                if(lunes != ""){
                    if(obras_semana[lunes]){
                        obras_semana[lunes]++;
                    } else {
                        obras_semana[lunes] = 1;
                    }
                }
                var martes = trabSnap.child("nomina/" + year + "/" + week + "/martes");
                martes = martes.exists() ? martes.child("obra").val() : "";
                if(martes != ""){
                    if(obras_semana[martes]){
                        obras_semana[martes]++;
                    } else {
                        obras_semana[martes] = 1;
                    }
                }
                var miercoles = trabSnap.child("nomina/" + year + "/" + week + "/miercoles");
                miercoles = miercoles.exists() ? miercoles.child("obra").val() : "";
                if(miercoles != ""){
                    if(obras_semana[miercoles]){
                        obras_semana[miercoles]++;
                    } else {
                        obras_semana[miercoles] = 1;
                    }
                }
                var jueves = trabSnap.child("nomina/" + year + "/" + week + "/jueves");
                jueves = jueves.exists() ? jueves.child("obra").val() : "";
                if(jueves != ""){
                    if(obras_semana[jueves]){
                        obras_semana[jueves]++;
                    } else {
                        obras_semana[jueves] = 1;
                    }
                }
                var viernes = trabSnap.child("nomina/" + year + "/" + week + "/viernes");
                viernes = viernes.exists() ? viernes.child("obra").val() : "";
                if(viernes != ""){
                    if(obras_semana[viernes]){
                        obras_semana[viernes]++;
                    } else {
                        obras_semana[viernes] = 1;
                    }
                }
                var max = -1;
                var obra_asignada = "";
                console.log(obras_semana);
                for(key in obras_semana){
                    if(obras_semana[key] > max){
                        obra_asignada = key;
                        max = obras_semana[key];
                    }
                }
                var asis = 0;
                asis = trabSnap.child("nomina/" + year + "/" + week + "/jueves/asistencia").val() ? asis + 0.2 : asis;
                asis = trabSnap.child("nomina/" + year + "/" + week + "/viernes/asistencia").val() ? asis + 0.2 : asis;
                asis = trabSnap.child("nomina/" + year + "/" + week + "/lunes/asistencia").val() ? asis + 0.2 : asis;
                asis = trabSnap.child("nomina/" + year + "/" + week + "/martes/asistencia").val() ? asis + 0.2 : asis;
                asis = trabSnap.child("nomina/" + year + "/" + week + "/miercoles/asistencia").val() ? asis + 0.2 : asis;
                datos_resumen_nomina.push([
                    trabSnap.key,
                    trab.nombre,
                    obra_asignada,
                    trab.jefe,
                    trab.jefe == "HEAD" ? "Admon" : "Destajo",
                    trab.especialidad,
                    trab.puesto,
                    trabSnap.child("nomina/" + year + "/" + week + "/jueves/asistencia").val() ? 0.2 : 0,
                    trabSnap.child("nomina/" + year + "/" + week + "/viernes/asistencia").val() ? 0.2 : 0,
                    trabSnap.child("nomina/" + year + "/" + week + "/lunes/asistencia").val() ? 0.2 : 0,
                    trabSnap.child("nomina/" + year + "/" + week + "/martes/asistencia").val() ? 0.2 : 0,
                    trabSnap.child("nomina/" + year + "/" + week + "/miercoles/asistencia").val() ? 0.2 : 0,
                    trab.sueldo_base,
                    parseFloat(trab.sueldo_base) * asis,
                    parseFloat(trabSnap.child("nomina/" + year + "/" + week + "/total_horas_extra").val())*(24/parseFloat(trab.sueldo_base)) == "" ? "-" : parseFloat(trabSnap.child("nomina/" + year + "/" + week + "/total_horas_extra").val())*(24/parseFloat(trab.sueldo_base)),
                    trabSnap.child("nomina/" + year + "/" + week + "/total_horas_extra").val() == null ? "-" : trabSnap.child("nomina/" + year + "/" + week + "/total_horas_extra").val(),
                    trabSnap.child("nomina/" + year + "/" + week + "/total_diversos").val() == null ? "-" : trabSnap.child("nomina/" + year + "/" + week + "/total_diversos").val(),
                    trabSnap.child("nomina/" + year + "/" + week + "/total").val() == null ? "-" : trabSnap.child("nomina/" + year + "/" + week + "/total").val(),
                ]);
            }       
        });             

        tabla_resumen_nomina = $('#'+ id_datatable_resumen_nomina).DataTable({
            destroy: true,
            data: datos_resumen_nomina,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "ID"},
                {title: "Nombre"},
                {title: "Obra Asignada"},
                {title: "Jefe"},
                {title: "Admon/Destajo"},
                {title: "Especialidad"},
                {title: "Puesto"},
                {title: "Jueves"},
                {title: "Viernes"},
                {title: "Lunes"},
                {title: "Martes"},
                {title: "Miercoles"},
                {title: "Sueldo Base"},
                {title: "Pago base"},
                {title: "HE"},
                {title: "HE ($)"},
                {title: "Diversos"},//Uno por uno?
                {title: "Total"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
		var semana = snapshot.val();


		if(!snapshot.child("terminada").val() || semana == undefined){
			if(semana.asistencias_terminadas){
				$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_asistencias_button_resumen_nomina).removeClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).addClass('hidden');
			}
			if(semana.horas_extra_terminadas){
				$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_horas_extra_button_resumen_nomina).removeClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).addClass('hidden');
			}
			if(semana.diversos_terminados){
				$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_diversos_button_resumen_nomina).removeClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).addClass('hidden');
			}
		} else {
			$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
			$('#' + id_revertir_asistencias_button_resumen_nomina).addClass('hidden');
			$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
			$('#' + id_revertir_horas_extra_button_resumen_nomina).addClass('hidden');
			$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
			$('#' + id_revertir_diversos_button_resumen_nomina).addClass('hidden');
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
        asignarObras(year,week);
        alert("Datos de la semana guardados y bloqueados");
        loadResumenNomina();
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
        loadResumenNomina();
    });
});

$('#' + id_terminar_horas_extra_button_resumen_nomina).click(function(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    var tru = true;
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/horas_extra_terminadas").set(tru);
    alert("Registro de horas extra de esta semana terminado");
    loadResumenNomina();
});

$('#' + id_revertir_horas_extra_button_resumen_nomina).click(function(){
	var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    var fal = false;
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/horas_extra_terminadas").set(fal);
    alert("Registro de horas extra de esta semana desbloqueado");
    loadResumenNomina();
});

$('#' + id_terminar_diversos_button_resumen_nomina).click(function(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshotNom){
        var nomina = snapshotNom.val();
        if(snapshotNom.child("asistencias_terminadas").val()){
            //Entro a trabajadores y registro los diversos en pagos_nomina, tengo que esperar hasta acá por los distribuibles
            firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
                snapshot.forEach(function(trabSnap){
                    var total_div = 0;
                    var trab = trabSnap.val().nomina;
                    if(trab != undefined){
                        if(trab[year] != undefined){
                            if(trab[year][week] != undefined){
                                trabSnap.child("nomina/" + year + "/" + week + "/diversos").forEach(function(diversoSnap){
                                    var diver = diversoSnap.val();
                                    total_div = total_div + parseFloat(diver.cantidad);
                                    if(diver.distribuible){
                                        distribuyeEnAsistencias(diver.cantidad,trabSnap,year,week,diver.diverso);
                                    } else {
                                        var diverso = {
                                            cantidad: diver.cantidad,
                                            diverso: diver.diverso,
                                            proceso: diver.proceso,
                                        }
                                        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/diversos").push(diverso);
                                    }
                                });
                            }
                        }               
                    }
                });

            }); 
            var tru = true;
            calculaTotalesEImpuestosDiversos();
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/diversos_terminados").set(tru);
            alert("Pagos diversos de esta semana terminados");
        } else {
            alert("No se han terminado las asistencias");
        }
        loadResumenNomina();
    });
});

$('#' + id_revertir_diversos_button_resumen_nomina).click(function(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        //trab por trab matando total_diversos, impuestos/div y diversos
        var update = snapshot.val();
        update["diversos_terminados"] = false;
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key != "asistencias_terminadas" && obraSnap.key != "diversos_terminados" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "terminada"){
                obraSnap.child("trabajadores").forEach(function(trabSnap){
                    update[obraSnap.key]["trabajadores"][trabSnap.key]["diversos"] = null;
                    update[obraSnap.key]["trabajadores"][trabSnap.key]["total_diversos"] = null;
                    update[obraSnap.key]["trabajadores"][trabSnap.key]["impuestos"]["impuestos_diversos"] = null;
                });
            }
        });
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).update(update);
        loadResumenNomina();
    });
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
                if(!flag && daySnap.val().obra != "NA"){
                    obra_asignada[count] = daySnap.val().obra;
                    count++;
                }
            });
            firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key + "/obra_asignada").set(obra_asignada);
        });
    });
}

function distribuyeEnAsistencias(monto,trabSnap,year,week,diverso){
    var asistencias = {asistencias: 0};
    var lastDay = new Date(year,11,31);
    if(week == getWeek(lastDay.getTime())[0] && lastDay.getDay() != 3){
        var year_siguiente = year + 1;
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/lunes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/martes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/miercoles").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/jueves").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/viernes").val());
    }
    if(week == 1 && new Date(year,0,1).getDay() != 4){
        var year_anterior = year - 1;
        var last_week = getWeek(new Date(year_anterior,11,31).getTime())[0];
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/lunes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/martes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/miercoles").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/jueves").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/viernes").val());
        distribuyeEnAsistencias(monto, trabSnap, year_anterior, last_week, diverso);
    }
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/lunes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/martes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/miercoles").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/jueves").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/viernes").val());

    for(key in asistencias){
        if(key != "asistencias"){
            var keyObra = key;
            if(asistencias[keyObra]["procesos"]){
                for(key in asistencias[keyObra]["procesos"]){
                    var cant = (monto * asistencias[keyObra]["procesos"][key] / asistencias["asistencias"]).toFixed(2);
                    var diver = {
                        cantidad: cant,
                        proceso: key,
                        diverso: diverso,
                    }
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
                }
            } else {
                var cant = (monto * asistencias[keyObra] / asistencias["asistencias"]).toFixed(2);
                var diver = {
                    cantidad: cant,
                    proceso: keyObra,
                    diverso: diverso,
                }
                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
            }
        }
    }
}

function asistenciaSimpleDiversos(asistencias, dia){
    if(dia.asistencia){
        if(asistencias["asistencias"]){
            asistencias["asistencias"] = asistencias["asistencias"] + 0.2;
        } else {
            asistencias["asistencias"] = 0.2;
        }   
    }
}

function asistenciaDia(asistencias, dia){
    var proc = dia.proceso;
    if(dia.proceso == "Parado"){
        proc = "MISC";
    }
    asistenciaSimpleDiversos(asistencias, dia);
    if(dia.asistencia){
        if(dia.obra == proc){
            if(asistencias[dia.obra]) {
                asistencias[dia.obra] = asistencias[dia.obra] + 0.2;
            } else {
                asistencias[dia.obra] = 0.2;
            }
        } else { 
            if(asistencias[dia.obra]){
                if(!asistencias[dia.obra]["procesos"]){
                    asistencias[dia.obra]["procesos"] = {};
                }
                if(asistencias[dia.obra]["procesos"][proc]){
                    asistencias[dia.obra]["procesos"][proc] = asistencias[dia.obra]["procesos"][proc] + 0.2;
                } else {
                    asistencias[dia.obra]["procesos"][proc] = 0.2;
                }
            } else {
                asistencias[dia.obra] = {};
                asistencias[dia.obra]["procesos"] = {};
                asistencias[dia.obra]["procesos"][proc] = 0.2;
            }
        }
    }
}

function calculaTotalesEImpuestosDiversos(){
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key != "asistencias_terminadas" && obraSnap.key != "diversos_terminados" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "terminada"){
                obraSnap.child("trabajadores").forEach(function(trabSnap){
                    var total = 0;
                    trabSnap.child("diversos").forEach(function(divSnap){
                        total = isNaN(parseFloat(divSnap.val().cantidad)) ? total : total + parseFloat(divSnap.val().cantidad);
                    });
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obraSnap.key + "/trabajadores/" + trabSnap.key + "/total_diversos").set(total);
                    var impuestos_diversos = total * 0.16;
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obraSnap.key + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
                });
            }
        });
    });
}
