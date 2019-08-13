function highLight(id){
    document.getElementById(id).style.background = "#e6fff2";
    //console.log("Gray: " + id);
    setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
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

// función para revisar si un string es una preposicion o artículo
// sirve para ver qué palabaras en un apellido son con letras minúsculas solamente.
function isPrepOrArt(string){
    var preposiciones = ["a", "ante", "del", "bajo", "cabe", "con", "contra", "de", "desde", "durante", "en", "entre", "hacia", "hasta", "mediante", "para", "por", "según", "sin", "so", "sobre", "tras", "versus", "vía"];
    var articulos =  ["el", "la", "los", "las", "un", "una", "unos", "unas"];

    if(preposiciones.includes(string.toLowerCase()) || articulos.includes(string.toLowerCase())){
        return true;
    } else {
        return false;
    }
}

// función para validar email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function charactersAllowed(string,e){
    if((string).indexOf(String.fromCharCode(e.keyCode))===-1){
        e.preventDefault();
        return false;
   }
}
function deleteBlankSpaces(id_text){
    var aux = $('#' + id_text).val();
    while(aux.charAt(0) == " "){
        aux = aux.slice(1);
    }
    while(aux.charAt(aux.length-1) == " "){
        aux = aux.slice(0,-1);
    }
    for(var i=0; i<aux.length;i++){
        if(aux.charAt(i) == " " && aux.charAt(i+1) == " "){
            aux = aux.slice(0,i) + aux.slice(i+1);
            i = i-1;
        }
    }
    return aux;
}


// función para generar las pda's
function pda(tipo,ruta, registro_antiguo){
    var pda_path = {};
    var registro = {};

    var fecha = new Date().getTime();

    registro["id_colaborador"] = uid_usuario_global;
    registro["fecha"] = fecha;
    registro["tipo"] = tipo;
    registro["ruta_bd"] = ruta;
    registro["registro_antiguo"] = registro_antiguo;

    // push en registros y listas
    firebase.database().ref(rama_bd_pda + "/pistas").push(registro).then(function(snapshot){
        var regKey = snapshot.key;
        pda_path["listas/colaboradores/" + uid_usuario_global + "/" + regKey] = true;
        pda_path["listas/fechas/" + aaaammdd(fecha) + "/" + regKey] = true;
        pda_path["listas/tipos/" + tipo + "/" + regKey] = true;
        firebase.database().ref(rama_bd_pda).update(pda_path);
    });
}

// funcion que devuelve un string con formato aaaammdd

function aaaammdd(timestamp){
    var fecha = new Date(timestamp);
    return fecha.getFullYear() + ("0" + (fecha.getMonth() + 1)).slice(-2) + ("0" + fecha.getDate()).slice(-2)
}