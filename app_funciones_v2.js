function highLight(id){
    document.getElementById(id).style.background = "#e6fff2";
    //console.log("Gray: " + id);
    setTimeout(function(){  document.getElementById(id).style.background = "white";}, 1000);
}

// función estética que hace uso de la función highLight
function highLightAll(){
    highLight(id_email_colaborador);
    highLight(id_nickname_colaborador);
    highLight(id_nombre_colaborador);
    highLight(id_paterno_colaborador);
    highLight(id_materno_colaborador);
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