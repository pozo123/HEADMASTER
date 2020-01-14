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

function getWeek(timestamp) {
    week = 0;
    jueves_week = 0;
    miercoles_week = 0;
    actualDay = new Date(timestamp) // Objeto fecha del timestamp que se está deseando saber su semana.
    year = new Date(actualDay).getFullYear(); // año actual
    firstDay = new Date().setFullYear(year, 0, 1); // timestamps del 1ro de enero del año actual

    actualDay = Math.floor(actualDay / 86400000); // cuantos dias han pasado desde el 1ene70 hasta el primer dia del año
    yearFirstDay = Math.floor(firstDay / 86400000); // cuantos dias han pasado desde el 1ro de no se cuando de 1970
    offset = new Date(firstDay).getDay() - 4 // cuantos dias o menos del jueves es el 1ro de enero del año actual.
    primer_jueves = yearFirstDay;
    if(offset<0){
        primer_jueves = yearFirstDay - offset;
    } else if(offset>0){
        primer_jueves = yearFirstDay + (7 - offset);
    }
    var dias_desde_primer_jueves = actualDay - primer_jueves;

    if(dias_desde_primer_jueves >= 0) {
        week = Math.floor(dias_desde_primer_jueves/7) + 1;
    } else {
        var lastDayPreviousYear = new Date().setFullYear(year - 1, 11, 31);
        getWeek(lastDayPreviousYear)
    }   
    return [week,year];
}

function getDaysWeek(week, year){
    var firstDay = firstDay = new Date().setFullYear(year, 0, 1);
    var yearFirstDay = Math.floor(firstDay / 86400000); // cuantos dias han pasado desde el 1ro de no se cuando de 1970
    var offset = new Date(firstDay).getDay() - 4 // cuantos dias o menos del jueves es el 1ro de enero del año actual.
    var primer_jueves = yearFirstDay;
    if(offset<0){
        primer_jueves = yearFirstDay - offset;
    } else if(offset>0){
        primer_jueves = yearFirstDay + (7 - offset);
    }

    var jueves_week = ((week - 1)*7 + primer_jueves)*86400000 + 43200000; // sumo 12 horas para que no haya pex
    var miercoles_week = jueves_week + (6*86400000); //
    return[jueves_week, miercoles_week];
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

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseFloat(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    var parts = i.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    aux = parts[1] == undefined ? "00" : parts[1] + "00"
    aux = aux.slice(0,2)
    return "$" + s + parts[0] + "." + aux;
};

function deformatMoney(string){
    if(string == ""){
      string = "0";
    }
    var sin_comas = string.replace(/,/g,"");
    return parseFloat(sin_comas.replace("$",""));
}

function showFile(link){
    window.open(link, '_blank');
};


// funcion para ordenar ddls

function orderDdl(id_select) {
    // choose target dropdown
    var select = $('#' + id_select);
    select.html(select.find('option').sort(function(x, y) {
      // to change to descending order switch "<" for ">"
      return $(x).text() > $(y).text() ? 1 : -1;
    }));
  
    // select default item after sorting (first item)
    // $('select').get(0).selectedIndex = 0;
  };

  function isJSONEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function getTimestampDay(year,sem, day){
    // day en texto
    var res = 0;

    if(day == "jueves"){
        res = getDaysWeek(sem,year)[0];
    } else if(day == "viernes"){
        res = getDaysWeek(sem,year)[0] + 86400000*1;
    } else if(day == "lunes"){
        res = getDaysWeek(sem,year)[0] + 86400000*4;
    } else if(day == "martes"){
        res = getDaysWeek(sem,year)[0] + 86400000*5;
    } else if (day == "miercoles"){
        res = getDaysWeek(sem,year)[0] + 86400000*6;
    }
    return res;
}