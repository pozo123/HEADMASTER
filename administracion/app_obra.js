var id_nombre_obra = "obraNombre";
var id_clave_obra = "obraClave";
var id_cliente_ddl_obra = "cliente";
var id_direccion_calle_obra = "calleObra";
var id_direccion_num_obra = "numObra";
var id_direccion_colonia_obra = "coloniaObra";
var id_direccion_delegacion_obra = "delegacionObra";
var id_direccion_ciudad_obra = "ciudadObra";
var id_direccion_cp_obra = "cpObra";
var id_registrar_button_obra = "registrarObra";
var id_supervisor_ddl_obra = "supervisorDdlObra";
var id_fecha_inicio_obra = "fechaInicioObra";
var id_fecha_final_obra = "fechaFinalObra";


var rama_bd_obras = "obras";
var rama_bd_clientes = "clientes";
var rama_bd_personal = "personal";

var procesos = {};
//Kaiz en funciones

$('#tabAltaObra').click(function(){
    $('#' + id_cliente_ddl_obra).empty();

    jQuery('#' + id_fecha_inicio_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_cliente_ddl_obra);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var cliente = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = option2.value = cliente.nombre;
        select.appendChild(option2);
    });

    var select2 = document.getElementById(id_supervisor_ddl_obra) ;
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select2.appendChild(option3);

    //aqui
    for(key in json_personal){
        if(json_personal[key].areas.produccion){
            var option4 = document.createElement('OPTION');
            option4.text = json_personal[key].nombre;
            option4.value = key;
            select2.appendChild(option4);
        }
    }   
});

$('#' + id_registrar_button_obra).click(function () {
    if(!$('#' + id_nombre_obra).val()|| !$('#' + id_clave_obra).val() || $('#' + id_cliente_ddl_obra + " option:selected").val() === ""){
        alert("Llena todos los campos requeridos");
    } else {   
        var f_i = new Date($('#' + id_fecha_inicio_obra).val()).getTime();
        var f_f = new Date($('#' + id_fecha_final_obra).val()).getTime();
        var fech = {
            fecha_inicio_real: 0,
            fecha_inicio_teorica: f_i,
            fecha_final_real: 0,
            fecha_final_teorica: f_f,
        }
        procesos["MISC"] = {
            terminado: false,
            alcance: "MISCELANEOS",
            nombre: "MISCELANEOS",
            clave: "MISC",
            tipo: "miscelaneo",    
            fecha_inicio: f_i,
            fecha_final: f_f,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
            SCORE: "",
        };
        var subp = {};
        subp["PC00-MISC"] = {
            terminado: false,
            nombre: "Miescelaneos preproyecto",
            alcance: "Miscelaneos preproyecto",
            clave: "PC00-MISC",
            SCORE: "",
            categoria: "MISCELANEO",
            kaizen: kaiz,
            fecha_inicio: f_i,
            fecha_final: f_f,
            presupuesto: "",
        }
        procesos["PC00"] = {
            terminado: false,
            alcance: "TRABAJO PREVIO A FIRMAR CONTRATO",
            nombre: "PREPROYECTO",
            clave: "PC00",
            tipo: "proyecto",
            fecha_inicio: f_i,
            fecha_final: f_f,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: subp,
        };
        procesos["ADIC"] = {
            terminado: false,
            alcance: "ADICIONALES",
            nombre: "ADICIONALES",
            clave: "ADIC",
            tipo: "adicional",
            fecha_inicio: f_i,
            fecha_final: f_f,
            kaizen: kaiz,
            num_subprocesos: 0,
            subprocesos: "",
        };

        var obra_mag = {      
            nombre: $('#' + id_nombre_obra).val(),
            cliente: $('#' + id_cliente_ddl_obra + " option:selected").text(),
            clave: $('#' + id_clave_obra).val(),
            num_procesos: 0,
            terminada: false,
            direccion: {
                calle: $('#' + id_direccion_calle_obra).val(),
                numero: $('#' + id_direccion_num_obra).val(),
                colonia: $('#' + id_direccion_colonia_obra).val(),
                delegacion: $('#' + id_direccion_delegacion_obra).val(),
                ciudad: $('#' + id_direccion_ciudad_obra).val(),
                cp: $('#' + id_direccion_cp_obra).val(),
            },
            utilidad_semanal: 0,
            procesos: procesos,
            fechas: fech,
            kaizen: kaiz,
        }

        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra).val()).set(obra_mag);
        
        var superv = {
            nombre: $('#' + id_supervisor_ddl_obra + " option:selected").text(),
            activo: true,
        };

        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra).val() + "/supervisor/" + $('#' + id_supervisor_ddl_obra + " option:selected").val()).set(superv);

        alert("¡Alta exitosa!");
                
    }
});