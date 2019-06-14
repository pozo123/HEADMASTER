var id_obras_ddl_dashboard_individual = "obrasDdlDashboardInd";

var id_year_ddl_dashboard_individual = "yearDdlDashboardInd";
var id_semana_ddl_dashboard_individual = "semanaDdlDashboardInd";

var group_weekYear_dashboard_individual = "groupWeekYearDashboardInd";

var id_canvas_dash1 = "canvasDashcard1";
var id_canvas_dash2 = "canvasDashcard2";

var semana_actual = getWeek(new Date().getTime())[0];
var year_actual = getWeek(new Date().getTime())[1];

var total_asistencia = [];
var total_horas_extra = [];
var total_diversos = [];
var total_total = [];
var semanas_labels = [];

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
var rama_bd_trabajadores = "rrhh/trabajadores"

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        var user_uid = user.uid;

        // Código para llenar el dropdown list de obras con filtro de obras asignadas
        var select = document.getElementById(id_obras_ddl_dashboard_individual);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);
        firebase.database().ref(rama_bd_personal + "/" + user_uid).once('value').then(function(snapshot){
            var pers = snapshot.val();
                if(snapshot.child("areas/administracion").val() == true || pers.credenciales < 3){
                    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
                        snapshot.forEach(function(obraSnap){
                            var obra = obraSnap.val();
                            if(!obra.terminada){
                                var option2 = document.createElement('option');
                                option2.text = option2.value = obra.nombre; 
                                select.appendChild(option2);
                            }
                        });
                    });
                } else {
                var single = 0;
                firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
                    snapshot.forEach(function(childSnap){
                        if(!childSnap.child("terminada").val()){
                            childSnap.child("supervior").forEach(function(supSnap){
                                if(supSnap.key == user_uid && supSnap.child("acivo").val() == true){
                                    single++;
                                    var option2 = document.createElement('option');
                                    option2.text = option2.value = childSnap.child("nombre").val(); 
                                    select.appendChild(option2);
                                }
                            });
                        }
                    });
                    if(single == 1){
                        document.getElementById(id_obras_ddl_dashboard_individual).selectedIndex = 1;
                        $('#' + id_obras_ddl_dashboard_individual).addClass("hidden");
                        funcionBonita();
                    } else {
                        $('#' + id_obras_ddl_dashboard_individual).removeClass("hidden");
                    }
                });
            }
        });

        // ----------------------------------------------------------------------------

        var select1 = document.getElementById(id_year_ddl_dashboard_individual);
        console.log(year_actual);
        for(i=year_actual;i>2017;i--){
            console.log(i)
            var option = document.createElement('option');
            option.text = option.value = i;
            select1.appendChild(option);
        }
        //Solo carga las semanas con registros, aka las que tienen una rama en rama_bd_pagos_nomina
        loadSemanasDashBoardIndividual(year_actual);

    }
});

$('#' + id_obras_ddl_dashboard_individual).change(function(){

    $('#'+ id_canvas_dash1).html('');
    $('#'+ id_canvas_dash2).html('');

    $('#'+ group_weekYear_dashboard_individual).removeClass('hidden');
    funcionBonita();

});

$('#' + id_year_ddl_dashboard_individual).change(function(){
    $('#'+ id_semana_ddl_dashboard_individual).empty();
    loadSemanasDashBoardIndividual($('#' + id_year_ddl_dashboard_individual + " option:selected").val());
});

$('#' + id_semana_ddl_dashboard_individual).change(function(){
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        if(trabajadores_local.has(snapshot.key) ){

        }
    });
});



function loadSemanasDashBoardIndividual(year){

    var optionBlank = document.createElement("option");
	optionBlank.style = "display:none";
	optionBlank.text = optionBlank.value = "";

	var week_actual;
	if(year == getWeek(new Date().getTime())[1]){
	    week_actual = getWeek(new Date().getTime())[0];	
	} else {
		week_actual = getWeek(new Date(year,11,31).getTime())[0];
	}
	var select2 = document.getElementById(id_semana_ddl_dashboard_individual);
	select2.appendChild(optionBlank);

    firebase.database().ref(rama_bd_pagos_nomina + "/" + year).once('value').then(function(snapshot){
    	for(i=week_actual;i>0;i--){
			if(snapshot.child(i).exists()){
				var semana = snapshot.child(i).val();
				if(semana.diversos_terminados && semana.asistencias_terminadas && semana.horas_extra_terminadas){
					var option = document.createElement('option');
					option.text = snapshot.child(i).key;
					option.value = snapshot.child(i + "/terminada").val();
					select2.appendChild(option);
				}
			}
    	}
    });
};

function funcionBonita(){

    var total_asistencia = [];
    var total_horas_extra = [];
    var total_diversos = [];
    var total_total = [];
    var semanas_labels = [];

    var gran_total_asistencia = 0;
    var gran_total_horas_extra = 0;
    var gran_total_diversos = 0;

    firebase.database().ref(rama_bd_pagos_nomina).once('value').then(function(snapshot){
        snapshot.forEach(function(yearSnapshot){
            yearSnapshot.forEach(function(weekSnapshot){
                var semana_terminada = false;
                if((yearSnapshot.key == year_actual) && (semana_actual - parseFloat(weekSnapshot.key) < 5)){

                    semanas_labels[semana_actual - parseFloat(weekSnapshot.key)] = "Sem " + weekSnapshot.key;
                    total_asistencia[semana_actual - parseFloat(weekSnapshot.key)] = 0;
                    total_horas_extra[semana_actual - parseFloat(weekSnapshot.key)] = 0;
                    total_diversos[semana_actual - parseFloat(weekSnapshot.key)] = 0;
                    total_total[semana_actual - parseFloat(weekSnapshot.key)] = 0;

                    if(weekSnapshot.child("terminada").val()){
                        semana_terminada = true;
                    };
                }
                weekSnapshot.child($('#' + id_obras_ddl_dashboard_individual + " option:selected").val() + "/trabajadores").forEach(function(trabSnap){              
                    if(semana_terminada){
                        gran_total_asistencia += realParse(trabSnap.child("total_asistencia").val()) + realParse(trabSnap.child("impuestos/impuestos_asistencia").val());
                        gran_total_horas_extra += realParse(trabSnap.child("total_horas_extra").val()) + realParse(trabSnap.child("impuestos/impuestos_horas_extra").val());
                        gran_total_diversos += realParse(trabSnap.child("total_diversos").val()) + realParse(trabSnap.child("impuestos/impuestos_diversos").val());

                        total_asistencia[semana_actual - parseFloat(weekSnapshot.key)] += realParse(trabSnap.child("total_asistencia").val()) + realParse(trabSnap.child("impuestos/impuestos_asistencia").val());
                        total_horas_extra[semana_actual - parseFloat(weekSnapshot.key)] += realParse(trabSnap.child("total_horas_extra").val()) + realParse(trabSnap.child("impuestos/impuestos_horas_extra").val());
                        total_diversos[semana_actual - parseFloat(weekSnapshot.key)] += realParse(trabSnap.child("total_diversos").val()) + realParse(trabSnap.child("impuestos/impuestos_diversos").val());
                    }
                });

            })
        });

        for(var i=0;i < total_asistencia.length;i++){
            total_total[i] += total_asistencia[i] + total_horas_extra[i] + total_diversos[i];
        }

        var canvas_container1 = document.createElement('canvas');
        canvas_container1.id = "dash1";
        var canvas_container2 = document.createElement('canvas');
        canvas_container2.id = "dash2";

        var div_dash1 = document.getElementById(id_canvas_dash1);
        div_dash1.appendChild(canvas_container1);
        var div_dash2 = document.getElementById(id_canvas_dash2);
        div_dash2.appendChild(canvas_container2);
        // ------------------------GRÁFICA DE BARRAS ------------------------

        var barChartData = {
			labels: semanas_labels.reverse(),
			datasets: [{
				label: 'Asistencia',
				backgroundColor: window.chartColors.red,
				stack: 'Stack 0',
				data: total_asistencia.reverse()
			}, {
				label: 'Horas Extra',
				backgroundColor: window.chartColors.orange,
				stack: 'Stack 0',
				data: total_horas_extra.reverse()
			}, {
				label: 'Pagos Diversos',
				backgroundColor: window.chartColors.yellow,
				stack: 'Stack 0',
				data: total_diversos.reverse()
            }, {
				label: 'Total',
				backgroundColor: window.chartColors.grey,
				stack: 'Stack 1',
				data: total_total.reverse()
			}]
        };
        var ctx = document.getElementById( canvas_container1.id).getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: 'Últimas 5 semanas - Pago Nómina'
                },
                tooltips: {
                    mode: 'index',
                    intersect: true
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });

        // -------------------GRÁFICA DE PIE ----------------------------

        var config = {
			type: 'pie',
			data: {
				datasets: [{
					data: [
                        gran_total_asistencia,
                        gran_total_horas_extra,
                        gran_total_diversos,
					],
					backgroundColor: [
						window.chartColors.red,
						window.chartColors.orange,
						window.chartColors.yellow,
					],
					label: 'Dataset 1'
				}],
				labels: [
					'Asistencia',
					'Horas Extras',
					'Pagos Diversos',
				]
			},
			options: {
                title: {
                    display: true,
                    text: 'COPEO PAGADO'
                },
				responsive: true
			}
		};
        var ctx = document.getElementById(canvas_container2.id).getContext('2d');
        window.myPie = new Chart(ctx, config);

    });
}