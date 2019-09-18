var id_tab_pagos_nomina = "tabPagosNomina";
var id_form_pagos_nomina = "formPagosNomina";

var id_button_total_pagos_nomina = "totalPagosNominaButton";
var id_button_guardar_pagos_nomina = "guardarPagosNominaButton";

var id_ddl_year_pagos_nomina = "yearPagosNomina";
var id_ddl_week_pagos_nomina = "semanaPagosNomina";

var id_fecha_pagos_nomina = "fechaPagosNomina";

var id_container_pagos_nomina = "divContainerPagosNomina";

var monto_db = 0;

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

    actualizarListaPagosNomina();
});

$('#' + id_ddl_year_pagos_nomina).change(function(){
    $('#' + id_ddl_week_pagos_nomina).empty();
    $('#' + id_fecha_pagos_nomina).val("");

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

$('#' + id_ddl_week_pagos_nomina).change(function(){
    // aquí llamar a la función pro
    actualizarListaPagosNomina();
});

function generateRowPagosNomina(registroSnapshot){
    var key = registroSnapshot.key;
    console.log(key);
    var registro = registroSnapshot.val();

    var nomina = 0;

    var id_pagadora = document.createElement('label');
    id_pagadora.innerText = registro.trabajador_id_pagadora;   
    var col_pagadora = document.createElement('div');
    col_pagadora.className = "form-group col-2";
    col_pagadora.appendChild(id_pagadora);

    var nombre = document.createElement('label');
    
    var nombre_array = registro.trabajador_nombre.split("_");

    var nombre_text = "";
    for(var i=0; i<nombre_array.length;i++){
        if(i>0){
            nombre_text += " ";
        }
        nombre_text += nombre_array[i];
    }

    nombre.innerText = nombre_text;   
    var col_nombre = document.createElement('div');
    col_nombre.className = "form-group col-4";
    col_nombre.appendChild(nombre);

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

    nomina +=  registro.sueldo_semanal * (jueves_aux + viernes_aux + lunes_aux + martes_aux + miercoles_aux)

    var horas_extra = 0;
    if(registro.horas_extra != undefined){
        for(keyHE in registro.horas_extra){
            horas_extra += registro.horas_extra[keyHE].cantidad;
        }
        nomina += (registro.sueldo_semanal / 48 ) * horas_extra * 2;
    }  
    if(registro.diversos != undefined){
        for(keyDIV in registro.diversos){
            nomina += registro.diversos[keyDIV].cantidad;
        };
    };

    var a_pagar_neto = document.createElement('input');
    a_pagar_neto.className = "form-control";
    a_pagar_neto.type = "text";
    // llenar el valor con la suma de todo lo generado;
    a_pagar_neto.disabled = true;
    a_pagar_neto.value = formatMoney(nomina);

    var col_a_pagar = document.createElement('div');
    col_a_pagar.className = "form-group col-3";
    col_a_pagar.appendChild(a_pagar_neto);

    var pago = document.createElement('input');
    pago.className = "form-control pago";
    pago.type = "text";
    pago.value = formatMoney(registro.pagos_nomina.monto);
    // llenar el valor del pago con lo que esté en el reg.
    
    var col_pago = document.createElement('div');
    col_pago.className = "form-group col-3";
    col_pago.appendChild(pago);

    var row = document.createElement('div');
    row.className = "form-row rowPagoNomina";
    row.id = key;
    console.log(row.id);
    row.append(col_pagadora);
    row.append(col_nombre);
    row.append(col_a_pagar);
    row.append(col_pago);
    
    var container = document.getElementById(id_container_pagos_nomina);
    container.appendChild(row);

    // necesito ordenar el puto container (Creo que funcionó y no sé cómo verga)
    var mylist = $('#' + id_container_pagos_nomina);
    var rows = mylist.children();
    
    rows.sort(function(a, b) {
       return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
    });
    
    $.each(rows, function(index, item) {
       mylist.append(item); 
    });
};

function actualizarListaPagosNomina(){
    $('#' + id_container_pagos_nomina).empty();
    monto_db = 0;
    firebase.database().ref(rama_bd_nomina + "/listas/fecha_datos/" + $('#' + id_ddl_year_pagos_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_pagos_nomina + " option:selected").val()).once("value").then(function(listaSnap){
        listaSnap.forEach(function(subSnap){
            firebase.database().ref(rama_bd_nomina + "/nomina/").child(Object.keys(subSnap.val())[0]).once("value").then(function(regSnap){
                generateRowPagosNomina(regSnap);
                monto_db += regSnap.val().pagos_nomina.monto;
            });
        });
    });

    // llenar campo de fecha;
    firebase.database().ref(rama_bd_nomina + "/listas/fechas_pago/" + $('#' + id_ddl_year_pagos_nomina + " option:selected").val() + "/" + $('#' + id_ddl_week_pagos_nomina + " option:selected").val()).once("value").then(function(snapshot){
        var fecha_aaaammdd = Object.keys(snapshot.val())[0];
        var fecha = fecha_aaaammdd.slice(0,4) + "." + fecha_aaaammdd.slice(4,6) + "." + fecha_aaaammdd.slice(6);

        $('#' + id_fecha_pagos_nomina).val(fecha);
    });
};

$('#' + id_button_guardar_pagos_nomina).click(function(){
    var fecha = $('#' + id_fecha_pagos_nomina).val();
    if(fecha == ""){
        alert("Selecciona la fecha de pago.");
        return;
    }

    var fecha_array = fecha.split(".");
    var fecha_json = new Date(fecha_array[0], fecha_array[1] - 1, fecha_array[2]).getTime();

    var json_datos = {};
    var json_lista = {};

    var year = $('#'+ id_ddl_year_pagos_nomina + " option:selected").val();
    var week = $('#'+ id_ddl_week_pagos_nomina + " option:selected").val();
    firebase.database().ref(rama_bd_nomina + "/listas/fechas_pago").once("value").then(function(snapshot){
        $('.pago').each(function() {
            var row = this.parentElement.parentElement;
            console.log(row.id);
            if(snapshot.exists()){
                snapshot.forEach(function(subSnap){
                    subSnap.forEach(function(subSubSnap){
                        subSubSnap.forEach(function(regSnap){   
                            json_lista["fechas_pago/" + subSnap.key + "/" + subSubSnap.key + "/" + regSnap.key + "/" + row.id] = null;
                        });
                    });
                });
            };
    
            json_datos[row.id + "/pagos_nomina/monto"] = deformatMoney($(this).val());
            json_datos[row.id + "/pagos_nomina/fecha"] = fecha_json;
    
            json_lista["fechas_pago/" + year + "/" + week + "/" + aaaammdd(fecha) + "/" + row.id] = true;
        });
        console.log(json_datos);
        firebase.database().ref(rama_bd_nomina + "/nomina").update(json_datos);
        firebase.database().ref(rama_bd_nomina + "/listas").update(json_lista);

        alert("Pagos actualizados en la base de datos");
        actualizarListaPagosNomina();
    });
});

$(document).on('keypress','.pago', function(e){
    charactersAllowed("$1234567890,.",e);
});

$(document).on('change','.pago', function(){
    var deformat_sueldo = deformatMoney($(this).val());
    $(this).val(formatMoney(deformat_sueldo));
});


$('#' + id_button_total_pagos_nomina).click(function(){
    var monto_actual = 0;
    $('.pago').each(function() {
        monto_actual += deformatMoney($(this).val());
    });

    var msg = "El monto en la base de datos es: " + formatMoney(monto_db);
    msg += "\r\n";
    msg += "El monto actual es: " + formatMoney(monto_actual);

    alert(msg);
});