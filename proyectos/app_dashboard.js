// JavaScript source code
var id_card_column_dashboard = "dashCards";

var rama_bd_inges = "proyectos/inges";
var rama_bd_registros = "proyectos/registros";

$(document).ready(function(){
  loadDashcards();
  setInterval(loadDashcards, 1800000);
  firebase.database().ref(rama_bd_registros).on("child_changed", function(snapshot){
    loadDashcards();
  }); 


/*   $('#fullpage').fullpage({
    sectionsColor: ['#1bbc9b', '#4BBFC3'],
    loopBottom: true,
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    afterRender: function () {
        setInterval(function () {
            $.fn.fullpage.moveSlideRight();
        }, 1000);
      }
  }); */

});

var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

$('#fullScreen').click(function () {
  openFullscreen();
  $('#notFullScreen').removeClass('hidden');
  $('#fullScreen').addClass('hidden');
});
$('#notFullScreen').click(function () {
  closeFullscreen();
  $('#fullScreen').removeClass('hidden');
  $('#notFullScreen').addClass('hidden');
});



function loadDashcards(){
  // aquí habías puesto el flag
  //$('#' + id_card_column_dashboard_IHS).empty();
  //$('#' + id_card_column_dashboard_IE_IHS).empty();
  //$('#' + id_card_column_dashboard_IE).empty();
  $('#' + id_card_column_dashboard).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
    var flag = true;
    var inge = snapshot.val();
    var card = document.createElement('div');
    card.id = "card_" + inge.uid;
    var font ="";
    
    if(inge.especialidad === 1){
      //id_card_column_dashboard = "dashCards_IE";
      card.className = "card card_dash border-danger mb-3";
      font="danger";
      //electricidad
    } else if(inge.especialidad === 2){
      //id_card_column_dashboard = "dashCards_IHS";
      card.className = "card card_dash border-info mb-3";
      font="info";
      
      //plomeria
    } else {//if(inge.especialidad === 3){
      //id_card_column_dashboard = "dashCards_IE_IHS";
      card.className = "card card_dash border-secondary mb-3";
      //ambas
    }
    
    card.setAttribute("style", "max-width: 20rem; min-width:20rem;");
    
    if(inge.permisos.perfil === true){
      if(inge.status === true){
        //alert(inge.nombre + " " + "ingeStatus" + " " + inge.status)
        firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(inge.nombre).on("child_added",function(snapshot){
          var reg = snapshot.val();
          var nombre_obra = reg.obra;
          var nombre_presu = reg.presupuesto;
          var username = inge.uid;
          if(reg.status === false && flag === true){
            flag = false;
            //card.className = "card card_dash border-success mb-3";
            if(reg.obra !== "Otros"){
              firebase.database().ref(rama_bd_obras + "/" + nombre_obra + "/presupuestos").orderByKey().equalTo(nombre_presu).once('child_added').then(function(snapshot){
                var presu = snapshot.val();
                
                var horas_totales_presu;
                var horas_totales_personales;
                var horas_trabajadas_presu = 0;
                var horas_trabajadas_personales = 0;
                
                var esp = inge.esp_chamba;
                
                var nombre_ing;
                var horas_personales_base;
                
                if(esp == "ie"){
                  horas_totales_presu = presu.colaboradores_asignados.horas_totales_ie;
                }
                else if(esp == "ihs"){
                  horas_totales_presu = presu.colaboradores_asignados.horas_totales_ihs;
                }
                
                if(presu.colaboradores_asignados != null){
                  firebase.database().ref(rama_bd_obras + "/" + nombre_obra + "/presupuestos/" + nombre_presu + "/colaboradores_asignados/" + esp).once('value').then(function(snapshot){
                    var ings = snapshot.val();
                    var keys = Object.keys(ings);
                    for(var i = 0; i<keys.length; i++){
                      if(keys[i] === username){
                        horas_totales_personales = ings[keys[i]].horas;//en horas (no mili)
                        horas_personales_base = ings[keys[i]].horas_trabajadas; //en horas (no mili)
                        nombre_ing = ings[keys[i]].nombre;
                        //alert(nombre_ing);
                      }
                      horas_trabajadas_presu += ings[keys[i]].horas_trabajadas;
                    }
                    firebase.database().ref(rama_bd_registros).orderByChild("status").equalTo(false).on('value',function(snapshot){
                      var regs = snapshot.val();
                      var keys = Object.keys(regs);
                      for(var i = 0; i<keys.length; i++){
                        if(regs[keys[i]].presupuesto == nombre_presu){
                          //alert(regs[keys[i]].inge)
                          //alert(nombre_ing)
                          if(regs[keys[i]].inge === nombre_ing){
                            horas_trabajadas_personales = horas_personales_base + (new Date().getTime() - regs[keys[i]].checkin)/3600000;
                            //alert(horas_personales_base);
                            //alert(regs[keys[i]].checkin);
                            //alert(horas_trabajadas_personales);
                          }
                          horas_trabajadas_presu += (new Date().getTime() - regs[keys[i]].checkin)/3600000;
                        }
                      }
                      horas_trabajadas_personales = horas_trabajadas_personales.toFixed(2);
                      horas_trabajadas_presu = horas_trabajadas_presu.toFixed(2);
                      //---------------
                      var header = document.createElement('div');
                      header.className = "card-header text-center";
                      var row = document.createElement('div');
                      row.className = "row";
                      var col1 = document.createElement('div');
                      col1.className = "col-md-8";
                      var p_obra = document.createElement("p")
                      p_obra.setAttribute("style", "font-size: 1.1em; color:black;");
                      var node_obra = document.createTextNode(reg.obra);
                      p_obra.appendChild(node_obra);
                      col1.appendChild(p_obra);
                      
                      
                      //
                      
                      var col2 = document.createElement('div');
                      col2.className = "col-md-4";
                      var p_horas = document.createElement("p")
                      p_horas.setAttribute("style", "font-size: 0.8em;");
                      var node_horas = document.createTextNode(horas_trabajadas_presu + "/ ");
                      var span_horas = document.createElement('span');
                      span_horas.setAttribute("style", "color:red;");
                      var node_span = document.createTextNode(horas_totales_presu);
                      span_horas.appendChild(node_span);
                      
                      p_horas.appendChild(node_horas);
                      p_horas.appendChild(span_horas);
                      col2.appendChild(p_horas);
                      
                      row.appendChild(col1);
                      row.appendChild(col2);
                      
                      header.append(row)
                      
                      var body = document.createElement('div');
                      body.className = "card-body text-center text-"+font;
                      
                      var p_presupuesto = document.createElement("h6");
                      p_presupuesto.setAttribute("style", "font-size: 1.0em;");
                      var node_presupuesto = document.createTextNode(reg.presupuesto);
                      p_presupuesto.appendChild(node_presupuesto);
                      // aquí se necesita el query para el nickName;
                      var p_nickname = document.createElement("h6");
                      p_nickname.setAttribute("style", "font-size: 1.2em;");
                      var node_nickname = document.createTextNode(inge.nickname);
                      p_nickname.appendChild(node_nickname);
                      
                      var p_status = document.createElement("h6");
                      p_status.className = "text-success";
                      p_status.setAttribute("style", "font-size: 1.0em;");
                      var node_status = document.createTextNode("Activo");
                      p_status.appendChild(node_status);
                      
                      body.appendChild(p_presupuesto);
                      body.appendChild(p_nickname);
                      body.appendChild(p_status);
                      
                      //var p_checkin = document.createElement("h6");
                      //var d = new Date(reg.checkin);
                      //ar node_checkin = document.createTextNode("Hora de Inicio: " + d.toLocaleTimeString());
                      //p_obra.appendChild(node_obra);
                      //p_checkin.appendChild(node_checkin);
                      
                      var footer = document.createElement('div');
                      footer.className = "card-footer text-center";
                      var row_footer = document.createElement('div');
                      row_footer.className = "row";
                      
                      var col3 = document.createElement('div');
                      col3.className = "col-md-6";
                      var p_horas_inge_ejecutadas = document.createElement('p');
                      p_horas_inge_ejecutadas.setAttribute("style", "font-size: 0.7em;");
                      var node_horas_ejecutadas = document.createTextNode("H. Ejecutadas: ");
                      var span_horas_ejecutadas = document.createElement('span');
                      span_horas_ejecutadas.setAttribute("style", "color:red;");
                      var node_span_horas_ejecutadas = document.createTextNode(horas_trabajadas_personales);
                      span_horas_ejecutadas.appendChild(node_span_horas_ejecutadas);
                      p_horas_inge_ejecutadas.appendChild(node_horas_ejecutadas);
                      p_horas_inge_ejecutadas.appendChild(span_horas_ejecutadas);
                      
                      col3.appendChild(p_horas_inge_ejecutadas);
                      
                      var col4 = document.createElement('div');
                      col4.className = "col-md-6";
                      var p_horas_inge_presupuestadas = document.createElement('p');
                      p_horas_inge_presupuestadas.setAttribute("style", "font-size: 0.7em;");
                      var node_horas_presupuestadas = document.createTextNode("H. Programadas: ");
                      var span_horas_presupuestadas = document.createElement('span');
                      span_horas_presupuestadas.setAttribute("style", "color:red;");
                      var node_span_horas_presupuestadas = document.createTextNode(horas_totales_personales);
                      span_horas_presupuestadas.appendChild(node_span_horas_presupuestadas);
                      p_horas_inge_presupuestadas.appendChild(node_horas_presupuestadas);
                      p_horas_inge_presupuestadas.appendChild(span_horas_presupuestadas);
                      
                      col4.appendChild(p_horas_inge_presupuestadas);
                      
                      row_footer.appendChild(col3);
                      row_footer.appendChild(col4);
                      
                      footer.appendChild(row_footer);
                      
                      
                      
                      card.appendChild(header);
                      card.appendChild(body);
                      card.appendChild(footer);
                      var div = document.getElementById(id_card_column_dashboard);
                      div.appendChild(card);
                    });
                  });
                } else{
                  //Si no hay horas
                  var header = document.createElement('div');
                  header.className = "card-header text-center";
                  var row = document.createElement('div');
                  row.className = "row";
                  var col1 = document.createElement('div');
                  col1.className = "col-md-8";
                  var p_obra = document.createElement("p")
                  p_obra.setAttribute("style", "font-size: 1.1em; color:black;");
                  var node_obra = document.createTextNode(reg.obra);
                  p_obra.appendChild(node_obra);
                  col1.appendChild(p_obra);
                  
                  
                  //
                  
                  var col2 = document.createElement('div');
                  col2.className = "col-md-4";
                  var p_horas = document.createElement("p")
                  p_horas.setAttribute("style", "font-size: 0.8em;");
                  var node_horas = document.createTextNode("NA / ");
                  var span_horas = document.createElement('span');
                  span_horas.setAttribute("style", "color:red;");
                  var node_span = document.createTextNode("NA");
                  span_horas.appendChild(node_span);
                  
                  p_horas.appendChild(node_horas);
                  p_horas.appendChild(span_horas);
                  col2.appendChild(p_horas);
                  
                  row.appendChild(col1);
                  row.appendChild(col2);
                  
                  header.append(row)
                  
                  var body = document.createElement('div');
                  body.className = "card-body text-center text-"+font;
                  
                  var p_presupuesto = document.createElement("h6");
                  p_presupuesto.setAttribute("style", "font-size: 1.0em;");
                  var node_presupuesto = document.createTextNode(reg.presupuesto);
                  p_presupuesto.appendChild(node_presupuesto);
                  // aquí se necesita el query para el nickName;
                  var p_nickname = document.createElement("h6");
                  p_nickname.setAttribute("style", "font-size: 1.2em;");
                  var node_nickname = document.createTextNode(inge.nickname);
                  p_nickname.appendChild(node_nickname);
                  
                  var p_status = document.createElement("h6");
                  p_status.className = "text-success";
                  p_status.setAttribute("style", "font-size: 1.0em;");
                  var node_status = document.createTextNode("Activo");
                  p_status.appendChild(node_status);
                  
                  body.appendChild(p_presupuesto);
                  body.appendChild(p_nickname);
                  body.appendChild(p_status);
                  
                  //var p_checkin = document.createElement("h6");
                  //var d = new Date(reg.checkin);
                  //ar node_checkin = document.createTextNode("Hora de Inicio: " + d.toLocaleTimeString());
                  //p_obra.appendChild(node_obra);
                  //p_checkin.appendChild(node_checkin);
                  
                  var footer = document.createElement('div');
                  footer.className = "card-footer text-center";
                  var row_footer = document.createElement('div');
                  row_footer.className = "row";
                  
                  var col3 = document.createElement('div');
                  col3.className = "col-md-6";
                  var p_horas_inge_ejecutadas = document.createElement('p');
                  p_horas_inge_ejecutadas.setAttribute("style", "font-size: 0.7em;");
                  var node_horas_ejecutadas = document.createTextNode("H. Ejecutadas: ");
                  var span_horas_ejecutadas = document.createElement('span');
                  span_horas_ejecutadas.setAttribute("style", "color:red;");
                  var node_span_horas_ejecutadas = document.createTextNode("NA");
                  span_horas_ejecutadas.appendChild(node_span_horas_ejecutadas);
                  p_horas_inge_ejecutadas.appendChild(node_horas_ejecutadas);
                  p_horas_inge_ejecutadas.appendChild(span_horas_ejecutadas);
                  
                  col3.appendChild(p_horas_inge_ejecutadas);
                  
                  var col4 = document.createElement('div');
                  col4.className = "col-md-6";
                  var p_horas_inge_presupuestadas = document.createElement('p');
                  p_horas_inge_presupuestadas.setAttribute("style", "font-size: 0.7em;");
                  var node_horas_presupuestadas = document.createTextNode("H. Programadas: ");
                  var span_horas_presupuestadas = document.createElement('span');
                  span_horas_presupuestadas.setAttribute("style", "color:red;");
                  var node_span_horas_presupuestadas = document.createTextNode("NA");
                  span_horas_presupuestadas.appendChild(node_span_horas_presupuestadas);
                  p_horas_inge_presupuestadas.appendChild(node_horas_presupuestadas);
                  p_horas_inge_presupuestadas.appendChild(span_horas_presupuestadas);
                  
                  col4.appendChild(p_horas_inge_presupuestadas);
                  
                  row_footer.appendChild(col3);
                  row_footer.appendChild(col4);
                  
                  footer.appendChild(row_footer);
                  
                  
                  
                  card.appendChild(header);
                  card.appendChild(body);
                  card.appendChild(footer);
                  var div = document.getElementById(id_card_column_dashboard);
                  div.appendChild(card);
                }
              });
            } else{
              //Si es misc
              var header = document.createElement('div');
              header.className = "card-header text-center";
              var row = document.createElement('div');
              row.className = "row";
              var col1 = document.createElement('div');
              col1.className = "col-md-8";
              var p_obra = document.createElement("p")
              p_obra.setAttribute("style", "font-size: 1.1em; color:black;");
              var node_obra = document.createTextNode(reg.obra);
              p_obra.appendChild(node_obra);
              col1.appendChild(p_obra);
              
              
              //
              
              var col2 = document.createElement('div');
              col2.className = "col-md-4";
              var p_horas = document.createElement("p")
              p_horas.setAttribute("style", "font-size: 0.8em;");
              var node_horas = document.createTextNode("NA / ");
              var span_horas = document.createElement('span');
              span_horas.setAttribute("style", "color:red;");
              var node_span = document.createTextNode("NA");
              span_horas.appendChild(node_span);
              
              p_horas.appendChild(node_horas);
              p_horas.appendChild(span_horas);
              col2.appendChild(p_horas);
              
              row.appendChild(col1);
              row.appendChild(col2);
              
              header.append(row)
              
              var body = document.createElement('div');
              body.className = "card-body text-center text-"+font;
              
              var p_presupuesto = document.createElement("h6");
              p_presupuesto.setAttribute("style", "font-size: 1.0em;");
              var node_presupuesto = document.createTextNode(reg.presupuesto);
              p_presupuesto.appendChild(node_presupuesto);
              // aquí se necesita el query para el nickName;
              var p_nickname = document.createElement("h6");
              p_nickname.setAttribute("style", "font-size: 1.2em;");
              var node_nickname = document.createTextNode(inge.nickname);
              p_nickname.appendChild(node_nickname);
              
              var p_status = document.createElement("h6");
              p_status.className = "text-success";
              p_status.setAttribute("style", "font-size: 1.0em;");
              var node_status = document.createTextNode("Activo");
              p_status.appendChild(node_status);
              
              body.appendChild(p_presupuesto);
              body.appendChild(p_nickname);
              body.appendChild(p_status);
              
              //var p_checkin = document.createElement("h6");
              //var d = new Date(reg.checkin);
              //ar node_checkin = document.createTextNode("Hora de Inicio: " + d.toLocaleTimeString());
              //p_obra.appendChild(node_obra);
              //p_checkin.appendChild(node_checkin);
              
              var footer = document.createElement('div');
              footer.className = "card-footer text-center";
              var row_footer = document.createElement('div');
              row_footer.className = "row";
              
              var col3 = document.createElement('div');
              col3.className = "col-md-6";
              var p_horas_inge_ejecutadas = document.createElement('p');
              p_horas_inge_ejecutadas.setAttribute("style", "font-size: 0.7em;");
              var node_horas_ejecutadas = document.createTextNode("H. Ejecutadas: ");
              var span_horas_ejecutadas = document.createElement('span');
              span_horas_ejecutadas.setAttribute("style", "color:red;");
              var node_span_horas_ejecutadas = document.createTextNode("NA");
              span_horas_ejecutadas.appendChild(node_span_horas_ejecutadas);
              p_horas_inge_ejecutadas.appendChild(node_horas_ejecutadas);
              p_horas_inge_ejecutadas.appendChild(span_horas_ejecutadas);
              
              col3.appendChild(p_horas_inge_ejecutadas);
              
              var col4 = document.createElement('div');
              col4.className = "col-md-6";
              var p_horas_inge_presupuestadas = document.createElement('p');
              p_horas_inge_presupuestadas.setAttribute("style", "font-size: 0.7em;");
              var node_horas_presupuestadas = document.createTextNode("H. Programadas: ");
              var span_horas_presupuestadas = document.createElement('span');
              span_horas_presupuestadas.setAttribute("style", "color:red;");
              var node_span_horas_presupuestadas = document.createTextNode("NA");
              span_horas_presupuestadas.appendChild(node_span_horas_presupuestadas);
              p_horas_inge_presupuestadas.appendChild(node_horas_presupuestadas);
              p_horas_inge_presupuestadas.appendChild(span_horas_presupuestadas);
              
              col4.appendChild(p_horas_inge_presupuestadas);
              
              row_footer.appendChild(col3);
              row_footer.appendChild(col4);
              
              footer.appendChild(row_footer);
              
              
              
              card.appendChild(header);
              card.appendChild(body);
              card.appendChild(footer);
              var div = document.getElementById(id_card_column_dashboard);
              div.appendChild(card);
            }
          } 
        });
      }else{
        //Si no activo
        var header = document.createElement('div');
        header.className = "card-header text-center";
        var row = document.createElement('div');
        row.className = "row";
        var col1 = document.createElement('div');
        col1.className = "col-md-8";
        var p_obra = document.createElement("p")
        p_obra.setAttribute("style", "font-size: 1.1em; color:black;");
        var node_obra = document.createTextNode("");
        p_obra.appendChild(node_obra);
        col1.appendChild(p_obra);
        
        
        var col2 = document.createElement('div');
        col2.className = "col-md-4";
        var p_horas = document.createElement("p")
        p_horas.setAttribute("style", "font-size: 0.8em;");
        var node_horas = document.createTextNode("NA");
        var span_horas = document.createElement('span');
        span_horas.setAttribute("style", "color:red;");
        var node_span = document.createTextNode("");
        span_horas.appendChild(node_span);
        
        p_horas.appendChild(node_horas);
        p_horas.appendChild(span_horas);
        col2.appendChild(p_horas);
        
        row.appendChild(col1);
        row.appendChild(col2);
        
        header.append(row)
        
        var body = document.createElement('div');
        body.className = "card-body text-center text-"+font;
        
        var p_presupuesto = document.createElement("h6");
        p_presupuesto.setAttribute("style", "font-size: 1.0em;");
        var node_presupuesto = document.createTextNode("");
        p_presupuesto.appendChild(node_presupuesto);
        // aquí se necesita el query para el nickName;
        var p_nickname = document.createElement("h6");
        p_nickname.setAttribute("style", "font-size: 1.2em;");
        var node_nickname = document.createTextNode(inge.nickname);
        p_nickname.appendChild(node_nickname);
        
        var p_status = document.createElement("h6");
        p_status.className = "text-danger";
        p_status.setAttribute("style", "font-size: 1.0em;");
        var node_status = document.createTextNode("No Activo");
        p_status.appendChild(node_status);
        
        body.appendChild(p_presupuesto);
        body.appendChild(p_nickname);
        body.appendChild(p_status);
        
        //var p_checkin = document.createElement("h6");
        //var d = new Date(reg.checkin);
        //ar node_checkin = document.createTextNode("Hora de Inicio: " + d.toLocaleTimeString());
        //p_obra.appendChild(node_obra);
        //p_checkin.appendChild(node_checkin);
        
        var footer = document.createElement('div');
        footer.className = "card-footer text-center";
        var row_footer = document.createElement('div');
        row_footer.className = "row";
        
        // query necesario para sacar las horas del inge
        var horas_inge_ejecutadas = "num"
        var horas_inge_presupuestadas = "num"
        
        var col3 = document.createElement('div');
        col3.className = "col-md-6";
        var p_horas_inge_ejecutadas = document.createElement('p');
        p_horas_inge_ejecutadas.setAttribute("style", "font-size: 0.7em;");
        var node_horas_ejecutadas = document.createTextNode("NA");
        var span_horas_ejecutadas = document.createElement('span');
        span_horas_ejecutadas.setAttribute("style", "color:red;");
        var node_span_horas_ejecutadas = document.createTextNode("");
        span_horas_ejecutadas.appendChild(node_span_horas_ejecutadas);
        p_horas_inge_ejecutadas.appendChild(node_horas_ejecutadas);
        p_horas_inge_ejecutadas.appendChild(span_horas_ejecutadas);
        
        col3.appendChild(p_horas_inge_ejecutadas);
        
        var col4 = document.createElement('div');
        col4.className = "col-md-6";
        var p_horas_inge_presupuestadas = document.createElement('p');
        p_horas_inge_presupuestadas.setAttribute("style", "font-size: 0.7em;");
        var node_horas_presupuestadas = document.createTextNode("NA");
        var span_horas_presupuestadas = document.createElement('span');
        span_horas_presupuestadas.setAttribute("style", "color:red;");
        var node_span_horas_presupuestadas = document.createTextNode("");
        span_horas_presupuestadas.appendChild(node_span_horas_presupuestadas);
        p_horas_inge_presupuestadas.appendChild(node_horas_presupuestadas);
        p_horas_inge_presupuestadas.appendChild(span_horas_presupuestadas);
        
        col4.appendChild(p_horas_inge_presupuestadas);
        
        row_footer.appendChild(col3);
        row_footer.appendChild(col4);
        
        footer.appendChild(row_footer);
        
        
        
        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(footer);
        var div = document.getElementById(id_card_column_dashboard);
        div.appendChild(card);
      }
    }
    
    
  });
}
//