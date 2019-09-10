var id_tab_pagos_nomina = "tabPagosNomina";
var id_form_pagos_nomina = "formPagosNomina";

var id_button_total_pagos_nomina = "totalPagosNominaButton";

var id_ddl_year_pagos_nomina = "yearPagosNomina";
var id_ddl_week_pagos_nomina = "semanaPagosNomina";

var id_fecha_pagos_nomina = "fechaPagosNomina";

var id_container_pagos_nomina = "divContainerPagosNomina";

$('#' + id_tab_pagos_nomina).click(function(){

    jQuery('#' + id_fecha_pagos_nomina).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );

    $('#' + id_ddl_year_pagos_nomina).empty();
    var select_year = document.getElementById(id_ddl_year_pagos_nomina);
    for(i=actual_year;i>=starting_year;i--){
        var option_year = document.createElement('option');
        option_year.text = option_year.value = i;
        select_year.appendChild(option_year);
    };

    $('#' + id_ddl_week_pagos_nomina).empty();
    var select_week = document.getElementById(id_ddl_week_pagos_nomina);
    for(i=actual_week;i>0;i--){
        var ju_mi = getDaysWeek(i,actual_year);
        var jueves = ju_mi[0];
        var miercoles = ju_mi[1];
        var week = ("0" + i).slice(-2)

        jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
        miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);

        var option_week = document.createElement('option');
        option_week.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
        option_week.value = week;
        select_week.appendChild(option_week);
    }
});

$('#' + id_ddl_year_pagos_nomina).change(function(){
    $('#' + id_ddl_week_pagos_nomina).empty();
    $('#' + id_fecha_pagos_nomina).val("");
    // maybe resetear cosas
    var select = document.getElementById(id_ddl_week_pagos_nomina);
    var year = $('#' + id_ddl_year_pagos_nomina + " option:selected").val();
    if(year < new Date().getFullYear()){
        var ultima_semana = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ultima_semana;i>0;i--){

            var ju_mi = getDaysWeek(i,year);
            var jueves = ju_mi[0];
            var miercoles = ju_mi[1];
            var week = ("0" + i).slice(-2)
    
            jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
            miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);

            var option = document.createElement('option');
            option.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
            option.value = week;
            select.appendChild(option);
        }
    } else {
        for(i=getWeek(new Date().getTime())[0];i>0;i--){
            var ju_mi = getDaysWeek(i,year);
            var jueves = ju_mi[0];
            var miercoles = ju_mi[1];
            var week = ("0" + i).slice(-2)
    
            jueves = new Date(jueves).toLocaleDateString("es-ES", options_semanas);
            miercoles = new Date(miercoles).toLocaleDateString("es-ES", options_semanas);
            
            var option = document.createElement('option');
            option.text = "[SEM " + week + "] - " + jueves + " - " + miercoles;
            option.value = week;
            select.appendChild(option);
        }
    }
});

$('#' + id_ddl_year_pagos_nomina).change(function(){
    // aquí llamar a la función pro
});