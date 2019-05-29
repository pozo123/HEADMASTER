var id_fecha_inicio_reporte_investime = "fechaInicioReporteInvestime";
var id_fecha_final_reporte_investime = "fichaFinalReporteInvestime";
var id_datatable_reporte_investime =  "dataTableReporteInvestime";
var id_generar_button_reporte_investime = "generarButtonReporteInvestime";

var rama_bd_registros_registros_admin = "administracion/investime/registros";

var tab_investime = "tabReporteInvestime";

var optionsInvestime = { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric' , hour: "numeric", minute: "numeric"};
jQuery.datetimepicker.setLocale('es');

$('#' + tab_investime).click(function() {
    jQuery('#' + id_fecha_inicio_reporte_investime).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_reporte_investime).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );
});

$('#' + id_generar_button_reporte_investime).click(function() {
    var datos_reporte = [];

    firebase.database().ref(rama_bd_registros_registros_admin).once('value').then(function(data){

        getRegsReporteAdmin(datos_reporte, data);

        tabla_registros = $('#'+ id_datatable_reporte_investime).DataTable({
            destroy: true,
            data: datos_reporte,
            dom: 'Bfrtip',
            buttons: ['excel'],
            columns: [
                {title: "Familia"},
                {title: "Subfamilia"},              
                {title: "Actividad"},
                {title: "Fecha"},
                {title: "Horas"},
                {title: "Status Obra"},
            ],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
});

function getRegsReporteAdmin(datos_reporte, data){

    var fecha_i;
    var fecha_i_timestamp;
    var fecha_i_year;
    var fecha_i_week;
    var fecha_f_timestamp;
    var fecha_f_year;
    var fecha_f_week;


    if($('#' + id_fecha_final_reporte_investime).val() === ""){
        if($('#' + id_fecha_inicio_reporte_investime).val() === ""){
            //Si no se selecciona ninguna fecha se hacen los reportes con todos los valores
            fecha_i = new Date(2018,8,1);//Tiempo 0, no hay registros anteriores
            fecha_f_timestamp = new Date().getTime() + (24*3600*1000);
        } else {
            //Si sólo se selecciona un día se utiliza la info de ese día en particular
            fecha_i = new Date($('#' + id_fecha_inicio_reporte_investime).val());
            fecha_f_timestamp = fecha_i_timestamp + (24*3600*1000);
        }
    } else {
        fecha_i = new Date($('#' + id_fecha_inicio_reporte_investime).val());
        fecha_f_timestamp = new Date($('#' + id_fecha_final_reporte_investime).val()).getTime() + (24*3600*1000); 
    }
    fecha_i_timestamp = fecha_i.getTime();
    var fecha_i_year = getWeek(fecha_i_timestamp)[1]
    var fecha_i_week = getWeek(fecha_i_timestamp)[0]
    var fecha_f_year = getWeek(fecha_f_timestamp)[1]
    var fecha_f_week = getWeek(fecha_f_timestamp)[0]

    data.forEach(function(yearSnap){
    	if(yearSnap.key >= fecha_i_year && yearSnap.key <= fecha_f_year){
            yearSnap.forEach(function(weekSnap){
	        	if((yearSnap.key >= fecha_i_year || weekSnap.key >= fecha_i_week) && (yearSnap.key <= fecha_f_year || weekSnap.key <= fecha_f_week)){
		            weekSnap.forEach(function(regSnap){
		                var reg = regSnap.val();
		                if(reg.checkin >= fecha_i_timestamp && reg.checkin <= fecha_f_timestamp){
		                    var horas =(parseFloat(reg.horas)/3600000).toFixed(3);
                            var horas_string = reg.checkout == 0 ? "-" : msToHoursAndMinutes(parseInt(reg.checkout) - parseInt(reg.checkin));
                            console.log("hola");
                            console.log(new Date(reg.checkin).toLocaleDateString("es-ES", optionsInvestime));
	                        datos_reporte.push([
	                            reg.familia,
	                            reg.subfamilia,
	                            reg.actividad,
	                            new Date(reg.checkin).toLocaleDateString("es-ES", optionsInvestime),
	                            horas_string,
	                            reg.status_obra,
	                        ]);
		                }
		            });
	        	}
	        });
    	}
    });
}