// id's de los elementos HTML
var id_tab_especialidad_produccion = "tabEspecialidades";
var id_form_especialidad_produccion = "formEspecialidad";
var id_dataTable_especialidad_produccion = "dataTableEspecialidad";

var id_reset_especialidad_produccion = "borrarButtonEspecialidad";
var id_agregar_especialidad_produccion = "agregarButtonEspecialidad";

var id_clave_especialidad_produccion= "EspecialidadEspecialidad";
var id_nombre_especialidad_produccion = "sueldoEspecialidad";

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
        firebase.database().ref(rama_bd_datos_referencia + "/Especialidads/" + id_Especialidad_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var Especialidad_update = {};
            Especialidad_update["Especialidads/" + id_Especialidad_existente + "/Especialidad"] = $('#' + id_Especialidad_Especialidad_produccion).val();
            Especialidad_update["Especialidads/" + id_Especialidad_existente+ "/sueldo"] = deformatMoney($('#' + id_sueldo_Especialidad_produccion).val());
            firebase.database().ref(rama_bd_datos_referencia).update(Especialidad_update);

            // pda
            pda("modificacion", rama_bd_datos_referencia + "/Especialidads/" + id_Especialidad_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormEspecialidad();
        });
    } else {
        firebase.database().ref(rama_bd_datos_referencia + "/Especialidads").push(datosEspecialidad()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_datos_referencia + "/Especialidads/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormEspecialidad();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_Especialidad_Especialidad_produccion).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_sueldo_Especialidad_produccion).keypress(function(e){
    charactersAllowed("$1234567890,.",e);
});

$('#' + id_Especialidad_Especialidad_produccion).change(function(){
    var Especialidad_array = deleteBlankSpaces(id_Especialidad_Especialidad_produccion).split(" ");
    var Especialidad = "";
    for(var i=0; i<Especialidad_array.length; i++){
        if(i>0){
            Especialidad += " ";
        }
        Especialidad += Especialidad_array[i].charAt(0).toUpperCase() + Especialidad_array[i].slice(1);
    }
    $('#' + id_Especialidad_Especialidad_produccion).val(Especialidad);
});

$('#' + id_sueldo_Especialidad_produccion).change(function(){
    var deformat_sueldo = deformatMoney($('#' + id_sueldo_Especialidad_produccion).val());
    $('#' + id_sueldo_Especialidad_produccion).val(formatMoney(deformat_sueldo));
});

$('#' + id_sueldo_Especialidad_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 $('#' + id_Especialidad_Especialidad_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 // ----------------------- FUNCIONES NECESARIAS ----------------------------

 function resetFormEspecialidad(){
    $('#' + id_form_Especialidad_produccion).trigger("reset");
    existe_Especialidad = false;
 };

 function validateEspecialidad(){
    if ($('#' + id_Especialidad_Especialidad_produccion).val() == ""){
        alert("Escribe el Especialidad que deseas dar de alta en el sistema. Ejemplo: Medio Oficial");
        return false;
    } else if($('#' + id_sueldo_Especialidad_produccion).val() == ""){
        alert("Escribe el sueldo correspondiente al Especialidad que deseas dar de alta en el sistema.");
        return false;
    } else {
        return true;
    };
 };

 function actualizarTablaEspecialidad(){
    firebase.database().ref(rama_bd_datos_referencia + "/Especialidads").on("value", function(snapshot){
        var datosEspecialidad = [];
        snapshot.forEach(function(EspecialidadSnap){
            var Especialidad = EspecialidadSnap.val();
            var Especialidad_id = EspecialidadSnap.key;
            var Especialidad_Especialidad = Especialidad.Especialidad;
            var Especialidad_sueldo = Especialidad.sueldo;

            datosEspecialidad.push([
                Especialidad_id,
                Especialidad_Especialidad,
                formatMoney(Especialidad_sueldo)
            ]);
        });
        tabla_Especialidad = $('#'+ id_dataTable_Especialidad_produccion).DataTable({
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
        $('#' + id_dataTable_Especialidad_produccion + ' tbody').on( 'click', '.editar', function () {
            highLightAllEspecialidad();
            var data = tabla_Especialidad.row( $(this).parents('tr') ).data();
            resetFormEspecialidad();
            existe_Especialidad = true;
            id_Especialidad_existente = data[0];
               
            $('#' + id_Especialidad_Especialidad_produccion).val(data[1]);
            $('#' + id_sueldo_Especialidad_produccion).val(data[2]);
        });
    });
 };

 function datosEspecialidad(){
    var Especialidad = {
            Especialidad: $('#' + id_Especialidad_Especialidad_produccion).val(),
            sueldo: deformatMoney($('#' + id_sueldo_Especialidad_produccion).val()),
    }
    return Especialidad;
 }

 function highLightAllEspecialidad(){
    highLight(id_especialidad_especialidad_produccion);
    highLight(id_sueldo_Especialidad_produccion);
 }

