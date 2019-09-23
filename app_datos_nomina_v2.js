var id_tab_datos_nomina = "tabDatosNomina";
var id_form_datos_nomina = "formNomina";
var id_modal_datos_datos_nomina = "modalDatosNomina";
var id_dataTable_datos_nomina = "dataTableDatosNomina";

var id_button_abrir_datos_nomina = "datosNominaButton";
var id_button_guardar_datos_nomina = "buttonGuardarDatosNomina";

var id_ddl_year_datos_nomina = "yearNomina";
var id_ddl_week_datos_nomina = "semanaNomina";
var id_ddl_obra_asignada_datos_nomina = "obraAsignadaNomina";
var id_ddl_faltantes_datos_nomina = "trabajadoresSinRegistroNomina";
var id_id_head_datos_nomina = "idHeadNomina";


var class_modal_obra_datos_nomina = "obraNomina";
var class_modal_proceso_datos_nomina = "procesoNomina";
var class_modal_actividad_datos_nomina = "actividadNomina";

var id_modal_nombre_nomina = "nombreModalDatosNomina";
var id_modal_sem_nomina = "semanaModalDatosNomina";
var id_modal_year_nomina = "yearModalDatosNomina"

var id_he_div_datos_nomina = "heContainerDatosNomina";
var id_diversos_div_datos_nomina = "diversosContainerDatosNomina";

var id_info_asignada_datos_nomina = "infoObraAsisgnadaNomina";

// variables globales
var id_registro_existente = "";
var existe_registro = false;
var trabajador_json = {};

var trabajadores_sin_registro = {};
var dias = ["jueves", "viernes", "lunes", "martes", "miercoles"];


$('#' + id_tab_datos_nomina).click(function(){
    existe_registro = false;
    id_registro_existente = "";

    var texto_info = "La obra a la cual se facturará la mano de obra generada por este registro."
	$('#' + id_info_asignada_datos_nomina).attr("data-content", texto_info);

    $('#' + id_id_head_datos_nomina).val("");
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

    $('#' + id_ddl_obra_asignada_datos_nomina).empty();
    var select_asignada = document.getElementById(id_ddl_obra_asignada_datos_nomina);
    var option_asignada = document.createElement('option');
    option_asignada.style = "display:none";
    option_asignada.text = option_asignada.value = "";
    select_asignada.appendChild(option_asignada);
    var obra;
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra = snapshot.val();
        option_asignada = document.createElement('option');
        option_asignada.value = snapshot.key;
        option_asignada.text = obra.nombre;
        select_asignada.appendChild(option_asignada);
    });

    actualizarTablaDatosNomina();
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
    actualizarTablaDatosNomina();
});

$('#' + id_ddl_week_datos_nomina).change(function(){
    resetFormDatosNomina(false);
    llenarDdlFaltantes();
    actualizarTablaDatosNomina();
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
    existe_registro = false;
    id_registro_existente = "";
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

$('#' + id_button_guardar_datos_nomina).click(function(){
    if(!validateModalDatosNomina()){
        alert("Por favor llena todos los campos incluyendo la obra asignada. En caso de querer eliminar un registro de horas extra o diversos basta escribir 0 en su cantidad.")
        return;
    }
    // aqui poner datos asist, he y diversos
    var datos_asistencia = datosAsistenciaDatosNomina();
    var asistencias = datos_asistencia[0];

    var datos_diversos = datosDiversosDatosNomina();
    var diversos = datos_diversos[0];

    var datos_horas_extra = datosHorasExtraDatosNomina();
    var horas_extra = datos_horas_extra[0];
    
    var week_head = $('#' + id_ddl_week_datos_nomina + " option:selected").val();
    var year_head = $('#' + id_ddl_year_datos_nomina + " option:selected").val();

    var obra_asignada = $('#' + id_ddl_obra_asignada_datos_nomina + " option:selected").val();
    var obra_asignada_nombre = $('#' + id_ddl_obra_asignada_datos_nomina + " option:selected").text();

    if(existe_registro){ 
        firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente).once("value").then(function(regSnap){
            var registro_antiguo = regSnap.val();

            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/obra_asignada_nombre").set(obra_asignada_nombre);
            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/obra_asignada").set(obra_asignada);

            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/asistencias").set(asistencias);
            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/horas_extra").set(horas_extra);
            firebase.database().ref(rama_bd_nomina + "/nomina/" + id_registro_existente + "/diversos").set(diversos);

            // reset listas anteriores y actualizar

            var listas_path = {}
            firebase.database().ref(rama_bd_nomina + "/listas/obras").once("value").then(function(snapshot){
                snapshot.forEach(function(obraSnap){
                    obraSnap.forEach(function(procesoSnap){
                        listas_path["listas/obras/" + obraSnap.key + "/" + procesoSnap.key + "/" + id_registro_existente] = null;
                    });
                });

                var horas_extra_antiguo = registro_antiguo.horas_extra;

                for(key in horas_extra_antiguo){
                    listas_path["listas/obras/" + horas_extra_antiguo[key].obra + "/" + horas_extra_antiguo[key].subproceso + "/" + id_registro_existente] = null;
                    listas_path["listas/horas_extra/fechas/" + aaaammdd(horas_extra_antiguo[key].fecha) + "/"+ id_registro_existente] = null;
                    listas_path["listas/horas_extra/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                }

                var diversos_antiguo = registro_antiguo.diversos;

                for(key in diversos_antiguo){
                    listas_path["listas/obras/" + diversos_antiguo[key].obra + "/" + diversos_antiguo[key].subproceso + "/" + id_registro_existente] = null;
                    listas_path["listas/diversos/tipo/" + diversos_antiguo[key].tipo + "/"+ id_registro_existente] = null;
                    listas_path["listas/diversos/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                }
                
                listas_path["listas/obra_asignada/" + registro_antiguo.obra_asignada + "/" + id_registro_existente] = null;

                listas_path["listas/fecha_datos/" + year_head + "/" + week_head + "/" + trabajador_json.trabajador_id + "/"+ id_registro_existente] = true;
                listas_path["listas/trabajadores/" + trabajador_json.trabajador_id + "/"+ id_registro_existente] = true;
                listas_path["listas/obra_asignada/" + obra_asignada + "/" + id_registro_existente] = true;
                
                for(key in asistencias){
                    listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = null;
                    listas_path["listas/vacaciones/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                    listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = null;
                    listas_path["listas/faltas/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = null;
                    listas_path["listas/obras/" + asistencias[key].obra + "/" + asistencias[key].subproceso + "/" + id_registro_existente] = true;
                    
                    if(asistencias[key].actividad == "Vacaciones"){
                        listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = true;
                        listas_path["listas/vacaciones/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = true;
                    } else if(asistencias[key].actividad == "Falta"){
                        listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ id_registro_existente] = true;
                        listas_path["listas/faltas/trabajadores/" + trabajador_json.trabajador_id + "/" + id_registro_existente] = true;
                    }
                };

                for(key in horas_extra){
                    listas_path["listas/obras/" + horas_extra[key].obra + "/" + horas_extra[key].subproceso + "/" + id_registro_existente] = true;
                    listas_path["listas/horas_extra/fechas/" + aaaammdd(horas_extra[key].fecha) + "/"+ id_registro_existente] = true;
                    listas_path["listas/horas_extra/trabajadores/" + trabajador_json.trabajador_id  + "/" + id_registro_existente] = true;
                }
    
                for(key in diversos){
                    listas_path["listas/obras/" + diversos[key].obra + "/" + diversos[key].subproceso + "/" + id_registro_existente] = true;
                    listas_path["listas/diversos/tipo/" + diversos[key].tipo + "/"+ id_registro_existente] = true;
                    listas_path["listas/diversos/trabajadores/" + trabajador_json.trabajador_id  + "/" + id_registro_existente] = true;
                }

                firebase.database().ref(rama_bd_nomina).update(listas_path);
                //pista de auditoría
                pda("modificacion", rama_bd_nomina + "/nomina/" + id_registro_existente, registro_antiguo);
                alert("¡Registro actualizado!");    
                
                resetFormDatosNomina(false);
                llenarDdlFaltantes();
                actualizarTablaDatosNomina();
            });
        });
        
    } else if(datos_asistencia[1] || datos_horas_extra[1] || datos_diversos[1]){
        // necesito que no se haga esto si asistencias, no jalo
        var reg = {
            trabajador_id: trabajador_json.trabajador_id,
            trabajador_id_head: trabajador_json.id_head,
            trabajador_id_pagadora: trabajador_json.id_pagadora,
            trabajador_nombre: trabajador_json.nombre,
            trabajador_jefe: trabajador_json.jefe,
            trabajador_puesto: trabajador_json.id_puesto,
            trabajador_esp: trabajador_json.id_especialidad,
            year_head: year_head,
            week_head: week_head,
            sueldo_semanal: trabajador_json.sueldo_base,
            asistencias: asistencias,
            horas_extra: horas_extra,
            diversos: diversos,
            obra_asignada: obra_asignada,
            obra_asignada_nombre: obra_asignada_nombre
        } 
        firebase.database().ref(rama_bd_nomina + "/nomina").push(reg).then(function(snapshot){
            var regKey = snapshot.key        
            // actualizar listas
            var listas_path = {}

            listas_path["listas/fecha_datos/" + reg.year_head + "/" + reg.week_head + "/" + reg.trabajador_id + "/"+ regKey] = true;
            listas_path["listas/trabajadores/" + reg.trabajador_id + "/"+ regKey] = true;
            listas_path["listas/obra_asignada/" + obra_asignada + "/" + regKey] = true;

            for(key in asistencias){
                listas_path["listas/obras/" + asistencias[key].obra + "/" + asistencias[key].subproceso + "/" + regKey] = true;

                if(asistencias[key].actividad == "Vacaciones"){
                    listas_path["listas/vacaciones/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ regKey] = true;
                    listas_path["listas/vacaciones/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
                } else if(asistencias[key].actividad == "Falta"){
                    listas_path["listas/faltas/fechas/" + aaaammdd(asistencias[key].fecha) + "/"+ regKey] = true;
                    listas_path["listas/faltas/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
                };
            };

            for(key in horas_extra){
                listas_path["listas/obras/" + horas_extra[key].obra + "/" + horas_extra[key].subproceso + "/" + regKey] = true;
                listas_path["listas/horas_extra/fechas/" + aaaammdd(horas_extra[key].fecha) + "/"+ regKey] = true;
                listas_path["listas/horas_extra/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
            }

            for(key in diversos){
                listas_path["listas/obras/" + diversos[key].obra + "/" + diversos[key].subproceso + "/" + regKey] = true;
                listas_path["listas/diversos/tipo/" + diversos[key].tipo + "/"+ regKey] = true;
                listas_path["listas/diversos/trabajadores/" + reg.trabajador_id + "/" + regKey] = true;
            }

            firebase.database().ref(rama_bd_nomina).update(listas_path);

            // pista de auditoría
            pda("alta", rama_bd_nomina + "/nomina/" + regKey, "");
            alert("¡Registro actualizado!");

            // reset cosas
            id_registro_existente = regKey;
            existe_registro = true;
            resetFormDatosNomina(false);
            llenarDdlFaltantes();
            actualizarTablaDatosNomina();
            
        });
    }


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
    firebase.database().ref(rama_bd_mano_obra + "/listas/activos").orderByKey().on("value",function(snapshot){
        if(snapshot.exists()){
            firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/" + $('#' + id_ddl_year_datos_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_datos_nomina + " option:selected").val()).once("value").then(function(regSnap){
                trabajadores_sin_registro = snapshot.val();  
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

function validateModalDatosNomina(){
    var is_validated = true;
    for(var i=0; i<dias.length;i++){
        var obra = $('#' + dias[i] + "-obra").val();
        var proceso  = $('#' + dias[i] + "-proceso").val();
        if(obra != "" && proceso == ""){
            return false;
        };
    };

    var obra_asignada = $('#' + id_ddl_obra_asignada_datos_nomina + " option:selected").val();
    if(obra_asignada == ""){
        return is_validated = false;
    }
    
    // Revisar si HE y Diversos están completos
    
    $( ".horasExtraInputDatos" ).each(function() {
        var row = this.parentElement.parentElement;
        
        var fecha = row.childNodes[1].childNodes[0];
        var obra = row.childNodes[2].childNodes[0];
        var proceso = row.childNodes[3].childNodes[0];

        if($(fecha).val() == ""){
            return is_validated = false;
        }

        if($("option:selected", obra).val() == ""){
            return is_validated = false;
        }

        if($("option:selected", proceso).val() == ""){
            return is_validated = false;
        }
    });

    $( ".diversosInputDatos" ).each(function() {
        var row = this.parentElement.parentElement;
        
        var tipo = row.childNodes[1].childNodes[0];
        var obra = row.childNodes[2].childNodes[0];
        var proceso = row.childNodes[3].childNodes[0];

        if($("option:selected", tipo).val() == ""){
            return is_validated = false;
        }

        if($("option:selected", obra).val() == ""){
            return is_validated = false;
        }

        if($("option:selected", proceso).val() == ""){
            return is_validated = false;
        }
    });

    return is_validated;
}

// ------------------------------ ASISTENCIAS --------------------------------------

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
    $('.' + class_modal_actividad_datos_nomina).val("Falta");

    $('#' + id_he_div_datos_nomina).empty();
    $('#' + id_diversos_div_datos_nomina).empty();


    $('#' + id_ddl_obra_asignada_datos_nomina).val("");

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
        var horas_extra = regSnapshot.val().horas_extra;
        var diversos = regSnapshot.val().diversos;
        // ------

        $('#' + id_modal_sem_nomina).text(regSnapshot.val().week_head);
        $('#' + id_modal_year_nomina).text(regSnapshot.val().year_head);
        $('#' + id_ddl_obra_asignada_datos_nomina).val(regSnapshot.val().obra_asignada);
        
        if(asistencias != undefined){
            for(key in asistencias){
                $('#' + key + "-obra [value=" + asistencias[key].obra + "]").prop('selected', true);
                $('#' + key + "-actividad [value=" + asistencias[key].actividad + "]").prop('selected', true);
                $('#' + key + "-actividad").removeClass("hidden");
            }
            // jueves
            if(asistencias["jueves"] != undefined){
                var select_jueves = document.getElementById("jueves-proceso");
                var option = document.createElement('option');
                option.style = "display:none";
                option.text = option.value = "";
                select_jueves.appendChild(option);
                firebase.database().ref(rama_bd_obras + "/procesos/" + $('#jueves-obra option:selected').val() + "/procesos").once('value').then(function(snapshot){
                    snapshot.forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                select_jueves.appendChild(option);
                            });
                        };
                    });
                    $("#jueves-proceso [value=" + asistencias["jueves"].subproceso + "]").prop('selected', true);
                });
            };
            // viernes
            if(asistencias["viernes"] != undefined){
                var select_viernes = document.getElementById("viernes-proceso");
                var option = document.createElement('option');
                option.style = "display:none";
                option.text = option.value = "";
                select_viernes.appendChild(option);
                firebase.database().ref(rama_bd_obras + "/procesos/" + $('#viernes-obra option:selected').val() + "/procesos").once('value').then(function(snapshot){
                    snapshot.forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                select_viernes.appendChild(option);
                            });
                        };
                    });
                    $("#viernes-proceso [value=" + asistencias["viernes"].subproceso + "]").prop('selected', true);
                });
            };
            // lunes
            if(asistencias["lunes"] != undefined){
                var select_lunes = document.getElementById("lunes-proceso");
                var option = document.createElement('option');
                option.style = "display:none";
                option.text = option.value = "";
                select_lunes.appendChild(option);
                firebase.database().ref(rama_bd_obras + "/procesos/" + $('#lunes-obra option:selected').val() + "/procesos").once('value').then(function(snapshot){
                    snapshot.forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                select_lunes.appendChild(option);
                            });
                        };
                    });
                    $("#lunes-proceso [value=" + asistencias["lunes"].subproceso + "]").prop('selected', true);
                });
            };
            // martes
            if(asistencias["martes"] != undefined){
                var select_martes = document.getElementById("martes-proceso");
                var option = document.createElement('option');
                option.style = "display:none";
                option.text = option.value = "";
                select_martes.appendChild(option);
                firebase.database().ref(rama_bd_obras + "/procesos/" + $('#martes-obra option:selected').val() + "/procesos").once('value').then(function(snapshot){
                    snapshot.forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                select_martes.appendChild(option);
                            });
                        };
                    });
                    $("#martes-proceso [value=" + asistencias["martes"].subproceso + "]").prop('selected', true);
                });
            };
            // miercoles
            if(asistencias["miercoles"] != undefined){
                var select_miercoles = document.getElementById("miercoles-proceso");
                var option = document.createElement('option');
                option.style = "display:none";
                option.text = option.value = "";
                select_miercoles.appendChild(option);
                firebase.database().ref(rama_bd_obras + "/procesos/" + $('#miercoles-obra option:selected').val() + "/procesos").once('value').then(function(snapshot){
                    snapshot.forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                select_miercoles.appendChild(option);
                            });
                        };
                    });
                    $("#miercoles-proceso [value=" + asistencias["miercoles"].subproceso + "]").prop('selected', true);
                });
            };
        }
        
        // horas extra de la db
        firebase.database().ref(rama_bd_obras + "/procesos").once('value').then(function(snapshot){
            if(horas_extra != undefined){
                for(key in horas_extra){
                    generateNewRowExtras(key);
                    var row = document.getElementById(key);
    
                    var fecha = document.createElement('input');
                    fecha.className = "form-control dateTimepickerHorasExtra";
                    fecha.type = "text";
                    fecha.readOnly = "readonly"
                    
                    var col_fecha = document.createElement('div');
                    col_fecha.className = "form-group col-3";
                    col_fecha.appendChild(fecha);
                
                    var obra = document.createElement('select');
                    obra.className = "form-control obraHorasExtra";
                
                    var option = document.createElement('option');
                    option.style = "display:none";
                    option.text = option.value = "";
                    obra.appendChild(option);
                    
                
                    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
                        obra_json = snapshot.val();
                        option = document.createElement('option');
                        option.value = snapshot.key;
                        option.text = obra_json.nombre;
                        obra.appendChild(option);
                    });
                    
                    var col_obra = document.createElement('div');
                    col_obra.className = "form-group col-3";
                    col_obra.appendChild(obra);
                
                    var proceso = document.createElement('select');
                    proceso.className = "form-control";
                
                    var col_proceso = document.createElement('div');
                    col_proceso.className = "form-group col-3";
                    col_proceso.appendChild(proceso);
                
                    row.append(col_fecha);
                    row.append(col_obra);
                    row.append(col_proceso);

                    snapshot.child(horas_extra[key].obra).child("procesos").forEach(function(procSnap){
                        if(procSnap.key != "PC00"){
                            procSnap.child("subprocesos").forEach(function(subprocSnap){
                                option = document.createElement('option');
                                option.value = subprocSnap.key;
                                option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                proceso.appendChild(option);
                            });
                        };
                    });
             
                    jQuery('.dateTimepickerHorasExtra').datetimepicker(
                        {timepicker:false, weeks:true,format:'Y.m.d'}
                    );    
                    $('.horasExtraInputVacio').addClass("horasExtraInputDatos");
                    $('.horasExtraInputVacio').removeClass("horasExtraInputVacio");
    
                    // llenar datos
                    
                    var fecha_string = new Date(horas_extra[key].fecha);
    
                    $(row.childNodes[0].childNodes[0]).val(horas_extra[key].cantidad);
                    $(fecha).val(fecha_string.getFullYear() + "." + ("0" + (fecha_string.getMonth() + 1)).slice(-2)  + "." + ("0" + fecha_string.getDate()).slice(-2));
                    $(obra).val(horas_extra[key].obra)  
                    $(proceso).val(horas_extra[key].subproceso); 
                };
            };
            firebase.database().ref(rama_bd_datos_referencia + "/diversos/").on('value',function(diverSnap){
                if(diversos != undefined){
                    for(key in diversos){
                        generateNewRowDiversos(key);
        
                        var row = document.getElementById(key);
                    
                        var tipo = document.createElement('select');
                        tipo.className = "form-control tipoDiverso";
                    
                        var option = document.createElement('option');
                        option.style = "display:none";
                        option.text = option.value = "";
                        tipo.appendChild(option);
                        
                        
                        diverSnap.forEach(function(tipoSnap){
                            option = document.createElement('option');
                            option.value = tipoSnap.key;
                            option.text = tipoSnap.val();
                            tipo.appendChild(option);
                        });
                        
                        
                        var col_tipo = document.createElement('div');
                        col_tipo.className = "form-group col-3";
                        col_tipo.appendChild(tipo);
                    
                    
                        var obra = document.createElement('select');
                        obra.className = "form-control obraDiversos";
                    
                        var option = document.createElement('option');
                        option.style = "display:none";
                        option.text = option.value = "";
                        obra.appendChild(option);
                        
                        firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
                            obra_json = snapshot.val();
                            option = document.createElement('option');
                            option.value = snapshot.key;
                            option.text = obra_json.nombre;
                            obra.appendChild(option);
                        });
                        
                        var col_obra = document.createElement('div');
                        col_obra.className = "form-group col-3";
                        col_obra.appendChild(obra);
                    
                        var proceso = document.createElement('select');
                        proceso.className = "form-control";
                    
                        var col_proceso = document.createElement('div');
                        col_proceso.className = "form-group col-3";
                        col_proceso.appendChild(proceso);
                    
                        row.append(col_tipo);
                        row.append(col_obra);
                        row.append(col_proceso);

                        snapshot.child(diversos[key].obra).child("procesos").forEach(function(procSnap){
                            if(procSnap.key != "PC00"){
                                procSnap.child("subprocesos").forEach(function(subprocSnap){
                                    option = document.createElement('option');
                                    option.value = subprocSnap.key;
                                    option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                                    proceso.appendChild(option);
                                });
                            };
                        });
                    
                        $('.diversosInputVacio').addClass("diversosInputDatos");
                        $('.diversosInputVacio').removeClass("diversosInputVacio");
        
                        // llenar datos
        
                        $(row.childNodes[0].childNodes[0]).val(formatMoney(diversos[key].cantidad));
                        $(tipo).val(diversos[key].tipo);
                        $(obra).val(diversos[key].obra)  
                        $(proceso).val(diversos[key].subproceso); 
                    };
                };
                generateNewRowDiversos();
            });
            // se crea el campo de horas para generar nuevo registro de he
            generateNewRowExtras();
        
            $('#' + id_modal_datos_datos_nomina).modal('show');
        });
    } else {
        generateNewRowExtras();
        generateNewRowDiversos();
    
        $('#' + id_modal_datos_datos_nomina).modal('show');
    };
}

function datosAsistenciaDatosNomina(){
    var asistencia = {};
    var is_data_filled = false;
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
            is_data_filled = true;
        };
    };
    return [asistencia, is_data_filled];
}

// -------------------- HORAS EXTRA -----------------------------------

function generateNewRowExtras(key){
    if(key == null){
        var key = firebase.database().ref("dummy").push().key;
    }
     
    var cantidad = document.createElement('input');
    cantidad.className = "form-control horasExtraInputVacio";
    cantidad.type = "text";
    cantidad.placeholder = "Horas Extra";
    
    var col = document.createElement('div');
    col.className = "form-group col-3";
    col.appendChild(cantidad);
    
    var row = document.createElement('div');
    row.className = "form-row";
    row.id = key;
    row.append(col);
    
    var he_div = document.getElementById(id_he_div_datos_nomina);
    he_div.appendChild(row);
};

$(document).on('change','.horasExtraInputVacio', function(){
    var row = this.parentElement.parentElement;
    var fecha = document.createElement('input');
    fecha.className = "form-control dateTimepickerHorasExtra";
    fecha.type = "text";
    fecha.readOnly = "readonly"
    
    var col_fecha = document.createElement('div');
    col_fecha.className = "form-group col-3";
    col_fecha.appendChild(fecha);

    var obra = document.createElement('select');
    obra.className = "form-control obraHorasExtra";

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    obra.appendChild(option);
    

    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra_json = snapshot.val();
        option = document.createElement('option');
        option.value = snapshot.key;
        option.text = obra_json.nombre;
        obra.appendChild(option);
    });
    
    var col_obra = document.createElement('div');
    col_obra.className = "form-group col-3";
    col_obra.appendChild(obra);

    var proceso = document.createElement('select');
    proceso.className = "form-control";

    var col_proceso = document.createElement('div');
    col_proceso.className = "form-group col-3";
    col_proceso.appendChild(proceso);

    row.append(col_fecha);
    row.append(col_obra);
    row.append(col_proceso);

    jQuery('.dateTimepickerHorasExtra').datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    
    $('.horasExtraInputVacio').addClass("horasExtraInputDatos");
    $('.horasExtraInputVacio').removeClass("horasExtraInputVacio");
    generateNewRowExtras();
    
});

$(document).on('change','.horasExtraInputDatos', function(){
    if(this.value == "" || this.value == 0){
        $('#' + this.parentElement.parentElement.id).empty();
    }
});

$(document).on('keypress','.horasExtraInputVacio', function(e){
    charactersAllowed("1234567890",e);
});

$(document).on('keypress','.horasExtraInputDatos', function(e){
    charactersAllowed("1234567890",e);
});

$(document).on('change','.obraHorasExtra', function(){
    var row = this.parentElement.parentElement;
    var select_proceso = row.childNodes[3].childNodes[0];
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select_proceso.appendChild(option);
    
    firebase.database().ref(rama_bd_obras + "/procesos/" + $("option:selected", this).val() + "/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
            if(procSnap.key != "PC00"){
                procSnap.child("subprocesos").forEach(function(subprocSnap){
                    option = document.createElement('option');
                    option.value = subprocSnap.key;
                    option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                    select_proceso.appendChild(option);
                });
            };
        });      
    });
});

function datosHorasExtraDatosNomina(){
    var horas_extra = {};
    var is_data_filled = false;

    $( ".horasExtraInputDatos" ).each(function() {
        var row = this.parentElement.parentElement;
        var key = row.id;
        
        var fecha = row.childNodes[1].childNodes[0];
        var obra = row.childNodes[2].childNodes[0];
        var proceso = row.childNodes[3].childNodes[0];

        var fecha_array = $(fecha).val().split(".");
        fecha = new Date(fecha_array[0], fecha_array[1] - 1, fecha_array[2]).getTime();

        horas_extra[key] = {
            cantidad: parseFloat($(this).val()),
            fecha:fecha, // pasar a timestamp
            obra: $("option:selected", obra).val(),
            subproceso: $("option:selected", proceso).val()
        }
        is_data_filled = true;
    });

    return [horas_extra, is_data_filled];
}

// -------------------- DIVERSOS -----------------------------------

function generateNewRowDiversos(key){
    if(key == null){
        var key = firebase.database().ref("dummy").push().key;
    }
     
    var cantidad = document.createElement('input');
    cantidad.className = "form-control diversosInputVacio";
    cantidad.type = "text";
    cantidad.placeholder = "Cantidad ($)";
    
    var col = document.createElement('div');
    col.className = "form-group col-3";
    col.appendChild(cantidad);
    
    var row = document.createElement('div');
    row.className = "form-row";
    row.id = key;
    row.append(col);
    
    var he_div = document.getElementById(id_diversos_div_datos_nomina);
    he_div.appendChild(row);
};

$(document).on('change','.diversosInputVacio', function(){
    var row = this.parentElement.parentElement;
    
    var tipo = document.createElement('select');
    tipo.className = "form-control tipoDiverso";

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    tipo.appendChild(option);
    

    firebase.database().ref(rama_bd_datos_referencia + "/diversos/").on('value',function(snapshot){
        snapshot.forEach(function(tipoSnap){
            option = document.createElement('option');
            option.value = tipoSnap.key;
            option.text = tipoSnap.val();
            tipo.appendChild(option);
        });
    });
    
    var col_tipo = document.createElement('div');
    col_tipo.className = "form-group col-3";
    col_tipo.appendChild(tipo);


    var obra = document.createElement('select');
    obra.className = "form-control obraDiversos";

    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    obra.appendChild(option);
    
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra_json = snapshot.val();
        option = document.createElement('option');
        option.value = snapshot.key;
        option.text = obra_json.nombre;
        obra.appendChild(option);
    });
    
    var col_obra = document.createElement('div');
    col_obra.className = "form-group col-3";
    col_obra.appendChild(obra);

    var proceso = document.createElement('select');
    proceso.className = "form-control";

    var col_proceso = document.createElement('div');
    col_proceso.className = "form-group col-3";
    col_proceso.appendChild(proceso);

    row.append(col_tipo);
    row.append(col_obra);
    row.append(col_proceso);

    var deformat_diverso = deformatMoney($(this).val());
    $(this).val(formatMoney(deformat_diverso));

    $('.diversosInputVacio').addClass("diversosInputDatos");
    $('.diversosInputVacio').removeClass("diversosInputVacio");
    generateNewRowDiversos();
    
});

$(document).on('change','.diversosInputDatos', function(){
    if(this.value == "" || isNaN(deformatMoney(this.value)) || deformatMoney(this.value) == 0){
        $('#' + this.parentElement.parentElement.id).empty();
    } else {
        var deformat_diverso = deformatMoney($(this).val());
        $(this).val(formatMoney(deformat_diverso));
    }
});

$(document).on('keypress','.diversosInputVacio', function(e){
    charactersAllowed("$1234567890,.-",e);
});

$(document).on('keypress','.diversosInputDatos', function(e){
    charactersAllowed("$1234567890,.-",e);
});

$(document).on('change','.obraDiversos', function(){
    var row = this.parentElement.parentElement;
    var select_proceso = row.childNodes[3].childNodes[0];
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select_proceso.appendChild(option);
    
    firebase.database().ref(rama_bd_obras + "/procesos/" + $("option:selected", this).val() + "/procesos").once('value').then(function(snapshot){
        snapshot.forEach(function(procSnap){
            if(procSnap.key != "PC00"){
                procSnap.child("subprocesos").forEach(function(subprocSnap){
                    option = document.createElement('option');
                    option.value = subprocSnap.key;
                    option.text = "(" +  subprocSnap.key + ") " +subprocSnap.val().nombre;
                    select_proceso.appendChild(option);
                });
            };
        });      
    });
});

function datosDiversosDatosNomina(){
    var diversos = {};
    var is_data_filled = false;

    $( ".diversosInputDatos" ).each(function() {
        var row = this.parentElement.parentElement;
        var key = row.id;
        
        var tipo = row.childNodes[1].childNodes[0];
        var obra = row.childNodes[2].childNodes[0];
        var proceso = row.childNodes[3].childNodes[0];

        diversos[key] = {
            cantidad: deformatMoney($(this).val()),
            tipo: $("option:selected", tipo).val(),
            obra: $("option:selected", obra).val(),
            subproceso: $("option:selected", proceso).val(),
            nombre: $("option:selected", tipo).text()
        }
        is_data_filled = true;
    });

    return [diversos, is_data_filled];
};

// Actualizar Tabla ----------------------------------

function actualizarTablaDatosNomina(){
    $('#' + id_dataTable_datos_nomina).html("");
    console.log(1);
    firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/" + $('#' + id_ddl_year_datos_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_datos_nomina + " option:selected").val()).once("value").then(function(listaSnap){
        firebase.database().ref(rama_bd_nomina + "/nomina/").once("value").then(function(regSnap){
            firebase.database().ref(rama_bd_datos_referencia + "/diversos").once("value").then(function(divSnap){
                
                var datos_nominas = [];
                var columns = [];
            
                var year = $('#' + id_ddl_year_datos_nomina + " option:selected").val();
                var sem = $('#' + id_ddl_week_datos_nomina + " option:selected").val();
            
                columns.push({title: "ID_Registro"});
                columns.push({title: "ID HEAD"});
                columns.push({title: "ID Pag"});
                columns.push({title: "Nombre completo"});
                columns.push({title: "Obra asignada (obra de facturación"});
                columns.push({title: "Jefe"});
            
                columns.push({title: "Sueldo neto"});
                columns.push({title: new Date(getDaysWeek(sem,year)[0]).toLocaleDateString("es-ES", options_nomina)});
                columns.push({title: new Date(getDaysWeek(sem,year)[0] + 86400000*1).toLocaleDateString("es-ES", options_nomina)});
                columns.push({title: new Date(getDaysWeek(sem,year)[0] + 86400000*4).toLocaleDateString("es-ES", options_nomina)});
                columns.push({title: new Date(getDaysWeek(sem,year)[0] + 86400000*5).toLocaleDateString("es-ES", options_nomina)});
                columns.push({title: new Date(getDaysWeek(sem,year)[0] + 86400000*6).toLocaleDateString("es-ES", options_nomina)});
                columns.push({title: "Sueldo a pagar"});
                columns.push({title: "Horas extra"});
                columns.push({title: "Importe horas extra"});
                // Generar columnas
                divSnap.forEach(function(snapshot){
                    columns.push({title: snapshot.val()})
                })

                columns.push({title: "Total Diversos"});
                columns.push({title: "Pago Total"});
                // Generar datos
                // generar tabla          
                var registros = regSnap.val();
                listaSnap.forEach(function(snapshot){
                    var datos_reg = [];
                    // aquí estoy en cada registro del año y semana elegido

                    // necesito generar el array de diversos
                    var diversos = {}
                    divSnap.forEach(function(diverso){
                        diversos[diverso.val()] = 0;
                    })

                    // id_ del registro;
                    var reg_key = Object.keys(snapshot.val())[0]
                    datos_reg.push(reg_key);
                    var registro = registros[reg_key];

                    var id_head = registro.trabajador_id_head;
                    datos_reg.push(id_head);
                    var id_pagadora = registro.trabajador_id_pagadora;
                    datos_reg.push(id_pagadora);
                    // nombre del trabajador
                    var nombre = registro.trabajador_nombre.split("_");
                    nombre = nombre[0] + " " + nombre[1] + " " + nombre[2];
                    datos_reg.push(nombre);

                    var obra = registro.obra_asignada_nombre;
                    datos_reg.push(obra);

                    var jefe_array = registro.trabajador_jefe.split("_");
                    var jefe = "";
                    for(var i=0; i<jefe_array.length;i++){
                        if(i>0){
                            jefe += " ";
                        }
                        jefe += jefe_array[i];
                    }
                    datos_reg.push(jefe);
                    
                    var sueldo_neto = registro.sueldo_semanal;
                    datos_reg.push(formatMoney(sueldo_neto));

                    var jueves, viernes, lunes, martes, miercoles = "";
                    var jueves_aux, viernes_aux, lunes_aux, martes_aux, miercoles_aux = 0;

                    if(registro.asistencias != undefined) {
                        jueves = registro.asistencias.jueves == undefined ? "" : registro.asistencias.jueves.actividad;
                        jueves_aux = jueves == "Falta" || jueves == ""  ? 0 : 0.2;
                        viernes = registro.asistencias.viernes == undefined ? "" : registro.asistencias.viernes.actividad;
                        viernes_aux = viernes == "Falta" || viernes == ""  ? 0 : 0.2;
                        lunes = registro.asistencias.lunes == undefined ? "" : registro.asistencias.lunes.actividad;
                        lunes_aux = lunes == "Falta" || lunes == ""  ? 0 : 0.2;
                        martes = registro.asistencias.martes == undefined ? "" : registro.asistencias.martes.actividad;
                        martes_aux = martes == "Falta" || martes == ""  ? 0 : 0.2;
                        miercoles = registro.asistencias.miercoles == undefined ? "" : registro.asistencias.miercoles.actividad;
                        miercoles_aux = miercoles == "Falta" || miercoles == ""  ? 0 : 0.2;
                    }

                    datos_reg.push(jueves, viernes, lunes, martes, miercoles)

                    var sueldo_a_pagar = sueldo_neto * (jueves_aux + viernes_aux + lunes_aux + martes_aux + miercoles_aux)
                    datos_reg.push(formatMoney(sueldo_a_pagar));
        
                    var horas_extra = 0;
                    var horas_extra_importe = 0;
                    if(registro.horas_extra != undefined){
                        for(key in registro.horas_extra){
                            horas_extra += registro.horas_extra[key].cantidad;
                        }
                        horas_extra_importe = (registro.sueldo_semanal / 48 ) * horas_extra * 2;
                    }  
                    datos_reg.push(horas_extra);
                    datos_reg.push(formatMoney(horas_extra_importe));
                    
                    var total_diversos = 0;
                    if(registro.diversos != undefined){
                        for(key in registro.diversos){
                            diversos[registro.diversos[key].nombre] += registro.diversos[key].cantidad;
                            total_diversos += registro.diversos[key].cantidad;
                        };
                    };

                    for(key in diversos){
                        datos_reg.push(formatMoney(diversos[key]));
                    }

                    datos_reg.push(formatMoney(total_diversos));
                    datos_reg.push(formatMoney(sueldo_a_pagar + horas_extra_importe +total_diversos));
                    datos_nominas.push(datos_reg)
                    
                })
                tabla_datos_nomina = $('#'+ id_dataTable_datos_nomina).DataTable({
                    destroy: true,
                    data: datos_nominas,
                    columns: columns,
                    language: idioma_espanol,               
                    "autoWidth": false,
                    "order": [[ 1, "asc" ]],
                    dom: 'Bfrtip',
                    "columnDefs": [
                        { "width": "300px", "targets": 4 },
                        { "visible": false, "targets": 0 },
                        {
                            targets: [12,14,-2,-1],
                            className: 'bolded'
                        },
                        { targets: "_all", className: 'dt-body-center'},
                    ],
                    buttons: [
                        {extend: 'excelHtml5',
                        title: "Nomina_" + year + "_" + sem,
                        exportOptions: {
                            columns: [':visible']
                        }},
                    ],
                });
            });     
        });
    });
};