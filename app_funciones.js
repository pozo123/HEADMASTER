

var rama_bd_obras_magico = "obras";
var rama_bd_obras = "obras";
var rama_bd_personal = "personal";
var rama_bd_mensajes = "mensajes";
var rama_bd_version = "info_web/version";


function gcd_two_numbers(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) 
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function refreshAll(){
  sumaEnFirebase(rama_bd_version, 0.001);
}

function sendMessage(uid_destinatario, uid_remitente, message){
  var message = {
    destinatario: uid_destinatario,
    remitente: uid_remitente,
    mensaje: message,
    leido: 0,
    timestamps: {
      enviado: new Date().getTime(),
      leido: 0,
    }
  }

  var messageKey = firebase.database().ref(rama_bd_mensajes).push(message).key;
  firebase.database().ref(rama_bd_personal + "/" + uid_destinatario + "/buzon/" + messageKey).set(message);
}

function markMessageAsRead(uid_lector, id_message){
  var updates = {};
  updates[id_message] = null;
  firebase.database().ref(rama_bd_personal + "/" + uid_lector + "/buzon").update(updates);
  var tru = true;
  firebase.database().ref(rama_bd_mensajes + "/" + id_message + "/leido").set(tru);
  var now = new Date().getTime();
  firebase.database().ref(rama_bd_mensajes + "/" + id_message + "/timestamps/leido").set(now);
}

//tipo = "global" -> todo el kaizen (proceso y subproceso no son necesarios) o "unico" (sólo se calcula de uno);
function calculaKaizen(obra,tipo,proceso,subproceso){
  firebase.database().ref(rama_bd_obras + "/" + obra).once('value').then(function(snapshot){
    if(snapshot.exists()){
      var json_obra = snapshot.val();
      if(tipo == "global"){
        snapshot.child("procesos").forEach(function(procSnap){
          if(procSnap.child("num_subprocesos").val() == 0){
            calculaProfitKaiz(json_obra["procesos"][procSnap.key]);
          } else {
            procSnap.child("subprocesos").forEach(function(subpSnap){
              calculaProfitKaiz(json_obra["procesos"][procSnap.key]["subprocesos"][subpSnap.key]);
            });
            sumaValoresKaiz(json_obra["procesos"][procSnap],"proceso");
          }
        });
        sumaValoresKaiz(json_obra,"obra");
      } else {
        if(proceso != undefined){
          if(json_obra["procesos"][proceso]["num_subprocesos"] == 0){
            calculaProfitKaiz(json_obra["procesos"][proceso]);
          } else {
            if(subproceso != undefined){
              calculaProfitKaiz(json_obra["procesos"][proceso]["subprocesos"][subproceso]);
            }
            sumaValoresKaiz(json_obra["procesos"][proceso],"proceso");
          }
        }
        sumaValoresKaiz(json_obra,"obra");
      }
      console.log(json_obra);
      //firebase.database().ref(rama_bd_obras + "/" + obra).update(json_obra);
    } else { 
      alert("No existe esa obra");
    }
  });
}

function sumaValoresKaiz(pointer,tipo){
  var suma_kaiz = kaiz;
  var child = tipo == "proceso" ? "subprocesos" : "procesos";
  for(key in pointer[child]){
    var kaiz_local = pointer["subprocesos"][key]["kaizen"];
    suma_kaiz["PROYECTOS"]["PPTO"] += parseFloat(kaiz_local["PROYECTOS"]["PPTO"]);
    suma_kaiz["PROYECTOS"]["PAG"] += parseFloat(kaiz_local["PROYECTOS"]["PAG"]);
    suma_kaiz["PRODUCCION"]["COPEO"]["PREC"] += parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["PREC"]);
    suma_kaiz["PRODUCCION"]["COPEO"]["COPEO"] += parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["COPEO"]);
    suma_kaiz["PRODUCCION"]["COPEO"]["PAG"] += parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["PAG"]);
    suma_kaiz["PRODUCCION"]["SUMINISTROS"]["CUANT"] += parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["CUANT"]);
    suma_kaiz["PRODUCCION"]["SUMINISTROS"]["OdeC"] += parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["OdeC"]);
    suma_kaiz["PRODUCCION"]["SUMINISTROS"]["PAG"] += parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["PAG"]);
    suma_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["EST"] += parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["EST"]);
    suma_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PAG"] += parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["PAG"]);
    suma_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"] += parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]);
    suma_kaiz["ADMINISTRACION"]["ANTICIPOS"]["PAG"] += parseFloat(kaiz_local["ADMINISTRACION"]["ANTICIPOS"]["PAG"]);
    suma_kaiz["ADMINISTRACION"]["ANTICIPOS"]["PPTO"] += parseFloat(kaiz_local["ADMINISTRACION"]["ANTICIPOS"]["PPTO"]);
  }
  pointer["kaizen"] = suma_kaiz;
}
//Recibe snapshot del objeto que tenga un kaizen (proc o subproc). Obra no porque ese se calcula sumando, por lo de prec/copeo y cuant/odec
function calculaProfitKaiz(pointer){
  var kaiz_local = pointer["kaizen"];
  var proy_ppto = parseFloat(kaiz_local["PROYECTOS"]["PPTO"]);
  var proy_pag = parseFloat(kaiz_local["PROYECTOS"]["PAG"]);
  var prod_cop_prec = parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["PREC"]);
  var prod_cop_copeo = parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["COPEO"]);
  var prod_cop_pag = parseFloat(kaiz_local["PRODUCCION"]["COPEO"]["PAG"]);
  var prod_sum_cuant = parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["CUANT"]);
  var prod_sum_odec = parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["OdeC"]);
  var prod_sum_pag = parseFloat(kaiz_local["PRODUCCION"]["SUMINISTROS"]["PAG"]);
  var admin_est_est = parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["EST"]);
  var admin_est_pag = parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["PAG"]);
  var admin_est_ppto = parseFloat(kaiz_local["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]);
  var admin_ant_pag = parseFloat(kaiz_local["ADMINISTRACION"]["ANTICIPOS"]["PAG"]);
  var admin_ant_ppto = parseFloat(kaiz_local["ADMINISTRACION"]["ANTICIPOS"]["PPTO"]);

  var costo_cop = prod_cop_copeo > 0 ? prod_cop_copeo : prod_cop_prec;
  var costo_sum = prod_sum_odec > 0 ? prod_sum_odec : prod_sum_cuant;
  kaiz_local["PROFIT"]["PROG"]["BRUTO"] = (admin_est_ppto + admin_ant_ppto) * 0.8 - costo_cop - costo_sum - proy_ppto;
  kaiz_local["PROFIT"]["PROG"]["NETO"] = profit_prog_bruto * 0.6;

  kaiz_local["PROFIT"]["REAL"]["BRUTO"] = (admin_ant_pag + admin_est_pag) * 0.8 - prod_cop_pag - prod_sum_pag - proy_pag;
  kaiz_local["PROFIT"]["REAL"]["NETO"] = profit_real_bruto * 0.6;
}

function sumaEnFirebase(query, cantidad){
    firebase.database().ref(query).once('value').then(function(snapshot){
        if(snapshot.exists()){
            var anterior = parseFloat(snapshot.val());
            if(isNaN(anterior)){
                console.log("Valor anterior es NaN");
            } else {
                var nuevo = anterior + parseFloat(cantidad);
                firebase.database().ref(query).set(nuevo);
            }
        } else {
            console.log("El snapshot de " + query + " no existe");
        }
    });
}

//Recibe un string viejo y uno nuevo para cambiarlo en toda la bd
function replaceStringsInKeysAndValues(oldString, newString){
    firebase.database().ref().once('value').then(function(snapshot){
        var updates = snapshot.val();
        recorreRamaReplaceString(snapshot,snapshot,updates,oldString,newString);        
        console.log(snapshot.val());
        console.log(updates);
        firebase.database().ref().update(updates);
    });
}
function recorreRamaReplaceString(snapshot,originalSnap,updates,oldString,newString){
    if(snapshot.hasChildren()){
        snapshot.forEach(function(childSnap){
            recorreRamaReplaceString(childSnap,originalSnap,updates, oldString, newString);
        });
        //console.log(snapshot.key);
        replaceStringInKey(oldString,newString,updates,snapshot,originalSnap);
    } else {
        //Es hoja
        replaceStringInValue(oldString,newString,updates,snapshot);
        replaceStringInKey(oldString,newString,updates,snapshot,originalSnap);
    }
}

function replaceStringInValue(oldString,newString,updates,snapshot){
    //console.log(snapshot.val());
    //console.log(oldString);
    if(snapshot.val() == oldString){
      var path = updates;
      var i = 0;
        for(i=0;i<snapshot.ref.path.pieces_.length - 1;i++){
          path = path[snapshot.ref.path.pieces_[i]];
          //console.log(path);
        }
        path[snapshot.ref.path.pieces_[i]] = newString;
        //console.log(path[snapshot.ref.path.pieces_[i]])
    }
}

function replaceStringInKey(oldString,newString,updates,snapshot,originalSnap){
    if(snapshot.key == oldString){
        var ref_minus_key = "";
        //console.log(snapshot.ref.path.pieces_);
        var path = updates;
        for(i=0;i<snapshot.ref.path.pieces_.length - 1;i++){
          path = path[snapshot.ref.path.pieces_[i]];
          ref_minus_key = ref_minus_key.concat(snapshot.ref.path.pieces_[i] + "/");
          //console.log(ref_minus_key);
        }
        path[newString] = originalSnap.child(ref_minus_key + oldString).val();
        path[oldString] = null;
    }

}


//Recibe el nombre de la hora y regresa un json SCORE:{clave_proceso: horas_trabajadas}
/*function loadScoreKaizen(obra){
  var procesos = {};
  firebase.database().ref(rama_bd_obras_magico + "/" + obra).once('value').then(function(snapshot){
    snapshot.child("procesos").forEach(function(proc_snap){
      var proc = proc_snap.val();
      procesos[proc.clave] = {PROYECTOS:{PPTO:0}};
      firebase.database().ref(rama_bd_obras + "/" + obra + "/presupuestos/").orderByChild("proceso").equalTo(proc.clave).once('value').then(function(snapshot){
        snapshot.forEach(function(ppto_snap){
          var ppto = ppto_snap.val();
          procesos[proc.clave]["PROYECTOS"]["PPTO"] = procesos[proc.clave]["PROYECTOS"]["PPTO"] + ppto.horas_trabajadas;
        });
      });
    });
    console.log(procesos);
    //firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos").update(procesos);
  });
}*/

function pistaDeAuditoria(){
  var pda = {
    uid: firebase.auth().currentUser.uid,
    timestamp: new Date().getTime(),
  };
  return pda;
}

//Recibe los COSTOS totales de una obra y regresa el precio de venta para obtener cierto VALOR deseado
//Si el criterio es "porcentaje" (utilidad con respecto al precio de venta) debe ser entre 0 y 1 (30% = 0.3)
//Si el criterio es "cantidad" se ingresa el monto exacto que se quiere de utilidad
//Si el criterio es "precioVenta" el valor es el precio al que se va a vender, y se regresa el valor del profit (en %)
function calculaUtilidad(costos, criterio, valor){
  var precioVenta;
  if(criterio == "porcentaje"){
    precioVenta = costos/(0.8-valor);
    return precioVenta;
  } 
  if(criterio == "cantidad"){
    precioVenta = (valor + costos)/0.8;
    return precioVenta;
  }
  if(criterio == "precioVenta"){
    var profitCantidad = 0.8*valor - costos;
    var profitPorcentaje = profitCantidad/valor;
    return profitPorcentaje;
    //return profitCantidad;
  }
}

function descargaRespaldo(){
  var d = new Date();
  firebase.database().ref().once('value').then(function(snapshot){
    var rama = snapshot.val();
    snapshot.forEach(function(childSnap){
      downloadObjectAsJson(childSnap.val(),childSnap.key + "-respaldoHEAD-" + d.getDate() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getFullYear());
      console.log(childSnap.key);
    });
    //downloadObjectAsJson(rama);
    //alert("Descarga exitosa");
  });
}

function downloadObjectAsJson(exportObj, exportName){
  var d = new Date();
  exportName = exportName == undefined ? "respaldoHEAD-" + d.getDate() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getFullYear() : exportName;
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

//input un dia en ms
//regresa un array [week, year]
//var week = getWeek(dia_en_ms)[0];
//var year = getWeek(dia_en_ms)[1];
//ej getWeek(new Date(2027,0,2).getTime())
//La primera semana del año son todos aquellos dias que queden antes del primer miercoles del año.
//La primera y ultima semana del año pueden tener menos días si no se empieza en jueves o termina en miercoles

function getWeek(dia) {
  var d = new Date(dia);

  var y = new Date(d).getFullYear();
  var timestmp = new Date().setFullYear(y, 0, 1);
  var yearFirstDay = Math.floor(timestmp / 86400000);
  var today = Math.floor(d / 86400000);
  var offset = new Date(timestmp).getDay() - 4;
  var jueves = yearFirstDay;
  if(offset<0){
    jueves = yearFirstDay - offset;
  } else if(offset>0){
    jueves = yearFirstDay + (7 - offset);
  }
  var daysSinceJueves = today - jueves;
  var week = Math.floor(daysSinceJueves / 7) + 2;
  if(offset == 0){
    week--;
  }
  
  return [week,y];
}


//regresa un array con dias (ej ["jueves", "viernes"]) pertenecientes a la <semana> ("first" o "last") del año year
//ej: getWeekDiaria("first",2019) me va a dar los días que entran en la semana 1 del 2019 = ["martes","miercoles"]
function getWeekDiaria(semana,year){
  var arrayWeek = ["jueves","viernes","sabado","domingo","lunes","martes","miercoles"];
    var resultado = [];
  if(semana == "first"){
      var firstDayOfYear = new Date(year, 0, 1).getDay();
    var offset = firstDayOfYear - 4;
        var daysToJueves = offset;
        if(offset < 0){
          daysToJueves = -offset;
        } else {
          daysToJueves = 7 - (firstDayOfYear - 4);
        }
        for(i = daysToJueves - 1; i >= 0; i--){
          resultado[daysToJueves - 1 - i] = arrayWeek[6-i];
        }
        return(resultado);
    } else { 
      var lastDayOfYear = new Date(year,11,31).getDay();
        var offset = lastDayOfYear - 4;
        if(offset < 0){
          offset = offset + 7;
        }
        for(i=0;i<=offset;i++){
          resultado[i] = arrayWeek[i];
        }
        return(resultado);
    }
}

function deformatMoney(string){
  var sin_comas = string.replace(/,/g,"");
  return parseFloat(sin_comas.replace("$",""));
}

function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseFloat(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  var parts = i.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "$" + s + parts.join(".");
  //return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function highLight(id){
  document.getElementById(id).style.background = "#e6fff2";
  console.log("Gray: " + id);
    setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
}

const porcentaje_indirectos = 0.2;

const kaiz = {
    PROYECTOS: {
        PPTO: 0,
        PAG: 0,
    },
    PRODUCCION: {
        SUMINISTROS: {
            CUANT: 0,
            OdeC: 0,//-1
            PAG: 0,
        },
        COPEO: {
            PREC: 0,
            COPEO: 0,//-1
            PAG: 0,
        },
    },
    ADMINISTRACION: {
        ESTIMACIONES: {
            PPTO: 0,
            EST: 0,
            PAG: 0,
        },
        ANTICIPOS: {
            PPTO: 0,
            PAG: 0,
        },
    },
    PROFIT: {
        PROG: {
            BRUTO: 0,
            NETO: 0,
        },
        REAL: {
            BRUTO: 0,
            NETO: 0,
        },
    }
};