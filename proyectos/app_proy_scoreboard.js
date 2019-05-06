var id_fullscreen_scoreboard = "fullScreen";
var id_notFullscreen_scoreboard = "notFullScreen";
var id_div_graphs_scoreboard = "graphs";

var rama_bd_obras = "test/obras";
var rama_bd_personal = "test/personal";
var rama_bd_registros = "proyectos/registros";
//MODIFICAR VALORES
var wait_long = 7;
var wait_short = 3;
var unidad_t = 1000;

var i = 0;
var j = 0;
var inges = [];
var myInterval;
var modo_display = false; //true si en pantalla completa (con el botón), false si no. Ponerle un listener para si cambia

$('#' + id_fullscreen_scoreboard).click(function(){
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        inges[0] = "Todos";
        snapshot.forEach(function(childSnap){
            if(childSnap.child("areas/proyectos").val() && !childSnap.child("areas/administracion").val()){
                inges[inges.length] = childSnap;
            }
        });
        myInterval = setInterval(cyclePresentation,unidad_t);
        modo_display = true;
    });
});

$('#' + id_notFullscreen_scoreboard).click(function(){
    i = 0;
    j = 0;
    clearInterval(myInterval);
    inges = [];
    modo_display = false;
    console.log("clear");
});

function cyclePresentation(){
    //console.log("i: " + i + ", j: " + j );
    if(i == 0){
        if(j == 0){
            scoreboardGrupal();
        }
        if(j == wait_long - 1){
            i++;
            j = 0;
        } else {
            j++;
        }
    } else {
        if(j == 0){
            scoreboardIndividual(inges[i]);
        }
        if(j == wait_short - 1){
            i = i == inges.length - 1 ? 0 : i+1;
            j = 0;
        } else {
            j++;
        }
    }
}

function scoreboardGrupal(){
    console.log("TODOS");
    for(var i=1;i<inges.length;i++){
        var inge = inges[i].val();
        if(inge.activo){
            getRegScoreboard(inges[i]);
        } else {
            loadDashcard(inges[i].child("nickname").val(), false);
        }
    }
    console.log("FIN TODOS");
}

function scoreboardIndividual(ingeSnap){
    var inge = ingeSnap.val();
    if(inge.status){
        getRegScoreboard(ingeSnap);
    } else {
        loadDashcard(ingeSnap.child("nickname").val(), false);
        $('#' + id_div_graphs_scoreboard).empty();
        console.log(inge.nickname + ", No Activo");
    }
}

function getRegScoreboard(ingeSnap){
    var hoy = getWeek(new Date().getTime());
    firebase.database().ref(rama_bd_registros + "/" + hoy[1] + "/" + hoy[0]).once('value').then(function(snapshot){
        snapshot.forEach(function(regSnap){
            if(regSnap.inge = ingeSnap.key){
                var reg = regSnap.val();
                console.log(regSnap.val());

                var path = reg.proceso.split("-");
                var proc_query = path.length > 1 ? path[0] + "/subprocesos/" + path[1] : reg.proceso;
                var hoy = getWeek(new Date().getTime());
                var year = hoy[1];
                var week = hoy[0];
                firebase.database().ref(rama_bd_obras + "/" + reg.obra + "/procesos/" + proc_query + "/SCORE").once('value').then(function(snapshot){
                    var horas_programadas = snapshot.child("total_prog").exists() ? parseFloat(snapshot.child("total_prog").val()) : 0;
                    var horas_trabajadas = snapshot.child("total_trabajado").exists() ? parseFloat(snapshot.child("total_trabajado").val()) : 0;

                    var horas_reg = new Date().getTime() - parseFloat(reg.checkin);
                    horas_trabajadas += horas_reg;
                    
                    loadDashcard(ingeSnap.child("nickname").val(), true, reg, horas_programadas, horas_trabajadas / 3600000);
                    loadGraph(reg, horas_programadas, horas_trabajadas);
                });

            }
        });
    });

}

function loadGraph(reg, horas_programadas, horas_trabajadas){
    var obra = reg.obra;
    var proc = reg.proceso   
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
                horas_trabajadas / 3600000,
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
    
    var div_graphs = document.getElementById(id_div_graphs_scoreboard);
    
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
}

                
function loadDashcard(nickname, activo, reg, horas_programadas, horas_trabajadas){
    if(activo){
        console.log(nickname + ": \nEsp: " + reg.esp + "\nObra: " + reg.obra + "\nProceso: " + reg.proceso + "\nHoras Programadas: " + horas_programadas + "\nHoras Trabajadas: " + horas_trabajadas);
    } else {
        console.log(nickname + ": No activo");
    }
}