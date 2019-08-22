var id_fecha_inicio_reporte_investime = "fechaInicioReporteInvestime";
var id_fecha_final_reporte_investime = "fichaFinalReporteInvestime";
var id_datatable_reporte_investime =  "dataTableReporteInvestime";
var id_generar_button_reporte_investime = "generarButtonReporteInvestime";

var id_modal_reporte_investime = "modalInvestTime";
var id_button_editar_reporte_investime = "buttonEditarInvestTime";

var rama_bd_familias_registros_admin = "administracion/investime/familias";
var rama_bd_registros_registros_admin = "administracion/investime/registros";

var id_familia_ddl_reporte_investime = "familiaInvestTime";
var id_subfamilia_ddl_reporte_investime = "subfamiliaInvestTime";
var id_actividad_ddl_reporte_investime = "actividadInvestTime";
var id_status_ddl_reporte_investime = "statusInvestTime";
var id_otros_reporte_investime = "otrosInvestTime";

var id_subfamilia_group_reporte_investime = "groupSubfamiliaInvest";
var id_actividad_group_reporte_investime = "groupActividadInvest";
var id_status_group_reporte_investime = "groupStatusInvest";
var id_otros_group_reporte_investime = "groupOtrosInvest";

var id_modal_fecha_inicio_reporte_investime ="fechaInicioInvestTime"
var id_hora_inicio_reporte_investime ="horasInicioInvestTime"

var id_modal_fecha_final_reporte_investime ="fechaFinalInvestTime"
var id_hora_final_reporte_investime ="horasFinalInvestTime"

var familias = {};
var user_edit = "";

var query_week = "";
var query_year = "";
var query_last = "";
var registro_id = "";

var tab_investime = "tabReporteInvestime";

var optionsInvestime = { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric' , hour: "2-digit", minute: "numeric"};

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
    registros = {};
    firebase.database().ref(rama_bd_registros_registros_admin).on('value',function(data){
        getRegsReporteAdmin(datos_reporte, data, registros);

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
                {title: "Editar"},
                {title: "UID"},
                {title: "Activo"},
            ],
            "columnDefs": [ 
            	{ "visible": false, "targets": 7 },
        	],
            language: idioma_espanol, // Esta en app_bibliotecas
        });
    });
});

function editInvestTime(key_id){
    familias = {};
    query_week = "";
    query_year = "";
    user_edit = "";
    registro_id = "";
    

    $('#' + id_familia_ddl_reporte_investime).empty();
    $('#' + id_subfamilia_ddl_reporte_investime).empty();
    $('#' + id_actividad_ddl_reporte_investime).empty();
    $('#' + id_status_ddl_reporte_investime).empty();
    $("#" + id_otros_reporte_investime).val("");

    $('#' +id_subfamilia_group_reporte_investime).addClass('hidden');
    $('#' +id_actividad_group_reporte_investime).addClass('hidden');
    $('#' +id_status_group_reporte_investime).addClass('hidden');
    $('#' +id_otros_group_reporte_investime).addClass('hidden');

    $('#' + id_modal_reporte_investime).modal('show');
    
    jQuery('#' + id_modal_fecha_final_reporte_investime).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_modal_fecha_inicio_reporte_investime).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select_familia = document.getElementById(id_familia_ddl_reporte_investime);
    var select_subfamilia = document.getElementById(id_subfamilia_ddl_reporte_investime);
    var select_actividad = document.getElementById(id_actividad_ddl_reporte_investime);
    var select_status = document.getElementById(id_status_ddl_reporte_investime);

    firebase.database().ref(rama_bd_registros_registros_admin).once("value").then(function(snapShot){
        snapShot.forEach(function(yearSnap){
            yearSnap.forEach(function(weekSnap){
                weekSnap.forEach(function(regSnap){
                    if(regSnap.key == key_id){
                        registro_id = key_id;
                        query_last = rama_bd_registros_registros_admin + "/" + yearSnap.key + "/" + weekSnap.key + "/" + key_id;
                        var reg = regSnap.val()
                        user_edit =reg.colaborador;

                        var fecha_inicial = new Date(reg.checkin);                       
                        var fecha_inicial_formato = "" + (fecha_inicial.getMonth() + 1) + "." + fecha_inicial.getDate() + "." + fecha_inicial.getFullYear();
                        $("#" + id_modal_fecha_inicio_reporte_investime).val(fecha_inicial_formato);
                        console.log(reg.checkin);
                        $("#" + id_hora_inicio_reporte_investime).val(msToHoursAndMinutes(reg.checkin - (new Date(fecha_inicial_formato).getTime())));
                        
                        var fecha_final = new Date(reg.checkout);                       
                        var fecha_final_formato = "" + (fecha_final.getMonth() + 1) + "." + fecha_final.getDate() + "." + fecha_final.getFullYear();
                        $("#" + id_modal_fecha_final_reporte_investime).val(fecha_final_formato);
                        console.log(reg.checkout);
                        $("#" + id_hora_final_reporte_investime).val(msToHoursAndMinutes(reg.checkout - (new Date(fecha_final_formato).getTime())));
                        
                        var option0_familia = document.createElement('option');
                        var option0_subfamilia = document.createElement('option');
                        var option0_status = document.createElement('option');

                        option0_familia.text = option0_familia.value = reg.familia
                        option0_subfamilia.text = option0_subfamilia.value = reg.subfamilia               
                        option0_status.text = option0_status.value = reg.status_obra

                        select_familia.appendChild(option0_familia);
                        select_subfamilia.appendChild(option0_subfamilia);
                        select_status.appendChild(option0_status);

                        if(reg.subfamilia == "Otros"){
                            $('#' +id_otros_group_reporte_investime).removeClass('hidden');
                            $("#" + id_otros_reporte_investime).val(reg.actividad);

                        } else {
                            $('#' +id_actividad_group_reporte_investime).removeClass('hidden');

                            var option0_actividad = document.createElement('option');
                            option0_actividad.text = option0_actividad.value = reg.actividad
                            select_actividad.appendChild(option0_actividad);
                            
                        }

                        if(reg.familia == "Especificos"){
                            $('#' +id_subfamilia_group_reporte_investime).removeClass('hidden');
                            $('#' +id_status_group_reporte_investime).removeClass('hidden');
                            if(reg.status_obra == "Activa"){
                                var option_status = document.createElement('option');           
                                option_status.text = option_status.value = "En cierre"
                                select_status.appendChild(option_status);
    
                                var option1_status = document.createElement('option');           
                                option1_status.text = option1_status.value = "Terminar"
                                select_status.appendChild(option1_status);
    
                            } else if(reg.status_obra == "En Cierre"){
                                var option_status = document.createElement('option');           
                                option_status.text = option_status.value = "Activa"
                                select_status.appendChild(option_status);
    
                                var option1_status = document.createElement('option');           
                                option1_status.text = option1_status.value = "Terminar"
                                select_status.appendChild(option1_status)
                            } else if(reg.status_obra == "Terminar"){
                                var option_status = document.createElement('option');           
                                option_status.text = option_status.value = "Activa"
                                select_status.appendChild(option_status);
    
                                var option1_status = document.createElement('option');           
                                option1_status.text = option1_status.value = "En cierre"
                                select_status.appendChild(option1_status);
                            } else {
                                var option_status = document.createElement('option');           
                                option_status.text = option_status.value = "Activa"
                                select_status.appendChild(option_status);
    
                                var option1_status = document.createElement('option');           
                                option1_status.text = option1_status.value = "En cierre"
                                select_status.appendChild(option1_status);
    
                                var option2_status = document.createElement('option');           
                                option2_status.text = option2_status.value = "Terminar"
                                select_status.appendChild(option2_status);
                            }
                        } else if(reg.familia == "Globales"){
                            $('#' +id_subfamilia_group_reporte_investime).removeClass('hidden');
                        } 

                        firebase.database().ref(rama_bd_familias_registros_admin).once('value').then(function(snapshot){
                            familias = snapshot;
                            snapshot.forEach(function(childSnap){
                                var familia = childSnap.key;    
                                if(familia != reg.familia){
                                    var option_familia = document.createElement('option');
                                    option_familia.text = option_familia.value = familia; 
                                    select_familia.appendChild(option_familia);
                                }
                            });    

                            if(reg.familia == "Especificos"){
                                for(key in nombre_obras){
                                    var subfam = key;
                                    if( subfam != reg.subfamilia){
                                        var option_subfamilia = document.createElement('option');
                                        option_subfamilia.text = option_subfamilia.value = subfam; 
                                        select_subfamilia.appendChild(option_subfamilia);
                                    }
                                };
                                if(reg.subfamilia != "Otros"){
                                    var option3 = document.createElement('option');
                                    option3.text = option3.value = "Otros"; 
                                    select_subfamilia.appendChild(option3);
                                }

                                snapshot.child("Especificos").forEach(function(actividadSnap){
                                    var actividad = actividadSnap.val();
                                    if(actividad != reg.actividad){
                                        var option_actividad = document.createElement('option');
                                        option_actividad.text = option_actividad.value = actividad; 
                                        select_actividad.appendChild(option_actividad);
                                    }  
                                })
                            } else if(reg.familia == "Rutinarios"){
                                snapshot.child("Rutinarios").forEach(function(actividadSnap){
                                    var actividad = actividadSnap.val();
                                    if(actividad != reg.actividad){
                                        var option_actividad = document.createElement('option');
                                        option_actividad.text = option_actividad.value = actividad; 
                                        select_actividad.appendChild(option_actividad);
                                    }
                                
                                })                             
                                if(reg.subfamilia != "Otros"){
                                    var option3 = document.createElement('option');
                                    option3.text = option3.value = "Otros"; 
                                    select_actividad.appendChild(option3);
                                } else {
                                    console.log('hola');
                                    $('#' + id_actividad_group_reporte_investime).removeClass('hidden');
                                    var option3 = document.createElement('option');
                                    option3.text = option3.value = "Otros"; 
                                    select_actividad.prepend(option3);
                                    document.getElementById(id_actividad_ddl_reporte_investime).selectedIndex = 0;
                                }

                            } else if (reg.familia == "Globales"){
                                snapshot.child("Globales").forEach(function(subfamiliaSnap){
                                    var subfamilia = subfamiliaSnap.key;
                                    if(subfamilia != reg.subfamilia && reg.subfamilia != "Otros"){
                                        var option_subfamilia = document.createElement('option');
                                        option_subfamilia.text = option_subfamilia.value = subfamilia; 
                                        select_subfamilia.appendChild(option_subfamilia);
                                    } else if(subfamilia == reg.subfamilia){
                                        subfamiliaSnap.forEach(function(actividadSnap){
                                            if(actividadSnap.val() != reg.actividad){
                                                var option_actividad = document.createElement('option');
                                                option_actividad.text = option_actividad.value = actividadSnap.val(); 
                                                select_actividad.appendChild(option_actividad);
                                            };
                                        });
                                    };
                                });

                                if(reg.subfamilia != "Otros"){
                                    var option3 = document.createElement('option');
                                    option3.text = option3.value = "Otros"; 
                                    select_subfamilia.appendChild(option3);
                                }
                            }
                        });
                    }                
                })
            });
        });
    });
}

$('#' + id_button_editar_reporte_investime).click(function(){
    var datos = {};

    var family = $('#' + id_familia_ddl_reporte_investime + " option:selected").val();
    var subfamily = $('#' + id_subfamilia_ddl_reporte_investime + " option:selected").val();
    var status = $('#' + id_status_ddl_reporte_investime + " option:selected").val();   
    var activity = $('#' + id_actividad_ddl_reporte_investime + " option:selected").val();
    var otro = $("#" + id_otros_reporte_investime).val();

    var fecha_i_edit = $("#" + id_modal_fecha_inicio_reporte_investime).val();
    var hora_i_edit = $("#" + id_hora_inicio_reporte_investime).val();

    var fecha_f_edit = $("#" + id_modal_fecha_final_reporte_investime).val();
    var hora_f_edit = $("#" + id_hora_final_reporte_investime).val();

    var checkin = new Date(fecha_i_edit).getTime();
    var checkout = new Date(fecha_f_edit).getTime();

    checkin = checkin + hoursAndMinutesToMs(hora_i_edit);
    checkout = checkout + hoursAndMinutesToMs(hora_f_edit);

    var actual_week = getWeek(checkin)[0];
    var actual_year = getWeek(checkin)[1];

    if(family == "Especificos"){
        if(subfamily != "Otros"){
            datos = {
                actividad: activity,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: status,
                subfamilia: subfamily,               
            }
        } else {
            datos = {
                actividad: otro,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: status,
                subfamilia: subfamily,               
            }
        }
    } else if (family == "Rutinarios") {
        if(activity != "Otros"){
            datos = {
                actividad: activity,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: -1,
                subfamilia: activity,               
            }
        } else {
            datos = {
                actividad: otro,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: -1,
                subfamilia: activity,               
            }
        }
    } else if(family == "Globales"){
        if(subfamily != "Otros"){
            datos = {
                actividad: activity,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: -1,
                subfamilia: subfamily,               
            }
        } else {
            datos = {
                actividad: otro,
                activo: false,
                checkin: checkin,
                checkout: checkout,
                colaborador: user_edit,
                familia: family,
                status_obra: -1,
                subfamilia: subfamily,               
            }
        }
    }
    firebase.database().ref(query_last).set(null);
    firebase.database().ref(rama_bd_registros_registros_admin + "/" + actual_year + "/" + actual_week + "/" + registro_id).set(datos);

    alert("Edición exitosa!");
    $('#' + id_generar_button_reporte_investime).trigger('click');
});

$('#' + id_familia_ddl_reporte_investime).change(function(){
    $('#' + id_subfamilia_ddl_reporte_investime).empty();
    $('#' + id_actividad_ddl_reporte_investime).empty();
    $('#' + id_status_ddl_reporte_investime).empty();
    $("#" + id_otros_reporte_investime).val("");

    $('#' +id_subfamilia_group_reporte_investime).addClass('hidden');
    $('#' +id_actividad_group_reporte_investime).addClass('hidden');
    $('#' +id_status_group_reporte_investime).addClass('hidden');
    $('#' +id_otros_group_reporte_investime).addClass('hidden');

    var select_subfamilia = document.getElementById(id_subfamilia_ddl_reporte_investime);
    var select_status = document.getElementById(id_status_ddl_reporte_investime);
    var select_actividad = document.getElementById(id_actividad_ddl_reporte_investime);

    var option0_subfamilia = document.createElement('option');
    var option0_status = document.createElement('option');
    var option0_actividad = document.createElement('option');

    option0_subfamilia.style = "display:none";
    option0_subfamilia.text = option0_subfamilia.value = "";  

    option0_status.style = "display:none";
    option0_status.text = option0_status.value = "";

    option0_actividad.style = "display:none";
    option0_actividad.text = option0_actividad.value = "";
    
    select_subfamilia.appendChild(option0_subfamilia);
    select_status.appendChild(option0_status);
    select_actividad.appendChild(option0_actividad);
    
    var family = $('#' + id_familia_ddl_reporte_investime + " option:selected").val();
    if( family == "Especificos"){
        $('#' +id_subfamilia_group_reporte_investime).removeClass('hidden');
        $('#' +id_status_group_reporte_investime).removeClass('hidden');

        var option_status = document.createElement('option');           
        option_status.text = option_status.value = "Activa"
        select_status.appendChild(option_status);

        var option1_status = document.createElement('option');           
        option1_status.text = option1_status.value = "En cierre"
        select_status.appendChild(option1_status);

        var option2_status = document.createElement('option');           
        option2_status.text = option2_status.value = "Terminar"
        select_status.appendChild(option2_status);

        // Llenar subfamilias con obras y otros
        for(key in nombre_obras){
            var subfam = key;
            var option_subfamilia = document.createElement('option');
            option_subfamilia.text = option_subfamilia.value = subfam; 
            select_subfamilia.appendChild(option_subfamilia);
        };
        var option3 = document.createElement('option');
        option3.text = option3.value = "Otros"; 
        select_subfamilia.appendChild(option3);

        familias.child("Especificos").forEach(function(actividadSnap){
            var actividad = actividadSnap.val();
            var option_actividad = document.createElement('option');
            option_actividad.text = option_actividad.value = actividad; 
            select_actividad.appendChild(option_actividad);
        })
    } else if( family == "Rutinarios"){
        $('#' +id_actividad_group_reporte_investime).removeClass('hidden');
        familias.child("Rutinarios").forEach(function(actividadSnap){
            var actividad = actividadSnap.val();
            var option_actividad = document.createElement('option');
            option_actividad.text = option_actividad.value = actividad; 
            select_actividad.appendChild(option_actividad);
        })

        var option3 = document.createElement('option');
        option3.text = option3.value = "Otros"; 
        select_actividad.appendChild(option3);
    } else if (family = "Globales"){
        $('#' +id_subfamilia_group_reporte_investime).removeClass('hidden');
        familias.child("Globales").forEach(function(subfamiliaSnap){
            var subfamilia = subfamiliaSnap.key;
            var option_subfamilia = document.createElement('option');
            option_subfamilia.text = option_subfamilia.value = subfamilia; 
            select_subfamilia.appendChild(option_subfamilia);
        }) 
        var option3 = document.createElement('option');
        option3.text = option3.value = "Otros"; 
        select_subfamilia.appendChild(option3);
    }
});

$('#' + id_subfamilia_ddl_reporte_investime).change(function(){
    var family = $('#' + id_familia_ddl_reporte_investime + " option:selected").val();
    var subfamily = $('#' + id_subfamilia_ddl_reporte_investime + " option:selected").val();

    $("#" + id_otros_reporte_investime).val("");
    $('#' + id_actividad_group_reporte_investime).addClass('hidden');
    $('#' + id_otros_group_reporte_investime).addClass('hidden');

    
    if(subfamily == "Otros"){
        $('#' + id_otros_group_reporte_investime).removeClass('hidden');        
    } else {
        $('#' + id_actividad_group_reporte_investime).removeClass('hidden');  
    }
    if(family == "Especificos"){
        $('#' + id_actividad_group_reporte_investime).remove('hidden');
        document.getElementById(id_status_obra_ddl_registroAdmin).selectedIndex = 0;
    } else if(family == "Globales"){
        // borrar previos
        $('#' + id_actividad_ddl_reporte_investime).empty();
        //llenar con nuevos

        var select_actividad = document.getElementById(id_actividad_ddl_reporte_investime);
        var option0_actividad = document.createElement('option');

        option0_actividad.style = "display:none";
        option0_actividad.text = option0_actividad.value = "";
        select_actividad.appendChild(option0_actividad);

        familias.child("Globales").forEach(function(subfamiliaSnap){
            subfamiliaSnap.forEach(function(actividadSnap){
                if(subfamiliaSnap.key == $('#' + id_subfamilia_ddl_reporte_investime + " option:selected").val()){
                    var option_actividad = document.createElement('option');
                    option_actividad.text = option_actividad.value = actividadSnap.val(); 
                    select_actividad.appendChild(option_actividad);
                };
            });
        });
    }
});

$('#' + id_actividad_ddl_reporte_investime).change(function(){

    var family = $('#' + id_familia_ddl_reporte_investime + " option:selected").val();
    var activity = $('#' + id_actividad_ddl_reporte_investime + " option:selected").val();

    $("#" + id_otros_reporte_investime).val("");
    $('#' + id_otros_group_reporte_investime).addClass('hidden');

    if(family == "Rutinarios"){
        if(activity == "Otros"){
            $('#' + id_otros_group_reporte_investime).removeClass('hidden');
        } 
    }
});

function getRegsReporteAdmin(datos_reporte, data){

    var fecha_i_timestamp;
    var fecha_i_year;
    var fecha_i_week;
    var fecha_f_timestamp;
    var fecha_f_year;
    var fecha_f_week;


    if($('#' + id_fecha_final_reporte_investime).val() === ""){
        if($('#' + id_fecha_inicio_reporte_investime).val() === ""){
            //Si no se selecciona ninguna fecha se hacen los reportes con todos los valores
            fecha_i_timestamp = new Date(2018,8,1).getTime();//Tiempo 0, no hay registros anteriores
            fecha_f_timestamp = new Date().getTime() + (24*3600*1000);
        } else {
            //Si sólo se selecciona un día se utiliza la info de ese día en particular
            fecha_i_timestamp = new Date($('#' + id_fecha_inicio_reporte_investime).val()).getTime();
            fecha_f_timestamp = fecha_i_timestamp + (24*3600*1000);
        }
    } else {
        fecha_i_timestamp = new Date($('#' + id_fecha_inicio_reporte_investime).val()).getTime();
        fecha_f_timestamp = new Date($('#' + id_fecha_final_reporte_investime).val()).getTime() + (24*3600*1000); 
    }
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
                            var button_text = "-"
                            if(!reg.activo){
                                button_text = "<button type='button' class='editar btn btn-info' onclick='editInvestTime(" + "\`" + regSnap.key + "\`" + ")'><i class='fas fa-edit'></i></button>"
                            }
		                    var horas =(parseFloat(reg.horas)/3600000).toFixed(3);
                            var horas_string = reg.checkout == 0 ? "-" : msToHoursAndMinutes(parseInt(reg.checkout) - parseInt(reg.checkin));
                            //console.log(new Date(reg.checkin).toLocaleDateString("es-ES", optionsInvestime));
	                        datos_reporte.push([
	                            reg.familia,
	                            reg.subfamilia,
	                            reg.actividad,
	                            new Date(reg.checkin).toLocaleDateString("es-ES", optionsInvestime),
	                            horas_string,
                                reg.status_obra,
                                button_text,
                                regSnap.key,
                                reg.activo
	                        ]);
		                }
		            });
	        	}
	        });
    	}
    });
}

function Comparator(a, b) {
    if (a[8] < b[8]) return -1;
    if (a[8] > b[8]) return 1;
    return 0;
  }
