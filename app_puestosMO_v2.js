// id's de los elementos HTML
var id_tab_puesto_produccion = "tabPuestos";
var id_form_puesto_produccion = "formPuesto";
var id_dataTable_puesto_produccion = "dataTablePuesto";

var id_reset_puesto_produccion = "borrarButtonPuesto";
var id_agregar_puesto_produccion = "agregarButtonPuesto";

var id_puesto_puesto_produccion= "puestoPuesto";
var id_sueldo_puesto_produccion = "sueldoPuesto";

// Variables globales

var existe_puesto = false;
var id_puesto_existente = "";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los colaboradores

$('#' + id_tab_puesto_produccion).click(function() {
    resetFormPuesto();  
    actualizarTablaPuesto();      
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_puesto_produccion).click(function(){
    resetFormPuesto();
})

$('#' + id_agregar_puesto_produccion).click(function(){
    if(!validatePuesto()){
        return;
    }
    if (existe_puesto){
        firebase.database().ref(rama_bd_datos_referencia + "/puestos/" + id_puesto_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var puesto_update = {};
            puesto_update["puestos/" + id_puesto_existente + "/puesto"] = $('#' + id_puesto_puesto_produccion).val();
            puesto_update["puestos/" + id_puesto_existente+ "/sueldo"] = deformatMoney($('#' + id_sueldo_puesto_produccion).val());
            firebase.database().ref(rama_bd_datos_referencia).update(puesto_update);

            // pda
            pda("modificacion", rama_bd_datos_referencia + "/puestos/" + id_puesto_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormPuesto();
        });
    } else {
        firebase.database().ref(rama_bd_datos_referencia + "/puestos").push(datosPuesto()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_datos_referencia + "/puestos/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormPuesto();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_puesto_puesto_produccion).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});

$('#' + id_sueldo_puesto_produccion).keypress(function(e){
    charactersAllowed("$1234567890,.",e);
});

$('#' + id_puesto_puesto_produccion).change(function(){
    var puesto_array = deleteBlankSpaces(id_puesto_puesto_produccion).split(" ");
    var puesto = "";
    for(var i=0; i<puesto_array.length; i++){
        if(i>0){
            puesto += " ";
        }
        puesto += puesto_array[i].charAt(0).toUpperCase() + puesto_array[i].slice(1);
    }
    $('#' + id_puesto_puesto_produccion).val(puesto);
});

$('#' + id_sueldo_puesto_produccion).change(function(){
    var deformat_sueldo = deformatMoney($('#' + id_sueldo_puesto_produccion).val());
    $('#' + id_sueldo_puesto_produccion).val(formatMoney(deformat_sueldo));
});

$('#' + id_sueldo_puesto_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 $('#' + id_puesto_puesto_produccion).on("cut copy paste",function(e) {
    e.preventDefault();
 });

 // ----------------------- FUNCIONES NECESARIAS ----------------------------

 function resetFormPuesto(){
    $('#' + id_form_puesto_produccion).trigger("reset");
    existe_puesto = false;
 };

 function validatePuesto(){
    if ($('#' + id_puesto_puesto_produccion).val() == ""){
        alert("Escribe el puesto que deseas dar de alta en el sistema. Ejemplo: Medio Oficial");
        return false;
    } else if($('#' + id_sueldo_puesto_produccion).val() == ""){
        alert("Escribe el sueldo correspondiente al puesto que deseas dar de alta en el sistema.");
        return false;
    } else {
        return true;
    };
 };

 function actualizarTablaPuesto(){
    firebase.database().ref(rama_bd_datos_referencia + "/puestos").on("value", function(snapshot){
        var datosPuesto = [];
        snapshot.forEach(function(puestoSnap){
            var puesto = puestoSnap.val();
            var puesto_id = puestoSnap.key;
            var puesto_puesto = puesto.puesto;
            var puesto_sueldo = puesto.sueldo;

            datosPuesto.push([
                puesto_id,
                puesto_puesto,
                formatMoney(puesto_sueldo)
            ]);
        });
        tabla_puesto = $('#'+ id_dataTable_puesto_produccion).DataTable({
            destroy: true,
            data: datosPuesto,
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
        $('#' + id_dataTable_puesto_produccion + ' tbody').on( 'click', '.editar', function () {
            highLightAllPuesto();
            var data = tabla_puesto.row( $(this).parents('tr') ).data();
            resetFormPuesto();
            existe_puesto = true;
            id_puesto_existente = data[0];
               
            $('#' + id_puesto_puesto_produccion).val(data[1]);
            $('#' + id_sueldo_puesto_produccion).val(data[2]);
        });
    });
 };

 function datosPuesto(){
    var puesto = {
            puesto: $('#' + id_puesto_puesto_produccion).val(),
            sueldo: deformatMoney($('#' + id_sueldo_puesto_produccion).val()),
    }
    return puesto;
 }

 function highLightAllPuesto(){
    highLight(id_puesto_puesto_produccion);
    highLight(id_sueldo_puesto_produccion);
 }

