var rama_bd_obras = "proyectos/obras";
var checked_graph = false;

$(document).ready(function(){
    loadGraphs();
    setInterval(loadGraphs, 60000);
    firebase.database().ref(rama_bd_obras).on("child_changed",function(snapshot){
        loadGraphs();
    })
});

function loadGraphs(){
    $('#graphs').empty();
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            childSnapshot.child("presupuestos").forEach(function(presu_snapshot){
                var presu = presu_snapshot.val();
				if(presu.contrato === true && presu.oculto === false && presu.terminado === false){
                    //console.log(presu_snapshot.val());
					var horas_programadas_totales = 0;
					var horas_programadas_ie = 0;
					var horas_programadas_ihs = 0;
					var horas_trabajadas_totales = 0;
					var horas_trabajadas_ie = 0;
					var horas_trabajadas_ihs = 0;
					horas_programadas_ie = presu_snapshot.child("colaboradores_asignados/horas_totales_ie").val();
					horas_programadas_ihs = presu_snapshot.child("colaboradores_asignados/horas_totales_ihs").val();
					horas_programadas_totales = parseFloat(horas_programadas_ie) + parseFloat(horas_programadas_ihs);
					presu_snapshot.child("colaboradores_asignados/ie").forEach(function(inge_snapshot){
                        //console.log(inge_snapshot.val());
                        horas_trabajadas_ie += parseFloat(inge_snapshot.val().horas_trabajadas);
					});
					presu_snapshot.child("colaboradores_asignados/ihs").forEach(function(inge_snapshot){
                        horas_trabajadas_ihs += parseFloat(inge_snapshot.val().horas_trabajadas);
					});
                    firebase.database().ref(rama_bd_registros).orderByChild("status").equalTo(false).on('value',function(snapshot){
                        //var regs = snapshot.val();
                        snapshot.forEach(function(childSnapshot){
                            reg = childSnapshot.val();
                            if(reg.presupuesto == presu.nombre){
                                if(reg.esp == "ie")
                                horas_trabajadas_ie += parseFloat((new Date().getTime() - reg.checkin)/3600000);
                                else
                                horas_trabajadas_ihs += parseFloat((new Date().getTime() - reg.checkin)/3600000);
                            }
                        });
                        
                        horas_trabajadas_totales = horas_trabajadas_ie + horas_trabajadas_ihs;
                        var color = Chart.helpers.color;
                        var barChartData = {
                            labels: ['H.Programadas', 'H. Trabajadas'],
                            datasets: [{
                                label: 'IE',
                                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                borderColor: window.chartColors.red,
                                borderWidth: 1,
                                data: [
                                    horas_programadas_ie,
                                    horas_trabajadas_ie,
                                ]
                            }, {
                                label: 'IHS',
                                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                                borderColor: window.chartColors.blue,
                                borderWidth: 1,
                                data: [
                                    horas_programadas_ihs,
                                    horas_trabajadas_ihs
                                ]
                            }]
                        };
                        var canvas_container = document.createElement('canvas');
                        canvas_container.id = presu_snapshot.child("clave").val() + presu_snapshot.child("nombre").val()
                        var canvas_div = document.createElement('div');
                        canvas_div.appendChild(canvas_container);
                        
                        var div_card_graph = document.createElement('div');
                        div_card_graph.className = "card card_graph border-light";
                        div_card_graph.setAttribute("style", "max-width: 20rem; min-width:20rem;");
                        div_card_graph.appendChild(canvas_div);
                        
                        var div_graphs = document.getElementById("graphs");
                        
                        div_graphs.appendChild(div_card_graph);
                        
                        var ctx = document.getElementById(canvas_container.id).getContext('2d');
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
                                    text: [childSnapshot.child("nombre").val(),presu_snapshot.child("nombre").val()]
                                },
                            }
                        });
                    });
                    //alert(horas_trabajadas_ie)            
                }
            });
		});
    });
};