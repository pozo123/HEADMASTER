var rama_bd_obras = "obras";
var rama_bd_registros = "proyectos/registros";

var mode_display; //true si en pantalla completa (con el botón), false si no
$(document).ready(function(){
    if(mode_display){
    	presentacionDashboardScore();
    }
});

function presentacionDashboardScore(){
	/*
	Uso de interval, usalo para pasar entre funciones que carguen dash y graph de un array (cada vuncion i++ para agarrar otro elemento del array) en el que se jala al inge y en donde chambee
	function move() {
  var elem = document.getElementById("myBar");   
  var width = 0;
  var id = setInterval(frame, 10);
  function frame() {
    if (width == 100) {
      clearInterval(id);
      //width = 0;
    } else {
      width++; 
      elem.style.width = width + '%'; 
    }
  }
}*/
}

function loadGraph(obra, proc){
    var path = proc.split("-");
    var proc_query = path.length > 1 ? path[0] + "/subprocesos/" + path[1] : proc;
    firebase.database().ref(rama_bd_obras + "/" + obra + "/procesos/" + proc_query + "/SCORE").once('value').then(function(snapshot){
        var horas_programadas = snapshot.child("total_prog").exists() ? parseFloat(snapshot.child("total_prog").val()) : 0;
        var horas_trabajadas = snapshot.child("total_trabajado").exists() ? parseFloat(snapshot.child("total_trabajado").val()) : 0;
        //Solo checo esta semana porque solo tendria que revisar la pasada si estoy viendo las graphs el lunes en la madrugada y alguien lleva trabajando desde el domingo
        //Lo mismo para el year, solo afecta si es el primero de enero y llevan trabajando todo newyears
        firebase.database().ref(rama_bd_registros + "/" + year + "/" + week).once('value').then(function(registrosSnap){
            registrosSnap.forEach(function(regSnap){
                var reg = regSnap.val();
                if(reg.status == false && reg.obra == obra && reg.proceso = proc){
                    var horas_reg = new Date().getTime() - parseFloat(reg.checkin);
                    horas_trabajadas += horas_reg;
                }
            });
            
            var color = Chart.helpers.color;
            var graph_color = reg.esp == "ie" ? color(window.chartColors.red).alpha(0.5).rgbString() : color(window.chartColors.blue).alpha(0.5).rgbString()
            var barChartData = {
                labels: ['H.Programadas', 'H. Ejecutadas'],
                datasets: [{
                    label: 'Horas',
                    backgroundColor: graph_color,
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: [
                        horas_programadas,
                        horas_trabajadas,
                    ]
                }]
            };
            //AQUI por que 3 divs anidados
            var canvas_container = document.createElement('canvas');
            canvas_container.id = "graph_" + proc;
            /*var canvas_div = document.createElement('div');
            canvas_div.appendChild(canvas_container);*/
            
            var div_card_graph = document.createElement('div');
            div_card_graph.className = "card card_graph border-light";
            div_card_graph.setAttribute("style", "max-width: 20rem; min-width:20rem;");
            div_card_graph.appendChild(canvas_container);//canvas_div);
            
            var div_graphs = document.getElementById(div_id);
            
            div_graphs.appendChild(div_card_graph);
            
            var ctx = canvas_container.getContext('2d');//document.getElementById(canvas_container.id).getContext('2d');
            ctx.canvas.height = 300;
            window.myBar = new Chart(ctx, {
                type: 'bar',
                data: barChartData,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: [obra,proc]
                    },
                }
            });
        });
    });
}