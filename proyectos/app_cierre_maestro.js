var id_cerrar_button_cierre = "cerrarDia";
var rama_bd_inges = "inges";
var rama_bd_registros = "registros";
var rama_bd_obras = "obras";

var interval;

$(document).ready(function(){
    checkTime();
    setInterval(checkTime, 3600000);
});

$('#' + id_cerrar_button_cierre).click(function(){
	cierreMaestro(false);
});

function checkTime(){
	var hora = new Date().getHours();
	var minutos;
	if(hora >= 17){
		minutos = new Date().getMinutes();
		var ms_que_faltan = (60 - minutos)*60000;
		interval = setInterval(endDay, ms_que_faltan);
	}
};

function endDay(){
	cierreMaestro(true);
	clearInterval(interval);
}

function cierreMaestro(automatico){
	//var clicked_cierre = true;
	firebase.database().ref(rama_bd_inges).orderByChild("status").equalTo(true).once('value').then(function(snapshot){
		snapshot.forEach(function(inge_snap){
		var ing = inge_snap.val();
			firebase.database().ref(rama_bd_registros).orderByChild("status").equalTo(false).once('value').then(function(snapshot){
				snapshot.forEach(function(childSnap){
					var regis = childSnap.val();
		            if(regis.inge == ing.nombre){// && clicked_cierre === true){
						var horas_registro = new Date().getTime() - regis.checkin;
		                var status = true;
		                firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/status").set(status);
						firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/horas").set(horas_registro);
						var username = ing.uid;
						var stat = false;
						firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(stat);

						firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + regis.obra).orderByKey().on("child_added", function(snapshot){
							var aux = snapshot.val();
							if(aux.presupuesto = regis.presupuesto){
								var horas_previas = aux.horas_trabajadas;
								var horas_nuevas = parseFloat(horas_registro) + parseFloat(horas_previas)
								firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + regis.obra + "/" + regis.presupuesto + "/horas_trabajadas").set(horas_nuevas);
							}
						});
						var esp;
						if(ing.especialidad == 1)
						esp = "ie";
						else if(ing.especialidad == 2)
						esp = "ihs";
						else if(ing.especialidad == 3)
						esp = ing.esp_chamba;
						else
						esp = "NA";
						if(esp !== "NA" && regis.obra != "Otros"){
							firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").once("value").then(function(snapshot){
								var horas_trabajadas = snapshot.val();
								if(horas_trabajadas == null){
									var colab = {
										horas: 0,
										horas_trabajadas: horas_registro/3600000,
										nombre: regis.inge,
									}
									firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username).set(colab);
								} else {
									horas_trabajadas = horas_trabajadas + (horas_registro)/3600000;
									firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").set(horas_trabajadas);	
								}
							});
							firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto).once("value").then(function(snapshot){
								var presu = snapshot.val();
								var horas_trabajadas_p;
								if(presu.horas_trabajadas !== null)
									horas_trabajadas_p = presu.horas_trabajadas + (horas_registro)/3600000;
								else
									horas_trabajadas_p = horas_registro/3600000;
								firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_trabajadas_p);
							});
						}
						if(automatico){
							console.log("Sesion de " + ing.nombre + " cerrada.");
						} else {
							alert("Sesion de " + ing.nombre + " cerrada.");
						}
		            }	
				});
			});
		});		
	});
	//clicked_cierre = false;
};