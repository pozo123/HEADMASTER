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
var existe_registro = false;

var trabajadores_activos = {};

$('#' + id_tab_datos_nomina).click(function(){
    resetFormDatosNomina(true);
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
    llenarDdlFaltantes();
});

$('#' + id_ddl_year_datos_nomina).change(function(){
    resetFormDatosNomina(true);
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
    llenarDdlFaltantes();
});

$('#' + id_ddl_week_datos_nomina).change(function(){
    resetFormDatosNomina(false);
    llenarDdlFaltantes();
});

$('#' + id_ddl_faltantes_datos_nomina).change(function(){
    firebase.database().ref(rama_bd_mano_obra + "/trabajadores/" + $('#' + id_ddl_faltantes_datos_nomina + " option:selected").val()).once("value").then(function(snapshot){
        var trabajador = snapshot.val();
        $('#' + id_id_head_datos_nomina).val(trabajador.id_head);
        console.log($('#' + id_id_head_datos_nomina).val());
    })
});

$('#' + id_button_abrir_datos_nomina).click(function(){
    if($('#' + id_id_head_datos_nomina).val() == ""){
        alert("Escribe el ID HEAD o selecciona el trabajador al que deseas actualizar su nómina.")
        return;
    } 
    var id_head = $('#' + id_id_head_datos_nomina).val();
    firebase.database().ref(rama_bd_mano_obra + "/trabajadores").orderByChild("id_head").equalTo(id_head).once("child_added").then(function(snapshot){
        // ver si existe el ID HEAD primero
        if(snapshot.exists()){
            // Caso si existe registro en este año, semana de este trabajador
            var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
            var week =  $('#' + id_ddl_week_datos_nomina + " option:selected").val();  
            firebase.database().ref(rama_bd_nomina + "/listas/"+ year + "/" + week + "/" + snapshot.key).once("child_added").then(function(listaSnap){
                if(listaSnap.exists()){
                    firebase.database().ref(rama_bd_nomina + "/nomina/" + listaSnap.key).once("value").then(function(regSnap){
                        modalDatosNomina(true, regSnap, snapshot)
                    });
                } else {
                    // Caso si no existe ()
                    modalDatosNomina(false);
                };
            });
        } else {
            alert("El ID HEAD no se encuentra en la base de datos");
            return;
        }
    });
});


// VALIDACIONES

$('#' + id_id_head_datos_nomina).keypress(function(e){
    charactersAllowed("1234567890",e);
});

$('#' + id_id_head_datos_nomina).on("cut copy paste",function(e) {
    e.preventDefault();
 });

// Funciones necesarias

function resetFormDatosNomina(week){
    if(week){
        $('#' + id_ddl_week_datos_nomina).empty();
    }
    $('#' + id_ddl_faltantes_datos_nomina).empty();
    $('#' + id_ddl_faltantes_datos_nomina).prop('disabled', true);
    $('#' + id_id_head_datos_nomina).val("");
};

function llenarDdlFaltantes(){
    var select_trabajadores_faltantes = document.getElementById(id_ddl_faltantes_datos_nomina);
    var option = document.createElement('option');
    option.text = option.value = "";
    select_trabajadores_faltantes.appendChild(option);
    firebase.database().ref(rama_bd_mano_obra + "/listas/activos").orderByKey().on("value",function(snapshot){
        if(snapshot.exists()){
            trabajadores_activos = snapshot.val(); 
            var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
            var week =  $('#' + id_ddl_week_datos_nomina + " option:selected").val();  
            firebase.database().ref(rama_bd_nomina + "/listas/" + year + "/" + week).on("value", function(regSnap){
                regSnap.forEach(function(regSubSnap){
                    delete trabajadores_activos[regSubSnap.key];
                });
                for(key in trabajadores_activos){
                    var option = document.createElement('option');
                    var nombre = trabajadores_activos[key].split("_");
                    option.text = nombre[0] + " " + nombre[1] + " " + nombre[2];
                    option.value = key;
                    select_trabajadores_faltantes.appendChild(option);
                }
                $('#' + id_ddl_faltantes_datos_nomina).prop('disabled', false);
            });
        }
    });
}

function modalDatosNomina(existeRegistro, regSnapshot, trabSnapshot){
    // necesito crear el modal shingón
    if(existeRegistro){
    } else {

    }
}