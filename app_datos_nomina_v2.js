var id_tab_datos_nomina = "tabDatosNomina";
var id_form_datos_nomina = "formNomina";
var id_modal_datos_datos_nomina = "modalDatosNomina";

var id_button_abrir_datos_nomina = "datosNominaButton";
var id_button_asistencias_datos_nomina = "buttonGuardarAsistencias";

var id_ddl_year_datos_nomina = "yearNomina";
var id_ddl_week_datos_nomina = "semanaNomina";
var id_ddl_faltantes_datos_nomina = "trabajadoresSinRegistroNomina";
var id_id_head_datos_nomina = "idHeadNomina";

var class_modal_obra_datos_nomina = "obraNomina";
var class_modal_proceso_datos_nomina = "procesoNomina";
var class_modal_actividad_datos_nomina = "actividadNomina";

var id_modal_nombre_nomina = "nombreModalDatosNomina";
var id_modal_sem_nomina = "semanaModalDatosNomina";
var id_modal_year_nomina = "yearModalDatosNomina"

// variables globales

var starting_year = 2018;
var actual_week = getWeek(new Date())[0];
var actual_year = getWeek(new Date())[1];
var id_registro_existente = "";
var existe_registro = false;
var trabajador_json = {};

var trabajadores_sin_registro = {};
var dias = ["jueves", "viernes", "lunes", "martes", "miercoles"];



$('#' + id_tab_datos_nomina).click(function(){
    existe_registro = false;
    id_registro_existente = "";;
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

    $('#' + id_ddl_faltantes_datos_nomina).empty();
    llenarDdlFaltantes();

    // Llenado del ddl de obra en el modal
    $('.' + class_modal_obra_datos_nomina).empty();
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").on("value", function(snapshot){
        var obras_ddl = document.getElementsByClassName(class_modal_obra_datos_nomina);
        for(var i=0;i<obras_ddl.length;i++){
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            obras_ddl[i].appendChild(option);
            snapshot.forEach(function(obraSnap){
                option = document.createElement('option');
                option.value = obraSnap.key;
                option.text = obraSnap.val().nombre;
                obras_ddl[i].appendChild(option);
            });
        }
    });
});

$('#' + id_ddl_year_datos_nomina).change(function(){
    resetFormDatosNomina(true);
    var select = document.getElementById(id_ddl_week_datos_nomina);
    var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
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
    })
});

$('#' + id_id_head_datos_nomina).change(function(){
    var id_head = $('#' + id_id_head_datos_nomina).val();
    firebase.database().ref(rama_bd_mano_obra + "/trabajadores").orderByChild("id_head").equalTo(id_head).once("value").then(function(snapshot){
        if(snapshot.exists() ){
            var trabajador = snapshot.val();
            $('#' + id_ddl_faltantes_datos_nomina).val(Object.keys(trabajador)[0]);
        }
    });
});

$('#' + id_button_abrir_datos_nomina).click(function(){
    if($('#' + id_id_head_datos_nomina).val() == ""){
        alert("Escribe el ID HEAD o selecciona el trabajador al que deseas actualizar su nómina.")
        return;
    } 
    var id_head = $('#' + id_id_head_datos_nomina).val();
    firebase.database().ref(rama_bd_mano_obra + "/trabajadores").orderByChild("id_head").equalTo(id_head).once("value").then(function(snapshot){
        // ver si existe el ID HEAD primero
        var trabajador = snapshot.val();
        if(!snapshot.exists() ){
            alert("El ID HEAD no se encuentra en la base de datos.")
        } else {
            if(Object.keys(trabajador).length == 1){
                // Caso si existe registro en este año, semana de este trabajador
                var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
                var week =  $('#' + id_ddl_week_datos_nomina + " option:selected").val();  
                firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/"+ year + "/" + week + "/" + Object.keys(trabajador)[0]).once("value").then(function(listaSnap){
                    if(listaSnap.exists()){
                        firebase.database().ref(rama_bd_nomina + "/nomina/" + Object.keys(listaSnap.val())[0]).once("value").then(function(regSnap){
                            existe_registro = true;
                            modalDatosNomina(existe_registro, snapshot, regSnap)
                        });
                    } else {
                        // Caso si no existe ()
                        modalDatosNomina(existe_registro, snapshot);
                    };

                });
            } else {
                alert("Existen 2 o más usuarios con el mismo ID.");
                return;
            }
        }
    });
});

function llenarDdlFaltantes(){
    firebase.database().ref(rama_bd_mano_obra + "/listas/activos").orderByKey().on("value",function(snapshot){
        if(snapshot.exists()){
            trabajadores_sin_registro = snapshot.val();  
            firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/" + $('#' + id_ddl_year_datos_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_datos_nomina + " option:selected").val()).on("value", function(regSnap){
                $('#' + id_ddl_faltantes_datos_nomina).empty();
                
                var select_trabajadores_faltantes = document.getElementById(id_ddl_faltantes_datos_nomina);
                var option = document.createElement('option');
                option.text = option.value = "";
                select_trabajadores_faltantes.appendChild(option);
                
                regSnap.forEach(function(regSubSnap){
                    delete trabajadores_sin_registro[regSubSnap.key];
                });
                for(key in trabajadores_sin_registro){
                    var option = document.createElement('option');
                    var nombre = trabajadores_sin_registro[key].split("_");
                    option.text = nombre[0] + " " + nombre[1] + " " + nombre[2];
                    option.value = key;
                    select_trabajadores_faltantes.appendChild(option);
                }
                $('#' + id_ddl_faltantes_datos_nomina).prop('disabled', false);
            });
        }
    });
}

// VALIDACIONES

$('#' + id_id_head_datos_nomina).keypress(function(e){
    charactersAllowed("1234567890",e);
});

$('#' + id_id_head_datos_nomina).on("cut copy paste",function(e) {
    e.preventDefault();
 });

// Funciones necesarias

function resetFormDatosNomina(week){
    id_registro_existente = "";;
    trabajadores_sin_registroregistro = false;
    if(week){
        $('#' + id_ddl_week_datos_nomina).val("");
    }
    $('#' + id_ddl_faltantes_datos_nomina).empty();
    $('#' + id_ddl_faltantes_datos_nomina).prop('disabled', true);
    $('#' + id_id_head_datos_nomina).val("");
};




// ------------------------------ ASISTENCIAS --------------------------------------

$('#' + id_button_asistencias_datos_nomina).click(function(){
    if(!validateModalDatosNomina()){
        alert("Por favor selecciona el proceso correspondiente.")
        return;
    }
    // aqui poner datos asist, he y diversos
    var asistencias = datosAsistenciaDatosNomina();
    var week_head = $('#' + id_ddl_week_datos_nomina + " option:selected").val();
    var year_head = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
    if(existe_registro){ 
        firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/asistencias").once("value").then(function(regSnap){
            var registro_antiguo = regSnap.val();
            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/asistencias").update(asistencias)
            // reset listas anteriores
            var listas_path = {}
            firebase.database().ref(rama_bd_nomina + "/listas/obras").once("value").then(function(snapshot){
                snapshot.forEach(function(obraSnap){
                    obraSnap.forEach(function(procesoSnap){
                        listas_path["listas/obras/" + obraSnap.key + "/" + procesoSnap.key + "/" + id_registro_existente] = null;
                    });
                });
                listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = null;
                listas_path["listas/vacaciones/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = null;
                listas_path["listas/faltas/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                
                // actualizar listas
                listas_path["listas/fecha_datos/" + year_head + "/" + week_head + "/" + trabajador_json.trabajador_id + "/"+ id_registro_existente] = true;
                listas_path["listas/trabajadores/" + trabajador_json.trabajador_id + "/"+ id_registro_existente] = true;
                
                for(key in asistencias){
                    listas_path["listas/obras/" + asistencias[key].obra + "/" + asistencias[key].subproceso + "/" + id_registro_existente] = true;
                    if(asistencias[key].actividad == "Vacaciones"){
                        listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = true;
                        listas_path["listas/vacaciones/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = true;
                    } else if(asistencias[key].actividad == "Falta"){
                        listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = true;
                        listas_path["listas/faltas/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = true;
                    }
                    console.log(listas_path);
                    console.log(key);
                    console.log(asistencias);
                };

                firebase.database().ref(rama_bd_nomina).update(listas_path);
                //pista de auditoría
                pda("modificacion", rama_bd_nomina + "/nomina/" + id_registro_existente + "/asistencias", registro_antiguo);
                alert("¡Registro actualizado!");            
            });
        });
        
    } else {
        var reg = {
            trabajador_id: trabajador_json.trabajador_id,
            year_head: year_head,
            week_head: week_head,
            sueldo: trabajador_json.sueldo_base,
            costo_hora: trabajador_json.sueldo_base / 48,
            asistencias: asistencias
        } 

        firebase.database().ref(rama_bd_nomina + "/nomina").push(reg).then(function(snapshot){
            var regKey = snapshot.key
            
            // actualizar listas
            
            // obras
            var listas_path = {}
            for(key in asistencias){
                listas_path["listas/obras/" + asistencias[key].obra + "/" + asistencias[key].subproceso + "/" + regKey] = true;
                listas_path["listas/fecha_datos/" + reg.year_head + "/" + reg.week_head + "/" + reg.trabajador_id + "/"+ regKey] = true;
                listas_path["listas/trabajadores/" + reg.trabajador_id + "/"+ regKey] = true;

                if(asistencias[key].actividad == "Vacaciones"){
                    listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ regKey] = true;
                    listas_path["listas/vacaciones/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
                } else if(asistencias[key].actividad == "Falta"){
                    listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ regKey] = true;
                    listas_path["listas/faltas/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
                }

            }
            firebase.database().ref(rama_bd_nomina).update(listas_path);

            // pista de auditoría
            pda("alta", rama_bd_nomina + "/nomina/" + regKey, "");
            alert("¡Registro actualizado!");

            // reset cosas
            id_registro_existente = regKey;
            existe_registro = true;
            resetFormDatosNomina(false);
            
        });
    }


});

$('.' + class_modal_obra_datos_nomina).change(function(){
    for(var i=0; i<dias.length;i++){
        if($(this).hasClass(dias[i])){
            $('#' + dias[i] + "-proceso").empty();
            var select = document.getElementById(dias[i] + "-proceso");
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            select.appendChild(option);
            
            firebase.database().ref(rama_bd_obras + "/procesos/" + $("option:selected", this).val() + "/procesos").once('value').then(function(snapshot){
                snapshot.forEach(function(procSnap){
                    if(procSnap.key != "PC00"){
                        procSnap.child("subprocesos").forEach(function(subprocSnap){
                            option = document.createElement('option');
                            option.value = subprocSnap.key;
                            option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                            select.appendChild(option);
                        });
                    };
                });
                
            });
        }
    };
});

$('.' + class_modal_proceso_datos_nomina).change(function(){
    for(var i=0; i<dias.length;i++){
        if($(this).hasClass(dias[i])){
            $('#' + dias[i] + "-actividad").removeClass("hidden");
            $('#' + dias[i] + "-actividad").val("Asistencia");
        }
    };
});

function modalDatosNomina(existeRegistro, trabSnapshot, regSnapshot){
    $('.' + class_modal_obra_datos_nomina).val("");
    $('.' + class_modal_proceso_datos_nomina).empty();
    $('.' + class_modal_actividad_datos_nomina).addClass("hidden");
    $('.' + class_modal_actividad_datos_nomina).val("");

    // si existe el registro, necesito llenar todos los campos, crear filas, columnas, etc.
    // si no existe, dejar el modal listo pa pushearlo con el key del trabSnapshot
    
    trabajador_json = trabSnapshot.val();
    var id = Object.keys(trabajador_json)[0];
    trabajador_json = trabajador_json[Object.keys(trabajador_json)[0]];
    trabajador_json["trabajador_id"] = id;

    var nombre = trabajador_json.nombre.split("_")
    $('#' + id_modal_nombre_nomina).text(nombre[0] + " " + nombre[1] + " " + nombre[2]);
    $('#' + id_modal_sem_nomina).text($('#' + id_ddl_week_datos_nomina + " option:selected").val());
    $('#' + id_modal_year_nomina).text($('#' + id_ddl_year_datos_nomina + " option:selected").val());

    if(existeRegistro){
        id_registro_existente = regSnapshot.key;
        var asistencias = regSnapshot.val().asistencias;
        
        for(key in asistencias){
            var select = document.getElementById(key + "-proceso");
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            select.appendChild(option);
            
            firebase.database().ref(rama_bd_obras + "/procesos/" + asistencias[key].obra + "/procesos").once('value').then(function(snapshot){
                snapshot.forEach(function(procSnap){
                    if(procSnap.key != "PC00"){
                        procSnap.child("subprocesos").forEach(function(subprocSnap){
                            option = document.createElement('option');
                            option.value = subprocSnap.key;
                            option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                            select.appendChild(option);
                        });
                    };
                });   
                $('#' + key + "-proceso [value=" + asistencias[key].subproceso + "]").prop('selected', true);
                $('#' + key + "-obra [value=" + asistencias[key].obra + "]").prop('selected', true);
                $('#' + key + "-actividad [value=" + asistencias[key].actividad + "]").prop('selected', true);
                $('#' + key + "-actividad").removeClass("hidden");
            });
        }

    }  

    $('#' + id_modal_datos_datos_nomina).modal('show');
}

function datosAsistenciaDatosNomina(){
    var asistencia = {};
    for(var i=0; i<dias.length;i++){
        var obra = $('#' + dias[i] + "-obra").val();
        var proceso  = $('#' + dias[i] + "-proceso").val();
        var actividad  = $('#' + dias[i] + "-actividad").val();
        var sem =  $('#' + id_ddl_week_datos_nomina).val();
        var year = $('#' + id_ddl_year_datos_nomina).val();
        var jueves = getDaysWeek(sem,year)[0];
        var offset = i;
        if(i > 1){
            offset = offset + 2;
        }
        if(obra != ""){
            asistencia[dias[i]] = {
                obra: obra,
                subproceso: proceso,
                fecha: jueves + 86400000*offset,
                actividad: actividad,
            };
        };
    };
    return asistencia;
}

function validateModalDatosNomina(){
    var is_validated = true;
    for(var i=0; i<dias.length;i++){
        var obra = $('#' + dias[i] + "-obra").val();
        var proceso  = $('#' + dias[i] + "-proceso").val();
        if(obra != "" && proceso == ""){
            return false;
        };
    };
    return is_validated;
}

// -------------------- HORAS EXTRA -----------------------------------