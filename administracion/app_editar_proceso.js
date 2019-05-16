var id_obra_ddl_editar_proceso = "obraDdlEditarProceso";
var id_proceso_ddl_editar_proceso = "procesoDdlEditarProceso";
var id_subproceso_ddl_editar_proceso = "subprocesoDdlEditarProceso";
var id_nombre_editar_proceso = "nombreEditarProceso";
var id_alcance_editar_proceso = "alcanceEditarProceso";
var id_fecha_inicio_editar_proceso = "fechaInicioEditarProceso";
var id_fecha_final_editar_proceso = "fechaFinalEditarProceso";
var id_actualizar_button_editar_proceso = "buttonEditarProceso";
var id_sub_group_editar_proceso = "groupSubEditarProceso";
var id_datos_editar_proceso = "groupDatosEditarProceso";

var rama_bd_obras_magico = "obras";

var f_i_obra_anterior = 0;
var f_f_obra_anterior = 0;

var f_i_proc_anterior = 0;
var f_f_proc_anterior = 0;

$('#tabEditarProceso').click(function(){
    $('#' + id_sub_group_editar_proceso).addClass("hidden");
    $('#' + id_datos_editar_proceso).addClass("hidden");
    jQuery('#' + id_fecha_inicio_editar_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_editar_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    $('#' + id_fecha_final_editar_proceso).val("");
    $('#' + id_fecha_inicio_editar_proceso).val("");
    $('#' + id_nombre_editar_proceso).val("");
    $('#' + id_alcance_editar_proceso).val("");

    $('#' + id_obra_ddl_editar_proceso).empty();
    var select = document.getElementById(id_obra_ddl_editar_proceso);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
            var option2 = document.createElement('OPTION');
            option2.text = obra.nombre;
            option2.value = obra.clave;
            select.appendChild(option2);
        }
    });
});

$("#" + id_obra_ddl_editar_proceso).change(function(){
    $('#' + id_datos_editar_proceso).addClass("hidden");
    $('#' + id_sub_group_editar_proceso).addClass('hidden');

    $('#' + id_fecha_final_editar_proceso).val("");
    $('#' + id_fecha_inicio_editar_proceso).val("");
    $('#' + id_nombre_editar_proceso).val("");
    $('#' + id_alcance_editar_proceso).val("");

    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();

    $('#' + id_proceso_ddl_editar_proceso).empty();
    var select = document.getElementById(id_proceso_ddl_editar_proceso);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" + obra).once('value').then(function(snapshot){
        snapshot.child('procesos').forEach(function(childSnap){
            var proc = childSnap.val();
            if(!proc.terminado){
                var option2 = document.createElement('OPTION');
                option2.text = proc.clave;
                option2.value = proc.clave;
                select.appendChild(option2);
            }
        });
        var fechas = snapshot.child("fechas").val();
        f_i_obra_anterior = fechas.fecha_inicio_teorica;//AQUI checar para que las uso y si es teorica lo correcto
        f_f_obra_anterior = fechas.fecha_final_teorica;//AQUI checar para que las uso y si es teorica lo correcto

        var date_i = new Date(f_i_obra_anterior)
        var date_f = new Date(f_f_obra_anterior)
        
        var f_i_string = (date_i.getMonth() + 1) + "." + date_i.getDate() + "." + date_i.getFullYear();
        $("#" + id_fecha_inicio_editar_proceso).val(f_i_string)

        var f_f_string = (date_f.getMonth() + 1) + "." + date_f.getDate() + "." + date_f.getFullYear();
        $("#" + id_fecha_final_editar_proceso).val(f_f_string)

    });
});

$("#" + id_proceso_ddl_editar_proceso).change(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();
    $('#' + id_datos_editar_proceso).removeClass("hidden");
    $('#' + id_subproceso_ddl_editar_proceso).empty();
    var select = document.getElementById(id_subproceso_ddl_editar_proceso);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc).orderByKey().once('value').then(function(snapshot){
        var proc = snapshot.val();
        if(proc != null && !proc.terminado && proc.num_subprocesos > 0){
            $('#' + id_sub_group_editar_proceso).removeClass("hidden");
            snapshot.child("subprocesos").forEach(function(childSnap){
                var sp = childSnap.val();
                var option2 = document.createElement('OPTION');
                option2.text = sp.clave;
                option2.value = sp.clave;
                select.appendChild(option2);
            });
        } else {
            $('#' + id_sub_group_editar_proceso).addClass("hidden");
        }

        var nom = proc.nombre ? proc.nombre : "";

        $('#' + id_nombre_editar_proceso).val(nom);
        $('#' + id_alcance_editar_proceso).val(proc.alcance);
        f_i_proc_anterior = proc.fecha_inicio;
        f_f_proc_anterior = proc.fecha_final;
        
        var date_i = new Date(f_i_proc_anterior)
        var date_f = new Date(f_f_proc_anterior)

        var f_i_string = (date_i.getMonth() + 1) + "." + date_i.getDate() + "." + date_i.getFullYear();
        $("#" + id_fecha_inicio_editar_proceso).val(f_i_string)

        var f_f_string = (date_f.getMonth() + 1) + "." + date_f.getDate() + "." + date_f.getFullYear();
        $("#" + id_fecha_final_editar_proceso).val(f_f_string)

    });
});

$("#" + id_subproceso_ddl_editar_proceso).change(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();
    var subproc = $('#' + id_subproceso_ddl_editar_proceso + " option:selected").text();

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc).once('value').then(function(snapshot){
        var subproc = snapshot.val();
        var nom = subproc.nombre ? subproc.nombre : "";
        
        $('#' + id_nombre_editar_proceso).val(nom);
        $('#' + id_alcance_editar_proceso).val(subproc.alcance);

        var date_i = new Date(subproc.fecha_inicio)
        var date_f = new Date(subproc.fecha_final)

        var f_i_string = (date_i.getMonth() + 1) + "." + date_i.getDate() + "." + date_i.getFullYear();
        $("#" + id_fecha_inicio_editar_proceso).val(f_i_string)

        var f_f_string = (date_f.getMonth() + 1) + "." + date_f.getDate() + "." + date_f.getFullYear();
        $("#" + id_fecha_final_editar_proceso).val(f_f_string)
    });
});

$('#' + id_actualizar_button_editar_proceso).click(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();
    var f_i = new Date($('#' + id_fecha_inicio_editar_proceso).val()).getTime();
    var f_f = new Date($('#' + id_fecha_final_editar_proceso).val()).getTime();
    var nom = $('#' + id_nombre_editar_proceso).val();
    var alc = $('#' + id_alcance_editar_proceso).val();
    if(proc == ""){
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);

        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/PC00/fecha_inicio").set(f_i);
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/fecha_final").set(f_f);
    } else { 
        var subproc = $('#' + id_subproceso_ddl_editar_proceso + " option:selected").text();
        if(subproc == ""){
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/nombre").set(nom);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/alcance").set(alc);

            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fecha_inicio").set(f_i);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fecha_final").set(f_f);
        } else {
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc + "/nombre").set(nom);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc + "/alcance").set(alc);

            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc + "/fecha_inicio").set(f_i);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc + "/fecha_final").set(f_f);

            if(f_i < f_i_proc_anterior){
                firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fecha_inicio").set(f_i);
            }
            if(f_f > f_f_proc_anterior){
                firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fecha_final").set(f_f);
            }            
        }
        if(f_i < f_i_obra_anterior){
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);

            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/PC00/fecha_inicio").set(f_i);
        }
        if(f_f > f_f_obra_anterior){
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);

            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/fecha_final").set(f_f);
        }
    }
    alert("Edición exitosa!")
});