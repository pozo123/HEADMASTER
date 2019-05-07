var id_colaborador_ddl_areas = "colaboradorDdlAreas";
var id_guardar_button_areas = "guardarAreas";
var rama_bd_personal = "personal";

var id_proyectos_checkbox_area = "checkProyectosArea";
var id_produccion_checkbox_area = "checkProduccionArea";
var id_compras_checkbox_area = "checkComprasArea";
var id_admin_checkbox_area = "checkAdminArea";
var id_rrhh_checkbox_area = "checkRRHHArea";

$('#tabAreas').click(function(){
    var select = document.getElementById(id_colaborador_ddl_areas);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_personal).orderByChild('nombre').on('child_added',function(snapshot){
        var persona = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = persona.nombre; 
        select.appendChild(option2);
    });   
});

$("#" + id_colaborador_ddl_areas).change(function(){
    loadCheckboxesAreas();
});

function loadCheckboxesAreas(){
    firebase.database().ref(rama_bd_personal).orderByChild("nombre").equalTo($('#' + id_colaborador_ddl_areas + " option:selected").val()).once("child_added").then(function(snapshot){
        var areas = snapshot.val().areas;
        
        if(areas.proyectos === true)
            $('#' + id_proyectos_checkbox_area).bootstrapToggle('on');
        else
            $('#' + id_proyectos_checkbox_area).bootstrapToggle('off');
        
        if(areas.produccion === true)
            $('#' + id_produccion_checkbox_area).bootstrapToggle('on');
        else
            $('#' + id_produccion_checkbox_area).bootstrapToggle('off');
        
        if(areas.compras === true)
            $('#' + id_compras_checkbox_area).bootstrapToggle('on');
        else
            $('#' + id_compras_checkbox_area).bootstrapToggle('off');

        if(areas.administracion === true)
            $('#' + id_admin_checkbox_area).bootstrapToggle('on');
        else
            $('#' + id_admin_checkbox_area).bootstrapToggle('off');

        if(areas.rrhh === true)
            $('#' + id_rrhh_checkbox_area).bootstrapToggle('on');
        else
            $('#' + id_rrhh_checkbox_area).bootstrapToggle('off');
    });
};

$('#' + id_guardar_button_areas).click(function () {
    var areas = {
        proyectos: $('#' + id_proyectos_checkbox_area).prop('checked'),
        produccion: $('#' + id_produccion_checkbox_area).prop('checked'),
        compras: $('#' + id_compras_checkbox_area).prop('checked'),
        administracion: $('#' + id_admin_checkbox_area).prop('checked'),
        rrhh: $('#' + id_rrhh_checkbox_area).prop('checked'),
    }
https://console.firebase.google.com/u/1/project/ingenieriahead/database/ingenieriahead/data/personal/WCpLarWgMKfwGsvAdrqlqjQxy243/nickname
    firebase.database().ref(rama_bd_personal).orderByChild("nombre").equalTo($('#' + id_colaborador_ddl_areas + " option:selected").val()).once("child_added").then(function(snapshot){
        firebase.database().ref(rama_bd_personal + "/" + snapshot.val().uid + "/areas").set(areas);
    });

    alert("¡Areas actualizados!")
});