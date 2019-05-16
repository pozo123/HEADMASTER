// revisar si funciona con entradas de multiples tipos
// Checar kaizen
var id_semana_ddl_diversos = "semanaDdlDiversos";
var id_year_ddl_diversos = "yearDdlDiversos";
var id_diverso_ddl_diversos = "diversoDdlDiversos";
var id_diverso_group_diversos = "diversoGroupDiversos";//Nuevo!

var id_guardar_button_diversos = "guardarButtonDiversos";
var id_terminar_button_diversos = "terminarButtonDiversos";

var id_carga_semana_anterior_button_diversos = "semanaAnteriorButtonDiversos";

var id_datatable_diversos = "dataTableDiversos";
var id_datatable_div_diversos = "dataTableGroup1"
var id_table_diversos = "tableDiversos";
var id_tab_diversos = "tabDiversos";

var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
var rama_bd_trabajadores = "rrhh/trabajadores";
var rama_bd_diversos = "rrhh/diversos";
var rama_bd_obras_magico = "obras";
var nuevo;
var entradas = 0;
var tableDiversos = document.getElementById(id_table_diversos)

$('#' + id_tab_diversos).click(function(){
    resetDiversos();
});

function resetDiversos(){
    $('#' + id_carga_semana_anterior_button_diversos).addClass('hidden');
    $('#' + id_semana_ddl_diversos).empty();
    $('#' + id_year_ddl_diversos).empty();
    $('#' + id_diverso_ddl_diversos).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_div_diversos).addClass('hidden');
    $('#' + id_table_diversos).empty();
    entradas = 0;

    var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_semana_ddl_diversos);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_diversos);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }

    var select3 = document.getElementById(id_diverso_ddl_diversos);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select3.appendChild(option3);

    firebase.database().ref(rama_bd_diversos).orderByChild('nombre').on('child_added',function(snapshot){
        var diverso = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = diverso.nombre;
        option4.value = diverso.nombre;
        select3.appendChild(option4);
    });
    
    nuevo = tableDiversos.insertRow(0);
    nuevo.id = "nuevo_trabajador_diversos";
    
};

$('#' + id_year_ddl_diversos).change(function(){
    document.getElementById(id_diverso_ddl_diversos).selectedIndex = 0;
    $('#' + id_carga_semana_anterior_button_diversos).addClass('hidden');
    $('#' + id_semana_ddl_diversos).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_div_diversos).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_diversos).empty();

    entradas = 0;
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var select = document.getElementById(id_semana_ddl_diversos);
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

$('#' + id_semana_ddl_diversos).change(function(){
    $('#' + id_carga_semana_anterior_button_diversos).addClass('hidden');
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_div_diversos).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_diversos).empty();
    entradas = 0;
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();

    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana).once('value').then(function(snapshot){
        var nomina = snapshot.val();
        var terminada = nomina ? nomina.diversos_terminados : false;
        if(terminada){
            //console.log("hola")
            $('#' + id_diverso_group_diversos).addClass('hidden');
            $('#' + id_datatable_div_diversos).removeClass('hidden');
            //Cargar tabla con datos
            var datos_diversos = [];
            snapshot.forEach(function(obraSnap){
                if(obraSnap.key != "asistencias_terminadas" && obraSnap.key != "diversos_terminados" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "terminada"){
                    obraSnap.child("trabajadores").forEach(function(trabSnap){
                        trabSnap.child("diversos").forEach(function(childSnap){
                            var entrada = childSnap.val();
                            //console.log(obraSnap.key);
                            //console.log(obraSnap.val());
                            datos_diversos.push([trabSnap.key,obraSnap.key,entrada.diverso,entrada.proceso,formatMoney(entrada.cantidad)]);
                        });
                    });
                }
            });
            //Asincronía? :S
            $('#' + id_datatable_div_diversos).removeClass('hidden');
            var tabla_procesos = $('#'+ id_datatable_diversos).DataTable({
                destroy: true,
                data: datos_diversos,
                dom: 'Bfrtip',
                buttons: ['excel'],
                columns: [
                    {title: "ID",width: 70},
                    {title: "OBRA",width: 70},
                    {title: "DIVERSO",width: 70},
                    {title: "PROCESO",width: 70},
                    {title: "CANTIDAD",width: 70}
                ],
                language: idioma_espanol,
            });
        } else{
            $('#' + id_diverso_group_diversos).removeClass('hidden');
        }
    });
});

$("#" + id_diverso_ddl_diversos).change(function(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();
    cargaEntradasDiversos(year,semana);
});

$('#' + id_carga_semana_anterior_button_diversos).click(function(){
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    if(parseFloat(semana) == 1){
        alert("No se puede realizar esta acción en la primera semana del año");
    } else {
        cargaEntradasDiversos(year, parseInt(semana)-1);
        $('#' + id_carga_semana_anterior_button_diversos).addClass('hidden');
    }
});

function cargaEntradasDiversos(year,semana){
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_diversos).addClass('hidden');
    $('#' + id_table_diversos).empty();
    entradas = 0;
    headersDiversos();
    nuevo = tableDiversos.insertRow(entradas + 1);
    nuevo.id = "nuevo_trabajador_diversos";
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        var vacio = true;
        snapshot.forEach(function(trabSnap){
            trabSnap.child('nomina/' + year + "/" + semana + "/diversos").forEach(function(diverSnap){
                var diver = diverSnap.val();
                if(diver.diverso == $('#' + id_diverso_ddl_diversos + " option:selected").val()){
                    vacio = false;
                    cargaRenglonDiversos(trabSnap.val(),false,diver.cantidad,diver.distribuible,diver.obra,diver.proceso);
                }
            });
        });
        if(vacio){
            $('#' + id_carga_semana_anterior_button_diversos).removeClass('hidden');
        } else {
            $('#' + id_carga_semana_anterior_button_diversos).addClass('hidden');
        }
        var cell_id = nuevo.insertCell(0);
        var t_id = document.createElement('input');
        t_id.id = "t_id_diver";
        t_id.placeholder = "ID";
        cell_id.appendChild(t_id);
        $('#' + t_id.id).change(function(){
            if($('#' + t_id.id).val() != ""){
                firebase.database().ref(rama_bd_trabajadores + "/" + $('#' + t_id.id).val()).once('value').then(function(snapshot){
                    var trabajador = snapshot.val();
                    if(trabajador != null){
                        cargaRenglonDiversos(trabajador, true,"","","","");
                        $('#' + t_id.id).val("");
                    } else {
                        alert("No existe un trabajador con ese ID");
                    }
                });
            }
        });
        var cell_nombre = nuevo.insertCell(1);
        var t_nombre = document.createElement('input');
        t_nombre.id = "t_nombre_diver"
        t_nombre.placeholder = "Nombre";
        cell_nombre.appendChild(t_nombre);
        $('#' + t_nombre.id).change(function(){
            if($('#' + t_nombre.id).val() != ""){
                firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo($('#' + t_nombre.id).val()).once('value').then(function(snapshot){
                    snapshot.forEach(function(childSnap){
                        var trabajador = childSnap.val();
                        if(trabajador != null){
                            cargaRenglonDiversos(trabajador, true,"","","","");
                            $('#' + t_nombre.id).val("");
                        } else {
                            alert("No existe un trabajador con ese nombre");
                        }
                    });
                });
            }
        });
    });
};

function cargaRenglonDiversos(trabajador,nuevo,cantidad_in,distribuible_in,obra_in,proc_in){
    var row = tableDiversos.insertRow(entradas + 1);
    row.id = "row_" + entradas;
    var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_cant = row.insertCell(2);
    var cell_distribuible = row.insertCell(3);

    var id_label = document.createElement('label');
    id_label.innerHTML = trabajador.id_trabajador;
    id_label.id = "id_" + entradas;
    cell_id.appendChild(id_label);

    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabajador.nombre;
    nombre_label.id = "nombre_" + entradas;
    cell_nombre.appendChild(nombre_label);

    var cant = document.createElement('input');
    cant.type = "text";
    cant.id = "cant_" + entradas;
    cant.placeholder = "Cantidad pagada";
    cell_cant.appendChild(cant);

    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "check_" + entradas;
    //check.innerHTML = "Distribuible";
    check.checked = true;
    cell_distribuible.appendChild(check);

    $('#' + check.id).change(function(){
        if(this.checked != true){
            var cell_obra = row.insertCell(4);
            var consec = row.id.substring(row.id.length - 2, row.id.length);
            if(consec.substring(0,1) == "_"){
                consec = consec.substring(1,2);
            }
            cell_obra.id = "cell_obra_" + consec;
            var cell_proc = row.insertCell(5);
            cell_proc.id = "cell_proc_" + consec;
            generateDdls(cell_obra, cell_proc, true, obra_in, proc_in); 
        } else {
            row.deleteCell(4);
            row.deleteCell(4);
        }
    });

    if(!nuevo){
        $("#" + cant.id).val(cantidad_in);
        if(distribuible_in == true){
            check.checked = true;
        } else {
            check.checked = false;
            var cell_obra = row.insertCell(4);
            var consec = row.id.substring(row.id.length - 2, row.id.length);
            if(consec.substring(0,1) == "_"){
                consec = consec.substring(1,2);
            }
            cell_obra.id = "cell_obra_" + consec;
            var cell_proc = row.insertCell(5);
            cell_proc.id = "cell_proc_" + consec;
            generateDdls(cell_obra, cell_proc, nuevo, obra_in, proc_in);
        }
    }

    entradas++;
}

function generateDdls(cell_obra, cell_proc, nuevo, obra_in, proc_in){
    var obra_ddl = document.createElement('select');
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    obra_ddl.appendChild(option2);
    var k = cell_obra.id.substring(cell_obra.id.length - 2, cell_obra.id.length);
    if(k.substring(0,1) == "_"){
        k = k.substring(1,2);
    }
    obra_ddl.id = "obra_" + k;
    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            var obra = obraSnap.val();
            var option = document.createElement('OPTION');
            if(obra.terminada){
                option.style = "display:none";
            }
            option.text = option.value = obra.nombre;
            obra_ddl.appendChild(option);
        });
        var option3 = document.createElement('option');
        option3.text = option3.value = "Atencion a Clientes";
        obra_ddl.appendChild(option3);
        cell_obra.appendChild(obra_ddl);
        var proc_input;
        if(!nuevo){
            for(var i = 0; i<obra_ddl.length;i++){
                if(obra_ddl[i].text == obra_in){
                    obra_ddl.selectedIndex = i;
                }
            }
            if(obra_in == "Atencion a Clientes"){
                var proc_input = document.createElement('input');
                proc_input.type = "text";
                proc_input.id = "proc_" + k;
                $('#' + proc_input.id).val(proc_in);
            } else {
                var proc_input = document.createElement('select');
                proc_input.id = "proc_" + k;
                var option2 = document.createElement('option');
                option2.style = "display:none";
                option2.text = option2.value = "";
                proc_input.appendChild(option2);
                //console.log(snapshot);
                //console.log(obra_in);
                var obra = snapshot.child(obra_in);
                if(obra.val().num_procesos == 0 && obra.child("procesos/ADIC/num_subprocesos").val() == 0){
                    var option = document.createElement('OPTION');
                    option.text = "MISC";
                    option.value = "MISC";
                    proc_input.appendChild(option);
                } else {
                    obra.child("procesos").forEach(function(procSnap){
                        var proceso = procSnap.val();
                        if(proceso.num_subprocesos == 0 && proceso.clave != "ADIC"){
                            var option = document.createElement('OPTION');
                            option.text = proceso.clave;// + " (" + proceso.nombre + ")";
                            option.value = proceso.clave;
                            proc_input.appendChild(option);
                        } else {
                            procSnap.child("subprocesos").forEach(function(subpSnap){
                                var subproc = subpSnap.val();
                                var option = document.createElement('OPTION');
                                option.text = subproc.clave;// + " (" + subproc.nombre + ")";
                                option.value = subproc.clave;
                                proc_input.appendChild(option);
                            });
                        }
                    });
                }
                for(var i = 0; i<proc_input.length;i++){
                    if(proc_input[i].text == proc_in){
                        proc_input.selectedIndex = i;
                    }
                }
            }
            cell_proc.appendChild(proc_input);
        }
        $('#' + obra_ddl.id).change(function(){
            //console.log("change");
            $('#' + cell_proc.id).empty();
            if($('#' + obra_ddl.id + " option:selected").val() == "Atencion a Clientes"){
                var proc_input = document.createElement('input');
                proc_input.type = "text";
                proc_input.id = "proc_" + k;
            } else {
                var proc_input = document.createElement('select');
                proc_input.id = "proc_" + k;
                var option2 = document.createElement('option');
                option2.style = "display:none";
                option2.text = option2.value = "";
                proc_input.appendChild(option2);
                var obra = snapshot.child($('#' + obra_ddl.id + " option:selected").val());
                if(obra.val().num_procesos == 0 && obra.child("procesos/ADIC/num_subprocesos").val() == 0){
                    var option = document.createElement('OPTION');
                    option.text = "MISC";
                    option.value = "MISC";
                    proc_input.appendChild(option);
                } else {
                    obra.child("procesos").forEach(function(procSnap){
                        var proceso = procSnap.val();
                        if(proceso.num_subprocesos == 0 && proceso.clave != "ADIC"){
                            var option = document.createElement('OPTION');
                            if(!proceso.terminado){
                                option.text = proceso.clave;// + " (" + proceso.nombre + ")";
                                option.value = proceso.clave;
                                proc_input.appendChild(option);
                            }
                        } else {
                            procSnap.child("subprocesos").forEach(function(subpSnap){
                                var subproc = subpSnap.val();
                                if(!subproc.terminado){
                                    var option = document.createElement('OPTION');
                                    option.text = subproc.clave;// + " (" + subproc.nombre + ")";
                                    option.value = subproc.clave;
                                    proc_input.appendChild(option);
                                }
                            });
                        }
                    });
                }
            }
            cell_proc.appendChild(proc_input);
        });
    });
}

function checkProcDdl(){
    var repetida = false;
    var i = 0;
    while(i<entradas && !repetida){
        //console.log(i)
        var id_actual = document.getElementById("id_" + i).innerHTML;
        var dist_actual = document.getElementById("check_" + i).checked;
        var obra_actual = dist_actual ? "NA" : $('#obra_' + i + ' option:selected').val();
        var proc_actual = dist_actual ? "NA" : (obra_actual == "Atencion a Clientes" ? $('#proc_' + i).val() : $('#proc_' + i + ' option:selected').val());
        var j = i + 1;
        //console.log(j)
        while(j<entradas && !repetida){
            var id_comp = document.getElementById("id_" + j).innerHTML;
            var dist_comp = document.getElementById("check_" + j).checked;
            var obra_comp = dist_comp ? "NA" : $('#obra_' + j + ' option:selected').val();
            var proc_comp = dist_comp ? "NA" : (obra_comp == "Atencion a Clientes" ? $('#proc_' + j).val() : $('#proc_' + j + ' option:selected').val());
            if(id_comp == id_actual && dist_comp == dist_actual && obra_comp == obra_actual && proc_comp == proc_actual){
                repetida = true;
            } else {
                j++;
            }
        }
        i++;
    }
    return repetida;
}

$('#' + id_guardar_button_diversos).click(function(){
    if(!checkProcDdl()){
        guardarDiversos();
    } else {
        alert("Existe un registro repetido (mismo trabajador y mismo proceso/distribuible)");
    }
});

function guardarDiversos(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();
    var diverso = $('#' + id_diverso_ddl_diversos + " option:selected").val();
    var suma_diversos = {};
    var updates = {};
    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
        for(i=0;i<entradas;i++){
            if($('#cant_' + i).val() != ""){
                var id_trabajador = document.getElementById("id_" + i).innerHTML;
                var dist = true;
                var obr = "NA";
                var pro = "NA";
                //console.log(!document.getElementById("check_" + i).checked)
                if(!document.getElementById("check_" + i).checked){
                    dist = false;
                    obr = $('#obra_' + i + " option:selected").val();
                    if(obr == "Atencion a Clientes"){
                        pro = $('#proc_' + i).val();
                    } else {
                        pro = $('#proc_' + i + " option:selected").val();
                    }
                    //console.log(obr)
                }
                var div = {
                    cantidad: parseFloat($('#cant_' + i).val()),
                    distribuible: dist,
                    obra: obr, 
                    proceso: pro, 
                    diverso: diverso,
                }
                var existe_div = false;
                snapshot.child(id_trabajador + "/nomina/" + year + "/" + semana + "/diversos").forEach(function(divSnap){
                    var diver = divSnap.val();
                    if(div.diverso == diver.diverso && ((diver.distribuible == div.distribuible) && (diver.obra == div.obra && diver.proceso == div.proceso))){
                        existe_div = true;
                        if(div.cantidad != diver.cantidad){
                            var diferencia = div.cantidad - parseFloat(diver.cantidad);
                            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/diversos/" + divSnap.key + "/cantidad").set(div.cantidad);
                            var dif_impuestos = diferencia * 0.16;
                            sumaEnFirebase(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/impuestos/impuestos_diversos", dif_impuestos);
                            sumaEnFirebase(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/total_diversos", diferencia);
                            sumaEnFirebase(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + div.obr + "/trabajadores/" + id_trabajador + "/impuestos/impuestos_diversos", dif_impuestos);
                            sumaEnFirebase(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + div.obr + "/trabajadores/" + id_trabajador + "/total_diversos", diferencia);
                            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + div.obr + "/trabajadores/" + id_trabajador + "/diversos").once('value').then(function(dSnap){
                                dSnap.forEach(function(childSnap){
                                    diver = childSnap.val();
                                    if(div.diverso == diver.diverso && ((diver.distribuible == div.distribuible) && (diver.obra == div.obra && diver.proceso == div.proceso))){
                                        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + div.obr + "/trabajadores/" + id_trabajador + "/diversos/" + childSnap.key + "/cantidad").set(div.cantidad);
                                    }
                                });
                            });
                        }
                    }
                });
                if(!existe_div){
                    if(!dist && (obr == "" || pro == "")){
                        alert("El registro del renglón: " + parseInt(i + 1) + " no se registró")
                    } else {
                        if(!suma_diversos[id_trabajador]){
                            suma_diversos[id_trabajador] = parseFloat($('#' + "cant_" + i).val());
                        } else {
                            suma_diversos[id_trabajador] = parseFloat($('#' + "cant_" + i).val()) + suma_diversos[id_trabajador];
                        }
                        var newPostKey = firebase.database().ref(id_trabajador + "/nomina/" + year + "/" + semana + "/diversos").push().key;
                        updates[id_trabajador + "/nomina/" + year + "/" + semana + "/diversos/" + newPostKey] = div;
    
                        //Actualiza las obras asignadas para que siempre salga este trabajador en esta semana.
                        if(obr != "NA"){
                            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obra_asignada").once('value').then(function(snapshot){
                                var existe = false;
                                var i = 0;
                                snapshot.forEach(function(childSnap){
                                    i++;
                                    if(childSnap.val() == obr)
                                        existe = true;
                                });
                                if(!existe){
                                    //si es nuevo pero no le metí ninguna chamba no lo guardo
                                    firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obra_asignada/" + i).set(obr);
                                }
                            });
                        }
                    }
                }
                /*console.log("updates: ");
                console.log(updates);
                console.log("suma_diversos: ");
                console.log(suma_diversos);*/
            }
        }
        firebase.database().ref(rama_bd_trabajadores).update(updates);
        var updates_tot = {};
        firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
            for(key in suma_diversos){
                //console.log(key + ": " + suma_diversos[key]);
                var val_ant = snapshot.child(key + "/nomina/" + year + "/" + semana + "/total_diversos").val();
                var diversos_nuevos = suma_diversos[key];
                if(val_ant != null){
                    diversos_nuevos += parseFloat(val_ant);
                }
                updates_tot[key + "/nomina/" + year + "/" + semana + "/total_diversos"] = diversos_nuevos;
                //firebase.database().ref(rama_bd_trabajadores + "/" + key + "/nomina/" + year + "/" + semana + "/total_diversos").set(diversos_nuevos);
                var impuestos_diversos = (diversos_nuevos * 0.16).toFixed(2);
                updates_tot[key + "/nomina/" + year + "/" + semana + "/impuestos/impuestos_diversos"] = impuestos_diversos;
                //firebase.database().ref(rama_bd_trabajadores + "/" + key + "/nomina/" + year + "/" + semana + "/impuestos/impuestos_diversos").set(impuestos_diversos);
            }
            //console.log("updates_tot: ");
            //console.log(updates_tot);
            firebase.database().ref(rama_bd_trabajadores).update(updates_tot);
        });
        alert("Datos actualizados");
    });
}

$('#' + id_terminar_button_diversos).click(function(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var week = $('#' + id_semana_ddl_diversos + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshotNom){
        var nomina = snapshotNom.val();
        var terminada = nomina ? nomina.diversos_terminados : false;
        if(terminada){
            alert("Esta semana ya está terminada");
            return;
        }
        if(!checkProcDdl()){
            guardarDiversos();
            if(snapshotNom.child("asistencias_terminadas").val()){
                //Entro a trabajadores y registro los diversos en pagos_nomina, tengo que esperar hasta acá por los distribuibles
                firebase.database().ref(rama_bd_obras_magico).once('value').then(function(obrasSnapshot){
                    var obras_json = obrasSnapshot.val();
                    firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
                        //checar si tienen esta semana
                        snapshot.forEach(function(trabSnap){
                            var total_div = 0;
                            var trab = trabSnap.val().nomina;
                            if(trab != undefined){
                                if(trab[year] != undefined){
                                    //console.log(trab[year][week]);
                                    if(trab[year][week] != undefined){
                                        //console.log("hola");
                                        trabSnap.child("nomina/" + year + "/" + week + "/diversos").forEach(function(diversoSnap){
                                            //console.log("3");
                                            var diver = diversoSnap.val();
                                            total_div = total_div + parseFloat(diver.cantidad);
                                            if(diver.distribuible){
                                                distribuyeEnAsistencias(obras_json,diver.cantidad,trabSnap,year,week,diver.diverso);
                                            } else {
                                                var diverso = {
                                                    cantidad: diver.cantidad,
                                                    diverso: diver.diverso,
                                                    proceso: diver.proceso,
                                                }
                                                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/diversos").push(diverso);
                                                //var query = diver.obra;
                                                if(diver.obra != "Atencion a Clientes" && diver.obra != "Vacaciones"){
                                                    //sumaMOKaizen(query,diver.cantidad);
                                                    obras_json[diver.obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[diver.obra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(diver.cantidad)*1.16).toFixed(2);
                                                    if(diver.obra != diver.proceso){
                                                        var path = diver.proceso.split("-");
                                                        //query = query + "/procesos/" + path[0];
                                                        //sumaMOKaizen(query,diver.cantidad);
                                                        obras_json[diver.obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[diver.obra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(diver.cantidad)*1.16).toFixed(2);
                                                        if(path.length>1){
                                                            //query = query + "/procesos/" + path[0] + "/subprocesos/" + diver.proceso;
                                                            //sumaMOKaizen(query,diver.cantidad);
                                                            obras_json[diver.obra]["procesos"][path[0]]["subprocesos"][diver.proceso]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[diver.obra]["procesos"][path[0]]["subprocesos"][diver.proceso]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(diver.cantidad)*1.16).toFixed(2);
                                                        }
                                                    }
                                                }/*
                                                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/total_diversos").once('value').then(function(snapshot){
                                                    var valor_anterior = snapshot.val();
                                                    if(valor_anterior == null){
                                                        valor_anterior = 0;
                                                    }
                                                    var nuevo_valor = parseFloat(valor_anterior) + parseFloat(diver.cantidad);
                                                    console.log("valor_anterior: " + valor_anterior);
                                                    console.log("nuevo_valor: " + nuevo_valor);
                                                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/total_diversos").set(nuevo_valor);
                                                    var impuestos_diversos = (nuevo_valor * 0.16).toFixed(2);
                                                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
                                                });*/
                                            }
                                        });
                                    }
                                }               
                            }
                        });
                        //console.log(obras_json);
                        firebase.database().ref(rama_bd_obras_magico).update(obras_json);
                    });
                    
                    var tru = true;
                    //console.log("hola");
                    calculaTotalesEImpuestosDiversos();
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_diversos + " option:selected").val() + "/" + $('#' + id_semana_ddl_diversos + " option:selected").val() + "/diversos_terminados").set(tru);
                    alert("Pagos diversos de esta semana terminados");
                    document.getElementById(id_diverso_ddl_diversos).selectedIndex = 0;
                    document.getElementById(id_year_ddl_diversos).selectedIndex = 0;
                    setTimeout(function(){location.reload();}, 2000);
                });

            } else {
                alert("No se han terminado las asistencias");
            }
        } else {
            alert("Existe un registro repetido (mismo trabajador y mismo proceso/distribuible)");
        }
    })
});
    
function distribuyeEnAsistencias(obras_json,monto,trabSnap,year,week,diverso){
    var asistencias = {asistencias: 0};
    var lastDay = new Date(year,11,31);
    if(week == getWeek(lastDay.getTime())[0] && lastDay.getDay() != 3){
        var year_siguiente = year + 1;
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/lunes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/martes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/miercoles").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/jueves").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_siguiente + "/1/viernes").val());
    }
    if(week == 1 && new Date(year,0,1).getDay() != 4){
        var year_anterior = year - 1;
        var last_week = getWeek(new Date(year_anterior,11,31).getTime())[0];
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/lunes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/martes").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/miercoles").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/jueves").val());
        asistenciaSimpleDiversos(asistencias, trabSnap.child("nomina/" + year_anterior + "/" + last_week + "/viernes").val());
        distribuyeEnAsistencias(obras_json, monto, trabSnap, year_anterior, last_week, diverso);
    }
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/lunes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/martes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/miercoles").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/jueves").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/viernes").val());

    var totales = {};
    //firebase.database().ref(rama_bd_obras_magico).once('value').then(function(obrasSnapshot){
        //var obras_json = obrasSnapshot.val();
        for(key in asistencias){
            if(key != "asistencias"){
                var keyObra = key;
                if(asistencias[keyObra]["procesos"]){
                    if(!totales[keyObra]){
                        totales[keyObra] = 0;
                    }
                    for(key in asistencias[keyObra]["procesos"]){
                        var cant = (monto * asistencias[keyObra]["procesos"][key] / asistencias["asistencias"]).toFixed(2);
                        var diver = {
                            cantidad: cant,
                            proceso: key,
                            diverso: diverso,
                        }
                        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
                        if(keyObra != "Atencion a Clientes" && keyObra != "Vacaciones"){
                            //sumaMOKaizen(keyObra,cant);
                            obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] =(parseFloat(obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant)*1.16).toFixed(2);
                            var path = key.split("-");
                            //sumaMOKaizen(keyObra + "/procesos/" + path[0],cant);
                            obras_json[keyObra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] =(parseFloat(obras_json[keyObra]["procesos"][path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant)*1.16).toFixed(2);
                            if(path.length > 1){
                                //sumaMOKaizen(keyObra + "/procesos/" + path[0] + "/subprocesos/" + key,cant);
                                obras_json[keyObra]["procesos"][path[0]]["subprocesos"][key]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] =(parseFloat(obras_json[keyObra]["procesos"][path[0]]["subprocesos"][key]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant)*1.16).toFixed(2);
                            } 
                        }
                        //console.log(keyObra + "/" + key + ": " + monto * asistencias[keyObra]["procesos"][key] / asistencias["asistencias"]);
                        //totales[keyObra] = parseFloat(totales[keyObra]) + parseFloat(cant);
                        //console.log(totales);
                    }
                } else {
                    var cant = (monto * asistencias[keyObra] / asistencias["asistencias"]).toFixed(2);
                    var diver = {
                        cantidad: cant,
                        proceso: keyObra,
                        diverso: diverso,
                    }
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
                    obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"] = (parseFloat(obras_json[keyObra]["kaizen"]["PRODUCCION"]["COPEO"]["PAG"]) + parseFloat(cant)*1.16).toFixed(2);
                    //sumaMOKaizen(keyObra,cant);
                    //console.log(keyObra + ": " + cant);
                    //totales[keyObra] = totales[keyObra] ? parseFloat(cant) + parseFloat(totales[keyObra]) : parseFloat(cant);
                }
            }
        }
    //});
    /*
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        for(key in totales){
            var snap = snapshot.child(key + "/trabajadores/" + trabSnap.key + "/total_diversos");
            var valor_anterior = snap.exists() ? snap.val() : 0;
            console.log("val_ant: " + valor_anterior);
            var nuevo_valor = parseFloat(valor_anterior) + parseFloat(totales[key]);
            console.log("val_new: " + nuevo_valor)
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + key + "/trabajadores/" + trabSnap.key + "/total_diversos").set(nuevo_valor);
            var impuestos_diversos = (nuevo_valor * 0.16).toFixed(2);
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + key + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
        }
    });*/
}

function calculaTotalesEImpuestosDiversos(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var week = $('#' + id_semana_ddl_diversos + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key != "asistencias_terminadas" && obraSnap.key != "diversos_terminados" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "terminada"){
                obraSnap.child("trabajadores").forEach(function(trabSnap){
                    var total = 0;
                    trabSnap.child("diversos").forEach(function(divSnap){
                        total = total + parseFloat(divSnap.val().cantidad);
                    });
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obraSnap.key + "/trabajadores/" + trabSnap.key + "/total_diversos").set(total);
                    var impuestos_diversos = total * 0.16;
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + obraSnap.key + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
                });
            }
        });
    });
}

/*function sumaMOKaizen(query,cantidad){
    firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
        var anterior = snapshot.val();
        var nuevo = (parseFloat(anterior) + parseFloat(cantidad) * 1.16).toFixed(2);//se le agrega al impuesto para el kaizen
        console.log(query);
        console.log(cantidad);
        console.log(anterior);
        console.log(nuevo);
        firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
    });
}*/

function asistenciaSimpleDiversos(asistencias, dia){
    if(dia.asistencia){
        if(asistencias["asistencias"]){
            asistencias["asistencias"] = asistencias["asistencias"] + 0.2;
        } else {
            asistencias["asistencias"] = 0.2;
        }   
    }
}

function asistenciaDia(asistencias, dia){
    var proc = dia.proceso;
    if(dia.proceso == "Parado"){
        proc = "MISC";
    }
    asistenciaSimpleDiversos(asistencias, dia);
    if(dia.asistencia){
        if(dia.obra == proc){
            if(asistencias[dia.obra]) {
                asistencias[dia.obra] = asistencias[dia.obra] + 0.2;
            } else {
                asistencias[dia.obra] = 0.2;
            }
        } else { 
            if(asistencias[dia.obra]){
                if(!asistencias[dia.obra]["procesos"]){
                    asistencias[dia.obra]["procesos"] = {};
                }
                if(asistencias[dia.obra]["procesos"][proc]){
                    asistencias[dia.obra]["procesos"][proc] = asistencias[dia.obra]["procesos"][proc] + 0.2;
                } else {
                    asistencias[dia.obra]["procesos"][proc] = 0.2;
                }
            } else {
                asistencias[dia.obra] = {};
                asistencias[dia.obra]["procesos"] = {};
                asistencias[dia.obra]["procesos"][proc] = 0.2;
            }
        }
    }
}

function headersDiversos() {
  var row = tableDiversos.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "CANTIDAD";
  cell4.innerHTML = "DISTRIBUIBLE";
  cell5.innerHTML = "OBRA";
  cell6.innerHTML = "PROCESO";
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