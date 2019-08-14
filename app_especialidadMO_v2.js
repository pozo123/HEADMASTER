// id's de los elementos HTML
var id_tab_especialidad_produccion = "tabEspecialidades";
var id_form_especialidad_produccion = "formEspecialidad";
var id_dataTable_especialidad_produccion = "dataTableEspecialidad";

var id_reset_especialidad_produccion = "borrarButtonEspecialidad";
var id_agregar_especialidad_produccion = "agregarButtonEspecialidad";

var id_clave_especialidad_produccion= "claveEspecialidad";
var id_nombre_especialidad_produccion = "nombreEspecialidad";

// Variables globales

var existe_especialidad= false;
var id_especialidad_existente = "";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los colaboradores

$('#' + id_tab_especialidad_produccion).click(function() {
    resetFormEspecialidad();  
    actualizarTablaEspecialidad();      
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_especialidad_produccion).click(function(){
    resetFormEspecialidad();
})

$('#' + id_agregar_especialidad_produccion).click(function(){
    if(!validateEspecialidad()){
        return;
    }
    if (existe_especialidad){
        firebase.database().ref(rama_bd_datos_referencia + "/especialidades/" + id_especialidad_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var especialidad_update = {};
            especialidad_update["especialidades/" + id_especialidad_existente + "/clave"] = $('#' + id_clave_especialidad_produccion).val();
            especialidad_update["especialidades/" + id_especialidad_existente + "/nombre"] = $('#' + id_nombre_especialidad_produccion).val();
            firebase.database().ref(rama_bd_datos_referencia).update(especialidad_update);

            // pda
            pda("modificacion", rama_bd_datos_referencia + "/especialidades/" + id_especialidad_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormEspecialidad();
        });
    } else {
        firebase.database().ref(rama_bd_datos_referencia + "/especialidades").push(datosEspecialidad()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_datos_referencia + "/especialidades/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormEspecialidad();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_clave_especialidad_produccion).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_nombre_especialidad_produccion).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_clave_especialidad_produccion).change(function(){
    $('#' + id_clave_especialidad_produccion).val($('#' + id_clave_especialidad_produccion).val().toUpperCase());
});

$('#' + id_nombre_especialidad_produccion).change(function(){
    var nombre_array = deleteBlankSpaces(id_nombre_especialidad_produccion).split(" ");
    var nombre = "";
    for(var i=0; i<nombre_array.length; i++){
        if(i>0){
            nombre += " ";
        }
        nombre += nombre_array[i].charAt(0).toUpperCase() + nombre_array[i].slice(1).toLowerCase();
    }
    $('#' + id_nombre_especialidad_produccion).val(nombre);
});

$('#' + id_clave_especialidad_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 $('#' + id_nombre_especialidad_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 // ----------------------- FUNCIONES NECESARIAS ----------------------------

 function resetFormEspecialidad(){
    $('#' + id_form_especialidad_produccion).trigger("reset");
    existe_especialidad = false;
 };

 function validateEspecialidad(){
    if ($('#' + id_clave_especialidad_produccion).val() == ""){
        alert("Escribe la clave de la especialidad que deseas dar de alta en el sistema. Ejemplo: IE");
        return false;
    } else if($('#' + id_nombre_especialidad_produccion).val() == ""){
        alert("Escribe el nombre de la especialidad que deseas dar de alta en el sistema. Ejemplo: Instalación Eléctrica");
        return false;
    } else {
        return true;
    };
 };

 function actualizarTablaEspecialidad(){
    firebase.database().ref(rama_bd_datos_referencia + "/especialidades").on("value", function(snapshot){
        var datosEspecialidad = [];
        snapshot.forEach(function(especialidadSnap){
            var especialidad = especialidadSnap.val();
            var especialidad_id = especialidadSnap.key;
            var especialidad_clave = especialidad.clave;
            var especialidad_nombre = especialidad.nombre;

            datosEspecialidad.push([
                especialidad_id,
                especialidad_clave,
                especialidad_nombre
            ]);
        });
        tabla_especialidad = $('#'+ id_dataTable_especialidad_produccion).DataTable({
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
        $('#' + id_dataTable_especialidad_produccion + ' tbody').on( 'click', '.editar', function () {
            highLightAllEspecialidad();
            var data = tabla_especialidad.row( $(this).parents('tr') ).data();
            resetFormEspecialidad();
            existe_especialidad = true;
            id_especialidad_existente = data[0];
               
            $('#' + id_clave_especialidad_produccion).val(data[1]);
            $('#' + id_nombre_especialidad_produccion).val(data[2]);
        });
    });
 };

 function datosEspecialidad(){
    var especialidad = {
            clave: $('#' + id_clave_especialidad_produccion).val(),
            nombre: $('#' + id_nombre_especialidad_produccion).val(),
    }
    return especialidad;
 }

 function highLightAllEspecialidad(){
    highLight(id_clave_especialidad_produccion);
    highLight(id_nombre_especialidad_produccion);
 }

