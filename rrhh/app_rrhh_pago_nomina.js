var id_semana_ddl_pago_nomina = "semanaDdlPagoNomina";
var id_year_ddl_pago_nomina = "yearDdlPagoNomina";
var id_num_ren_pago_nomina = "numRenPagoNomina";
var id_terminar_button_pago_nomina = "terminarButtonPagoNomina";
var id_calcula_total_button_pago_nomina = "calculaTotalButtonPagoNomina";

var id_datatable_pago_nomina = "dataTablePagoNomina";
var id_table_pago_nomina = "tablePagoNomina";

var id_tab_pago_nomina = "tabPagoNomina";

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
var rama_bd_trabajadores = "rrhh/trabajadores";
var rama_bd_obras_magico = "obras";

var tablePagoNomina = document.getElementById(id_table_pago_nomina);

var trabajadores = [];

//AQUI meter al kaizen HE y DIV al hacer click (aka toooodo) y sumar totales del trabajador (solo total global, quitar asis y he o lo que haya), obra y semana

$('#' + id_tab_pago_nomina).click(function(){
	$('#' + id_semana_ddl_pago_nomina).empty();
    $('#' + id_year_ddl_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).addClass('hidden');
    $('#' + id_table_pago_nomina).empty();

    var year_actual = getWeek(new Date().getTime())[1];
    var select = document.getElementById(id_year_ddl_pago_nomina);
    for(i=year_actual;i>2017;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }
    //Solo carga las semanas con registros, aka las que tienen una rama en rama_bd_pagos_nomina
    loadSemanasPagoNomina(year_actual);
});

$('#' + id_year_ddl_pago_nomina).change(function(){
	trabajadores = [];
	$('#' + id_datatable_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).addClass('hidden');
    $('#' + id_table_pago_nomina).empty();
    $('#' + id_semana_ddl_pago_nomina).empty();
	loadSemanasPagoNomina($('#' + id_year_ddl_pago_nomina + " option:selected").val());
});

function loadSemanasPagoNomina(year){

	var optionBlank = document.createElement("option");
	optionBlank.style = "display:none";
	optionBlank.text = optionBlank.value = "";

	var semana_actual;
	if(year == getWeek(new Date().getTime())[1]){
	    semana_actual = getWeek(new Date().getTime())[0];	
	} else {
		semana_actual = getWeek(new Date(year,11,31).getTime())[0];
	}
	var select = document.getElementById(id_semana_ddl_pago_nomina);
	select.appendChild(optionBlank);

    firebase.database().ref(rama_bd_pagos_nomina + "/" + year).once('value').then(function(snapshot){
    	for(i=semana_actual;i>0;i--){
			if(snapshot.child(i).exists()){
				var semana = snapshot.child(i).val();
				if(semana.diversos_terminados && semana.asistencias_terminadas && semana.horas_extra_terminadas){
					var option = document.createElement('option');
					option.text = snapshot.child(i).key;
					option.value = snapshot.child(i + "/terminada").val();//No estoy seguro de para que puse este valor
					select.appendChild(option);
				}
			}
    	}
    });
}

$('#' + id_semana_ddl_pago_nomina).change(function(){

	trabajadores = [];
    var year = $('#' + id_year_ddl_pago_nomina + " option:selected").val();
	var semana = $('#' + id_semana_ddl_pago_nomina + " option:selected").text();
	//console.log(semana);
	//firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana).once('value').then(function(snapshot){
		//var terminada = snapshot.val().terminada;
		var terminada = $('#' + id_semana_ddl_pago_nomina + " option:selected").val();
		if(terminada == 'true'){
			document.getElementById(id_terminar_button_pago_nomina).disabled = true;
			//DataTable
			var datos_pagoNomina = [];
			firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
				snapshot.forEach(function(trabSnap){
					var trabajador = trabSnap.val();
					if(trabSnap.child("nomina/" + year + "/" + semana).exists()){
						var nom = trabSnap.child("nomina/" + year + "/" + semana).val();

						var tot_HE = isNaN(parseFloat(nom.total_horas_extra)) ? 0 : parseFloat(nom.total_horas_extra);
						var tot_as = isNaN(parseFloat(nom.total_asistencia)) ? 0 :  parseFloat(nom.total_asistencia);
						var tot_div = isNaN(parseFloat(nom.total_diversos)) ? 0 : parseFloat(nom.total_diversos);
						var imp_as = nom.impuestos == undefined ? 0 : (isNaN(parseFloat(nom.impuestos.impuestos_asistencia)) ? 0 : parseFloat(nom.impuestos.impuestos_asistencia));
						var imp_div = nom.impuestos == undefined ? 0 : (isNaN(parseFloat(nom.impuestos.impuestos_diversos)) ? 0 : parseFloat(nom.impuestos.impuestos_diversos));
						var imp_HE = nom.impuestos == undefined ? 0 : (isNaN(parseFloat(nom.impuestos.impuestos_horas_extra)) ? 0 : parseFloat(nom.impuestos.impuestos_horas_extra));

						var subtotal = formatMoney(tot_as + tot_HE + tot_div);
						var impuestos = formatMoney(imp_as + imp_div + imp_HE);
						var total = formatMoney(parseFloat(nom.total));
	                    datos_pagoNomina.push([trabSnap.key,trabajador.nombre,subtotal,impuestos,total]);
					}
				});
	            $('#' + id_datatable_pago_nomina).removeClass('hidden');
	            var tabla_procesos = $('#'+ id_datatable_pago_nomina).DataTable({
	                destroy: true,
	                data: datos_pagoNomina,
	                dom: 'Bfrtip',
	                buttons: ['excel'],
	                columns: [
	                    {title: "ID",width: 70},
	                    {title: "NOMBRE",width: 150},
	                    {title: "SUBTOTAL",width: 70},
	                    {title: "IMPUESTOS",width: 70},
	                    {title: "TOTAL",width: 70}
	                ],
	                language: idioma_espanol,
	            }); 
			});
		} else {
			//Cargar tabla
			document.getElementById(id_terminar_button_pago_nomina).disabled = false;
			headersPagoNomina();
			var year = $('#' + id_year_ddl_pago_nomina + " option:selected").val();
			var week = $('#' + id_semana_ddl_pago_nomina + " option:selected").text();
			firebase.database().ref(rama_bd_trabajadores).once('value').then(function(tSnap){
				firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
					snapshot.forEach(function(obraSnap){
						if(obraSnap.key != "total" && obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados"){
							obraSnap.child("trabajadores").forEach(function(trabSnap){
								//Si no existe ya, crealo.
								//console.log(trabSnap.val());
								if(trabSnap.child("dias/jueves/asistencia").val() || trabSnap.child("dias/viernes/asistencia").val() ||
								trabSnap.child("dias/lunes/asistencia").val() || trabSnap.child("dias/martes/asistencia").val() ||
								trabSnap.child("dias/miercoles/asistencia").val() || trabSnap.child("horas_extra").numChildren() > 0 || 
								trabSnap.child("diversos").numChildren() > 0){
									if(!trabajadores[trabSnap.key]){
										cargaRenglonPagoNomina(tSnap.child(trabSnap.key));
									}
								}
							});
						}
					});
					sortTablePagoNomina();
					enableTabWithEnter();
					document.getElementById(id_num_ren_pago_nomina).innerHTML = "Mostrando " + trabajadores.filter(Boolean).length + " entradas";
				});
			});
		}
	//});
});

function sortTablePagoNomina(){
	var rows, switching, i, x, y, shouldSwitch;
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
		//start by saying: no switching is done:
		switching = false;
		rows = tablePagoNomina.rows;
		/*Loop through all table rows (except the
		first, which contains table headers):*/
		for (i = 1; i < (rows.length - 1); i++) {
		  //start by saying there should be no switching:
		  shouldSwitch = false;
		  /*Get the two elements you want to compare,
		  one from current row and one from the next:*/
		  x = rows[i].getElementsByTagName("TD")[0];
		  y = rows[i + 1].getElementsByTagName("TD")[0];
		  //check if the two rows should switch place:
		  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
		    //if so, mark as a switch and break the loop:
		    shouldSwitch = true;
		    break;
		  }
		}
		if (shouldSwitch) {
		  /*If a switch has been marked, make the switch
		  and mark that a switch has been done:*/
		  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		  switching = true;
		}
	}
}

function cargaRenglonPagoNomina(trabSnap){
	var row = tablePagoNomina.insertRow(1);
	var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_pago = row.insertCell(2);

    var id_label = document.createElement('label');
    id_label.innerHTML = trabSnap.child("clave_pagadora").exists() ? trabSnap.child("clave_pagadora").val() : "HEAD ID: " + trabSnap.key;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabSnap.val().nombre;
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    var cant = document.createElement('input');
    cant.type = "text";
    cant.id = "cant_pagada_" + trabSnap.key;
    cant.placeholder = "Cantidad pagada";
    cell_pago.appendChild(cant);
	trabajadores[trabSnap.key] = trabSnap.key;
}

function headersPagoNomina() {
  var row = tablePagoNomina.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "CANTIDAD PAGADA";
}

$('#' + id_calcula_total_button_pago_nomina).click(function(){
	var suma = 0;
	$('[id^=cant_pagada_]').each(function(){
		var split = this.id.split("_");
		var id_trabajador = split[split.length - 1];
		suma += parseFloat($("#cant_pagada_" + id_trabajador).val());
	});
	alert("El total acumulado hasta este punto es de: " + suma);
});

$('#' + id_terminar_button_pago_nomina).click(function(){
    
	var year = $('#' + id_year_ddl_pago_nomina + " option:selected").val();
	var week = $('#' + id_semana_ddl_pago_nomina + " option:selected").text();
	firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
		firebase.database().ref(rama_bd_obras_magico).once('value').then(function(obraSnapshot){
			var obras_json = obraSnapshot.val();
			$('[id^=cant_pagada_]').each(function(){
				var split = this.id.split("_");
				var id_trabajador = split[split.length - 1];
				var sueldo_base = parseFloat(snapshot.child(id_trabajador + "/sueldo_base").val());
				var total = parseFloat($("#cant_pagada_" + id_trabajador).val());
				if(week == 1 && new Date(year,0,1).getDay() != 4){
					distribuyeEnAsistenciasPagoNomina(obras_json,total,week,year,snapshot.child(id_trabajador),"first", sueldo_base, id_trabajador);
					distribuyeEnAsistenciasPagoNomina(obras_json,total,getWeek(new Date(year-1,11,31).getTime())[0],year - 1,snapshot.child("id_trabajador"),"last", sueldo_base, id_trabajador);
				} else {
					distribuyeEnAsistenciasPagoNomina(obras_json,total,week,year,snapshot.child(id_trabajador),"NA", sueldo_base, id_trabajador);
				}
			});
			//console.log(obras_json);
			setTimeout(function(){sumaHEyDivKaizen(obras_json, week, year);}, 3000);
			//Meto el update en sumaHE para evitar la asincronia
			//firebase.database().ref(rama_bd_obras_magico).update(obras_json);
		});
	});
	setTimeout(function(){sumaTotalesPN(week,year);},3000);
   	if(week == 1 && new Date(year,0,1).getDay() != 4){
   		sumaTotalesPN(getWeek(new Date(year-1,11,31).getTime())[0],year-1);
   	}

	var tru = true;
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/terminada").set(tru);
	alert("Operación exitosa");
	document.getElementById(id_semana_ddl_pago_nomina).selectedIndex = 0;
	document.getElementById(id_terminar_button_pago_nomina).disabled = true;
});

function sumaHEyDivKaizen(obras_json, week, year){
	//firebase.database().ref(rama_bd_obras_magico).once('value').then(function(obrasSnapshot){//AQUI solo para kaizen ? borrar : dejar;
        //var obras_json = obrasSnapshot.val();//AQUI solo para kaizen ? borrar : dejar;
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){    
            snapshot.forEach(function(obraSnap){
                if(obraSnap.key != "total" && obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados"){
                    obraSnap.child("trabajadores").forEach(function(trabSnap){
                        trabSnap.child("horas_extra").forEach(function(heSnap){
                            var horas_extra = heSnap.val();
                            var proc = horas_extra.proceso;
                            var cantidad = horas_extra.horas;
                            var obra = obraSnap.key;
                            if(obra != "Atencion a Clientes" && obra != "Vacaciones"){
                                obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                if(proc != obra){
                                    var path = proc.split("-");
                                    if(path.length > 1){
                                        obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                    }
                                    obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                }
                            }
                        });
                        trabSnap.child("diversos").forEach(function(divSnap){
                            var diverso = divSnap.val();
                            var proc = diverso.proceso;
                            var cantidad = diverso.cantidad;
                            var obra = obraSnap.key;
                            if(obra != "Atencion a Clientes" && obra != "Vacaciones"){
                                obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                if(proc != obra){
                                    var path = proc.split("-");
                                    if(path.length > 1){
                                        obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                    }
                                    obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cantidad)*1.16).toFixed(2);
                                }
                            }
                        });
                    });
                }
            });
            firebase.database().ref(rama_bd_obras_magico).update(obras_json);
        });
    //});
}

function sumaTotalesPN(week, year){
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
		var total_week = 0;
		snapshot.forEach(function(childSnap){
			if(childSnap.key != "terminada" && childSnap.key != "total" && childSnap.key != "diversos_terminados" && childSnap.key != "horas_extra_terminadas" && childSnap.key != "asistencias_terminadas"){
				var total_obra = 0;
				childSnap.child("trabajadores").forEach(function(trabSnap){
					var trab = trabSnap.val();
					//console.log("trab: " + trab);
					var tot_HE = isNaN(parseFloat(trab.total_horas_extra)) ? 0 : parseFloat(trab.total_horas_extra);
					//console.log("tot_HE: " + tot_HE);
					var tot_as = isNaN(parseFloat(trab.total_asistencia)) ? 0 :  parseFloat(trab.total_asistencia);
					//console.log("tot_as: " + tot_as);
					var tot_div = isNaN(parseFloat(trab.total_diversos)) ? 0 : parseFloat(trab.total_diversos);
					//console.log("tot_div: " + tot_div);
					var imp_as = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_asistencia)) ? 0 : parseFloat(trab.impuestos.impuestos_asistencia));
					//console.log("imp_as: " + imp_as);
					var imp_div = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_diversos)) ? 0 : parseFloat(trab.impuestos.impuestos_diversos));
					//console.log("imp_div: " + imp_div);
					var imp_HE = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_horas_extra)) ? 0 : parseFloat(trab.impuestos.impuestos_horas_extra));
					//console.log("imp_HE: " + imp_HE);

					var total_trab = tot_HE + tot_as + tot_div + imp_as + imp_div + imp_HE;
					//console.log("total_trab: " + total_trab);
					total_obra = total_obra + total_trab;
					firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/trabajadores/" + trabSnap.key + "/total").set(total_trab);
				});
				firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/total").set(total_obra);
				total_week = total_week + total_obra;
			}
		});
		firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total").set(total_week);
	});
}
function distribuyeEnAsistenciasPagoNomina(obras_json,total,week,year,snapshot,semanaQuebrada, sueldo_base, id_trabajador){
	var sem_trab = snapshot.child("nomina/" + year + "/" + week).val();
	var asis = 0;
	var asistencias = {};

	if(semanaQuebrada == "first"){
		var year_anterior = year - 1;
		var lastWeek = snapshot.child("nomina/" + year_anterior + "/" + getWeek(new Date(year_anterior,11,31))[0]).val();
		sumaAsistenciasPN(lastWeek,asis);
	} else if (semanaQuebrada == "last"){
		var year_siguiente = year + 1;
		var nextWeek = snapshot.child("nomina/" + year_siguiente + "/1").val();
		sumaAsistenciasPN(nextWeek,asis);
	}

	asis = asistenciaDiaPN(sem_trab.lunes,asistencias,asis);
	asis = asistenciaDiaPN(sem_trab.martes,asistencias,asis);
	asis = asistenciaDiaPN(sem_trab.miercoles,asistencias,asis);
	asis = asistenciaDiaPN(sem_trab.jueves,asistencias,asis);
	asis = asistenciaDiaPN(sem_trab.viernes,asistencias,asis);

	//Guardo valores en rama trabajadores
	var impu = sem_trab.impuestos ? sem_trab.impuestos : 0;
	var total_asistencia = parseFloat(asis) * sueldo_base;
	var tot_div = isNaN(parseFloat(sem_trab.total_diversos)) ? 0 : parseFloat(sem_trab.total_diversos);
	var tot_HE = isNaN(parseFloat(sem_trab.total_horas_extra)) ? 0 : parseFloat(sem_trab.total_horas_extra);
	var imp_div = isNaN(parseFloat(impu.impuestos_diversos)) ? 0 : parseFloat(impu.impuestos_diversos);
	var imp_HE = isNaN(parseFloat(impu.impuestos_horas_extra)) ? 0 : parseFloat(impu.impuestos_horas_extra);

	var impuestos_asistencia = total - total_asistencia - tot_div - tot_HE - imp_div - imp_HE;

	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/total_asistencia").set(total_asistencia);
	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/impuestos/impuestos_asistencia").set(impuestos_asistencia);
	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/total").set(total);
	
	//console.log(asistencias);
	for(key in asistencias){
		var keyObra = key;

        var total_asistencia_obra = parseFloat((total_asistencia * asistencias[keyObra]["total"] / asis).toFixed(2));
        var impuestos_asistencia_obra = parseFloat((impuestos_asistencia * asistencias[keyObra]["total"] / asis).toFixed(2));
        var cant = total_asistencia_obra + impuestos_asistencia_obra;

        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + id_trabajador + "/total_asistencia").set(total_asistencia_obra);
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + id_trabajador + "/impuestos/impuestos_asistencia").set(impuestos_asistencia_obra);
        if(keyObra != "Atencion a Clientes" && keyObra != "Vacaciones"){
            //sumaMOKaizenPN(keyObra,cant);
			obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant)).toFixed(2);

			if(asistencias[keyObra]["procesos"]){
				//Obra no simple
                for(key in asistencias[keyObra]["procesos"]){
                    var path = key.split("-");

                    var total_asistencia_proc = parseFloat((total_asistencia * asistencias[keyObra]["procesos"][key] / asis).toFixed(2));
			        var impuestos_asistencia_proc = parseFloat((impuestos_asistencia * asistencias[keyObra]["procesos"][key] / asis).toFixed(2));
			        var cant_proc = total_asistencia_proc + impuestos_asistencia_proc

                    //sumaMOKaizenPN(keyObra + "/procesos/" + path[0],cant_proc);
					obras_json[keyObra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[keyObra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant_proc)).toFixed(2);
                    if(path.length > 1){
                    	//subproceso
                        //sumaMOKaizenPN(keyObra + "/procesos/" + path[0] + "/subprocesos/" + key,cant_proc);
						obras_json[keyObra]["procesos"][path[0]]["subprocesos"][key]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[keyObra]["procesos"][path[0]]["subprocesos"][key]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant_proc)).toFixed(2);
                    }
                }
            }
        }
	}
}

/*function sumaMOKaizenPN(query,cantidad){
    firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
        var anterior = snapshot.val();
        console.log(anterior);
        var nuevo = (parseFloat(anterior) + parseFloat(cantidad)).toFixed(2);
        console.log(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG");
        console.log(nuevo);
        firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
    });
}*/

function sumaAsistenciasPN(week,asis){
	if(week.lunes.asistencia){
		asis += 0.2;
	}
	if(week.martes.asistencia){
		asis += 0.2;
	}
	if(week.miercoles.asistencia){
		asis += 0.2;
	}
	if(week.jueves.asistencia){
		asis += 0.2;
	}
	if(week.viernes.asistencia){
		asis += 0.2;
	}
}

function asistenciaDiaPN(dia, asistencias, asis){
	if(dia != undefined){
	    var proc = dia.proceso;
	    if(proc == "Parado"){
	        proc = "MISC";
	    }
	    if(dia.asistencia == true){
	        asis += 0.2;
	        if(!asistencias[dia.obra]){
	        	asistencias[dia.obra] = {};
			}
	    	if(asistencias[dia.obra]["total"]) {
	            asistencias[dia.obra]["total"] = asistencias[dia.obra]["total"] + 0.2;
	        } else {
	            asistencias[dia.obra]["total"] = 0.2;
	        }
	        if(dia.obra != proc){ 
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
    return asis;
}