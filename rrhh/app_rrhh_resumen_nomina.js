var id_tab_resumen_nomina = "tabResumenNomina";

var id_week_ddl_resumen_nomina = "semanaResumenNomina";
var id_year_ddl_resumen_nomina = "yearResumenNomina";

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";

//aqui hidden a todos los botones y reset tabla en tab.click, year.change y week.change

$('#' + id_tab_resumen_nomina).click(function() {
    $('#' + id_week_ddl_resumen_nomina).empty();
    $('#' + id_year_ddl_resumen_nomina).empty();

	var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_week_ddl_resumen_nomina);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_resumen_nomina);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }
});

$('#' + id_year_ddl_resumen_nomina).change(function(){
    $('#' + id_semana_ddl_asistencia).empty();
    var select = document.getElementById(id_week_ddl_resumen_nomina);
    var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
    if(year < getWeek(new Date().getTime())[1]){
        var ult_sem = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ult_sem;i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    } else {
        for(i=getWeek(new Date().getTime())[0];i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    }
    loadResumenNomina();
});

$('#' + id_week_ddl_resumen_nomina).change(function(){
	loadResumenNomina();
});

function loadResumenNomina(){
	var year = $('#' + id_year_ddl_resumen_nomina + " option:selected").val();
	var week = $('#' + id_week_ddl_resumen_nomina + " option:selected").val();
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
		var semana = snapshot.val();
		//Despliega la datatable En todo caso
		if(semana.terminada){
			if(semana.asistencias_terminadas){
				$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_asistencias_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_asistencias_button_resumen_nomina).removeClass('hidden');
			}
			if(semana.horas_extra_terminadas){
				$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_horas_extra_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_horas_extra_button_resumen_nomina).removeClass('hidden');
			}
			if(semana.diversos_terminados){
				$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).removeClass('hidden');
			} else {
				$('#' + id_terminar_diversos_button_resumen_nomina).addClass('hidden');
				$('#' + id_revertir_diversos_button_resumen_nomina).removeClass('hidden');
			}
		} 
	});
};

$('#' + id_terminar_asistencias_button_resumen_nomina).click(function(){

});

$('#' + id_revertir_asistencias_button_resumen_nomina).click(function(){

});

$('#' + id_terminar_horas_extra_button_resumen_nomina).click(function(){

});

$('#' + id_revertir_horas_extra_button_resumen_nomina).click(function(){

});

$('#' + id_terminar_diversos_button_resumen_nomina).click(function(){

});

$('#' + id_revertir_diversos_button_resumen_nomina).click(function(){

});


//Jalar los terminar aquí.
// Checar que no usen ningun dato que este en su app original y no aqui.
// Quitarle los kaizens a los terminar y meterlos en el terminar pago nomina.
//Programar los revertir
