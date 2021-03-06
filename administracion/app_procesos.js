var id_obra_ddl_procesos = "obraDdlProcesos";
var id_subproceso_checkbox_proceso = "checkboxSubproceso";
var id_proceso_ddl_procesos = "procesoDdlProcesos";
var id_categoria_ddl_procesos = "categoriaDdlProcesos";
var id_alcance_proceso_procesos = "alcanceProcesoProcesos";
var id_fecha_inicio_procesos = "fechaInicioProcesos";
var id_fecha_final_procesos = "fechaFinalProcesos";
var id_nombre_procesos = "nombreProcesos";

var id_agregar_procesos = "agregarProcesoProcesos";

var id_grupo_subproceso = "grupoSubproceso";
var id_grupo_categoria = "grupoCategoria";

var rama_bd_obras_magico = "obras";
var rama_bd_categorias_procesos = "categorias";

//KAIZ en funciones

$('#tabAltaProceso').click(function(){
    $('#' + id_grupo_subproceso).addClass("hidden");
    $('#' + id_grupo_categoria).addClass("hidden");

    jQuery('#' + id_fecha_inicio_procesos).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_procesos).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    $('#' + id_obra_ddl_procesos).empty();
    var select = document.getElementById(id_obra_ddl_procesos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    for(key in nombre_obras){
        if(!nombre_obras[key].terminada){
            var option2 = document.createElement('OPTION');
            option2.text = key;
            option2.value = key;
            select.appendChild(option2);
        }
    }

    $('#' + id_categoria_ddl_procesos).empty();
    var select2 = document.getElementById(id_categoria_ddl_procesos);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select2.appendChild(option3);

    firebase.database().ref(rama_bd_categorias_procesos).orderByChild('nombre').on('child_added',function(snapshot){
        var cat = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = cat.nombre;
        option4.value = cat.clave;
        select2.appendChild(option4);
    });
});

$('#' + id_obra_ddl_procesos).change(function(){
    $('#' + id_grupo_subproceso).addClass("hidden");
    $('#' + id_grupo_categoria).addClass("hidden");
    $("#" + id_subproceso_checkbox_proceso).prop('checked', false);
});

$("#" + id_subproceso_checkbox_proceso).change(function(){
    if(this.checked){
        $('#' + id_proceso_ddl_procesos).empty();
        var select = document.getElementById(id_proceso_ddl_procesos);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);

        for(key in nombre_obras[$('#' + id_obra_ddl_procesos + " option:selected").text()]["procesos"]){
            var proc = nombre_obras[$('#' + id_obra_ddl_procesos + " option:selected").text()]["procesos"][key];
            if(!proc.terminado && key != "ADIC" && key != "PC00"){
                var option2 = document.createElement('OPTION');
                option2.text = key;
                option2.value = key;
                select.appendChild(option2);
            }
        }
        $('#' + id_grupo_subproceso).removeClass("hidden");
    } else {
        $('#' + id_grupo_subproceso).addClass("hidden");
    }
});

$('#' + id_proceso_ddl_procesos).change(function(){
    if($('#' + id_proceso_ddl_procesos + " option:selected").val() == "ADIC"){
        $('#' + id_grupo_categoria).addClass("hidden");
    } else {
        $('#' + id_grupo_categoria).removeClass("hidden");
    }
});

$('#' + id_agregar_procesos).click(function() {
    if($('#' + id_nombre_procesos).val() == "" ||$('#' + id_fecha_inicio_procesos).val() === "" || $('#' + id_fecha_final_procesos).val() === "" || (($("#" + id_subproceso_checkbox_proceso).checked == true) && ($('#' + id_categoria_ddl_procesos + " option:selected").val() === "" || $('#' + id_proceso_ddl_procesos + " option:selected").val() === "")) || $('#' + id_obra_ddl_procesos + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {
        var f_i = new Date($('#' + id_fecha_inicio_procesos).val()).getTime();
        var f_f = new Date($('#' + id_fecha_final_procesos).val()).getTime();
        if(f_f < f_i){
            alert("La fecha final debe ser posterior a la fecha inicial");
        } else {
            var cl;
            // forma de checkar si un checkbox está checked
            if($("#" + id_subproceso_checkbox_proceso).is(":checked")){
                var num_sub = nombre_obras[$('#' + id_obra_ddl_procesos + " option:selected").text()]["procesos"][$('#' + id_proceso_ddl_procesos + " option:selected").val()].num_subprocesos + 1;
                if($('#' + id_proceso_ddl_procesos + " option:selected").val() != "ADIC"){
                    cl = $('#' + id_proceso_ddl_procesos + " option:selected").val() + "-" + $('#' + id_categoria_ddl_procesos + " option:selected").val() + ("0" + num_sub).slice(-2);
                } else {
                    cl = $('#' + id_proceso_ddl_procesos + " option:selected").val() + "-" + ("00" + num_sub).slice(-3);
                }
                var subproceso = {
                    nombre: $('#' + id_nombre_procesos).val(),
                    clave: cl,
                    categoria: $('#' + id_categoria_ddl_procesos + " option:selected").text(),
                    fecha_inicio: f_i,
                    fecha_final: f_f,
                    kaizen: kaiz,
                    alcance: $('#' + id_alcance_proceso_procesos).val(),
                    SCORE: {
                        total_prog: "",
                        total_trabajado: "",
                        programado: false,
                        inges: "",
                    }
                }
                firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + $('#' + id_proceso_ddl_procesos + " option:selected").val() + "/subprocesos/" + cl).set(subproceso);
                firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text() + "/procesos/" + $('#' + id_proceso_ddl_procesos + " option:selected").val() + "/num_subprocesos").set(num_sub);
                $('#' + id_nombre_procesos).val("");
                $('#' + id_alcance_proceso_procesos).val("");
            } else {
                console.log(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text())
                firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_procesos + " option:selected").text()).once('value').then(function(snapshot){
                    var obra = snapshot.val();
                    var num_proc = obra.num_procesos + 1;
                    cl = "PC" + ("0" + num_proc).slice(-2);
                    var proceso = {
                        nombre: $('#' + id_nombre_procesos).val(),
                        tipo: "continuo",
                        clave: cl,
                        fecha_inicio: f_i,
                        fecha_final: f_f,
                        num_subprocesos: 0,
                        subprocesos: "",
                        kaizen: kaiz,
                        alcance: $('#' + id_alcance_proceso_procesos).val(),
                    }
                    firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + cl).set(proceso);
                    firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/num_procesos").set(num_proc);
                    if(f_f > obra.fechas.fecha_final_real){
                        firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/fechas/fecha_final_real").set(f_f);
                        firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/MISC/fecha_final").set(f_f);
                    }
                    if(f_i < obra.fechas.fecha_inicio_real){
                        firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/fechas/fecha_inicio_real").set(f_i);
                        firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/PC00/fecha_inicio").set(f_i);
                    }
                    $('#' + id_nombre_procesos).val("");
                    $('#' + id_alcance_proceso_procesos).val("");
                });
            }
        }
        alert("alta exitosa!")
    }
});