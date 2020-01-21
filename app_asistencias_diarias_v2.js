// JS para ingresar asistencias por obra y día.
// ** autor: artbrare
// variables

var id_tab_asistencias_diarias = "tabAsistenciasDiarias";
var id_form_asistencias_diarias = "formAsistenciasDiarias";
var id_dataTable_asistencias_diarias = "dataTableAsistenciasDiarias";

var id_div_day_asistencias_diarias = "divDiaAsistenciasDiarias";
var id_div_abrir_asistencias_diarias = "divAbrirAsistenciasDiarias"
var id_div_container_dataTable_asistencias_diarias = "containerDataTableAsistenciasDiarias";
var id_div_table_dataTable_asistencias_diarias = "divDataTableAsistenciasDiarias";
var id_div_actualizar_asistencias_diarias = "divDatosAsistenciasDiarias";
var id_div_card_actualizar_asistencias_diarias = "divContainerActualizarDatosAsistenciasDiarias";
var id_div_container_button_actualizar_asistencias_diarias = "divContainerButtonActualizarAsistenciasDiarias";

var id_ddl_obra_asistencias_diarias = "obraAsistenciasDiarias";
var id_ddl_year_asistencias_diarias = "yearAsistenciasDiarias";
var id_ddl_week_asistencias_diarias = "weekAsistenciasDiarias";
var id_ddl_day_asistencias_diarias = "dayAsistenciasDiarias";

var json_registros_asistencias = {};
var json_procesos_asistencias = {};
var json_update_asistencias_diarias = {};

var id_button_aceptar_asistencias_diarias = "aceptarButtonAsistenciasDiarias";
var id_button_actualizar_asistencias_diarias = "actualizarButtonAsistenciasDiarias";
var id_button_guardar_datos_asistencias_diarias = "guardarRegistrosDatosAsistenciasDiarias";

// -------- FUNCIONALIDAD --------
// * Llenado de ddls y reset todo al iniciar la tab.

$('#' + id_tab_asistencias_diarias).click(function() {

    $('#' + id_div_container_button_actualizar_asistencias_diarias).addClass("hidden");
    $('#' + id_div_container_dataTable_asistencias_diarias).addClass("hidden");
    
    $('#' + id_ddl_obra_asistencias_diarias).empty();
    $('#' + id_ddl_year_asistencias_diarias).empty();
    $('#' + id_ddl_week_asistencias_diarias).empty();
    $('#' + id_ddl_day_asistencias_diarias).empty();

    var select_year = document.getElementById(id_ddl_year_asistencias_diarias);
    var select_week = document.getElementById(id_ddl_week_asistencias_diarias);
    
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        // limpiar ddls


        // llenar ddl obra
        // si se autoriza utilizar para supervisores se necesita revisar credenciales.

        var obra_select = document.getElementById(id_ddl_obra_asistencias_diarias);

        var option1 = document.createElement('option');
        option1.style = "display:none";
        option1.text = "SELECCIONA OBRA";
        option1.value = "";
        obra_select.appendChild(option1);

        var obra = snapshot.val();
        if(areas_usuario_global.rrhh || creden_usuario_global < 3){
            // caso si es rrhh o de produccion con mayores creden
            option_asignada = document.createElement('option');
            option_asignada.value = snapshot.key;
            option_asignada.text = obra.nombre;
            obra_select.appendChild(option_asignada);
        } else if(areas_usuario_global.produccion){
            // caso si es supervisor simple
            firebase.database().ref(rama_bd_obras + "/supervisores/" + snapshot.key).once("value").then(function(supSnapshot){
                if(supSnapshot.exists()){
                    supSnapshot.forEach(function(supervisorSnap){
                        if(uid_usuario_global == supervisorSnap.key){
                            option_asignada = document.createElement('option');
                            option_asignada.value = snapshot.key;
                            option_asignada.text = obra.nombre;
                            obra_select.appendChild(option_asignada);
                        };
                    });
                };
            });
        };
    });

    // llenar año y semana.
    // 2 casos. El primero es el normal, si no eres de prod y eres de rrhh puedes entrar a cualquier semana, si no solo a las últimas 2.
    
    if(areas_usuario_global.rrhh || creden_usuario_global < 3){
        for(i=actual_year;i>=starting_year;i--){
            var option_year = document.createElement('option');
            option_year.text = option_year.value = i;
            select_year.appendChild(option_year);
        };
    
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = "SELECCIONA SEMANA";
        option.value = "";
        select_week.appendChild(option);
    
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
        };
    } else {

        var option_year = document.createElement('option');
        option_year.text = option_year.value = actual_year;
        select_year.appendChild(option_year);

        var option = document.createElement('option');
        option.style = "display:none";
        option.text = "SELECCIONA SEMANA";
        option.value = "";
        select_week.appendChild(option);

        var ju_mi_1 = getDaysWeek(actual_week,actual_year);
        var jueves_1 = ju_mi_1[0];
        var miercoles_1 = ju_mi_1[1];
        var week_1 = ("0" + actual_week).slice(-2)

        jueves_1 = new Date(jueves_1).toLocaleDateString("es-ES", options_semanas);
        miercoles_1 = new Date(miercoles_1).toLocaleDateString("es-ES", options_semanas);

        var option_week = document.createElement('option');
        option_week.text = "[SEM " + week_1 + "] - " + jueves_1 + " - " + miercoles_1;
        option_week.value = week_1;
        select_week.appendChild(option_week);

        if(actual_week != 1){
            var ju_mi_2 = getDaysWeek(actual_week - 1,actual_year);
            var jueves_2 = ju_mi_2[0];
            var miercoles_2 = ju_mi_2[1];
            var week_2 = ("0" + (actual_week - 1)).slice(-2)
    
            jueves_2 = new Date(jueves_2).toLocaleDateString("es-ES", options_semanas);
            miercoles_2 = new Date(miercoles_2).toLocaleDateString("es-ES", options_semanas);
    
            var option_week = document.createElement('option');
            option_week.text = "[SEM " + week_2 + "] - " + jueves_2 + " - " + miercoles_2;
            option_week.value = week_2;
            select_week.appendChild(option_week);
        };
    };
});


// * funcionalidad cuando hay onchange en los ddls de año y semana.

$('#' + id_ddl_year_asistencias_diarias).change(function(){  
    // limpiar ddl de semana
    $('#' + id_ddl_week_asistencias_diarias).empty();

    // hidden de day
    $('#' + id_div_day_asistencias_diarias).addClass("hidden");

    var select = document.getElementById(id_ddl_week_asistencias_diarias);

    var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();

    // Aquí hacer lo mismo de insertar "Selecciona semana"

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = "SELECCIONA SEMANA";
    option.value = "";
    select.appendChild(option);

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
        };
    };
});

$('#' + id_ddl_week_asistencias_diarias).change(function (){
    $('#' + id_ddl_day_asistencias_diarias).empty();
    $('#' + id_div_day_asistencias_diarias).removeClass("hidden");

    var select_day = document.getElementById(id_ddl_day_asistencias_diarias);

    var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
    var sem = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();
    // llenado de ddl con dias de la semana empezando por jueves

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select_day.appendChild(option);

    var option_jueves = document.createElement('option');
    var option_viernes = document.createElement('option');
    var option_lunes = document.createElement('option');
    var option_martes = document.createElement('option');
    var option_miercoles = document.createElement('option');

    option_jueves.value = "jueves";
    option_viernes.value = "viernes";
    option_lunes.value = "lunes";
    option_martes.value = "martes";
    option_miercoles.value = "miercoles";

    option_jueves.text = new Date(getDaysWeek(sem,year)[0]).toLocaleDateString("es-ES", options_semanas)
    option_viernes.text = new Date(getDaysWeek(sem,year)[0] + 86400000*1).toLocaleDateString("es-ES", options_semanas)
    option_lunes.text = new Date(getDaysWeek(sem,year)[0] + 86400000*4).toLocaleDateString("es-ES", options_semanas)
    console.log(getDaysWeek(sem,year)[0]);
    option_martes.text = new Date(getDaysWeek(sem,year)[0] + 86400000*5).toLocaleDateString("es-ES", options_semanas)
    option_miercoles.text = new Date(getDaysWeek(sem,year)[0] + 86400000*6).toLocaleDateString("es-ES", options_semanas)

    select_day.appendChild(option_jueves);
    select_day.appendChild(option_viernes);
    select_day.appendChild(option_lunes);
    select_day.appendChild(option_martes);
    select_day.appendChild(option_miercoles);
});

// * funcionalidad al aceptar valores de ddl

$('#' + id_button_aceptar_asistencias_diarias).click(function (){
    if(validateModalAsistenciasDiarias()){
        $('#' + id_div_container_dataTable_asistencias_diarias).removeClass("hidden");
    };
});

// * al cambiar cualquier ddl (menos diario) se oculta el div container donde se encuentra la tabla

$('.ddlAsistenciasDiarias').change(function(){
    $('#' + id_div_container_dataTable_asistencias_diarias).addClass("hidden");
});

// * al cambiar ddl de obra, obtengo sus procesos

$('#' + id_ddl_obra_asistencias_diarias).change(function(){
    json_procesos_asistencias = {};
    firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val() + "/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
            if(procSnap.key != "PC00"){
                procSnap.child("subprocesos").forEach(function(subprocSnap){
                    json_procesos_asistencias[subprocSnap.key] = subprocSnap.val().nombre;
                });
            };
        });  
    });
});


// ------------------------------------ DATOS ---------------------------------------

$('#' + id_button_aceptar_asistencias_diarias).click(function(){
    // obtener json de registros. Lo obtengo una vez y cada vez que se haga un on value, actualizo el json.
    $('#' + id_div_card_actualizar_asistencias_diarias).addClass("hidden");
    $('#' + id_div_container_button_actualizar_asistencias_diarias).removeClass("hidden");

    firebase.database().ref(rama_bd_nomina + "/nomina").on("value", function(snapshot){
        json_registros_asistencias = {};
        var registros = snapshot.val();
        var actual_day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();
        var actual_week = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();
        var actual_year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
        var obra_actual = $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val();

        // obtengo los registros con los filtros seleccionados

        for(reg in registros){
            if(registros[reg].year_head == actual_year && registros[reg].week_head == actual_week){
                if(registros[reg].asistencias){
                    if(registros[reg].asistencias[actual_day]){
                        if(registros[reg].asistencias[actual_day].obra == obra_actual)
                        json_registros_asistencias[reg] = registros[reg];
                    };
                };
            };
        };

        // actualizo tabla.
        actualizarTablaAsistenciasDiarias(json_registros_asistencias, actual_day);
    });
});

$('#' + id_button_actualizar_asistencias_diarias).click(function(){
    var actual_day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();

    $('#' + id_div_actualizar_asistencias_diarias).empty();
    $('#' + id_div_container_button_actualizar_asistencias_diarias).addClass("hidden");

    json_update_asistencias_diarias = {};
    $('#' + id_div_card_actualizar_asistencias_diarias).removeClass("hidden");

    var div_distribuible = document.getElementById(id_div_actualizar_asistencias_diarias);
    // necesito crear renglones con la info de los registros que ya tengo


    for(reg in json_registros_asistencias){

        // id_head
        var id_head = document.createElement('label');
        id_head.className = "text-center";
        id_head.innerText = "ID: " + json_registros_asistencias[reg].trabajador_id_head
        
        var col_id = document.createElement('div');
        col_id.className = "form-group col-md-2";
        col_id.appendChild(id_head);

        var proceso = document.createElement('select');
        proceso.className = "form-control procesoDatosAsistDiaria";
                                
        for(proc in json_procesos_asistencias){
            option = document.createElement('option');
            option.value = proc;
            option.text = "(" + proc + ") " + json_procesos_asistencias[proc];
            proceso.appendChild(option);
        };
        
        var col_proc = document.createElement('div');
        col_proc.className = "form-group col-md-3";
        col_proc.appendChild(proceso);

        // nombre:

        var nombre = document.createElement('input');
        nombre.className = "form-control";
        nombre.type = "text";
        nombre.readOnly = "readonly"                             

        var col_nombre = document.createElement('div');
        col_nombre.className = "form-group col-md-5";
        col_nombre.appendChild(nombre);
        

        // actividad: Asistencia, Falta o Vacaciones

        var actividad = document.createElement('select');
        actividad.className = "form-control actividadDatosAsistDiaria";

        option_asist = document.createElement('option');
        option_falta = document.createElement('option');
        option_vacaciones = document.createElement('option');

        option_asist.value = option_asist.text = "Asistencia";
        option_falta.value =  option_falta.text = "Falta";
        option_vacaciones.value = option_vacaciones.text =  "Vacaciones";

        actividad.appendChild(option_asist);
        actividad.appendChild(option_falta);
        actividad.appendChild(option_vacaciones);
        
        var col_actividad = document.createElement('div');
        col_actividad.className = "form-group col-md-2";
        col_actividad.appendChild(actividad);
        
        var row = document.createElement('div');
        row.className = "form-row";
        row.id = reg;

        row.append(col_id);
        row.append(col_nombre);
        row.appendChild(col_proc);
        row.appendChild(col_actividad);

        var nombre_text = "";
        var nombre_array = json_registros_asistencias[reg].trabajador_nombre.split("_");
        for(var i=0; i<nombre_array.length;i++){
            if(i>0){
                nombre_text += " ";
            }
            nombre_text += nombre_array[i];
        };

        $(row.childNodes[1].childNodes[0]).val(nombre_text);
        $(row.childNodes[2].childNodes[0]).val(json_registros_asistencias[reg].asistencias[actual_day].subproceso);
        $(row.childNodes[3].childNodes[0]).val(json_registros_asistencias[reg].asistencias[actual_day].actividad);
        
        div_distribuible.appendChild(row);
    };

    // necesito ordenar todos los rows por id.

    var mylist = $('#' + id_div_actualizar_asistencias_diarias);
    var rows = mylist.children();
    rows.sort(function(a, b) {
       return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
    });
    
    $.each(rows, function(index, item) {
       mylist.append(item); 
    });

    // creo un nuevo renglón vacio
    createRowAsistenciasDiarias();

});

// funcion para guardar datos;

$('#' + id_button_guardar_datos_asistencias_diarias).click(function(){
    if(isJSONEmpty(json_update_asistencias_diarias)){
        alert("No se ingresó ningún dato nuevo.")
    } else {
        firebase.database().ref(rama_bd_nomina).update(json_update_asistencias_diarias);
        //pista de auditoría
        pda("alta", rama_bd_nomina, "");
        alert("Se ha actualizado la información del día correspondiente.");    
    }
});

// toda la funcionalidad al crear un nuevo rengón
$(document).on('change','.idHeadVacio', function(){
    // reviso si existe el ID_HEAD ingresado, además necesito revisar si existe ya un registro con ese id

    var id_head = $(this).val();
    var row = this.parentElement.parentElement;
    firebase.database().ref(rama_bd_mano_obra + "/trabajadores").orderByChild("id_head").equalTo(id_head).once("value").then(function(snapshot){
        // ver si existe el ID HEAD primero
        var trabajador = snapshot.val();
        console.log(trabajador);
        if(!snapshot.exists() ){
            alert("El ID HEAD no se encuentra en la base de datos.")
            $(row.childNodes[0].childNodes[0]).val("");
        } else {
            if(Object.keys(trabajador).length == 1){
                // Caso si existe registro en este año, semana de este trabajador
                // busco en listas si existe el registro, si sí llamo a la bd y lo busco para ver si tiene asistencias de ese día,
                // si no lo tiene, voy a tener 
                var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
                var week = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();  
                var day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();  

                var trabKey = Object.keys(trabajador)[0];

                firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/"+ year + "/" + week + "/" + trabKey).once("value").then(function(listaSnap){
                    if(listaSnap.exists()){
                        firebase.database().ref(rama_bd_nomina + "/nomina/" + Object.keys(listaSnap.val())[0]).once("value").then(function(regSnap){
                            var registro = regSnap.val();
                            // el primer if es ya que puede no existir asistencias pero sí h_e o div.
                            if(registro.asistencias && registro.asistencias[day]){
                                alert("Existe ya un registro para este día y este trabajador (OBRA: " + $('#' + id_ddl_obra_asistencias_diarias + " [value=" + registro.asistencias[day].obra + "]").text() + "). Si existe un error de captura favor de comunicarse con el encargado de RRHH. Gracias.");
                                $(row.childNodes[0].childNodes[0]).val("");
                            } else {
                                // reviso si es repetido 
                                if(esEntradaRepetidaAsistenciasDiarias(id_head)){
                                    alert("Registro repetido. Ingresa otro ID.");
                                    $(row.childNodes[0].childNodes[0]).val("");
                                } else {
                                    // caso si ya existe registro  pero no de ese día, lo que implica que solo tengo que updatear
                                    // la asistencia de ese día. Sin embargo, tengo que revisar si es el único registro diario ya que
                                    // si se edita y solo hay 1 día dado de alta y no hay div o h.e. entonces se debe actualizar listas;
    
                                    // proceso: se asigna Misc por default
    
                                    var proceso = document.createElement('select');
                                    proceso.className = "form-control procesoDatosAsistDiaria";
                                                            
                                    for(proc in json_procesos_asistencias){
                                        option = document.createElement('option');
                                        option.value = proc;
                                        option.text = "(" + proc + ") " + json_procesos_asistencias[proc];
                                        proceso.appendChild(option);
                                    };
                                    
                                    var col_proc = document.createElement('div');
                                    col_proc.className = "form-group col-md-3";
                                    col_proc.appendChild(proceso);
    
                                    // nombre:
    
                                    var nombre = document.createElement('input');
                                    nombre.className = "form-control";
                                    nombre.type = "text";
                                    nombre.id = trabKey;
                                    nombre.readOnly = "readonly"                             
    
                                    var col_nombre = document.createElement('div');
                                    col_nombre.className = "form-group col-md-5";
                                    col_nombre.appendChild(nombre);
                                    
    
                                    // actividad: Asistencia, Falta o Vacaciones
    
                                    var actividad = document.createElement('select');
                                    actividad.className = "form-control actividadDatosAsistDiaria";
    
                                    option_asist = document.createElement('option');
                                    option_falta = document.createElement('option');
                                    option_vacaciones = document.createElement('option');
    
                                    option_asist.value = option_asist.text = "Asistencia";
                                    option_falta.value =  option_falta.text = "Falta";
                                    option_vacaciones.value = option_vacaciones.text =  "Vacaciones";
    
                                    actividad.appendChild(option_asist);
                                    actividad.appendChild(option_falta);
                                    actividad.appendChild(option_vacaciones);
                                    
                                    var col_actividad = document.createElement('div');
                                    col_actividad.className = "form-group col-md-2";
                                    col_actividad.appendChild(actividad);
    
                                    // --------------------------------------------------------
                                    row.appendChild(col_nombre);
                                    row.appendChild(col_proc);
                                    row.appendChild(col_actividad);
    
                                    // actualizo el id del row con el id del registro existente
    
                                    row.id = regSnap.key;
    
                                    // asigno valores por default
    
                                    var nombre_text = "";
                                    var nombre_array = trabajador[trabKey].nombre.split("_");
                                    for(var i=0; i<nombre_array.length;i++){
                                        if(i>0){
                                            nombre_text += " ";
                                        }
                                        nombre_text += nombre_array[i];
                                    };
    
                                    $(row.childNodes[1].childNodes[0]).val(nombre_text);
                                    $(row.childNodes[2].childNodes[0]).val("MISC");
    
    
                                    // NECESITO ACTUALIZAR JSON_UPDATE con la nueva entrada y las listas correspondientes.

                                    // con esto actualizo el registro
    
                                    json_update_asistencias_diarias["nomina/" + regSnap.key + "/asistencias/" + day] = {
                                        actividad: "Asistencia",
                                        fecha: getTimestampDay(year,week, day),
                                        obra: $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val(),
                                        subproceso: "MISC",
                                    }

                                    // necesito actualizar las listas que son:
                                    // - solo en obra ya que se crean por default "Asistencia" y proc "MISC", por lo que no necesito actualizar en
                                    // - vacaciones y faltas. En obra Asignada no modifico pq ya se generó antes y no modifico el valor
                                    // - en fecha_datos no se modifica dado que es la misma semana, ya se encuentra el registro en esa lista
                                    // - diversos, h.e. y pagos no se toca
                                    json_update_asistencias_diarias["listas/obras/" + $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val() + "/MISC/" + regSnap.key] = true;

                                    console.log(json_update_asistencias_diarias);
                                    //----------
    
                                    // le quito lo vacio y genero un rengón nuevo
                                    $('.idHeadVacio').addClass("idHeadLleno");
                                    $('.idHeadVacio').removeClass("idHeadVacio");                                
                                    createRowAsistenciasDiarias();
    
                                    // si aprieto "enter" o "tab" se debe ir al siguiente renglón
                                    $('.idHeadVacio').focus();
                                };
                            };
                            

                        });
                    } else {
                        // CASO 2
                        // caso si no existe un solo registro en la semana, aquí necesito generar todo el registro

                        // checo si el registro es repetido
                        if(esEntradaRepetidaAsistenciasDiarias(id_head)){
                            alert("Registro repetido. Ingresa otro ID.");
                            $(row.childNodes[0].childNodes[0]).val("");
                        } else {
                            var proceso = document.createElement('select');
                            proceso.className = "form-control procesoDatosAsistDiaria";
                                                    
                            for(proc in json_procesos_asistencias){
                                option = document.createElement('option');
                                option.value = proc;
                                option.text = "(" + proc + ") " + json_procesos_asistencias[proc];
                                proceso.appendChild(option);
                            };
                            
                            var col_proc = document.createElement('div');
                            col_proc.className = "form-group col-md-3";
                            col_proc.appendChild(proceso);
    
                            // nombre:
    
                            var nombre = document.createElement('input');
                            nombre.className = "form-control";
                            nombre.type = "text";
                            nombre.id = trabKey;
                            nombre.readOnly = "readonly"                             
    
                            var col_nombre = document.createElement('div');
                            col_nombre.className = "form-group col-md-5";
                            col_nombre.appendChild(nombre);
                            
    
                            // actividad: Asistencia, Falta o Vacaciones
    
                            var actividad = document.createElement('select');
                            actividad.className = "form-control actividadDatosAsistDiaria";
    
                            option_asist = document.createElement('option');
                            option_falta = document.createElement('option');
                            option_vacaciones = document.createElement('option');
    
                            option_asist.value = option_asist.text = "Asistencia";
                            option_falta.value =  option_falta.text = "Falta";
                            option_vacaciones.value = option_vacaciones.text =  "Vacaciones";
    
                            actividad.appendChild(option_asist);
                            actividad.appendChild(option_falta);
                            actividad.appendChild(option_vacaciones);
                            
                            var col_actividad = document.createElement('div');
                            col_actividad.className = "form-group col-md-2";
                            col_actividad.appendChild(actividad);
    
                            // --------------------------------------------------------
                            row.appendChild(col_nombre);
                            row.appendChild(col_proc);
                            row.appendChild(col_actividad);
                            
                            var id_nuevo = row.id;
                            // asigno valores por default
    
                            var nombre_text = "";
                            var nombre_array = trabajador[trabKey].nombre.split("_");
                            for(var i=0; i<nombre_array.length;i++){
                                if(i>0){
                                    nombre_text += " ";
                                }
                                nombre_text += nombre_array[i];
                            };
    
                            $(row.childNodes[1].childNodes[0]).val(nombre_text);
                            $(row.childNodes[2].childNodes[0]).val("MISC");
    
    
                            // NECESITO ACTUALIZAR JSON_UPDATE con la nueva entrada y las listas correspondientes.
                            // se actualiza generando todo el registro NO EXISTE REGISTRO

                            var json_day = {}
                            json_day[day] =  {
                                actividad: "Asistencia",
                                fecha: getTimestampDay(year,week, day),
                                obra: $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val(),
                                subproceso: "MISC",
                            };

                            json_update_asistencias_diarias["nomina/" + id_nuevo] = {
                                asistencias: json_day,
                                obra_asignada: $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val(),
                                obra_asignada_nombre: $('#' + id_ddl_obra_asistencias_diarias + " option:selected").text(),
                                sueldo_semanal: trabajador[trabKey].sueldo_base,
                                trabajador_esp: trabajador[trabKey].id_especialidad,
                                trabajador_id: trabKey,
                                trabajador_id_head: trabajador[trabKey].id_head,
                                trabajador_id_pagadora: trabajador[trabKey].id_pagadora,
                                trabajador_jefe: trabajador[trabKey].jefe,
                                trabajador_nombre: trabajador[trabKey].nombre,
                                trabajador_puesto: trabajador[trabKey].id_puesto,
                                week_head: week,
                                year_head: year,
                            } 

                             // necesito actualizar las listas que son:
                             // obra asignada, obras, fecha_datos, trabajadores
                             // NOTA: no necesito actualizar vacaciones, faltas, h.e, diversos, fecha_pagos
                             
                             json_update_asistencias_diarias["listas/obra_asignada/" + $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val() + "/" + id_nuevo] = true;
                             json_update_asistencias_diarias["listas/obras/" + $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val() + "/MISC/" + id_nuevo] = true;
                             json_update_asistencias_diarias["listas/fecha_datos/" + year + "/" + week + "/" + trabKey + "/"+ id_nuevo] = true;
                             json_update_asistencias_diarias["listas/trabajadores/" + trabKey+ "/"+ id_nuevo] = true;

                            console.log(json_update_asistencias_diarias);
                            //----------
    
                            // le quito lo vacio y genero un rengón nuevo
                            $('.idHeadVacio').addClass("idHeadLleno");
                            $('.idHeadVacio').removeClass("idHeadVacio");                                
                            createRowAsistenciasDiarias();
    
                            // si aprieto "enter" o "tab" se debe ir al siguiente renglón
                            
                            $('.idHeadVacio').focus();
                        };
                    };
                });
            } else {
                alert("Existen 2 o más usuarios con el mismo ID.");
                $(row.childNodes[0].childNodes[0]).val("");
            };
        };
        // aquí termina firebase
    });
});

// si cambio el valor de un id ya creado, elimino la fila y elimino toda su info del json_update
// OJO: para eliminar el registro de este dia, hacerlo desde la tabla
// ---------------------------------------
// ---------------------------------------
$(document).on('change','.idHeadLleno', function(){
    var row = this.parentElement.parentElement;
    // genero las variables necesarias para actualizar datos
    var regKey = row.id;
    var obra = $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val();
    var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
    var week = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();
    var day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();
    var proc = $(row.childNodes[2].childNodes[0]).val();;
    var fecha = getTimestampDay(year, week, day);

    // ------ 
    var trabKey = row.childNodes[1].childNodes[0].id;
    // elimino las rutas del json_update
    // ------------------------------------
    // ** primero elimino el registro
    if(json_update_asistencias_diarias["nomina/" + regKey]){
        delete json_update_asistencias_diarias["nomina/" + regKey];
    } else if(json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day]){
        delete json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day];
    }

     //  ** ahora listas
    
     if(json_update_asistencias_diarias["listas/obra_asignada/" + obra + "/" + regKey]){
         delete json_update_asistencias_diarias["listas/obra_asignada/" + obra + "/" + regKey];
     }

     if(json_update_asistencias_diarias["listas/fecha_datos/" + year + "/" + week + "/" + trabKey + "/"+ regKey]){
        delete json_update_asistencias_diarias["listas/fecha_datos/" + year + "/" + week + "/" + trabKey + "/"+ regKey];
     }
     if(json_update_asistencias_diarias["listas/trabajadores/" + trabKey + "/"+ regKey]){
        delete json_update_asistencias_diarias["listas/trabajadores/" + trabKey + "/"+ regKey];
     }

     // obra
     delete json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc + "/" + regKey];

     // borrar el caso de si es falta o vacaciones
     // faltas
     if(json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey]){
        delete json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey];
        delete json_update_asistencias_diarias["listas/faltas/trabajadores/" + trabKey + "/" + regKey]
        // vacaciones
     } else if(json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey]){
        delete json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey];
        delete json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + trabKey + "/" + regKey]
     }


    // elimino el renglón
    document.getElementById(row.id).remove();

    // apuntar en el campo vacio
    $('.idHeadVacio').focus();
    console.log(json_update_asistencias_diarias)
});

// updatear listas cuando se hace un cambio en algún renglón en el ddl de actividad

$(document).on('change','.actividadDatosAsistDiaria', function(){
    var row = this.parentElement.parentElement;
    // genero las variables necesarias para actualizar datos
    var regKey = row.id;
    var day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();
    var week = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();
    var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
    var obra = $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val();
    var actividad = $(this).val();
    var fecha = getTimestampDay(year, week, day);

    // tengo que actualizar el json_update en nomina y listas de  todos los casos posibles.
    firebase.database().ref(rama_bd_nomina + "/nomina/" + regKey).once("value").then(function(snapshot){
        if(snapshot.exists()){
            // CASO Existe registro
            var registro = snapshot.val();
            var asistencias = registro.asistencias;
            
            // actualizo las listas
            if(actividad == "Falta") {
                json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey] = true;
                json_update_asistencias_diarias["listas/faltas/trabajadores/" + registro.trabajador_id + "/" + regKey] = true;
            } else if(actividad == "Vacaciones"){
                json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey] = true;
                json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + registro.trabajador_id + "/" + regKey] = true;
            };

            // tengo dos subcasos
            // 1.- si el registro existe pero la entrada de ese día no
            // 2.- si el registro existe y la entrada también pero se desea modificar.
            if(!asistencias || !asistencias[day]){
                // subcaso 1
                var actividad_anterior = json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day].actividad;

                if (actividad_anterior == "Falta"){
                    delete json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey];
                    delete json_update_asistencias_diarias["listas/faltas/trabajadores/" + registro.trabajador_id + "/" + regKey]
                } else if(actividad_anterior == "Vacaciones"){
                    delete json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey];
                    delete json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + registro.trabajador_id + "/" + regKey]
                };
                // actualizo la parte del registro en el json_update
                json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day].actividad = actividad;
                console.log(json_update_asistencias_diarias);
            } else {
                // subcaso 2
                var actividad_anterior = asistencias[day].actividad;

                // reviso los distintos casos posibles dependiendo de la actividad anterior y la nueva actividad
                if(actividad == "Asistencia"){
                    if(actividad_anterior == "Falta"){
                        json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                        json_update_asistencias_diarias["listas/faltas/trabajadores/" + registro.trabajador_id + "/" + regKey] = null
                    } else {
                        json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                        json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + registro.trabajador_id + "/" + regKey] = null
                    };
                } else if (actividad == "Vacaciones"){
                    if(actividad_anterior == "Falta"){
                        json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                        json_update_asistencias_diarias["listas/faltas/trabajadores/" + registro.trabajador_id + "/" + regKey] = null;
                    }
                } else if(actividad == "Falta"){
                    if(actividad_anterior == "Vacaciones"){
                        json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                        json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + registro.trabajador_id + "/" + regKey] = null;
                    }
                };
                // actualizo la parte del registro en el json_update
                json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day + "/actividad"] = actividad; 
                console.log(json_update_asistencias_diarias);
            };
        } else {
            // CASO 2: No existe el registro,
            var actividad_anterior = json_update_asistencias_diarias["nomina/" + regKey].asistencias[day].actividad;
            var trabajador_id = json_update_asistencias_diarias["nomina/" + regKey].trabajador_id;
            // actualizo las listas
            if(actividad == "Falta") {
                json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey] = true;
                json_update_asistencias_diarias["listas/faltas/trabajadores/" + trabajador_id + "/" + regKey] = true;
            } else if(actividad == "Vacaciones"){
                json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey] = true;
                json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + trabajador_id + "/" + regKey] = true;
            };

            // actualizo el registro

            if(actividad_anterior == "Vacaciones"){
                delete json_update_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey];
                delete json_update_asistencias_diarias["listas/vacaciones/trabajadores/" + trabajador_id + "/" + regKey];
            } else if(actividad_anterior == "Falta"){
                delete json_update_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey];
                delete json_update_asistencias_diarias["listas/faltas/trabajadores/" + trabajador_id + "/" + regKey];
            };
            // actualizo la parte del registro en el json_update
            json_update_asistencias_diarias["nomina/" + regKey].asistencias[day].actividad = actividad;
            console.log(json_update_asistencias_diarias);
        };
    });
});

// updatear listas cuando se hace un cambio en algún renglón en el ddl de proceso

$(document).on('change','.procesoDatosAsistDiaria', function(){
    var row = this.parentElement.parentElement;
    // genero las variables necesarias para actualizar datos
    var regKey = row.id;
    var day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();
    var obra = $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val();
    var proc = $(this).val();

    firebase.database().ref(rama_bd_nomina + "/nomina/" + regKey).once("value").then(function(snapshot){
        if(snapshot.exists()){          
            // CASO 1: si ya existe el registro,
            var registro = snapshot.val();
            var asistencias = registro.asistencias;
            var horas_extra = registro.horas_extra;
            var diversos = registro.diversos;
            

            // necesito actualizar la lista de obra y proc donde necesitamos revisar que
            // si era el único día de la semana en ese proc y además tengo que revisar si existen diversos y horas_extra para ver si existe;
            json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc + "/" + regKey] = true;

            // tengo dos subcasos
            // 1.- si el registro existe pero la entrada de ese día no
            // 2.- si el registro existe y la entrada también pero se desea modificar.
            if(!asistencias || !asistencias[day]){
                // subcaso 1
                // obtengo el proc anterior desde el json_update
                var proc_anterior = json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day].subproceso;

                // eliminar el update del proc anterior
                delete json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc_anterior + "/" + regKey];

                // actualizo la parte del registro en el json_update
                json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day].subproceso = proc;
            } else {
                // subcaso 2
                // ahora voy a contar el número de veces que aparece el proceso antes de la modificacion en el registro
                // es fácil obtenerlo desde el registro. Al tener el contardor, si contador - 1 = 0 entonces actualizo esa lista con null.
                var proc_anterior = asistencias[day].subproceso;
                var contador = 0;

                // contar en asistencias;
                if(asistencias){
                    for(asist in asistencias){
                        if(asistencias[asist].obra == obra && asistencias[asist].subproceso == proc_anterior){
                            contador++;
                        };
                    };
                };
                // contar en h.e.
                if(horas_extra){
                    for(hor in horas_extra){
                        if(horas_extra[hor].obra == obra && horas_extra[hor].subproceso == proc_anterior){
                            contador ++;
                        }
                    }
                }
                // contar en div.
                if(diversos){
                    for(div in diversos){
                        if(diversos[div].obra == obra && diversos[div].subproceso == proc_anterior){
                            contador ++;
                        }
                    }
                }
                // si cont - 1 > 0 signfica que aún hay obra registrada con el proc anterior, solo basta borrarlo del json y no de db
                // si cont - 1 == 0 significa que ya no hay obra registrada con el proc anterior, necesitamos borrar la ruta de la lista
                // del proc anterior

                if(contador - 1 > 0){
                    if(json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc_anterior + "/" + regKey]){
                        delete  json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc_anterior + "/" + regKey];
                    };
                } else {
                    json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc_anterior + "/" + regKey] = null;
                }

                // actualizo la parte del registro en el json_update
                json_update_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day + "/subproceso"] = proc;           
            };
            console.log(json_update_asistencias_diarias)
        } else {
            // CASO 2: No existe el registro,
            json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc + "/" + regKey] = true;
            
            var proc_anterior = json_update_asistencias_diarias["nomina/" + regKey].asistencias[day].subproceso;
            delete json_update_asistencias_diarias["listas/obras/" + obra + "/" + proc_anterior + "/" + regKey]

            // actualizo la parte del registro en el json_update
            json_update_asistencias_diarias["nomina/" + regKey].asistencias[day].subproceso = proc;
            console.log(json_update_asistencias_diarias);
        };
        // acaba firebase
    });
});
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// ----------------------------------  MÉTODOS  --------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function validateModalAsistenciasDiarias(){
    if($("#" + id_ddl_obra_asistencias_diarias + " option:selected").val() == "" || $("#" + id_ddl_week_asistencias_diarias + " option:selected").val() == "" || $("#" + id_ddl_day_asistencias_diarias + " option:selected").val() == ""){
        alert("Selecciona todos los campos.");
        return false;
    } else {
        return true;
    };
};

function actualizarTablaAsistenciasDiarias(registros, day){
    // si el json_update está vacío, no hacer nada.
    if(!jQuery.isEmptyObject(json_registros_asistencias)){
        $('#' + id_div_table_dataTable_asistencias_diarias).removeClass("hidden");
        
        // actualizamos tabla;
        var datos = [];
        for(reg in registros){
            // obtener nombre;
            var nombre = "";
            var nombre_array = registros[reg].trabajador_nombre.split("_");
            for(var i=0; i<nombre_array.length;i++){
                if(i>0){
                    nombre += " ";
                }
                nombre += nombre_array[i];
            };

            // obtener nombre de jefe;
            var jefe = "";
            var jefe_array = registros[reg].trabajador_jefe.split("_");
            for(var i=0; i<jefe_array.length;i++){
                if(i>0){
                    jefe += " ";
                }
                jefe += jefe_array[i];
            };
            // generar array con datos
            datos.push([
                reg,
                registros[reg].trabajador_id_head,
                nombre,
                jefe,
                formatMoney(registros[reg].sueldo_semanal),
                registros[reg].asistencias[day].subproceso,
                registros[reg].asistencias[day].actividad,
                "<button type='button' class='btn btn-danger' onclick='deleteAsistenciaDiaria(" + "\`" + reg + "\`" + ")'><i class='fas fa-trash'></i></button>",
            ]);
        };

        // generar tabla

        table_asistencias_diarias = $('#'+ id_dataTable_asistencias_diarias).DataTable({
            destroy: true,
            "order": [[ 1, "asc" ]],
            data: datos,
            language: idioma_espanol,
            "columnDefs": [
                {
                    targets: 1,
                    className: 'dt-body-center'
                },
                {
                    targets: 4,
                    className: 'dt-body-center'
                },
                {
                    targets: 5,
                    className: 'dt-body-center'
                },
                {
                    targets: 6,
                    className: 'dt-body-center'
                },
                {
                    targets: 7,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 },
              ],
              dom: 'Bfrtip',
              buttons: [
                {extend: 'excelHtml5',
                title: "asistencias_diarias",
                exportOptions: {
                    columns: [1,2,3,4,5,6]
                }},
              ],
              "paging":false,
              "autoWidth": false,
        });
    } else {
        console.log("2");
        $('#' + id_div_table_dataTable_asistencias_diarias).addClass("hidden");
    }
};

// funciones que crea nuevo rengón en la sección de distribución

function createRowAsistenciasDiarias(key){
    if(key == null){
        var key = firebase.database().ref("dummy").push().key;
    };

    var id_head = document.createElement('input');
    id_head.className = "form-control idHead idHeadVacio";
    id_head.type = "text";
    id_head.placeholder = "ID HEAD";
    
    var col = document.createElement('div');
    col.className = "form-group col-md-2";
    col.appendChild(id_head);
    
    var row = document.createElement('div');
    row.className = "form-row";
    row.id = key;
    row.append(col);

    var div_distribuible = document.getElementById(id_div_actualizar_asistencias_diarias);
    div_distribuible.appendChild(row);
};

function esEntradaRepetidaAsistenciasDiarias(id_head){
    var res = false;
    $( ".idHeadLleno" ).each(function() {
        var id = $(this).val();
        if(id_head == id){
            res = true;
        };
    });
    return res;
};
// función para eliminar un registro diario
// en caso de eliminar el único registro de la semana se debe eliminar todo el registro
// se deben eliminar las listas correspondientes
function deleteAsistenciaDiaria(key){
    var r = confirm("¿Estás seguro de eliminar el registro seleccionado?");
    if(r == true){
        var delete_json_asistencias_diarias = {};
        var obra = $('#' + id_ddl_obra_asistencias_diarias + " option:selected").val();
        var year = $('#' + id_ddl_year_asistencias_diarias + " option:selected").val();
        var week = $('#' + id_ddl_week_asistencias_diarias + " option:selected").val();
        var day = $('#' + id_ddl_day_asistencias_diarias + " option:selected").val();
        var fecha = getTimestampDay(year, week, day);

        firebase.database().ref(rama_bd_nomina + "/nomina/" + key).once("value").then(function(snapshot){
            var registro = snapshot.val();
            var regKey = snapshot.key;
            var trabKey = registro.trabajador_id;

            var proc = registro.asistencias[day].subproceso;
            var actividad = registro.asistencias[day].actividad;
            var contador_dias = 0;

            // cuento el número de días que hay en asistencias;
            for(key in registro.asistencias){
                contador_dias++;
            }

            // si el registro solo cuenta con un registro diario y no cuenta con horas extra o con diversos
            // entonfes se borra todo el registro
            // en caso de contrario solo se borra la entrada
            if(!registro.pagos_nomina){
                if(contador_dias - 1 == 0 && !registro.horas_extra && !registro.diversos){
                    // se elimina todo el registro
                    delete_json_asistencias_diarias["nomina/" + regKey] = null;
                    
                    // listas que se eliminan al eliminar el registro entero;
                    delete_json_asistencias_diarias["listas/obra_asignada/" + obra + "/" + regKey] = null;
                    delete_json_asistencias_diarias["listas/fecha_datos/" + year + "/" + week + "/" + trabKey + "/"+ regKey] = null;
                    delete_json_asistencias_diarias["listas/obras/" + obra + "/" + proc + "/" + regKey] = null;
                    delete_json_asistencias_diarias["listas/trabajadores/" + trabKey + "/"+ regKey] = null;
                } else {
                    // se elimina solo la entrada
                    delete_json_asistencias_diarias["nomina/" + regKey + "/asistencias/" + day] = null;
    
                    // aquí tengo que revisar cuantas veces aparece el proc en la semana, si solo es 1 entonces se borra la lista.
                    var contador_proc = 0;
                    for(key in registro.asistencias){
                        if(registro.asistencias[key].subproceso == proc){
                            contador_proc ++;
                        };
                    };

                    if(contador_proc - 1 == 0){
                        delete_json_asistencias_diarias["listas/obras/" + obra + "/" + proc + "/" + regKey] = null;
                    }
                }
        
                // listas de vacaciones y faltas
                if(actividad == "Falta"){
                    delete_json_asistencias_diarias["listas/faltas/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                    delete_json_asistencias_diarias["listas/faltas/trabajadores/" + trabKey + "/" + regKey] = null;
                } else if(actividad == "Vacaciones"){
                    delete_json_asistencias_diarias["listas/vacaciones/fechas/" + aaaammdd(fecha) + "/"+ regKey] = null;
                    delete_json_asistencias_diarias["listas/vacaciones/trabajadores/" + trabKey + "/" + regKey] = null;
                };
                // updatear
                console.log(delete_json_asistencias_diarias);
                firebase.database().ref(rama_bd_nomina).update(delete_json_asistencias_diarias);
                
                alert("Se eliminó el registro seleccionado.")
            }
            // aquí termina firebase
        });
    };
};