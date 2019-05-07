var id_fullscreen_scoreboard = "fullScreen";
var id_notFullscreen_scoreboard = "notFullScreen";

var id_div_graphs_scoreboard = "divGraphsScoreboard";
var id_div_cards_grupales_scoreboard = "divCardsGrupalesScoreboard";
var id_div_cards_ind_scoreboard = "divCardsIndScoreboard";

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
    $('#' + id_div_graphs_scoreboard).empty();
    $('#' + id_div_cards_ind_scoreboard).empty();
    $('#' + id_div_cards_grupales_scoreboard).empty();
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
    $('#' + id_div_graphs_scoreboard).emtpy();
    $('#' + id_div_cards_ind_scoreboard).emtpy();
    $('#' + id_div_cards_grupales_scoreboard).empty();
    console.log("TODOS");
    for(var i=1;i<inges.length;i++){
        var inge = inges[i].val();
        if(inge.activo){
            getRegScoreboard(inges[i],id_div_cards_grupales_scoreboard);
        } else {
            loadDashcard(inges[i].child("nickname").val(), false,id_div_cards_grupales_scoreboard);
        }
    }
    console.log("FIN TODOS");
}

function scoreboardIndividual(ingeSnap){
    $('#' + id_div_graphs_scoreboard).emtpy();
    $('#' + id_div_cards_ind_scoreboard).emtpy();
    $('#' + id_div_cards_grupales_scoreboard).empty();
    var inge = ingeSnap.val();
    if(inge.status){
        getRegScoreboard(ingeSnap,id_div_cards_ind_scoreboard);
    } else {
        loadDashcard(ingeSnap.child("nickname").val(), false,id_div_cards_ind_scoreboard);
        console.log(inge.nickname + ", No Activo");
    }
}

function getRegScoreboard(ingeSnap, div_cards){
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
                    
                    loadDashcard(ingeSnap.child("nickname").val(), true, reg, horas_programadas, horas_trabajadas / 3600000, div_cards);
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

                
function loadDashcard(nickname, activo, reg, horas_programadas, horas_trabajadas, horas_programadas_individuales, horas_trabajadas_individuales, div_cards){

    var font = "";
    var card = document.createElement('div');

    if(reg.esp === "ie"){
        card.className = "card card_dash border-danger mb-3";
        font="danger";
    } else if(reg.esp = "ihs"){
        card.className = "card card_dash border-info mb-3";
        font="info";
    } else {
        card.className = "card card_dash border-secondary mb-3";
        font = "";
    }

    if(activo){
        console.log(nickname + ": \nEsp: " + reg.esp + "\nObra: " + reg.obra + "\nProceso: " + reg.proceso + "\nHoras Programadas: " + horas_programadas + "\nHoras Trabajadas: " + horas_trabajadas);

        // Header del Card
        var header = document.createElement('div');
        header.className = "card-header text-center";
        var row = document.createElement('div');
        row.className = "row";

        // Divido en dos columnas, la primera tiene obra y la segunda horas.

        //1ra columna con obra.
        var col_obra = document.createElement('div');
        col_obra.className = "col-md-6";
        var p_obra = document.createElement("p")
        p_obra.setAttribute("style", "font-size: 1em; color:black;");
        var node_obra = document.createTextNode(reg.obra);
        p_obra.appendChild(node_obra);
        col_obra.appendChild(p_obra);

        //2da columna con horas.
        var col_horas = document.createElement('div');
        col_horas.className = "col-md-6";
        var p_horas = document.createElement("p")
        p_horas.setAttribute("style", "font-size: 1em; font-weight: bold;");
        var node_horas = document.createTextNode(horas_trabajadas + "/ ");
        var span_horas = document.createElement('span');
        span_horas.setAttribute("style", "color:red;");
        var node_span = document.createTextNode(horas_programadas);
        span_horas.appendChild(node_span);
        
        p_horas.appendChild(node_horas);
        p_horas.appendChild(span_horas);
        col_horas.appendChild(p_horas);
        
        row.appendChild(col_obra);
        row.appendChild(col_horas);
        
        // se completa el header
        header.append(row)

        var body = document.createElement('div');
        body.className = "card-body text-center text-"+ font;
        
        var row = document.createElement('div');
        row.className = "row";

        var col_nickname = document.createElement('div');
        col_nickname.className = "col-md-4";
        var p_nickname = document.createElement("p")
        p_nickname.setAttribute("style", "font-size: 0.9em; color:black;");
        var node_nickname = document.createTextNode(nickname);
        p_nickname.appendChild(node_nickname);
        col_nickname.appendChild(p_nickname);

        var col_proceso = document.createElement('div');
        col_proceso.className = "col-md-4";
        var p_proceso = document.createElement("p")
        p_proceso.setAttribute("style", "font-size: 1em; color:black;");
        var node_proceso = document.createTextNode(reg.proceso);
        p_proceso.appendChild(node_proceso);
        col_proceso.appendChild(p_proceso);

        row.appendChild(col_nickname);
        row.appendChild(col_proceso);
        
        body.appendChild(row);
        
        // footer

        var footer = document.createElement('div');
        footer.className = "card-footer text-center";
        var row_footer = document.createElement('div');
        row_footer.className = "row";
        
        var col3 = document.createElement('div');
        col3.className = "col-md-6";
        var p_horas_inge_ejecutadas = document.createElement('p');
        p_horas_inge_ejecutadas.setAttribute("style", "font-size: 0.7em;");
        var node_horas_ejecutadas = document.createTextNode("Ejec: ");
        var span_horas_ejecutadas = document.createElement('span');
        span_horas_ejecutadas.setAttribute("style", "color:red;");
        var node_span_horas_ejecutadas = document.createTextNode(horas_trabajadas_individuales);
        span_horas_ejecutadas.appendChild(node_span_horas_ejecutadas);
        p_horas_inge_ejecutadas.appendChild(node_horas_ejecutadas);
        p_horas_inge_ejecutadas.appendChild(span_horas_ejecutadas);
        
        col3.appendChild(p_horas_inge_ejecutadas);
        
        var col4 = document.createElement('div');
        col4.className = "col-md-6";
        var p_horas_inge_presupuestadas = document.createElement('p');
        p_horas_inge_presupuestadas.setAttribute("style", "font-size: 0.7em;");
        var node_horas_presupuestadas = document.createTextNode("Prog: ");
        var span_horas_presupuestadas = document.createElement('span');
        span_horas_presupuestadas.setAttribute("style", "color:red;");
        var node_span_horas_presupuestadas = document.createTextNode(horas_programadas_individuales);
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

        document.getElementById(div_cards).appendChild(card);
    } else {
        console.log(nickname + ": No activo");

        var header = document.createElement('div');
        header.className = "card-header text-center";
        var row = document.createElement('div');
        row.className = "row";

        // Divido en dos columnas, la primera tiene obra y la segunda horas.

        //1ra columna con obra.
        var col_inactivo = document.createElement('div');
        col_inactivo.className = "col-md-12";
        var p_inactivo = document.createElement("p")
        p_inactivo.setAttribute("style", "font-size: 1em; color:red;");
        var node_inactivo = document.createTextNode(reg.obra);
        p_inactivo.appendChild(node_inactivo);
        col_inactivo.appendChild(p_inactivo);

        row.appendChild(col_inactivo);
        
        // se completa el header
        header.append(row)

        var body = document.createElement('div');
        body.className = "card-body text-center text-"+ font;
        
        var row = document.createElement('div');
        row.className = "row";

        var col_nickname = document.createElement('div');
        col_nickname.className = "col-md-12";
        var p_nickname = document.createElement("p")
        p_nickname.setAttribute("style", "font-size: 0.9em; color:black;");
        var node_nickname = document.createTextNode(nickname);
        p_nickname.appendChild(node_nickname);
        col_nickname.appendChild(p_nickname);

        row.appendChild(col_nickname);
        
        body.appendChild(row);
        
        // footer

        var footer = document.createElement('div');
        footer.className = "card-footer text-center";
        var row_footer = document.createElement('div');
        row_footer.className = "row";
         
        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(footer);

        document.getElementById(div_cards).appendChild(card);
    }
}