var id_semana_ddl_asistencia = "semanaDdlAsistencia";
var id_year_ddl_asistencia = "yearDdlAsistencia";
var id_obra_ddl_asistencia = "obraDdlAsistencia";
var id_guardar_button_asistencia = "guardarButtonAsistencia";
var id_terminar_button_asistencia = "terminarButtonAsistencia";

var id_carga_semana_anterior_button_Asistencia = "semanaAnteriorButtonAsistencia";

var id_datatable_asistencia = "dataTableAsistencia";

var id_lista_table_asistencia = "divAsistencia";

var id_tab_asistencia = "tabAsistencia";

var rama_bd_pagos_nomina = "test/rrhh/pagos_nomina";
var rama_bd_obras_magico = "test/obras";
var rama_bd_trabajadores = "test/rrhh/trabajadores";

var nuevo;
var trabajadores = [];
var terminados = [];
var tableAsistencia = document.getElementById(id_lista_table_asistencia)
var tabla_procesos;

$('#' + id_tab_asistencia).click(function(){
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = [];
    $('#' + id_semana_ddl_asistencia).empty();
    $('#' + id_year_ddl_asistencia).empty();
    $('#' + id_obra_ddl_asistencia).empty();
    $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
    //getWeek() definido en app_funciones
    var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_semana_ddl_asistencia);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_asistencia);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }

    var select3 = document.getElementById(id_obra_ddl_asistencia);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select3.appendChild(option3);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
            var option4 = document.createElement('OPTION');
            option4.text = obra.nombre;
            option4.value = obra.nombre;
            select3.appendChild(option4);
        }
    });

    var option5 = document.createElement('option');
    option5.text = option5.value = "Atencion a Clientes";
    select3.appendChild(option5);

    nuevo = tableAsistencia.insertRow(0);
    nuevo.id = "nuevo_trabajadorasistencia";
    
});

$('#' + id_year_ddl_asistencia).change(function(){
    document.getElementById(id_obra_ddl_asistencia).selectedIndex = 0;
    $('#' + id_semana_ddl_asistencia).empty();
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_lista_table_asistencia).empty();
    $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
    trabajadores = [];
    var select = document.getElementById(id_semana_ddl_asistencia);
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
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
});

$('#' + id_semana_ddl_asistencia).change(function(){
    document.getElementById(id_obra_ddl_asistencia).selectedIndex = 0;
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_lista_table_asistencia).empty();
    $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
    trabajadores = [];
});

$("#" + id_obra_ddl_asistencia).change(function(){
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_asistencia).empty();
    tabla_procesos = "";
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + id_lista_table_asistencia).empty();
    $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
    trabajadores = [];
    headersAsistencia();
    nuevo = tableAsistencia.insertRow(1);
    nuevo.id = "nuevo_trabajador_asistencia";
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/asistencias_terminadas").once('value').then(function(snapshot){
        var terminada = snapshot.val();//Revisar si jala porque chance json porque value
        if(terminada){
            //Cargar tabla con datos
            var datos_asistencia = [];
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $("#" + id_obra_ddl_asistencia + " option:selected").val() + "/trabajadores").once('value').then(function(snapshot){
                snapshot.forEach(function(trabSnap){
                    firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key).once('value').then(function(childSnap){
                        var trabajador = childSnap.val();
                        var nom = trabajador.nomina[year][semana];
                        var chamba_lu = "-";
                        var chamba_ma = "-";
                        var chamba_mi = "-";
                        var chamba_ju = "-";
                        var chamba_vi = "-";
                        if(nom.jueves.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_ju = nom.jueves.proceso;
                        }
                        if(nom.viernes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_vi = nom.viernes.proceso;
                        }
                        if(nom.lunes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_lu = nom.lunes.proceso;
                        }
                        if(nom.martes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_ma = nom.martes.proceso;
                        }
                        if(nom.miercoles.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_mi = nom.miercoles.proceso;
                        }
                        var total;
                        if(nom.total_asistencia){
                            total = nom.total_asistencia;
                        } else {
                            total = "No se ha generado un pago de nómina";
                        }
                        var impuestos = "No se ha generado un pago de nómina";
                        if(nom.impuestos){
                            if(nom.impuestos.impuestos_asistencia){
                                impuestos = nom.impuestos.impuestos_asistencia;
                            }
                        }
                            

                        datos_asistencia.push([trabajador.id_trabajador, trabajador.nombre, trabajador.jefe, trabajador.especialidad, chamba_ju, chamba_vi, chamba_lu, chamba_ma, chamba_mi, trabajador.sueldo_base, impuestos, total]);
                        $('#' + id_datatable_asistencia).removeClass('hidden');
                        tabla_procesos = $('#'+ id_datatable_asistencia).DataTable({
                            destroy: true,
                            data: datos_asistencia,
                            dom: 'Bfrtip',
                            buttons: ['excel'],//, 'colvis'],
                            //https://datatables.net/extensions/buttons/
                            //https://datatables.net/reference/button/colvis
                            columns: [
                                {title: "ID",width: 70},
                                {title: "NOMBRE",width: 150},
                                {title: "EMPLEADOR",width: 70},
                                {title: "ESP",width: 70},
                                {title: "JUEVES",width: 70},
                                {title: "VIERNES",width: 70},
                                {title: "LUNES",width: 70},
                                {title: "MARTES",width: 70},
                                {title: "MIERCOLES",width: 70},
                                {title: "SUELDO BASE",width: 70},
                                //{title: "HORAS EXTRA",width: 70},
                                //{title: "DIVERSOS",width: 70},//hay que desplegarlos separados
                                {title: "IMPUESTOS",width: 70},
                                {title: "TOTAL",width: 70},
                            ],
                            language: idioma_espanol,
                        }); 
                    });
                });
            });
        } else {
            //Cargar matriz (no necesariamente tabla) con ddls y textfield
            if($('#' + id_obra_ddl_asistencia + " option:selected").val() == "Atencion a Clientes"){
                loadAsistencias(semana,year,[],0);
            } else {
                cargaEntradasAsistencia(year,semana);
            }
        }
    });
});

$('#' + id_carga_semana_anterior_button_Asistencia).click(function(){
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = {};
    headersAsistencia();
    nuevo = tableAsistencia.insertRow(1);
    nuevo.id = "nuevo_trabajador_asistencia";
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    if(parseInt(semana) == 1){
        alert("No se puede realizar esta acción en la primera semana del año");
    } else {
        cargaEntradasAsistencia(year,parseInt(semana)-1);
        $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
    }
});

function cargaEntradasAsistencia(year,semana){
    firebase.database().ref(rama_bd_obras_magico).orderByChild("nombre").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('child_added').then(function(snapshot){
        var procesos = [];
        terminados = [];
        var count_proc = 0;
        if(snapshot.val().num_procesos == 0 && snapshot.child("procesos/ADIC/num_subprocesos").val() == 0){
            procesos[count_proc] = "MISC"; 
            count_proc++;
        } else {
            snapshot.child("procesos").forEach(function(childSnapshot){
                var proc = childSnapshot.val();
                if(proc.num_subprocesos == 0 && proc.clave != "ADIC"){
                    if(proc.terminado){
                        terminados[count_proc] = true;
                    }
                    procesos[count_proc] = childSnapshot.val().clave;
                    count_proc++;
                } else {
                    childSnapshot.child("subprocesos").forEach(function(grandChildSnapshot){
                        if(grandChildSnapshot.child("terminado").val()){
                            terminados[count_proc] = true;
                        }
                        procesos[count_proc] = grandChildSnapshot.val().clave;
                        count_proc++;
                    });
                }
            });
        }
        loadAsistencias(semana,year,procesos,count_proc);
    });
}

function loadAsistencias(semana,year,procesos,count_proc){
    //Carga todos los trabajadores
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        //revisa si tienen esta obra asignada
        var vacio = true;
        snapshot.forEach(function(childSnapshot){
            var asignado = false;
            childSnapshot.child("obra_asignada").forEach(function(obraSnap){
                if(obraSnap.val() == $("#" + id_obra_ddl_asistencia + " option:selected").val()){
                    asignado = true;
                }
            });
            if(!asignado){
                childSnapshot.child("nomina/" + year + "/" + semana).forEach(function(obraSnap){
                    if(obraSnap.val().obra == $("#" + id_obra_ddl_asistencia + " option:selected").val()){
                        asignado = true;
                        vacio = false;
                    }
                });
            }
            if(asignado){
                var trabajador = childSnapshot.val();
                cargaRenglon(trabajador,count_proc,procesos,semana,year);
            }
        });
        if(vacio){
            $('#' + id_carga_semana_anterior_button_Asistencia).removeClass('hidden');
        } else {
            $('#' + id_carga_semana_anterior_button_Asistencia).addClass('hidden');
        }
    });
    //Crea 2 textfields para añadir trabajadores que no tengan la obra registrada
    var cell_id = nuevo.insertCell(0);
    var t_id = document.createElement('input');
    t_id.id = "t_id";
    t_id.placeholder = "ID";
    cell_id.appendChild(t_id);
    $('#t_id').change(function(){
        if($('#' + t_id.id).val() != ""){
            var i = 0;
            var existe = false;
            while(i<trabajadores.length && !existe){
                if($('#t_id').val() == trabajadores[i][0]){
                    existe = true;
                }
                i++;
            }
            if(!existe){
                firebase.database().ref(rama_bd_trabajadores + "/" + $('#' + t_id.id).val()).once('value').then(function(snapshot){
                    var trabajador = snapshot.val();
                    if(trabajador != null){
                        cargaRenglon(trabajador,count_proc,procesos,semana,year);
                        $('#t_id').val("");
                    } else {
                        alert("No existe un trabajador con ese ID");
                    }
                });
            } else {
                alert("El trabajador ya está en la lista");
                $('#t_id').val("");
            }
        }
    });
    var cell_nombre = nuevo.insertCell(1);
    var t_nombre = document.createElement('input');
    t_nombre.id = "t_nombre"
    t_nombre.placeholder = "Nombre";
    cell_nombre.appendChild(t_nombre);
    $('#t_nombre').change(function(){
        if($('#' + t_nombre.id).val() != ""){
            var i = 0;
            var existe = false;
            while(i<trabajadores.length && !existe){
                if($('#t_nombre').val() == trabajadores[i][1]){
                    existe = true;
                }
                i++;
            }
            if(!existe){
                firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo($('#' + t_nombre.id).val()).once('value').then(function(snapshot){
                    snapshot.forEach(function(childSnap){
                        var trabajador = childSnap.val();
                        console.log(trabajador)
                        if(trabajador != null){
                            cargaRenglon(trabajador,count_proc,procesos,semana,year);
                            $('#t_nombre').val("");
                        } else {
                            alert("No existe un trabajador con ese nombre");
                        }
                    });
                });
            } else {
                alert("El trabajador ya está en la lista");
                $('#t_nombre').val("");
            }
        }
    });
}
//Jala trabajador de rama_bd_trabajadores, procesos es el array con los procesos de la obra, count_proc es el length de procesos, y semana es un int
//Chance hay que ponerles diferentes nomvres a los option de cada dia
function cargaRenglon(trabajador, count_proc, procesos, semana, year){
    var nom;
    var bool_nom;

    if(!trabajador["nomina"]){
        nom = "";
        bool_nom = false;
    } else if(!trabajador["nomina"][year]) {
        nom = "";
        bool_nom = false;
    } else if(!trabajador["nomina"][year][semana]){
        nom = "";
        bool_nom = false;
    } else {
        nom = trabajador["nomina"][year][semana];
        bool_nom = true;
    }
    var row = tableAsistencia.insertRow(1);
    var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_ju = row.insertCell(2);
    var cell_vi = row.insertCell(3);
    var cell_lu = row.insertCell(4);
    var cell_ma = row.insertCell(5);
    var cell_mi = row.insertCell(6);
    //----LABELS----
    var id_label = document.createElement('label');
    id_label.innerHTML = trabajador.id_trabajador;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabajador.nombre;
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    var bool_otro_year = [];

     bool_otro_year["jueves"] = false;
     bool_otro_year["viernes"] = false;
     bool_otro_year["lunes"] = false;
     bool_otro_year["martes"] = false;
     bool_otro_year["miercoles"] = false;

    if(semana == 1){
         bool_otro_year["jueves"] = true;
         bool_otro_year["viernes"] = true;
         bool_otro_year["lunes"] = true;
         bool_otro_year["martes"] = true;
         bool_otro_year["miercoles"] = true;
        var diasEsteYear = getWeekDiaria("first",year);
        for(i=0;i<diasEsteYear.length;i++){
            bool_otro_year[diasEsteYear[i]] = false;
        }
    } else if (semana == getWeek(new Date(year,11,31).getTime())[0]){
         bool_otro_year["jueves"] = true;
         bool_otro_year["viernes"] = true;
         bool_otro_year["lunes"] = true;
         bool_otro_year["martes"] = true;
         bool_otro_year["miercoles"] = true;
        var diasEsteYear = getWeekDiaria("last",year);
        for(i=0;i<diasEsteYear.length;i++){
            bool_otro_year[diasEsteYear[i]] = false;
        }
    }

    ddlDia("jueves",cell_ju,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year["jueves"]);
    ddlDia("viernes",cell_vi,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year["viernes"]);
    ddlDia("lunes",cell_lu,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year["lunes"]);
    ddlDia("martes",cell_ma,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year["martes"]);
    ddlDia("miercoles",cell_mi,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year["miercoles"]);

    trabajadores[trabajadores.length] = [trabajador.id_trabajador, trabajador.nombre];
}

function ddlDia(dia,row,id_trabajador,bool_nom,nom,count_proc,procesos,bool_otro_year){
    var dia_corto = dia.substring(0,2);
    if($('#' + id_obra_ddl_asistencia + " option:selected").val() == "Atencion a Clientes"){
        var textField = document.createElement('input');
        textField.type = "text";
        textField.id = "chamba_" + id_trabajador + "_" + dia_corto;
        row.appendChild(textField);
        if(otra_obra){
            $('#' + textField.id).val("Otra obra");
            textField.disabled = true;
        } else if(bool_otro_year){
            $('#' + textField.id).val("Otro año");
            textField.disabled = true;
        }
    } else {
        var ddl = document.createElement('select');
        ddl.id = "chamba_" + id_trabajador + "_" + dia_corto;
        var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
        var otra_obra = false;
        var asistencia = false;
        if(bool_nom){
            if(nom[dia]){
                if(nom[dia].obra == obra || nom[dia].proceso == "NA"){
                    asistencia = true;
                } else {
                    otra_obra = true
                }
            }
        }
        if(otra_obra){
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl.appendChild(option);
            ddl.disabled = true;
        } else if(bool_otro_year){
            var option = document.createElement('option');
            option.text = "Otro año";
            option.value = 0;
            ddl.appendChild(option);
            ddl.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Falta";
            option.value = 0;
            ddl.appendChild(option);
            var option3 = document.createElement('option');
            option3.text = "Parado";
            option3.value = 0.2;
            ddl.appendChild(option3);
            for(i=0;i<count_proc;i++){
                var option2 = document.createElement('OPTION');
                option2.text = procesos[i];
                if(terminados[i]){
                    option3.style = "display:none";
                }
                option2.value = 0.2;
                ddl.appendChild(option2);
            }
            if(asistencia){
                for(var i = 0; i < ddl.length; i++){
                    if(ddl[i].text == nom[dia].proceso){
                        ddl.selectedIndex = i;
                    }
                }
            }
        }
        row.appendChild(ddl);
    }
}

$('#' + id_guardar_button_asistencia).click(function(){
    guardarAsistencias();
});

function guardarAsistencias(){
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
    for(i=0;i<trabajadores.length;i++){
        var id_trabajador = trabajadores[i][0];
        updateDia(id_trabajador,"jueves",semana,year);
        updateDia(id_trabajador,"viernes",semana,year);
        updateDia(id_trabajador,"lunes",semana,year);
        updateDia(id_trabajador,"martes",semana,year);
        updateDia(id_trabajador,"miercoles",semana,year); 

        //Actualiza las obras asignadas para que siempre salga este trabajador en esta semana. 
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obra_asignada").once('value').then(function(snapshot){
            var existe = false;
            var i = 0;
            snapshot.forEach(function(childSnap){
                i++;
                if(childSnap.val() == obra)
                    existe = true;
            });
            if(!existe){
                //si es nuevo pero no le metí ninguna chamba no lo guardo
                var flaglu;
                var flagma;
                var flagmi;
                var flagju;
                var flagvi;
                if($('#' + id_obra_ddl_asistencia + " option:selected").val() == "Atencion a Clientes"){
                    flaglu = $("#chamba_" + id_trabajador + "_lu").val() != "" && $("#chamba_" + id_trabajador + "_lu").val() != "Otra obra" && $("#chamba_" + id_trabajador + "_lu").val() != "Otro año";
                    flagma = $("#chamba_" + id_trabajador + "_ma").val() != "" && $("#chamba_" + id_trabajador + "_ma").val() != "Otra obra" && $("#chamba_" + id_trabajador + "_ma").val() != "Otro año";
                    flagmi = $("#chamba_" + id_trabajador + "_mi").val() != "" && $("#chamba_" + id_trabajador + "_mi").val() != "Otra obra" && $("#chamba_" + id_trabajador + "_mi").val() != "Otro año";
                    flagju = $("#chamba_" + id_trabajador + "_ju").val() != "" && $("#chamba_" + id_trabajador + "_ju").val() != "Otra obra" && $("#chamba_" + id_trabajador + "_ju").val() != "Otro año";
                    flagvi = $("#chamba_" + id_trabajador + "_vi").val() != "" && $("#chamba_" + id_trabajador + "_vi").val() != "Otra obra" && $("#chamba_" + id_trabajador + "_vi").val() != "Otro año";
                } else {
                    flaglu = $("#chamba_" + id_trabajador + "_lu option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_lu option:selected").text() != "Otra obra" && $("#chamba_" + id_trabajador + "_lu option:selected").text() != "Otro año";
                    flagma = $("#chamba_" + id_trabajador + "_ma option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_ma option:selected").text() != "Otra obra" && $("#chamba_" + id_trabajador + "_ma option:selected").text() != "Otro año";
                    flagmi = $("#chamba_" + id_trabajador + "_mi option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_mi option:selected").text() != "Otra obra" && $("#chamba_" + id_trabajador + "_mi option:selected").text() != "Otro año";
                    flagju = $("#chamba_" + id_trabajador + "_ju option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_ju option:selected").text() != "Otra obra" && $("#chamba_" + id_trabajador + "_ju option:selected").text() != "Otro año";
                    flagvi = $("#chamba_" + id_trabajador + "_vi option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_vi option:selected").text() != "Otra obra" && $("#chamba_" + id_trabajador + "_vi option:selected").text() != "Otro año";
                }
                if(flaglu || flagma || flagmi || flagju || flagvi){
                    firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obra_asignada/" + i).set(obra);
                }
            }
        });
    }
    alert("Cambios realizados");
}

function updateDia(id_trabajador,dia,semana,year){
    var dia_corto = dia.substring(0,2);
    var proceso;
    if($('#' + id_obra_ddl_asistencia + " option:selected").val() == "Atencion a Clientes"){
        if($("#chamba_" + id_trabajador + "_" + dia_corto).val() == ""){
            proceso = "Falta";
        } else {
            proceso = $("#chamba_" + id_trabajador + "_" + dia_corto).val();
        }
    } else { 
        proceso = $("#chamba_" + id_trabajador + "_" + dia_corto + " option:selected").text();
    }
        var asis;
        if(proceso == "Falta" || proceso == "Otra obra" || proceso == "" || proceso == "Otro año"){//AQUI dias que no cuentan
            asis = {
                asistencia: false,
                proceso: "NA",
            }
            if(proceso == "Falta"){
                //Si es falta automaticamente lo tengo que subir como falta, porque si está en otra obra va a decir "Otra obra", no falta
                //firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia + "/obra").once('value').then(function(snapshot){
                //    var obra = snapshot.val();
                //    if(obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                var asis_tra = {
                    obra: "NA",
                    proceso: "NA",
                    asistencia: false,
                }
                firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia).set(asis_tra);
                //    }
                //});
            }
        } else {
            asis = {
                asistencia: true,
                proceso: proceso,
            }
            var asis_tra = {
                obra: $('#' + id_obra_ddl_asistencia + " option:selected").val(),
                proceso: proceso,
                asistencia: true,
            }
            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia).set(asis_tra);
        }
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $('#' + id_obra_ddl_asistencia + " option:selected").val() + "/trabajadores/" + id_trabajador + "/dias/" + dia).set(asis);   
}

$('#' + id_terminar_button_asistencia).click(function(){
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var week = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        var semana = snapshot.val();
        var listo = true;
        /*if(!semana.horas_extra_terminadas){
            listo = false;
            alert("No se han terminado de registrar las horas extra");
        }
        if(!semana.diversos_terminados){
            listo = false;
            alert("No se han terminado de registrar los pagos diversos");
        }*/
        if(listo){
            var tru = true;
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/asistencias_terminadas").set(tru);
            guardarAsistencias();
            //Revisar y anotar faltas -> EÑOÑE? AQUI 
            asignarObras(year,week);
            alert("Datos de la semana guardados y bloqueados");
        }
    })
});

function asignarObras(year, week){
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        snapshot.forEach(function(trabSnap){
            var obra_asignada = {};
            var count = 0;
            trabSnap.child("nomina/" + year + "/" + week).forEach(function(daySnap){
                var flag = false;
                var i = 0;
                while(i<count && !flag){
                    if(obra_asignada[i] == daySnap.val().obra){
                        flag = true;
                    }
                    i++;
                }
                if(!flag){
                    obra_asignada[count] = daySnap.val().obra;
                    count++;
                }
            });
            firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key + "/obra_asignada").set(obra_asignada);
        });
    });
}

function headersAsistencia() {
  var row = tableAsistencia.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "JUEVES";
  cell4.innerHTML = "VIERNES";
  cell5.innerHTML = "LUNES";
  cell6.innerHTML = "MARTES";
  cell7.innerHTML = "MIERCOLES";
}

var idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
}