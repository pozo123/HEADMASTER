var id_tab_datos_nomina = "tabDatosNomina";
var id_form_datos_nomina = "formNomina";

var id_button_abrir_datos_nomina = "datosNominaButton";

var id_ddl_year_datos_nomina = "yearNomina";
var id_ddl_week_datos_nomina = "semanaNomina";
var id_ddl_faltantes_datos_nomina = "trabajadoresSinRegistroNomina";
var id_id_head_datos_nomina = "idHeadNomina";

// variables globales

var starting_year = 2018;
var actual_year = new Date().getFullYear();
var actual_week = getWeek(new Date())[0];

var trabajadores_activos_json = {};

$('#' + id_tab_datos_nomina).click(function(){
    resetFormDatosNomina();
    $('#' + id_ddl_year_datos_nomina).empty();
    var select_year = document.getElementById(id_ddl_year_datos_nomina);
    for(i=actual_year;i>=starting_year;i--){
        var option_year = document.createElement('option');
        option_year.text = option_year.value = i;
        select_year.appendChild(option_year);
    }

    $('#' + id_ddl_week_datos_nomina).empty();
    var select_week = document.getElementById(id_ddl_week_datos_nomina);
    for(i=actual_week;i>0;i--){
        var option_week = document.createElement('option');
        option_week.text = option_week.value = i;
        select_week.appendChild(option_week);
    }

    $('#' + id_ddl_faltantes_datos_nomina).empty();
    var select_trabajadores_faltantes = document.getElementById(id_ddl_faltantes_datos_nomina);
    var option = document.createElement('option');
    option.text = option.value = "";
    select_trabajadores_faltantes.appendChild(option);
    firebase.database().ref(rama_bd_mano_obra + "/listas/activos").on("child_added", function(snapshot){
        firebase.database().ref(rama_bd_nomina + "/nomina").orderByChild("trabajador_id").equalTo(snapshot.key).once("value").then(function(subSnap){
            if(!subSnap.exists()){
                var option= document.createElement('option');
                var nombre = snapshot.val().split("_");
                option.text = nombre[0] + " " + nombre[1] + " " + nombre[2];
                option.value = snapshot.key;
                select_trabajadores_faltantes.appendChild(option);
            }
        });
    })
});

$('#' + id_ddl_year_datos_nomina).change(function(){
    resetFormDatosNomina();
    var select = document.getElementById(id_ddl_week_datos_nomina);
    var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
    if(year < new Date().getFullYear()){
        var ultima_semana = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ultima_semana;i>0;i--){
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
});


// Funciones necesarias

function resetFormDatosNomina(){
    $('#' + id_ddl_week_datos_nomina).empty();
};