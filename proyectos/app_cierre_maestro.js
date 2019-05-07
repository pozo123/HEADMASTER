var id_cerrar_button_cierre = "cerrarDia";
var rama_bd_personal = "test/personal";
var rama_bd_registros = "test/proyectos/registros";
var rama_bd_obras = "test/obras";

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
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        snapshot.forEach(function(inge_snap){
            if(inge_snap.child("areas/proyectos").val()){
                var ing = inge_snap.val();
                if(ing.status == true){
                    var hoy = getWeek(new Date().getTime());
                    firebase.database().ref(rama_bd_registros).once('value').then(function(childSnap){
                        childSnap.forEach(function(yearSnap){
                            yearSnap.forEach(function(weekSnap){
                                weekSnap.forEach(function(regSnap){
                                    var reg = regSnap.val();
                                    if(reg.status == false && reg.inge == inge_snap.key){
                                        cierraRegistro(regSnap, yearSnap.key + "/" + weekSnap.key + "/" + regSnap.key);
                                    }
                                });
                            });
                        });
                        var fal = false;
                        firebase.database().ref(rama_bd_personal + "/" + inge_snap.key + "/status").set(fal);                           
                        if(automatico){
                            console.log("Sesion de " + ing.nombre + " cerrada.");
                        } else {
                            alert("Sesion de " + ing.nombre + " cerrada.");
                        }
                        setTimeout(refreshAll(), 30000);
                    });
                }
            }
        });
    });
}

function cierraRegistro(regSnap, path){
    var reg = regSnap.val();
    var checkin = parseInt(reg.checkin);
    var esp = reg.esp;
    var horas = new Date().getTime() - checkin;
    var updates = {
        horas: horas,
        status: true,
    }
    firebase.database().ref(rama_bd_registros + "/" + path).update(updates);
    if(reg.obra != "Otros"){
        var cant_horas = parseFloat(horas / 3600000);
        //var cant = cant_horas * precio_hora;
        var proc_path = reg.proceso.split("-");
        if(proc_path.length > 1){
            //sumaScoreKaizen(reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso, cant);
            sumaScoreProc(reg.obra + "/procesos/" + proc_path[0] + "/subprocesos/" + reg.proceso, cant_horas,esp,reg.inge);
        } else {
            sumaScoreProc(reg.obra + "/procesos/" + reg.proceso, cant_horas,esp,reg.inge);
        }
        //sumaScoreKaizen(reg.obra + "/procesos/" + proc_path[0], cant);
        //sumaScoreKaizen(reg.obra,cant);
    }
}

function sumaScoreProc(query,cant){
    firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE").once('value').then(function(snapshot){
        if(snapshot.exists()){
            var total = snapshot.child("total_trabajado").exists() ? parseFloat(snapshot.child("total_trabajado").val()) : 0;
            var horas_trabajador = snapshot.child("inges/" + user + "/horas_trabajadas").exists() ? parseFloat(snapshot.child("inges/" + user + "/horas_trabajadas").val()) : 0;
            total += cant;
            horas_trabajador += cant;
            firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE/total_trabajado").set(total);
            firebase.database().ref(rama_bd_obras + "/" + query + "/SCORE/inges/" + user + "/horas_trabajadas").set(horas_trabajador);
        }
    });
}
/*
function sumaScoreKaizen(query,cant){
    firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PROYECTOS/PAG").once('value').then(function(snapshot){
        var precio_anterior = snapshot.exists() ? parseFloat(snapshot.val()) : 0;
        var nuevo_precio = precio_anterior + cant;
        firebase.database().ref(rama_bd_obras + "/" + query + "/kaizen/PROYECTOS/PAG").set(nuevo_precio);
    });
}*/