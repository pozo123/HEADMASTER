var id_colaborador_ddl_permisos = "DDLcolaborador";
//var id_clase_checkbox_permisos = "claseCheck";
var id_guardar_button_permisos = "guardadPermisos";
var rama_bd_inges = "proyectos/inges";

var id_alta_colaborador_checkbox_permisos = "checkColaborador";
var id_alta_obra_checkbox_permisos = "checkObra";
var id_alta_cliente_checkbox_permisos = "checkCliente";
var id_reporte_checkbox_permisos = "checkReporte";
var id_perfil_checkbox_permisos = "checkPerfil";
var id_activar_checkbox_permisos = "checkActivar";
var id_alta_exc_reqs_checkbox_permisos = "checkExcReqs";
var id_alta_generos_tipos_checkbox_permisos = "checkGenerosTipos";
var id_reporte_ppto_checkbox_permisos = "checkReportePpto";
var id_pagos_permisos = "checkPagos";

$('#tabPermisos').click(function(){
    var select = document.getElementById(id_colaborador_ddl_permisos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = inge.nombre; 
        select.appendChild(option2);
        

    });   
});

/* $(document).ready(function() {
    
    var select = document.getElementById(id_colaborador_ddl_permisos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = inge.nombre; 
        select.appendChild(option2);
        

    });
    
}); */

//Esta hay que ponerla en el onchange del ddl inges
function loadCheckboxesPermisos(){
    firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo($('#' + id_colaborador_ddl_permisos + " option:selected").val()).once("child_added").then(function(snapshot){
        var perms = snapshot.val().permisos;
        if(perms.alta_colaborador === true)
            $('#' + id_alta_colaborador_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_alta_colaborador_checkbox_permisos).bootstrapToggle('off');

        if(perms.alta_obra === true)
            $('#' + id_alta_obra_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_alta_obra_checkbox_permisos).bootstrapToggle('off');

        if(perms.alta_cliente === true)
            $('#' + id_alta_cliente_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_alta_cliente_checkbox_permisos).bootstrapToggle('off');

        if(perms.reporte === true)
            $('#' + id_reporte_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_reporte_checkbox_permisos).bootstrapToggle('off');
        if(perms.reporte_presupuestos === true)
            $('#' + id_reporte_ppto_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_reporte_ppto_checkbox_permisos).bootstrapToggle('off');

        if(perms.perfil === true)
            $('#' + id_perfil_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_perfil_checkbox_permisos).bootstrapToggle('off');
            
        if(perms.activar === true)
            $('#' + id_activar_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_activar_checkbox_permisos).bootstrapToggle('off');
        
        if(perms.alta_exc_reqs === true)
            $('#' + id_alta_exc_reqs_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_alta_exc_reqs_checkbox_permisos).bootstrapToggle('off');
        
        if(perms.alta_generos_tipos === true)
            $('#' + id_alta_generos_tipos_checkbox_permisos).bootstrapToggle('on');
        else
            $('#' + id_alta_generos_tipos_checkbox_permisos).bootstrapToggle('off');

        if(perms.pagos === true)
            $('#' + id_pagos_permisos).bootstrapToggle('on');
        else
            $('#' + id_pagos_permisos).bootstrapToggle('off');


    });
}

$('#' + id_guardar_button_permisos).click(function () {
    var perm = {
        alta_colaborador: $('#' + id_alta_colaborador_checkbox_permisos).prop('checked'),
        alta_obra: $('#' + id_alta_obra_checkbox_permisos).prop('checked'),
        alta_cliente: $('#' + id_alta_cliente_checkbox_permisos).prop('checked'),
        reporte: $('#' + id_reporte_checkbox_permisos).prop('checked'),
        reporte_presupuestos: $('#' + id_reporte_ppto_checkbox_permisos).prop('checked'),
        perfil: $('#' + id_perfil_checkbox_permisos).prop('checked'),
        activar: $('#' + id_activar_checkbox_permisos).prop('checked'),
        alta_exc_reqs: $('#' + id_alta_exc_reqs_checkbox_permisos).prop('checked'),
        alta_generos_tipos: $('#' + id_alta_generos_tipos_checkbox_permisos).prop('checked'),
        pagos: $('#' + id_pagos_permisos).prop('checked'),
    }

    
    firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo($('#' + id_colaborador_ddl_permisos + " option:selected").val()).once("child_added").then(function(snapshot){
        firebase.database().ref(rama_bd_inges + "/" + snapshot.val().uid + "/permisos").set(perm);
    });

    alert("¡Permisos actualizados!")
    location.reload();
    //Hecho con clase:
    //firebase.database().ref(rama_bd_inges + "/" + $('#' + id_colaborardor_ddl_permisos + " option:selected").val() + "/permisos/" + $(.id_clase_checkbox_permisos).val()).set($(.id_clase_checkbox_permisos).checked);
})