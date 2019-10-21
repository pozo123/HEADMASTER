// id's de los elementos HTML
var id_tab_actividad_score = "tabActividadScore";
var id_form_actividad_score = "formActividadesScore";
var id_dataTable_actividad_score = "dataTableActividadScore";

var id_reset_actividad_score = "borrarButtonActividadScore";
var id_agregar_actividad_score = "agregarButtonActividadScore";

var id_nombre_actividad_score = "nombreActividadScore";

// Variables globales

var existe_actividad_score = false;
var id_actividad_score_existente = "";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)

$('#' + id_tab_actividad_score).click(function() {
    resetFormActividadScore();  
    actualizarTablaActividadScore();      
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_actividad_score).click(function(){
    resetFormActividadScore();
})

$('#' + id_agregar_actividad_score).click(function(){
    console.log("as")
    if(!validateActividadScore()){
        return;
    }
    if (existe_actividad_score){
        firebase.database().ref(rama_bd_datos_referencia + "/actividades_score/" + id_actividad_score_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var actividad_update = {};
            actividad_update["actividades_score/" + id_actividad_score_existente + "/nombre"] = $('#' + id_nombre_actividad_score).val();
            firebase.database().ref(rama_bd_datos_referencia).update(actividad_update);

            // pda
            pda("modificacion", rama_bd_datos_referencia + "/actividades_score/" + id_actividad_score_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormEspecialidad();
        });
    } else {
        firebase.database().ref(rama_bd_datos_referencia + "/actividades_score").push(datosEspecialidad()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_datos_referencia + "/actividades_score/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormEspecialidad();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_nombre_actividad_score).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ.,",e);
});

$('#' + id_nombre_actividad_score).change(function(){
    var aux = deleteBlankSpaces(id_nombre_actividad_score);
    var actividad = "";
    actividad += aux.charAt(0).toUpperCase() + aux.slice(1).toLowerCase();
    $('#' + id_nombre_actividad_score).val(actividad);
});

 $('#' + id_nombre_actividad_score).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 // ----------------------- FUNCIONES NECESARIAS ----------------------------

 function resetFormActividadScore(){
    $('#' + id_form_actividad_score).trigger("reset");
    existe_actividad_score = false;
 };

 function validateActividadScore(){
    if($('#' + id_nombre_actividad_score).val() == ""){
        alert("Escribe la actividad para SCORE que deseas dar de alta en el sistema. Ejemplo: cuantificaciones");
        return false;
    } else {
        return true;
    };
 };

 function actualizarTablaActividadScore(){
    firebase.database().ref(rama_bd_datos_referencia + "/especialidades").on("value", function(snapshot){
        var datosEspecialidad = [];
        snapshot.forEach(function(especialidadSnap){
            var especialidad = especialidadSnap.val();
            var especialidad_id = especialidadSnap.key;
            var especialidad_nombre = especialidad.nombre;

            datosEspecialidad.push([
                especialidad_id,
                especialidad_nombre
            ]);
        });
        tabla_actividad_score = $('#'+ id_dataTable_actividad_score).DataTable({
            destroy: true,
            data: datosEspecialidad,
            language: idioma_espanol,
            "columnDefs": [
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                {
                    targets: -1,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0},
              ]
        });
        $('#' + id_dataTable_actividad_score + ' tbody').on( 'click', '.editar', function () {
            highLightAllActividadScore();
            var data = tabla_actividad_score.row( $(this).parents('tr') ).data();
            resetFormActividadScore();
            existe_actividad_score = true;
            id_actividad_score_existente = data[0];
               
            $('#' + id_nombre_actividad_score).val(data[2]);
        });
    });
 };

 function datosEspecialidad(){
    var especialidad = {
            nombre: $('#' + id_nombre_actividad_score).val(),
    }
    return especialidad;
 }

 function highLightAllActividadScore(){
    highLight(id_nombre_actividad_score);
 }

